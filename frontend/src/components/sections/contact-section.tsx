import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { ContactForm } from '@/features/contact/contact-form';
import { siteConfig } from '@/config/site';
import { HandArrow, StudioStamp } from '@/components/human/hand-crafted-svg';

export function ContactSection() {
  return (
    <section className="py-20 md:py-28 bg-[#EEE6E2]">
      <div className="site-container space-y-14 xl:space-y-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Studio Dispatch Desk"
            title="Start a Technical Conversation"
            subtitle="Have an architecture brief, RFP, or migration timeline? Reach our San Francisco engineering desk directly."
          />

          <StudioStamp
            text="SF DISPATCH // 37.7749 N"
            subtext="DIRECT PRINCIPAL INBOX"
            rotate="slight-right"
            variant="cream"
          />
        </div>

        {/* Clean 5/7 Studio Dispatch Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left 5 Cols: Direct Coordinates Ledger */}
          <div className="lg:col-span-5 space-y-6 p-7 sm:p-8 xl:p-10 rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2]">
            <div className="flex items-center justify-between border-b border-[#1E5A54]/15 pb-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5A54] decoration-[#F7623D] block">
                  COORDINATES // 01
                </span>
                <h3 className="font-headline text-2xl sm:text-3xl font-bold uppercase text-[#1E5A54] leading-tight mt-0.5">
                  Direct Studio Channels
                </h3>
              </div>
              <HandArrow direction="right" className="hidden sm:block w-12 h-5" />
            </div>

            <div className="divide-y divide-[#1E5A54]/15">
              <div className="py-4 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-full border border-[#1E5A54] bg-[#EEE6E2] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <Mail className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54] block">
                    Direct Engineering Inbox
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm font-bold text-[#1E5A54] hover:text-[#F7623D] transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="py-4 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-full border border-[#1E5A54] bg-[#EEE6E2] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <Phone className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54] block">
                    Studio Telephone
                  </span>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-sm font-bold text-[#1E5A54] hover:text-[#F7623D] transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="py-4 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-full border border-[#1E5A54] bg-[#EEE6E2] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <MapPin className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54] block">
                    San Francisco Studio
                  </span>
                  <span className="text-sm font-medium text-[#1E5A54] leading-relaxed">
                    {siteConfig.contact.address}
                  </span>
                </div>
              </div>

              <div className="py-4 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-full border border-[#1E5A54] bg-[#EEE6E2] flex items-center justify-center text-[#1E5A54] shrink-0">
                  <Clock className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E5A54] block">
                    Operating Window
                  </span>
                  <span className="text-sm font-medium text-[#1E5A54]">
                    Mon - Fri: 8:00 AM - 6:00 PM PST
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] space-y-1.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#F7623D] stroke-[1.75]" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#1E5A54]">
                  24-Hour Principal Turnaround
                </span>
              </div>
              <p className="text-xs text-[#1E5A54] leading-relaxed font-sans">
                Every technical inquiry is reviewed directly by a partner architect within one
                business day.
              </p>
            </div>
          </div>

          {/* Right 7 Cols: Dispatch Form Card */}
          <div className="lg:col-span-7 p-7 sm:p-9 rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2]">
            <div className="mb-6 border-b border-[#1E5A54]/15 pb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5A54] decoration-[#F7623D] block">
                  DISPATCH FORM // 02
                </span>
                <h3 className="font-headline text-2xl sm:text-3xl font-bold uppercase text-[#1E5A54] leading-tight mt-0.5">
                  Send a Project Brief
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E2D7D1] font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E5A54]">
                DIRECT TO ENGINEERING
              </span>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
