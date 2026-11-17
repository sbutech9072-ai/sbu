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
import { Card } from '@/components/ui/card';

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
    <div className="space-y-14 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
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
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <div className="p-7 md:p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-headline text-2xl font-bold text-[#1E5A54]">
                  Project context
                </h2>
                <span className="text-xs font-medium text-[#1E5A54]/70">
                  {project.client} &middot; {project.year}
                </span>
              </div>
              <p className="text-[#1E5A54]/85 leading-relaxed text-base">
                {project.fullDescription}
              </p>
            </div>

            {/* Metrics Impact Bar */}
            <div className="p-7 rounded-2xl border border-[#1E5A54]/20 bg-[#1E5A54] text-[#EEE6E2] space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#EEE6E2]/80">
                <TrendingUp className="h-4 w-4 text-[#F7623D]" />
                <span>Measured production outcomes</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="font-headline text-2xl sm:text-3xl font-bold text-[#EEE6E2] tabular-nums block">
                      {m.value}
                    </span>
                    <span className="text-xs text-[#EEE6E2]/75 block">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Challenge */}
            <div className="space-y-3">
              <h2 className="font-headline text-2xl font-bold text-[#1E5A54] flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-[#F7623D]" />
                <span>The challenge</span>
              </h2>
              <div className="p-7 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] text-[#1E5A54]/85 leading-relaxed text-base">
                {project.challenge}
              </div>
            </div>

            {/* The Solution */}
            <div className="space-y-3">
              <h2 className="font-headline text-2xl font-bold text-[#1E5A54] flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-[#1E5A54]" />
                <span>The solution</span>
              </h2>
              <div className="p-7 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] text-[#1E5A54]/85 leading-relaxed text-base">
                {project.solution}
              </div>
            </div>

            {/* Key Results */}
            <div className="space-y-3">
              <h2 className="font-headline text-2xl font-bold text-[#1E5A54] flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#F7623D]" />
                <span>Production results</span>
              </h2>
              <div className="rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] divide-y divide-[#1E5A54]/12">
                {project.results.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-5 flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#F7623D] mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-[#1E5A54] leading-snug">{res}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <Card className="p-7 border-[#1E5A54]/20 bg-[#F8F4F2] rounded-2xl space-y-5">
              <h3 className="text-xs font-semibold text-[#1E5A54]/70 border-b border-[#1E5A54]/12 pb-3">
                Project details
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-[#1E5A54]/65 block mb-0.5">
                    Client
                  </span>
                  <span className="font-headline text-lg font-bold text-[#1E5A54]">
                    {project.client}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-[#1E5A54]/65 block mb-0.5">
                      Year
                    </span>
                    <span className="text-[#1E5A54] font-semibold">{project.year}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#1E5A54]/65 block mb-0.5">
                      Duration
                    </span>
                    <span className="text-[#1E5A54] font-semibold">{project.duration}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-[#1E5A54]/65 block mb-1.5">
                    Category
                  </span>
                  <Badge variant="default" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-[#1E5A54]/12">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-between h-10 px-4 text-sm font-semibold rounded-lg bg-[#1E5A54] text-[#EEE6E2] hover:bg-[#16443F] transition-colors"
                  >
                    <span>Visit live application</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-between h-10 px-4 text-sm font-semibold rounded-lg border border-[#1E5A54]/25 bg-[#EEE6E2]/50 text-[#1E5A54] hover:border-[#1E5A54] transition-colors"
                  >
                    <span>View repository</span>
                    <Github className="h-4 w-4" />
                  </a>
                )}
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-semibold rounded-lg border border-[#1E5A54]/25 text-[#1E5A54] hover:bg-[#EEE6E2] transition-colors"
                >
                  <span>Build a similar system</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>

            {/* Technologies */}
            <div className="p-6 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-3">
              <h4 className="text-xs font-semibold text-[#1E5A54]/70">
                Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#EEE6E2] text-[#1E5A54] border border-[#1E5A54]/15 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Explore More Case Studies */}
            <div className="p-6 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-3">
              <h4 className="text-xs font-semibold text-[#1E5A54]/70">
                Other case studies
              </h4>
              <div className="space-y-1.5">
                {otherProjects.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="block p-2.5 rounded-lg text-sm text-[#1E5A54] hover:bg-[#EEE6E2] transition-colors"
                  >
                    <span className="font-semibold block truncate">{p.title}</span>
                    <span className="text-xs text-[#1E5A54]/65">
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
