import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { servicesData } from '@/data/services';
import { ServiceCard } from '@/features/services/service-card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Services & Capabilities',
  description:
    'Full-stack web application engineering, cloud DevOps, cross-platform mobile apps, applied AI pipelines, and UX design systems.',
};

export default function ServicesPage() {
  const engagementModels = [
    {
      title: 'Dedicated Engineering Squad',
      cadence: '2-week sprints · Monthly retainer',
      desc: 'A cross-functional team (Principal Architect, Senior Frontend, Backend, and QA) working directly inside your Slack and GitHub.',
      idealFor: 'Series A to Enterprise teams shipping a new flagship product or platform rewrite.',
    },
    {
      title: 'Targeted Architectural Sprint',
      cadence: '4 to 8 weeks · Fixed milestone',
      desc: 'A focused strike team brought in to execute a zero-downtime cloud cutover, database migration, performance audit, or SOC 2 hardening.',
      idealFor: 'Engineering leaders who need specialized systems experience to clear a critical bottleneck.',
    },
    {
      title: 'Continuous Retainer & Advisory',
      cadence: 'Ongoing · SLA-backed support',
      desc: 'Fractional principal architecture reviews, pull-request audits, Terraform maintenance, and production telemetry monitoring.',
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
    <div className="space-y-20 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        title="Software architecture built for real production traffic"
        description="From multi-region cloud infrastructure to fast web and mobile applications, we build systems that hold up when traffic spikes."
        breadcrumbs={[{ label: 'Services' }]}
      />

      {/* Services Grid */}
      <section className="site-container space-y-10">
        <SectionHeading
          align="left"
          title="Six core engineering practices"
          subtitle="Every capability is led by senior architects who have built and scaled production systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Engagement Models */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#1E5A54] leading-tight">
              Three ways to work with us
            </h2>
            <p className="text-sm md:text-base text-[#1E5A54]/80 leading-relaxed">
              Whether you need a full product squad for six months or a principal architect for a
              four-week cloud cutover, we structure engagements around clear deliverables and
              predictable budgets.
            </p>
            <div className="pt-2">
              <Button asChild size="default">
                <Link href="/contact" className="gap-2">
                  <span>Book a consultation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            {engagementModels.map((model, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E5A54]/12 pb-3">
                  <h3 className="font-headline text-xl font-bold text-[#1E5A54]">
                    {model.title}
                  </h3>
                  <span className="text-xs font-medium text-[#1E5A54]/75 bg-[#EEE6E2] px-3 py-1 rounded-md">
                    {model.cadence}
                  </span>
                </div>

                <p className="text-sm text-[#1E5A54]/85 leading-relaxed">{model.desc}</p>

                <div className="pt-3 border-t border-[#1E5A54]/12 text-xs text-[#1E5A54]/80">
                  <span className="font-semibold text-[#1E5A54] mr-1.5">
                    Best suited for:
                  </span>
                  <span>{model.idealFor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="site-container space-y-10">
        <SectionHeading
          align="left"
          title="Common questions"
          subtitle="How we run sprints, handle intellectual property, and integrate with your team."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-2.5"
            >
              <h4 className="font-headline text-lg font-bold text-[#1E5A54]">
                {faq.q}
              </h4>
              <p className="text-sm text-[#1E5A54]/80 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="site-container">
        <div className="p-10 md:p-14 rounded-2xl bg-[#1E5A54] text-[#EEE6E2] text-center space-y-5">
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#EEE6E2]">
            Need a custom architecture breakdown?
          </h2>
          <p className="text-sm md:text-base text-[#EEE6E2]/80 max-w-xl mx-auto leading-relaxed">
            Share your requirements with our lead architects. We will return a written breakdown of
            milestones, sprint cadence, and engineering recommendations within 48 hours.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F7623D] hover:bg-[#E05330] text-white px-6 py-3 text-sm font-semibold transition-colors"
            >
              <span>Contact engineering team</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
