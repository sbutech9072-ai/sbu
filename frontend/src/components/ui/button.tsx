import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs font-bold uppercase tracking-[0.16em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7623D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none shadow-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#1E5A54] text-[#EEE6E2] border-2 border-[#F7623D] hover:bg-[#16443F] active:scale-[0.98]',
        secondary:
          'border border-[#1E5A54] bg-transparent text-[#1E5A54] hover:bg-[#1E5A54]/10 active:scale-[0.98]',
        outline:
          'border border-[#1E5A54] bg-transparent text-[#1E5A54] hover:bg-[#1E5A54]/10 active:scale-[0.98]',
        ghost:
          'bg-transparent text-[#1E5A54] hover:bg-[#1E5A54]/10 active:scale-[0.98]',
        destructive:
          'bg-[#1E5A54] text-[#EEE6E2] border-2 border-[#F7623D] hover:bg-[#16443F] active:scale-[0.98]',
        link:
          'text-[#1E5A54] underline-offset-4 hover:underline p-0 h-auto font-medium lowercase tracking-normal',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 text-[11px]',
        lg: 'h-13 px-8 py-3.5 text-xs',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<Record<string, unknown>>;
      return React.cloneElement(child, {
        ...props,
        className: cn(
          buttonVariants({ variant, size }),
          typeof child.props?.className === 'string' ? child.props.className : undefined,
          className
        ),
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
