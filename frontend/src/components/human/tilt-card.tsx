'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className,
  maxTilt = 3.5,
  ...props
}: TiltCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setDisabled(true);
    }
  }, []);

  const applyTilt = React.useCallback(
    (clientX: number, clientY: number) => {
      if (disabled || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const y = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);

      const rotateY = (x - 0.5) * 2 * maxTilt;
      const rotateX = (0.5 - y) * 2 * maxTilt;

      cardRef.current.style.transform = `perspective(960px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
    },
    [disabled, maxTilt]
  );

  const resetTilt = React.useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      'perspective(960px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  }, []);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      applyTilt(e.clientX, e.clientY);
    },
    [applyTilt]
  );

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        applyTilt(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [applyTilt]
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onTouchMove={handleTouchMove}
      onTouchEnd={resetTilt}
      onTouchCancel={resetTilt}
      style={{
        transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: disabled ? 'auto' : 'transform',
      }}
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </div>
  );
}
