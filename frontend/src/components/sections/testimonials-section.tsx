import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Star } from 'lucide-react';
import { testimonialsData } from '@/data/testimonials';
import { TestimonialCard } from '@/features/testimonials/testimonial-card';
import { SectionHeading } from '@/components/shared/section-heading';

export function TestimonialsSection() {
  const leadQuote = testimonialsData[0];
  const remainingQuotes = testimonialsData.slice(1);

  return (
    <section className="py-16 md:py-24 bg-[#EEE6E2]">
      <div className="site-container space-y-10 md:space-y-12">
        <SectionHeading
          align="left"
          title="Backed by engineering and product leaders"
          subtitle="Direct feedback from CTOs and VPs of Infrastructure running our systems in production."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {leadQuote && (
            <div className="lg:col-span-5 rounded-2xl bg-[#1E5A54] text-[#EEE6E2] p-7 sm:p-9 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#F7623D] text-[#F7623D]" />
                  ))}
                </div>

                <blockquote className="font-headline text-2xl sm:text-3xl font-bold tracking-tight leading-snug text-[#EEE6E2]">
                  &ldquo;Sbu Tech engineered our analytics engine from the ground up. Their mastery
                  of Next.js, Go, and Kafka allowed us to ingest 100M+ events every day with
                  sub-second dashboard updates.&rdquo;
                </blockquote>

                <p className="text-sm text-[#EEE6E2]/80 leading-relaxed font-sans">
                  They operate like principal engineers inside our own org rather than external
                  contractors, owning schema design, observability, and on-call cutover.
                </p>
              </div>

              <div className="pt-6 border-t border-[#EEE6E2]/15 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border border-[#EEE6E2]/30 bg-[#EEE6E2]/10 flex items-center justify-center font-headline text-sm font-bold text-[#EEE6E2]">
                    {leadQuote.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-[#EEE6E2]">
                        {leadQuote.author}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#F7623D]" />
                    </div>
                    <p className="text-xs text-[#EEE6E2]/75">
                      {leadQuote.title}, {leadQuote.company}
                    </p>
                  </div>
                </div>

                {leadQuote.projectSlug && (
                  <Link
                    href={`/projects/${leadQuote.projectSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7623D] hover:bg-[#E05330] text-white px-3.5 py-2 text-xs font-semibold transition-colors"
                  >
                    <span>Case study</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )}

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
