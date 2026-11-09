'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen flex bg-[#EEE6E2] text-[#1E5A54] selection:bg-[#1E5A54] selection:text-[#EEE6E2]">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8 site-container-wide space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
