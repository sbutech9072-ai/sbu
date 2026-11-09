import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { projectsData } from '@/data/projects';
import { ProjectList } from '@/features/projects/project-list';
import { StudioStamp } from '@/components/human/hand-crafted-svg';

export const metadata: Metadata = {
  title: 'Case Studies & Portfolio',
  description:
    'Explore our portfolio of web platforms, zero-downtime cloud migrations, mobile applications, and enterprise AI systems.',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-14 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="Proven Results"
        title="Production Case Studies & Architecture Teardowns"
        description="Honest field reports on how we fixed bottlenecks, migrated legacy databases, and shipped dependable software."
        breadcrumbs={[{ label: 'Projects' }]}
      />

      <div className="site-container space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E5A54]/20 pb-4">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#1E5A54]">
            Showing verified production deployments
          </span>
          <StudioStamp
            text="VERIFIED TELEMETRY // 2023-2026"
            rotate="slight-right"
            variant="teal"
          />
        </div>

        <ProjectList initialProjects={projectsData} />
      </div>
    </div>
  );
}
