import React from 'react';
import { SectionHeading } from '@/components/shared/section-heading';

export function WhyChooseUs() {
  const tenets = [
    {
      label: 'Senior-only squads',
      title: 'Direct access to principal engineers',
      desc: 'No junior handoffs, shadow subcontractors, or account layers. You talk directly in Slack and GitHub with the architects designing and shipping your system.',
    },
    {
      label: 'Full repository ownership',
      title: 'Zero vendor lock-in',
      desc: 'You own 100% of the git repositories, Terraform modules, cloud accounts, and intellectual property from day one.',
    },
    {
      label: 'Private AI infrastructure',
      title: 'Cloud and AI native',
      desc: 'We build with Next.js App Router, Go, Kubernetes, and private vector search pipelines that keep proprietary company data inside your own VPC.',
    },
    {
      label: 'Compliance ready',
      title: 'Security built in from day one',
      desc: 'Automated SAST/DAST scanning, OWASP protections, role-based access control, and audit evidence for SOC 2 Type II and HIPAA wired into CI/CD.',
    },
    {
      label: 'Two-week cadence',
      title: 'Predictable sprint releases',
      desc: 'Every second Friday we ship a live staging release and review progress together. You always know what shipped, what is next, and where budget stands.',
    },
    {
      label: '99.4% retention',
      title: 'Long-term engineering partners',
      desc: 'Over 80% of our work comes from direct referrals and multi-year product expansions with CTOs across multiple companies.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#EEE6E2]">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
            <SectionHeading
              align="left"
              title="Operating standards without the fluff."
              subtitle="Direct engineering communication, clean repositories, and measurable system benchmarks."
            />

            <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans border-t border-[#1E5A54]/15 pt-5">
              Every engagement includes full source repository ownership, documented Terraform
              infrastructure, and a structured post-launch handoff runbook.
            </p>
          </div>

          {/* Right List */}
          <div className="lg:col-span-8 rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2] divide-y divide-[#1E5A54]/15 overflow-hidden">
            {tenets.map((tenet) => (
              <div
                key={tenet.title}
                className="p-6 sm:p-8 transition-colors hover:bg-[#EEE6E2]/50 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-start"
              >
                <div className="md:col-span-4">
                  <span className="text-xs font-semibold text-[#F7623D]">
                    {tenet.label}
                  </span>
                </div>

                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-[#1E5A54] leading-snug">
                    {tenet.title}
                  </h3>
                  <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                    {tenet.desc}
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
