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
    <div className="space-y-16 pb-20">
      <PageHeader
        badge="Connect"
        title="Start a Technical Conversation"
        description="Have a question about our engineering stack, custom scope, or availability? Our senior team reviews and responds to all inquiries within 24 hours."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-6">
              <h3 className="text-xl font-bold text-white">Direct Contacts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with our solutions architecture desk. We sign standard mutual NDAs
                prior to technical discovery upon request.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-blue-400 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      General & Inquiries
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
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Client Partnerships
                    </span>
                    <a
                      href={`mailto:${siteConfig.contact.salesEmail}`}
                      className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                    >
                      {siteConfig.contact.salesEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-indigo-400 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Telephone
                    </span>
                    <span className="text-sm font-medium text-white">
                      {siteConfig.contact.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Office Address
                    </span>
                    <span className="text-xs text-slate-300 leading-relaxed block">
                      {siteConfig.contact.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-emerald-400 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Active Hours
                    </span>
                    <span className="text-xs text-slate-300">{siteConfig.contact.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Confidentiality Guaranteed</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All client discussions and architectural diagrams are treated under strict
                confidentiality. We are happy to countersign your mutual NDA.
              </p>
            </div>
          </div>

          {/* Contact Form Container */}
          <div className="lg:col-span-7 p-8 md:p-10 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Submit an Inquiry</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Provide as much context as possible. An engineering lead will follow up with you
                promptly.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

