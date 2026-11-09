import React from 'react';
import { SectionHeading } from '@/components/shared/section-heading';
import { HandArrow, StudioStamp } from '@/components/human/hand-crafted-svg';

export function WhyChooseUs() {
  const tenets = [
    {
      num: '01',
      spec: 'STAFFING MODEL // SENIOR ONLY',
      title: 'Senior-Only Engineering Squads',
      desc: 'No junior handoffs, shadow subcontractors, or account layers. You talk directly in Slack and GitHub with the principal architects designing and shipping your system.',
      guarantee: 'Direct Principal Access',
    },
    {
      num: '02',
      spec: 'IP & REPOSITORY // FULL TRANSFER',
      title: 'Zero Vendor Lock-In',
      desc: 'You own 100% of the git repositories, Terraform modules, cloud accounts, and intellectual property from day one. We write clean TypeScript and Go your in-house team will enjoy maintaining.',
      guarantee: '100% Client IP Ownership',
    },
    {
      num: '03',
      spec: 'RUNTIME & AI // PRODUCTION STACK',
      title: 'Cloud & Private AI Native',
      desc: 'We build with Next.js App Router, Go, Kubernetes, and private vector search pipelines that keep proprietary company data inside your own VPC.',
      guarantee: 'Zero Third-Party Model Training',
    },
    {
      num: '04',
      spec: 'COMPLIANCE // DAY-ONE POSTURE',
      title: 'Security & Audit Readiness Built In',
      desc: 'Automated SAST/DAST scanning, OWASP top 10 protections, role-based access control, and audit evidence for SOC 2 Type II and HIPAA are wired into CI/CD.',
      guarantee: 'Automated CI Security Gates',
    },
    {
      num: '05',
      spec: 'CADENCE // TWO-WEEK RELEASES',
      title: 'Predictable Two-Week Sprints',
      desc: 'Every second Friday we ship a live staging release and walk through the burn-down ledger together. You always know what shipped, what is next, and how budget tracks.',
      guarantee: 'Bi-Weekly Live Demos',
    },
    {
      num: '06',
      spec: 'TRACK RECORD // LONG-TERM PARTNERS',
      title: '99.4% Client Retention Rate',
      desc: 'Over 80% of our engagements come from direct referrals and multi-year product expansions with CTOs we have partnered with across multiple companies.',
      guarantee: '140+ Shipped Systems',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-b border-[#1E5A54]/20 bg-[#EEE6E2]">
      <div className="site-container">
        {/* Asymmetric 12-Column Architectural Specification Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-20 items-start">
          {/* Left 4-Column Sticky Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <StudioStamp
                text="100% YOUR REPO"
                subtext="ZERO VENDOR LOCK-IN"
                rotate="slight-left"
                variant="teal"
              />
              <HandArrow direction="right" className="hidden lg:block" />
            </div>

            <SectionHeading
              align="left"
              badge="Why Sbu Tech"
              title="Operating Standards Written in Plain Terms"
              subtitle="We cut out agency theater with direct engineering communication, clean repositories, and measurable system benchmarks."
            />

            <div className="p-5 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5A54] decoration-[#F7623D] block">
                STUDIO COMMITMENT
              </span>
              <p className="text-xs text-[#1E5A54] leading-relaxed font-sans">
                Every contract includes full source repository ownership, documented Terraform
                infrastructure, and a structured post-launch handoff runbook.
              </p>
            </div>
          </div>

          {/* Right 8-Column Specification Ledger Divided by Hairline Rules */}
          <div className="lg:col-span-8 rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] divide-y divide-[#1E5A54]/20 overflow-hidden">
            {tenets.map((tenet) => (
              <div
                key={tenet.num}
                className="p-6 sm:p-8 transition-colors hover:bg-[#EEE6E2]/60 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start"
              >
                {/* Index & Spec Code */}
                <div className="md:col-span-4 space-y-1">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-headline text-3xl font-black text-[#1E5A54] decoration-[#F7623D] leading-none">
                      {tenet.num}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#1E5A54]">
                      {tenet.spec}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E2D7D1] font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#1E5A54]">
                      {tenet.guarantee}
                    </span>
                  </div>
                </div>

                {/* Tenet Title & Plain-Spoken Copy */}
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-headline text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#1E5A54] leading-tight">
                    {tenet.title}
                  </h3>
                  <p className="text-sm text-[#1E5A54] leading-relaxed font-sans">
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
