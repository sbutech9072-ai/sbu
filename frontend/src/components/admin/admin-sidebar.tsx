'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Users,
  BookOpen,
  Quote,
  Mail,
  FileSpreadsheet,
  Settings,
  Terminal,
  ExternalLink,
  LogOut,
  Shield,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  Overview: <LayoutDashboard className="h-4 w-4" />,
  Projects: <FolderGit2 className="h-4 w-4" />,
  Services: <Cpu className="h-4 w-4" />,
  'Team Members': <Users className="h-4 w-4" />,
  'Blog Posts': <BookOpen className="h-4 w-4" />,
  Testimonials: <Quote className="h-4 w-4" />,
  Messages: <Mail className="h-4 w-4" />,
  'Quote Requests': <FileSpreadsheet className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
};

const adminLinks = [
  { title: 'Overview', href: '/admin' },
  { title: 'Projects', href: '/admin/projects' },
  { title: 'Services', href: '/admin/services' },
  { title: 'Team Members', href: '/admin/team' },
  { title: 'Blog Posts', href: '/admin/blogs' },
  { title: 'Testimonials', href: '/admin/testimonials' },
  { title: 'Messages', href: '/admin/messages' },
  { title: 'Quote Requests', href: '/admin/quote-requests' },
  { title: 'Settings', href: '/admin/settings' },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-[#E2D7D1] border-r border-[#1E5A54]/20">
      {/* Top Brand */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-2">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#1E5A54] flex items-center justify-center text-[#EEE6E2]">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <span className="font-headline text-lg uppercase text-[#1E5A54] tracking-tight flex items-center gap-1 leading-none">
                Sbu<span className="text-[#F7623D]">Tech</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#1E5A54]/85 uppercase block mt-0.5">
                Admin Desk
              </span>
            </div>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-[#1E5A54] hover:bg-[#EEE6E2] rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {adminLinks.map((item) => {
            const isActive =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-[#1E5A54] text-[#EEE6E2] font-semibold'
                    : 'text-[#1E5A54]/85 hover:text-[#1E5A54] hover:bg-[#EEE6E2]'
                )}
              >
                {iconMap[item.title] || <LayoutDashboard className="h-4 w-4" />}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Links */}
      <div className="space-y-2 pt-4 border-t border-[#1E5A54]/20">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[#1E5A54]/85 hover:text-[#1E5A54] hover:bg-[#EEE6E2] rounded-full transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Public Website</span>
          </span>
          <span className="text-[10px] font-mono bg-[#EEE6E2] border border-[#1E5A54]/25 px-2 py-0.5 rounded-full text-[#1E5A54]">
            Live
          </span>
        </Link>

        <Link
          href="/admin/login"
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#F7623D] hover:bg-[#EEE6E2] rounded-full transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit / Re-authenticate</span>
        </Link>

        <div className="p-3 rounded-2xl bg-[#F8F4F2] border border-[#1E5A54]/25 text-[11px] text-[#1E5A54] flex items-start gap-2">
          <Shield className="h-4 w-4 text-[#F7623D] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#1E5A54] block">Mock Admin Mode</span>
            <span className="text-[#1E5A54]/85">
              All forms run in browser state. No live database connected.
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#1E5A54]/40"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 h-full z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
