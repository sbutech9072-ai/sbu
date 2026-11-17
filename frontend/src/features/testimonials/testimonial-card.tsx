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
    <Card className="group flex flex-col justify-between rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-6 md:p-7 relative hover:border-[#1E5A54]/45 transition-colors duration-200 h-full">
      <Quote className="absolute top-6 right-6 h-7 w-7 text-[#1E5A54]/12 pointer-events-none stroke-[1.5]" />

      <div className="space-y-4">
        <div className="flex items-center gap-1 pr-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < testimonial.rating ? 'fill-[#F7623D] text-[#F7623D]' : 'text-[#1E5A54]/25'
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-[#1E5A54]/90 leading-relaxed font-sans">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      <div className="pt-5 mt-6 border-t border-[#1E5A54]/12 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] flex items-center justify-center font-semibold text-[#1E5A54] text-xs shrink-0">
            {testimonial.author.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-[#1E5A54]">
                {testimonial.author}
              </h4>
              {testimonial.verifiedClient && (
                <span title="Verified Client">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#F7623D] stroke-[1.75]" />
                </span>
              )}
            </div>
            <p className="text-xs text-[#1E5A54]/70">
              {testimonial.title}, {testimonial.company}
            </p>
          </div>
        </div>

        {testimonial.projectSlug && (
          <Link
            href={`/projects/${testimonial.projectSlug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E5A54] hover:text-[#F7623D] transition-colors"
            title="Read related case study"
          >
            <span>Case study</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </Card>
  );
}
