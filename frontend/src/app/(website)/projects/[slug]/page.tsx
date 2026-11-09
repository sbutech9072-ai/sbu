import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ExternalLink,
  Github,
  Layers,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { projectsData } from '@/data/projects';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StudioStamp, HandUnderline } from '@/components/human/hand-crafted-svg';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = projectsData.find((p) => p.slug === params.slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = projectsData.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  const otherProjects = projectsData.filter((p) => p.slug !== project.slug);

  return (
    <div className="space-y-16 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge={project.category}
        title={project.title}
        description={project.shortDescription}
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: project.title },
        ]}
      />

      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Main Case Study Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview / Context */}
            <div className="p-8 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54] tracking-tight">
                  Project Context
                </h2>
                <StudioStamp
                  text={`CLIENT // ${project.client.toUpperCase()}`}
                  subtext={`DELIVERED ${project.year}`}
                  rotate="slight-left"
                  variant="cream"
                />
              </div>
              <p className="text-[#1E5A54] leading-relaxed text-base">
                {project.fullDescription}
              </p>
            </div>

            {/* Metrics Impact Bar */}
            <div className="p-7 rounded-3xl border border-[#1E5A54]/25 bg-[#E2D7D1] space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]">
                  <TrendingUp className="h-4 w-4 text-[#F7623D]" />
                  <span>Measured Production Outcomes</span>
                </div>
                <StudioStamp text="BENCHMARKED" rotate="right" variant="orange" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {project.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F8F4F2] p-4 rounded-2xl border border-[#1E5A54]/25 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <span className="font-headline text-2xl sm:text-3xl text-[#1E5A54] block">
                      {m.value}
                    </span>
                    <span className="text-xs font-medium text-[#1E5A54]">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Challenge */}
            <div className="space-y-4">
              <h2 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-[#F7623D]" />
                <span>The Engineering Bottleneck</span>
              </h2>
              <div className="p-7 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] text-[#1E5A54] leading-relaxed text-base">
                {project.challenge}
              </div>
            </div>

            {/* The Solution */}
            <div className="space-y-4">
              <h2 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-[#1E5A54]" />
                <span>
                  Architectural{' '}
                  <span className="relative inline-block">
                    Solution
                    <HandUnderline className="mt-0.5" />
                  </span>
                </span>
              </h2>
              <div className="p-7 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] text-[#1E5A54] leading-relaxed text-base">
                {project.solution}
              </div>
            </div>

            {/* Key Results */}
            <div className="space-y-4">
              <h2 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#F7623D]" />
                <span>Production Results</span>
              </h2>
              <div className="space-y-3">
                {project.results.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#F7623D] mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-[#1E5A54] leading-snug">{res}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <Card className="p-7 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl space-y-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54] border-b border-[#1E5A54]/20 pb-3">
                Engagement Metadata
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#1E5A54] block mb-0.5 font-mono uppercase">
                    Client Organization
                  </span>
                  <span className="font-headline text-xl uppercase text-[#1E5A54]">
                    {project.client}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#1E5A54] block mb-0.5 font-mono uppercase">
                      Delivery Year
                    </span>
                    <span className="text-[#1E5A54] font-bold text-sm">{project.year}</span>
                  </div>
                  <div>
                    <span className="text-[#1E5A54] block mb-0.5 font-mono uppercase">
                      Duration
                    </span>
                    <span className="text-[#1E5A54] font-bold text-sm">{project.duration}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#1E5A54] block mb-1 font-mono uppercase">
                    Classification
                  </span>
                  <Badge variant="default" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3 border-t border-[#1E5A54]/20">
                {project.liveUrl && (
                  <Button asChild className="w-full justify-between h-10 text-xs rounded-full">
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <span>Visit Live Application</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between h-10 text-xs rounded-full"
                  >
                    <a href={project.githubUrl} target="_blank" rel="noreferrer">
                      <span>Public Case Repo</span>
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button
                  asChild
                  variant="secondary"
                  className="w-full justify-center h-10 text-xs rounded-full gap-1.5"
                >
                  <Link href="/get-a-quote">
                    <span>Build a Similar System</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Technologies */}
            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]">
                Architecture & Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-[#EEE6E2] text-[#1E5A54] border border-[#1E5A54]/25 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Explore More Case Studies */}
            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]">
                Other Case Studies
              </h4>
              <div className="space-y-2">
                {otherProjects.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="block p-3 rounded-2xl text-xs text-[#1E5A54] hover:bg-[#E2D7D1] transition-colors"
                  >
                    <span className="font-bold block truncate">{p.title}</span>
                    <span className="text-[10px] text-[#1E5A54] decoration-[#F7623D] font-mono uppercase">
                      {p.category}
                    </span>
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
