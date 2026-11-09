'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Terminal, User, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { MagneticWrap } from '@/components/human/magnetic-button';
import { cn } from '@/lib/utils';

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-colors duration-200 bg-[#EEE6E2]',
        scrolled
          ? 'border-b border-[#1E5A54]/25 shadow-[0_2px_0_rgba(30,90,84,0.06)]'
          : 'border-b border-[#1E5A54]/18'
      )}
    >
      <div className="site-container-wide h-20 xl:h-22 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-full border border-[#1E5A54] bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] transition-transform group-hover:scale-105">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 2xl:gap-10">
          {siteConfig.mainNav.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-xs font-bold uppercase tracking-[0.18em] transition-colors py-1',
                  isActive
                    ? 'text-[#1E5A54] border-b-2 border-[#F7623D]'
                    : 'text-[#1E5A54] hover:text-[#F7623D]'
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54]/5 transition-colors border border-transparent hover:border-[#1E5A54]/25"
            title="Client Portal Login"
          >
            <User className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>Portal</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54]/5 transition-colors border border-transparent hover:border-[#1E5A54]/25"
            title="Admin Portal UI"
          >
            <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>Admin</span>
          </Link>

          {/* Secondary outlined pill button with small orange circle holding white arrow */}
          <MagneticWrap>
            <Link
              href="/get-a-quote"
              className="group flex items-center gap-3 rounded-full border border-[#1E5A54] bg-[#F8F4F2] pl-5 pr-1.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all"
            >
              <span>Get a Quote</span>
              <span className="w-6 h-6 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
              </span>
            </Link>
          </MagneticWrap>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/get-a-quote"
            className="rounded-full bg-[#1E5A54] border-2 border-[#F7623D] text-[#EEE6E2] text-xs font-bold uppercase tracking-[0.14em] px-3.5 py-2 inline-flex items-center gap-1"
          >
            <span>Quote</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full text-[#1E5A54] hover:bg-[#1E5A54]/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6 stroke-[1.5]" /> : <Menu className="h-6 w-6 stroke-[1.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-[#1E5A54]/20 bg-[#EEE6E2] px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            {siteConfig.mainNav.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] rounded-full transition-colors flex items-center justify-between',
                    isActive
                      ? 'bg-[#1E5A54] text-[#EEE6E2]'
                      : 'text-[#1E5A54] hover:bg-[#1E5A54]/10'
                  )}
                >
                  <span>{item.title}</span>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[#F7623D]" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#1E5A54]/20 flex flex-col gap-2">
            <Link
              href="/get-a-quote"
              className="w-full rounded-full bg-[#1E5A54] border-2 border-[#F7623D] text-[#EEE6E2] text-center py-3 text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2"
            >
              <span>Get a Project Estimate</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                className="w-full rounded-full border border-[#1E5A54] text-[#1E5A54] text-center py-2 text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-1.5 hover:bg-[#1E5A54]/5"
              >
                <User className="h-3.5 w-3.5" />
                <span>Portal</span>
              </Link>
              <Link
                href="/admin"
                className="w-full rounded-full border border-[#1E5A54] text-[#1E5A54] text-center py-2 text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-1.5 hover:bg-[#1E5A54]/5"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
