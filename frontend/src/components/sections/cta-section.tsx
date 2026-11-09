import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { HandUnderline, StudioStamp } from '@/components/human/hand-crafted-svg';
import { MagneticWrap } from '@/components/human/magnetic-button';

export function CTASection() {
  return (
    <section className="py-20 md:py-28 border-b border-[#1E5A54]/20 bg-[#EEE6E2]">
      <div className="site-container">
        {/* High-Contrast Deep Teal Ticket Block */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#1E5A54] bg-[#1E5A54] text-[#EEE6E2] p-8 sm:p-12 md:p-16 xl:p-20">
          {/* Architectural Ticket Cutout Notches */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-1/2 -left-4 -translate-y-1/2 h-8 w-8 rounded-full bg-[#EEE6E2] border-r-2 border-[#1E5A54]"
          />
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 h-8 w-8 rounded-full bg-[#EEE6E2] border-l-2 border-[#1E5A54]"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 8 Cols: Editorial Headline & Stamp */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <StudioStamp
                  text="Q1/Q2 BUILD SLOTS OPEN"
                  subtext="SAN FRANCISCO // DIRECT DISPATCH"
                  variant="orange"
                  rotate="slight-left"
                />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#EEE6E2]">
                  RESPONSE TIME: &lt; 24 HOURS
                </span>
              </div>

              <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#EEE6E2] leading-[0.92] uppercase">
                Ready to Scope Your Next{' '}
                <span className="relative inline-block">
                  Production System?
                  <HandUnderline className="absolute -bottom-2 left-0 w-full h-3.5" />
                </span>
              </h2>

              <p className="text-base md:text-lg text-[#EEE6E2] max-w-2xl leading-relaxed font-sans">
                Skip the sales pitch. Send us your technical brief or architecture problem and talk
                directly with a founding systems architect this week.
              </p>
            </div>

            {/* Right 4 Cols: Ticket Stub CTAs */}
            <div className="lg:col-span-4 lg:border-l lg:border-dashed lg:border-[#EEE6E2]/25 lg:pl-10 flex flex-col items-stretch gap-4">
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#EEE6E2]">
                SELECT ENGAGEMENT TRACK
              </div>

              <MagneticWrap className="w-full">
                <Link
                  href="/get-a-quote"
                  className="w-full rounded-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] uppercase text-xs font-bold tracking-[0.16em] px-7 py-4 inline-flex items-center justify-center gap-2.5 transition-all"
                >
                  <span>Request Project Estimate</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticWrap>

              <MagneticWrap className="w-full">
                <Link
                  href="/contact"
                  className="group w-full rounded-full border border-[#EEE6E2]/40 bg-[#EEE6E2]/10 hover:bg-[#EEE6E2] text-[#EEE6E2] hover:text-[#1E5A54] uppercase text-xs font-bold tracking-[0.16em] pl-6 pr-2 py-2 inline-flex items-center justify-between gap-3 transition-all"
                >
                  <span>Book Architecture Call</span>
                  <span className="w-8 h-8 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowUpRight className="h-4 w-4 stroke-2" />
                  </span>
                </Link>
              </MagneticWrap>

              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#EEE6E2] pt-1">
                NDA AVAILABLE PRIOR TO REPOSITORY REVIEW
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
