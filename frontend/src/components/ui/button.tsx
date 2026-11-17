import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7623D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none shadow-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#1E5A54] text-[#EEE6E2] hover:bg-[#16443F] active:scale-[0.99]',
        secondary:
          'border border-[#1E5A54]/30 bg-[#F8F4F2] text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#E2D7D1]/50 active:scale-[0.99]',
        outline:
          'border border-[#1E5A54]/30 bg-transparent text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54]/5 active:scale-[0.99]',
        ghost:
          'bg-transparent text-[#1E5A54] hover:bg-[#1E5A54]/8 active:scale-[0.99]',
        destructive:
          'bg-[#F7623D] text-white hover:bg-[#E05330] active:scale-[0.99]',
        link:
          'text-[#1E5A54] underline-offset-4 hover:underline p-0 h-auto font-medium',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-3.5 text-xs',
        lg: 'h-12 px-7 py-3 text-sm',
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
