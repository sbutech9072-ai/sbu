'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Calculator,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { servicesData } from '@/data/services';

const quoteSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  companyName: z.string().min(2, { message: 'Company name is required.' }),
  email: z.string().email({ message: 'Valid work email required.' }),
  phone: z.string().optional(),
  serviceCategory: z.string().min(1, { message: 'Please select a primary service.' }),
  budgetRange: z.string().min(1, { message: 'Please select your estimated budget.' }),
  timeline: z.string().min(1, { message: 'Please select a delivery timeline.' }),
  projectOverview: z.string().min(15, { message: 'Please provide at least 15 characters of project context.' }),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const availableFeatures = [
  'User Authentication & RBAC',
  'Real-Time WebSocket Sync',
  'AI / LLM Integration (RAG)',
  'Payment Gateway (Stripe)',
  'Cloud Infrastructure & CI/CD',
  'Multi-Language Localization',
  'Admin Analytics & Reporting',
  'Regulatory Compliance (HIPAA/SOC2)',
];

export function QuoteForm() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      serviceCategory: servicesData[0]?.title || '',
      budgetRange: '$25,000 - $50,000',
      timeline: '2 - 3 Months',
      projectOverview: '',
    },
  });

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    setSelectedFeatures([]);
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-10 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-2xl font-bold text-white">Project Scope Received</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Our solutions engineering team will review your requirements, prepare an architectural
          estimate, and contact you with a detailed proposal within 24–48 hours.
        </p>
        <Button
          variant="secondary"
          onClick={() => setIsSuccess(false)}
          className="mt-4"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Step 1: Project Scope */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
          <Calculator className="h-4 w-4" />
          <span>1. Project Scope & Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Primary Service <span className="text-blue-400">*</span>
            </label>
            <Select {...register('serviceCategory')} error={!!errors.serviceCategory}>
              {servicesData.map((s) => (
                <option key={s.id} value={s.title} className="bg-slate-900 text-white">
                  {s.title}
                </option>
              ))}
            </Select>
            {errors.serviceCategory && (
              <p className="text-xs text-rose-400">{errors.serviceCategory.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Estimated Budget <span className="text-blue-400">*</span>
            </label>
            <Select {...register('budgetRange')} error={!!errors.budgetRange}>
              <option value="$10,000 - $25,000" className="bg-slate-900 text-white">
                $10,000 - $25,000 (MVP / Audit)
              </option>
              <option value="$25,000 - $50,000" className="bg-slate-900 text-white">
                $25,000 - $50,000 (Core Platform)
              </option>
              <option value="$50,000 - $100,000" className="bg-slate-900 text-white">
                $50,000 - $100,000 (Full-Scale SaaS)
              </option>
              <option value="$100,000+" className="bg-slate-900 text-white">
                $100,000+ (Enterprise Transformation)
              </option>
            </Select>
            {errors.budgetRange && (
              <p className="text-xs text-rose-400">{errors.budgetRange.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Desired Timeline <span className="text-blue-400">*</span>
            </label>
            <Select {...register('timeline')} error={!!errors.timeline}>
              <option value="1 - 2 Months" className="bg-slate-900 text-white">
                1 - 2 Months (Rapid Sprint)
              </option>
              <option value="2 - 3 Months" className="bg-slate-900 text-white">
                2 - 3 Months (Standard MVP)
              </option>
              <option value="3 - 6 Months" className="bg-slate-900 text-white">
                3 - 6 Months (Enterprise Release)
              </option>
              <option value="Ongoing Partnership" className="bg-slate-900 text-white">
                Ongoing Engineering Retainer
              </option>
            </Select>
            {errors.timeline && (
              <p className="text-xs text-rose-400">{errors.timeline.message}</p>
            )}
          </div>
        </div>

        {/* Feature Checkboxes */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
            Select Desired Capabilities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {availableFeatures.map((feat) => {
              const checked = selectedFeatures.includes(feat);
              return (
                <button
                  type="button"
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${
                    checked
                      ? 'border-blue-500 bg-blue-500/10 text-white font-medium'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="line-clamp-2">{feat}</span>
                  {checked && <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 2: Project Overview */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
          <Sparkles className="h-4 w-4" />
          <span>2. Project Vision & Description</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
            Tell us about what you want to build <span className="text-blue-400">*</span>
          </label>
          <Textarea
            rows={5}
            placeholder="Share your goals, target audience, core user stories, legacy systems to integrate, or any specific architectural standards..."
            {...register('projectOverview')}
            error={!!errors.projectOverview}
          />
          {errors.projectOverview && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.projectOverview.message}
            </p>
          )}
        </div>
      </div>

      {/* Step 3: Contact Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
          <FileSpreadsheet className="h-4 w-4" />
          <span>3. Point of Contact</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Full Name <span className="text-blue-400">*</span>
            </label>
            <Input placeholder="Michael Chang" {...register('fullName')} error={!!errors.fullName} />
            {errors.fullName && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Company / Organization <span className="text-blue-400">*</span>
            </label>
            <Input
              placeholder="Acme Corp."
              {...register('companyName')}
              error={!!errors.companyName}
            />
            {errors.companyName && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.companyName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Work Email <span className="text-blue-400">*</span>
            </label>
            <Input
              type="email"
              placeholder="michael@acme.com"
              {...register('email')}
              error={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
              Phone Number (Optional)
            </label>
            <Input type="tel" placeholder="+1 (555) 123-4567" {...register('phone')} />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-base font-semibold rounded-xl gap-2 shadow-xl shadow-blue-600/25"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Calculating Scope & Submitting...</span>
          </>
        ) : (
          <>
            <span>Submit Project Scope for Estimate</span>
            <FileSpreadsheet className="h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}

