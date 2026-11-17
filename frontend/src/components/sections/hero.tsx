import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Cpu, Layers, ShieldCheck, Zap } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ArchitectureNodeOrb } from '@/components/human/architecture-node-orb';

export function Hero() {
  const coreDisciplines = [
    'Next.js 15 App Router',
    'Strict TypeScript',
    'PostgreSQL & pgvector',
    'Kubernetes / Cloudflare',
    'Private RAG Architecture',
  ];

  return (
    <section className="relative pt-10 pb-14 md:pt-16 md:pb-20 bg-[#EEE6E2] dark:bg-[#08090B] overflow-hidden">
      {/* Subtle Architectural Blueprint Grid Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #1E5A54 1px, transparent 1px), linear-gradient(to bottom, #1E5A54 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%)',
        }}
      />

      <div className="site-container relative space-y-12 md:space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Studio Status Pill (Anchors top boundary and removes blank headspace) */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#1E5A54]/18 dark:border-white/15 bg-[#F8F4F2]/80 dark:bg-[#15181C]/90 shadow-2xs backdrop-blur-xs text-xs font-medium text-[#1E5A54] dark:text-[#F5F1EA]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#1E5A54]/85 dark:text-[#A9ADB3]">
                Studio Status: Active
              </span>
              <span className="h-2.5 w-px bg-[#1E5A54]/20 dark:bg-white/15" />
              <span className="text-[11px] font-semibold text-[#F7623D] dark:text-[#FF642D]">
                Systems Architecture & Engineering
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl xl:text-[4.25rem] font-extrabold tracking-tight text-[#1E5A54] dark:text-[#F5F1EA] leading-[1.06]">
              High-throughput cloud platforms and private AI systems.
            </h1>

            {/* Concise Mission Paragraph */}
            <p className="text-base sm:text-lg md:text-xl text-[#1E5A54]/80 dark:text-[#A9ADB3] max-w-2xl leading-relaxed font-sans">
              Sbu Tech is a senior software engineering studio in San Francisco. We partner directly
              with founders and CTOs to design and ship web platforms, Kubernetes clusters, and
              private LLM workflows built for real production traffic.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                href="/contact"
                className="w-full sm:w-auto rounded-lg bg-[#1E5A54] hover:bg-[#16443F] dark:bg-[#FF642D] dark:hover:bg-[#E05330] text-[#EEE6E2] dark:text-[#08090B] text-sm font-semibold px-6 py-3.5 inline-flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <span>Book a consultation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/projects"
                className="w-full sm:w-auto rounded-lg border border-[#1E5A54]/30 dark:border-white/15 bg-[#F8F4F2] dark:bg-[#15181C] text-[#1E5A54] dark:text-[#F5F1EA] hover:border-[#1E5A54] hover:bg-[#E2D7D1]/40 text-sm font-semibold px-6 py-3.5 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>View case studies</span>
                <ArrowUpRight className="h-4 w-4 text-[#F7623D] dark:text-[#FF642D]" />
              </Link>
            </div>

            {/* Architecture Stack Micro-Pills (Fills the awkward lower void with authentic tech tags) */}
            <div className="pt-3 border-t border-[#1E5A54]/12 dark:border-white/10 space-y-2 select-none">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#1E5A54]/60 dark:text-[#A9ADB3]/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D] dark:bg-[#FF642D]" />
                <span>Production Stack & Capabilities</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {coreDisciplines.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8F4F2] dark:bg-[#15181C] border border-[#1E5A54]/15 dark:border-[#292D32] text-[11px] font-medium text-[#1E5A54]/90 dark:text-[#D9DDE2] shadow-2xs hover:border-[#1E5A54]/35 transition-colors"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#F7623D] dark:bg-[#FF642D]" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right 3D Architectural Visual */}
          <div className="lg:col-span-5 w-full">
            <ArchitectureNodeOrb variant="hero" />
          </div>
        </div>

        {/* Metrics Strip - Transformed into Structured Architectural Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 pt-2">
          {siteConfig.stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="group relative p-5 sm:p-6 rounded-xl border border-[#1E5A54]/16 dark:border-[#292D32] bg-[#F8F4F2]/75 dark:bg-[#15181C]/80 hover:bg-[#F8F4F2] dark:hover:bg-[#15181C] hover:border-[#1E5A54]/35 dark:hover:border-white/25 transition-all duration-300 shadow-2xs flex flex-col justify-between"
            >
              {/* Top Index Marker */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#1E5A54]/50 dark:text-[#A9ADB3]/60 mb-3 select-none">
                <span>// 0{idx + 1}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D] dark:bg-[#FF642D] opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Value */}
              <div className="font-headline text-3xl sm:text-4xl font-extrabold text-[#1E5A54] dark:text-[#F5F1EA] tracking-tight tabular-nums">
                {stat.value}
              </div>

              {/* Label & Description */}
              <div className="mt-2.5 space-y-1">
                <div className="text-sm font-bold text-[#1E5A54] dark:text-[#F5F1EA]">{stat.label}</div>
                <p className="text-xs text-[#1E5A54]/70 dark:text-[#A9ADB3] font-sans leading-relaxed">{stat.helper}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
