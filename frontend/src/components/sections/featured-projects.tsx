import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { projectsData } from '@/data/projects';
import { ProjectCard } from '@/features/projects/project-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';

export function FeaturedProjects() {
  const featured = projectsData.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <section className="py-20 md:py-28 border-b border-slate-800/80 bg-slate-950/40">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Selected Work"
            title="Real-World Case Studies & Architectural Outcomes"
            subtitle="Explore how we built telemetry platforms, biometric financial applications, and private LLM copilots with proven measurable impact."
          />

          <Button asChild variant="outline" className="self-start md:self-auto shrink-0 gap-1.5">
            <Link href="/projects">
              <span>View All Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

