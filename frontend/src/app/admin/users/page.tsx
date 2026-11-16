'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Globe,
  Phone,
  Calendar,
  Clock,
  Radio,
  Laptop,
  Smartphone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface AdminUserRow {
  id: string;
  email: string;
  full_name: string | null;
  country: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  providers: string[];
  created_at: string;
  last_login_at: string | null;
  last_seen_at: string | null;
  login_count: number;
  total_active_seconds: number;
  sessions_count: number;
  online_now: boolean;
}

interface LoginEventRecord {
  id: number;
  provider: string;
  event: string;
  auth_session_id: string | null;
  created_at: string;
  country: string | null;
  device: string | null;
}

interface VisitSessionRecord {
  id: string;
  started_at: string;
  last_seen_at: string;
  active_seconds: number;
  landing_path: string | null;
  country: string | null;
  device: string | null;
}

interface UserDetailResponse {
  logins: LoginEventRecord[];
  sessions: VisitSessionRecord[];
}

function formatDhakaDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Never';
  return (
    d.toLocaleDateString('en-US', {
      timeZone: 'Asia/Dhaka',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ', ' +
    d.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) +
    ' (Asia/Dhaka)'
  );
}

function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  const days = Math.floor(diffSec / 86400);
  return `${days}d ago`;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [activeNow, setActiveNow] = useState<{ total: number; logged_in: number }>({
    total: 0,
    logged_in: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'last_seen' | 'total_time' | 'last_login'>('last_seen');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Drawer / Detail modal
  const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsersData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, activeRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/active-now'),
      ]);

      if (!usersRes.ok) {
        throw new Error('Failed to load site users');
      }

      const usersJson = await usersRes.json();
      setUsers(Array.isArray(usersJson) ? usersJson : []);

      if (activeRes.ok) {
        const activeJson = (await activeRes.json()) as { total?: number; logged_in?: number };
        setActiveNow({
          total: typeof activeJson?.total === 'number' ? activeJson.total : 0,
          logged_in: typeof activeJson?.logged_in === 'number' ? activeJson.logged_in : 0,
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve registered users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  // Fetch individual user detail on row selection
  const handleOpenUserDetail = async (user: AdminUserRow) => {
    setSelectedUser(user);
    setDetailLoading(true);
    setUserDetail(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`);
      if (res.ok) {
        const json = (await res.json()) as UserDetailResponse;
        setUserDetail(json);
      }
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  };

  // KPIs
  const registeredCount = users.length;
  const loginsToday = useMemo(() => {
    const now = new Date();
    // Compare YYYY-MM-DD in Asia/Dhaka
    const todayDhaka = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });
    return users.filter((u) => {
      if (!u.last_login_at) return false;
      const d = new Date(u.last_login_at);
      const userDhaka = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });
      return userDhaka === todayDhaka;
    }).length;
  }, [users]);

  // Search & Filter
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          (u.full_name && u.full_name.toLowerCase().includes(q)) ||
          (u.country && u.country.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'total_time') {
        return (b.total_active_seconds || 0) - (a.total_active_seconds || 0);
      }
      if (sortBy === 'last_login') {
        const timeA = a.last_login_at ? new Date(a.last_login_at).getTime() : 0;
        const timeB = b.last_login_at ? new Date(b.last_login_at).getTime() : 0;
        return timeB - timeA;
      }
      // default: last_seen
      const timeA = a.last_seen_at ? new Date(a.last_seen_at).getTime() : 0;
      const timeB = b.last_seen_at ? new Date(b.last_seen_at).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [users, searchQuery, sortBy]);

  const totalPages = Math.max(Math.ceil(filteredUsers.length / PAGE_SIZE), 1);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E5A54]/20">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl uppercase text-[#1E5A54] tracking-tight">
            Client & Site Users
          </h1>
          <p className="text-xs text-[#1E5A54] mt-1">
            Real-time engagement, verified Google & password sign-ins, and activity logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchUsersData}
            variant="outline"
            size="sm"
            disabled={loading}
            className="text-xs rounded-full gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Registered Users"
          value={registeredCount}
          change="Verified site accounts"
          changeType="positive"
          icon={Users}
          helper="Total authenticated users"
        />
        <StatsCard
          title="Active Now"
          value={activeNow.total}
          change={activeNow.logged_in > 0 ? `${activeNow.logged_in} logged in` : '0 logged in'}
          changeType="positive"
          icon={Radio}
          helper="Online within last 2m"
        />
        <StatsCard
          title="Logins Today"
          value={loginsToday}
          change="Asia/Dhaka timezone"
          changeType="neutral"
          icon={Clock}
          helper="Sign-in sessions today"
        />
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        {/* Controls: Search and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#1E5A54]/60" />
            <input
              type="text"
              placeholder="Search by name, Gmail, or country..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F8F4F2] border border-[#1E5A54]/25 rounded-full pl-10 pr-4 py-2 text-xs text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#1E5A54]/70 font-semibold uppercase tracking-wider text-[10px]">
              Sort by:
            </span>
            <div className="flex bg-[#F8F4F2] border border-[#1E5A54]/25 rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setSortBy('last_seen')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  sortBy === 'last_seen'
                    ? 'bg-[#1E5A54] text-[#EEE6E2]'
                    : 'text-[#1E5A54] hover:text-[#1E5A54]'
                }`}
              >
                Last Seen
              </button>
              <button
                type="button"
                onClick={() => setSortBy('total_time')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  sortBy === 'total_time'
                    ? 'bg-[#1E5A54] text-[#EEE6E2]'
                    : 'text-[#1E5A54] hover:text-[#1E5A54]'
                }`}
              >
                Total Time
              </button>
              <button
                type="button"
                onClick={() => setSortBy('last_login')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  sortBy === 'last_login'
                    ? 'bg-[#1E5A54] text-[#EEE6E2]'
                    : 'text-[#1E5A54] hover:text-[#1E5A54]'
                }`}
              >
                Last Login
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-[#F8F4F2] border border-[#F7623D]/40 text-[#1E5A54] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-[#F7623D]" />
              <span>{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={fetchUsersData} className="text-xs">
              Retry
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <Card className="p-8 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl animate-pulse text-center">
            <p className="text-xs text-[#1E5A54]/60">Loading registered users and telemetry...</p>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && filteredUsers.length === 0 && (
          <Card className="p-12 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl text-center space-y-2">
            <Users className="w-8 h-8 text-[#1E5A54]/40 mx-auto" />
            <h4 className="font-headline text-lg uppercase text-[#1E5A54]">
              No users have signed in yet
            </h4>
            <p className="text-xs text-[#1E5A54]/70 max-w-sm mx-auto">
              {searchQuery
                ? 'No users match your search query.'
                : 'As clients register via email or Continue with Google, their activity and telemetry will appear here.'}
            </p>
          </Card>
        )}

        {/* Data Table */}
        {!loading && !error && filteredUsers.length > 0 && (
          <Card className="border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1E5A54]/20 bg-[#E2D7D1]/50 text-[#1E5A54] uppercase tracking-wider text-[10px] font-mono">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Providers</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4">Last Seen</th>
                    <th className="py-3 px-4">Time on Site</th>
                    <th className="py-3 px-4 text-right">Logins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E5A54]/10 text-[#1E5A54]">
                  {paginatedUsers.map((u) => {
                    const displayName = u.full_name || u.email.split('@')[0];
                    const isGoogle = u.providers.includes('google');
                    const isPassword = u.providers.includes('password');

                    return (
                      <tr
                        key={u.id}
                        onClick={() => handleOpenUserDetail(u)}
                        className="hover:bg-[#E2D7D1]/40 transition-colors cursor-pointer group"
                      >
                        {/* Avatar + Name + Gmail */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {u.avatar_url ? (
                              <img
                                src={u.avatar_url}
                                alt={displayName}
                                className="w-8 h-8 rounded-full border border-[#1E5A54]/20 object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#1E5A54] text-[#EEE6E2] flex items-center justify-center font-bold text-xs shrink-0">
                                {displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-bold text-[#1E5A54] block truncate group-hover:text-[#F7623D] transition-colors">
                                {displayName}
                              </span>
                              <span className="text-[11px] text-[#1E5A54]/75 block truncate">
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Sign-in Methods Badges */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 flex-wrap">
                            {isGoogle && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/30">
                                Google
                              </span>
                            )}
                            {isPassword && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#1E5A54]/10 text-[#1E5A54] border border-[#1E5A54]/30">
                                Password
                              </span>
                            )}
                            {!isGoogle && !isPassword && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#1E5A54]/60 bg-[#1E5A54]/5">
                                User
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Country */}
                        <td className="py-3 px-4 text-[#1E5A54]/90 whitespace-nowrap">
                          {u.country ? (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-[#1E5A54]/60 shrink-0" />
                              <span>{u.country}</span>
                            </span>
                          ) : (
                            <span className="text-[#1E5A54]/40">—</span>
                          )}
                        </td>

                        {/* Online Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {u.online_now ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Online
                            </span>
                          ) : (
                            <span className="text-[#1E5A54]/60 text-[11px]">
                              {formatRelativeTime(u.last_seen_at)}
                            </span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className="py-3 px-4 text-[#1E5A54]/80 whitespace-nowrap text-[11px]">
                          {formatDhakaDateTime(u.last_login_at)}
                        </td>

                        {/* Last Seen */}
                        <td className="py-3 px-4 text-[#1E5A54]/80 whitespace-nowrap text-[11px]">
                          {formatRelativeTime(u.last_seen_at)}
                        </td>

                        {/* Total Active Time */}
                        <td className="py-3 px-4 font-mono font-semibold text-[#1E5A54] whitespace-nowrap">
                          {formatDuration(u.total_active_seconds)}
                        </td>

                        {/* Login Count */}
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#1E5A54]">
                          {u.login_count}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between p-4 border-t border-[#1E5A54]/15 bg-[#E2D7D1]/30 text-xs">
              <span className="text-[#1E5A54]/75 text-[11px]">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length} users
              </span>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage <= 1}
                  className="h-7 px-2.5 rounded-full text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </Button>
                <span className="px-2 font-mono text-[11px] text-[#1E5A54]">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="h-7 px-2.5 rounded-full text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Drawer / Detail Modal for selected user */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setUserDetail(null);
        }}
        title="User Engagement & Security Detail"
        description="Comprehensive audit of logins, connected providers, and engagement sessions."
        maxWidth="2xl"
      >
        {selectedUser && (
          <div className="space-y-6 pt-2">
            {/* User Header Profile */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#EEE6E2] border border-[#1E5A54]/20">
              {selectedUser.avatar_url ? (
                <img
                  src={selectedUser.avatar_url}
                  alt={selectedUser.full_name || 'User'}
                  className="w-14 h-14 rounded-full border border-[#1E5A54]/20 object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#1E5A54] text-[#EEE6E2] flex items-center justify-center font-bold text-xl">
                  {(selectedUser.full_name || selectedUser.email).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-headline text-lg uppercase text-[#1E5A54]">
                    {selectedUser.full_name || 'Unnamed Client'}
                  </h3>
                  {selectedUser.online_now && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                      Active Now
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#1E5A54]/80">{selectedUser.email}</p>

                {/* WhatsApp is shown only in this admin drawer */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#1E5A54]">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#1E5A54]/60" />
                    <span>{selectedUser.country || 'No country selected'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-[#F7623D]" />
                    <span className="text-[#1E5A54]">
                      WhatsApp:{' '}
                      <strong className="text-[#1E5A54]">
                        {selectedUser.whatsapp || 'Not provided'}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#1E5A54]/70">
                    <Calendar className="w-3.5 h-3.5 text-[#1E5A54]/60" />
                    <span>
                      Member since {formatDhakaDateTime(selectedUser.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-[#EEE6E2] border border-[#1E5A54]/15">
                <span className="text-[10px] uppercase font-mono text-[#1E5A54]/60 block mb-0.5">
                  Total Time Active
                </span>
                <span className="font-bold text-[#1E5A54] text-sm">
                  {formatDuration(selectedUser.total_active_seconds)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#EEE6E2] border border-[#1E5A54]/15">
                <span className="text-[10px] uppercase font-mono text-[#1E5A54]/60 block mb-0.5">
                  Sessions Count
                </span>
                <span className="font-bold text-[#1E5A54] text-sm">
                  {selectedUser.sessions_count || 0}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#EEE6E2] border border-[#1E5A54]/15">
                <span className="text-[10px] uppercase font-mono text-[#1E5A54]/60 block mb-0.5">
                  Total Logins
                </span>
                <span className="font-bold text-[#1E5A54] text-sm">
                  {selectedUser.login_count}
                </span>
              </div>
            </div>

            {detailLoading ? (
              <div className="p-6 text-center text-xs text-[#1E5A54]/60 animate-pulse">
                Retrieving recent logins and visit telemetry...
              </div>
            ) : userDetail ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Logins */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E5A54] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#F7623D]" />
                    <span>Recent Logins (Last 20)</span>
                  </h4>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {userDetail.logins && userDetail.logins.length > 0 ? (
                      userDetail.logins.map((lg) => (
                        <div
                          key={lg.id}
                          className="p-2.5 rounded-xl bg-[#EEE6E2]/70 border border-[#1E5A54]/10 text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                                  lg.provider === 'google'
                                    ? 'bg-[#4285F4]/10 text-[#4285F4]'
                                    : 'bg-[#1E5A54]/10 text-[#1E5A54]'
                                }`}
                              >
                                {lg.provider}
                              </span>
                              <span className="text-[10px] font-mono capitalize text-[#1E5A54]/75">
                                {lg.event}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#1E5A54]/60 block mt-0.5">
                              {formatDhakaDateTime(lg.created_at)}
                            </span>
                          </div>
                          <div className="text-right text-[10px] text-[#1E5A54]/70">
                            <span>{lg.country || 'Global'}</span>
                            <span className="block text-[#1E5A54]/50 capitalize">
                              {lg.device || 'desktop'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-[#1E5A54]/50 italic p-3 text-center">
                        No login events recorded yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Recent Sessions */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E5A54] flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#1E5A54]" />
                    <span>Recent Sessions (Last 20)</span>
                  </h4>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {userDetail.sessions && userDetail.sessions.length > 0 ? (
                      userDetail.sessions.map((sn) => (
                        <div
                          key={sn.id}
                          className="p-2.5 rounded-xl bg-[#EEE6E2]/70 border border-[#1E5A54]/10 text-xs flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-mono text-[11px] font-semibold text-[#1E5A54] truncate block">
                              {sn.landing_path || '/'}
                            </span>
                            <span className="text-[10px] text-[#1E5A54]/60 block">
                              {formatDhakaDateTime(sn.started_at)}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono text-[11px] font-bold text-[#1E5A54] block">
                              {formatDuration(sn.active_seconds)}
                            </span>
                            <span className="text-[10px] text-[#1E5A54]/60 capitalize">
                              {sn.device || 'desktop'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-[#1E5A54]/50 italic p-3 text-center">
                        No active sessions recorded yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  );
}
