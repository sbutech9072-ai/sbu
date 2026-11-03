'use client';

import * as React from 'react';
import Lenis from 'lenis';
import { cn } from '@/lib/utils';

export interface StudioShellProps {
  children: React.ReactNode;
}

export function StudioShell({ children }: StudioShellProps) {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const [calibrated, setCalibrated] = React.useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = React.useState(false);
  const [cursorVisible, setCursorVisible] = React.useState(false);

  // Subtle top studio calibration bar on initial mount (non-blocking)
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setCalibrated(true);
    }, 60);
    return () => window.clearTimeout(timer);
  }, []);

  // Lenis smooth scroll + custom desktop cursor follower
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reducedMotion) return;

    let lenis: Lenis | null = null;
    let rafId = 0;

    try {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };
      rafId = window.requestAnimationFrame(raf);
    } catch {
      // Fallback gracefully to native scroll if Lenis fails in headless environments
    }

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) {
      return () => {
        window.cancelAnimationFrame(rafId);
        lenis?.destroy();
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorVisible) setCursorVisible(true);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [role="button"], input, select, textarea, summary'
      );
      setIsHoveringInteractive(Boolean(interactive));
    };

    const handleMouseLeave = () => {
      setCursorVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis?.destroy();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorVisible]);

  return (
    <>
      {/* Non-blocking top studio calibration progress line */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 right-0 z-[9997] h-[2px] overflow-hidden bg-transparent"
      >
        <div
          style={{
            transition:
              'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 680ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className={cn(
            'h-full w-full origin-left bg-[#F7623D]',
            calibrated ? 'scale-x-100 opacity-0' : 'scale-x-25 opacity-95'
          )}
        />
      </div>

      {/* Custom desktop cursor follower */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          transition: 'transform 90ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className={cn(
          'pointer-events-none fixed top-0 left-0 z-[9998] hidden lg:block -translate-x-1/2 -translate-y-1/2',
          cursorVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div
          style={{
            transition:
              'width 180ms cubic-bezier(0.22, 1, 0.36, 1), height 180ms cubic-bezier(0.22, 1, 0.36, 1), border-color 180ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className={cn(
            '-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border',
            isHoveringInteractive
              ? 'h-9 w-9 border-[#F7623D] bg-[#F7623D]/10'
              : 'h-4 w-4 border-[#1E5A54]/45 bg-transparent'
          )}
        >
          <span
            className={cn(
              'rounded-full transition-all duration-200',
              isHoveringInteractive
                ? 'h-1.5 w-1.5 bg-[#F7623D]'
                : 'h-1 w-1 bg-[#1E5A54]/70'
            )}
          />
        </div>
      </div>

      {children}
    </>
  );
}
