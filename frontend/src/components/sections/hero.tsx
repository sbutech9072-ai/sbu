import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Code, Cpu, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ArchitectureNodeOrb } from '@/components/human/architecture-node-orb';
import { HandUnderline, StudioStamp } from '@/components/human/hand-crafted-svg';
import { MagneticWrap } from '@/components/human/magnetic-button';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#1E5A54]/20 bg-[#EEE6E2]">
      <div className="container mx-auto px-4 max-w-7xl space-y-14">
        {/* Asymmetric 12-column split: 7 left editorial / 5 right 3D orb */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Rotated Studio Stamp & Eyebrow */}
            <div className="flex flex-wrap items-center gap-3">
              <StudioStamp
                text="SAN FRANCISCO // EST. 2021"
                subtext="SENIOR SYSTEMS STUDIO"
                rotate="slight-left"
                variant="teal"
              />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#1E5A54]/30 bg-[#F8F4F2] text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D]" />
                <span>Web Apps, Cloud & Private AI</span>
              </div>
            </div>

            {/* Main Headline with HandUnderline under key phrase */}
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight text-[#1E5A54] leading-[0.91] uppercase">
              We Architect{' '}
              <span className="relative inline-block">
                High-Throughput
                <HandUnderline className="absolute -bottom-2 left-0 w-full h-3.5" />
              </span>{' '}
              Cloud Platforms & AI Systems
            </h1>

            {/* Plain-spoken Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[#1E5A54] max-w-2xl leading-relaxed font-sans">
              Sbu Tech is a senior software engineering studio in San Francisco. We work directly
              with founders and CTOs to design, build, and ship production web platforms,
              Kubernetes clusters, and private LLM workflows that hold up under real load.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <MagneticWrap>
                <Link
                  href="/get-a-quote"
                  className="w-full sm:w-auto rounded-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] uppercase text-xs font-bold tracking-[0.16em] px-8 py-4 inline-flex items-center justify-center gap-2.5 transition-all"
                >
                  <span>Scope Your Project</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticWrap>

              <Link
                href="/projects"
                className="group w-full sm:w-auto rounded-full border border-[#1E5A54] bg-[#F8F4F2] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] uppercase text-xs font-bold tracking-[0.16em] pl-7 pr-2 py-2 inline-flex items-center justify-center gap-3 transition-all"
              >
                <span>Inspect Case Studies</span>
                <span className="w-8 h-8 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4 stroke-2" />
                </span>
              </Link>
            </div>

            {/* Technical Discipline Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.15em] font-bold text-[#1E5A54]">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-[#F7623D] stroke-[1.75]" />
                <span>Next.js & Go Microservices</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E5A54]/40 hidden sm:inline-block" />
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#F7623D] stroke-[1.75]" />
                <span>Private RAG & Vector Search</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E5A54]/40 hidden sm:inline-block" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#F7623D] stroke-[1.75]" />
                <span>Zero-Downtime Terraform & EKS</span>
              </div>
            </div>
          </div>

          {/* Right 3D Architectural Node Orb Column */}
          <div className="lg:col-span-5">
            <ArchitectureNodeOrb variant="hero" />
          </div>
        </div>

        {/* Bottom Architectural Ledger Strip for siteConfig.stats */}
        <div className="rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1E5A54]/18">
          {siteConfig.stats.map((stat, idx) => (
            <div key={stat.label} className="p-6 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
                <span>{stat.label}</span>
                <span className="text-[#1E5A54] decoration-[#F7623D]">0{idx + 1}</span>
              </div>
              <div className="font-headline text-4xl md:text-5xl font-black text-[#1E5A54] tracking-tight leading-none py-1">
                {stat.value}
              </div>
              <p className="text-xs text-[#1E5A54] font-sans">{stat.helper}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
