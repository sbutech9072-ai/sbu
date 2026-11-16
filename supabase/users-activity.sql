-- ==============================================================================
-- SBU TECH — SITE USERS, AUTHENTICATION & ENGAGEMENT ACTIVITY SCHEMA
-- File: supabase/users-activity.sql
-- ==============================================================================
-- IMPORTANT:
-- Run this SQL in your Supabase SQL Editor manually.
-- Never run migrations automatically from agent environments.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE: public.site_users
-- ------------------------------------------------------------------------------
create table if not exists public.site_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  country text,
  whatsapp text,
  avatar_url text,
  providers text[] not null default '{}',
  created_at timestamptz default now(),
  last_login_at timestamptz,
  last_seen_at timestamptz,
  login_count int not null default 0
);

create unique index if not exists site_users_lower_email_idx on public.site_users (lower(email));

-- ------------------------------------------------------------------------------
-- 2. TRIGGER FUNCTIONS: Synchronize auth.users -> public.site_users
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_provider text;
  v_providers text[];
begin
  -- Extract primary provider from raw_app_meta_data
  v_provider := coalesce(new.raw_app_meta_data->>'provider', 'email');
  if v_provider = 'email' then
    v_provider := 'password';
  end if;

  -- Extract providers array if available
  if new.raw_app_meta_data ? 'providers' then
    select array_agg(case when elem::text = '"email"' then 'password' else trim(both '"' from elem::text) end)
    into v_providers
    from jsonb_array_elements(new.raw_app_meta_data->'providers') as elem;
  else
    v_providers := array[v_provider];
  end if;

  insert into public.site_users (
    id,
    email,
    full_name,
    country,
    whatsapp,
    avatar_url,
    providers,
    created_at
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'whatsapp',
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    coalesce(v_providers, array[v_provider]),
    coalesce(new.created_at, now())
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Drop trigger if exists to prevent duplicates
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger on user update (e.g. account linking Google to password)
create or replace function public.handle_update_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_providers text[];
begin
  if new.raw_app_meta_data ? 'providers' then
    select array_agg(case when elem::text = '"email"' then 'password' else trim(both '"' from elem::text) end)
    into v_providers
    from jsonb_array_elements(new.raw_app_meta_data->'providers') as elem;

    update public.site_users
    set
      providers = coalesce(v_providers, site_users.providers),
      avatar_url = coalesce(site_users.avatar_url, new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
      full_name = coalesce(site_users.full_name, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
    where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function public.handle_update_user();

-- ------------------------------------------------------------------------------
-- 3. TABLE: public.login_events
-- ------------------------------------------------------------------------------
create table if not exists public.login_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.site_users(id) on delete cascade,
  email text not null,
  provider text not null check (provider in ('google', 'password')),
  event text not null check (event in ('login', 'logout')),
  auth_session_id text,
  created_at timestamptz default now(),
  country text,
  device text
);

create unique index if not exists login_events_unique_auth_session_idx
  on public.login_events (user_id, auth_session_id, event)
  where auth_session_id is not null;

create index if not exists login_events_created_at_idx
  on public.login_events (created_at desc);

create index if not exists login_events_user_id_idx
  on public.login_events (user_id);

-- ------------------------------------------------------------------------------
-- 4. TABLE: public.visit_sessions
-- ------------------------------------------------------------------------------
create table if not exists public.visit_sessions (
  id uuid primary key,
  visitor_id text not null,
  user_id uuid null references public.site_users(id) on delete set null,
  started_at timestamptz default now(),
  last_seen_at timestamptz default now(),
  active_seconds int not null default 0,
  landing_path text,
  country text,
  device text,
  is_bot boolean default false
);

create index if not exists visit_sessions_last_seen_at_idx
  on public.visit_sessions (last_seen_at desc);

create index if not exists visit_sessions_user_id_idx
  on public.visit_sessions (user_id);

create index if not exists visit_sessions_visitor_id_idx
  on public.visit_sessions (visitor_id);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
alter table public.site_users enable row level security;
alter table public.login_events enable row level security;
alter table public.visit_sessions enable row level security;

-- No public policies created: all modifications occur via SECURITY DEFINER functions
-- and queries by service_role (Cloudflare Worker backend).

-- ------------------------------------------------------------------------------
-- 6. RPC FUNCTIONS
-- ------------------------------------------------------------------------------

-- 6.1 record_login
create or replace function public.record_login(
  p_user uuid,
  p_email text,
  p_provider text,
  p_auth_session text,
  p_country text,
  p_device text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted_id bigint;
begin
  -- Validate provider
  if p_provider not in ('google', 'password') then
    p_provider := 'password';
  end if;

  -- Insert login event (deduped by unique index)
  insert into public.login_events (
    user_id,
    email,
    provider,
    event,
    auth_session_id,
    created_at,
    country,
    device
  ) values (
    p_user,
    p_email,
    p_provider,
    'login',
    p_auth_session,
    now(),
    p_country,
    p_device
  )
  on conflict (user_id, auth_session_id, event) where auth_session_id is not null
  do nothing
  returning id into v_inserted_id;

  -- Only if the login event was genuinely inserted (not a duplicate refresh/reload)
  if v_inserted_id is not null then
    update public.site_users
    set
      last_login_at = now(),
      last_seen_at = now(),
      login_count = login_count + 1
    where id = p_user;
  end if;
end;
$$;

-- 6.2 record_heartbeat
create or replace function public.record_heartbeat(
  p_session uuid,
  p_visitor text,
  p_user uuid,
  p_path text,
  p_country text,
  p_device text,
  p_bot boolean,
  p_delta int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capped_delta int;
begin
  -- Cap heartbeat delta between 0 and 35 seconds to prevent tampering
  v_capped_delta := least(greatest(coalesce(p_delta, 0), 0), 35);

  insert into public.visit_sessions (
    id,
    visitor_id,
    user_id,
    started_at,
    last_seen_at,
    active_seconds,
    landing_path,
    country,
    device,
    is_bot
  ) values (
    p_session,
    p_visitor,
    p_user,
    now(),
    now(),
    v_capped_delta,
    p_path,
    p_country,
    p_device,
    coalesce(p_bot, false)
  )
  on conflict (id) do update set
    active_seconds = public.visit_sessions.active_seconds + v_capped_delta,
    last_seen_at = now(),
    user_id = coalesce(public.visit_sessions.user_id, excluded.user_id);

  if p_user is not null then
    update public.site_users
    set last_seen_at = now()
    where id = p_user;
  end if;
end;
$$;

-- 6.3 admin_users_overview
create or replace function public.admin_users_overview()
returns table (
  id uuid,
  email text,
  full_name text,
  country text,
  whatsapp text,
  avatar_url text,
  providers text[],
  created_at timestamptz,
  last_login_at timestamptz,
  last_seen_at timestamptz,
  login_count int,
  total_active_seconds bigint,
  sessions_count bigint,
  online_now boolean
)
language sql
security definer
set search_path = public
as $$
  select
    u.id,
    u.email,
    u.full_name,
    u.country,
    u.whatsapp,
    u.avatar_url,
    u.providers,
    u.created_at,
    u.last_login_at,
    u.last_seen_at,
    u.login_count,
    coalesce(sum(s.active_seconds), 0)::bigint as total_active_seconds,
    count(s.id)::bigint as sessions_count,
    coalesce(u.last_seen_at > (now() - interval '2 minutes'), false) as online_now
  from public.site_users u
  left join public.visit_sessions s on s.user_id = u.id
  group by u.id
  order by u.last_seen_at desc nulls last;
$$;

-- 6.4 admin_user_detail
create or replace function public.admin_user_detail(p_user uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_logins json;
  v_sessions json;
begin
  select coalesce(json_agg(l), '[]'::json)
  into v_logins
  from (
    select
      id,
      provider,
      event,
      auth_session_id,
      created_at,
      country,
      device
    from public.login_events
    where user_id = p_user
    order by created_at desc
    limit 20
  ) l;

  select coalesce(json_agg(s), '[]'::json)
  into v_sessions
  from (
    select
      id,
      started_at,
      last_seen_at,
      active_seconds,
      landing_path,
      country,
      device
    from public.visit_sessions
    where user_id = p_user
    order by last_seen_at desc
    limit 20
  ) s;

  return json_build_object(
    'logins', v_logins,
    'sessions', v_sessions
  );
end;
$$;

-- 6.5 admin_active_now
create or replace function public.admin_active_now()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total', coalesce(count(*), 0),
    'logged_in', coalesce(count(*) filter (where user_id is not null), 0)
  )
  from public.visit_sessions
  where last_seen_at > (now() - interval '2 minutes')
    and coalesce(is_bot, false) = false;
$$;

-- ------------------------------------------------------------------------------
-- 7. SECURITY PERMISSIONS GRANTS & REVOCATIONS
-- ------------------------------------------------------------------------------
revoke all on function public.record_login(uuid, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.record_login(uuid, text, text, text, text, text) to service_role;

revoke all on function public.record_heartbeat(uuid, text, uuid, text, text, text, boolean, int) from public, anon, authenticated;
grant execute on function public.record_heartbeat(uuid, text, uuid, text, text, text, boolean, int) to service_role;

revoke all on function public.admin_users_overview() from public, anon, authenticated;
grant execute on function public.admin_users_overview() to service_role;

revoke all on function public.admin_user_detail(uuid) from public, anon, authenticated;
grant execute on function public.admin_user_detail(uuid) to service_role;

revoke all on function public.admin_active_now() from public, anon, authenticated;
grant execute on function public.admin_active_now() to service_role;

-- ------------------------------------------------------------------------------
-- 8. ONE-TIME BACKFILL STATEMENT (Run if you have existing auth.users)
-- ------------------------------------------------------------------------------
-- insert into public.site_users (id, email, full_name, country, whatsapp, avatar_url, providers, created_at)
-- select
--   u.id,
--   u.email,
--   coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''),
--   u.raw_user_meta_data->>'country',
--   u.raw_user_meta_data->>'whatsapp',
--   coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', ''),
--   case
--     when u.raw_app_meta_data ? 'providers' then
--       (select array_agg(case when elem::text = '"email"' then 'password' else trim(both '"' from elem::text) end)
--        from jsonb_array_elements(u.raw_app_meta_data->'providers') as elem)
--     else array[coalesce(u.raw_app_meta_data->>'provider', 'password')]
--   end,
--   u.created_at
-- from auth.users u
-- on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 9. OPTIONAL RETENTION POLICIES (Run via pg_cron or periodic jobs)
-- ------------------------------------------------------------------------------
-- delete from public.visit_sessions where last_seen_at < now() - interval '90 days';
-- delete from public.login_events where created_at < now() - interval '1 year';
