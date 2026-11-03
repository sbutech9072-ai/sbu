import React from 'react';
import { Search, Terminal, CheckCircle2, Rocket } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';

export function DevelopmentProcess() {
  const steps = [
    {
      num: '01',
      icon: <Search className="h-6 w-6 text-blue-400" />,
      title: 'Discovery & Architectural Blueprint',
      desc: 'We define the technical roadmap, database schema, API contracts, and UX flows before a single line of production code is written.',
      deliverables: ['System Architecture Diagram', 'Figma UX Wireframes', 'Sprint Backlog & Milestones'],
    },
    {
      num: '02',
      icon: <Terminal className="h-6 w-6 text-cyan-400" />,
      title: 'Iterative Sprint Engineering',
      desc: 'Development in two-week agile sprints. You receive staging access to review features live as they are built, with continuous feedback loops.',
      deliverables: ['Bi-Weekly Demo Builds', 'Type-Safe Git Pull Requests', 'CI/CD Automated Previews'],
    },
    {
      num: '03',
      icon: <CheckCircle2 className="h-6 w-6 text-indigo-400" />,
      title: 'Deep Testing & Security Audits',
      desc: 'We stress-test the application with automated end-to-end suites, load simulations, accessibility scans, and dependency vulnerability checks.',
      deliverables: ['Security Penetration Report', 'Load & Latency Benchmarks', 'WCAG Accessibility Pass'],
    },
    {
      num: '04',
      icon: <Rocket className="h-6 w-6 text-emerald-400" />,
      title: 'Zero-Downtime Launch & Scale',
      desc: 'Production rollout via automated canary releases. We configure real-time Datadog / Prometheus telemetry and provide ongoing operational support.',
      deliverables: ['Zero-Downtime Cutover', 'Telemetry & Alerting Dashboards', 'Maintenance Runbook'],
    },
  ];

  return (
    <section className="py-20 md:py-28 border-b border-slate-800/80 bg-slate-950/40">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <SectionHeading
          badge="How We Work"
          title="Our Battle-Tested Engineering Methodology"
          subtitle="A structured, transparent lifecycle engineered to eliminate ambiguity and deliver resilient software on time and within scope."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300 relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold font-mono text-blue-500/30">
                    {st.num}
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center">
                    {st.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/60 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Key Deliverables
                </span>
                {st.deliverables.map((del, dIdx) => (
                  <div key={dIdx} className="text-xs text-slate-300 flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-blue-400" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

