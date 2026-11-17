import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ArchitectureNodeOrb } from '@/components/human/architecture-node-orb';

export function Hero() {
  return (
    <section className="relative pt-12 pb-14 md:pt-20 md:pb-20 bg-[#EEE6E2]">
      <div className="site-container space-y-14 md:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl xl:text-[4.25rem] font-extrabold tracking-tight text-[#1E5A54] leading-[1.06]">
              High-throughput cloud platforms and private AI systems.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#1E5A54]/80 max-w-2xl leading-relaxed font-sans">
              Sbu Tech is a senior software engineering studio in San Francisco. We partner directly
              with founders and CTOs to design and ship web platforms, Kubernetes clusters, and
              private LLM workflows built for real production traffic.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/contact"
                className="w-full sm:w-auto rounded-lg bg-[#1E5A54] hover:bg-[#16443F] text-[#EEE6E2] text-sm font-semibold px-6 py-3.5 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>Book a consultation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/projects"
                className="w-full sm:w-auto rounded-lg border border-[#1E5A54]/30 bg-[#F8F4F2] text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#E2D7D1]/40 text-sm font-semibold px-6 py-3.5 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>View case studies</span>
                <ArrowUpRight className="h-4 w-4 text-[#F7623D]" />
              </Link>
            </div>
          </div>

          {/* Right 3D Architectural Visual */}
          <div className="lg:col-span-5 w-full">
            <ArchitectureNodeOrb variant="hero" />
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="border-t border-b border-[#1E5A54]/15 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteConfig.stats.map((stat) => (
            <div key={stat.label} className="space-y-1.5">
              <div className="font-headline text-3xl md:text-4xl font-bold text-[#1E5A54] tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-[#1E5A54]">{stat.label}</div>
              <p className="text-xs text-[#1E5A54]/70 font-sans leading-relaxed">{stat.helper}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
