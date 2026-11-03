import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Zap, Shield, GitBranch } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';

export function CompanyIntro() {
  const pillars = [
    {
      icon: <Zap className="h-5 w-5 text-amber-400" />,
      title: 'Performance-First Engineering',
      desc: 'We optimize every byte, database index, and query trace to deliver sub-second user interactions across global CDNs.',
    },
    {
      icon: <Shield className="h-5 w-5 text-emerald-400" />,
      title: 'Enterprise-Grade Security',
      desc: 'Security isn’t an afterthought. We implement zero-trust protocols, strict RBAC, and automated vulnerability scans.',
    },
    {
      icon: <GitBranch className="h-5 w-5 text-blue-400" />,
      title: 'Modern Declarative Stack',
      desc: 'Built on Next.js, TypeScript, and modern cloud providers to eliminate legacy maintenance debt and ensure long-term agility.',
    },
    {
      icon: <Layers className="h-5 w-5 text-purple-400" />,
      title: 'Transparent Collaboration',
      desc: 'You work directly with senior architects. Weekly staging releases, open code repositories, and clear sprint milestones.',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-b border-slate-800/80 bg-slate-950/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              align="left"
              badge="About Sbu Tech"
              title="We Don't Just Write Code. We Build Sustainable Competitive Advantage."
              subtitle="Founded by veteran software architects, Sbu Tech exists to solve the critical gap between design aesthetics and resilient backend architecture."
            />

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Whether you are an ambitious venture-backed startup launching an MVP or an established
              enterprise migrating legacy monoliths to modern cloud microservices, our senior engineering
              team delivers clean, tested, and maintainable software systems designed to scale
              effortlessly.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Button asChild variant="secondary" className="rounded-xl text-xs font-semibold gap-1.5">
                <Link href="/about">
                  <span>Read Our Full Story</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Pillars Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 transition-colors space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

