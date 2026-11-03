import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HandUnderline } from '@/components/human/hand-crafted-svg';
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
        'max-w-3xl space-y-3.5',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge && (
        <div className={cn('flex flex-col', align === 'center' ? 'items-center' : 'items-start')}>
          <div className="w-8 h-[2px] bg-[#1E5A54] mb-2" />
          <Badge variant="default" className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#1E5A54]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] inline-block mr-1.5" />
            {badge}
          </Badge>
        </div>
      )}
      <div className={cn(' inline-block', align === 'center' ? 'mx-auto' : '')}>
        <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#1E5A54] uppercase leading-[0.94]">
          {title}
        </h2>
        <div className={cn('mt-2', align === 'center' ? 'mx-auto w-28' : 'w-28')}>
          <HandUnderline className="h-2.5 w-full" />
        </div>
      </div>
      {subtitle && (
        <p
          className={cn(
            'text-sm md:text-base text-[#1E5A54] leading-relaxed max-w-2xl font-sans',
            align === 'center' ? 'mx-auto' : ''
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
