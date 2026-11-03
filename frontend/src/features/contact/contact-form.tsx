'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Enter your name (at least 2 characters).' }),
  email: z.string().email({ message: 'Enter a valid work email address.' }),
  phone: z.string().optional(),
  subject: z.string().min(3, { message: 'Add a short subject line.' }),
  message: z.string().min(10, { message: 'Tell us a bit more (at least 10 characters).' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-[#1E5A54]/30 bg-[#F8F4F2] p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#1E5A54] bg-[#EEE6E2] text-[#F7623D]">
          <CheckCircle2 className="h-6 w-6 stroke-[1.75]" />
        </div>
        <h3 className="font-headline text-2xl font-bold uppercase text-[#1E5A54]">
          Note Received
        </h3>
        <p className="text-sm text-[#1E5A54]/90 max-w-md mx-auto leading-relaxed font-sans">
          Thanks for writing to Sbu Tech. An engineering partner reads every note directly and will reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="mt-2 rounded-full border border-[#1E5A54] bg-[#EEE6E2] px-6 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          Send Another Note
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
            Your Name <span className="text-[#F7623D]">*</span>
          </label>
          <Input
            placeholder="Sarah Jenkins"
            {...register('name')}
            error={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-[#F7623D] flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3 stroke-[1.75]" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
            Work Email <span className="text-[#F7623D]">*</span>
          </label>
          <Input
            type="email"
            placeholder="sarah@company.com"
            {...register('email')}
            error={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-[#F7623D] flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3 stroke-[1.75]" />
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
            Phone (Optional)
          </label>
          <Input
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register('phone')}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
            Subject <span className="text-[#F7623D]">*</span>
          </label>
          <Input
            placeholder="EKS migration or web platform build"
            {...register('subject')}
            error={!!errors.subject}
          />
          {errors.subject && (
            <p className="text-xs text-[#F7623D] flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3 stroke-[1.75]" />
              {errors.subject.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#1E5A54]">
          What Are You Building? <span className="text-[#F7623D]">*</span>
        </label>
        <Textarea
          rows={5}
          placeholder="Tell us about your current stack, what is breaking or slowing you down, and when you want to ship..."
          {...register('message')}
          error={!!errors.message}
        />
        {errors.message && (
          <p className="text-xs text-[#F7623D] flex items-center gap-1 font-medium">
            <AlertCircle className="h-3 w-3 stroke-[1.75]" />
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 rounded-full bg-[#F7623D] hover:bg-[#1E5A54] text-[#F8F4F2] text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending Note...</span>
          </>
        ) : (
          <>
            <span>Send Note</span>
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
