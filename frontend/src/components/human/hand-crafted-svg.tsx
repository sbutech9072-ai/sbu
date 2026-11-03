import * as React from 'react';
import { cn } from '@/lib/utils';

export interface HandUnderlineProps {
  className?: string;
  color?: string;
}

export function HandUnderline({
  className,
  color = '#F7623D',
}: HandUnderlineProps) {
  return (
    <svg
      viewBox="0 0 240 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn('w-full h-3.5 overflow-visible pointer-events-none select-none', className)}
    >
      <path
        d="M3 11.5C48.5 5.2 108.4 3.8 168.2 6.4C194.5 7.5 218.2 9.4 237 11.2"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 15.2C64.2 11.4 128.8 10.1 192.4 12.6C207.1 13.2 220.5 14.1 231 14.8"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.72"
      />
    </svg>
  );
}

export interface HandArrowProps {
  className?: string;
  direction?: 'right' | 'down' | 'left' | 'up-right';
  color?: string;
}

export function HandArrow({
  className,
  direction = 'right',
  color = '#F7623D',
}: HandArrowProps) {
  const rotationMap: Record<NonNullable<HandArrowProps['direction']>, string> = {
    right: 'rotate-0',
    down: 'rotate-90',
    left: 'rotate-180',
    'up-right': '-rotate-45',
  };

  return (
    <svg
      viewBox="0 0 84 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        'w-16 h-7 overflow-visible pointer-events-none select-none transition-transform duration-300',
        rotationMap[direction],
        className
      )}
    >
      <path
        d="M4 21.5C21.8 16.2 44.5 14.8 72.5 17.8"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 24.2C26.4 19.8 47.2 18.4 69.8 19.6"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <path
        d="M58.5 7.5C64.2 11.8 71.4 15.6 77.5 18.2C70.8 21.4 63.5 25.8 57.2 30.2"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface HandCircleProps {
  className?: string;
  color?: string;
}

export function HandCircle({
  className,
  color = '#F7623D',
}: HandCircleProps) {
  return (
    <svg
      viewBox="0 0 180 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn('w-full h-full overflow-visible pointer-events-none select-none', className)}
    >
      <path
        d="M24.5 16.2C56.4 4.8 118.2 3.5 154.6 17.8C176.4 26.4 178.2 47.5 158.4 59.4C131.2 75.6 58.6 74.2 22.8 58.6C2.4 49.6 3.8 27.2 28.4 16.8C41.2 11.4 62.5 8.8 84.2 8.6"
        stroke={color}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface StudioStampProps {
  text: string;
  subtext?: string;
  rotate?: 'left' | 'right' | 'slight-left' | 'slight-right';
  variant?: 'orange' | 'teal' | 'cream';
  className?: string;
}

export function StudioStamp({
  text,
  subtext,
  rotate = 'slight-left',
  variant = 'teal',
  className,
}: StudioStampProps) {
  const rotateClasses: Record<NonNullable<StudioStampProps['rotate']>, string> = {
    left: '-rotate-[2.5deg]',
    right: 'rotate-[2deg]',
    'slight-left': '-rotate-[1.5deg]',
    'slight-right': 'rotate-[1.5deg]',
  };

  const variantClasses: Record<NonNullable<StudioStampProps['variant']>, string> = {
    orange: 'bg-[#F7623D] text-[#EEE6E2] border-[#1E5A54]/30',
    teal: 'bg-[#1E5A54] text-[#EEE6E2] border-[#1E5A54]',
    cream: 'bg-[#F8F4F2] text-[#1E5A54] border-[#1E5A54]/45',
  };

  const innerBorderClasses: Record<NonNullable<StudioStampProps['variant']>, string> = {
    orange: 'border-[#EEE6E2]/55',
    teal: 'border-[#EEE6E2]/40',
    cream: 'border-[#1E5A54]/35',
  };

  const dotClasses: Record<NonNullable<StudioStampProps['variant']>, string> = {
    orange: 'bg-[#EEE6E2]',
    teal: 'bg-[#F7623D]',
    cream: 'bg-[#F7623D]',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center rounded-sm border px-2.5 py-1 shadow-[2px_3px_0px_rgba(30,90,84,0.16)] select-none transition-transform duration-200 hover:rotate-0',
        rotateClasses[rotate],
        variantClasses[variant],
        className
      )}
    >
      {/* Corner registration marks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0.5 left-0.5 h-1 w-1 border-t border-l border-current opacity-60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0.5 right-0.5 h-1 w-1 border-t border-r border-current opacity-60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0.5 left-0.5 h-1 w-1 border-b border-l border-current opacity-60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0.5 right-0.5 h-1 w-1 border-b border-r border-current opacity-60"
      />

      <div
        className={cn(
          'flex items-center gap-2 border border-dashed px-2 py-0.5',
          innerBorderClasses[variant]
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotClasses[variant])} />
        <div className="flex flex-col leading-none">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
            {text}
          </span>
          {subtext && (
            <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.14em] opacity-80">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
