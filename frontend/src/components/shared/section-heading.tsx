import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl xl:max-w-4xl space-y-3',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1E5A54] leading-[1.12]">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-base md:text-lg text-[#1E5A54]/80 leading-relaxed max-w-2xl font-sans',
            align === 'center' ? 'mx-auto' : ''
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
