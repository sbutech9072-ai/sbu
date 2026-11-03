'use client';

import React, { useState } from 'react';
import { TeamMember } from '@/types';
import { TeamCard } from '@/features/team/team-card';
import { cn } from '@/lib/utils';

interface TeamListProps {
  initialMembers: TeamMember[];
}

export function TeamList({ initialMembers }: TeamListProps) {
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = ['All', 'Leadership', 'Engineering', 'Design', 'Product'];

  const filteredMembers =
    selectedDept === 'All'
      ? initialMembers
      : initialMembers.filter((m) => m.department === selectedDept);

  return (
    <div className="space-y-8">
      {/* Department Filter Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-2 rounded-full bg-[#F8F4F2] border border-[#1E5A54]/25 gap-2 flex-wrap justify-center">
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer flex items-center gap-2',
                  isSelected
                    ? 'bg-[#1E5A54] text-[#EEE6E2] border border-[#1E5A54]'
                    : 'bg-[#EEE6E2] text-[#1E5A54] border border-[#1E5A54]/20 hover:border-[#1E5A54]'
                )}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D]" />
                )}
                <span>{dept}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
