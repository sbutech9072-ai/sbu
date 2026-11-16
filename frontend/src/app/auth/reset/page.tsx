'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters in length.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(error.message || 'Failed to update password. Please try requesting a new reset link.');
      } else {
        setSuccessMessage('Your password has been successfully updated. You may now sign in with your new password.');
        setPassword('');
        setConfirmPassword('');
      }
    } catch {
      setErrorMessage('An unexpected error occurred while resetting your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center px-4 bg-[#EEE6E2] text-[#1E5A54]">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold text-[#1E5A54]">
          <Link href="/login" className="inline-flex items-center gap-1.5 hover:text-[#1E5A54] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#1E5A54]/10 text-[#1E5A54] mb-1">
            <KeyRound className="w-6 h-6 stroke-[1.75]" />
          </div>
          <h1 className="font-headline text-3xl md:text-4xl uppercase tracking-tight text-[#1E5A54]">
            Set New Password
          </h1>
          <p className="text-xs text-[#1E5A54]/80 max-w-sm mx-auto leading-relaxed">
            Enter a secure password for your account. You can also use this to add a password to an existing Google sign-in.
          </p>
        </div>

        <div className="bg-[#F8F4F2] border border-[#1E5A54]/25 rounded-3xl p-6 md:p-8 space-y-5">
          {errorMessage && (
            <div className="rounded-2xl border border-[#F7623D]/50 bg-[#F8F4F2] p-4 text-[#1E5A54] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#F7623D] shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-[#1E5A54]/90">{errorMessage}</div>
            </div>
          )}

          {successMessage ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#1E5A54]/10 flex items-center justify-center text-[#1E5A54]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#1E5A54] leading-relaxed font-medium">
                {successMessage}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full bg-[#1E5A54] hover:bg-[#16443F] text-[#EEE6E2] font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] transition-colors"
              >
                <span>Continue to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-3 text-[#1E5A54] hover:text-[#1E5A54]"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    type={showConfirmPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/60 focus:outline-none focus:border-[#1E5A54] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-3 text-[#1E5A54] hover:text-[#1E5A54]"
                    aria-label={showConfirmPass ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
