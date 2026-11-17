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
  ...props
}: TiltCardProps) {
  return (
    <div
      className={cn('relative transition-colors duration-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}
