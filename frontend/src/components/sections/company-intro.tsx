import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';

export function CompanyIntro() {
  const pillars = [
    {
      tag: 'Latency & Throughput',
      title: 'Sub-second systems by default',
      desc: 'We profile database indexes, query plans, and bundle payloads from sprint one so pages load fast and APIs stay under 200ms at peak traffic.',
      metric: 'P99 < 220ms',
    },
    {
      tag: 'Security Posture',
      title: 'Built into the repository',
      desc: 'Role-based access control, encrypted secrets, automated dependency audits, and SOC 2 / HIPAA readiness ship in the initial commit.',
      metric: 'SOC 2 & HIPAA Ready',
    },
    {
      tag: 'Maintainable Stack',
      title: 'Zero legacy debt',
      desc: 'Strict TypeScript, Next.js App Router, Go services, and Terraform modules that your internal team can read, test, and extend on day one.',
      metric: '100% Type-Safe',
    },
    {
      tag: 'Direct Collaboration',
      title: 'Senior engineers only',
      desc: 'You work in a shared Slack channel and git repository with the architects writing the code. Bi-weekly staging builds, no account layers.',
      metric: '2-Week Sprints',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F8F4F2]">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <SectionHeading
              align="left"
              title="Senior engineers who ship production code."
              subtitle="Founded in 2021, Sbu Tech pairs product craft with heavy backend systems engineering."
            />

            <p className="text-sm md:text-base text-[#1E5A54]/80 leading-relaxed font-sans">
              Whether you are launching a new web platform or untangling a legacy monolith into Go
              and Kubernetes services, you work directly with the engineers designing the schema and
              writing the pull requests.
            </p>

            <div className="pt-1">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E5A54] hover:text-[#F7623D] transition-colors"
              >
                <span>Read more about our studio</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-6 md:p-7 rounded-2xl border border-[#1E5A54]/15 bg-[#EEE6E2]/60 hover:bg-[#EEE6E2] hover:border-[#1E5A54]/30 transition-colors flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-[#1E5A54]/65">
                    <span>{pillar.tag}</span>
                    <span className="text-[#F7623D] font-semibold">{pillar.metric}</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold tracking-tight text-[#1E5A54] leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
