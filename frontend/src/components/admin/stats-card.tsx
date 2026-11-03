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
    <Card className={cn('p-6 border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </div>
        </div>
        <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(change || helper) && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold',
                changeType === 'positive' && 'text-emerald-400',
                changeType === 'negative' && 'text-rose-400',
                changeType === 'neutral' && 'text-slate-400'
              )}
            >
              {changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
              {changeType === 'negative' && <TrendingDown className="h-3 w-3" />}
              {change}
            </span>
          )}
          {helper && <span className="text-slate-500 truncate">{helper}</span>}
        </div>
      )}
    </Card>
  );
}

