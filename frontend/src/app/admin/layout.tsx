'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminAuthProvider, useAdminAuth } from '@/context/admin-auth-context';
import { Button } from '@/components/ui/button';

function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { adminUser, loading, canAccessPath } = useAdminAuth();

  const isRestricted = !loading && adminUser && !canAccessPath(pathname);

  return (
    <div className="min-h-screen flex bg-[#EEE6E2] text-[#1E5A54] selection:bg-[#1E5A54] selection:text-[#EEE6E2]">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8 w-full max-w-[3200px] mx-auto space-y-6">
          {isRestricted ? (
            <div className="max-w-lg mx-auto mt-12 p-8 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#F7623D]/15 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-[#F7623D]" />
              </div>
              <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
                Access Restricted
              </h2>
              <p className="text-xs text-[#1E5A54] leading-relaxed">
                Your current role does not have permission to view this section of the SBU TECH Control Desk.
              </p>
              <Button asChild size="sm" className="rounded-full gap-1.5 text-xs">
                <Link href="/admin">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Overview</span>
                </Link>
              </Button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If on admin login page, display login without full admin sidebar
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-[#EEE6E2] text-[#1E5A54] flex flex-col justify-center">
        {children}
      </div>
    );
  }

  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
