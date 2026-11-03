import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Code, Cpu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80">
      {/* Background glow and subtle grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[450px] w-[750px] bg-blue-600/15 blur-[130px] rounded-full" />
        <div className="h-[300px] w-[500px] bg-cyan-500/10 blur-[110px] rounded-full -translate-y-24" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-400 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Next-Generation Software Engineering & AI Integration</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            We Architect Scalable <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Cloud Platforms & AI Systems
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Sbu Tech is an elite software engineering studio. We partner with ambitious leaders to
            turn complex architectural visions into resilient, high-speed digital products.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-xl px-8 shadow-xl shadow-blue-600/25 text-base gap-2"
            >
              <Link href="/get-a-quote">
                <span>Start Your Project</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-xl px-8 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-base"
            >
              <Link href="/projects">View Case Studies</Link>
            </Button>
          </div>

          {/* Tech & Certification Tags */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Code className="h-4 w-4 text-blue-400" />
              <span>Full-Stack Next.js & React</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Enterprise RAG & AI Workflows</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <span>SOC 2 & HIPAA Compliant Architecture</span>
            </div>
          </div>
        </div>

        {/* Stats Metrics Bar */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
          {siteConfig.stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-3 space-y-1 border-r last:border-r-0 border-slate-800/60"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300">{stat.label}</div>
              <div className="text-[11px] text-slate-400 hidden sm:block">{stat.helper}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

