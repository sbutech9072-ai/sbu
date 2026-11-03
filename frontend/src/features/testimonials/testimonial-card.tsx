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
    <Card className="flex flex-col justify-between border-slate-800/80 bg-slate-900/50 p-6 md:p-8 relative">
      <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-500/10 pointer-events-none" />

      <div className="space-y-4">
        {/* Rating stars */}
        <div className="flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed italic">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            {testimonial.author.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-white">{testimonial.author}</h4>
              {testimonial.verifiedClient && (
                <span title="Verified Client">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {testimonial.title}, {testimonial.company}
            </p>
          </div>
        </div>

        {testimonial.projectSlug && (
          <Link
            href={`/projects/${testimonial.projectSlug}`}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            title="View related case study"
          >
            <span>Case Study</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </Card>
  );
}
