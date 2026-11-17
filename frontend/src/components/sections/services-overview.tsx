import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '@/data/services';
import { SectionHeading } from '@/components/shared/section-heading';

export function ServicesOverview() {
  const featuredServices = servicesData.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-[#EEE6E2]">
      <div className="site-container space-y-10 md:space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            title="Full-lifecycle engineering and architecture"
            subtitle="We handle system design, backend services, mobile clients, and private AI pipelines under one roof."
          />

          <Link
            href="/services"
            className="self-start lg:self-auto shrink-0 inline-flex items-center gap-2 rounded-lg border border-[#1E5A54]/30 bg-[#F8F4F2] px-4 py-2.5 text-sm font-semibold text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
          >
            <span>All {servicesData.length} services</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Clean Service List */}
        <div className="border-t border-[#1E5A54]/15 divide-y divide-[#1E5A54]/15 border-b">
          {featuredServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block py-7 md:py-9 px-3 md:px-5 rounded-xl transition-colors duration-200 hover:bg-[#F8F4F2]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start lg:items-center">
                <div className="lg:col-span-2">
                  <span className="inline-block px-2.5 py-1 rounded-md border border-[#1E5A54]/20 bg-[#F8F4F2] text-xs font-medium text-[#1E5A54]/80">
                    {service.category}
                  </span>
                </div>

                <div className="lg:col-span-4">
                  <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-[#1E5A54] group-hover:text-[#F7623D] transition-colors leading-tight">
                    {service.title}
                  </h3>
                </div>

                <div className="lg:col-span-5 space-y-2.5">
                  <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                    {service.shortDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {service.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md bg-[#E2D7D1]/70 text-xs font-medium text-[#1E5A54]/85"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-1 flex lg:justify-end">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E5A54] group-hover:text-[#F7623D] transition-colors">
                    <span className="lg:hidden">View details</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
