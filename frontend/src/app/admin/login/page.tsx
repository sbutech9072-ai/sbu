'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Terminal,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Home,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const adminLoginSchema = z.object({
  email: z.string().email({ message: 'Valid administrator email is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AdminLoginData = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdminLoginData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: 'admin@sbutech.internal',
      password: 'password123',
    },
  });

  const onSubmit = async (data: AdminLoginData) => {
    setIsSubmitting(true);
    // Simulate brief authentication handshake
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    router.push('/admin');
  };

  const handleFillDemo = () => {
    setValue('email', 'admin@sbutech.internal');
    setValue('password', 'supersecurepass');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#090d16] text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Sbu Tech Control Console</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-xs text-slate-400">
            Internal console UI for managing company case studies, services, and inquiries.
          </p>
        </div>

        {/* Notice Card */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Phase 01 Mock Interface</span>
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            Live database authentication is not connected in this phase. You can sign in directly
            using any credentials or the pre-filled demo account.
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 md:p-8 border-slate-800 bg-slate-900/60 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  className="pl-10"
                  placeholder="admin@sbutech.internal"
                  {...register('email')}
                  error={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  className="pl-10 pr-10"
                  placeholder="••••••••••••"
                  {...register('password')}
                  error={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-sm font-semibold rounded-xl gap-2 mt-2 shadow-lg shadow-blue-600/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Fill Demo Credentials
            </button>
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="h-3 w-3" />
              <span>Back to Home</span>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

