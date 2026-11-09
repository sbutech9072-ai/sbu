import React from 'react';
import { SectionHeading } from '@/components/shared/section-heading';
import { HandArrow, StudioStamp } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

export function DevelopmentProcess() {
  const steps = [
    {
      num: '01',
      window: 'WEEKS 01 - 02',
      title: 'Discovery & Architectural Blueprint',
      desc: 'We lock down the domain schema, API contracts, cloud topology, and UX wireframes before writing production application code.',
      deliverables: ['System Architecture Diagram', 'Figma UX Wireframes', 'Sprint Backlog & Milestones'],
      offsetClass: 'lg:mt-0',
    },
    {
      num: '02',
      window: 'WEEKS 03 - 08',
      title: 'Iterative Sprint Engineering',
      desc: 'Development runs in two-week sprints. You get a dedicated staging URL to test live features as they land in the main branch.',
      deliverables: ['Bi-Weekly Demo Builds', 'Type-Safe Git Pull Requests', 'CI/CD Automated Previews'],
      offsetClass: 'lg:mt-10',
    },
    {
      num: '03',
      window: 'WEEKS 09 - 10',
      title: 'Load Testing & Security Audits',
      desc: 'We stress-test endpoints with automated end-to-end suites, high-concurrency load simulations, WCAG checks, and dependency scans.',
      deliverables: ['Security Penetration Report', 'Load & Latency Benchmarks', 'WCAG Accessibility Pass'],
      offsetClass: 'lg:mt-20',
    },
    {
      num: '04',
      window: 'WEEK 11 // CUTOVER',
      title: 'Zero-Downtime Launch & Handoff',
      desc: 'Production rollout via automated canary releases, complete with Datadog / Prometheus telemetry dashboards and team training.',
      deliverables: ['Zero-Downtime Cutover', 'Telemetry & Alerting Dashboards', 'Operations Runbook'],
      offsetClass: 'lg:mt-30',
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#F8F4F2]">
      <div className="site-container space-y-8 md:space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="How We Work"
            title="Four-Stage Blueprint Sequence"
            subtitle="A clear, chronological build sequence designed to ship production software on schedule and within scope."
          />
          <StudioStamp
            text="SEQUENCE // 01 -> 04"
            subtext="BI-WEEKLY RELEASES"
            rotate="slight-right"
            variant="orange"
          />
        </div>

        {/* Stepped Diagonal / Staggered Blueprint Timeline */}
        <div className="relative">
          {/* Connecting Dashed Blueprint Line on Desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-16 left-12 right-12 border-t-2 border-dashed border-[#1E5A54]/25 pointer-events-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 xl:gap-8 items-start">
            {steps.map((st, idx) => (
              <div key={st.num} className={`relative ${st.offsetClass}`}>
                {/* HandArrow connector between stepped cards on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-end mb-2 pr-2">
                    <HandArrow direction="right" className="w-12 h-5" />
                  </div>
                )}

                <TiltCard className="p-6 md:p-7 rounded-2xl border border-[#1E5A54]/20 bg-[#EEE6E2]/90 hover:bg-[#EEE6E2] hover:border-[#1E5A54]/50 transition-colors flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1E5A54]/15 pb-3">
                      <span className="font-headline text-4xl font-black text-[#1E5A54] decoration-[#F7623D] leading-none">
                        {st.num}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#E2D7D1] font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E5A54]">
                        {st.window}
                      </span>
                    </div>

                    <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#1E5A54] leading-tight">
                      {st.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#1E5A54] leading-relaxed font-sans">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1E5A54]/15 space-y-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-bold text-[#1E5A54] block">
                      PHASE DELIVERABLES
                    </span>
                    <ul className="space-y-1.5 text-xs font-medium text-[#1E5A54]">
                      {st.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
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
