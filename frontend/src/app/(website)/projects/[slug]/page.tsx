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
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const otherProjects = projectsData.filter((p) => p.slug !== project.slug);

  return (
    <div className="space-y-16 pb-20 bg-[#EEE6E2] text-[#1E5A54]">
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
              <h2 className="font-headline text-3xl uppercase tracking-tight text-[#1E5A54]">Project Background</h2>
              <p className="text-[#1E5A54]/80 leading-relaxed text-base">
                {project.fullDescription}
              </p>
            </div>

            {/* Metrics Impact Bar */}
            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                <TrendingUp className="h-4 w-4 text-[#F7623D]" />
                <span>Measurable Outcomes & Production Impact</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="bg-[#EEE6E2] p-4 rounded-2xl border border-[#1E5A54]/20">
                    <span className="font-headline text-2xl sm:text-3xl text-[#1E5A54] block">
                      {m.value}
                    </span>
                    <span className="text-xs text-[#1E5A54]/70">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Challenge */}
            <div className="space-y-4">
              <h2 className="font-headline text-3xl uppercase tracking-tight text-[#1E5A54] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#F7623D]" />
                <span>The Engineering Challenge</span>
              </h2>
              <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] text-[#1E5A54]/80 leading-relaxed text-sm">
                {project.challenge}
              </div>
            </div>

            {/* The Solution */}
            <div className="space-y-4">
              <h2 className="font-headline text-3xl uppercase tracking-tight text-[#1E5A54] flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#1E5A54]" />
                <span>Architectural Solution</span>
              </h2>
              <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] text-[#1E5A54]/80 leading-relaxed text-sm">
                {project.solution}
              </div>
            </div>

            {/* Key Results */}
            <div className="space-y-4">
              <h2 className="font-headline text-3xl uppercase tracking-tight text-[#1E5A54] flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#1E5A54]" />
                <span>Production Results</span>
              </h2>
              <div className="space-y-3">
                {project.results.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] shrink-0 mt-2" />
                    <span className="text-sm text-[#1E5A54]/85 leading-snug">{res}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <Card className="p-6 border-[#1E5A54]/25 bg-[#EEE6E2] space-y-6 rounded-3xl">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54] border-b border-[#1E5A54]/18 pb-3">
                Engagement Metadata
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#1E5A54]/60 block mb-0.5 font-medium uppercase tracking-wider">Client Organization</span>
                  <span className="text-[#1E5A54] font-semibold text-sm">{project.client}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#1E5A54]/60 block mb-0.5 font-medium uppercase tracking-wider">Delivery Year</span>
                    <span className="text-[#1E5A54] font-medium">{project.year}</span>
                  </div>
                  <div>
                    <span className="text-[#1E5A54]/60 block mb-0.5 font-medium uppercase tracking-wider">Project Duration</span>
                    <span className="text-[#1E5A54] font-medium">{project.duration}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#1E5A54]/60 block mb-1 font-medium uppercase tracking-wider">Classification</span>
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-[#1E5A54]/18">
                {project.liveUrl && (
                  <Button asChild className="w-full justify-between">
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <span>Visit Live Application</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild variant="outline" className="w-full justify-between">
                    <a href={project.githubUrl} target="_blank" rel="noreferrer">
                      <span>Public Case Repo</span>
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link href="/get-a-quote">Build Similar System</Link>
                </Button>
              </div>
            </Card>

            {/* Technologies */}
            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                Architecture & Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEE6E2] text-[#1E5A54] border border-[#1E5A54]/30"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Explore More Case Studies */}
            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                Other Case Studies
              </h4>
              <div className="space-y-2">
                {otherProjects.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="block p-2.5 rounded-2xl text-xs text-[#1E5A54]/80 hover:text-[#1E5A54] hover:bg-[#1E5A54]/5 transition-colors"
                  >
                    <span className="font-medium block truncate">{p.title}</span>
                    <span className="text-[10px] text-[#1E5A54]/60 uppercase tracking-wider">{p.category}</span>
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
