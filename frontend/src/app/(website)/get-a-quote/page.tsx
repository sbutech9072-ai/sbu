import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { QuoteForm } from '@/features/contact/quote-form';
import { Clock, CheckCircle2, FileText } from 'lucide-react';
import { StudioStamp, HandUnderline } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

export const metadata: Metadata = {
  title: 'Request a Project Quote',
  description:
    'Receive a scoped engineering estimate and architectural proposal for your custom software or cloud project.',
};

export default function GetAQuotePage() {
  const processSteps = [
    {
      icon: <FileText className="h-5 w-5 text-[#F7623D]" />,
      title: '01. Scope Review',
      desc: 'Our principal architects read your brief, check technical constraints, and flag any hidden risks.',
    },
    {
      icon: <Clock className="h-5 w-5 text-[#1E5A54]" />,
      title: '02. 30-Min Architecture Call',
      desc: 'We walk through data models, third-party integrations, and deployment targets together.',
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-[#F7623D]" />,
      title: '03. Written Proposal',
      desc: 'You get a clear milestone schedule, squad composition, and fixed-scope or retainer budget.',
    },
  ];

  return (
    <div className="space-y-16 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="Project Estimator"
        title="Scope Your Build With Our Architects"
        description="Tell us what you are building, what stack you run today, and when you need to ship. We will send back a clear engineering roadmap."
        breadcrumbs={[{ label: 'Get a Quote' }]}
      />

      <div className="site-container-narrow space-y-14">
        {/* Next Steps Infographic */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54]">
              How We Estimate{' '}
              <span className="relative inline-block">
                Projects
                <HandUnderline className="mt-0.5" />
              </span>
            </h2>
            <StudioStamp
              text="48-HOUR TURNAROUND"
              rotate="slight-left"
              variant="orange"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {processSteps.map((step, idx) => (
              <TiltCard
                key={idx}
                className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-3"
              >
                <div className="h-10 w-10 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/25 flex items-center justify-center">
                  {step.icon}
                </div>
                <h4 className="font-headline text-xl uppercase text-[#1E5A54]">{step.title}</h4>
                <p className="text-xs text-[#1E5A54] leading-relaxed">{step.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* The Quote Form Card */}
        <div className="p-8 md:p-12 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2]">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
