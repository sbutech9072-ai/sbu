import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { ContactForm } from '@/features/contact/contact-form';
import { siteConfig } from '@/config/site';

export function ContactSection() {
  return (
    <section className="py-16 md:py-24 bg-[#F8F4F2]">
      <div className="site-container space-y-10 md:space-y-12">
        <SectionHeading
          align="left"
          title="Start a technical conversation"
          subtitle="Have an architecture brief, RFP, or migration timeline? Reach our San Francisco engineering desk directly."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left 5 Cols */}
          <div className="lg:col-span-5 space-y-6 p-7 sm:p-8 rounded-2xl border border-[#1E5A54]/15 bg-[#EEE6E2]/65">
            <div className="border-b border-[#1E5A54]/15 pb-4">
              <h3 className="font-headline text-2xl font-bold text-[#1E5A54]">
                Direct channels
              </h3>
              <p className="text-xs text-[#1E5A54]/75 mt-1">
                Every inquiry is reviewed directly by a partner architect within one business day.
              </p>
            </div>

            <div className="divide-y divide-[#1E5A54]/15">
              <div className="py-4 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-lg border border-[#1E5A54]/20 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <Mail className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#1E5A54]/70 block">
                    Email
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm font-semibold text-[#1E5A54] hover:text-[#F7623D] transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="py-4 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-lg border border-[#1E5A54]/20 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <Phone className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#1E5A54]/70 block">
                    Phone
                  </span>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-sm font-semibold text-[#1E5A54] hover:text-[#F7623D] transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="py-4 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-lg border border-[#1E5A54]/20 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <MapPin className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#1E5A54]/70 block">
                    Office
                  </span>
                  <span className="text-sm font-medium text-[#1E5A54] leading-relaxed">
                    {siteConfig.contact.address}
                  </span>
                </div>
              </div>

              <div className="py-4 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-lg border border-[#1E5A54]/20 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <Clock className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#1E5A54]/70 block">
                    Hours
                  </span>
                  <span className="text-sm font-medium text-[#1E5A54]">
                    Mon – Fri, 8:00 AM – 6:00 PM PST
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols */}
          <div className="lg:col-span-7 p-7 sm:p-8 md:p-10 rounded-2xl border border-[#1E5A54]/15 bg-[#EEE6E2]/45">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
