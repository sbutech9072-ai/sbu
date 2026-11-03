import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Package,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { servicesData } from '@/data/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicesData.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.title} | Engineering Services`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const otherServices = servicesData.filter((s) => s.id !== service.id);

  return (
    <div className="space-y-16 pb-20 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="Capability Deep Dive"
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
            <div className="space-y-4">
              <h2 className="font-headline text-3xl uppercase tracking-tight text-[#1E5A54]">Overview</h2>
              <p className="text-[#1E5A54]/80 leading-relaxed text-base">
                {service.fullDescription}
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-6">
              <h2 className="font-headline text-3xl uppercase tracking-tight text-[#1E5A54] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#1E5A54]" />
                <span>Core Architectural Features</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] shrink-0 mt-2" />
                    <span className="text-sm text-[#1E5A54]/85 leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service-Specific Process */}
            <div className="space-y-6">
              <h2 className="font-headline text-3xl uppercase tracking-tight text-[#1E5A54] flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#1E5A54]" />
                <span>Execution Phases</span>
              </h2>
              <div className="space-y-4">
                {service.processSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] flex items-start gap-4"
                  >
                    <span className="font-headline text-2xl text-[#1E5A54]/40 shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-headline text-lg uppercase tracking-tight text-[#1E5A54]">{step.title}</h4>
                      <p className="text-xs text-[#1E5A54]/80 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-6">
              <h2 className="font-headline text-3xl uppercase tracking-tight text-[#1E5A54] flex items-center gap-2">
                <Package className="h-5 w-5 text-[#1E5A54]" />
                <span>What You Receive (Tangible Deliverables)</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.deliverables.map((del, idx) => (
                  <li
                    key={idx}
                    className="p-4 rounded-2xl border border-[#1E5A54]/25 bg-[#EEE6E2] flex items-start gap-2.5 text-xs text-[#1E5A54]/85"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D] mt-1 shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Quick Action Card */}
            <Card className="p-6 border-[#1E5A54]/25 bg-[#EEE6E2] space-y-6 rounded-3xl">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[#1E5A54]/70 font-semibold">
                  Get Started
                </span>
                <h3 className="font-headline text-2xl uppercase tracking-tight text-[#1E5A54]">
                  Ready to deploy {service.title}?
                </h3>
                <p className="text-xs text-[#1E5A54]/80 leading-relaxed">
                  Connect with our lead architects to discuss scope, timeline, and architectural
                  feasibility.
                </p>
              </div>

              <div className="space-y-2.5">
                <Button asChild className="w-full justify-center">
                  <Link href="/get-a-quote">Request a Scoped Quote</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link href="/contact" className="gap-2">
                    <span>Book Discovery Call</span>
                    <span className="w-5 h-5 rounded-full bg-[#F7623D] flex items-center justify-center text-white shrink-0">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Technologies Used */}
            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                Core Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEE6E2] text-[#1E5A54] border border-[#1E5A54]/30"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Other Services */}
            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                Explore Other Capabilities
              </h4>
              <div className="space-y-2">
                {otherServices.slice(0, 4).map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="block p-2.5 rounded-full text-xs text-[#1E5A54]/80 hover:text-[#1E5A54] hover:bg-[#1E5A54]/5 transition-colors"
                  >
                    <span className="font-medium">{s.title}</span>
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
