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
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { MagneticWrap } from '@/components/human/magnetic-button';
import { HamburgerButton } from '@/components/ui/hamburger-button';
import { cn } from '@/lib/utils';

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
  const pathname = usePathname();

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
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-full border border-[#1E5A54] bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] transition-transform group-hover:scale-105 shadow-sm">
                <Terminal className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-2xl font-bold tracking-tight text-[#1E5A54] uppercase flex items-center gap-1 leading-none">
                  Sbu <span className="text-[#1E5A54] decoration-[#F7623D]">Tech</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1E5A54] mt-0.5">
                  Software Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54]/5 transition-colors border border-transparent hover:border-[#1E5A54]/25"
              title="Client Portal Login"
            >
              <User className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>Portal</span>
            </Link>

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
                href="/get-a-quote"
                className="group flex items-center gap-2.5 sm:gap-3 rounded-full border border-[#1E5A54] bg-[#F8F4F2] pl-4 sm:pl-5 pr-1.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all shadow-sm"
              >
                <span>Get a Quote</span>
                <span className="w-6 h-6 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
                </span>
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
          'fixed inset-y-0 left-0 z-50 w-80 sm:w-96 max-w-[88vw] bg-[#EEE6E2] border-r border-[#1E5A54]/25 shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-label="Navigation Sidebar"
        aria-modal="true"
      >
        {/* Top Header of Sidebar */}
        <div>
          <div className="flex items-center justify-between p-5 border-b border-[#1E5A54]/18 bg-[#F8F4F2]">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="h-10 w-10 rounded-full border border-[#1E5A54] bg-[#EEE6E2] flex items-center justify-center text-[#1E5A54] shrink-0 transition-transform group-hover:scale-105 shadow-sm">
                <Terminal className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-xl font-bold tracking-tight text-[#1E5A54] uppercase flex items-center gap-1 leading-none">
                  Sbu <span className="text-[#1E5A54] decoration-[#F7623D]">Tech</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.22em] text-[#1E5A54]/75 mt-1">
                  Software Studio
                </span>
              </div>
            </Link>

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
