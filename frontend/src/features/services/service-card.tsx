import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Cloud,
  Smartphone,
  Cpu,
  Palette,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { Service } from '@/types';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  service: Service;
}

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-5 w-5 text-[#1E5A54] stroke-[1.75]" />,
  Cloud: <Cloud className="h-5 w-5 text-[#1E5A54] stroke-[1.75]" />,
  Smartphone: <Smartphone className="h-5 w-5 text-[#1E5A54] stroke-[1.75]" />,
  Cpu: <Cpu className="h-5 w-5 text-[#1E5A54] stroke-[1.75]" />,
  Palette: <Palette className="h-5 w-5 text-[#1E5A54] stroke-[1.75]" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5 text-[#1E5A54] stroke-[1.75]" />,
};

export function ServiceCard({ service }: ServiceCardProps) {
  const icon =
    iconMap[service.iconName] || <Code2 className="h-5 w-5 text-[#1E5A54] stroke-[1.75]" />;

  return (
    <Card className="group relative flex flex-col justify-between rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] p-6 md:p-8 hover:-translate-y-1 hover:border-[#1E5A54] hover:bg-[#EEE6E2] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <div>
        {/* Architectural Spec Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1E5A54]/15">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
            SPEC // {service.id.toUpperCase()}
          </span>
          <span className="inline-block -rotate-1 rounded-full border border-[#1E5A54]/30 bg-[#E2D7D1] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54] group-hover:rotate-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
            {service.category}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#1E5A54] leading-tight">
              {service.title}
            </h3>
            <div className="h-11 w-11 shrink-0 rounded-xl border border-[#1E5A54]/30 bg-[#EEE6E2] flex items-center justify-center text-[#1E5A54] group-hover:border-[#F7623D] group-hover:rotate-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
              {icon}
            </div>
          </div>

          <p className="text-sm text-[#1E5A54]/90 leading-relaxed font-sans">
            {service.shortDescription}
          </p>

          {/* Feature bullet highlights */}
          <div className="space-y-2.5 pt-4 border-t border-[#1E5A54]/15">
            {service.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1E5A54]/90">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D] mt-1.5 shrink-0" />
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-[#1E5A54]/15 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#1E5A54]/85">
          {service.deliverables.length} Deliverables · {service.processSteps.length} Phases
        </span>
        <Link
          href={`/services/${service.slug}`}
          className="group/link inline-flex items-center gap-2 rounded-full border border-[#1E5A54] bg-[#EEE6E2] pl-4 pr-1.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          <span>Inspect Spec</span>
          <span className="w-6 h-6 rounded-full bg-[#F7623D] text-[#F8F4F2] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-0.5">
            <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
          </span>
        </Link>
      </div>
    </Card>
  );
}
