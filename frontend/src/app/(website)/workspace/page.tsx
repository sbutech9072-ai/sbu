'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { ClientWorkspaceCard } from '@/components/shared/client-workspace-card';

type BackendUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  country: string | null;
  whatsappNumber: string | null;
  isActive: boolean;
  isVerified: boolean;
};

type BackendSession = {
  accessToken: string;
  user: BackendUser;
};

const BACKEND_SESSION_KEY = 'techzaa-backend-session';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isBackendUser = (value: unknown): value is BackendUser =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.email === 'string' &&
  typeof value.fullName === 'string' &&
  typeof value.role === 'string' &&
  (typeof value.country === 'string' || value.country === null) &&
  (typeof value.whatsappNumber === 'string' || value.whatsappNumber === null) &&
  typeof value.isActive === 'boolean' &&
  typeof value.isVerified === 'boolean';

const isBackendSession = (value: unknown): value is BackendSession =>
  isRecord(value) &&
  typeof value.accessToken === 'string' &&
  isBackendUser(value.user);

export default function ClientWorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<BackendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const validateSession = async () => {
      let storedSession: string | null;
      try {
        storedSession = window.sessionStorage.getItem(BACKEND_SESSION_KEY);
      } catch {
        if (active) {
          setError('This browser could not access the saved session.');
          setIsLoading(false);
        }
        return;
      }

      if (!storedSession) {
        router.replace('/login');
        return;
      }

      let parsedSession: unknown;
      try {
        parsedSession = JSON.parse(storedSession);
      } catch {
        window.sessionStorage.removeItem(BACKEND_SESSION_KEY);
        router.replace('/login');
        return;
      }

      if (!isBackendSession(parsedSession)) {
        window.sessionStorage.removeItem(BACKEND_SESSION_KEY);
        router.replace('/login');
        return;
      }

      try {
        const response = await fetch('/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${parsedSession.accessToken}` },
          cache: 'no-store',
        });

        if (response.status === 401 || response.status === 403) {
          window.sessionStorage.removeItem(BACKEND_SESSION_KEY);
          router.replace('/login');
          return;
        }
        if (!response.ok) {
          throw new Error('Unable to validate the saved session.');
        }

        const profile: unknown = await response.json();
        if (!isBackendUser(profile)) {
          throw new Error('The server returned an invalid user profile.');
        }

        if (active) {
          setUser(profile);
        }
        window.sessionStorage.setItem(
          BACKEND_SESSION_KEY,
          JSON.stringify({ accessToken: parsedSession.accessToken, user: profile })
        );
      } catch {
        if (active) {
          setError('Unable to validate your session. Please try again.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void validateSession();
    return () => {
      active = false;
    };
  }, [router]);

  const handleSignOut = () => {
    window.sessionStorage.removeItem(BACKEND_SESSION_KEY);
    router.replace('/login');
  };

  return (
    <main className="min-h-screen py-16 flex items-center justify-center px-4 bg-[#EEE6E2] text-[#1E5A54]">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold text-[#1E5A54]">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#1E5A54] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2] hover:border-[#F7623D] hover:text-[#F7623D] transition-colors text-[11px] font-mono tracking-wider"
          >
            <span>Admin Portal</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex justify-center">
          <Logo variant="login" />
        </div>

        <div className="text-center space-y-3">
          <h1 className="font-headline text-4xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
            Client Workspace
          </h1>
          <p className="text-sm text-[#1E5A54] max-w-md mx-auto">
            Your authenticated workspace session is active.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10" role="status" aria-label="Loading workspace">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[#F7623D]/50 bg-[#F8F4F2] p-4" role="alert">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#F7623D] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider">Session Error</h2>
                <p className="text-xs mt-1 leading-relaxed">{error}</p>
                <Link
                  href="/login"
                  className="inline-block mt-3 text-xs font-semibold uppercase tracking-wider underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        ) : user ? (
          <ClientWorkspaceCard
            fullName={user.fullName}
            email={user.email}
            country={user.country}
            whatsapp={user.whatsappNumber}
            onSignOut={handleSignOut}
          />
        ) : null}
      </div>
    </main>
  );
}
