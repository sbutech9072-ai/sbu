import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
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
  title,
  description,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'relative border-b border-[#1E5A54]/15 bg-[#EEE6E2] py-12 md:py-16',
        className
      )}
    >
      <div className="site-container">
        <div className="max-w-3xl space-y-4">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-xs font-medium text-[#1E5A54]/70">
                <li>
                  <Link href="/" className="hover:text-[#1E5A54] transition-colors">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <ChevronRight className="h-3.5 w-3.5 text-[#1E5A54]/50" />
                    {item.href ? (
                      <Link href={item.href} className="hover:text-[#1E5A54] transition-colors">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-[#1E5A54] font-semibold">{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E5A54] leading-[1.08]">
            {title}
          </h1>

          <p className="text-base md:text-lg text-[#1E5A54]/80 max-w-2xl leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
