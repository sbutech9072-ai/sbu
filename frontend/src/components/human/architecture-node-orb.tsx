'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { StudioStamp } from './hand-crafted-svg';

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

        {/* Blueprint Callout Labels */}
        <text
          x="192"
          y="40"
          fill="#1E5A54"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="1.4"
        >
          N-01 // EDGE GATEWAY
        </text>
        <text
          x="234"
          y="302"
          fill="#F7623D"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="1.4"
        >
          SYNC: 99.98%
        </text>
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
  const [canRenderWebGL, setCanRenderWebGL] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'3d' | 'blueprint'>('3d');
  const [telemetry, setTelemetry] = React.useState({
    rx: '14.2',
    ry: '42.8',
    nodes: 12,
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const lowPower =
      typeof navigator !== 'undefined' &&
      Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);

    let hasWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL = Boolean(
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      );
    } catch {
      hasWebGL = false;
    }

    if (reducedMotion || lowPower || !hasWebGL) {
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
        'relative flex flex-col justify-between rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-4 sm:p-5 overflow-hidden',
        variant === 'hero'
          ? 'min-h-[340px] sm:min-h-[410px]'
          : 'min-h-[250px] sm:min-h-[280px]',
        className
      )}
    >
      {/* Top Studio HUD Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#1E5A54]/15 pb-3">
        <StudioStamp
          text="NODE TOPOLOGY // REV 4.2"
          subtext="DISTRIBUTED MESH CORE"
          rotate="slight-left"
          variant="teal"
        />

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              setViewMode((prev) => (prev === '3d' && canRenderWebGL ? 'blueprint' : '3d'))
            }
            disabled={!canRenderWebGL}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54] transition-colors duration-200 hover:border-[#F7623D] hover:text-[#F7623D] disabled:opacity-60"
            aria-label="Toggle between 3D live mesh and static architectural blueprint"
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                showWebGL ? 'bg-[#F7623D]' : 'bg-[#1E5A54]'
              )}
            />
            <span>{showWebGL ? '3D LIVE' : 'BLUEPRINT'}</span>
          </button>
        </div>
      </div>

      {/* Center Stage (WebGL or Static SVG Fallback) */}
      <div className="relative flex-1 flex items-center justify-center my-2 min-h-[220px] sm:min-h-[270px]">
        {showWebGL ? (
          <div className="absolute inset-0">
            <LazyArchitectureOrbCanvas
              variant={variant}
              onWebGLError={() => {
                setCanRenderWebGL(false);
                setViewMode('blueprint');
              }}
              onTelemetryUpdate={setTelemetry}
            />
          </div>
        ) : (
          <OrbBlueprintFallback variant={variant} />
        )}
      </div>

      {/* Bottom Studio Telemetry Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#1E5A54]/15 pt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#1E5A54]/80">
        <div className="flex items-center gap-3">
          <span>
            PITCH: <strong className="text-[#1E5A54]">{telemetry.rx} DEG</strong>
          </span>
          <span>
            YAW: <strong className="text-[#1E5A54]">{telemetry.ry} DEG</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#F7623D]" />
          <span>{telemetry.nodes} ACTIVE NODES // 60HZ</span>
        </div>
      </div>
    </div>
  );
}
