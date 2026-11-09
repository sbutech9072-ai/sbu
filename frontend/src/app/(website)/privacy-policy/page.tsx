import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { siteConfig } from '@/config/site';
import { StudioStamp } from '@/components/human/hand-crafted-svg';

export const metadata: Metadata = {
  title: 'Privacy Policy & Terms of Service',
  description:
    'Our privacy commitments, client data protection policies, and intellectual property terms at Sbu Tech.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-12 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="Legal & Governance"
        title="Privacy Policy & Terms of Engagement"
        description="Plain-language terms on how Sbu Tech handles your company information, project briefs, and intellectual property."
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <div className="site-container-narrow">
        <div className="p-8 md:p-12 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-8 text-sm text-[#1E5A54] leading-relaxed">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E5A54]/20 pb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#1E5A54]">
              Document Ref // LEGAL-MSA-2026
            </span>
            <StudioStamp text="PLAIN LANGUAGE TERMS" rotate="slight-left" variant="teal" />
          </div>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              1. Information We Collect
            </h2>
            <p>
              When you send an inquiry or project scope request through {siteConfig.name}, we
              collect your contact details (full name, work email address, company name, and phone
              number) and project specifications. We use this information only to review your
              technical requirements and reply directly about a potential engagement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              2. Confidentiality & Non-Disclosure
            </h2>
            <p>
              We treat all client architectural blueprints, database schemas, business logic, and
              unreleased product plans under strict confidentiality. We never sell, rent, or share
              client data or submission details with third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              3. Intellectual Property Rights
            </h2>
            <p>
              Unless otherwise specified in a written Master Services Agreement (MSA), all custom
              source code, design tokens, infrastructure manifests, and documentation produced by{' '}
              {siteConfig.name} during paid client engagements transfer in full to the client upon
              payment of agreed milestone invoices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              4. Security & Data Protection
            </h2>
            <p>
              We use standard encryption protocols (TLS 1.3 in transit, AES-256 at rest) for all
              communications and staging environments. Access to client source code and cloud
              credentials is restricted through hardware multi-factor authentication and role-based
              access controls.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              5. Contact Information
            </h2>
            <p>
              For legal questions or to countersign a mutual non-disclosure agreement before project
              discovery, email our legal desk at{' '}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-[#1E5A54] decoration-[#F7623D] font-semibold underline"
              >
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </section>

          <div className="pt-6 border-t border-[#1E5A54]/20 text-xs font-mono text-[#1E5A54]">
            Last Updated: October 2026. Sbu Tech Digital Engineering Studio.
          </div>
        </div>
      </div>
    </div>
  );
}
