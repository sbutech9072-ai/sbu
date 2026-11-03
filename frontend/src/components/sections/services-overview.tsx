import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { servicesData } from '@/data/services';
import { ServiceCard } from '@/features/services/service-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';

export function ServicesOverview() {
  const featuredServices = servicesData.slice(0, 4);

  return (
    <section className="py-20 md:py-28 border-b border-slate-800/80">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Our Capabilities"
            title="Specialized Engineering & Product Solutions"
            subtitle="We cover every stage of the modern digital product lifecycle—from UX research and cloud orchestration to custom AI deployment."
          />

          <Button asChild variant="outline" className="self-start md:self-auto shrink-0 gap-1.5">
            <Link href="/services">
              <span>All 6 Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

