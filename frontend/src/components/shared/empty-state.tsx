import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1E5A54]/30 bg-[#F8F4F2] p-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1E5A54]/20 bg-[#EEE6E2] text-[#F7623D]">
        <Icon className="h-6 w-6 text-[#F7623D]" />
      </div>
      <h3 className="mb-1.5 font-headline text-2xl uppercase tracking-tight text-[#1E5A54]">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#1E5A54]/80">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
