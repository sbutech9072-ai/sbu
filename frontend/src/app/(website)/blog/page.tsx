import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { blogsData } from '@/data/blogs';
import { BlogList } from '@/features/blogs/blog-list';

export const metadata: Metadata = {
  title: 'Engineering Blog & Insights',
  description:
    'Deep dives on Next.js, Kubernetes zero-downtime cutovers, enterprise RAG architectures, and design systems.',
};

export default function BlogPage() {
  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge="Engineering Bulletin"
        title="Technical Insights & Architectural Playbooks"
        description="Written directly by our architects and engineers. Real production lessons, architectural patterns, and performance optimizations."
        breadcrumbs={[{ label: 'Blog' }]}
      />

      <div className="container mx-auto px-4 max-w-7xl">
        <BlogList initialPosts={blogsData} />
      </div>
    </div>
  );
}

