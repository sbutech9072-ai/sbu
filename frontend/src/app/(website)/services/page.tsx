import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { servicesData } from '@/data/services';
import { ServiceCard } from '@/features/services/service-card';
import { Button } from '@/components/ui/button';
import { HandUnderline, HandArrow, StudioStamp } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

export const metadata: Metadata = {
  title: 'Services & Capabilities',
  description:
    'Full-stack web application engineering, cloud DevOps, cross-platform mobile apps, applied AI pipelines, and UX design systems.',
};

export default function ServicesPage() {
  const engagementModels = [
    {
      code: 'MODEL 01 // EMBEDDED SQUAD',
      title: 'Dedicated Engineering Squad',
      cadence: '2-Week Sprints • Monthly Retainer',
      desc: 'A complete cross-functional team (Principal Architect, Senior Frontend, Backend, and QA) working directly inside your Slack and GitHub.',
      idealFor: 'Series A to Enterprise teams shipping a new flagship product or platform rewrite.',
    },
    {
      code: 'MODEL 02 // FIXED-SCOPE SPRINT',
      title: 'Targeted Architectural Sprint',
      cadence: '4 to 8 Weeks • Fixed Milestone Deliverable',
      desc: 'A focused strike team brought in to execute a zero-downtime cloud cutover, database migration, performance audit, or SOC 2 hardening.',
      idealFor: 'Engineering VPs who need specialized systems experience to clear a critical bottleneck.',
    },
    {
      code: 'MODEL 03 // PRINCIPAL ADVISORY',
      title: 'Continuous Retainer & Advisory',
      cadence: 'Ongoing • SLA-Backed Support',
      desc: 'Fractional principal architecture reviews, pull-request audits, Terraform maintenance, and 24/7 production telemetry monitoring.',
      idealFor: 'Teams that want senior architectural oversight without hiring a full-time VP of Engineering.',
    },
  ];

  const faqs = [
    {
      q: 'How does Sbu Tech run two-week sprints?',
      a: 'Every sprint starts on Monday with a scoped backlog and ends the following Friday with a live demo deployed to your staging environment. No slide decks, only tested code.',
    },
    {
      q: 'Do you work alongside our internal engineers?',
      a: 'Yes. We work inside your git repositories, join your standups, and pair-program with your engineers so context stays inside your company when our engagement wraps up.',
    },
    {
      q: 'Who owns the code and infrastructure templates?',
      a: 'Your company owns 100% of all source code, container manifests, and design tokens. We use zero proprietary black-box libraries.',
    },
    {
      q: 'How fast can a squad start?',
      a: 'After a technical discovery call and written scope agreement, we typically onboard a squad and push our first commit within 7 to 10 business days.',
    },
  ];

  return (
    <div className="space-y-24 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="Services & Capabilities"
        title="Software Architecture Built for Real Production Traffic"
        description="From multi-region cloud infrastructure to fast web and mobile applications, we build systems that hold up when traffic spikes."
        breadcrumbs={[{ label: 'Services' }]}
      />

      {/* Services Grid */}
      <section className="site-container space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Practice Areas"
            title="Six Core Engineering Practices"
            subtitle="Every capability is led by senior architects who have built and scaled production systems."
          />
          <StudioStamp
            text="SPEC SHEET // 2026"
            subtext="PRODUCTION VERIFIED"
            rotate="slight-left"
            variant="teal"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Asymmetric Engagement Models Ledger */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <StudioStamp
              text="COMMERCIAL LEDGER"
              subtext="CLEAR TERMS"
              rotate="left"
              variant="orange"
            />
            <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54] leading-[0.95]">
              Three Ways to{' '}
              <span className="relative inline-block">
                Hire Us
                <HandUnderline className="mt-1" />
              </span>
            </h2>
            <p className="text-sm text-[#1E5A54] leading-relaxed">
              Whether you need a full product squad for six months or a principal architect for a
              four-week cloud cutover, we structure engagements around clear deliverables and
              predictable budgets.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <Button asChild size="default" className="rounded-full">
                <Link href="/get-a-quote" className="gap-2">
                  <span>Scope Your Engagement</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <HandArrow direction="left" />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            {engagementModels.map((model, idx) => (
              <TiltCard
                key={idx}
                className="p-8 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:bg-[#E2D7D1]/60 transition-colors space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E5A54]/15 pb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54] decoration-[#F7623D]">
                    {model.code}
                  </span>
                  <span className="text-xs font-mono text-[#1E5A54] bg-[#EEE6E2] px-3 py-1 rounded-full border border-[#1E5A54]/20">
                    {model.cadence}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-headline text-2xl uppercase tracking-tight text-[#1E5A54]">
                    {model.title}
                  </h3>
                  <p className="text-sm text-[#1E5A54] leading-relaxed">{model.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#1E5A54]/15 text-xs text-[#1E5A54]">
                  <span className="font-mono uppercase tracking-wider font-bold text-[#1E5A54] mr-2">
                    Best suited for:
                  </span>
                  <span className="text-[#1E5A54]">{model.idealFor}</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="site-container space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeading
            align="left"
            badge="FAQ"
            title="Plain Answers to Common Questions"
            subtitle="How we run sprints, handle intellectual property, and integrate with your team."
          />
          <StudioStamp text="NO FINE PRINT" rotate="slight-right" variant="cream" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-3"
            >
              <h4 className="font-headline text-xl uppercase tracking-tight text-[#1E5A54] flex items-start gap-2.5">
                <HelpCircle className="h-5 w-5 text-[#F7623D] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-sm text-[#1E5A54] pl-7 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="site-container">
        <div className="p-10 md:p-14 rounded-3xl border border-[#1E5A54]/25 bg-[#1E5A54] text-[#EEE6E2] text-center space-y-6">
          <StudioStamp
            text="CUSTOM TECHNICAL SCOPE"
            rotate="slight-left"
            variant="orange"
          />
          <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#EEE6E2]">
            Need a Custom Architecture Breakdown?
          </h2>
          <p className="text-sm text-[#EEE6E2] max-w-xl mx-auto leading-relaxed">
            Share your requirements with our lead architects. We will return a written breakdown of
            milestones, sprint cadence, and estimated cost within 48 hours.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full px-5 sm:px-8 h-auto py-3.5 whitespace-normal text-center bg-[#F8F4F2] hover:bg-[#EEE6E2] text-[#1E5A54] border-2 border-[#F7623D]"
          >
            <Link href="/get-a-quote" className="gap-2">
              <span>Request an Engineering Estimate</span>
              <ArrowRight className="h-4 w-4 text-[#F7623D] shrink-0" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
