import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { TeamMember } from '@/types';
import { Card } from '@/components/ui/card';

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-[#1E5A54]/20 bg-[#EEE6E2]/65 hover:border-[#1E5A54]/45 hover:bg-[#EEE6E2] transition-colors duration-200 flex flex-col justify-between h-full">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="h-12 w-12 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2] shrink-0 flex items-center justify-center font-headline text-base font-bold text-[#1E5A54]">
            {member.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            {member.isLeadership && (
              <span className="rounded-md border border-[#F7623D]/40 bg-[#F8F4F2] px-2 py-0.5 text-[11px] font-medium text-[#1E5A54]">
                Partner
              </span>
            )}
            <span className="rounded-md bg-[#1E5A54] px-2.5 py-0.5 text-[11px] font-medium text-[#EEE6E2]">
              {member.department}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-headline text-xl font-bold tracking-tight text-[#1E5A54] leading-snug">
            {member.name}
          </h3>
          <p className="text-xs font-medium text-[#F7623D] mt-0.5">
            {member.role}
          </p>
        </div>

        <p className="text-xs text-[#1E5A54]/85 leading-relaxed font-sans line-clamp-3">
          {member.bio}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {member.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-[#1E5A54]/15 bg-[#F8F4F2] text-[#1E5A54]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 py-3.5 border-t border-[#1E5A54]/12 flex items-center justify-between">
        <span className="text-xs font-medium text-[#1E5A54]/65">
          Links
        </span>
        <div className="flex items-center gap-3">
          {member.socials.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noreferrer"
              className="text-[#1E5A54]/75 hover:text-[#F7623D] transition-colors"
              aria-label={`${member.name} GitHub`}
            >
              <Github className="h-4 w-4 stroke-[1.75]" />
            </a>
          )}
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[#1E5A54]/75 hover:text-[#F7623D] transition-colors"
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin className="h-4 w-4 stroke-[1.75]" />
            </a>
          )}
          {member.socials.twitter && (
            <a
              href={member.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="text-[#1E5A54]/75 hover:text-[#F7623D] transition-colors"
              aria-label={`${member.name} Twitter`}
            >
              <Twitter className="h-4 w-4 stroke-[1.75]" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
