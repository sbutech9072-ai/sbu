'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={cn(
        'group relative flex items-center justify-center h-9 w-9 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7623D]',
        className
      )}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <Sun className="h-4 w-4 stroke-[1.75] transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 stroke-[1.75] transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}

