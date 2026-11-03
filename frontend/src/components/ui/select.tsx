import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-11 w-full rounded-full border bg-transparent px-4 py-2.5 text-sm text-[#1E5A54] transition-colors focus-visible:outline-none focus-visible:border-[#1E5A54] focus-visible:ring-1 focus-visible:ring-[#1E5A54] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none',
          error ? 'border-[#F7623D] focus-visible:ring-[#F7623D]' : 'border-[#1E5A54]/25 hover:border-[#1E5A54]/40',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

export { Select };
