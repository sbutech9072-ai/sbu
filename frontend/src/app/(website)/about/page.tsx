import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Award,
  Users,
  Target,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { teamData } from '@/data/team';
import { TeamCard } from '@/features/team/team-card';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Sbu Tech, our software engineering philosophy, veteran team, and commitment to building resilient digital products.',
};

export default function AboutPage() {
  const leadership = teamData.filter((t) => t.isLeadership);

  const milestones = [
    {
      year: '2021',
      title: 'Studio Founded in San Francisco',
      description:
        'Sbu Tech was established by former engineering leads to provide dedicated, senior-level software architecture to rapid-growth tech companies.',
    },
    {
      year: '2022',
      title: 'Cloud & Distributed Systems Practice',
      description:
        'Expanded our core capabilities to include automated Kubernetes orchestration, multi-region AWS architectures, and SOC 2 compliance readiness.',
    },
    {
      year: '2023',
      title: '100+ Enterprise Milestone',
      description:
        'Surpassed 100 successful production deployments across fintech, healthcare, and enterprise telemetry industries with 99.4% client satisfaction.',
    },
    {
      year: '2024',
      title: 'Enterprise AI & Copilot Lab',
      description:
        'Launched dedicated enterprise AI practice focusing on private, high-accuracy RAG architectures and secure custom LLM integrations.',
    },
  ];

  const coreValues = [
    {
      icon: <Zap className="h-5 w-5 text-[#1E5A54]" />,
      title: 'Radical Engineering Quality',
      desc: 'We do not take shortcuts. We prioritize strict types, comprehensive automated testing, and architectures that endure long after launch.',
    },
    {
      icon: <Users className="h-5 w-5 text-[#1E5A54]" />,
      title: 'Direct Senior Access',
      desc: 'Our clients interface directly with principal engineers and architects—no account managers diluting technical precision.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#1E5A54]" />,
      title: 'Zero Intellectual Lock-In',
      desc: 'Every repository, cloud manifest, and asset belongs fully to you with clear documentation for your internal teams.',
    },
    {
      icon: <Target className="h-5 w-5 text-[#1E5A54]" />,
      title: 'Measurable Business Alignment',
      desc: 'Engineering is only successful when it drives tangible metrics—conversion rates, lower infrastructure bills, or reduced latency.',
    },
  ];

  return (
    <div className="space-y-20 pb-20 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="About Sbu Tech"
        title="Engineering Precision for High-Stakes Digital Products"
        description="We are a focused digital product studio built on the belief that modern software should be blazing-fast, architecturally resilient, and a joy to use."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* Mission & Background */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#1E5A54]" />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#1E5A54]">
                Our Purpose
              </span>
            </div>
            <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54] leading-[0.95]">
              Bridging the Gulf Between Beautiful Interfaces and Bulletproof Cloud Backends
            </h2>
            <p className="text-[#1E5A54]/80 leading-relaxed text-sm">
              Too often, companies are forced to choose between design agencies with flimsy codebases
              or legacy IT consultancies that move at glacial speeds. Sbu Tech was formed to bridge
              this divide.
            </p>
            <p className="text-[#1E5A54]/80 leading-relaxed text-sm">
              We assemble agile squads of veteran engineers, UX researchers, and cloud architects who
              build production systems meant to withstand sudden surges in traffic, complex compliance
              audits, and rapid feature iteration.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#1E5A54]/18">
              <div>
                <span className="font-headline text-3xl md:text-4xl text-[#1E5A54] block">100%</span>
                <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#1E5A54]/70">In-House Senior Engineers</span>
              </div>
              <div>
                <span className="font-headline text-3xl md:text-4xl text-[#1E5A54] block">45+</span>
                <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#1E5A54]/70">Enterprise Clients Served</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] space-y-6">
            <h3 className="font-headline text-xl md:text-2xl uppercase tracking-tight text-[#1E5A54] flex items-center gap-2">
              <Rocket className="h-5 w-5 text-[#1E5A54]" />
              <span>What We Guarantee on Every Project</span>
            </h3>
            <ul className="space-y-4 text-sm text-[#1E5A54]/80">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] shrink-0 mt-2" />
                <span>
                  <strong className="text-[#1E5A54]">Full Intellectual Property Ownership:</strong> You retain complete
                  ownership of git repositories, design systems, and cloud manifests.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] shrink-0 mt-2" />
                <span>
                  <strong className="text-[#1E5A54]">Automated CI/CD Delivery:</strong> Staging builds updated on every commit
                  with automated preview environments.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] shrink-0 mt-2" />
                <span>
                  <strong className="text-[#1E5A54]">Clean Type-Safe Architecture:</strong> Modern Next.js, TypeScript, and
                  decoupled services ready for handover.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 max-w-7xl space-y-12">
        <SectionHeading
          badge="Guiding Principles"
          title="The Values That Guide Our Code and Client Partnerships"
          subtitle="Clear tenets that define how we make architectural decisions, solve hard problems, and communicate with stakeholders."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((v, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] space-y-3"
            >
              <div className="h-10 w-10 rounded-full border border-[#1E5A54]/30 flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="font-headline text-lg uppercase tracking-tight text-[#1E5A54]">{v.title}</h3>
              <p className="text-xs text-[#1E5A54]/80 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="container mx-auto px-4 max-w-7xl space-y-12">
        <SectionHeading
          badge="Our Journey"
          title="Milestones in Our Evolution"
          subtitle="A brief history of how Sbu Tech grew from a boutique consultancy into an international product engineering studio."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#EEE6E2] space-y-3 relative"
            >
              <span className="font-headline text-3xl text-[#1E5A54]/30">
                {m.year}
              </span>
              <h3 className="font-headline text-lg uppercase tracking-tight text-[#1E5A54]">{m.title}</h3>
              <p className="text-xs text-[#1E5A54]/80 leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="container mx-auto px-4 max-w-7xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Leadership"
            title="Meet Our Founders & Directors"
            subtitle="Experienced technology leaders who set the standard for quality across all client engagements."
          />
          <Button asChild variant="outline" className="self-start md:self-auto gap-2">
            <Link href="/team">
              <span>View All Team Members</span>
              <span className="w-5 h-5 rounded-full bg-[#F7623D] flex items-center justify-center text-white shrink-0">
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 max-w-5xl text-center space-y-6 pt-10">
        <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
          Interested in Partnering with Sbu Tech?
        </h2>
        <p className="text-sm text-[#1E5A54]/80 max-w-xl mx-auto">
          We are currently taking on select client projects for the upcoming quarters. Let’s discuss
          your technical goals.
        </p>
        <Button asChild size="lg">
          <Link href="/get-a-quote" className="gap-2">
            <span>Request an Architecture Consultation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
