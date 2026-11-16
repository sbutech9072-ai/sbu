-- ==============================================================================
-- SBU TECH — THREE-LEVEL ADMIN ROLE, ACCOUNT & AUDIT LOG SCHEMA
-- File: supabase/admin-users.sql
-- ==============================================================================
-- IMPORTANT:
-- Run this SQL in your Supabase SQL Editor manually.
-- Never run migrations automatically from agent environments.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE: public.admin_users
-- ------------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  role text not null check (role in ('main_owner', 'co_owner', 'member')),
  password_hash text not null,
  is_active boolean not null default true,
  permissions text[] not null default array['overview', 'projects', 'team', 'testimonials', 'messages']::text[],
  token_version integer not null default 1,
  created_by uuid references public.admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz,
  last_seen_at timestamptz,
  password_changed_at timestamptz not null default now()
);

-- Enforce unique case-insensitive email across all admin accounts
create unique index if not exists admin_users_lower_email_idx
  on public.admin_users (lower(email));

-- Enforce at most ONE Main Owner at the database level
create unique index if not exists admin_users_single_main_owner_idx
  on public.admin_users (role)
  where (role = 'main_owner');

-- Enforce at most ONE Co-owner at the database level
create unique index if not exists admin_users_single_co_owner_idx
  on public.admin_users (role)
  where (role = 'co_owner');

create index if not exists admin_users_role_active_idx
  on public.admin_users (role, is_active);

-- Keep updated_at current on every row update
create or replace function public.set_admin_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admin_users_updated_at on public.admin_users;
create trigger trg_admin_users_updated_at
  before update on public.admin_users
  for each row
  execute function public.set_admin_users_updated_at();

-- ------------------------------------------------------------------------------
-- 2. TABLE: public.admin_audit_logs
-- ------------------------------------------------------------------------------
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.admin_users(id) on delete set null,
  actor_email text,
  actor_role text,
  target_id uuid references public.admin_users(id) on delete set null,
  target_email text,
  action text not null check (
    action in (
      'login_success',
      'login_failed',
      'logout',
      'account_created',
      'account_updated',
      'password_reset',
      'role_changed',
      'account_disabled',
      'account_enabled',
      'account_deleted'
    )
  ),
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_logs_created_at_idx
  on public.admin_audit_logs (created_at desc);

create index if not exists admin_audit_logs_actor_idx
  on public.admin_audit_logs (actor_id, created_at desc);

create index if not exists admin_audit_logs_target_idx
  on public.admin_audit_logs (target_id, created_at desc);

create index if not exists admin_audit_logs_action_idx
  on public.admin_audit_logs (action, created_at desc);

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (Strict Service-Role Only Access)
-- ------------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.admin_audit_logs enable row level security;

revoke all on table public.admin_users from anon, authenticated, public;
revoke all on table public.admin_audit_logs from anon, authenticated, public;
