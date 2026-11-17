import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] hover:border-[#1E5A54]/45 transition-colors duration-200">
      <div>
        <div className="p-6 pb-5 border-b border-[#1E5A54]/12 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#1E5A54]/70">
            <span className="px-2.5 py-0.5 rounded-md bg-[#1E5A54] text-[#EEE6E2]">
              {project.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#F7623D]" />
              {project.year}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-[#1E5A54]/65 block mb-1">
              {project.client} &middot; {project.duration}
            </span>
            <h3 className="font-headline text-xl font-bold tracking-tight text-[#1E5A54] group-hover:text-[#F7623D] transition-colors leading-snug line-clamp-2">
              {project.title}
            </h3>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-[#1E5A54]/85 line-clamp-3 leading-relaxed font-sans">
            {project.shortDescription}
          </p>

          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#1E5A54]/12">
              {project.metrics.slice(0, 2).map((m, idx) => (
                <div key={idx}>
                  <span className="font-headline text-lg font-bold text-[#1E5A54] tabular-nums block">
                    {m.value}
                  </span>
                  <span className="text-xs text-[#1E5A54]/70 block mt-0.5">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium px-2.5 py-0.5 rounded-md border border-[#1E5A54]/15 bg-[#EEE6E2]/70 text-[#1E5A54]"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </div>

      <div className="px-6 pb-6 pt-0">
        <Link
          href={`/projects/${project.slug}`}
          className="w-full rounded-lg border border-[#1E5A54]/25 bg-[#EEE6E2]/60 px-4 py-2.5 text-sm font-semibold text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] flex items-center justify-between transition-colors"
        >
          <span>Read case study</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
