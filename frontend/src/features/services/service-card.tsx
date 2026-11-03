import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Cloud,
  Smartphone,
  Cpu,
  Palette,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Service } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCardProps {
  service: Service;
}

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-6 w-6 text-blue-400" />,
  Cloud: <Cloud className="h-6 w-6 text-cyan-400" />,
  Smartphone: <Smartphone className="h-6 w-6 text-indigo-400" />,
  Cpu: <Cpu className="h-6 w-6 text-purple-400" />,
  Palette: <Palette className="h-6 w-6 text-pink-400" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
};

export function ServiceCard({ service }: ServiceCardProps) {
  const icon = iconMap[service.iconName] || <Code2 className="h-6 w-6 text-blue-400" />;

  return (
    <Card className="group flex flex-col justify-between border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/90 hover:border-slate-700/90 transition-all duration-300 p-6 md:p-8">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-widest px-2.5 py-1 rounded bg-slate-950/60 border border-slate-800">
            {service.category}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-sm text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
            {service.shortDescription}
          </p>
        </div>

        {/* Feature bullet highlights */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          {service.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-slate-800/60">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors group-hover:gap-2.5"
        >
          <span>Explore Capabilities & Process</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}

