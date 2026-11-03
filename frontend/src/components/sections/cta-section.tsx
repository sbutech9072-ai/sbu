import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 md:py-24 border-b border-[#1E5A54]/18 bg-[#EEE6E2] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1E5A54]/25 bg-transparent text-xs font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D]" />
          <span>Ready to Build Next-Gen Software?</span>
        </div>

        <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1E5A54] leading-[0.95] uppercase">
          Transform Your Vision into an Enterprise-Ready Digital Platform
        </h2>

        <p className="text-base md:text-lg text-[#1E5A54]/80 max-w-2xl mx-auto leading-relaxed font-sans">
          From full platform engineering to specialized cloud migrations and AI copilots, our senior
          architects are ready to partner with you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/get-a-quote"
            className="w-full sm:w-auto rounded-full bg-[#F7623D] hover:bg-[#E05330] text-white uppercase text-xs font-bold tracking-[0.16em] px-8 py-3.5 inline-flex items-center justify-center gap-2.5 transition-all shadow-none"
          >
            <span>Request a Project Estimate</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/contact"
            className="group w-full sm:w-auto rounded-full border border-[#1E5A54] text-[#1E5A54] hover:bg-[#1E5A54]/5 uppercase text-xs font-bold tracking-[0.16em] pl-7 pr-2 py-2 inline-flex items-center justify-center gap-3 transition-all shadow-none"
          >
            <span>Schedule a Discovery Call</span>
            <span className="w-7 h-7 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
