import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy & Terms of Service',
  description:
    'Our privacy commitments, client data protection policies, and intellectual property terms at Sbu Tech.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge="Legal & Governance"
        title="Privacy Policy & Terms of Engagement"
        description="Learn how Sbu Tech handles your company information, inquiry submissions, and intellectual property."
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="p-8 md:p-12 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-8 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              When you submit an inquiry or project scope request through {siteConfig.name}, we
              collect your contact details (full name, work email address, company name, and phone
              number) and project specifications. We use this information solely to assess
              architectural requirements and communicate directly with you regarding potential
              engagements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Confidentiality & Non-Disclosure</h2>
            <p>
              We treat all client architectural blueprints, database models, business logic, and
              unreleased product ideas under strict confidentiality standards. We never sell,
              rent, or monetize client data or submission details to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Intellectual Property Rights</h2>
            <p>
              Unless otherwise specified in a formal Master Services Agreement (MSA), all custom
              source code, design tokens, infrastructure manifests, and documentation produced by{' '}
              {siteConfig.name} during paid client engagements transfer fully to the client upon
              settlement of agreed milestone fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Security & Data Protection</h2>
            <p>
              We employ industry-standard encryption protocols (TLS 1.3 in transit, AES-256 at rest)
              for all communications and development environments. Access to client source code and
              infrastructure credentials is strictly controlled via multi-factor authentication and
              role-based access management.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Contact Information</h2>
            <p>
              For legal inquiries or to execute a customized mutual non-disclosure agreement prior to
              project discovery, please contact our legal desk at{' '}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-blue-400 underline">
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </section>

          <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
            Last Updated: October 2026. Sbu Tech Digital Engineering Studio.
          </div>
        </div>
      </div>
    </div>
  );
}

