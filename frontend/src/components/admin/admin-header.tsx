'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, Search, ExternalLink, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Open Admin Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Healthy • Local Mock State Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick link to public website */}
        <Button asChild variant="outline" size="sm" className="hidden md:inline-flex text-xs h-8 gap-1.5 border-slate-800">
          <Link href="/" target="_blank">
            <span>View Public Site</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="3 Unread Inquiries"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            ST
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-white">Admin Operator</span>
            <span className="text-[10px] text-slate-400">Mock Session</span>
          </div>
        </div>
      </div>
    </header>
  );
}

