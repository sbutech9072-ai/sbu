import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { HandArrow, StudioStamp } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

export function CompanyIntro() {
  const pillars = [
    {
      num: '01',
      tag: 'LATENCY & THROUGHPUT',
      title: 'Sub-Second Systems by Default',
      desc: 'We profile database indexes, query plans, and bundle payloads from sprint one so pages load fast and APIs stay under 200ms at peak traffic.',
      metric: 'P99 < 220ms',
    },
    {
      num: '02',
      tag: 'HARDENED POSTURE',
      title: 'Security Built into the Repo',
      desc: 'Strict role-based access control, encrypted secrets, automated dependency audits, and SOC 2 / HIPAA readiness ship in the initial commit.',
      metric: 'SOC 2 & HIPAA Ready',
    },
    {
      num: '03',
      tag: 'DECLARATIVE STACK',
      title: 'Zero Legacy Debt',
      desc: 'Strict TypeScript, Next.js App Router, Go services, and Terraform modules that your internal team can read, test, and extend on day one.',
      metric: '100% Type-Safe',
    },
    {
      num: '04',
      tag: 'DIRECT ACCESS',
      title: 'Principal-Led Execution',
      desc: 'You work in a shared Slack channel and git repository with the senior architects writing the code. Bi-weekly staging builds, zero account managers.',
      metric: '2-Week Sprints',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-b border-[#1E5A54]/20 bg-[#EEE6E2]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Asymmetric 5/7 Broadsheet Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Column (5 cols): Sticky Studio Manifesto */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StudioStamp
                text="NO JUNIOR HANDOFFS"
                subtext="PRINCIPAL ARCHITECTS ONLY"
                rotate="right"
                variant="orange"
              />
              <HandArrow direction="right" className="hidden lg:block" />
            </div>

            <SectionHeading
              align="left"
              badge="Studio Manifesto"
              title="Senior Engineers Who Ship Production Code, Not Slide Decks."
              subtitle="Founded by principal systems architects in 2021, Sbu Tech bridges product design and heavy backend engineering."
            />

            <p className="text-sm md:text-base text-[#1E5A54] leading-relaxed font-sans">
              Whether you are launching a venture-backed web platform or untangling a legacy
              monolith into Go and Kubernetes services, you work directly with the engineers
              designing the schema and writing the pull requests.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 rounded-full border border-[#1E5A54] bg-[#F8F4F2] pl-6 pr-1.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all"
              >
                <span>Read Our Studio Story</span>
                <span className="w-7 h-7 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column (7 cols): Staggered 2-Column Offset Layout */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.num}
                className={idx % 2 === 1 ? 'sm:mt-10' : ''}
              >
                <TiltCard className="p-7 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] hover:border-[#1E5A54]/45 transition-colors flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1E5A54]/15 pb-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
                        {pillar.tag}
                      </span>
                      <span className="font-headline text-3xl font-black text-[#1E5A54] decoration-[#F7623D] leading-none">
                        {pillar.num}
                      </span>
                    </div>

                    <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#1E5A54] leading-tight">
                      {pillar.title}
                    </h3>

                    <p className="text-sm text-[#1E5A54] leading-relaxed font-sans">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1E5A54]/12 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-[0.14em] text-[#1E5A54]">
                    <span>BENCHMARK</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E2D7D1] text-[#1E5A54]">
                      {pillar.metric}
                    </span>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
