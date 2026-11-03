import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { QuoteForm } from '@/features/contact/quote-form';
import { ShieldCheck, Clock, CheckCircle2, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Request a Project Quote',
  description:
    'Receive a scoped engineering estimate and architectural proposal for your custom software or cloud project.',
};

export default function GetAQuotePage() {
  const processSteps = [
    {
      icon: <FileText className="h-5 w-5 text-[#1E5A54]" />,
      title: '1. Scope Review',
      desc: 'Our lead architects evaluate your feature list, technology constraints, and timeline.',
    },
    {
      icon: <Clock className="h-5 w-5 text-[#1E5A54]" />,
      title: '2. 30-Min Discovery Call',
      desc: 'We clarify technical unknowns, database models, and API integrations.',
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-[#1E5A54]" />,
      title: '3. Architectural Proposal',
      desc: 'You receive a detailed milestone breakdown, sprint schedule, and fixed-price or dedicated team budget.',
    },
  ];

  return (
    <div className="space-y-16 pb-20 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="Project Estimator"
        title="Request a Custom Project Estimate"
        description="Tell us about the digital platform, mobile app, or cloud infrastructure you are planning to build. We’ll deliver a detailed technical roadmap."
        breadcrumbs={[{ label: 'Get a Quote' }]}
      />

      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        {/* Next Steps Infographic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {processSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] space-y-2.5"
            >
              <div className="h-10 w-10 rounded-full border border-[#1E5A54]/30 flex items-center justify-center">
                {step.icon}
              </div>
              <h4 className="font-headline text-base uppercase tracking-tight text-[#1E5A54]">{step.title}</h4>
              <p className="text-xs text-[#1E5A54]/80 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* The Quote Form Card */}
        <div className="p-8 md:p-12 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] shadow-sm">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
