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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { servicesData } from '@/data/services';

const quoteSchema = z.object({
  fullName: z.string().min(2, { message: 'Enter your full name.' }),
  companyName: z.string().min(2, { message: 'Company name is required.' }),
  email: z.string().email({ message: 'Enter a valid work email.' }),
  phone: z.string().optional(),
  serviceCategory: z.string().min(1, { message: 'Select a primary service.' }),
  budgetRange: z.string().min(1, { message: 'Select an estimated budget range.' }),
  timeline: z.string().min(1, { message: 'Select a target delivery window.' }),
  projectOverview: z.string().min(15, { message: 'Share at least 15 characters of technical context.' }),
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

  const onSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    setSelectedFeatures([]);
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-[#1E5A54]/30 bg-[#F8F4F2] p-10 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#1E5A54] bg-[#EEE6E2] text-[#F7623D]">
          <CheckCircle2 className="h-7 w-7 stroke-[1.75]" />
        </div>
        <h3 className="font-headline text-3xl font-bold uppercase text-[#1E5A54]">
          Scope Received
        </h3>
        <p className="text-sm text-[#1E5A54]/90 max-w-md mx-auto leading-relaxed font-sans">
          Our principals will review your technical brief, put together a sprint breakdown and cost estimate, and reply within 24 to 48 hours.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="mt-4 rounded-full border border-[#1E5A54] bg-[#EEE6E2] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          Send Another Scope
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Step 1: Project Scope */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
          <Calculator className="h-4 w-4 stroke-[1.75] text-[#1E5A54] decoration-[#F7623D]" />
          <span>1. Discipline, Budget & Timeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
              Primary Discipline <span className="text-[#1E5A54] decoration-[#F7623D]">*</span>
            </label>
            <Select {...register('serviceCategory')} error={!!errors.serviceCategory}>
              {servicesData.map((s) => (
                <option key={s.id} value={s.title} className="bg-[#EEE6E2] text-[#1E5A54]">
                  {s.title}
                </option>
              ))}
            </Select>
            {errors.serviceCategory && (
              <p className="text-xs text-[#1E5A54] decoration-[#F7623D]">{errors.serviceCategory.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
              Estimated Budget <span className="text-[#1E5A54] decoration-[#F7623D]">*</span>
            </label>
            <Select {...register('budgetRange')} error={!!errors.budgetRange}>
              <option value="$10,000 - $25,000" className="bg-[#EEE6E2] text-[#1E5A54]">
                $10,000 - $25,000 (Scoped Audit / Prototype)
              </option>
              <option value="$25,000 - $50,000" className="bg-[#EEE6E2] text-[#1E5A54]">
                $25,000 - $50,000 (Core Production Build)
              </option>
              <option value="$50,000 - $100,000" className="bg-[#EEE6E2] text-[#1E5A54]">
                $50,000 - $100,000 (Multi-Service Platform)
              </option>
              <option value="$100,000+" className="bg-[#EEE6E2] text-[#1E5A54]">
                $100,000+ (Dedicated Engineering Squad)
              </option>
            </Select>
            {errors.budgetRange && (
              <p className="text-xs text-[#1E5A54] decoration-[#F7623D]">{errors.budgetRange.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
              Target Delivery <span className="text-[#1E5A54] decoration-[#F7623D]">*</span>
            </label>
            <Select {...register('timeline')} error={!!errors.timeline}>
              <option value="1 - 2 Months" className="bg-[#EEE6E2] text-[#1E5A54]">
                1 - 2 Months (Focused Sprint)
              </option>
              <option value="2 - 3 Months" className="bg-[#EEE6E2] text-[#1E5A54]">
                2 - 3 Months (Standard Release)
              </option>
              <option value="4 - 6 Months" className="bg-[#EEE6E2] text-[#1E5A54]">
                4 - 6 Months (Full Architecture Rollout)
              </option>
              <option value="Ongoing Retainer" className="bg-[#EEE6E2] text-[#1E5A54]">
                Ongoing Retainer (Embedded Team)
              </option>
            </Select>
            {errors.timeline && <p className="text-xs text-[#1E5A54] decoration-[#F7623D]">{errors.timeline.message}</p>}
          </div>
        </div>

        {/* Multi-Select Feature Tags */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54] flex items-center justify-between">
            <span>System Capabilities Needed</span>
            <span className="text-[11px] text-[#1E5A54] lowercase tracking-normal font-semibold">
              pick all that apply
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableFeatures.map((feat) => {
              const isSelected = selectedFeatures.includes(feat);
              return (
                <button
                  type="button"
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  className={`text-xs font-bold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1E5A54] text-[#EEE6E2] border border-[#1E5A54]'
                      : 'border border-[#1E5A54]/30 bg-[#F8F4F2] text-[#1E5A54] hover:border-[#1E5A54]'
                  }`}
                >
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D]" />}
                  <span>{feat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 2: Project Description */}
      <div className="space-y-4 pt-4 border-t border-[#1E5A54]/15">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
          <Sparkles className="h-4 w-4 stroke-[1.75] text-[#F7623D]" />
          <span>2. Technical Context & Constraints</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
            System Overview <span className="text-[#1E5A54] decoration-[#F7623D]">*</span>
          </label>
          <Textarea
            rows={4}
            placeholder="What does the system need to do? Mention existing databases, traffic volume, compliance rules, or hard deadlines..."
            {...register('projectOverview')}
            error={!!errors.projectOverview}
          />
          {errors.projectOverview && (
            <p className="text-xs text-[#1E5A54] decoration-[#F7623D] flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3 stroke-[1.75]" />
              {errors.projectOverview.message}
            </p>
          )}
        </div>
      </div>

      {/* Step 3: Contact Details */}
      <div className="space-y-4 pt-4 border-t border-[#1E5A54]/15">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
          <FileSpreadsheet className="h-4 w-4 stroke-[1.75] text-[#F7623D]" />
          <span>3. Your Contact Details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
              Full Name <span className="text-[#1E5A54] decoration-[#F7623D]">*</span>
            </label>
            <Input placeholder="Michael Chang" {...register('fullName')} error={!!errors.fullName} />
            {errors.fullName && (
              <p className="text-xs text-[#1E5A54] decoration-[#F7623D] flex items-center gap-1 font-medium">
                <AlertCircle className="h-3 w-3 stroke-[1.75]" />
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
              Company <span className="text-[#1E5A54] decoration-[#F7623D]">*</span>
            </label>
            <Input
              placeholder="Acme Systems Inc."
              {...register('companyName')}
              error={!!errors.companyName}
            />
            {errors.companyName && (
              <p className="text-xs text-[#1E5A54] decoration-[#F7623D] flex items-center gap-1 font-medium">
                <AlertCircle className="h-3 w-3 stroke-[1.75]" />
                {errors.companyName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
              Work Email <span className="text-[#1E5A54] decoration-[#F7623D]">*</span>
            </label>
            <Input
              type="email"
              placeholder="michael@acme.com"
              {...register('email')}
              error={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-[#1E5A54] decoration-[#F7623D] flex items-center gap-1 font-medium">
                <AlertCircle className="h-3 w-3 stroke-[1.75]" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
              Phone (Optional)
            </label>
            <Input type="tel" placeholder="+1 (555) 123-4567" {...register('phone')} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-full bg-[#1E5A54] border-2 border-[#F7623D] hover:bg-[#16443F] text-[#EEE6E2] text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Sending Scope...</span>
          </>
        ) : (
          <>
            <span>Send Scope for Estimate</span>
            <FileSpreadsheet className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
