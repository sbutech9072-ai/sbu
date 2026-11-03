import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { ContactForm } from '@/features/contact/contact-form';
import { siteConfig } from '@/config/site';

export function ContactSection() {
  return (
    <section className="py-20 md:py-28 bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <SectionHeading
          badge="Get in Touch"
          title="Let's Discuss Your Next Architectural Milestone"
          subtitle="Have a technical inquiry, request for proposal, or open project discussion? Connect directly with our team."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6 p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <div>
              <h3 className="text-xl font-bold text-white">Direct Channel</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Reach our team directly via email, phone, or our San Francisco headquarters.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Direct Phone
                  </span>
                  <span className="text-sm font-medium text-white">{siteConfig.contact.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Headquarters
                  </span>
                  <span className="text-xs text-slate-300 leading-relaxed block">
                    {siteConfig.contact.address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Support Hours
                  </span>
                  <span className="text-xs text-slate-300">{siteConfig.contact.workingHours}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/10 text-xs text-blue-300 flex items-start gap-2">
              <MessageSquare className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Looking for a quick initial budget estimate? Use our interactive{' '}
                <a href="/get-a-quote" className="underline font-semibold text-white">
                  quote estimator
                </a>
                .
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <h3 className="text-xl font-bold text-white mb-2">Send an Inquiry</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Fill out the form below. We adhere to strict non-disclosure practices from first contact.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

