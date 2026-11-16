import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Supabase Auth Callback Route Handler
 * Exchanges OAuth / magic link code for a session, records a login event for Google OAuth,
 * and securely redirects to a relative path.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  // Ensure redirect target is safe and strictly relative
  let redirectPath = '/';
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    redirectPath = next;
  }

  if (code) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.session?.access_token) {
      // Determine provider: if Google OAuth was used, record a 'google' login event
      const provider =
        data.user?.app_metadata?.provider === 'google' ? 'google' : 'password';

      try {
        await fetch(`${requestUrl.origin}/api/auth/login-event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.session.access_token}`,
            Origin: requestUrl.origin,
          },
          body: JSON.stringify({ provider }),
        });
      } catch (e) {
        // Non-blocking telemetry event failure
        console.error('Failed to log Google login event:', e);
      }
    }
  }

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}
