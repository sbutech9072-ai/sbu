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
  badge,
  title,
  description,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-blue-950/20 via-slate-900/60 to-slate-950 py-16 md:py-20',
        className
      )}
    >
      {/* Subtle decorative background gradient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                  {item.href ? (
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-blue-400 font-medium">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {badge && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3 tracking-wide">
            {badge}
          </span>
        )}

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          {title}
        </h1>

        <p className="text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

