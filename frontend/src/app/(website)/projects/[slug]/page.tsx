import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Layers,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { projectsData } from '@/data/projects';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-16 pb-20">
      <PageHeader
        badge={project.category}
        title={project.title}
        description={project.shortDescription}
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: project.title },
        ]}
      />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Case Study Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview / Context */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Project Background</h2>
              <p className="text-slate-300 leading-relaxed text-base">
                {project.fullDescription}
              </p>
            </div>

            {/* Metrics Impact Bar */}
            <div className="p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
                <TrendingUp className="h-4 w-4" />
                <span>Measurable Outcomes & Production Impact</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xl sm:text-2xl font-extrabold text-white block">
                      {m.value}
                    </span>
                    <span className="text-xs text-slate-400">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Challenge */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-5 w-5" />
                <span>The Engineering Challenge</span>
              </h2>
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-300 leading-relaxed text-sm">
                {project.challenge}
              </div>
            </div>

            {/* The Solution */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 text-blue-400">
                <Layers className="h-5 w-5" />
                <span>Architectural Solution</span>
              </h2>
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-300 leading-relaxed text-sm">
                {project.solution}
              </div>
            </div>

            {/* Key Results */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span>Production Results</span>
              </h2>
              <div className="space-y-3">
                {project.results.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300 leading-snug">{res}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
                Engagement Metadata
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Client Organization</span>
                  <span className="text-white font-semibold text-sm">{project.client}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-medium">Delivery Year</span>
                    <span className="text-white font-medium">{project.year}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-medium">Project Duration</span>
                    <span className="text-white font-medium">{project.duration}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Classification</span>
                  <Badge variant="default" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {project.liveUrl && (
                  <Button asChild className="w-full justify-between h-10 text-xs">
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <span>Visit Live Application</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild variant="outline" className="w-full justify-between h-10 text-xs">
                    <a href={project.githubUrl} target="_blank" rel="noreferrer">
                      <span>Public Case Repo</span>
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button asChild variant="secondary" className="w-full justify-center h-10 text-xs">
                  <Link href="/get-a-quote">Build Similar System</Link>
                </Button>
              </div>
            </Card>

            {/* Technologies */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Architecture & Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Explore More Case Studies */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Other Case Studies
              </h4>
              <div className="space-y-2">
                {otherProjects.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="block p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-semibold block truncate">{p.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.category}</span>
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

