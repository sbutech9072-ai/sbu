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
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 gap-1 flex-wrap justify-center">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                selectedDept === dept
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              )}
            >
              {dept}
            </button>
          ))}
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

