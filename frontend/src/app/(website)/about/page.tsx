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
      icon: <Zap className="h-6 w-6 text-amber-400" />,
      title: 'Radical Engineering Quality',
      desc: 'We do not take shortcuts. We prioritize strict types, comprehensive automated testing, and architectures that endure long after launch.',
    },
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: 'Direct Senior Access',
      desc: 'Our clients interface directly with principal engineers and architects—no account managers diluting technical precision.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
      title: 'Zero Intellectual Lock-In',
      desc: 'Every repository, cloud manifest, and asset belongs fully to you with clear documentation for your internal teams.',
    },
    {
      icon: <Target className="h-6 w-6 text-purple-400" />,
      title: 'Measurable Business Alignment',
      desc: 'Engineering is only successful when it drives tangible metrics—conversion rates, lower infrastructure bills, or reduced latency.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
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
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-blue-400">
              Our Purpose
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Bridging the Gulf Between Beautiful Interfaces and Bulletproof Cloud Backends
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Too often, companies are forced to choose between design agencies with flimsy codebases
              or legacy IT consultancies that move at glacial speeds. Sbu Tech was formed to bridge
              this divide.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              We assemble agile squads of veteran engineers, UX researchers, and cloud architects who
              build production systems meant to withstand sudden surges in traffic, complex compliance
              audits, and rapid feature iteration.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <span className="text-2xl font-bold text-white block">100%</span>
                <span className="text-xs text-slate-400">In-House Senior Engineers</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white block">45+</span>
                <span className="text-xs text-slate-400">Enterprise Clients Served</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-400" />
              <span>What We Guarantee on Every Project</span>
            </h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Full Intellectual Property Ownership:</strong> You retain complete
                  ownership of git repositories, design systems, and cloud manifests.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Automated CI/CD Delivery:</strong> Staging builds updated on every commit
                  with automated preview environments.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Clean Type-Safe Architecture:</strong> Modern Next.js, TypeScript, and
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
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-colors space-y-3"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="text-base font-bold text-white">{v.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
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
              className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 space-y-3 relative"
            >
              <span className="text-3xl font-extrabold font-mono text-blue-400/30">
                {m.year}
              </span>
              <h3 className="text-base font-bold text-white">{m.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
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
          <Button asChild variant="outline" className="self-start md:self-auto gap-1.5">
            <Link href="/team">
              <span>View All Team Members</span>
              <ArrowRight className="h-4 w-4" />
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
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Interested in Partnering with Sbu Tech?
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          We are currently taking on select client projects for the upcoming quarters. Let’s discuss
          your technical goals.
        </p>
        <Button asChild size="lg" className="rounded-xl px-8 shadow-xl shadow-blue-600/20">
          <Link href="/get-a-quote">Request an Architecture Consultation</Link>
        </Button>
      </section>
    </div>
  );
}

