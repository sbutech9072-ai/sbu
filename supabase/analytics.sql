-- ==============================================================================
-- SBU TECH — PRIVACY-FRIENDLY VISITOR ANALYTICS SCHEMA
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- 1. PAGE VIEWS TABLE
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  path text not null,
  visitor_id text not null,
  referrer text,
  country text,
  device text,
  is_bot boolean not null default false
);

-- Index for timeline queries
create index if not exists idx_page_views_created_at_desc
  on public.page_views (created_at desc);

-- Enable RLS with NO policies (service_role bypasses RLS, public/anon/authenticated have no access)
alter table public.page_views enable row level security;


-- 2. ANALYTICS FUNCTIONS (Excluding Bots, Security Definer)

-- A) Visitors by hour (last 24 hours, one row per hour)
create or replace function public.visitors_by_hour()
returns table (
  bucket timestamptz,
  views bigint,
  visitors bigint
)
language sql
security definer
set search_path = public
as $$
  with hours as (
    select generate_series(
      date_trunc('hour', now() - interval '23 hours'),
      date_trunc('hour', now()),
      interval '1 hour'
    ) as bucket
  )
  select
    h.bucket,
    coalesce(count(p.id), 0)::bigint as views,
    coalesce(count(distinct p.visitor_id), 0)::bigint as visitors
  from hours h
  left join public.page_views p
    on p.created_at >= h.bucket
    and p.created_at < h.bucket + interval '1 hour'
    and p.is_bot = false
  group by h.bucket
  order by h.bucket asc;
$$;

-- B) Visitors by day (bucketed by date in Asia/Dhaka, default 7 days)
create or replace function public.visitors_by_day(days int default 7)
returns table (
  day date,
  views bigint,
  visitors bigint
)
language sql
security definer
set search_path = public
as $$
  with days_series as (
    select generate_series(
      ((now() at time zone 'Asia/Dhaka')::date - (greatest(days, 1) - 1)),
      (now() at time zone 'Asia/Dhaka')::date,
      interval '1 day'
    )::date as d
  )
  select
    s.d as day,
    coalesce(count(p.id), 0)::bigint as views,
    coalesce(count(distinct p.visitor_id), 0)::bigint as visitors
  from days_series s
  left join public.page_views p
    on (p.created_at at time zone 'Asia/Dhaka')::date = s.d
    and p.is_bot = false
  group by s.d
  order by s.d asc;
$$;

-- C) Top pages (views by path, default 7 days, limit 5)
create or replace function public.top_pages(days int default 7, lim int default 5)
returns table (
  path text,
  views bigint
)
language sql
security definer
set search_path = public
as $$
  select
    p.path,
    count(*)::bigint as views
  from public.page_views p
  where p.created_at >= now() - (greatest(days, 1) || ' days')::interval
    and p.is_bot = false
  group by p.path
  order by views desc
  limit greatest(lim, 1);
$$;

-- D) Analytics totals (visitors_today in Asia/Dhaka, views_24h, visitors_7d)
create or replace function public.analytics_totals()
returns table (
  visitors_today bigint,
  views_24h bigint,
  visitors_7d bigint
)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(count(distinct case when (created_at at time zone 'Asia/Dhaka')::date = (now() at time zone 'Asia/Dhaka')::date then visitor_id end), 0)::bigint as visitors_today,
    coalesce(count(case when created_at >= now() - interval '24 hours' then 1 end), 0)::bigint as views_24h,
    coalesce(count(distinct case when created_at >= now() - interval '7 days' then visitor_id end), 0)::bigint as visitors_7d
  from public.page_views
  where is_bot = false
    and created_at >= now() - interval '7 days';
$$;


-- 3. PERMISSIONS (Revoke from public/anon/authenticated, grant ONLY to service_role)
revoke execute on function public.visitors_by_hour() from public, anon, authenticated;
grant execute on function public.visitors_by_hour() to service_role;

revoke execute on function public.visitors_by_day(int) from public, anon, authenticated;
grant execute on function public.visitors_by_day(int) to service_role;

revoke execute on function public.top_pages(int, int) from public, anon, authenticated;
grant execute on function public.top_pages(int, int) to service_role;

revoke execute on function public.analytics_totals() from public, anon, authenticated;
grant execute on function public.analytics_totals() to service_role;


-- 4. OPTIONAL RETENTION POLICY (Commented)
-- To periodically prune page views older than 90 days, execute:
-- delete from public.page_views where created_at < now() - interval '90 days';
