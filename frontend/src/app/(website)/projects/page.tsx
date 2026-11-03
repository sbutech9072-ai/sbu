import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { projectsData } from '@/data/projects';
import { ProjectList } from '@/features/projects/project-list';

export const metadata: Metadata = {
  title: 'Case Studies & Portfolio',
  description:
    'Explore our portfolio of scalable web platforms, high-throughput cloud migrations, native mobile applications, and AI integrations.',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge="Proven Results"
        title="Case Studies & Architectural Portfolio"
        description="Detailed teardowns of how we solved complex technical bottlenecks, modernized legacy infrastructures, and built delightful user experiences."
        breadcrumbs={[{ label: 'Projects' }]}
      />

      <div className="container mx-auto px-4 max-w-7xl">
        <ProjectList initialProjects={projectsData} />
      </div>
    </div>
  );
}

