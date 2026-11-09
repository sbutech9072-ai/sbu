import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Users,
  Target,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { teamData } from '@/data/team';
import { TeamCard } from '@/features/team/team-card';
import { ArchitectureNodeOrb } from '@/components/human/architecture-node-orb';
import { HandUnderline, HandArrow, StudioStamp } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Sbu Tech, our software engineering philosophy, veteran team, and commitment to building durable digital products.',
};

export default function AboutPage() {
  const leadership = teamData.filter((t) => t.isLeadership);

  const milestones = [
    {
      year: '2021',
      title: 'Studio Founded in San Francisco',
      description:
        'Former principal engineers started Sbu Tech to give fast-growing product companies direct access to senior systems architecture.',
    },
    {
      year: '2022',
      title: 'Cloud & Distributed Systems Practice',
      description:
        'Added dedicated infrastructure squads focused on Kubernetes orchestration, multi-region AWS topology, and SOC 2 compliance.',
    },
    {
      year: '2023',
      title: '100+ Enterprise Milestone',
      description:
        'Passed 100 production releases across fintech, healthcare, and industrial telemetry with a 99.4% client retention rate.',
    },
    {
      year: '2024',
      title: 'Enterprise AI & Retrieval Lab',
      description:
        'Opened our applied AI practice to build private, deterministic retrieval pipelines and custom model evaluation harnesses.',
    },
  ];

  const coreValues = [
    {
      icon: <Zap className="h-5 w-5 text-[#1E5A54]" />,
      title: 'Strict Engineering Discipline',
      desc: 'We do not ship brittle prototypes. We enforce strict types, automated integration tests, and clean schemas that last.',
    },
    {
      icon: <Users className="h-5 w-5 text-[#1E5A54]" />,
      title: 'Direct Principal Access',
      desc: 'You talk directly to the engineers writing your code and designing your database. No account managers sit in the middle.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#1E5A54]" />,
      title: 'Zero Vendor Lock-In',
      desc: 'Every repository, Terraform module, and runbook belongs to your company from day one, written so your internal team can own it.',
    },
    {
      icon: <Target className="h-5 w-5 text-[#1E5A54]" />,
      title: 'Hard Production Metrics',
      desc: 'We measure our work by p99 latency drops, lower cloud bills, faster checkout flows, and zero-downtime releases.',
    },
  ];

  return (
    <div className="space-y-24 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge="About Sbu Tech"
        title="Senior Product Engineering Without the Agency Theater"
        description="We are an independent software studio in San Francisco. We pair clear interface craft with battle-tested backend systems."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* Studio Story & Interactive Compact Orb */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <StudioStamp
                text="STUDIO DOSSIER // SF-01"
                subtext="FOUNDED 2021"
                rotate="slight-left"
                variant="teal"
              />
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#1E5A54]">
                How We Work
              </span>
            </div>

            <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54] leading-[0.95]">
              Why Choose Between Pretty Mockups and{' '}
              <span className="relative inline-block">
                Solid Systems?
                <HandUnderline className="mt-1" />
              </span>
            </h2>

            <p className="text-[#1E5A54] leading-relaxed text-base max-w-2xl">
              Most teams hiring an external partner face a bad trade-off. Design shops hand over
              fragile frontends that buckle under real traffic, while big consultancies bill for
              months of slide decks before writing a single line of production code.
            </p>
            <p className="text-[#1E5A54] leading-relaxed text-base max-w-2xl">
              We started Sbu Tech to do the opposite. Our squads are small, senior, and hands-on.
              We ship working software to staging in week one, wire up observability before launch,
              and leave your codebase cleaner than we found it.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-[#1E5A54]/20">
              <div>
                <span className="font-headline text-3xl md:text-4xl text-[#1E5A54] block">100%</span>
                <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#1E5A54]">
                  In-House Senior Engineers
                </span>
              </div>
              <div>
                <span className="font-headline text-3xl md:text-4xl text-[#1E5A54] block">45+</span>
                <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#1E5A54]">
                  Enterprise Clients Served
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="font-headline text-3xl md:text-4xl text-[#1E5A54] decoration-[#F7623D] block">99.98%</span>
                <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#1E5A54]">
                  Production Uptime SLA
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <ArchitectureNodeOrb variant="compact" />

            <TiltCard className="p-7 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-xl uppercase tracking-tight text-[#1E5A54] flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-[#F7623D]" />
                  <span>Written Guarantees</span>
                </h3>
                <StudioStamp text="MSA STANDARD" rotate="right" variant="cream" />
              </div>

              <ul className="space-y-3 text-sm text-[#1E5A54]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] shrink-0 mt-2" />
                  <span>
                    <strong className="text-[#1E5A54]">Full IP Ownership:</strong> You own every git
                    repository, Figma token, and Terraform state file upon payment.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] shrink-0 mt-2" />
                  <span>
                    <strong className="text-[#1E5A54]">CI/CD From Day One:</strong> Automated preview
                    environments and test suites run on every pull request.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D] shrink-0 mt-2" />
                  <span>
                    <strong className="text-[#1E5A54]">Clean Handover:</strong> Full architecture
                    decision records (ADRs) and paired onboarding for your staff.
                  </span>
                </li>
              </ul>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Core Values (Asymmetric 5/7 Ledger) */}
      <section className="site-container space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1E5A54]/20 pb-8">
          <SectionHeading
            align="left"
            badge="Operating Tenets"
            title="How We Write Code and Run Projects"
            subtitle="Four non-negotiable rules that govern our engineering reviews, architecture choices, and client communication."
          />
          <StudioStamp
            text="ZERO JUNIOR HANDOFFS"
            subtext="PRINCIPAL LED"
            rotate="slight-right"
            variant="orange"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {coreValues.map((v, idx) => {
            const spanClass =
              idx === 0 || idx === 3 ? 'md:col-span-7' : 'md:col-span-5';
            const surfaceClass =
              idx % 2 === 0 ? 'bg-[#F8F4F2]' : 'bg-[#E2D7D1]';

            return (
              <TiltCard
                key={idx}
                className={`${spanClass} ${surfaceClass} p-8 rounded-3xl border border-[#1E5A54]/25 flex flex-col justify-between space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-full bg-[#EEE6E2] border border-[#1E5A54]/30 flex items-center justify-center">
                    {v.icon}
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#1E5A54]">
                    RULE 0{idx + 1}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline text-2xl uppercase tracking-tight text-[#1E5A54]">
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#1E5A54] leading-relaxed">{v.desc}</p>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="site-container space-y-12">
        <SectionHeading
          badge="Studio Logbook"
          title="Four Years of Shipping Under Pressure"
          subtitle="How Sbu Tech grew from a three-person systems practice into an international product engineering studio."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-3 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-headline text-4xl text-[#1E5A54] decoration-[#F7623D]">
                    {m.year}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#1E5A54] px-2.5 py-0.5 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2]">
                    CH. 0{idx + 1}
                  </span>
                </div>
                <h3 className="font-headline text-xl uppercase tracking-tight text-[#1E5A54]">
                  {m.title}
                </h3>
              </div>
              <p className="text-xs text-[#1E5A54] leading-relaxed pt-2 border-t border-[#1E5A54]/15">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="site-container space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            badge="Leadership"
            title="Founders & Practice Directors"
            subtitle="Working architects who review pull requests, model schemas, and lead client engagements directly."
          />
          <Button asChild variant="outline" className="self-start md:self-auto gap-2 rounded-full">
            <Link href="/team">
              <span>Meet the Full Roster</span>
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
      <section className="site-container">
        <div className="p-10 md:p-14 rounded-3xl border border-[#1E5A54]/25 bg-[#E2D7D1] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <StudioStamp
              text="Q1 / Q2 AVAILABILITY"
              rotate="slight-left"
              variant="teal"
            />
            <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
              Have a Hard System to Build?
            </h2>
            <p className="text-sm text-[#1E5A54] leading-relaxed">
              We take on a limited number of builds each quarter so our principals stay hands-on.
              Send us your brief and we will reply with a straight technical assessment.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <HandArrow direction="down" className="hidden md:block" />
            <Button asChild size="lg" className="rounded-full">
              <Link href="/get-a-quote" className="gap-2">
                <span>Book an Architecture Review</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
