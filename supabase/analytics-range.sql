-- ==============================================================================
-- SBU TECH — RANGE-AWARE VISITOR ANALYTICS SCHEMA
-- Run this in your Supabase SQL Editor to enable the unified range analytics.
-- Existing functions are preserved.
-- ==============================================================================

-- 1. OPTIONAL PERFORMANCE INDEX
-- Uncomment if you want to optimize multi-column range scans with visitor_id:
-- create index if not exists idx_page_views_created_at_visitor on public.page_views (created_at desc, visitor_id);


-- 2. TIMESERIES FUNCTION
-- Returns timeseries buckets for '1h' (12x 5m), '24h' (24x 1h), '7d' (7x 1d), '30d' (30x 1d)
create or replace function public.analytics_timeseries(p_range text)
returns table (
  bucket timestamptz,
  views bigint,
  visitors bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_step interval;
  v_start timestamptz;
  v_latest timestamptz;
  v_today date;
begin
  if p_range = '1h' then
    v_step := interval '5 minutes';
    v_latest := date_trunc('minute', now()) - ((extract(minute from now())::int % 5) * interval '1 minute');
    v_start := v_latest - interval '55 minutes';
  elsif p_range = '24h' then
    v_step := interval '1 hour';
    v_latest := date_trunc('hour', now());
    v_start := v_latest - interval '23 hours';
  elsif p_range = '7d' then
    v_step := interval '1 day';
    v_today := (now() at time zone 'Asia/Dhaka')::date;
    v_latest := (v_today::timestamp) at time zone 'Asia/Dhaka';
    v_start := ((v_today - 6)::timestamp) at time zone 'Asia/Dhaka';
  elsif p_range = '30d' then
    v_step := interval '1 day';
    v_today := (now() at time zone 'Asia/Dhaka')::date;
    v_latest := (v_today::timestamp) at time zone 'Asia/Dhaka';
    v_start := ((v_today - 29)::timestamp) at time zone 'Asia/Dhaka';
  else
    raise exception 'Invalid range: %. Allowed values: 1h, 24h, 7d, 30d', p_range;
  end if;

  return query
  with series as (
    select generate_series(v_start, v_latest, v_step) as b
  )
  select
    s.b as bucket,
    coalesce(count(p.id), 0)::bigint as views,
    coalesce(count(distinct p.visitor_id), 0)::bigint as visitors
  from series s
  left join public.page_views p
    on p.created_at >= s.b
    and p.created_at < s.b + v_step
    and p.is_bot = false
  group by s.b
  order by s.b asc;
end;
$$;


-- 3. SUMMARY FUNCTION
-- Returns overall views & unique visitors for current and previous period of equal length
create or replace function public.analytics_summary(p_range text)
returns table (
  views bigint,
  visitors bigint,
  prev_views bigint,
  prev_visitors bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  curr_start timestamptz;
  curr_end timestamptz;
  prev_start timestamptz;
  prev_end timestamptz;
  v_latest timestamptz;
  v_today date;
begin
  if p_range = '1h' then
    v_latest := date_trunc('minute', now()) - ((extract(minute from now())::int % 5) * interval '1 minute');
    curr_start := v_latest - interval '55 minutes';
    curr_end := v_latest + interval '5 minutes';
    prev_start := curr_start - interval '60 minutes';
    prev_end := curr_start;
  elsif p_range = '24h' then
    v_latest := date_trunc('hour', now());
    curr_start := v_latest - interval '23 hours';
    curr_end := v_latest + interval '1 hour';
    prev_start := curr_start - interval '24 hours';
    prev_end := curr_start;
  elsif p_range = '7d' then
    v_today := (now() at time zone 'Asia/Dhaka')::date;
    curr_start := ((v_today - 6)::timestamp) at time zone 'Asia/Dhaka';
    curr_end := ((v_today + 1)::timestamp) at time zone 'Asia/Dhaka';
    prev_start := ((v_today - 13)::timestamp) at time zone 'Asia/Dhaka';
    prev_end := curr_start;
  elsif p_range = '30d' then
    v_today := (now() at time zone 'Asia/Dhaka')::date;
    curr_start := ((v_today - 29)::timestamp) at time zone 'Asia/Dhaka';
    curr_end := ((v_today + 1)::timestamp) at time zone 'Asia/Dhaka';
    prev_start := ((v_today - 59)::timestamp) at time zone 'Asia/Dhaka';
    prev_end := curr_start;
  else
    raise exception 'Invalid range: %. Allowed values: 1h, 24h, 7d, 30d', p_range;
  end if;

  return query
  select
    coalesce(count(case when p.created_at >= curr_start and p.created_at < curr_end then 1 end), 0)::bigint as views,
    coalesce(count(distinct case when p.created_at >= curr_start and p.created_at < curr_end then p.visitor_id end), 0)::bigint as visitors,
    coalesce(count(case when p.created_at >= prev_start and p.created_at < prev_end then 1 end), 0)::bigint as prev_views,
    coalesce(count(distinct case when p.created_at >= prev_start and p.created_at < prev_end then p.visitor_id end), 0)::bigint as prev_visitors
  from public.page_views p
  where p.is_bot = false
    and p.created_at >= prev_start
    and p.created_at < curr_end;
end;
$$;


-- 4. TOP PAGES FUNCTION
-- Returns top visited routes for the selected range with views and distinct visitors
create or replace function public.top_pages_range(p_range text, lim int default 8)
returns table (
  path text,
  views bigint,
  visitors bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  curr_start timestamptz;
  curr_end timestamptz;
  v_latest timestamptz;
  v_today date;
begin
  if p_range = '1h' then
    v_latest := date_trunc('minute', now()) - ((extract(minute from now())::int % 5) * interval '1 minute');
    curr_start := v_latest - interval '55 minutes';
    curr_end := v_latest + interval '5 minutes';
  elsif p_range = '24h' then
    v_latest := date_trunc('hour', now());
    curr_start := v_latest - interval '23 hours';
    curr_end := v_latest + interval '1 hour';
  elsif p_range = '7d' then
    v_today := (now() at time zone 'Asia/Dhaka')::date;
    curr_start := ((v_today - 6)::timestamp) at time zone 'Asia/Dhaka';
    curr_end := ((v_today + 1)::timestamp) at time zone 'Asia/Dhaka';
  elsif p_range = '30d' then
    v_today := (now() at time zone 'Asia/Dhaka')::date;
    curr_start := ((v_today - 29)::timestamp) at time zone 'Asia/Dhaka';
    curr_end := ((v_today + 1)::timestamp) at time zone 'Asia/Dhaka';
  else
    raise exception 'Invalid range: %. Allowed values: 1h, 24h, 7d, 30d', p_range;
  end if;

  return query
  select
    p.path,
    count(*)::bigint as views,
    coalesce(count(distinct p.visitor_id), 0)::bigint as visitors
  from public.page_views p
  where p.is_bot = false
    and p.created_at >= curr_start
    and p.created_at < curr_end
  group by p.path
  order by views desc
  limit greatest(lim, 1);
end;
$$;


-- 5. PERMISSIONS
-- Revoke from public, anon, authenticated; grant ONLY to service_role
revoke execute on function public.analytics_timeseries(text) from public, anon, authenticated;
grant execute on function public.analytics_timeseries(text) to service_role;

revoke execute on function public.analytics_summary(text) from public, anon, authenticated;
grant execute on function public.analytics_summary(text) to service_role;

revoke execute on function public.top_pages_range(text, int) from public, anon, authenticated;
grant execute on function public.top_pages_range(text, int) to service_role;

