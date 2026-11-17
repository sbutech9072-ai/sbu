import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { teamData } from '@/data/team';
import { TeamCard } from '@/features/team/team-card';
import { SectionHeading } from '@/components/shared/section-heading';

export function TeamOverview() {
  const leadership = teamData.filter((m) => m.isLeadership).slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-[#F8F4F2]">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-4 space-y-5">
            <SectionHeading
              align="left"
              title="Led by practicing systems architects"
              subtitle="Our founding partners write code, review pull requests, and lead architecture sessions on every engagement."
            />

            <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
              We keep our studio intentionally compact at {teamData.length} senior engineers and
              product designers so every project gets direct senior attention.
            </p>

            <div className="pt-1">
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-lg border border-[#1E5A54]/30 bg-[#EEE6E2] px-4 py-2.5 text-sm font-semibold text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
              >
                <span>Meet all {teamData.length} engineers</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((member) => (
              <div key={member.id}>
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
