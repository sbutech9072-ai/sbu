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
    <div className="flex h-full flex-col justify-between p-4 bg-slate-950 border-r border-slate-800">
      {/* Top Brand */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-2">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1">
                Sbu<span className="text-blue-400">Tech</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase block">
                Admin Console
              </span>
            </div>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
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
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Public Website</span>
          </span>
          <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
            Live
          </span>
        </Link>

        <Link
          href="/admin/login"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit / Re-authenticate</span>
        </Link>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Shield className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300 block">Mock Admin Mode</span>
            <span>All forms operate with local memory state. No live database.</span>
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 h-full z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}

