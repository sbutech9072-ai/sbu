import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { servicesData } from '@/data/services';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = servicesData.find((s) => s.slug === params.slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = servicesData.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const otherServices = servicesData.filter((s) => s.slug !== service.slug);

  return (
    <div className="space-y-14 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        title={service.title}
        description={service.shortDescription}
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: service.title },
        ]}
      />

      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <div className="p-7 md:p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-headline text-2xl font-bold text-[#1E5A54]">
                  Overview
                </h2>
                <span className="rounded-md bg-[#EEE6E2] px-2.5 py-1 text-xs font-medium text-[#1E5A54]/80">
                  {service.category}
                </span>
              </div>
              <p className="text-[#1E5A54]/85 leading-relaxed text-base">
                {service.fullDescription}
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-5">
              <h2 className="font-headline text-2xl font-bold text-[#1E5A54] flex items-center gap-2.5">
                <Cpu className="h-5 w-5 text-[#F7623D]" />
                <span>Core capabilities</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#1E5A54]/15 bg-[#F8F4F2] flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#F7623D] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-[#1E5A54] leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Phases */}
            <div className="space-y-5">
              <h2 className="font-headline text-2xl font-bold text-[#1E5A54] flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-[#F7623D]" />
                <span>Execution phases</span>
              </h2>
              <div className="rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] divide-y divide-[#1E5A54]/12">
                {service.processSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-6 flex items-start gap-5"
                  >
                    <span className="font-headline text-2xl font-bold text-[#F7623D] shrink-0 leading-none tabular-nums">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-headline text-lg font-bold text-[#1E5A54]">
                        {step.title}
                      </h4>
                      <p className="text-sm text-[#1E5A54]/80 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-5">
              <h2 className="font-headline text-2xl font-bold text-[#1E5A54] flex items-center gap-2.5">
                <Package className="h-5 w-5 text-[#1E5A54]" />
                <span>Deliverables</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.deliverables.map((del, idx) => (
                  <li
                    key={idx}
                    className="p-4 rounded-xl border border-[#1E5A54]/15 bg-[#F8F4F2] flex items-start gap-3 text-sm text-[#1E5A54]/85"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D] mt-2 shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <Card className="bg-[#1E5A54] text-[#EEE6E2] rounded-2xl p-7 space-y-5 border-0">
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-bold text-[#EEE6E2]">
                  Scope {service.title}
                </h3>
                <p className="text-xs text-[#EEE6E2]/80 leading-relaxed">
                  Talk directly with our principal engineers to review your architecture, timeline,
                  and budget.
                </p>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 h-11 text-sm font-semibold rounded-lg bg-[#F7623D] hover:bg-[#E05330] text-white transition-colors"
                >
                  <span>Start engagement</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center h-10 text-xs font-semibold rounded-lg border border-[#EEE6E2]/30 text-[#EEE6E2] hover:bg-[#EEE6E2]/10 transition-colors"
                >
                  Book discovery call
                </Link>
              </div>
            </Card>

            {/* Technologies Used */}
            <div className="p-6 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-3">
              <h4 className="text-xs font-semibold text-[#1E5A54]/70">
                Core technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#EEE6E2] text-[#1E5A54] border border-[#1E5A54]/15 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Other Services */}
            <div className="p-6 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-3">
              <h4 className="text-xs font-semibold text-[#1E5A54]/70">
                Other services
              </h4>
              <div className="space-y-1">
                {otherServices.slice(0, 4).map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-lg text-sm text-[#1E5A54] hover:bg-[#EEE6E2] transition-colors font-medium"
                  >
                    <span>{s.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#F7623D]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
