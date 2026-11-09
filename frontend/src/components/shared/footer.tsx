'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Github, Twitter, Linkedin } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-[#1E5A54]/18 bg-[#EEE6E2] text-[#1E5A54] transition-colors duration-200">
      <div className="site-container-wide py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Brand Logo & Short One-line Company Description */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="h-9 w-9 rounded-full border border-[#1E5A54] bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] transition-transform group-hover:scale-105 shadow-sm">
                <Terminal className="h-4 w-4 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-xl font-bold tracking-tight text-[#1E5A54] uppercase flex items-center gap-1 leading-none">
                  Sbu <span className="text-[#1E5A54] decoration-[#F7623D]">Tech</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#1E5A54]/70 mt-0.5">
                  Software Studio
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-[#1E5A54]/20" aria-hidden="true" />

            <p className="text-xs text-[#1E5A54]/75 max-w-md font-sans leading-relaxed">
              Software engineering studio building production web platforms, cloud infrastructure, and private AI systems.
            </p>
          </div>

          {/* Right: Social Media Icons (Genuine Links Only) */}
          <div className="flex items-center gap-2 shrink-0">
            {siteConfig.links.github && (
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-[#1E5A54]/30 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-3.5 w-3.5 stroke-[1.75]" />
              </a>
            )}
            {siteConfig.links.twitter && (
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-[#1E5A54]/30 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="h-3.5 w-3.5 stroke-[1.75]" />
              </a>
            )}
            {siteConfig.links.linkedin && (
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-[#1E5A54]/30 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5 stroke-[1.75]" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright Text & Legal Link */}
        <div className="mt-6 pt-6 border-t border-[#1E5A54]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#1E5A54]/75">
          <p className="font-mono tracking-tight text-[11px]">
            © 2026 SBU TECH. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.14em]">
            <Link
              href="/privacy-policy"
              className="hover:text-[#F7623D] transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
