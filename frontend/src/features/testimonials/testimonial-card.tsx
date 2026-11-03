import React from 'react';
import Link from 'next/link';
import { Star, Quote, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '@/types';
import { Card } from '@/components/ui/card';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="group flex flex-col justify-between rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] p-6 md:p-8 relative hover:-translate-y-1 hover:border-[#1E5A54] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <Quote className="absolute top-6 right-6 h-8 w-8 text-[#1E5A54]/15 pointer-events-none stroke-[1.5]" />

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E5A54]/15 pr-10">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
            CLIENT RECORD // {testimonial.id.toUpperCase()}
          </span>
          {/* Rating stars */}
          <div className="flex items-center gap-1 text-[#F7623D]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < testimonial.rating ? 'fill-[#F7623D] text-[#F7623D]' : 'text-[#1E5A54]/25'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-sm text-[#1E5A54] leading-relaxed font-sans">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      <div className="pt-6 mt-6 border-t border-[#1E5A54]/15 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-[#1E5A54] bg-[#E2D7D1] flex items-center justify-center font-bold text-[#1E5A54] text-xs shrink-0">
            {testimonial.author.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#1E5A54]">
                {testimonial.author}
              </h4>
              {testimonial.verifiedClient && (
                <span title="Verified Client">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#F7623D] stroke-[1.75]" />
                </span>
              )}
            </div>
            <p className="text-xs text-[#1E5A54]/85 font-medium">
              {testimonial.title}, {testimonial.company}
            </p>
          </div>
        </div>

        {testimonial.projectSlug && (
          <Link
            href={`/projects/${testimonial.projectSlug}`}
            className="group/link shrink-0 rounded-full border border-[#1E5A54]/30 bg-[#EEE6E2] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] flex items-center gap-1 font-bold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            title="Read related case study"
          >
            <span>Build Log</span>
            <ArrowUpRight className="h-3.5 w-3.5 stroke-2 text-[#F7623D]" />
          </Link>
        )}
      </div>
    </Card>
  );
}
