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
} from 'lucide-react';

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

    if (!clientRegister.country.trim() || clientRegister.country.trim().length < 2) {
      errs.country = 'Country is required';
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
    <div className="min-h-screen py-12 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>
          <Link href="/admin/login" className="hover:text-blue-400 transition-colors">
            Admin Portal Login →
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client & Partner Access</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {mode === 'client-login' && 'Client Portal'}
            {mode === 'client-register' && 'Client Registration'}
            {mode === 'owner-login' && 'Owner Administration'}
          </h1>
          <p className="text-sm text-slate-400">
            {mode === 'client-login' && 'Sign in to access your client projects and account.'}
            {mode === 'client-register' && 'Create your client account to get started.'}
            {mode === 'owner-login' && 'Company-provisioned credentials only.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          {/* Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => switchMode('client-login')}
              className={`py-2 px-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                mode === 'client-login' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('client-register')}
              className={`py-2 px-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                mode === 'client-register' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Register</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('owner-login')}
              className={`py-2 px-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                mode === 'owner-login' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Owner</span>
            </button>
          </div>

          {/* Unconfigured Notice */}
          {showNotice && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 relative">
              <button
                type="button"
                onClick={() => setShowNotice(false)}
                className="absolute top-3 right-3 text-amber-400 hover:text-amber-100"
                aria-label="Close message"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-amber-300">Authentication is not connected yet</h4>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
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
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={clientLogin.email}
                    onChange={(e) => setClientLogin({ ...clientLogin, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-400">• {errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showClientPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={clientLogin.password}
                    onChange={(e) => setClientLogin({ ...clientLogin, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowClientPass(!showClientPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showClientPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-400">• {errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
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
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={clientRegister.fullName}
                    onChange={(e) => setClientRegister({ ...clientRegister, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-rose-400">• {errors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={clientRegister.email}
                    onChange={(e) => setClientRegister({ ...clientRegister, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-400">• {errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="United States"
                      value={clientRegister.country}
                      onChange={(e) => setClientRegister({ ...clientRegister, country: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  {errors.country && <p className="text-xs text-rose-400">• {errors.country}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-300">WhatsApp (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      value={clientRegister.whatsappNumber}
                      onChange={(e) => setClientRegister({ ...clientRegister, whatsappNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    value={clientRegister.password}
                    onChange={(e) => setClientRegister({ ...clientRegister, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-400">• {errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showRegConfirmPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={clientRegister.confirmPassword}
                    onChange={(e) => setClientRegister({ ...clientRegister, confirmPassword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showRegConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-rose-400">• {errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Client Account</span>}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* Form 3: Owner Login */}
          {mode === 'owner-login' && (
            <form onSubmit={handleOwnerLogin} className="space-y-4">
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-slate-400">
                Owner accounts are company-provisioned. Self-registration is disabled.
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Company Email</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="owner@sbuweb.internal"
                    value={ownerLogin.email}
                    onChange={(e) => setOwnerLogin({ ...ownerLogin, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-400">• {errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showOwnerPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={ownerLogin.password}
                    onChange={(e) => setOwnerLogin({ ...ownerLogin, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOwnerPass(!showOwnerPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showOwnerPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-400">• {errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-100 hover:bg-white text-slate-900 font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-slate-900" /> : <span>Sign In as Owner</span>}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

