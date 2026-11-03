'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ShieldCheck, Terminal, User } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
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
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Sbu<span className="text-blue-400">Tech</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              Software Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {siteConfig.mainNav.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'text-white bg-slate-800/80 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-800"
            title="Client Portal Login"
          >
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>Portal</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-800"
            title="Admin Portal UI"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span>Admin</span>
          </Link>

          <Button asChild size="default" className="rounded-xl shadow-lg shadow-blue-600/20 gap-1.5">
            <Link href="/get-a-quote">
              <span>Get a Quote</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" className="text-xs h-9 px-3">
            <Link href="/get-a-quote">Quote</Link>
          </Button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            {siteConfig.mainNav.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-3 text-base font-medium rounded-xl transition-colors flex items-center justify-between',
                    isActive
                      ? 'text-white bg-blue-600/20 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  )}
                >
                  <span>{item.title}</span>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            <Button asChild className="w-full justify-center">
              <Link href="/get-a-quote">Get a Free Quote</Link>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" className="w-full justify-center text-xs">
                <Link href="/login">
                  <User className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                  Client Portal
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-center text-xs">
                <Link href="/admin">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
