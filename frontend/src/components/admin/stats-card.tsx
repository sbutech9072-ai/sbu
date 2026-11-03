import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  helper?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  helper,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'p-6 border-[#1E5A54]/25 bg-[#F8F4F2] flex flex-col justify-between space-y-4 rounded-3xl',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1E5A54]/85">
            {title}
          </span>
          <div className="font-headline text-3xl sm:text-4xl uppercase text-[#1E5A54] tracking-tight">
            {value}
          </div>
        </div>
        <div className="h-10 w-10 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/25 flex items-center justify-center text-[#1E5A54]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(change || helper) && (
        <div className="flex items-center gap-2 pt-2 border-t border-[#1E5A54]/15 text-xs">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold',
                changeType === 'positive' && 'text-[#1E5A54]',
                changeType === 'negative' && 'text-[#F7623D]',
                changeType === 'neutral' && 'text-[#1E5A54]/85'
              )}
            >
              {changeType === 'positive' && <TrendingUp className="h-3 w-3 text-[#F7623D]" />}
              {changeType === 'negative' && <TrendingDown className="h-3 w-3 text-[#F7623D]" />}
              {change}
            </span>
          )}
          {helper && <span className="text-[#1E5A54]/85 truncate">{helper}</span>}
        </div>
      )}
    </Card>
  );
}
