import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { blogsData } from '@/data/blogs';
import { BlogList } from '@/features/blogs/blog-list';
import { StudioStamp } from '@/components/human/hand-crafted-svg';

export const metadata: Metadata = {
  title: 'Engineering Blog & Insights',
  description:
    'Field notes on Next.js, Kubernetes zero-downtime cutovers, enterprise retrieval pipelines, and design systems.',
};

export default function BlogPage() {
  return (
    <div className="space-y-14 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="Engineering Bulletin"
        title="Field Notes & Architectural Playbooks"
        description="Written by the engineers who build our systems. Practical post-mortems, migration guides, and latency benchmarks."
        breadcrumbs={[{ label: 'Blog' }]}
      />

      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E5A54]/20 pb-4">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#1E5A54]">
            Authored in-house • Zero ghostwriters
          </span>
          <StudioStamp
            text="TECHNICAL DISPATCH"
            rotate="slight-left"
            variant="teal"
          />
        </div>

        <BlogList initialPosts={blogsData} />
      </div>
    </div>
  );
}
