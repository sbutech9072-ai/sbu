import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { projectsData } from '@/data/projects';
import { ProjectList } from '@/features/projects/project-list';

export const metadata: Metadata = {
  title: 'Case Studies & Portfolio',
  description:
    'Explore our portfolio of web platforms, zero-downtime cloud migrations, mobile applications, and enterprise AI systems.',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-12 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        title="Production case studies & architecture"
        description="How we resolved scaling bottlenecks, migrated legacy databases, and shipped dependable software."
        breadcrumbs={[{ label: 'Projects' }]}
      />

      <div className="site-container">
        <ProjectList initialProjects={projectsData} />
      </div>
    </div>
  );
}
