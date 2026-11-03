'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MagneticWrapProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticWrap({
  children,
  className,
  strength = 0.22,
}: MagneticWrapProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reducedMotion || isTouch) {
      setDisabled(true);
    }
  }, []);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      wrapRef.current.style.transform = `translate3d(${deltaX.toFixed(
        2
      )}px, ${deltaY.toFixed(2)}px, 0)`;
    },
    [disabled, strength]
  );

  const handleMouseLeave = React.useCallback(() => {
    if (!wrapRef.current) return;
    wrapRef.current.style.transform = 'translate3d(0px, 0px, 0)';
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: disabled ? 'auto' : 'transform',
      }}
      className={cn('inline-block', className)}
    >
      {children}
    </div>
  );
}
