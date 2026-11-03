import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { teamData } from '@/data/team';
import { TeamList } from '@/features/team/team-list';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Our Engineering & Design Team',
  description:
    'Meet the distributed team of senior architects, product designers, and AI specialists building Sbu Tech client platforms.',
};

export default function TeamPage() {
  return (
    <div className="space-y-16 pb-20 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="The Builders"
        title="Meet the Sbu Tech Engineering Team"
        description="Our team consists of veteran architects, open-source maintainers, and product designers with deep experience delivering high-concurrency systems."
        breadcrumbs={[{ label: 'Our Team' }]}
      />

      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <TeamList initialMembers={teamData} />

        {/* Culture / Hiring Callout */}
        <div className="p-8 md:p-12 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#1E5A54]/70">
              Careers at Sbu Tech
            </span>
            <h3 className="font-headline text-2xl md:text-3xl uppercase tracking-tight text-[#1E5A54]">
              Want to Build High-Performance Cloud Platforms?
            </h3>
            <p className="text-xs md:text-sm text-[#1E5A54]/80 max-w-xl">
              We are constantly seeking senior full-stack architects, cloud infrastructure
              specialists, and AI engineers passionate about clean code and system design.
            </p>
          </div>

          <Button asChild className="shrink-0 gap-2">
            <Link href="/contact">
              <span>Get in Touch</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
