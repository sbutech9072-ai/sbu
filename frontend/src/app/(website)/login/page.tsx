'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Globe,
  Phone,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  AlertCircle,
  X,
  Loader2,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { COUNTRIES, COUNTRY_LABELS } from '@/lib/countries';
import { ClientWorkspaceCard } from '@/components/shared/client-workspace-card';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Logo } from '@/components/shared/logo';

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

const getApiErrorMessage = (value: unknown, fallback: string): string => {
  if (!isRecord(value)) return fallback;
  if (typeof value.message === 'string' && value.message.trim()) return value.message;
  if (typeof value.detail === 'string' && value.detail.trim()) return value.detail;
  if (typeof value.error === 'string' && value.error.trim()) return value.error;
  if (isRecord(value.errors)) {
    for (const entry of Object.values(value.errors)) {
      if (typeof entry === 'string' && entry.trim()) return entry;
      if (Array.isArray(entry)) {
        const first = entry.find(
          (item): item is string => typeof item === 'string' && item.trim().length > 0
        );
        if (first) return first;
      }
    }
  }
  return fallback;
};

type AuthMode =
  | 'client-login'
  | 'client-register'
  | 'signup-verify'
  | 'forgot-password'
  | 'forgot-verify'
  | 'check-email';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('client-login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [backendSession, setBackendSession] = useState<BackendSession | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [signupOtp, setSignupOtp] = useState('');
  const [passwordResetOtp, setPasswordResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Password visibility states
  const [showClientPass, setShowClientPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);
  const [showResetPass, setShowResetPass] = useState(false);
  const [showResetConfirmPass, setShowResetConfirmPass] = useState(false);

  // Form Fields
  const [clientLogin, setClientLogin] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [clientRegister, setClientRegister] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    whatsappNumber: '',
  });

  // Field Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const supabase = createClient();

  // Listen to Supabase Auth state changes & restore active user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUser(data.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(BACKEND_SESSION_KEY);
    if (!stored) return;

    let session: unknown;
    try {
      session = JSON.parse(stored);
    } catch {
      window.sessionStorage.removeItem(BACKEND_SESSION_KEY);
      return;
    }

    if (!isBackendSession(session)) {
      window.sessionStorage.removeItem(BACKEND_SESSION_KEY);
      return;
    }

    setBackendSession(session);
    fetch('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: 'no-store',
    })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          window.sessionStorage.removeItem(BACKEND_SESSION_KEY);
          setBackendSession(null);
          return;
        }
        if (!response.ok) return;

        const user: unknown = await response.json();
        if (isBackendUser(user)) {
          const restoredSession = { accessToken: session.accessToken, user };
          setBackendSession(restoredSession);
          window.sessionStorage.setItem(
            BACKEND_SESSION_KEY,
            JSON.stringify(restoredSession)
          );
        }
      })
      .catch(() => {
        // Keep the saved session available if the backend is temporarily unreachable.
      });
  }, []);

  // Handle countdown timer for resending email confirmation
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setApiError(null);
    setApiSuccess(null);
  };

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const persistBackendSession = (session: BackendSession): boolean => {
    try {
      window.sessionStorage.setItem(BACKEND_SESSION_KEY, JSON.stringify(session));
      setBackendSession(session);
      setCurrentUser(null);
      return true;
    } catch {
      return false;
    }
  };

  // ----------------------------------------------------------------------------
  // Google OAuth ("Continue with Google")
  // ----------------------------------------------------------------------------
  // NOTE ON IDENTITY LINKING:
  // Supabase automatically links Google OAuth identities to existing email/password
  // accounts if the Google email matches the existing verified account email.
  // We do not write custom user creation logic for emails.
  // ----------------------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    setApiError(null);
    setIsGoogleSubmitting(true);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        setApiError(error.message);
        setIsGoogleSubmitting(false);
      }
    } catch {
      setApiError('Unable to connect to Google authentication.');
      setIsGoogleSubmitting(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Password Login Handler
  // ----------------------------------------------------------------------------
  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);
    const errs: { [key: string]: string } = {};

    if (!clientLogin.email.trim()) errs.email = 'Email address is required';
    else if (!validateEmail(clientLogin.email)) errs.email = 'Invalid email address';

    if (!clientLogin.password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const email = clientLogin.email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: clientLogin.password,
      });

      if (error) {
        if (
          error.message.toLowerCase().includes('email not confirmed') ||
          error.message.toLowerCase().includes('not verified')
        ) {
          setRegisteredEmail(email);
          setMode('check-email');
          setApiError('Please confirm your email address before signing in.');
          return;
        }

        try {
          const backendResponse = await fetch('/api/v1/auth/client/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: clientLogin.password }),
          });
          const backendResult: unknown = await backendResponse.json().catch(() => null);

          if (backendResponse.ok && isBackendSession(backendResult)) {
            if (persistBackendSession(backendResult)) {
              setApiSuccess('Signed in successfully.');
              router.push('/workspace');
            } else {
              setApiError('Signed in, but this browser could not save the session.');
            }
            setClientLogin({ email: '', password: '' });
            return;
          }

          if (backendResponse.status !== 401) {
            setApiError(
              getApiErrorMessage(
                backendResult,
                'Unable to connect to the authentication server.'
              )
            );
            return;
          }
        } catch {
          // Keep the existing Supabase error if the backend fallback is unavailable.
        }
        setApiError(error.message || 'Invalid email or password.');
        return;
      }

      // Record a single login event via Cloudflare Worker API
      if (data.session?.access_token) {
        try {
          await fetch('/api/auth/login-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.session.access_token}`,
            },
            body: JSON.stringify({ provider: 'password' }),
          });
        } catch {
          // Non-blocking telemetry
        }
      }

      setBackendSession(null);
      window.sessionStorage.removeItem(BACKEND_SESSION_KEY);
      setCurrentUser(data.user);
      setApiSuccess('Signed in successfully.');
      setClientLogin({ email: '', password: '' });
    } catch {
      setApiError('Unable to connect to the authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Password Registration Handler
  // ----------------------------------------------------------------------------
  const handleClientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);
    const errs: { [key: string]: string } = {};

    if (!clientRegister.fullName.trim() || clientRegister.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }
    if (!clientRegister.email.trim()) errs.email = 'Email is required';
    else if (!validateEmail(clientRegister.email)) errs.email = 'Invalid email address';

    if (!clientRegister.country || !COUNTRIES.includes(clientRegister.country)) {
      errs.country = 'Please select a valid country';
    }

    if (!clientRegister.password) errs.password = 'Password is required';
    else if (clientRegister.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (clientRegister.password !== clientRegister.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const email = clientRegister.email.trim().toLowerCase();
      const response = await fetch('/api/v1/auth/signup/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const retryAfter = Number(response.headers.get('Retry-After'));
        if (response.status === 429 && Number.isFinite(retryAfter) && retryAfter > 0) {
          setResendCooldown(retryAfter);
        }
        setApiError(getApiErrorMessage(result, 'Unable to send a verification code.'));
        return;
      }

      setRegisteredEmail(email);
      setSignupOtp('');
      setResendCooldown(60);
      setMode('signup-verify');
      setApiSuccess('A verification code has been sent to your email address.');
    } catch {
      setApiError('Unable to request a verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySignupOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    if (!/^[0-9]{6}$/.test(signupOtp)) {
      setApiError('Enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/auth/signup/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          otp: signupOtp,
          fullName: clientRegister.fullName.trim(),
          password: clientRegister.password,
          country: clientRegister.country,
          whatsappNumber: clientRegister.whatsappNumber.trim() || null,
        }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setApiError(getApiErrorMessage(result, 'The code is invalid or expired.'));
        return;
      }
      if (!isBackendSession(result)) {
        setApiError('The account was created, but the server returned an invalid session.');
        return;
      }
      if (!persistBackendSession(result)) {
        setApiError('Your account is ready, but this browser could not save the session.');
        return;
      }

      setClientRegister({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        whatsappNumber: '',
      });
      setSignupOtp('');
      setResendCooldown(0);
      setMode('client-login');
      setApiSuccess('Your email is verified and your account is ready.');
      router.push('/workspace');
    } catch {
      setApiError('Unable to verify the code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendSignupOTP = async () => {
    if (!registeredEmail || resendCooldown > 0) return;
    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);
    try {
      const response = await fetch('/api/v1/auth/signup/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const retryAfter = Number(response.headers.get('Retry-After'));
        if (response.status === 429 && Number.isFinite(retryAfter) && retryAfter > 0) {
          setResendCooldown(retryAfter);
        }
        setApiError(getApiErrorMessage(result, 'Unable to resend the verification code.'));
        return;
      }

      setSignupOtp('');
      setResendCooldown(60);
      setApiSuccess('A new verification code has been sent.');
    } catch {
      setApiError('Unable to resend the verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Resend Email Confirmation Handler
  // ----------------------------------------------------------------------------
  const handleResendConfirmation = async () => {
    if (!registeredEmail || resendCooldown > 0) return;
    setIsSubmitting(true);
    setApiError(null);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registeredEmail,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        setApiError(error.message);
      } else {
        setApiSuccess('A new confirmation email has been dispatched.');
        setResendCooldown(60);
      }
    } catch {
      setApiError('Failed to resend confirmation email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Forgot Password Handler
  // ----------------------------------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    if (!forgotEmail.trim() || !validateEmail(forgotEmail)) {
      setErrors({ forgotEmail: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const email = forgotEmail.trim().toLowerCase();
      const response = await fetch('/api/v1/auth/password-reset/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setApiError(
          getApiErrorMessage(result, 'Unable to process the password reset request.')
        );
        return;
      }

      setForgotEmail(email);
      setPasswordResetOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setResendCooldown(60);
      setMode('forgot-verify');
      setApiSuccess('If the email is registered, a password reset code has been sent.');
    } catch {
      setApiError('Unable to process password reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendPasswordResetOTP = async () => {
    if (!forgotEmail || resendCooldown > 0) return;
    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);
    try {
      const response = await fetch('/api/v1/auth/password-reset/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setApiError(
          getApiErrorMessage(result, 'Unable to resend the password reset code.')
        );
        return;
      }

      setPasswordResetOtp('');
      setResendCooldown(60);
      setApiSuccess('If the email is registered, a new password reset code has been sent.');
    } catch {
      setApiError('Unable to resend the password reset code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    if (!/^[0-9]{6}$/.test(passwordResetOtp)) {
      setApiError('Enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 8) {
      setApiError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setApiError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/auth/password-reset/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: passwordResetOtp,
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setApiError(getApiErrorMessage(result, 'The code is invalid or expired.'));
        return;
      }

      setPasswordResetOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setForgotEmail('');
      setResendCooldown(0);
      setMode('client-login');
      setApiSuccess('Password reset successfully. Please sign in with your new password.');
    } catch {
      setApiError('Unable to reset the password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Sign Out Handler
  // ----------------------------------------------------------------------------
  const handleSignOut = async () => {
    if (backendSession) {
      window.sessionStorage.removeItem(BACKEND_SESSION_KEY);
      setBackendSession(null);
    }

    if (!currentUser) {
      setApiSuccess('You have successfully signed out.');
      setMode('client-login');
      return;
    }

    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (session?.access_token) {
        await fetch('/api/auth/logout-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        }).catch(() => {});
      }
      await supabase.auth.signOut();
      setCurrentUser(null);
      setApiSuccess('You have successfully signed out.');
      setMode('client-login');
    } catch {
      // Force local signout
      setCurrentUser(null);
    }
  };

  const userMeta = currentUser?.user_metadata || {};
  const isAuthenticated = Boolean(currentUser || backendSession);
  const userEmail = currentUser?.email || backendSession?.user.email;
  const userFullName =
    userMeta.full_name ||
    userMeta.name ||
    backendSession?.user.fullName ||
    currentUser?.email?.split('@')[0] ||
    'Client';
  const userCountry = userMeta.country || backendSession?.user.country || null;
  const userWhatsapp = userMeta.whatsapp || backendSession?.user.whatsappNumber || null;

  return (
    <div className="min-h-screen py-16 flex items-center justify-center px-4 bg-[#EEE6E2] text-[#1E5A54]">
      <div className="w-full max-w-lg space-y-6">
        {/* Top utility bar */}
        <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold text-[#1E5A54]">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#1E5A54] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2] hover:border-[#F7623D] hover:text-[#F7623D] transition-colors text-[11px] font-mono tracking-wider"
          >
            <Shield className="w-3.5 h-3.5 text-[#F7623D]" />
            <span>Admin Portal</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Brand Logo */}
        <div className="flex justify-center">
          <Logo variant="login" />
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-headline text-4xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
            {isAuthenticated
              ? 'Client Workspace'
              : mode === 'forgot-password' || mode === 'forgot-verify'
              ? 'Reset Password'
              : mode === 'signup-verify'
              ? 'Verify Your Email'
              : mode === 'check-email'
              ? 'Confirm Email'
              : mode === 'client-login'
              ? 'Client Portal'
              : 'Client Registration'}
          </h1>
          <p className="text-sm text-[#1E5A54] max-w-md mx-auto">
            {isAuthenticated
              ? 'Your authenticated workspace session is active.'
              : mode === 'forgot-password'
              ? 'Enter your account email to receive a secure password reset code.'
              : mode === 'forgot-verify'
              ? 'Enter the code from your email and choose a new password.'
              : mode === 'signup-verify'
              ? 'Enter the 6-digit code sent to your email to complete registration.'
              : mode === 'check-email'
              ? 'Check your inbox to verify your email address.'
              : mode === 'client-login'
              ? 'Sign in to access your active sprint board, staging links, and invoices.'
              : 'Create a client account to initialize a project workspace with our engineering team.'}
          </p>
        </div>

        {/* Feedback Banners */}
        {apiError && (
          <div className="rounded-2xl border border-[#F7623D]/50 bg-[#F8F4F2] p-4 text-[#1E5A54] relative">
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="absolute top-3 right-3 text-[#1E5A54]/70 hover:text-[#1E5A54]"
              aria-label="Close error"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#F7623D] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#1E5A54]">
                  Notice
                </h4>
                <p className="text-xs text-[#1E5A54]/90 mt-1 leading-relaxed">
                  {apiError}
                </p>
              </div>
            </div>
          </div>
        )}

        {apiSuccess && (
          <div className="rounded-2xl border border-[#1E5A54]/30 bg-[#F8F4F2] p-4 text-[#1E5A54] relative">
            <button
              type="button"
              onClick={() => setApiSuccess(null)}
              className="absolute top-3 right-3 text-[#1E5A54]/70 hover:text-[#1E5A54]"
              aria-label="Close message"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#1E5A54] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#1E5A54]">
                  Success
                </h4>
                <p className="text-xs text-[#1E5A54]/90 mt-1 leading-relaxed">
                  {apiSuccess}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated Client Card View */}
        {isAuthenticated ? (
          <ClientWorkspaceCard
            fullName={userFullName}
            email={userEmail || ''}
            country={userCountry}
            whatsapp={userWhatsapp}
            avatarUrl={userMeta.avatar_url || userMeta.picture}
            onSignOut={handleSignOut}
          />
        ) : mode === 'check-email' ? (
          /* Check Email Confirmation Screen */
          <div className="bg-[#F8F4F2] border border-[#1E5A54]/25 rounded-3xl p-6 md:p-8 space-y-6 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#1E5A54]/10 text-[#1E5A54] flex items-center justify-center">
              <Mail className="w-7 h-7 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-headline text-2xl uppercase tracking-tight text-[#1E5A54]">
                Check Your Email
              </h3>
              <p className="text-xs text-[#1E5A54]/90 leading-relaxed max-w-sm mx-auto">
                If this email can be registered, you will receive a confirmation link at{' '}
                <strong className="text-[#1E5A54]">{registeredEmail || 'your email address'}</strong>.
              </p>
              <p className="text-xs text-[#1E5A54]/75 leading-relaxed max-w-sm mx-auto pt-1">
                If you already signed up with Google, use Continue with Google, or use Forgot password to add a password.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={isSubmitting || resendCooldown > 0}
                className="w-full bg-[#1E5A54] hover:bg-[#16443F] text-[#EEE6E2] font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend Confirmation Email'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('client-login')}
                className="w-full text-center text-xs text-[#1E5A54] hover:underline font-semibold uppercase tracking-wider py-1 cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : mode === 'signup-verify' ? (
          <div className="bg-[#F8F4F2] border border-[#1E5A54]/25 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#1E5A54]/10 text-[#1E5A54] flex items-center justify-center">
                <Mail className="w-7 h-7 stroke-[1.5]" />
              </div>
              <p className="text-xs text-[#1E5A54]/90">
                Enter the code sent to <strong>{registeredEmail}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifySignupOTP} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={signupOtp}
                  onChange={(e) => setSignupOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full px-4 py-2.5 text-center text-lg tracking-[0.4em] text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  aria-label="6-digit verification code"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Create Account</span>}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResendSignupOTP}
                disabled={isSubmitting || resendCooldown > 0}
                className="w-full border border-[#1E5A54] bg-transparent text-[#1E5A54] hover:bg-[#1E5A54]/10 font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
              <button
                type="button"
                onClick={() => switchMode('client-register')}
                className="w-full text-center text-xs text-[#1E5A54] hover:underline font-semibold uppercase tracking-wider py-1 cursor-pointer"
              >
                Back to Registration
              </button>
            </div>
          </div>
        ) : mode === 'forgot-password' ? (
          /* Forgot Password Screen */
          <div className="bg-[#F8F4F2] border border-[#1E5A54]/25 rounded-3xl p-6 md:p-8 space-y-6">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                    required
                  />
                </div>
                {errors.forgotEmail && (
                  <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">• {errors.forgotEmail}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Send Reset Code</span>
                )}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => switchMode('client-login')}
                className="w-full text-center text-xs text-[#1E5A54] hover:underline font-semibold uppercase tracking-wider py-1 cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          </div>
        ) : mode === 'forgot-verify' ? (
          <div className="bg-[#F8F4F2] border border-[#1E5A54]/25 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#1E5A54]/10 text-[#1E5A54] flex items-center justify-center">
                <Mail className="w-7 h-7 stroke-[1.5]" />
              </div>
              <p className="text-xs text-[#1E5A54]/90">
                If registered, a code was sent to <strong>{forgotEmail}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyPasswordReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                  6-Digit Reset Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={passwordResetOtp}
                  onChange={(e) => setPasswordResetOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full px-4 py-2.5 text-center text-lg tracking-[0.4em] text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  aria-label="6-digit password reset code"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                  <input
                    type={showResetPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPass(!showResetPass)}
                    className="absolute right-4 top-3 text-[#1E5A54] hover:text-[#1E5A54]"
                    aria-label={showResetPass ? 'Hide password' : 'Show password'}
                  >
                    {showResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                  <input
                    type={showResetConfirmPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmPass(!showResetConfirmPass)}
                    className="absolute right-4 top-3 text-[#1E5A54] hover:text-[#1E5A54]"
                    aria-label={showResetConfirmPass ? 'Hide password' : 'Show password'}
                  >
                    {showResetConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Reset Password</span>}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResendPasswordResetOTP}
                disabled={isSubmitting || resendCooldown > 0}
                className="w-full border border-[#1E5A54] bg-transparent text-[#1E5A54] hover:bg-[#1E5A54]/10 font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
              <button
                type="button"
                onClick={() => switchMode('forgot-password')}
                className="w-full text-center text-xs text-[#1E5A54] hover:underline font-semibold uppercase tracking-wider py-1 cursor-pointer"
              >
                Back to Email Entry
              </button>
            </div>
          </div>
        ) : (
          /* Main Authentication Card (Tabs: Sign In / Register) */
          <div className="bg-[#F8F4F2] border border-[#1E5A54]/25 rounded-3xl p-6 md:p-8 space-y-6">
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSubmitting}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-[#1E5A54]/30 bg-[#EEE6E2] hover:bg-[#EEE6E2]/80 hover:border-[#1E5A54] text-[#1E5A54] text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer disabled:opacity-60"
            >
              {isGoogleSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1E5A54]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#1E5A54]/20 w-full" />
              <span className="bg-[#F8F4F2] px-3 text-[11px] font-mono uppercase tracking-widest text-[#1E5A54]/60">
                or
              </span>
              <div className="border-t border-[#1E5A54]/20 w-full" />
            </div>

            {/* Tabs: Sign In and Register */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#EEE6E2] rounded-full border border-[#1E5A54]/25">
              <button
                type="button"
                onClick={() => switchMode('client-login')}
                className={`py-2 px-3 text-xs md:text-sm font-semibold tracking-wider uppercase rounded-full transition-colors flex items-center justify-center gap-1.5 ${
                  mode === 'client-login'
                    ? 'bg-[#1E5A54] text-[#EEE6E2]'
                    : 'text-[#1E5A54] hover:text-[#1E5A54]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('client-register')}
                className={`py-2 px-3 text-xs md:text-sm font-semibold tracking-wider uppercase rounded-full transition-colors flex items-center justify-center gap-1.5 ${
                  mode === 'client-register'
                    ? 'bg-[#1E5A54] text-[#EEE6E2]'
                    : 'text-[#1E5A54] hover:text-[#1E5A54]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>

            {/* Form 1: Client Login */}
            {mode === 'client-login' && (
              <form onSubmit={handleClientLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                    <input
                      type="email"
                      placeholder="client@example.com"
                      value={clientLogin.email}
                      onChange={(e) => setClientLogin({ ...clientLogin, email: e.target.value })}
                      className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">• {errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot-password')}
                      className="text-[11px] text-[#F7623D] hover:underline uppercase tracking-wider font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                    <input
                      type={showClientPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={clientLogin.password}
                      onChange={(e) => setClientLogin({ ...clientLogin, password: e.target.value })}
                      className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowClientPass(!showClientPass)}
                      className="absolute right-4 top-3 text-[#1E5A54] hover:text-[#1E5A54]"
                    >
                      {showClientPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">• {errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Sign In as Client</span>
                  )}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            {/* Form 2: Client Register */}
            {mode === 'client-register' && (
              <form onSubmit={handleClientRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={clientRegister.fullName}
                      onChange={(e) =>
                        setClientRegister({ ...clientRegister, fullName: e.target.value })
                      }
                      className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                      required
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">• {errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={clientRegister.email}
                      onChange={(e) =>
                        setClientRegister({ ...clientRegister, email: e.target.value })
                      }
                      className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">• {errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                      Country <span className="text-[#F7623D]">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54] pointer-events-none z-10" />
                      <select
                        value={clientRegister.country}
                        onChange={(e) =>
                          setClientRegister({ ...clientRegister, country: e.target.value })
                        }
                        className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-10 py-2.5 text-sm text-[#1E5A54] focus:outline-none focus:border-[#1E5A54] appearance-none cursor-pointer transition-colors"
                        required
                      >
                        <option value="" disabled className="bg-[#EEE6E2] text-[#1E5A54]">
                          Select your country...
                        </option>
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country} className="bg-[#EEE6E2] text-[#1E5A54]">
                            {COUNTRY_LABELS[country] ?? country}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-[#1E5A54] pointer-events-none" />
                    </div>
                    {errors.country && (
                      <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">• {errors.country}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                      WhatsApp (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                      <input
                        type="tel"
                        placeholder="+1234567890"
                        value={clientRegister.whatsappNumber}
                        onChange={(e) =>
                          setClientRegister({
                            ...clientRegister,
                            whatsappNumber: e.target.value,
                          })
                        }
                        className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                    <input
                      type={showRegPass ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      value={clientRegister.password}
                      onChange={(e) =>
                        setClientRegister({ ...clientRegister, password: e.target.value })
                      }
                      className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPass(!showRegPass)}
                      className="absolute right-4 top-3 text-[#1E5A54] hover:text-[#1E5A54]"
                    >
                      {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">• {errors.password}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                    <input
                      type={showRegConfirmPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={clientRegister.confirmPassword}
                      onChange={(e) =>
                        setClientRegister({
                          ...clientRegister,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                      className="absolute right-4 top-3 text-[#1E5A54] hover:text-[#1E5A54]"
                    >
                      {showRegConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">• {errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            {/* Privacy Policy Notice */}
            <p className="text-center text-[11px] text-[#1E5A54]/75 pt-2 leading-relaxed">
              By continuing, you agree to our{' '}
              <Link
                href="/privacy-policy"
                className="text-[#1E5A54] font-semibold underline hover:text-[#F7623D] transition-colors"
              >
                Privacy Policy
              </Link>
              . We protect your client workspace data and never store IP addresses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
