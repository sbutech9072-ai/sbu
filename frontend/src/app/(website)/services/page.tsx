import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HelpCircle, Layers, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { servicesData } from '@/data/services';
import { ServiceCard } from '@/features/services/service-card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Services & Capabilities',
  description:
    'Full-stack web application engineering, cloud DevOps, cross-platform mobile apps, AI & machine learning, and UX design systems.',
};

export default function ServicesPage() {
  const engagementModels = [
    {
      title: 'Dedicated Engineering Squad',
      desc: 'A full cross-functional team (Architect, Frontend, Backend, QA) embedded directly alongside your product managers.',
      idealFor: 'Scaling startups and enterprises launching new core products.',
    },
    {
      title: 'Targeted Architectural Sprint',
      desc: 'A high-velocity 4 to 8 week engagement dedicated to cloud migration, performance optimization, or security hardening.',
      idealFor: 'Teams needing specialized expertise to unblock technical bottlenecks.',
    },
    {
      title: 'Continuous Retainer & Advisory',
      desc: 'Ongoing fractional CTO guidance, code reviews, DevOps maintenance, and SLA-backed infrastructure monitoring.',
      idealFor: 'Companies seeking high-level architectural oversight without full-time executive hire.',
    },
  ];

  const faqs = [
    {
      q: 'How does Sbu Tech structure project sprints?',
      a: 'We work in two-week agile cycles. Every sprint starts with defined backlog deliverables and ends with a live demo on your staging environment.',
    },
    {
      q: 'Do you work with our existing in-house team?',
      a: 'Yes. We frequently integrate into existing git workflows, Slack channels, and Jira boards, transferring knowledge through paired programming and documentation.',
    },
    {
      q: 'Who owns the code and intellectual property?',
      a: 'You do. 100% of all repositories, configurations, and documentation belong to your organization with zero proprietary licensing lock-in.',
    },
    {
      q: 'How quickly can we kick off a new engagement?',
      a: 'Following architectural discovery and scope alignment, we typically assemble and onboard an engineering squad within 1 to 2 weeks.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      <PageHeader
        badge="Services & Capabilities"
        title="Comprehensive Digital Engineering Solutions"
        description="From resilient cloud architectures to intuitive mobile and web platforms, we engineer solutions designed to scale reliably under real-world pressure."
        breadcrumbs={[{ label: 'Services' }]}
      />

      {/* Services Grid */}
      <section className="container mx-auto px-4 max-w-7xl space-y-12">
        <SectionHeading
          badge="Practice Areas"
          title="Engineered for Performance, Security, and Longevity"
          subtitle="Explore our specialized services below. Each capability is backed by senior architects and battle-tested delivery frameworks."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Engagement Models */}
      <section className="container mx-auto px-4 max-w-7xl space-y-12">
        <SectionHeading
          badge="How to Partner"
          title="Flexible Engagement Models"
          subtitle="Whether you need a dedicated team to build a platform from scratch or specialized assistance on an existing codebase."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engagementModels.map((model, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
                  Model 0{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-white">{model.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{model.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-slate-200 block mb-1">Best suited for:</span>
                <span className="text-slate-400">{model.idealFor}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 max-w-4xl space-y-8">
        <SectionHeading
          badge="FAQ"
          title="Frequently Asked Questions"
          subtitle="Clear answers about our engineering process, pricing structure, and intellectual property terms."
        />

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 space-y-2"
            >
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-sm text-slate-400 pl-6 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 max-w-5xl text-center space-y-6 pt-6">
        <div className="p-12 rounded-3xl border border-slate-800 bg-gradient-to-b from-blue-950/20 to-slate-900/60 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Need a Tailored Architectural Solution?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Share your requirements with our lead architects to receive a breakdown of scope, timeline,
            and estimated investment.
          </p>
          <Button asChild size="lg" className="rounded-xl px-8 shadow-xl shadow-blue-600/20">
            <Link href="/get-a-quote">Request an Engineering Estimate</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

