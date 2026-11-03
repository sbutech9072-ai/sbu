import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { teamData } from '@/data/team';
import { TeamCard } from '@/features/team/team-card';
import { SectionHeading } from '@/components/shared/section-heading';

export function TeamOverview() {
  const leadership = teamData.filter((m) => m.isLeadership).slice(0, 3);

  return (
    <section className="py-20 md:py-28 border-b border-[#1E5A54]/18 bg-[#EEE6E2]">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Leadership & Expertise"
            title="Guided by Veteran Architects & Product Craftsmen"
            subtitle="Meet the experienced engineers, researchers, and designers steering technical strategy and project execution at Sbu Tech."
          />

          <Link
            href="/team"
            className="group self-start md:self-auto shrink-0 inline-flex items-center gap-3 rounded-full border border-[#1E5A54] pl-6 pr-1.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54]/5 transition-all"
          >
            <span>View Full Team ({teamData.length})</span>
            <span className="w-6 h-6 rounded-full bg-[#F7623D] text-white flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
