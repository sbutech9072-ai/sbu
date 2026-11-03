import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { servicesData } from '@/data/services';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-16 pb-20">
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
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Overview</h2>
              <p className="text-slate-300 leading-relaxed text-base">
                {service.fullDescription}
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <span>Core Architectural Features</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300 leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service-Specific Process */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                <span>Execution Phases</span>
              </h2>
              <div className="space-y-4">
                {service.processSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-start gap-4"
                  >
                    <span className="text-2xl font-mono font-bold text-blue-400/40 shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">{step.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-400" />
                <span>What You Receive (Tangible Deliverables)</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.deliverables.map((del, idx) => (
                  <li
                    key={idx}
                    className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/30 flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Quick Action Card */}
            <Card className="p-6 border-slate-800 bg-gradient-to-b from-blue-950/30 to-slate-900/60 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  Get Started
                </span>
                <h3 className="text-xl font-bold text-white">
                  Ready to deploy {service.title}?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect with our lead architects to discuss scope, timeline, and architectural
                  feasibility.
                </p>
              </div>

              <div className="space-y-2.5">
                <Button asChild className="w-full justify-center h-11 text-sm font-semibold rounded-xl">
                  <Link href="/get-a-quote">Request a Scoped Quote</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-center text-xs">
                  <Link href="/contact">Book Discovery Call</Link>
                </Button>
              </div>
            </Card>

            {/* Technologies Used */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Core Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {service.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Other Services */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Explore Other Capabilities
              </h4>
              <div className="space-y-2">
                {otherServices.slice(0, 4).map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="block p-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
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

