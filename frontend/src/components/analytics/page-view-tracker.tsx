'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname } from 'next/navigation';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback below
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getVisitorId(): string {
  const STORAGE_KEY = 'sbu_vid';
  try {
    let vid = localStorage.getItem(STORAGE_KEY);
    if (!vid || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vid)) {
      vid = generateUUID();
      localStorage.setItem(STORAGE_KEY, vid);
    }
    return vid;
  } catch {
    // Fall back to a per-load id if localStorage fails or is restricted
    return generateUUID();
  }
}

function TrackerInner() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    try {
      if (!pathname) return;

      // Skip paths starting with /admin or /login
      if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
        return;
      }

      // Respect Do Not Track
      if (
        typeof navigator !== 'undefined' &&
        (navigator.doNotTrack === '1' ||
          (window as any).doNotTrack === '1' ||
          (navigator as any).msDoNotTrack === '1')
      ) {
        return;
      }

      // Avoid redundant tracking in same session step
      if (lastTracked.current === pathname) {
        return;
      }
      lastTracked.current = pathname;

      const visitor_id = getVisitorId();
      const referrer = typeof document !== 'undefined' ? document.referrer : '';

      const payload = {
        path: pathname,
        visitor_id,
        referrer: referrer || null,
      };

      const body = JSON.stringify(payload);

      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' });
        const sent = navigator.sendBeacon('/api/track', blob);
        if (!sent) {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
          }).catch(() => {});
        }
      } else if (typeof fetch === 'function') {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Never block rendering, ignore all errors
    }
  }, [pathname]);

  return null;
}

export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}

export default PageViewTracker;
