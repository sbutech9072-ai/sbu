'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  RefreshCw,
  KeyRound,
  Pencil,
  Trash2,
  Power,
  CheckCircle2,
  AlertCircle,
  History,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import {
  ADMIN_ROLE_LABELS,
  AdminAccount,
  MEMBER_PERMISSION_OPTIONS,
  useAdminAuth,
} from '@/context/admin-auth-context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { StatsCard } from '@/components/admin/stats-card';

interface AuditLogEntry {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_role: string | null;
  target_id: string | null;
  target_email: string | null;
  action: string;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

const DEFAULT_MEMBER_PERMS = ['overview', 'projects', 'team', 'testimonials', 'messages'];

function formatDateTime(iso: string | null): string {
  if (!iso) return 'Never';
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export default function AdminAccountsPage() {
  const { adminUser } = useAdminAuth();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Create Member modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createShowPw, setCreateShowPw] = useState(false);
  const [createPerms, setCreatePerms] = useState<string[]>(DEFAULT_MEMBER_PERMS);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal
  const [editTarget, setEditTarget] = useState<AdminAccount | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPerms, setEditPerms] = useState<string[]>([]);

  // Reset password modal
  const [resetTarget, setResetTarget] = useState<AdminAccount | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetShowPw, setResetShowPw] = useState(false);

  const isMainOwner = adminUser?.role === 'main_owner';
  const isCoOwner = adminUser?.role === 'co_owner';
  const canManage = isMainOwner || isCoOwner;

  const loadData = useCallback(async () => {
    if (!canManage) return;
    setLoading(true);
    try {
      const [accRes, logRes] = await Promise.all([
        fetch('/api/admin/accounts', { cache: 'no-store' }),
        fetch('/api/admin/audit-logs', { cache: 'no-store' }),
      ]);
      if (accRes.ok) {
        const accData = (await accRes.json()) as { accounts?: AdminAccount[] };
        setAccounts(accData.accounts || []);
      }
      if (logRes.ok) {
        const logData = (await logRes.json()) as { logs?: AuditLogEntry[] };
        setAuditLogs(logData.logs || []);
      }
    } catch {
      setFeedback({ type: 'error', text: 'Failed to load administrator accounts.' });
    } finally {
      setLoading(false);
    }
  }, [canManage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 5000);
  };

  const togglePermission = (
    perm: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(
      current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm]
    );
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: createName,
          email: createEmail,
          password: createPassword,
          permissions: createPerms,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        showNotice('error', body.error || 'Failed to create member account.');
        return;
      }
      setCreateOpen(false);
      setCreateName('');
      setCreateEmail('');
      setCreatePassword('');
      setCreatePerms(DEFAULT_MEMBER_PERMS);
      showNotice('success', 'Member account created successfully.');
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (account: AdminAccount) => {
    setEditTarget(account);
    setEditName(account.full_name);
    setEditEmail(account.email);
    setEditPerms(account.permissions || []);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        full_name: editName,
      };
      if (editTarget.role === 'member') {
        payload.email = editEmail;
        payload.permissions = editPerms;
      }

      const res = await fetch(`/api/admin/accounts/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        showNotice('error', body.error || 'Failed to update account.');
        return;
      }
      setEditTarget(null);
      showNotice('success', 'Account details updated.');
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (account: AdminAccount) => {
    const nextState = !account.is_active;
    const res = await fetch(`/api/admin/accounts/${account.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: nextState }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      showNotice('error', body.error || 'Failed to change account status.');
      return;
    }
    showNotice(
      'success',
      nextState
        ? `${account.full_name} has been enabled.`
        : `${account.full_name} has been disabled and active sessions revoked.`
    );
    await loadData();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/accounts/${resetTarget.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: resetPassword }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        showNotice('error', body.error || 'Failed to reset password.');
        return;
      }
      setResetTarget(null);
      setResetPassword('');
      showNotice('success', 'Password reset and previous sessions invalidated.');
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (account: AdminAccount) => {
    if (!window.confirm(`Permanently delete Member account "${account.full_name}" (${account.email})?`)) {
      return;
    }
    const res = await fetch(`/api/admin/accounts/${account.id}`, {
      method: 'DELETE',
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      showNotice('error', body.error || 'Failed to delete member.');
      return;
    }
    showNotice('success', `Member account ${account.email} deleted.`);
    await loadData();
  };

  const activeCount = accounts.filter((a) => a.is_active).length;
  const disabledCount = accounts.length - activeCount;

  const canModifyTarget = (target: AdminAccount): boolean => {
    if (isMainOwner) return target.role !== 'main_owner';
    if (isCoOwner) return target.role === 'member';
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E5A54]/20">
        <div>
          <h1 className="font-headline text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#F7623D]" />
            <span>{isMainOwner ? 'Admin Account Management' : 'Member Management'}</span>
          </h1>
          <p className="text-xs text-[#1E5A54] mt-1">
            {isMainOwner
              ? 'Manage Co-owner and Member accounts, permissions, password resets, and security audit logs.'
              : 'Create, edit, enable/disable, and reset passwords for Member accounts.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-1.5 text-xs rounded-full"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-1.5 text-xs rounded-full"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Create Member</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3.5 rounded-2xl border text-xs font-medium ${
            feedback.type === 'success'
              ? 'border-[#1E5A54]/30 bg-[#F8F4F2] text-[#1E5A54]'
              : 'border-[#F7623D]/40 bg-[#F7623D]/10 text-[#1E5A54]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-[#1E5A54] shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-[#F7623D] shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title={isMainOwner ? 'Total Admin Accounts' : 'Total Members'}
          value={accounts.length}
          icon={ShieldCheck}
          helper={isMainOwner ? 'Main Owner, Co-owner & Members' : 'Managed Member accounts'}
        />
        <StatsCard
          title="Active Accounts"
          value={activeCount}
          icon={Power}
          helper="Permitted to sign in"
        />
        <StatsCard
          title="Disabled Accounts"
          value={disabledCount}
          icon={Lock}
          helper="Sessions immediately revoked"
        />
      </div>

      {/* Accounts Table */}
      <Card className="p-6 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E5A54]/20">
          <h2 className="font-headline text-xl uppercase text-[#1E5A54]">
            {isMainOwner ? 'All Administrator Accounts' : 'Member Accounts'}
          </h2>
          <span className="text-[11px] font-mono text-[#1E5A54]">
            {accounts.length} account(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E5A54]/20 text-[11px] uppercase tracking-wider text-[#1E5A54]/70">
                <th className="py-3 pr-4">Administrator</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Permissions</th>
                <th className="py-3 pr-4">Last Login</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E5A54]/10">
              {accounts.map((acc) => {
                const editable = canModifyTarget(acc);
                return (
                  <tr key={acc.id} className="hover:bg-[#EEE6E2]/60 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-[#1E5A54]">{acc.full_name}</div>
                      <div className="text-[11px] font-mono text-[#1E5A54]/80">{acc.email}</div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge
                        variant={acc.role === 'main_owner' ? 'default' : 'outline'}
                        className="rounded-full text-[10px] font-mono uppercase"
                      >
                        {ADMIN_ROLE_LABELS[acc.role]}
                      </Badge>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          acc.is_active
                            ? 'bg-[#1E5A54]/10 text-[#1E5A54]'
                            : 'bg-[#F7623D]/15 text-[#F7623D]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            acc.is_active ? 'bg-[#1E5A54]' : 'bg-[#F7623D]'
                          }`}
                        />
                        {acc.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 max-w-[220px]">
                      {acc.role === 'main_owner' ? (
                        <span className="text-[11px] font-mono text-[#1E5A54]">Unrestricted</span>
                      ) : acc.role === 'co_owner' ? (
                        <span className="text-[11px] font-mono text-[#1E5A54]">
                          All except Owner Settings
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(acc.permissions || []).map((p) => (
                            <span
                              key={p}
                              className="px-2 py-0.5 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/20 text-[10px] font-mono"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-[11px] font-mono">
                      {formatDateTime(acc.last_login_at)}
                    </td>
                    <td className="py-3.5 text-right">
                      {editable ? (
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(acc)}
                            className="h-7 px-2.5 text-[11px] rounded-full gap-1"
                            title="Edit account"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setResetTarget(acc);
                              setResetPassword('');
                            }}
                            className="h-7 px-2.5 text-[11px] rounded-full gap-1"
                            title="Reset password"
                          >
                            <KeyRound className="h-3 w-3" />
                            <span>Reset</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(acc)}
                            className="h-7 px-2.5 text-[11px] rounded-full gap-1"
                            title={acc.is_active ? 'Disable account' : 'Enable account'}
                          >
                            <Power className="h-3 w-3" />
                            <span>{acc.is_active ? 'Disable' : 'Enable'}</span>
                          </Button>
                          {isMainOwner && acc.role === 'member' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMember(acc)}
                              className="h-7 px-2.5 text-[11px] rounded-full gap-1 border-[#F7623D]/40 text-[#F7623D] hover:bg-[#F7623D]/10"
                              title="Delete member"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-[#1E5A54]/60">
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {!loading && accounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#1E5A54]/70">
                    No accounts found. Use &ldquo;Create Member&rdquo; to add a Member account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Audit Logs */}
      <Card className="p-6 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E5A54]/20">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#F7623D]" />
            <h2 className="font-headline text-xl uppercase text-[#1E5A54]">
              {isMainOwner ? 'Admin Activity & Login History' : 'Member Activity & Login History'}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#1E5A54]">Last 100 events</span>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E5A54]/20 text-[11px] uppercase tracking-wider text-[#1E5A54]/70">
                <th className="py-2.5 pr-4">Timestamp</th>
                <th className="py-2.5 pr-4">Actor</th>
                <th className="py-2.5 pr-4">Action</th>
                <th className="py-2.5 pr-4">Target</th>
                <th className="py-2.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E5A54]/10">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#EEE6E2]/50">
                  <td className="py-2.5 pr-4 font-mono text-[11px] whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="font-medium">{log.actor_email || 'system'}</span>
                    {log.actor_role && (
                      <span className="ml-1.5 text-[10px] font-mono text-[#1E5A54]/70">
                        ({log.actor_role})
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/20 text-[10px] font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-[11px]">
                    {log.target_email || '—'}
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-[#1E5A54]/70">
                    {log.ip_address || '—'}
                  </td>
                </tr>
              ))}
              {!loading && auditLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-xs text-[#1E5A54]/70">
                    No audit events recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Member Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Member Account"
        description="Assign a Gmail address, password, and authorized dashboard permissions."
      >
        <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Full Name</label>
            <Input
              required
              minLength={2}
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="e.g. Alex Rahman"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Gmail Address</label>
            <Input
              required
              type="email"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              placeholder="member@gmail.com"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Initial Password (min 8 chars)</label>
            <div className="relative">
              <Input
                required
                minLength={8}
                type={createShowPw ? 'text' : 'password'}
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="••••••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setCreateShowPw(!createShowPw)}
                className="absolute right-3 top-2.5 text-[#1E5A54]"
                aria-label="Toggle password visibility"
              >
                {createShowPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-[#1E5A54] block">Authorized Pages</label>
            <div className="grid grid-cols-2 gap-2">
              {MEMBER_PERMISSION_OPTIONS.map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2]/60 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={createPerms.includes(opt.key)}
                    onChange={() => togglePermission(opt.key, createPerms, setCreatePerms)}
                    className="accent-[#1E5A54]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="rounded-full">
              {submitting ? 'Creating...' : 'Create Member'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Account Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Edit ${editTarget ? ADMIN_ROLE_LABELS[editTarget.role] : 'Account'}`}
        description={
          editTarget?.role === 'co_owner'
            ? 'Co-owner Gmail address is permanently fixed.'
            : 'Update Member details and authorized dashboard permissions.'
        }
      >
        <form onSubmit={handleEditSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Full Name</label>
            <Input
              required
              minLength={2}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Gmail Address</label>
            <Input
              required
              type="email"
              value={editEmail}
              disabled={editTarget?.role !== 'member'}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>

          {editTarget?.role === 'member' && (
            <div className="space-y-2">
              <label className="font-semibold text-[#1E5A54] block">Authorized Pages</label>
              <div className="grid grid-cols-2 gap-2">
                {MEMBER_PERMISSION_OPTIONS.map((opt) => (
                  <label
                    key={opt.key}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2]/60 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editPerms.includes(opt.key)}
                      onChange={() => togglePermission(opt.key, editPerms, setEditPerms)}
                      className="accent-[#1E5A54]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditTarget(null)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="rounded-full">
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={!!resetTarget}
        onClose={() => setResetTarget(null)}
        title="Reset Account Password"
        description={`Resetting the password for ${resetTarget?.email} will immediately invalidate all active sessions for this account.`}
      >
        <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">New Password (min 8 chars)</label>
            <div className="relative">
              <Input
                required
                minLength={8}
                type={resetShowPw ? 'text' : 'password'}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setResetShowPw(!resetShowPw)}
                className="absolute right-3 top-2.5 text-[#1E5A54]"
                aria-label="Toggle password visibility"
              >
                {resetShowPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResetTarget(null)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="rounded-full">
              {submitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
