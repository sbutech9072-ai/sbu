'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

export interface ArchitectureNodeOrbProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

function OrbBlueprintFallback({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  return (
    <div
      data-testid="orb-static-fallback"
      className="relative flex h-full w-full items-center justify-center p-4 select-none"
    >
      <svg
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Architectural Node Topology Blueprint"
        className={cn(
          'w-full h-full max-w-[340px] max-h-[340px]',
          variant === 'compact' && 'max-w-[230px] max-h-[230px]'
        )}
      >
        {/* Subtle Technical Polar Grid */}
        <circle
          cx="180"
          cy="180"
          r="152"
          stroke="#1E5A54"
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle
          cx="180"
          cy="180"
          r="122"
          stroke="#1E5A54"
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />
        <circle
          cx="180"
          cy="180"
          r="76"
          stroke="#1E5A54"
          strokeOpacity="0.32"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Axis Hairlines */}
        <line
          x1="16"
          y1="180"
          x2="344"
          y2="180"
          stroke="#1E5A54"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
        <line
          x1="180"
          y1="16"
          x2="180"
          y2="344"
          stroke="#1E5A54"
          strokeOpacity="0.16"
          strokeWidth="1"
        />

        {/* Tilted Orbital Rings */}
        <ellipse
          cx="180"
          cy="180"
          rx="144"
          ry="52"
          transform="rotate(-24 180 180)"
          stroke="#1E5A54"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <ellipse
          cx="180"
          cy="180"
          rx="148"
          ry="46"
          transform="rotate(32 180 180)"
          stroke="#F7623D"
          strokeOpacity="0.75"
          strokeWidth="1.6"
        />

        {/* Outer Geodesic Wireframe Polygon */}
        <polygon
          points="180,46 296,112 296,248 180,314 64,248 64,112"
          stroke="#1E5A54"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          fill="#1E5A54"
          fillOpacity="0.03"
        />
        <polygon
          points="180,78 268,128 268,232 180,282 92,232 92,128"
          stroke="#1E5A54"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />

        {/* Internal Struts */}
        <line x1="180" y1="46" x2="180" y2="314" stroke="#1E5A54" strokeOpacity="0.32" strokeWidth="1.1" />
        <line x1="64" y1="112" x2="296" y2="248" stroke="#1E5A54" strokeOpacity="0.32" strokeWidth="1.1" />
        <line x1="296" y1="112" x2="64" y2="248" stroke="#1E5A54" strokeOpacity="0.32" strokeWidth="1.1" />
        <line x1="64" y1="112" x2="296" y2="112" stroke="#1E5A54" strokeOpacity="0.25" strokeWidth="1" />
        <line x1="64" y1="248" x2="296" y2="248" stroke="#1E5A54" strokeOpacity="0.25" strokeWidth="1" />

        {/* Inner Core Faceted Octasphere */}
        <polygon
          points="180,124 228,152 228,208 180,236 132,208 132,152"
          fill="#1E5A54"
          stroke="#EEE6E2"
          strokeWidth="1.5"
        />
        <line x1="180" y1="124" x2="180" y2="236" stroke="#EEE6E2" strokeOpacity="0.45" strokeWidth="1" />
        <line x1="132" y1="152" x2="228" y2="208" stroke="#EEE6E2" strokeOpacity="0.45" strokeWidth="1" />
        <line x1="228" y1="152" x2="132" y2="208" stroke="#EEE6E2" strokeOpacity="0.45" strokeWidth="1" />

        {/* Telemetry Nodes */}
        <circle cx="180" cy="46" r="5" fill="#F7623D" />
        <circle cx="296" cy="112" r="4.5" fill="#1E5A54" />
        <circle cx="296" cy="248" r="5" fill="#F7623D" />
        <circle cx="180" cy="314" r="4.5" fill="#1E5A54" />
        <circle cx="64" cy="248" r="5" fill="#F7623D" />
        <circle cx="64" cy="112" r="4.5" fill="#1E5A54" />
        <circle cx="180" cy="180" r="5.5" fill="#F7623D" stroke="#EEE6E2" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

const LazyArchitectureOrbCanvas = dynamic(
  () => import('./architecture-orb-canvas'),
  {
    ssr: false,
    loading: () => <OrbBlueprintFallback />,
  }
);

export function ArchitectureNodeOrb({
  variant = 'hero',
  className,
}: ArchitectureNodeOrbProps) {
  const [canRenderWebGL, setCanRenderWebGL] = React.useState(true);
  const handleWebGLError = React.useCallback(() => {
    setCanRenderWebGL(false);
    setViewMode('blueprint');
  }, []);
  const [viewMode, setViewMode] = React.useState<'3d' | 'blueprint'>('3d');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    let hasWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL = Boolean(
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      );
    } catch {
      hasWebGL = false;
    }

    if (!hasWebGL) {
      setCanRenderWebGL(false);
      setViewMode('blueprint');
    } else {
      setCanRenderWebGL(true);
      setViewMode('3d');
    }
  }, []);

  const showWebGL = canRenderWebGL && viewMode === '3d';

  return (
    <div
      className={cn(
        'relative flex flex-col justify-between rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2] p-4 sm:p-5 overflow-hidden',
        variant === 'hero'
          ? 'min-h-[360px] sm:min-h-[430px]'
          : 'min-h-[260px] sm:min-h-[290px]',
        className
      )}
    >
      {/* Subtle View Switch */}
      <div className="relative z-10 flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            setViewMode((prev) => (prev === '3d' && canRenderWebGL ? 'blueprint' : '3d'))
          }
          disabled={!canRenderWebGL}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#1E5A54]/20 bg-[#EEE6E2]/80 px-2.5 py-1 text-[11px] font-medium text-[#1E5A54]/80 transition-colors hover:border-[#1E5A54]/40 hover:text-[#1E5A54] disabled:opacity-50"
          aria-label="Toggle between interactive 3D view and static diagram"
        >
          {showWebGL ? 'Schematic view' : '3D view'}
        </button>
      </div>

      {/* Center Stage (WebGL or Static SVG Fallback) */}
      <div
        className={cn(
          'relative w-full flex-1 flex items-center justify-center my-2',
          variant === 'hero'
            ? 'h-[300px] sm:h-[360px] lg:h-[370px]'
            : 'h-[220px] sm:h-[250px]'
        )}
      >
        {showWebGL ? (
          <div className="relative h-full w-full">
            <LazyArchitectureOrbCanvas
              variant={variant}
              onWebGLError={handleWebGLError}
            />
          </div>
        ) : (
          <OrbBlueprintFallback variant={variant} />
        )}
      </div>
    </div>
  );
}
