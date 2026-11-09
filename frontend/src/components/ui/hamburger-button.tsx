'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface HamburgerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  showLabel?: boolean;
  label?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Pure code-based Hamburger Button with 3 rounded capsule horizontal bars.
 * Morphs smoothly into an 'X' when open. Zero external image dependencies.
 */
export function HamburgerButton({
  isOpen,
  onToggle,
  showLabel = false,
  label = 'Menu',
  className,
  'aria-label': ariaLabel,
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel || (isOpen ? 'Close navigation menu' : 'Open navigation menu')}
      aria-expanded={isOpen}
      className={cn(
        'group relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-[#1E5A54]/30 bg-[#F8F4F2] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] hover:border-[#1E5A54] transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7623D]',
        isOpen && 'bg-[#1E5A54] text-[#EEE6E2] border-[#1E5A54]',
        className
      )}
    >
      {/* 3 rounded capsule horizontal bars */}
      <span
        className="w-5 h-3.5 flex flex-col justify-between items-center pointer-events-none shrink-0"
        aria-hidden="true"
      >
        <span
          className={cn(
            'h-[2.5px] w-5 bg-current rounded-full transition-all duration-300 ease-in-out transform origin-center',
            isOpen ? 'rotate-45 translate-y-[5.5px] bg-[#F7623D]' : 'group-hover:scale-x-105'
          )}
        />
        <span
          className={cn(
            'h-[2.5px] w-5 bg-current rounded-full transition-all duration-200 ease-in-out',
            isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          )}
        />
        <span
          className={cn(
            'h-[2.5px] w-5 bg-current rounded-full transition-all duration-300 ease-in-out transform origin-center',
            isOpen ? '-rotate-45 -translate-y-[5.5px] bg-[#F7623D]' : 'group-hover:scale-x-105'
          )}
        />
      </span>

      {showLabel && (
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.18em]">
          {isOpen ? 'Close' : label}
        </span>
      )}
    </button>
  );
}
