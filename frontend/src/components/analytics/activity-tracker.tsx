'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
    return generateUUID();
  }
}

function getSessionId(): string {
  const SESSION_KEY = 'sbu_session_id';
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sid)) {
      sid = generateUUID();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return generateUUID();
  }
}

function ActivityTrackerInner() {
  const pathname = usePathname();
  const lastInteractionRef = useRef<number>(Date.now());
  const supabase = createClient();

  // Track user engagement interactions
  useEffect(() => {
    const registerInteraction = () => {
      lastInteractionRef.current = Date.now();
    };

    const events = ['mousemove', 'scroll', 'keydown', 'touchstart'];
    events.forEach((evt) => {
      window.addEventListener(evt, registerInteraction, { passive: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, registerInteraction);
      });
    };
  }, []);

  // Heartbeat loop every 30 seconds
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        // Skip /admin paths
        if (!pathname || pathname.startsWith('/admin')) {
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

        // Only send if tab is visible and active within last 60 seconds
        if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
          return;
        }

        const now = Date.now();
        if (now - lastInteractionRef.current > 60000) {
          return; // Idle beyond 60s
        }

        const sessionId = getSessionId();
        const visitorId = getVisitorId();

        // Optional access token if user is signed in
        let accessToken: string | undefined = undefined;
        try {
          const session = (await supabase.auth.getSession()).data.session;
          if (session?.access_token) {
            accessToken = session.access_token;
          }
        } catch {
          // ignore session read errors
        }

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        await fetch('/api/activity', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            session_id: sessionId,
            visitor_id: visitorId,
            path: pathname,
          }),
          keepalive: true,
        });
      } catch {
        // Silent failure for analytics telemetry
      }
    };

    const interval = setInterval(sendHeartbeat, 30000);
    // Send initial heartbeat after a short 3-second delay
    const initialTimer = setTimeout(sendHeartbeat, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [pathname, supabase]);

  return null;
}

export default function ActivityTracker() {
  return (
    <Suspense fallback={null}>
      <ActivityTrackerInner />
    </Suspense>
  );
}
