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
      icon: <FileText className="h-5 w-5 text-blue-400" />,
      title: '1. Scope Review',
      desc: 'Our lead architects evaluate your feature list, technology constraints, and timeline.',
    },
    {
      icon: <Clock className="h-5 w-5 text-cyan-400" />,
      title: '2. 30-Min Discovery Call',
      desc: 'We clarify technical unknowns, database models, and API integrations.',
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
      title: '3. Architectural Proposal',
      desc: 'You receive a detailed milestone breakdown, sprint schedule, and fixed-price or dedicated team budget.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
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
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2.5"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center">
                {step.icon}
              </div>
              <h4 className="text-sm font-bold text-white">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* The Quote Form Card */}
        <div className="p-8 md:p-12 rounded-3xl border border-slate-800 bg-slate-900/40 shadow-xl">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}

