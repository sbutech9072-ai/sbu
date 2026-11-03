'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
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

  const onSubmit = async () => {
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
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#EEE6E2] text-[#1E5A54]">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F4F2] border border-[#1E5A54]/25 text-[#1E5A54] text-xs font-mono font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-[#F7623D]" />
            <span>Sbu Tech Control Desk</span>
          </div>

          <h1 className="font-headline text-3xl md:text-4xl uppercase text-[#1E5A54] tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-xs text-[#1E5A54]">
            Internal console for managing case studies, practice areas, and client inquiries.
          </p>
        </div>

        {/* Notice Card */}
        <div className="p-4 rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] text-[#1E5A54] text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-[#1E5A54]">
            <AlertCircle className="h-4 w-4 text-[#F7623D] shrink-0" />
            <span>Phase 01 Mock Interface</span>
          </div>
          <p className="text-[11px] text-[#1E5A54] leading-relaxed">
            Live database authentication is not connected in this phase. You can sign in directly
            using any credentials or the pre-filled demo account.
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 md:p-8 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1E5A54]">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#1E5A54]" />
                <Input
                  type="email"
                  className="pl-10 rounded-full bg-[#EEE6E2] border-[#1E5A54]/30 text-[#1E5A54]"
                  placeholder="admin@sbutech.internal"
                  {...register('email')}
                  error={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1E5A54]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#1E5A54]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  className="pl-10 pr-10 rounded-full bg-[#EEE6E2] border-[#1E5A54]/30 text-[#1E5A54]"
                  placeholder="••••••••••••"
                  {...register('password')}
                  error={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#1E5A54] hover:text-[#1E5A54]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#1E5A54] decoration-[#F7623D] font-medium">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-xs font-semibold uppercase tracking-wider rounded-full gap-2 mt-2 bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2]"
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

          <div className="pt-3 border-t border-[#1E5A54]/20 flex items-center justify-between text-xs text-[#1E5A54]">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#1E5A54] decoration-[#F7623D] hover:underline font-semibold"
            >
              Fill Demo Credentials
            </button>
            <Link href="/" className="hover:text-[#1E5A54] transition-colors flex items-center gap-1 font-medium">
              <Home className="h-3 w-3" />
              <span>Back to Home</span>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
