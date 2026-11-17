import { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { ContactForm } from '@/features/contact/contact-form';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact Our Engineering Team',
  description:
    'Get in touch with Sbu Tech for new project inquiries, technical partnerships, or architectural consultations.',
};

export default function ContactPage() {
  return (
    <div className="space-y-14 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        title="Talk directly with an engineering lead"
        description="Have a question about our stack, scope, or current squad availability? A principal architect reads and answers every note within one business day."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-6">
              <div className="space-y-1.5">
                <h3 className="font-headline text-2xl font-bold text-[#1E5A54]">
                  Direct desk
                </h3>
                <p className="text-sm text-[#1E5A54]/80 leading-relaxed">
                  Reach our solutions architecture desk directly. We countersign standard mutual NDAs
                  before reviewing private repositories or system diagrams.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#1E5A54]/12">
                <div className="flex items-start gap-3 pt-2">
                  <div className="h-9 w-9 rounded-lg bg-[#EEE6E2] border border-[#1E5A54]/15 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-[#F7623D]" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#1E5A54]/65 block">
                      General &amp; inquiries
                    </span>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-sm font-semibold text-[#1E5A54] hover:text-[#F7623D] transition-colors"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#EEE6E2] border border-[#1E5A54]/15 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-[#F7623D]" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#1E5A54]/65 block">
                      Client partnerships
                    </span>
                    <a
                      href={`mailto:${siteConfig.contact.salesEmail}`}
                      className="text-sm font-semibold text-[#1E5A54] hover:text-[#F7623D] transition-colors"
                    >
                      {siteConfig.contact.salesEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#EEE6E2] border border-[#1E5A54]/15 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-[#1E5A54]" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#1E5A54]/65 block">
                      Telephone
                    </span>
                    <span className="text-sm font-semibold text-[#1E5A54]">
                      {siteConfig.contact.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#EEE6E2] border border-[#1E5A54]/15 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-[#1E5A54]" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#1E5A54]/65 block">
                      Office address
                    </span>
                    <span className="text-sm text-[#1E5A54]/85 leading-relaxed block">
                      {siteConfig.contact.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#EEE6E2] border border-[#1E5A54]/15 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-[#1E5A54]" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#1E5A54]/65 block">
                      Active hours
                    </span>
                    <span className="text-sm text-[#1E5A54]/85">
                      {siteConfig.contact.workingHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2]/70 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1E5A54]">
                <ShieldCheck className="h-4 w-4 text-[#F7623D]" />
                <span>NDA protection</span>
              </div>
              <p className="text-xs text-[#1E5A54]/80 leading-relaxed">
                Every inquiry, architecture diagram, and product roadmap you share is held in strict
                confidence.
              </p>
            </div>
          </div>

          {/* Contact Form Container */}
          <div className="lg:col-span-7 p-8 md:p-10 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-6">
            <div className="space-y-1">
              <h3 className="font-headline text-2xl font-bold text-[#1E5A54]">
                Send us a note
              </h3>
              <p className="text-sm text-[#1E5A54]/75 leading-relaxed">
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
