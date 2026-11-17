import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy & Terms of Service',
  description:
    'Our privacy commitments, user data protection policies, and telemetry governance at Sbu Tech.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-12 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="Legal & Governance"
        title="Privacy Policy & Terms of Engagement"
        description="Plain-language terms on how Sbu Tech handles your account data, telemetry, and client privacy."
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <div className="site-container-narrow">
        <div className="p-8 md:p-12 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-8 text-sm text-[#1E5A54] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-headline text-2xl font-bold text-[#1E5A54]">
              1. Information We Collect
            </h2>
            <p>
              When you interact with {siteConfig.name}, we collect minimal, purposeful information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Client Inquiries:</strong> Contact information provided in contact forms (name, work email, phone, and message contents) solely to respond to project requirements.
              </li>
              <li>
                <strong>Authenticated Accounts:</strong> When you register or sign in with email/password or Continue with Google, we store your full name, email address (Gmail), country of incorporation/residence, optional WhatsApp phone number, and profile picture (for Google OAuth users).
              </li>
              <li>
                <strong>Authentication & Activity Telemetry:</strong> Accurate login/logout timestamps, authentication session IDs, and approximate active engagement time measured while the site tab is in active use.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              2. Privacy-First Edge Telemetry & No IP Storage
            </h2>
            <p>
              We believe in respectful digital engineering. <strong>We do NOT store IP addresses or raw User-Agent strings.</strong>
            </p>
            <p>
              Geographic country indicators are determined transiently at the Cloudflare edge from network metadata without persisting your IP. Device categories are generalized into coarse groups (desktop or mobile) rather than tracking hardware fingerprints.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              3. Purpose & Data Use
            </h2>
            <p>
              We use stored user and telemetry information strictly for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Authenticating client portal access to private staging links, sprints, and invoices.</li>
              <li>Providing direct engineering partner support via email or WhatsApp.</li>
              <li>Detecting abusive bot activity and safeguarding system availability.</li>
              <li>Understanding aggregated studio traffic to improve platform performance.</li>
            </ul>
            <p>
              We never sell, rent, license, or monetize your data with third parties or data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              4. Data Retention & Deletion Rights
            </h2>
            <p>
              Active session heartbeats are retained for a rolling period of 90 days. Authentication security logs are maintained for up to 1 year for access audit trail verification.
            </p>
            <p>
              You have the right to request full deletion of your user account and all associated telemetry at any time. To request account deletion, simply contact our engineering governance team at{' '}
              <a
                href="mailto:contact@sbutech.com"
                className="text-[#1E5A54] font-semibold underline hover:text-[#F7623D] transition-colors"
              >
                contact@sbutech.com
              </a>
              . All data will be purged within 5 business days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              5. Security & Encryption Standards
            </h2>
            <p>
              All communications are encrypted using TLS 1.3 in transit and AES-256 encryption at rest through Supabase and Cloudflare enterprise security infrastructure. Database access is guarded with strict Row Level Security (RLS) and cryptographic tokens.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline text-2xl uppercase text-[#1E5A54]">
              6. Governance Contact
            </h2>
            <p>
              For privacy inquiries, audit questions, or mutual non-disclosure agreements, contact:
            </p>
            <p className="font-mono text-xs">
              Sbu Tech Engineering & Legal Governance<br />
              Email:{' '}
              <a
                href="mailto:contact@sbutech.com"
                className="text-[#1E5A54] font-semibold underline hover:text-[#F7623D]"
              >
                contact@sbutech.com
              </a>
            </p>
          </section>

          <div className="pt-6 border-t border-[#1E5A54]/20 text-xs font-mono text-[#1E5A54]/80">
            Last Updated: November 2026. Sbu Tech Digital Engineering Studio.
          </div>
        </div>
      </div>
    </div>
  );
}
