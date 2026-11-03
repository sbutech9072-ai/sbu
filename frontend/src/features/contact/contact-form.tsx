'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
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

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API request turnaround
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-white">Message Transmitted Successfully</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to Sbu Tech. Our engineering leadership reviews inquiries within 24 business hours.
        </p>
        <Button
          variant="secondary"
          onClick={() => setIsSuccess(false)}
          className="mt-2 text-xs"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Full Name <span className="text-blue-400">*</span>
          </label>
          <Input
            placeholder="Sarah Jenkins"
            {...register('name')}
            error={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Work Email <span className="text-blue-400">*</span>
          </label>
          <Input
            type="email"
            placeholder="sarah@enterprise.com"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Phone Number (Optional)
          </label>
          <Input
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register('phone')}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Subject <span className="text-blue-400">*</span>
          </label>
          <Input
            placeholder="Project Consultation Inquiry"
            {...register('subject')}
            error={!!errors.subject}
          />
          {errors.subject && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.subject.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Project Details & Requirements <span className="text-blue-400">*</span>
        </label>
        <Textarea
          rows={5}
          placeholder="Briefly describe your objectives, target timeline, technical stack preferences, and any specific challenges..."
          {...register('message')}
          error={!!errors.message}
        />
        {errors.message && (
          <p className="text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 text-sm font-semibold rounded-xl gap-2 shadow-lg shadow-blue-600/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Validating & Sending...</span>
          </>
        ) : (
          <>
            <span>Submit Inquiry</span>
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

