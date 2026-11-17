import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-12 md:py-16 bg-[#EEE6E2]">
      <div className="site-container">
        <div className="rounded-2xl bg-[#1E5A54] text-[#EEE6E2] p-8 sm:p-12 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#EEE6E2] leading-[1.1]">
                Ready to scope your next production system?
              </h2>

              <p className="text-base md:text-lg text-[#EEE6E2]/85 max-w-2xl leading-relaxed font-sans">
                Skip the sales pitch. Send us your technical brief or architecture question and talk
                directly with a founding systems architect this week.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col items-stretch gap-3">
              <Link
                href="/contact"
                className="w-full rounded-lg bg-[#F7623D] hover:bg-[#E05330] text-white text-sm font-semibold px-6 py-3.5 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>Start a project scope</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="w-full rounded-lg border border-[#EEE6E2]/30 hover:bg-[#EEE6E2]/10 text-[#EEE6E2] text-sm font-semibold px-6 py-3.5 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>Book a call</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <p className="text-xs text-[#EEE6E2]/70 text-center pt-1">
                Typical response within one business day. NDA available upfront.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
