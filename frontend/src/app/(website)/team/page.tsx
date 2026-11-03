import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { teamData } from '@/data/team';
import { TeamList } from '@/features/team/team-list';
import { Button } from '@/components/ui/button';
import { StudioStamp, HandArrow } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

export const metadata: Metadata = {
  title: 'Our Engineering & Design Team',
  description:
    'Meet the senior architects, product designers, and systems engineers building Sbu Tech client platforms.',
};

export default function TeamPage() {
  return (
    <div className="space-y-20 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="The Builders"
        title="The Engineers Who Actually Write Your Code"
        description="We do not pitch with principals and staff with juniors. Meet the architects, open-source maintainers, and product designers who run our engagements."
        breadcrumbs={[{ label: 'Our Team' }]}
      />

      <div className="container mx-auto px-4 max-w-7xl space-y-20">
        <TeamList initialMembers={teamData} />

        {/* Culture / Hiring Callout */}
        <TiltCard className="p-8 md:p-12 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <StudioStamp
              text="CAREERS // SAN FRANCISCO & REMOTE"
              rotate="slight-left"
              variant="orange"
            />
            <h3 className="font-headline text-2xl md:text-4xl uppercase text-[#1E5A54] tracking-tight pt-1">
              Care About Clean Schemas and Fast Builds?
            </h3>
            <p className="text-sm text-[#1E5A54] leading-relaxed">
              We hire senior full-stack engineers, Kubernetes operators, and product designers who
              prefer shipping working code over sitting in status meetings.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <HandArrow direction="right" className="hidden md:block" />
            <Button asChild size="lg" className="shrink-0 gap-2 rounded-full">
              <Link href="/contact">
                <span>Send Your GitHub</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
