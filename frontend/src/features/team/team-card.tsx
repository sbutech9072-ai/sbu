import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { TeamMember } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:-translate-y-1 hover:border-[#1E5A54] hover:bg-[#EEE6E2] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E5A54]/15">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
            STAFF // {member.id.toUpperCase()}
          </span>
          <Badge
            variant="default"
            className="text-[10px] uppercase tracking-[0.16em] bg-[#1E5A54] text-[#EEE6E2]"
          >
            {member.department}
          </Badge>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="relative h-14 w-14 rounded-full overflow-hidden border border-[#1E5A54] bg-[#E2D7D1] shrink-0 flex items-center justify-center font-headline text-lg font-bold text-[#1E5A54] group-hover:border-[#F7623D] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
            {member.name.slice(0, 2).toUpperCase()}
          </div>
          {member.isLeadership && (
            <span className="inline-block -rotate-2 rounded-full border border-[#F7623D] bg-[#EEE6E2] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E5A54]">
              Partner
            </span>
          )}
        </div>

        <div>
          <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#1E5A54] leading-tight">
            {member.name}
          </h3>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F7623D] mt-1">
            {member.role}
          </p>
        </div>

        <p className="text-xs text-[#1E5A54]/90 leading-relaxed font-sans line-clamp-3">
          {member.bio}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {member.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] text-[#1E5A54]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="px-6 py-3.5 border-t border-[#1E5A54]/15 bg-[#EEE6E2]/60 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E5A54]/85">
          Direct Links
        </span>
        <div className="flex items-center gap-3">
          {member.socials.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noreferrer"
              className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
              className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
              className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
