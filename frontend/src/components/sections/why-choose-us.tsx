import React from 'react';
import { ShieldCheck, Cpu, Code2, Clock, Users2, Award } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';

export function WhyChooseUs() {
  const points = [
    {
      icon: <Users2 className="h-6 w-6 text-blue-400" />,
      title: 'Senior-Only Engineering Squads',
      desc: 'No junior handoffs or outsourced layers. You collaborate directly with senior architects and engineers who have shipped systems handling millions of users.',
    },
    {
      icon: <Code2 className="h-6 w-6 text-cyan-400" />,
      title: 'Zero Vendor Lock-In',
      desc: 'You own 100% of all intellectual property, git repositories, and cloud configurations. Clean, maintainable code with strict TypeScript and modern patterns.',
    },
    {
      icon: <Cpu className="h-6 w-6 text-indigo-400" />,
      title: 'Modern Cloud & AI Native',
      desc: 'We build with state-of-the-art technologies—Next.js App Router, Go, Kubernetes, and tailored LLM pipelines—ensuring future-proof longevity.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
      title: 'Security & Compliance Baked In',
      desc: 'From day one, we enforce automated vulnerability scanning, OWASP top 10 safeguards, and compliance blueprints for SOC 2 and HIPAA.',
    },
    {
      icon: <Clock className="h-6 w-6 text-amber-400" />,
      title: 'Rapid Two-Week Agile Iterations',
      desc: 'Predictable sprint cadences with bi-weekly demo builds, transparent burn-down tracking, and immediate responses via shared Slack channels.',
    },
    {
      icon: <Award className="h-6 w-6 text-purple-400" />,
      title: '99.4% Client Retention & Satisfaction',
      desc: 'Our track record speaks for itself. Over 80% of our new projects come directly from long-term client referrals and platform expansions.',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-b border-slate-800/80">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <SectionHeading
          badge="Why Sbu Tech"
          title="The Engineering Partner Built for Rigorous Standards"
          subtitle="We eliminate the typical agency friction with direct communication, engineering discipline, and relentless focus on measurable business outcomes."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300 space-y-4"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center">
                {pt.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{pt.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

