import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '@/data/services';
import { SectionHeading } from '@/components/shared/section-heading';
import { StudioStamp } from '@/components/human/hand-crafted-svg';

export function ServicesOverview() {
  const featuredServices = servicesData.slice(0, 4);

  return (
    <section className="py-20 md:py-28 xl:py-32 border-b border-[#1E5A54]/20 bg-[#EEE6E2]">
      <div className="site-container space-y-12 xl:space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Core Capabilities"
            title="Full-Lifecycle Engineering & Architecture"
            subtitle="We handle system design, backend services, mobile clients, and private AI pipelines under one roof."
          />

          <div className="flex flex-wrap items-center gap-4 self-start md:self-auto shrink-0">
            <StudioStamp
              text="INDEX // 01-06"
              subtext="FIXED-SCOPE OR SPRINT"
              rotate="slight-left"
              variant="cream"
              className="hidden sm:inline-flex"
            />
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 rounded-full border border-[#1E5A54] bg-[#F8F4F2] pl-6 pr-1.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all"
            >
              <span>All 6 Capabilities</span>
              <span className="w-7 h-7 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
              </span>
            </Link>
          </div>
        </div>

        {/* Interactive Architectural Index Ledger */}
        <div className="border-t border-[#1E5A54]/20 divide-y divide-[#1E5A54]/20 border-b">
          {featuredServices.map((service, idx) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block py-8 md:py-10 px-4 md:px-6 rounded-2xl transition-colors duration-200 hover:bg-[#F8F4F2]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-center">
                {/* Index & Category Pill */}
                <div className="lg:col-span-2 flex items-center gap-3">
                  <span className="font-headline text-3xl md:text-4xl font-black text-[#1E5A54] group-hover:text-[#F7623D] transition-colors leading-none">
                    0{idx + 1}
                  </span>
                  <span className="px-3 py-1 rounded-full border border-[#1E5A54]/30 bg-[#EEE6E2] text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
                    {service.category}
                  </span>
                </div>

                {/* Large Headline Title */}
                <div className="lg:col-span-4">
                  <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black uppercase tracking-tight text-[#1E5A54] group-hover:text-[#F7623D] transition-colors leading-[0.95]">
                    {service.title}
                  </h3>
                </div>

                {/* Plain-Spoken Summary & Stack Tags */}
                <div className="lg:col-span-5 space-y-3">
                  <p className="text-sm text-[#1E5A54] leading-relaxed font-sans">
                    {service.shortDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {service.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-full bg-[#E2D7D1] text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#1E5A54]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Orange Arrow Pill that shifts on hover */}
                <div className="lg:col-span-1 flex lg:justify-end">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#1E5A54]/30 bg-[#EEE6E2] group-hover:bg-[#F7623D] group-hover:border-[#F7623D] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1E5A54] group-hover:text-white transition-all duration-200 group-hover:translate-x-1">
                    <span className="lg:hidden">Inspect Spec</span>
                    <ArrowUpRight className="h-4 w-4 stroke-2" />
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
