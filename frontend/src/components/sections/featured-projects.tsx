import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projectsData } from '@/data/projects';
import { SectionHeading } from '@/components/shared/section-heading';

export function FeaturedProjects() {
  const featured = projectsData.filter((p) => p.isFeatured).slice(0, 3);
  const flagship = featured[0];
  const secondaryPair = featured.slice(1, 3);

  return (
    <section className="py-16 md:py-24 bg-[#F8F4F2]">
      <div className="site-container space-y-10 md:space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            title="Production systems and measured outcomes"
            subtitle="How we built telemetry engines, biometric banking apps, and multi-region Kubernetes clusters."
          />

          <Link
            href="/projects"
            className="self-start lg:self-auto shrink-0 inline-flex items-center gap-2 rounded-lg border border-[#1E5A54]/30 bg-[#EEE6E2] px-4 py-2.5 text-sm font-semibold text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
          >
            <span>All case studies ({projectsData.length})</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Flagship Case Study */}
        {flagship && (
          <div className="rounded-2xl border border-[#1E5A54]/20 bg-[#EEE6E2]/55 p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left 7 Cols */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#1E5A54]/70">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#1E5A54] text-[#EEE6E2]">
                      {flagship.category}
                    </span>
                    <span>
                      {flagship.client} &middot; {flagship.year} &middot; {flagship.duration}
                    </span>
                  </div>

                  <Link href={`/projects/${flagship.slug}`} className="group inline-block">
                    <h3 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1E5A54] group-hover:text-[#F7623D] transition-colors leading-[1.08]">
                      {flagship.title}
                    </h3>
                  </Link>

                  <p className="text-base text-[#1E5A54]/85 leading-relaxed font-sans">
                    {flagship.fullDescription}
                  </p>

                  {/* Flat Challenge / Solution columns without nested cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#1E5A54]/15">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-[#F7623D] block">
                        Challenge
                      </span>
                      <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                        {flagship.challenge}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-[#1E5A54] block">
                        Solution
                      </span>
                      <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                        {flagship.solution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#1E5A54]/15 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {flagship.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md border border-[#1E5A54]/15 bg-[#F8F4F2] text-xs font-medium text-[#1E5A54]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${flagship.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1E5A54] hover:bg-[#16443F] text-[#EEE6E2] px-5 py-2.5 text-sm font-semibold transition-colors"
                  >
                    <span>Read case study</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right 5 Cols: Deep Teal Outcomes Panel */}
              <div className="lg:col-span-5 rounded-xl bg-[#1E5A54] text-[#EEE6E2] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="border-b border-[#EEE6E2]/15 pb-3">
                  <span className="text-xs font-semibold text-[#EEE6E2]/80">
                    Measured outcomes
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {flagship.metrics.map((m) => (
                    <div key={m.label} className="space-y-1">
                      <span className="font-headline text-2xl sm:text-3xl font-bold text-[#EEE6E2] tracking-tight tabular-nums block">
                        {m.value}
                      </span>
                      <span className="text-xs text-[#EEE6E2]/75 block">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 border-t border-[#EEE6E2]/15 pt-5">
                  <span className="text-xs font-semibold text-[#EEE6E2]/80 block">
                    Key results
                  </span>
                  <ul className="space-y-2 text-xs text-[#EEE6E2]/90 font-sans">
                    {flagship.results.map((res, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D] mt-1.5 shrink-0" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Pair */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {secondaryPair.map((project) => (
            <div
              key={project.id}
              className="p-6 sm:p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#EEE6E2]/55 hover:border-[#1E5A54]/40 transition-colors flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#1E5A54]/70 border-b border-[#1E5A54]/15 pb-3">
                  <span>{project.category}</span>
                  <span>
                    {project.year} &middot; {project.duration}
                  </span>
                </div>

                <Link href={`/projects/${project.slug}`} className="group inline-block">
                  <h3 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-[#1E5A54] group-hover:text-[#F7623D] transition-colors leading-tight">
                    {project.title}
                  </h3>
                </Link>

                <p className="text-sm text-[#1E5A54]/85 leading-relaxed font-sans">
                  {project.shortDescription}
                </p>

                {/* Inline Metrics Row without nested card boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#1E5A54]/10">
                  {project.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="font-headline text-lg font-bold text-[#1E5A54] tabular-nums">
                        {metric.value}
                      </div>
                      <div className="text-xs text-[#1E5A54]/70 mt-0.5">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E5A54]/15 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md bg-[#F8F4F2] border border-[#1E5A54]/15 text-xs font-medium text-[#1E5A54]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E5A54] hover:text-[#F7623D] transition-colors"
                >
                  <span>Read case study</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
