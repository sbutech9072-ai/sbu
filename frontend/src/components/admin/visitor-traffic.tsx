'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Users,
  Eye,
  BarChart3,
  RefreshCw,
  AlertCircle,
  FileText,
  Activity,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type AnalyticsRange = '1h' | '24h' | '7d' | '30d';

export interface SeriesPoint {
  t: string;
  views: number;
  visitors: number;
}

export interface AnalyticsSummary {
  views: number;
  visitors: number;
  prevViews: number;
  prevVisitors: number;
}

export interface TopPageItem {
  path: string;
  views: number;
  visitors: number;
}

export interface AnalyticsResponse {
  range: AnalyticsRange;
  series: SeriesPoint[];
  summary: AnalyticsSummary;
  topPages: TopPageItem[];
}

const STORAGE_KEY = 'sbu_admin_analytics_range';

const RANGE_CONFIG: {
  value: AnalyticsRange;
  shortLabel: string;
  ariaLabel: string;
}[] = [
  { value: '1h', shortLabel: '1 Hour', ariaLabel: 'Last 1 hour' },
  { value: '24h', shortLabel: 'Day', ariaLabel: 'Last day' },
  { value: '7d', shortLabel: '7 Days', ariaLabel: 'Last 7 days' },
  { value: '30d', shortLabel: '30 Days', ariaLabel: 'Last 30 days' },
];

function getStoredRange(): AnalyticsRange {
  if (typeof window === 'undefined') return '24h';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === '1h' || saved === '24h' || saved === '7d' || saved === '30d') {
      return saved;
    }
  } catch {
    // ignore localStorage errors
  }
  return '24h';
}

function setStoredRange(range: AnalyticsRange) {
  try {
    localStorage.setItem(STORAGE_KEY, range);
  } catch {
    // ignore localStorage errors
  }
}

function calculateChange(current: number, previous: number): {
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
} {
  if (previous === 0) {
    if (current > 0) {
      return { change: 'new', changeType: 'positive' };
    }
    return { change: '0%', changeType: 'neutral' };
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct > 0) {
    return { change: `+${pct}%`, changeType: 'positive' };
  } else if (pct < 0) {
    return { change: `${pct}%`, changeType: 'negative' };
  }
  return { change: '0%', changeType: 'neutral' };
}

function formatDhakaXLabel(
  isoString: string,
  range: AnalyticsRange,
  index: number,
  total: number
): { text: string; show: boolean } {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { text: '', show: false };

    if (range === '1h') {
      // 1h (12 buckets, 5m each): thin to every 10 min like "3:05 PM"
      const show = index % 2 === 0;
      const text = d.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return { text, show };
    }

    if (range === '24h') {
      // 24h (24 buckets, 1h each): thin to every 3 hours like "3 PM"
      const show = index % 3 === 0;
      const text = d.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        hour12: true,
      });
      return { text, show };
    }

    if (range === '7d') {
      // 7d (7 buckets): weekday + date like "Mon 16"
      const text = d.toLocaleDateString('en-US', {
        timeZone: 'Asia/Dhaka',
        weekday: 'short',
        day: 'numeric',
      });
      return { text, show: true };
    }

    if (range === '30d') {
      // 30d (30 buckets): every 5 days like "12 Nov"
      const show = index % 5 === 0 || index === total - 1;
      const text = d.toLocaleDateString('en-US', {
        timeZone: 'Asia/Dhaka',
        day: 'numeric',
        month: 'short',
      });
      return { text, show };
    }

    return { text: '', show: false };
  } catch {
    return { text: '', show: false };
  }
}

function formatDhakaTooltip(isoString: string, range: AnalyticsRange): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    if (range === '1h') {
      const end = new Date(d.getTime() + 5 * 60 * 1000);
      const startStr = d.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      const endStr = end.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${startStr} – ${endStr} (Asia/Dhaka)`;
    }

    if (range === '24h') {
      const end = new Date(d.getTime() + 60 * 60 * 1000);
      const startStr = d.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      const endStr = end.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${startStr} – ${endStr} (Asia/Dhaka)`;
    }

    return d.toLocaleDateString('en-US', {
      timeZone: 'Asia/Dhaka',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

function getNiceMax(val: number): number {
  if (val <= 0) return 4;
  if (val <= 4) return 4;
  if (val <= 10) return 10;
  if (val <= 20) return 20;
  if (val <= 50) return 50;
  if (val <= 100) return 100;
  const power = Math.pow(10, Math.floor(Math.log10(val)));
  const frac = val / power;
  let niceFrac = 10;
  if (frac <= 1) niceFrac = 1;
  else if (frac <= 2) niceFrac = 2;
  else if (frac <= 5) niceFrac = 5;
  return Math.ceil(niceFrac * power);
}

export function VisitorTraffic() {
  const [range, setRange] = useState<AnalyticsRange>('24h');
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ code: string; message: string } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeNow, setActiveNow] = useState<{ total: number; logged_in: number }>({
    total: 0,
    logged_in: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstMountRef = useRef(true);

  const fetchActiveNow = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/active-now');
      if (res.ok) {
        const json = (await res.json()) as any;
        if (json && typeof json.total === 'number') {
          setActiveNow(json);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Initialize range from localStorage on mount
  useEffect(() => {
    const saved = getStoredRange();
    if (saved !== '24h') {
      setRange(saved);
    }
  }, []);

  const fetchAnalytics = useCallback(async (selectedRange: AnalyticsRange, isInitial = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (isInitial) {
      setInitialLoading(true);
    }
    setIsRefetching(true);
    setErrorInfo(null);

    try {
      const res = await fetch(`/api/admin/analytics?range=${selectedRange}`, {
        signal: controller.signal,
        cache: 'no-store',
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw {
            code: 'unauthorized',
            message: 'Session expired, please sign in again',
          };
        }
        const body = (await res.json().catch(() => ({}))) as {
          code?: string;
          error?: string;
        };
        throw {
          code: body?.code || 'analytics_query_failed',
          message: body?.error || `HTTP ${res.status}`,
        };
      }

      const raw = (await res.json()) as AnalyticsResponse;
      setData(raw);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;

      const code = err?.code || 'analytics_query_failed';
      let message = err?.message || 'Failed to load analytics.';
      if (code === 'analytics_query_failed') {
        message = 'Analytics database is not set up yet: run supabase/analytics-range.sql';
      } else if (code === 'analytics_not_configured') {
        message = 'Analytics secrets are missing';
      } else if (code === 'unauthorized') {
        message = 'Session expired, please sign in again';
      }

      setErrorInfo({ code, message });
    } finally {
      if (!controller.signal.aborted) {
        setInitialLoading(false);
        setIsRefetching(false);
      }
    }
  }, []);

  // Fetch when range changes
  useEffect(() => {
    fetchAnalytics(range, isFirstMountRef.current);
    fetchActiveNow();
    isFirstMountRef.current = false;
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [range, fetchAnalytics, fetchActiveNow]);

  // Auto-refresh every 60s when document is visible
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchAnalytics(range, false);
        fetchActiveNow();
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [range, fetchAnalytics, fetchActiveNow]);

  const handleRangeChange = (newRange: AnalyticsRange) => {
    if (newRange === range) return;
    setRange(newRange);
    setStoredRange(newRange);
    setHoveredIndex(null);
  };

  const handleManualRefresh = () => {
    fetchAnalytics(range, false);
  };

  // KPI calculations
  const summary = data?.summary || { views: 0, visitors: 0, prevViews: 0, prevVisitors: 0 };
  const visitorsChange = calculateChange(summary.visitors, summary.prevVisitors);
  const viewsChange = calculateChange(summary.views, summary.prevViews);

  const currentAvg = summary.visitors > 0 ? summary.views / summary.visitors : 0;
  const prevAvg = summary.prevVisitors > 0 ? summary.prevViews / summary.prevVisitors : 0;
  const avgDisplay = summary.visitors > 0 ? currentAvg.toFixed(1) : '-';

  let avgChangeInfo: { change: string; changeType: 'positive' | 'negative' | 'neutral' } = {
    change: '0%',
    changeType: 'neutral',
  };
  if (prevAvg === 0) {
    if (currentAvg > 0) {
      avgChangeInfo = { change: 'new', changeType: 'positive' };
    }
  } else {
    const avgPct = Math.round(((currentAvg - prevAvg) / prevAvg) * 100);
    if (avgPct > 0) {
      avgChangeInfo = { change: `+${avgPct}%`, changeType: 'positive' };
    } else if (avgPct < 0) {
      avgChangeInfo = { change: `${avgPct}%`, changeType: 'negative' };
    }
  }

  // SVG Chart Geometry
  const series = data?.series || [];
  const maxRaw = Math.max(...series.map((s) => Math.max(s.views, s.visitors)), 0);
  const yMax = getNiceMax(maxRaw);

  const svgWidth = 720;
  const svgHeight = 240;
  const plotLeft = 46;
  const plotRight = 20;
  const plotTop = 22;
  const plotBottom = 200;
  const plotWidth = svgWidth - plotLeft - plotRight;
  const plotHeight = plotBottom - plotTop;

  const yTicks = [
    { val: 0, y: plotBottom },
    { val: Math.round(yMax * 0.33), y: plotBottom - plotHeight * 0.33 },
    { val: Math.round(yMax * 0.67), y: plotBottom - plotHeight * 0.67 },
    { val: yMax, y: plotTop },
  ];

  const numBuckets = Math.max(series.length, 1);
  const slotWidth = plotWidth / numBuckets;

  // Compute points for visitors line
  const visitorLinePoints = series.map((s, i) => {
    const cx = plotLeft + (i + 0.5) * slotWidth;
    const cy = plotBottom - (s.visitors / yMax) * plotHeight;
    return { cx, cy, visitors: s.visitors };
  });

  const visitorPathD = visitorLinePoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.cx} ${pt.cy}` : `${acc} L ${pt.cx} ${pt.cy}`),
    ''
  );

  const topPagesData = data?.topPages || [];
  const maxPageViews = Math.max(...topPagesData.map((p) => p.views), 1);

  const isEmpty =
    !initialLoading &&
    !errorInfo &&
    summary.views === 0 &&
    summary.visitors === 0;

  const activeHoveredPoint =
    hoveredIndex !== null && hoveredIndex >= 0 && hoveredIndex < series.length
      ? series[hoveredIndex]
      : null;

  return (
    <div className="space-y-6">
      {/* Header with Title and Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1E5A54]/20 dark:border-[#292D32]">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#F7623D]" />
          <h3 className="font-headline text-xl uppercase text-[#1E5A54] dark:text-[#F5F1EA] tracking-tight">
            Visitor Traffic
          </h3>
          {isRefetching && (
            <RefreshCw className="h-3.5 w-3.5 text-[#1E5A54]/60 dark:text-[#A9ADB3] animate-spin ml-1" />
          )}
        </div>

        {/* Range Segmented Control & Refresh Button */}
        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Analytics time range"
            className="inline-flex items-center p-1 rounded-full bg-[#EEE6E2] dark:bg-[#15181C] border border-[#1E5A54]/20 dark:border-[#292D32]"
          >
            {RANGE_CONFIG.map((r) => {
              const isActive = range === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={r.ariaLabel}
                  onClick={() => handleRangeChange(r.value)}
                  className={`px-3 py-1 text-xs font-mono font-medium rounded-full transition-all ${
                    isActive
                      ? 'bg-[#1E5A54] text-[#EEE6E2] dark:bg-[#2B756E] dark:text-[#F5F1EA] shadow-sm font-semibold'
                      : 'text-[#1E5A54]/80 dark:text-[#A9ADB3] hover:text-[#1E5A54] dark:hover:text-[#F5F1EA] hover:bg-[#E2D7D1]/50 dark:hover:bg-[#1D2025]/50'
                  }`}
                >
                  {r.shortLabel}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefetching}
            className="p-2 text-xs text-[#1E5A54] dark:text-[#F5F1EA] hover:bg-[#E2D7D1] dark:hover:bg-[#1D2025] rounded-full transition-colors inline-flex items-center gap-1"
            title="Refresh analytics"
            aria-label="Refresh analytics data"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorInfo && (
        <Card className="p-6 border-[#F7623D]/30 bg-[#F8F4F2] dark:bg-[#15181C] rounded-3xl text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-[#F7623D] mx-auto" />
          <div className="space-y-1">
            <h4 className="font-headline text-lg uppercase text-[#1E5A54] dark:text-[#F5F1EA]">
              Failed to Load Analytics
            </h4>
            <p className="text-xs text-[#1E5A54]/80 dark:text-[#A9ADB3] max-w-md mx-auto">
              {errorInfo.message}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {errorInfo.code === 'unauthorized' && (
              <Button
                asChild
                size="sm"
                className="rounded-full text-xs bg-[#1E5A54] hover:bg-[#16443F] text-[#EEE6E2]"
              >
                <Link href="/admin/login">Sign in to Admin</Link>
              </Button>
            )}
            <Button
              onClick={() => fetchAnalytics(range, true)}
              size="sm"
              variant="outline"
              className="rounded-full text-xs gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Initial Loading Skeleton */}
      {initialLoading && !data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 border-[#1E5A54]/25 dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] rounded-3xl animate-pulse h-28" />
            <Card className="p-6 border-[#1E5A54]/25 dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] rounded-3xl animate-pulse h-28" />
            <Card className="p-6 border-[#1E5A54]/25 dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] rounded-3xl animate-pulse h-28" />
            <Card className="p-6 border-[#1E5A54]/25 dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] rounded-3xl animate-pulse h-28" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 border-[#1E5A54]/25 dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] rounded-3xl animate-pulse h-80" />
            <Card className="p-6 border-[#1E5A54]/25 dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] rounded-3xl animate-pulse h-80" />
          </div>
        </div>
      )}

      {/* Main Content Area: KPIs, Unified Chart, and Top Pages */}
      {data && !initialLoading && (
        <div
          className={`space-y-6 transition-opacity duration-200 ${
            isRefetching ? 'opacity-70' : 'opacity-100'
          }`}
        >
          {/* Four KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Unique Visitors"
              value={summary.visitors}
              change={visitorsChange.change}
              changeType={visitorsChange.changeType}
              icon={Users}
              helper={`Prev period: ${summary.prevVisitors}`}
            />
            <StatsCard
              title="Page Views"
              value={summary.views}
              change={viewsChange.change}
              changeType={viewsChange.changeType}
              icon={Eye}
              helper={`Prev period: ${summary.prevViews}`}
            />
            <StatsCard
              title="Avg. Views per Visitor"
              value={avgDisplay}
              change={avgChangeInfo.change}
              changeType={avgChangeInfo.changeType}
              icon={BarChart3}
              helper={
                summary.prevVisitors > 0
                  ? `Prev avg: ${(summary.prevViews / summary.prevVisitors).toFixed(1)}`
                  : 'Ratio (views / visitors)'
              }
            />
            <StatsCard
              title="Active Now"
              value={activeNow.total}
              change={activeNow.logged_in > 0 ? `${activeNow.logged_in} logged in` : 'All visitors'}
              changeType="positive"
              icon={Activity}
              helper="Visitors online (< 2m active)"
            />
          </div>

          {/* Chart & Top Pages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ONE Chart Component (lg:col-span-2) */}
            <Card className="lg:col-span-2 p-5 sm:p-6 border-[#1E5A54]/25 dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline text-base uppercase text-[#1E5A54] dark:text-[#F5F1EA]">
                      Traffic Overview
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#1E5A54]/10 dark:bg-[#2B756E]/20 text-[#1E5A54] dark:text-[#F5F1EA]">
                      {RANGE_CONFIG.find((r) => r.value === range)?.ariaLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#1E5A54]/70 dark:text-[#A9ADB3]">
                    Timeseries grouped in Asia/Dhaka time
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-sm bg-[#1E5A54] dark:bg-[#2B756E]" />
                    <span className="text-[#1E5A54] dark:text-[#F5F1EA] font-medium">Views (bars)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center w-3 h-3">
                      <span className="w-2.5 h-0.5 bg-[#F7623D] inline-block" />
                    </span>
                    <span className="text-[#1E5A54] dark:text-[#F5F1EA] font-medium">Visitors (line)</span>
                  </span>
                </div>
              </div>

              {/* Hover / Touch Details Banner */}
              <div className="h-8 flex items-center justify-between text-xs px-3 py-1 rounded-xl bg-[#EEE6E2]/70 dark:bg-[#101215]/70 border border-[#1E5A54]/15 dark:border-[#292D32]">
                {activeHoveredPoint ? (
                  <div className="flex items-center justify-between w-full font-mono text-[11px]">
                    <span className="text-[#1E5A54] dark:text-[#F5F1EA] font-bold">
                      {formatDhakaTooltip(activeHoveredPoint.t, range)}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-[#1E5A54] dark:text-[#2B756E] font-bold">
                        {activeHoveredPoint.views} {activeHoveredPoint.views === 1 ? 'view' : 'views'}
                      </span>
                      <span className="text-[#F7623D] font-bold">
                        {activeHoveredPoint.visitors}{' '}
                        {activeHoveredPoint.visitors === 1 ? 'visitor' : 'visitors'}
                      </span>
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#1E5A54]/60 dark:text-[#A9ADB3]/60 italic font-mono">
                    Hover or touch across the chart to view bucket details
                  </span>
                )}
              </div>

              {/* Empty state notice over zero-filled chart */}
              {isEmpty && (
                <div className="py-1 px-3 text-center text-xs font-mono text-[#1E5A54]/70 dark:text-[#A9ADB3] bg-[#EEE6E2]/40 dark:bg-[#101215]/40 rounded-lg border border-dashed border-[#1E5A54]/20">
                  No visits recorded in this period
                </div>
              )}

              {/* SVG Chart with zero-filled axes and smooth transitions */}
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full min-w-[500px] h-56 select-none"
                  preserveAspectRatio="none"
                >
                  {/* Horizontal Gridlines & Y-Axis Labels */}
                  {yTicks.map((tick, i) => (
                    <g key={i}>
                      <line
                        x1={plotLeft}
                        y1={tick.y}
                        x2={plotLeft + plotWidth}
                        y2={tick.y}
                        stroke="currentColor"
                        strokeOpacity={i === 0 ? 0.2 : 0.08}
                        strokeWidth="1"
                        strokeDasharray={i === 0 ? undefined : '3 3'}
                      />
                      <text
                        x={plotLeft - 8}
                        y={tick.y + 4}
                        fontSize="10"
                        fontFamily="monospace"
                        fill="currentColor"
                        opacity="0.6"
                        textAnchor="end"
                      >
                        {tick.val}
                      </text>
                    </g>
                  ))}

                  {/* Views Bars */}
                  {series.map((s, i) => {
                    const cx = plotLeft + (i + 0.5) * slotWidth;
                    const barWidth = Math.max(Math.min(slotWidth * 0.55, 26), 4);
                    const barX = cx - barWidth / 2;
                    const barHeight = Math.max(
                      (s.views / yMax) * plotHeight,
                      s.views > 0 ? 3 : 0
                    );
                    const barY = plotBottom - barHeight;
                    const isHovered = hoveredIndex === i;

                    return (
                      <rect
                        key={`bar-${s.t || i}`}
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        rx="2"
                        className={`fill-[#1E5A54] dark:fill-[#2B756E] transition-all duration-200 ${
                          isHovered ? 'brightness-125' : ''
                        }`}
                      />
                    );
                  })}

                  {/* Visitors Line */}
                  {series.length > 1 && (
                    <path
                      d={visitorPathD}
                      fill="none"
                      stroke="#F7623D"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Visitors Dots */}
                  {visitorLinePoints.map((pt, i) => {
                    const isHovered = hoveredIndex === i;
                    return (
                      <circle
                        key={`dot-${i}`}
                        cx={pt.cx}
                        cy={pt.cy}
                        r={isHovered ? 5.5 : 3.5}
                        className="fill-[#F7623D] stroke-[#F8F4F2] dark:stroke-[#15181C] stroke-2 transition-all duration-150"
                      />
                    );
                  })}

                  {/* Active hover guideline */}
                  {hoveredIndex !== null && hoveredIndex < series.length && (
                    <line
                      x1={plotLeft + (hoveredIndex + 0.5) * slotWidth}
                      y1={plotTop}
                      x2={plotLeft + (hoveredIndex + 0.5) * slotWidth}
                      y2={plotBottom}
                      stroke="#F7623D"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      opacity="0.8"
                    />
                  )}

                  {/* X-Axis Labels (thinned according to range rules) */}
                  {series.map((s, i) => {
                    const { text, show } = formatDhakaXLabel(s.t, range, i, series.length);
                    if (!show || !text) return null;
                    const cx = plotLeft + (i + 0.5) * slotWidth;
                    return (
                      <text
                        key={`xlabel-${i}`}
                        x={cx}
                        y={plotBottom + 18}
                        fontSize="10"
                        fontFamily="monospace"
                        fill="currentColor"
                        opacity="0.65"
                        textAnchor="middle"
                      >
                        {text}
                      </text>
                    );
                  })}

                  {/* Transparent Interactive Hover/Touch Slots */}
                  {series.map((s, i) => {
                    const slotX = plotLeft + i * slotWidth;
                    return (
                      <rect
                        key={`hitbox-${i}`}
                        x={slotX}
                        y={plotTop}
                        width={slotWidth}
                        height={plotHeight + 25}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onTouchStart={() => setHoveredIndex(i)}
                      >
                        <title>
                          {formatDhakaTooltip(s.t, range)}: {s.views} views, {s.visitors} visitors
                        </title>
                      </rect>
                    );
                  })}
                </svg>
              </div>
            </Card>

            {/* Top Pages List for the selected range */}
            <Card className="p-5 sm:p-6 border-[#1E5A54]/25 dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#F7623D]" />
                  <h4 className="font-headline text-base uppercase text-[#1E5A54] dark:text-[#F5F1EA]">
                    Top Pages
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-[#1E5A54]/70 dark:text-[#A9ADB3]">
                  {topPagesData.length} routes
                </span>
              </div>

              {topPagesData.length === 0 ? (
                <p className="text-xs text-[#1E5A54]/60 dark:text-[#A9ADB3]/60 italic py-6 text-center">
                  No route visits recorded in this period.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {topPagesData.map((item, idx) => {
                    const percent = Math.round((item.views / maxPageViews) * 100);
                    return (
                      <div
                        key={item.path || idx}
                        className="p-3 rounded-2xl bg-[#EEE6E2]/50 dark:bg-[#101215]/50 border border-[#1E5A54]/15 dark:border-[#292D32] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-semibold text-[#1E5A54] dark:text-[#F5F1EA] truncate max-w-[65%]">
                            <span className="text-[#F7623D] mr-2">#{idx + 1}</span>
                            {item.path}
                          </span>
                          <span className="font-mono text-[11px] text-[#1E5A54] dark:text-[#F5F1EA] font-bold">
                            {item.views} {item.views === 1 ? 'view' : 'views'}
                            {item.visitors > 0 && (
                              <span className="text-[#1E5A54]/60 dark:text-[#A9ADB3] font-normal ml-1">
                                ({item.visitors}u)
                              </span>
                            )}
                          </span>
                        </div>
                        {/* Proportional visual bar */}
                        <div className="w-full h-1.5 bg-[#E2D7D1] dark:bg-[#1D2025] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1E5A54] dark:bg-[#2B756E] rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisitorTraffic;
