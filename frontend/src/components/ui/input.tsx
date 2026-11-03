import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-full border bg-transparent px-4 py-2.5 text-sm text-[#1E5A54] placeholder:text-[#1E5A54]/50 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-[#1E5A54] focus-visible:ring-1 focus-visible:ring-[#1E5A54] disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-[#F7623D] focus-visible:ring-[#F7623D]' : 'border-[#1E5A54]/25 hover:border-[#1E5A54]/40',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
