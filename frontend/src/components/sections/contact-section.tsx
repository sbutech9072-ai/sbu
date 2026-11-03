import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { ContactForm } from '@/features/contact/contact-form';
import { siteConfig } from '@/config/site';

export function ContactSection() {
  return (
    <section className="py-20 md:py-28 bg-[#EEE6E2]">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <SectionHeading
          badge="Get in Touch"
          title="Let's Discuss Your Next Architectural Milestone"
          subtitle="Have a technical inquiry, request for proposal, or open project discussion? Connect directly with our team."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6 p-8 rounded-2xl border border-[#1E5A54]/18 bg-[#EEE6E2]">
            <div>
              <h3 className="font-headline text-2xl font-bold uppercase text-[#1E5A54] leading-tight">
                Direct Channel
              </h3>
              <p className="text-xs text-[#1E5A54]/80 mt-1 leading-relaxed font-sans">
                Reach our team directly via email, phone, or our San Francisco headquarters.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full border border-[#1E5A54] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <Mail className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54]/60 block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm font-medium text-[#1E5A54] hover:text-[#F7623D] transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full border border-[#1E5A54] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <Phone className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54]/60 block">
                    Direct Phone
                  </span>
                  <span className="text-sm font-medium text-[#1E5A54]">{siteConfig.contact.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full border border-[#1E5A54] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <MapPin className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54]/60 block">
                    Studio Location
                  </span>
                  <span className="text-sm font-medium text-[#1E5A54] leading-relaxed">
                    {siteConfig.contact.address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full border border-[#1E5A54] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <Clock className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54]/60 block">
                    Operating Hours
                  </span>
                  <span className="text-sm font-medium text-[#1E5A54]">
                    Mon - Fri: 8:00 AM - 6:00 PM PST
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1E5A54]/15">
              <div className="p-4 rounded-xl border border-[#1E5A54]/18 bg-[#EEE6E2] space-y-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#F7623D] stroke-[1.5]" />
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#1E5A54]">
                    Fast Architectural Response
                  </span>
                </div>
                <p className="text-xs text-[#1E5A54]/80 leading-relaxed font-sans">
                  All enterprise RFPs and technical project inquiries receive a response from a senior
                  engineering partner within 24 business hours.
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 p-8 rounded-2xl border border-[#1E5A54]/18 bg-[#EEE6E2]">
            <div className="mb-6">
              <h3 className="font-headline text-2xl font-bold uppercase text-[#1E5A54] leading-tight">
                Send an Inquiry
              </h3>
              <p className="text-xs text-[#1E5A54]/80 mt-1 font-sans">
                Fill out the form below and an engineer will review your project requirements.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
