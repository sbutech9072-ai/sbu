import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'border-[#1E5A54]/25 bg-transparent text-[#1E5A54]',
        secondary: 'border-[#1E5A54]/20 bg-[#1E5A54]/5 text-[#1E5A54]',
        success: 'border-[#1E5A54]/30 bg-[#1E5A54]/10 text-[#1E5A54]',
        warning: 'border-[#F7623D] bg-[#F8F4F2] text-[#1E5A54]',
        destructive: 'border-[#F7623D] bg-[#F8F4F2] text-[#1E5A54]',
        outline: 'border-[#1E5A54]/30 bg-transparent text-[#1E5A54]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
