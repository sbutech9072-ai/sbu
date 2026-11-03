import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HandUnderline, StudioStamp } from '@/components/human/hand-crafted-svg';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({
  badge,
  title,
  description,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden border-b border-[#1E5A54]/20 bg-[#EEE6E2] py-14 md:py-20',
        className
      )}
    >
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="max-w-3xl">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#1E5A54]">
                  <li>
                    <Link href="/" className="hover:text-[#F7623D] transition-colors">
                      Home
                    </Link>
                  </li>
                  {breadcrumbs.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <ChevronRight className="h-3.5 w-3.5 text-[#1E5A54]" />
                      {item.href ? (
                        <Link href={item.href} className="hover:text-[#F7623D] transition-colors">
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-[#1E5A54] font-bold">{item.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {badge && (
              <div className="mb-3">
                <div className="w-8 h-[2px] bg-[#1E5A54] mb-2" />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1E5A54]/30 bg-[#F8F4F2] text-[11px] font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D]" />
                  <span>{badge}</span>
                </div>
              </div>
            )}

            <div className="inline-block mb-4">
              <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-normal uppercase tracking-[0.04em] text-[#1E5A54] leading-[1.15]">
                {title}
              </h1>
              <div className="w-36 mt-3">
                <HandUnderline className="h-3 w-full" />
              </div>
            </div>

            <p className="text-base md:text-lg text-[#1E5A54] max-w-3xl leading-relaxed font-sans">
              {description}
            </p>
          </div>

          <div className="hidden md:flex flex-col items-end justify-between shrink-0 pt-2">
            <StudioStamp
              text="SBU TECH // SPEC SHEET"
              subtext="SAN FRANCISCO STUDIO"
              rotate="slight-right"
              variant="cream"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
