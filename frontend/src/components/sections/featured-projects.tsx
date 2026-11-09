import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projectsData } from '@/data/projects';
import { SectionHeading } from '@/components/shared/section-heading';
import { HandCircle, StudioStamp } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

export function FeaturedProjects() {
  const featured = projectsData.filter((p) => p.isFeatured).slice(0, 3);
  const flagship = featured[0];
  const secondaryPair = featured.slice(1, 3);

  return (
    <section className="py-20 md:py-28 border-b border-[#1E5A54]/20 bg-[#EEE6E2]">
      <div className="site-container space-y-12 xl:space-y-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Selected Work"
            title="Production Systems & Measured Outcomes"
            subtitle="Inspect how we built telemetry engines, biometric banking apps, and multi-region Kubernetes clusters."
          />

          <Link
            href="/projects"
            className="group self-start lg:self-auto shrink-0 inline-flex items-center gap-3 rounded-full border border-[#1E5A54] bg-[#F8F4F2] pl-6 pr-1.5 py-1.5 text-xs xl:text-sm font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all"
          >
            <span>All Case Studies ({projectsData.length})</span>
            <span className="w-7 h-7 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
            </span>
          </Link>
        </div>

        {/* Flagship Case Study (featured[0]) - Full-Width Horizontal Split (lg:grid-cols-12) */}
        {flagship && (
          <TiltCard maxTilt={2} className="rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] p-6 sm:p-8 lg:p-10 xl:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-stretch">
              {/* Left 7 Cols: Narrative, Challenge/Solution, Stack */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <StudioStamp
                      text={`CASE STUDY 01 // ${flagship.year}`}
                      subtext={flagship.category}
                      rotate="slight-left"
                      variant="orange"
                    />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#1E5A54]">
                      CLIENT: {flagship.client} • {flagship.duration}
                    </span>
                  </div>

                  <Link href={`/projects/${flagship.slug}`} className="group inline-block">
                    <h3 className="font-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight text-[#1E5A54] group-hover:text-[#F7623D] transition-colors leading-[0.94]">
                      {flagship.title}
                    </h3>
                  </Link>

                  <p className="text-base text-[#1E5A54] leading-relaxed font-sans">
                    {flagship.fullDescription}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl border border-[#1E5A54]/18 bg-[#EEE6E2] space-y-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54] decoration-[#F7623D] block">
                        THE BOTTLENECK
                      </span>
                      <p className="text-xs text-[#1E5A54] leading-relaxed font-sans">
                        {flagship.challenge}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-[#1E5A54]/18 bg-[#EEE6E2] space-y-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54] block">
                        ARCHITECTURAL FIX
                      </span>
                      <p className="text-xs text-[#1E5A54] leading-relaxed font-sans">
                        {flagship.solution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E5A54]/15 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {flagship.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#1E5A54]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${flagship.slug}`}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-[#1E5A54] hover:bg-[#F7623D] text-[#EEE6E2] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowUpRight className="h-4 w-4 stroke-2" />
                  </Link>
                </div>
              </div>

              {/* Right 5 Cols: Deep Teal Architectural Telemetry Board */}
              <div className="lg:col-span-5 rounded-2xl bg-[#1E5A54] text-[#EEE6E2] p-6 sm:p-8 xl:p-10 flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between border-b border-[#EEE6E2]/20 pb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#EEE6E2]">
                    PRODUCTION BENCHMARKS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1E5A54] border-2 border-[#F7623D] text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#EEE6E2]">
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {flagship.metrics.map((m, mIdx) => (
                    <div
                      key={m.label}
                      className="p-4 rounded-xl border border-[#EEE6E2]/20 bg-[#EEE6E2]/5 space-y-1 relative"
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#EEE6E2] block">
                        {m.label}
                      </span>
                      <div className="relative inline-block">
                        <span className="font-headline text-2xl sm:text-3xl font-black text-[#EEE6E2] tracking-tight">
                          {m.value}
                        </span>
                        {mIdx === 0 && (
                          <HandCircle className="absolute -inset-x-2 -inset-y-1 w-[calc(100%+16px)] h-[calc(100%+8px)]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-[#EEE6E2]/20 pt-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#EEE6E2] block">
                    KEY OUTCOMES
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#EEE6E2] font-sans">
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
          </TiltCard>
        )}

        {/* Asymmetric 7/5 Staggered Pair for featured[1] and featured[2] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {secondaryPair.map((project, idx) => (
            <div
              key={project.id}
              className={
                idx === 0
                  ? 'lg:col-span-7'
                  : 'lg:col-span-5 lg:mt-8'
              }
            >
              <TiltCard className="p-6 sm:p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] hover:border-[#1E5A54]/45 transition-colors flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-[#1E5A54]/15 pb-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
                      {`0${idx + 2} // ${project.category}`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E2D7D1] font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E5A54]">
                      {project.year} • {project.duration}
                    </span>
                  </div>

                  <Link href={`/projects/${project.slug}`} className="group inline-block">
                    <h3 className="font-headline text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1E5A54] group-hover:text-[#F7623D] transition-colors leading-[0.95]">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-[#1E5A54] leading-relaxed font-sans">
                    {project.shortDescription}
                  </p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    {project.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="p-3 rounded-xl border border-[#1E5A54]/15 bg-[#EEE6E2]"
                      >
                        <div className="font-headline text-xl font-black text-[#1E5A54] leading-none">
                          {metric.value}
                        </div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#1E5A54] mt-1">
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
                        className="px-2.5 py-0.5 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#1E5A54]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:text-[#F7623D] transition-colors"
                  >
                    <span>Inspect Architecture</span>
                    <span className="w-6 h-6 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                      <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
                    </span>
                  </Link>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
