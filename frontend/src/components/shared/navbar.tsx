'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Info,
  Layers,
  FolderGit2,
  Users,
  Mail,
  Terminal,
  User,
  ShieldCheck,
  ArrowUpRight,
  X,
  Github,
  Twitter,
  Linkedin,
  LogOut,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Logo } from '@/components/shared/logo';
import { MagneticWrap } from '@/components/human/magnetic-button';
import { HamburgerButton } from '@/components/ui/hamburger-button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: Home,
  About: Info,
  Services: Layers,
  Projects: FolderGit2,
  Team: Users,
  Contact: Mail,
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (session?.access_token) {
        await fetch('/api/auth/logout-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        }).catch(() => {});
      }
    } catch {}
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Top Header Bar */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-colors duration-200 bg-[#EEE6E2]/95 backdrop-blur-md',
          scrolled
            ? 'border-b border-[#1E5A54]/25 shadow-[0_2px_0_rgba(30,90,84,0.06)]'
            : 'border-b border-[#1E5A54]/18'
        )}
      >
        <div className="site-container-wide h-20 xl:h-22 flex items-center justify-between">
          {/* Left: Code-based Hamburger Button + Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <HamburgerButton
              isOpen={isOpen}
              onToggle={() => setIsOpen(!isOpen)}
              showLabel
              label="Menu"
              aria-label="Toggle navigation sidebar"
            />

            <div className="h-6 w-px bg-[#1E5A54]/20 hidden sm:block" />

            {/* Brand Logo */}
            <Logo variant="navbar" priority />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Small, Elegant Theme Selector (Sun/Moon) */}
            <ThemeToggle />

            {/* User Session Action (Desktop) */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-1.5 bg-[#F8F4F2] border border-[#1E5A54]/20 rounded-full pl-1.5 pr-2 py-1">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  title="View Client Workspace"
                >
                  {currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture ? (
                    <img
                      src={currentUser.user_metadata.avatar_url || currentUser.user_metadata.picture}
                      alt="Avatar"
                      className="w-5 h-5 rounded-full object-cover border border-[#1E5A54]/20"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#1E5A54] text-[#EEE6E2] flex items-center justify-center text-[10px] font-bold">
                      {(
                        currentUser.user_metadata?.full_name ||
                        currentUser.user_metadata?.name ||
                        currentUser.email ||
                        'U'
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#1E5A54] max-w-[100px] truncate">
                    {currentUser.user_metadata?.full_name?.split(' ')[0] ||
                      currentUser.user_metadata?.name?.split(' ')[0] ||
                      'Workspace'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign out"
                  className="p-1 rounded-full text-[#1E5A54]/60 hover:text-[#F7623D] hover:bg-[#1E5A54]/5 transition-colors cursor-pointer"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54]/5 transition-colors border border-transparent hover:border-[#1E5A54]/25"
                title="Client Portal Login"
              >
                <User className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>Sign in</span>
              </Link>
            )}

            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54]/5 transition-colors border border-transparent hover:border-[#1E5A54]/25"
              title="Admin Portal UI"
            >
              <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>Admin</span>
            </Link>

            <MagneticWrap>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1E5A54] hover:bg-[#16443F] px-4 py-2 text-xs font-semibold text-[#EEE6E2] transition-colors"
              >
                <span>Contact Us</span>
                <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
              </Link>
            </MagneticWrap>
          </div>
        </div>
      </header>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1E5A54]/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 sm:w-96 max-w-[88vw] bg-[#EEE6E2] border-r border-[#1E5A54]/25 shadow-2xl flex flex-col justify-between overflow-y-auto overscroll-contain transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-label="Navigation Sidebar"
        aria-modal="true"
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Top Header of Sidebar */}
        <div>
          <div className="flex items-center justify-between p-5 border-b border-[#1E5A54]/18 bg-[#F8F4F2]">
            <Logo variant="navbar" onClick={() => setIsOpen(false)} />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full text-[#1E5A54] hover:bg-[#1E5A54]/10 transition-colors"
              aria-label="Close navigation sidebar"
            >
              <X className="h-5 w-5 stroke-[1.75]" />
            </button>
          </div>

          {/* Navigation Links in Left Sidebar */}
          <div className="p-5 space-y-6">
            <div>
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#1E5A54]/60">
                Navigation
              </div>
              <nav className="space-y-1.5">
                {siteConfig.mainNav.map((item) => {
                  const isActive =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                  const Icon = navIconMap[item.title] || Terminal;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150',
                        isActive
                          ? 'bg-[#F8F4F2] text-[#1E5A54] font-bold border border-[#1E5A54]/25 shadow-[0_2px_0_rgba(30,90,84,0.06)]'
                          : 'text-[#1E5A54]/80 hover:text-[#1E5A54] hover:bg-[#F8F4F2]/60 font-semibold'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'transition-colors',
                            isActive
                              ? 'text-[#F7623D]'
                              : 'text-[#1E5A54]/70 group-hover:text-[#1E5A54]'
                          )}
                        >
                          <Icon className="h-4 w-4 stroke-[1.75]" />
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] relative inline-block">
                          {item.title}
                          {isActive && (
                            <span className="block h-[2px] w-full bg-[#F7623D] mt-0.5 rounded-full" />
                          )}
                        </span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Direct Access / Portal / Admin */}
            <div className="pt-4 border-t border-[#1E5A54]/15 space-y-2.5">
              <div className="px-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#1E5A54]/60">
                Direct Access
              </div>

              <MagneticWrap>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between w-full rounded-full border border-[#1E5A54] bg-[#F8F4F2] pl-4 pr-1.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all shadow-sm"
                >
                  <span>Book Architecture Call</span>
                  <span className="w-7 h-7 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
                    <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
                  </span>
                </Link>
              </MagneticWrap>

              <div className="grid grid-cols-2 gap-2">
                {currentUser ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em] text-[#1E5A54] bg-[#F8F4F2] border border-[#1E5A54]/20 hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors truncate"
                    >
                      <User className="h-3.5 w-3.5 stroke-[1.5] shrink-0" />
                      <span className="truncate">
                        {currentUser.user_metadata?.full_name?.split(' ')[0] || 'Workspace'}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em] text-[#F7623D] bg-[#F8F4F2] border border-[#F7623D]/25 hover:bg-[#F7623D] hover:text-[#EEE6E2] transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em] text-[#1E5A54] bg-[#F8F4F2] border border-[#1E5A54]/20 hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
                    >
                      <User className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span>Sign in</span>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em] text-[#1E5A54] bg-[#F8F4F2] border border-[#1E5A54]/20 hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span>Admin</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="p-5 border-t border-[#1E5A54]/15 bg-[#EAE1DC]/50">
          <div className="flex items-center justify-between px-2 text-[#1E5A54]/75">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F7623D] transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F7623D] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F7623D] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#1E5A54]/50">
              Est. 2021
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
