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
    <Card className="overflow-hidden border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0">
            {/* Fallback avatar preview */}
            <div className="h-full w-full flex items-center justify-center text-lg font-bold text-slate-300 bg-gradient-to-br from-blue-900/60 to-slate-900">
              {member.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <Badge variant={member.isLeadership ? 'default' : 'secondary'} className="text-[11px]">
            {member.department}
          </Badge>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{member.name}</h3>
          <p className="text-xs font-medium text-blue-400 mt-0.5">{member.role}</p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{member.bio}</p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {member.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="px-6 py-3.5 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-3">
        {member.socials.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
            aria-label={`${member.name} GitHub`}
          >
            <Github className="h-4 w-4" />
          </a>
        )}
        {member.socials.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
            aria-label={`${member.name} LinkedIn`}
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
        {member.socials.twitter && (
          <a
            href={member.socials.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
            aria-label={`${member.name} Twitter`}
          >
            <Twitter className="h-4 w-4" />
          </a>
        )}
      </div>
    </Card>
  );
}

