import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { teamData } from '@/data/team';
import { TeamCard } from '@/features/team/team-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { HandArrow, StudioStamp } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

export function TeamOverview() {
  const leadership = teamData.filter((m) => m.isLeadership).slice(0, 3);

  return (
    <section className="py-20 md:py-28 border-b border-[#1E5A54]/20 bg-[#EEE6E2]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Asymmetric Editorial Layout: Left 4-Col Leadership Ethos / Right 8-Col Staggered Principals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Leadership Ethos */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <StudioStamp
                text="FOUNDING PRINCIPALS"
                subtext="HANDS-ON ARCHITECTS"
                rotate="slight-left"
                variant="cream"
              />
              <HandArrow direction="right" className="hidden lg:block" />
            </div>

            <SectionHeading
              align="left"
              badge="Studio Principals"
              title="Led by Practicing Systems Architects"
              subtitle="Our founding partners write code, review pull requests, and lead architecture sessions on every client engagement."
            />

            <p className="text-sm text-[#1E5A54] leading-relaxed font-sans">
              We keep our studio intentionally compact at {teamData.length} senior engineers and
              product designers so every project gets direct principal attention.
            </p>

            <div className="pt-2">
              <Link
                href="/team"
                className="group inline-flex items-center gap-3 rounded-full border border-[#1E5A54] bg-[#F8F4F2] pl-6 pr-1.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all"
              >
                <span>Meet All {teamData.length} Engineers</span>
                <span className="w-7 h-7 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Leadership Cards (staggered vertically on desktop md:even:translate-y-6) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
            {leadership.map((member) => (
              <div key={member.id} className="md:even:translate-y-6 transition-transform">
                <TiltCard className="h-full">
                  <TeamCard member={member} />
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
