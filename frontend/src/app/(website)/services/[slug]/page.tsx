import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { servicesData } from '@/data/services';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StudioStamp, HandUnderline } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

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
    <div className="space-y-16 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge={service.category}
        title={service.title}
        description={service.shortDescription}
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: service.title },
        ]}
      />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <div className="p-8 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54] tracking-tight">
                  Practice Specification
                </h2>
                <StudioStamp
                  text={`SPEC // ${service.category.toUpperCase()}`}
                  rotate="slight-right"
                  variant="cream"
                />
              </div>
              <p className="text-[#1E5A54] leading-relaxed text-base">
                {service.fullDescription}
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-6">
              <h2 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-[#F7623D]" />
                <span>
                  Core Architectural{' '}
                  <span className="relative inline-block">
                    Capabilities
                    <HandUnderline className="mt-0.5" />
                  </span>
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <TiltCard
                    key={idx}
                    className="p-5 rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#F7623D] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-[#1E5A54] leading-snug">{feat}</span>
                  </TiltCard>
                ))}
              </div>
            </div>

            {/* Service-Specific Process */}
            <div className="space-y-6">
              <h2 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-[#F7623D]" />
                <span>Execution Phases</span>
              </h2>
              <div className="space-y-4">
                {service.processSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] flex items-start gap-5"
                  >
                    <span className="font-headline text-3xl text-[#1E5A54] decoration-[#F7623D] shrink-0 leading-none">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1.5">
                      <h4 className="font-headline text-xl uppercase text-[#1E5A54]">
                        {step.title}
                      </h4>
                      <p className="text-sm text-[#1E5A54] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-6">
              <h2 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2.5">
                <Package className="h-5 w-5 text-[#1E5A54] decoration-[#F7623D]" />
                <span>What You Receive (Tangible Deliverables)</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.deliverables.map((del, idx) => (
                  <li
                    key={idx}
                    className="p-5 rounded-2xl border border-[#1E5A54]/25 bg-[#E2D7D1] flex items-start gap-3 text-xs font-medium text-[#1E5A54]"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#F7623D] mt-1 shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Quick Action Card */}
            <Card className="p-7 border-[#1E5A54]/25 bg-[#1E5A54] text-[#EEE6E2] rounded-3xl space-y-6">
              <div className="space-y-2">
                <StudioStamp
                  text="DIRECT ARCHITECT ACCESS"
                  rotate="slight-left"
                  variant="orange"
                />
                <h3 className="font-headline text-2xl uppercase text-[#EEE6E2] pt-2">
                  Ready to Scope {service.title}?
                </h3>
                <p className="text-xs text-[#EEE6E2] leading-relaxed">
                  Talk directly with our principal engineers to review your architecture, timeline,
                  and budget.
                </p>
              </div>

              <div className="space-y-2.5">
                <Button
                  asChild
                  className="w-full justify-center h-11 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2]"
                >
                  <Link href="/get-a-quote" className="gap-1.5">
                    <span>Request a Scoped Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center text-xs rounded-full border-[#EEE6E2]/40 text-[#EEE6E2] hover:bg-[#EEE6E2] hover:text-[#1E5A54]"
                >
                  <Link href="/contact">Book Discovery Call</Link>
                </Button>
              </div>
            </Card>

            {/* Technologies Used */}
            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]">
                Core Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-[#EEE6E2] text-[#1E5A54] border border-[#1E5A54]/25 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Other Services */}
            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]">
                Other Practice Areas
              </h4>
              <div className="space-y-1.5">
                {otherServices.slice(0, 4).map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="flex items-center justify-between p-3 rounded-2xl text-xs text-[#1E5A54] hover:bg-[#E2D7D1] transition-colors font-semibold"
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
