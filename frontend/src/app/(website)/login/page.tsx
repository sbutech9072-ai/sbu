'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Lock,
  Globe,
  Phone,
  Eye,
  EyeOff,
  Shield,
  Building,
  ArrowRight,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';

type AuthMode = 'client-login' | 'client-register' | 'owner-login';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('client-login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  // Password visibility states
  const [showClientPass, setShowClientPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);
  const [showOwnerPass, setShowOwnerPass] = useState(false);

  // Form Fields
  const [clientLogin, setClientLogin] = useState({ email: '', password: '' });
  const [clientRegister, setClientRegister] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    whatsappNumber: '',
  });
  const [ownerLogin, setOwnerLogin] = useState({ email: '', password: '' });

  // Field Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setShowNotice(false);
  };

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Submission handlers
  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotice(false);
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
    setTimeout(() => {
      setIsSubmitting(false);
      setShowNotice(true);
    }, 500);
  };

  const handleClientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotice(false);
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
    setTimeout(() => {
      setIsSubmitting(false);
      setShowNotice(true);
    }, 500);
  };

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotice(false);
    const errs: { [key: string]: string } = {};

    if (!ownerLogin.email.trim()) errs.email = 'Company email is required';
    else if (!validateEmail(ownerLogin.email)) errs.email = 'Invalid email address';

    if (!ownerLogin.password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowNotice(true);
    }, 500);
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center px-4 bg-[#EEE6E2] text-[#1E5A54]">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold text-[#1E5A54]/70">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#1E5A54] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <Link href="/admin/login" className="hover:text-[#F7623D] transition-colors">
            Admin Portal →
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] text-xs font-semibold tracking-[0.16em] uppercase text-[#1E5A54]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D]" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client & Partner Access</span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
            {mode === 'client-login' && 'Client Portal'}
            {mode === 'client-register' && 'Client Registration'}
            {mode === 'owner-login' && 'Owner Administration'}
          </h1>
          <p className="text-sm text-[#1E5A54]/80 max-w-md mx-auto">
            {mode === 'client-login' && 'Sign in to access your client projects and account.'}
            {mode === 'client-register' && 'Create your client account to get started.'}
            {mode === 'owner-login' && 'Company-provisioned credentials only.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#EEE6E2] border border-[#1E5A54]/25 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          {/* Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#EEE6E2] rounded-full border border-[#1E5A54]/25">
            <button
              type="button"
              onClick={() => switchMode('client-login')}
              className={`py-2 px-2 text-xs md:text-sm font-semibold tracking-wider uppercase rounded-full transition-colors flex items-center justify-center gap-1.5 ${
                mode === 'client-login'
                  ? 'bg-[#1E5A54] text-[#EEE6E2]'
                  : 'text-[#1E5A54]/70 hover:text-[#1E5A54]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('client-register')}
              className={`py-2 px-2 text-xs md:text-sm font-semibold tracking-wider uppercase rounded-full transition-colors flex items-center justify-center gap-1.5 ${
                mode === 'client-register'
                  ? 'bg-[#1E5A54] text-[#EEE6E2]'
                  : 'text-[#1E5A54]/70 hover:text-[#1E5A54]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('owner-login')}
              className={`py-2 px-2 text-xs md:text-sm font-semibold tracking-wider uppercase rounded-full transition-colors flex items-center justify-center gap-1.5 ${
                mode === 'owner-login'
                  ? 'bg-[#1E5A54] text-[#EEE6E2]'
                  : 'text-[#1E5A54]/70 hover:text-[#1E5A54]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Owner</span>
            </button>
          </div>

          {/* Unconfigured Notice */}
          {showNotice && (
            <div className="rounded-2xl border border-[#1E5A54]/30 bg-[#EEE6E2] p-4 text-[#1E5A54] relative">
              <button
                type="button"
                onClick={() => setShowNotice(false)}
                className="absolute top-3 right-3 text-[#1E5A54]/60 hover:text-[#1E5A54]"
                aria-label="Close message"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#F7623D] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#1E5A54]">Authentication is not connected yet</h4>
                  <p className="text-xs text-[#1E5A54]/80 leading-relaxed">
                    Form input validated successfully. The frontend is currently decoupled and database/Supabase integration is not yet active.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form 1: Client Login */}
          {mode === 'client-login' && (
            <form onSubmit={handleClientLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50" />
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={clientLogin.email}
                    onChange={(e) => setClientLogin({ ...clientLogin, email: e.target.value })}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/40 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  />
                </div>
                {errors.email && <p className="text-xs text-[#F7623D] font-medium">• {errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50" />
                  <input
                    type={showClientPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={clientLogin.password}
                    onChange={(e) => setClientLogin({ ...clientLogin, password: e.target.value })}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/40 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowClientPass(!showClientPass)}
                    className="absolute right-4 top-3 text-[#1E5A54]/50 hover:text-[#1E5A54]"
                  >
                    {showClientPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-[#F7623D] font-medium">• {errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F7623D] hover:bg-[#E05330] text-white font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In as Client</span>}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* Form 2: Client Register */}
          {mode === 'client-register' && (
            <form onSubmit={handleClientRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50" />
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={clientRegister.fullName}
                    onChange={(e) => setClientRegister({ ...clientRegister, fullName: e.target.value })}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/40 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-[#F7623D] font-medium">• {errors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50" />
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={clientRegister.email}
                    onChange={(e) => setClientRegister({ ...clientRegister, email: e.target.value })}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/40 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  />
                </div>
                {errors.email && <p className="text-xs text-[#F7623D] font-medium">• {errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">
                    Country <span className="text-[#F7623D]">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50 pointer-events-none z-10" />
                    <select
                      value={clientRegister.country}
                      onChange={(e) => setClientRegister({ ...clientRegister, country: e.target.value })}
                      className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-10 py-2.5 text-sm text-[#1E5A54] focus:outline-none focus:border-[#1E5A54] appearance-none cursor-pointer transition-colors"
                    >
                      <option value="" disabled className="bg-[#EEE6E2] text-[#1E5A54]/60">
                        Select your country...
                      </option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-[#EEE6E2] text-[#1E5A54]">
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-[#1E5A54]/50 pointer-events-none" />
                  </div>
                  {errors.country && <p className="text-xs text-[#F7623D] font-medium">• {errors.country}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">WhatsApp (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50" />
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      value={clientRegister.whatsappNumber}
                      onChange={(e) => setClientRegister({ ...clientRegister, whatsappNumber: e.target.value })}
                      className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/40 focus:outline-none focus:border-[#1E5A54] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50" />
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    value={clientRegister.password}
                    onChange={(e) => setClientRegister({ ...clientRegister, password: e.target.value })}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/40 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-4 top-3 text-[#1E5A54]/50 hover:text-[#1E5A54]"
                  >
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-[#F7623D] font-medium">• {errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50" />
                  <input
                    type={showRegConfirmPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={clientRegister.confirmPassword}
                    onChange={(e) => setClientRegister({ ...clientRegister, confirmPassword: e.target.value })}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/40 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                    className="absolute right-4 top-3 text-[#1E5A54]/50 hover:text-[#1E5A54]"
                  >
                    {showRegConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-[#F7623D] font-medium">• {errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F7623D] hover:bg-[#E05330] text-white font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Client Account</span>}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* Form 3: Owner Login */}
          {mode === 'owner-login' && (
            <form onSubmit={handleOwnerLogin} className="space-y-4">
              <div className="rounded-2xl bg-[#EEE6E2] border border-[#1E5A54]/25 p-3 text-xs text-[#1E5A54]/80">
                Owner accounts are company-provisioned. Self-registration is disabled.
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">Company Email</label>
                <div className="relative">
                  <Building className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50" />
                  <input
                    type="email"
                    placeholder="owner@sbuweb.internal"
                    value={ownerLogin.email}
                    onChange={(e) => setOwnerLogin({ ...ownerLogin, email: e.target.value })}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/40 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  />
                </div>
                {errors.email && <p className="text-xs text-[#F7623D] font-medium">• {errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1E5A54]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#1E5A54]/50" />
                  <input
                    type={showOwnerPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={ownerLogin.password}
                    onChange={(e) => setOwnerLogin({ ...ownerLogin, password: e.target.value })}
                    className="w-full bg-[#EEE6E2] border border-[#1E5A54]/30 rounded-full pl-11 pr-11 py-2.5 text-sm text-[#1E5A54] placeholder-[#1E5A54]/40 focus:outline-none focus:border-[#1E5A54] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOwnerPass(!showOwnerPass)}
                    className="absolute right-4 top-3 text-[#1E5A54]/50 hover:text-[#1E5A54]"
                  >
                    {showOwnerPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-[#F7623D] font-medium">• {errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F7623D] hover:bg-[#E05330] text-white font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <span>Sign In as Owner</span>}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
