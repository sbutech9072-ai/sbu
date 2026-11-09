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
        'max-w-3xl xl:max-w-4xl 2xl:max-w-5xl space-y-2.5 sm:space-y-3',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge && (
        <div className={cn('flex flex-col', align === 'center' ? 'items-center' : 'items-start')}>
          <div className="w-8 h-[2px] bg-[#1E5A54] mb-1.5" />
          <Badge variant="default" className="text-[11px] xl:text-xs uppercase tracking-[0.18em] font-bold text-[#1E5A54]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] inline-block mr-1.5" />
            {badge}
          </Badge>
        </div>
      )}
      <div className={cn('inline-block', align === 'center' ? 'mx-auto' : '')}>
        <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-normal tracking-[0.04em] text-[#1E5A54] uppercase leading-[1.1]">
          {title}
        </h2>
        <div className={cn('mt-2', align === 'center' ? 'mx-auto w-24 xl:w-32' : 'w-24 xl:w-32')}>
          <HandUnderline className="h-2 w-full" />
        </div>
      </div>
      {subtitle && (
        <p
          className={cn(
            'text-sm md:text-base xl:text-lg text-[#1E5A54] leading-relaxed max-w-2xl xl:max-w-3xl font-sans pt-0.5',
            align === 'center' ? 'mx-auto' : ''
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
