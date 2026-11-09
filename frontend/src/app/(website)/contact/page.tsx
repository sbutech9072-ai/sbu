import { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { ContactForm } from '@/features/contact/contact-form';
import { siteConfig } from '@/config/site';
import { StudioStamp, HandUnderline } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

export const metadata: Metadata = {
  title: 'Contact Our Engineering Team',
  description:
    'Get in touch with Sbu Tech for new project inquiries, technical partnerships, or architectural consultations.',
};

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="Connect"
        title="Talk Directly With an Engineering Lead"
        description="Have a question about our stack, scope, or current squad availability? A principal architect reads and answers every note within one business day."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <TiltCard className="p-8 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-headline text-2xl uppercase tracking-tight text-[#1E5A54]">
                  Direct Desk
                </h3>
                <StudioStamp
                  text="24H SLA RESPONSE"
                  rotate="slight-right"
                  variant="teal"
                />
              </div>
              <p className="text-xs text-[#1E5A54] leading-relaxed">
                Reach our solutions architecture desk directly. We countersign standard mutual NDAs
                before reviewing private repositories or system diagrams.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/30 flex items-center justify-center text-[#1E5A54] shrink-0">
                    <Mail className="h-4 w-4 text-[#F7623D]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] font-semibold text-[#1E5A54] block">
                      General & Inquiries
                    </span>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-sm font-semibold text-[#1E5A54] hover:text-[#F7623D] underline transition-colors"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/30 flex items-center justify-center text-[#1E5A54] shrink-0">
                    <Mail className="h-4 w-4 text-[#F7623D]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] font-semibold text-[#1E5A54] block">
                      Client Partnerships
                    </span>
                    <a
                      href={`mailto:${siteConfig.contact.salesEmail}`}
                      className="text-sm font-semibold text-[#1E5A54] hover:text-[#F7623D] underline transition-colors"
                    >
                      {siteConfig.contact.salesEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/30 flex items-center justify-center text-[#1E5A54] shrink-0">
                    <Phone className="h-4 w-4 text-[#1E5A54]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] font-semibold text-[#1E5A54] block">
                      Telephone
                    </span>
                    <span className="text-sm font-semibold text-[#1E5A54]">
                      {siteConfig.contact.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/30 flex items-center justify-center text-[#1E5A54] shrink-0">
                    <MapPin className="h-4 w-4 text-[#1E5A54]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] font-semibold text-[#1E5A54] block">
                      Studio Address
                    </span>
                    <span className="text-xs text-[#1E5A54] leading-relaxed block">
                      {siteConfig.contact.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/30 flex items-center justify-center text-[#1E5A54] shrink-0">
                    <Clock className="h-4 w-4 text-[#1E5A54]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] font-semibold text-[#1E5A54] block">
                      Active Hours
                    </span>
                    <span className="text-xs text-[#1E5A54]">
                      {siteConfig.contact.workingHours}
                    </span>
                  </div>
                </div>
              </div>
            </TiltCard>

            <div className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#E2D7D1] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.14em] text-[#1E5A54]">
                <ShieldCheck className="h-4 w-4 text-[#F7623D]" />
                <span>Strict NDA Protection</span>
              </div>
              <p className="text-xs text-[#1E5A54] leading-relaxed">
                Every inquiry, architecture diagram, and product roadmap you share is held in strict
                confidence.
              </p>
            </div>
          </div>

          {/* Contact Form Container */}
          <div className="lg:col-span-7 p-8 md:p-10 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-6">
            <div className="space-y-1">
              <h3 className="font-headline text-3xl uppercase tracking-tight text-[#1E5A54]">
                Send Us a{' '}
                <span className="relative inline-block">
                  Note
                  <HandUnderline className="mt-0.5" />
                </span>
              </h3>
              <p className="text-xs text-[#1E5A54] leading-relaxed">
                Share a bit of context on what you are building. No sales sequence, just a direct
                reply from an engineer.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
