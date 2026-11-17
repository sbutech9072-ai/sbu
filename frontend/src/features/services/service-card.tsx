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
    <Card className="group relative flex flex-col justify-between rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-6 md:p-7 hover:border-[#1E5A54]/45 transition-colors duration-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-block rounded-md bg-[#EEE6E2] px-2.5 py-1 text-xs font-medium text-[#1E5A54]/80">
            {service.category}
          </span>
          <div className="h-10 w-10 shrink-0 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center text-[#1E5A54]">
            {icon}
          </div>
        </div>

        <h3 className="font-headline text-2xl font-bold tracking-tight text-[#1E5A54] leading-snug">
          {service.title}
        </h3>

        <p className="text-sm text-[#1E5A54]/85 leading-relaxed font-sans">
          {service.shortDescription}
        </p>

        <div className="space-y-2 pt-3 border-t border-[#1E5A54]/12">
          {service.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#1E5A54]/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D] mt-1.5 shrink-0" />
              <span className="leading-snug">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-5 mt-6 border-t border-[#1E5A54]/12 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-[#1E5A54]/65">
          {service.deliverables.length} deliverables &middot; {service.processSteps.length} phases
        </span>
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E5A54] group-hover:text-[#F7623D] transition-colors"
        >
          <span>Explore</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
