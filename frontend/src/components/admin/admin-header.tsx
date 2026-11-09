'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-[#1E5A54]/20 bg-[#EEE6E2] px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#1E5A54] hover:bg-[#E2D7D1] rounded-full transition-colors"
          aria-label="Open Admin Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#1E5A54] font-mono">
          <span className="h-2 w-2 rounded-full bg-[#F7623D]" />
          <span>Studio Ledger • Local Mock State Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Subtle Theme Toggle in Admin */}
        <ThemeToggle />

        {/* Quick link to public website */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hidden md:inline-flex text-xs h-8 gap-1.5 rounded-full border-[#1E5A54]/30 text-[#1E5A54] hover:bg-[#E2D7D1]"
        >
          <Link href="/" target="_blank">
            <span>View Public Site</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-2 text-[#1E5A54] hover:bg-[#E2D7D1] rounded-full transition-colors"
          title="3 Unread Inquiries"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#F7623D]" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#1E5A54]/20">
          <div className="h-8 w-8 rounded-full bg-[#1E5A54] flex items-center justify-center text-xs font-bold text-[#EEE6E2]">
            ST
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#1E5A54]">Admin Operator</span>
            <span className="text-[10px] font-mono text-[#1E5A54]">Mock Session</span>
          </div>
        </div>
      </div>
    </header>
  );
}
