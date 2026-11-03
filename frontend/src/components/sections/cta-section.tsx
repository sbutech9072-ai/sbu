import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 md:py-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[350px] w-[600px] bg-blue-600/15 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ready to Build Next-Gen Software?</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Transform Your Vision into an Enterprise-Ready Digital Platform
        </h2>

        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From full platform engineering to specialized cloud migrations and AI copilots, our senior
          architects are ready to partner with you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto rounded-xl px-8 shadow-xl shadow-blue-600/25 text-base gap-2"
          >
            <Link href="/get-a-quote">
              <span>Request a Project Estimate</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-xl px-8 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-base"
          >
            <Link href="/contact">Schedule a Discovery Call</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

