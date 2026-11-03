import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl space-y-3',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge && (
        <div className={cn('flex', align === 'center' ? 'justify-center' : 'justify-start')}>
          <Badge variant="default" className="text-xs uppercase tracking-wider font-semibold">
            {badge}
          </Badge>
        </div>
      )}
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
      {subtitle && (
        <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

