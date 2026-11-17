import React from 'react';
import { SectionHeading } from '@/components/shared/section-heading';

export function DevelopmentProcess() {
  const steps = [
    {
      num: '01',
      window: 'Weeks 1–2',
      title: 'Discovery and architecture',
      desc: 'We lock down the domain schema, API contracts, cloud topology, and UX wireframes before writing application code.',
      deliverables: ['System architecture diagram', 'UX wireframes', 'Sprint backlog'],
    },
    {
      num: '02',
      window: 'Weeks 3–8',
      title: 'Iterative sprint builds',
      desc: 'Work runs in two-week sprints. You get a dedicated staging URL to test live features as they land in the main branch.',
      deliverables: ['Bi-weekly demo builds', 'Type-safe pull requests', 'Automated previews'],
    },
    {
      num: '03',
      window: 'Weeks 9–10',
      title: 'Load testing and security',
      desc: 'We test endpoints with end-to-end suites, high-concurrency load simulations, WCAG checks, and dependency scans.',
      deliverables: ['Security review', 'Latency benchmarks', 'Accessibility pass'],
    },
    {
      num: '04',
      window: 'Week 11',
      title: 'Launch and handoff',
      desc: 'Production rollout via automated canary releases, complete with telemetry dashboards and engineering team training.',
      deliverables: ['Zero-downtime cutover', 'Monitoring dashboards', 'Operations runbook'],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F8F4F2]">
      <div className="site-container space-y-10 md:space-y-12">
        <SectionHeading
          align="left"
          title="Four-stage build sequence"
          subtitle="A predictable sequence designed to ship production software on schedule and within scope."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-6 md:p-7 rounded-2xl border border-[#1E5A54]/15 bg-[#EEE6E2]/65 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#1E5A54]/15 pb-3">
                  <span className="font-headline text-2xl font-bold text-[#F7623D] tabular-nums">
                    {st.num}
                  </span>
                  <span className="text-xs font-medium text-[#1E5A54]/70">
                    {st.window}
                  </span>
                </div>

                <h3 className="font-headline text-xl font-bold tracking-tight text-[#1E5A54] leading-snug">
                  {st.title}
                </h3>

                <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                  {st.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1E5A54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#1E5A54] block">
                  Deliverables
                </span>
                <ul className="space-y-1.5 text-xs text-[#1E5A54]/80 font-sans">
                  {st.deliverables.map((deliv, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-[#F7623D] shrink-0" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
