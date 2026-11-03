import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Layers } from 'lucide-react';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col justify-between overflow-hidden border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300">
      <div>
        {/* Header Preview Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 p-6 flex flex-col justify-between border-b border-slate-800">
          <div className="flex items-center justify-between z-10">
            <Badge variant="default" className="text-xs">
              {project.category}
            </Badge>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {project.year}
            </span>
          </div>

          <div className="z-10">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              {project.client}
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
              {project.title}
            </h3>
          </div>

          {/* Decorative subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        </div>

        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Key Metrics snapshot */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
              {project.metrics.slice(0, 2).map((m, idx) => (
                <div key={idx} className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60">
                  <span className="text-xs text-slate-400 block">{m.label}</span>
                  <span className="text-sm font-bold text-white text-blue-300">{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-400">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <div className="px-6 pb-6 pt-0">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex w-full items-center justify-between rounded-xl bg-slate-800/50 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-blue-600 hover:text-white transition-all group/btn"
        >
          <span>View Case Study</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
      </div>
    </Card>
  );
}

