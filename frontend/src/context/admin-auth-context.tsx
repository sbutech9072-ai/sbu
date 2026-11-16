'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type AdminRole = 'main_owner' | 'co_owner' | 'member';

export interface AdminAccount {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  permissions: string[];
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  last_login_at: string | null;
  last_seen_at: string | null;
  password_changed_at: string | null;
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  main_owner: 'Main Owner',
  co_owner: 'Co-owner',
  member: 'Member',
};

export const MEMBER_PERMISSION_OPTIONS = [
  { key: 'overview', label: 'Overview & Traffic' },
  { key: 'users', label: 'Site Users & Activity' },
  { key: 'projects', label: 'Projects' },
  { key: 'team', label: 'Team Members' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'messages', label: 'Messages' },
] as const;

interface AdminAuthContextValue {
  adminUser: AdminAccount | null;
  loading: boolean;
  error: string | null;
  refreshAdminUser: () => Promise<void>;
  canAccessPath: (pathname: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  adminUser: null,
  loading: true,
  error: null,
  refreshAdminUser: async () => {},
  canAccessPath: () => true,
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAdminUser = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/me', { cache: 'no-store' });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) {
        setError('Unable to verify administrator session.');
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { user?: AdminAccount };
      if (data.user) {
        setAdminUser(data.user);
        setError(null);
      }
    } catch {
      setError('Connection error while verifying administrator session.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAdminUser();
  }, [refreshAdminUser]);

  const canAccessPath = useCallback(
    (pathname: string): boolean => {
      if (!adminUser) return false;
      if (adminUser.role === 'main_owner') return true;
      if (pathname === '/admin/settings' || pathname.startsWith('/admin/settings/')) {
        return false;
      }
      if (adminUser.role === 'co_owner') return true;

      if (pathname === '/admin/accounts' || pathname.startsWith('/admin/accounts/')) {
        return false;
      }
      const perms = adminUser.permissions || [];
      if (pathname === '/admin/users' || pathname.startsWith('/admin/users/')) {
        return perms.includes('users');
      }
      if (pathname === '/admin/projects' || pathname.startsWith('/admin/projects/')) {
        return perms.includes('projects');
      }
      if (pathname === '/admin/team' || pathname.startsWith('/admin/team/')) {
        return perms.includes('team');
      }
      if (pathname === '/admin/testimonials' || pathname.startsWith('/admin/testimonials/')) {
        return perms.includes('testimonials');
      }
      if (pathname === '/admin/messages' || pathname.startsWith('/admin/messages/')) {
        return perms.includes('messages');
      }
      return true;
    },
    [adminUser]
  );

  return (
    <AdminAuthContext.Provider
      value={{ adminUser, loading, error, refreshAdminUser, canAccessPath }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
