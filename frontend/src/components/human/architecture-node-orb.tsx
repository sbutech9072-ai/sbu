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
          'w-full h-full max-w-[360px] max-h-[360px] sm:max-w-[400px] sm:max-h-[400px]',
          variant === 'compact' && 'max-w-[240px] max-h-[240px]'
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
  const [telemetry, setTelemetry] = React.useState<{ rx: string; ry: string; nodes: number }>({
    rx: '14.2',
    ry: '28.6',
    nodes: 12,
  });

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
        'relative flex flex-col justify-between rounded-2xl border border-[#1E5A54]/18 dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] p-4 sm:p-5 overflow-hidden shadow-xs select-none',
        variant === 'hero'
          ? 'min-h-[400px] sm:min-h-[470px]'
          : 'min-h-[280px] sm:min-h-[310px]',
        className
      )}
    >
      {/* Corner Blueprint Crosshairs */}
      <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 font-mono text-[10px] text-[#1E5A54]/30 dark:text-white/20 select-none z-10">+</span>
      <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-2.5 font-mono text-[10px] text-[#1E5A54]/30 dark:text-white/20 select-none z-10">+</span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-2.5 font-mono text-[10px] text-[#1E5A54]/30 dark:text-white/20 select-none z-10">+</span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 font-mono text-[10px] text-[#1E5A54]/30 dark:text-white/20 select-none z-10">+</span>

      {/* Subtle Coordinate Dots Matrix Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(#1E5A54 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Header Bar with Node Identity & View Switch */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b border-[#1E5A54]/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#1E5A54] dark:text-[#F5F1EA]">
            TOPOLOGY // NODE_01
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-[#EEE6E2]/80 dark:bg-[#101215] text-[#1E5A54]/80 dark:text-[#A9ADB3] border border-[#1E5A54]/12 dark:border-[#292D32]">
            LATENCY &lt; 180MS
          </span>
          <button
            type="button"
            onClick={() =>
              setViewMode((prev) => (prev === '3d' && canRenderWebGL ? 'blueprint' : '3d'))
            }
            disabled={!canRenderWebGL}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#1E5A54]/20 bg-[#EEE6E2]/90 dark:bg-[#1D2025] px-2.5 py-1 text-[11px] font-medium text-[#1E5A54] dark:text-[#F5F1EA] transition-colors hover:border-[#1E5A54]/40 hover:text-[#1E5A54] disabled:opacity-50 shadow-2xs"
            aria-label="Toggle between interactive 3D view and static diagram"
          >
            {showWebGL ? 'Schematic view' : '3D view'}
          </button>
        </div>
      </div>

      {/* Center Stage (WebGL or Static SVG Fallback) */}
      <div
        className={cn(
          'relative w-full flex-1 flex items-center justify-center my-2',
          variant === 'hero'
            ? 'h-[320px] sm:h-[370px] lg:h-[390px]'
            : 'h-[230px] sm:h-[260px]'
        )}
      >
        {showWebGL ? (
          <div className="relative h-full w-full">
            <LazyArchitectureOrbCanvas
              variant={variant}
              onWebGLError={handleWebGLError}
              onTelemetryUpdate={setTelemetry}
            />
          </div>
        ) : (
          <OrbBlueprintFallback variant={variant} />
        )}
      </div>

      {/* Footer Telemetry Strip */}
      <div className="relative z-10 pt-2 border-t border-[#1E5A54]/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-[#1E5A54]/70 dark:text-[#A9ADB3]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D] dark:bg-[#FF642D]" />
          <span className="text-[10px] tracking-wide">
            {showWebGL ? `ROT: X ${telemetry.rx}° / Y ${telemetry.ry}°` : 'PROJECTION: 2D ORTHO'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="hidden sm:inline opacity-75">CLUSTER: DISTRIBUTED</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">12 NODES SYNCED</span>
        </div>
      </div>
    </div>
  );
}
