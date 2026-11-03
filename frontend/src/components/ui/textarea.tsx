import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-2xl border bg-transparent px-4 py-3 text-sm text-[#1E5A54] placeholder:text-[#1E5A54]/50 transition-colors focus-visible:outline-none focus-visible:border-[#1E5A54] focus-visible:ring-1 focus-visible:ring-[#1E5A54] disabled:cursor-not-allowed disabled:opacity-50 resize-y',
          error ? 'border-[#F7623D] focus-visible:ring-[#F7623D]' : 'border-[#1E5A54]/25 hover:border-[#1E5A54]/40',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
