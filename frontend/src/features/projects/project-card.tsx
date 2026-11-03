import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:-translate-y-1 hover:border-[#1E5A54] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <div>
        {/* Architectural Blueprint Header */}
        <div className="relative w-full bg-[#E2D7D1]/65 p-6 flex flex-col justify-between border-b border-[#1E5A54]/20">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-dashed border-[#1E5A54]/25">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
              ARCH // {project.id.toUpperCase()} · {project.duration}
            </span>
            <span className="text-xs font-bold text-[#1E5A54] flex items-center gap-1">
              <Calendar className="h-3 w-3 stroke-[1.75] text-[#F7623D]" />
              {project.year}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge
              variant="default"
              className="text-[10px] uppercase tracking-[0.16em] bg-[#1E5A54] text-[#EEE6E2]"
            >
              {project.category}
            </Badge>
            {project.isFeatured && (
              <span className="inline-block -rotate-2 rounded-full border border-[#F7623D] bg-[#F8F4F2] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E5A54]">
                Featured Build
              </span>
            )}
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1E5A54]/85 block mb-1">
              {project.client}
            </span>
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-[#1E5A54] leading-tight line-clamp-2">
              {project.title}
            </h3>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-[#1E5A54]/90 line-clamp-3 leading-relaxed font-sans">
            {project.shortDescription}
          </p>

          {/* Key Metrics snapshot */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#1E5A54]/15">
              {project.metrics.slice(0, 2).map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-3 border border-[#1E5A54]/20 bg-[#EEE6E2]"
                >
                  <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#1E5A54]/85 block">
                    {m.label}
                  </span>
                  <span className="font-headline text-lg font-bold text-[#1E5A54] block mt-0.5">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] text-[#1E5A54]"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </div>

      <div className="p-6 pt-0">
        <Link
          href={`/projects/${project.slug}`}
          className="group/btn w-full rounded-full border border-[#1E5A54] bg-[#EEE6E2] pl-5 pr-1.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          <span>Read Case Study</span>
          <span className="w-6 h-6 rounded-full bg-[#F7623D] text-[#F8F4F2] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5">
            <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
          </span>
        </Link>
      </div>
    </Card>
  );
}
