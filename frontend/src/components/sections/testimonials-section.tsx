import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Star } from 'lucide-react';
import { testimonialsData } from '@/data/testimonials';
import { TestimonialCard } from '@/features/testimonials/testimonial-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { HandCircle, StudioStamp } from '@/components/human/hand-crafted-svg';

export function TestimonialsSection() {
  const leadQuote = testimonialsData[0];
  const remainingQuotes = testimonialsData.slice(1);

  return (
    <section className="py-14 md:py-20 bg-[#EEE6E2]">
      <div className="site-container space-y-8 md:space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Client Endorsements"
            title="Backed by Engineering & Product Leaders"
            subtitle="Direct feedback from CTOs and VPs of Infrastructure running our systems in production."
          />

          <StudioStamp
            text="VERIFIED CLIENT LEDGER"
            subtext="99.4% RETENTION RATE"
            rotate="slight-left"
            variant="teal"
          />
        </div>

        {/* Editorial Pull-Quote Spread: 5 Cols Oversized Lead Pull-Quote / 7 Cols Stacked Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-stretch">
          {/* Left 5 Cols: Oversized Typographic Pull-Quote Card */}
          {leadQuote && (
            <div className="lg:col-span-5 rounded-3xl border border-[#1E5A54]/25 bg-[#1E5A54] text-[#EEE6E2] p-7 sm:p-9 xl:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#EEE6E2]/20 pb-4">
                  <div className="flex items-center gap-1 text-[#1E5A54] decoration-[#F7623D]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F7623D] text-[#F7623D]" />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#EEE6E2]">
                    LEAD RECORD // 01
                  </span>
                </div>

                <blockquote className="font-headline text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold uppercase tracking-tight leading-[1.06] text-[#EEE6E2]">
                  &ldquo;Sbu Tech engineered our analytics engine from the ground up. Their deep
                  mastery of Next.js, Go, and Kafka allowed us to ingest{' '}
                  <span className="relative inline-block px-1 text-[#EEE6E2]">
                    100M+
                    <HandCircle className="absolute -inset-x-2 -inset-y-1 w-[calc(100%+16px)] h-[calc(100%+8px)]" />
                  </span>{' '}
                  events every day with sub-second dashboard updates.&rdquo;
                </blockquote>

                <p className="text-sm text-[#EEE6E2] leading-relaxed font-sans">
                  They operate like principal engineers inside our own org rather than external
                  contractors, owning schema design, observability, and on-call cutover.
                </p>
              </div>

              <div className="pt-6 border-t border-[#EEE6E2]/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full border border-[#EEE6E2]/40 bg-[#EEE6E2]/10 flex items-center justify-center font-headline text-lg font-bold text-[#EEE6E2]">
                    {leadQuote.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold uppercase tracking-wider text-[#EEE6E2]">
                        {leadQuote.author}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#F7623D]" />
                    </div>
                    <p className="text-xs text-[#EEE6E2]">
                      {leadQuote.title}, {leadQuote.company}
                    </p>
                  </div>
                </div>

                {leadQuote.projectSlug && (
                  <Link
                    href={`/projects/${leadQuote.projectSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors"
                  >
                    <span>Case Study</span>
                    <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Right 7 Cols: Stacked 2-Column Masonry / Ledger for Remaining Quotes */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 content-between">
            {remainingQuotes.map((test, idx) => (
              <div
                key={test.id}
                className={idx === 0 ? 'md:col-span-2' : 'md:col-span-1'}
              >
                <TestimonialCard testimonial={test} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
