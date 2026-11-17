import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { teamData } from '@/data/team';
import { TeamList } from '@/features/team/team-list';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Our Engineering & Design Team',
  description:
    'Meet the senior architects, product designers, and systems engineers building Sbu Tech client platforms.',
};

export default function TeamPage() {
  return (
    <div className="space-y-20 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        title="The engineers who write your code"
        description="We do not pitch with principals and staff with juniors. Meet the architects, open-source maintainers, and product designers who run our engagements."
        breadcrumbs={[{ label: 'Our Team' }]}
      />

      <div className="site-container space-y-20">
        <TeamList initialMembers={teamData} />

        {/* Hiring Callout */}
        <div className="p-8 md:p-12 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-semibold text-[#F7623D]">
              Careers &middot; San Francisco &amp; Remote
            </span>
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-[#1E5A54]">
              Care about clean schemas and fast builds?
            </h3>
            <p className="text-sm text-[#1E5A54]/80 leading-relaxed">
              We hire senior full-stack engineers, Kubernetes operators, and product designers who
              prefer shipping working code over sitting in status meetings.
            </p>
          </div>

          <Button asChild size="lg" className="shrink-0 gap-2">
            <Link href="/contact">
              <span>Send your GitHub</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
