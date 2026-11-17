import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Users,
  Target,
  ArrowRight,
  Code2,
  Database,
  Cloud,
  Cpu,
  Layers,
  Lightbulb,
  GitBranch,
  Lock,
  CheckCircle2,
  Server,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'About Us | Sbu Tech',
  description:
    'Discover SBU TECH: our founding leadership, story, mission, core values, engineering capabilities, and development methodology.',
};

export default function AboutPage() {
  const coreValues = [
    {
      icon: <Zap className="h-5 w-5 text-[#F7623D]" />,
      title: 'Quality first',
      desc: 'We enforce strict typing, automated testing, and clean architecture so software remains fast, secure, and maintainable over time.',
    },
    {
      icon: <EyeIcon className="h-5 w-5 text-[#F7623D]" />,
      title: 'Transparency',
      desc: 'We operate with complete openness: shared repositories, clear sprint tracking, direct communication, and honest technical guidance.',
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-[#F7623D]" />,
      title: 'Practical innovation',
      desc: 'We thoughtfully adopt proven modern technologies, cloud-native patterns, and applied AI systems where they solve real operational problems.',
    },
    {
      icon: <Users className="h-5 w-5 text-[#F7623D]" />,
      title: 'Client partnership',
      desc: 'We collaborate as an embedded engineering ally rather than a detached vendor, aligning our technical work with your milestones.',
    },
    {
      icon: <Target className="h-5 w-5 text-[#F7623D]" />,
      title: 'Accountability',
      desc: 'We take full responsibility for technical outcomes, code quality, deadline integrity, and the long-term health of every system we ship.',
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-[#F7623D]" />,
      title: 'Continuous improvement',
      desc: 'We review telemetry, benchmark latency, refine developer workflows, and iterate across every sprint.',
    },
  ];

  const strengths = [
    {
      title: 'Senior-led engineering',
      desc: 'You work directly with founding principals and senior engineers who design schemas, review pull requests, and make architectural decisions.',
    },
    {
      title: 'Scalable architecture',
      desc: 'Every system is built from day one to handle high concurrency, data growth, and complex transactional workloads without degrading.',
    },
    {
      title: 'Direct communication',
      desc: 'No account manager layers. You have direct access via shared collaboration channels and weekly demo cycles.',
    },
    {
      title: 'Security by default',
      desc: 'Role-based access control, encrypted secrets management, automated dependency vulnerability scans, and strict data protocols built in.',
    },
    {
      title: 'Predictable delivery',
      desc: 'Structured two-week sprint cadences, type-safe pull requests, and automated staging environments keep execution on schedule.',
    },
    {
      title: 'Long-term ownership',
      desc: 'Complete documentation, test suites, and clear operational runbooks so your internal team can scale with confidence.',
    },
  ];

  const stages = [
    {
      step: '01',
      title: 'Discovery & planning',
      desc: 'We assess your product requirements, user journeys, and technical constraints to establish a clear scope and milestone roadmap.',
      deliverables: ['Product scope & specs', 'User journey mapping', 'Sprint roadmap'],
    },
    {
      step: '02',
      title: 'Strategy & architecture',
      desc: 'We design the system topology, data models, API specifications, and cloud infrastructure layout before building features.',
      deliverables: ['Architecture blueprint', 'Database schemas', 'API specifications'],
    },
    {
      step: '03',
      title: 'UI/UX & interface design',
      desc: 'We craft accessible, responsive interfaces and component systems tailored to your product requirements.',
      deliverables: ['Interactive prototypes', 'Design token system', 'Accessible components'],
    },
    {
      step: '04',
      title: 'Full-stack engineering',
      desc: 'Senior engineers build frontend interfaces, backend services, and CI/CD pipelines across focused two-week sprints.',
      deliverables: ['Type-safe codebase', 'Automated test suites', 'Staging environments'],
    },
    {
      step: '05',
      title: 'Launch & ongoing support',
      desc: 'We execute production cutover with monitoring dashboards, team onboarding, and long-term maintenance.',
      deliverables: ['Production deployment', 'Monitoring dashboards', 'Operations runbooks'],
    },
  ];

  const techCategories = [
    {
      icon: <Code2 className="h-5 w-5 text-[#F7623D]" />,
      name: 'Frontend & Mobile',
      summary: 'High-speed reactive user interfaces and cross-platform mobile apps.',
      techs: ['Next.js (App Router)', 'React 18', 'TypeScript', 'Tailwind CSS', 'React Native'],
    },
    {
      icon: <Server className="h-5 w-5 text-[#F7623D]" />,
      name: 'Backend & APIs',
      summary: 'Low-latency APIs, microservices, and resilient event pipelines.',
      techs: ['Go (Golang)', 'Node.js', 'Python (FastAPI)', 'GraphQL', 'RESTful APIs'],
    },
    {
      icon: <Database className="h-5 w-5 text-[#F7623D]" />,
      name: 'Databases & Data',
      summary: 'High-integrity relational storage, caching, and vector indexing.',
      techs: ['PostgreSQL', 'Supabase', 'Redis', 'Apache Kafka', 'Vector Databases'],
    },
    {
      icon: <Cpu className="h-5 w-5 text-[#F7623D]" />,
      name: 'AI & Machine Learning',
      summary: 'Private RAG architectures, custom LLM integrations, and agentic systems.',
      techs: ['RAG Pipelines', 'Embeddings & Hybrid Search', 'OpenAI & Claude APIs', 'Private VPC LLMs', 'AI Evals'],
    },
    {
      icon: <Lock className="h-5 w-5 text-[#F7623D]" />,
      name: 'Security & Compliance',
      summary: 'Enterprise access control, identity encryption, and regulatory readiness.',
      techs: ['OAuth 2.0 & OIDC', 'RBAC & RLS', 'SOC 2 & HIPAA Ready', 'SAST / DAST Scans', 'TLS & KMS'],
    },
    {
      icon: <Cloud className="h-5 w-5 text-[#F7623D]" />,
      name: 'Cloud & DevOps',
      summary: 'Declarative infrastructure, automated pipelines, and telemetry.',
      techs: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus & Grafana'],
    },
  ];

  return (
    <div className="space-y-20 md:space-y-24 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        title="We engineer production systems that power modern businesses"
        description="SBU TECH is a senior software engineering studio pairing robust systems architecture with refined interface craft. We work directly with growing businesses and enterprises to design, build, and scale durable technology platforms."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* Story Section */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#1E5A54] leading-tight">
              Our story &amp; engineering philosophy
            </h2>

            <div className="space-y-4 text-sm md:text-base text-[#1E5A54]/85 leading-relaxed font-sans">
              <p>
                SBU TECH was founded on a straightforward observation: growing businesses and
                enterprises often struggle with the typical agency model. Too often, projects suffer
                from management overhead, disconnected design phases, and junior handoffs that
                create brittle architectures and technical debt.
              </p>
              <p>
                We built SBU TECH to offer a better alternative: a senior-led engineering studio
                where clients work directly with the architects designing the schema and writing
                production code.
              </p>
              <p>
                Our approach unites rigorous backend discipline with fast frontend interfaces.
                Whether architecting cloud infrastructure, building high-concurrency web platforms,
                or integrating private AI capabilities, we prioritize durability, speed, clean code,
                and full client IP ownership.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-medium text-[#1E5A54]">
              <span className="px-3 py-1.5 rounded-md border border-[#1E5A54]/20 bg-[#F8F4F2]">
                100% client IP ownership
              </span>
              <span className="px-3 py-1.5 rounded-md border border-[#1E5A54]/20 bg-[#F8F4F2]">
                Senior engineers only
              </span>
              <span className="px-3 py-1.5 rounded-md border border-[#1E5A54]/20 bg-[#F8F4F2]">
                Type-safe production code
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-6">
              <blockquote className="font-headline text-xl md:text-2xl font-bold tracking-tight text-[#1E5A54] leading-snug">
                &ldquo;We treat software engineering as an exacting craft. Every architecture
                decision is made for longevity, clarity, and measurable business impact.&rdquo;
              </blockquote>

              <div className="space-y-3 pt-4 border-t border-[#1E5A54]/12 text-sm text-[#1E5A54]/85">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#F7623D] shrink-0" />
                  <span>Direct architectural collaboration with founders</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#F7623D] shrink-0" />
                  <span>Strict TypeScript schemas and reproducible infra</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#F7623D] shrink-0" />
                  <span>Tested performance, security, and scalability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="site-container space-y-10">
        <div className="max-w-2xl space-y-2.5">
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#1E5A54]">
            Mission &amp; vision
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            Clear technical purpose and a long-term roadmap define how we build software for our
            partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-4">
            <div className="h-11 w-11 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center text-[#F7623D]">
              <Target className="h-5 w-5 stroke-[1.75]" />
            </div>
            <h3 className="font-headline text-2xl font-bold text-[#1E5A54]">
              Our mission
            </h3>
            <p className="text-sm md:text-base text-[#1E5A54]/85 leading-relaxed font-sans">
              To design, build, and maintain mission-critical software systems that empower
              organizations to operate efficiently, scale reliably, and innovate continuously—free
              from unnecessary complexity, with clear architectural ownership.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-4">
            <div className="h-11 w-11 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center text-[#F7623D]">
              <GitBranch className="h-5 w-5 stroke-[1.75]" />
            </div>
            <h3 className="font-headline text-2xl font-bold text-[#1E5A54]">
              Our vision
            </h3>
            <p className="text-sm md:text-base text-[#1E5A54]/85 leading-relaxed font-sans">
              To be the engineering studio trusted by founders, scaling startups, and enterprises to
              construct their most important digital products—defined by uncompromising craft, genuine
              collaboration, and zero vendor lock-in.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="site-container space-y-10">
        <div className="max-w-2xl space-y-2.5">
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#1E5A54]">
            Core values
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            Six commitments that govern how our engineers write code, communicate, and deliver
            systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-6 md:p-7 rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2] space-y-3"
            >
              <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center">
                {val.icon}
              </div>
              <h3 className="font-headline text-xl font-bold text-[#1E5A54]">
                {val.title}
              </h3>
              <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose SBU TECH */}
      <section className="site-container">
        <div className="p-8 md:p-12 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-10">
          <div className="space-y-2.5 border-b border-[#1E5A54]/12 pb-6">
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#1E5A54]">
              Why choose SBU TECH
            </h2>
            <p className="text-sm md:text-base text-[#1E5A54]/80 max-w-xl font-sans">
              We combine architectural rigor with focused sprint delivery so your product ships cleanly
              and scales smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {strengths.map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="font-headline text-lg font-bold text-[#1E5A54]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Team */}
      <section className="site-container space-y-10">
        <div className="max-w-2xl space-y-2.5">
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#1E5A54]">
            Founding leadership
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            SBU TECH is guided by three founding partners who steer architectural vision, technology
            strategy, and client partnerships.
          </p>
        </div>

        {/* Main Owner */}
        <div className="p-8 md:p-10 rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center text-center">
              <div className="h-36 w-36 rounded-2xl border border-[#1E5A54]/25 bg-[#EEE6E2] flex items-center justify-center">
                <span className="font-headline text-4xl font-bold text-[#1E5A54]">
                  BSD
                </span>
              </div>
            </div>

            <div className="lg:col-span-9 space-y-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#1E5A54] text-[#EEE6E2] text-xs font-medium mb-2">
                  Main Owner
                </span>
                <h3 className="font-headline text-2xl sm:text-3xl font-bold text-[#1E5A54]">
                  Bidhan Shaha Dhrubo
                </h3>
                <p className="text-sm font-medium text-[#F7623D]">
                  Main Owner &amp; Founding Partner
                </p>
              </div>

              <p className="text-sm md:text-base text-[#1E5A54]/85 leading-relaxed font-sans max-w-2xl">
                Serving as the Main Owner of SBU TECH, Bidhan Shaha Dhrubo directs overall company
                strategy, engineering standards, and business governance. Overseeing core
                architectures and enterprise engagements, he ensures the studio maintains high
                engineering discipline across every initiative.
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-medium text-[#1E5A54]">
                <span className="px-3 py-1 rounded-md border border-[#1E5A54]/15 bg-[#EEE6E2]">
                  Executive leadership
                </span>
                <span className="px-3 py-1 rounded-md border border-[#1E5A54]/15 bg-[#EEE6E2]">
                  Systems architecture
                </span>
                <span className="px-3 py-1 rounded-md border border-[#1E5A54]/15 bg-[#EEE6E2]">
                  Strategic governance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Co-Owners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-7 md:p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center shrink-0">
                  <span className="font-headline text-xl font-bold text-[#1E5A54]">US</span>
                </div>
                <div>
                  <h4 className="font-headline text-xl font-bold text-[#1E5A54]">
                    Utsob Saha
                  </h4>
                  <p className="text-xs font-medium text-[#F7623D]">
                    Co-Owner &amp; Founding Partner
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#1E5A54]/85 leading-relaxed font-sans">
                As a Co-Owner and founding partner of SBU TECH, Utsob Saha collaborates closely on
                organizational planning, technical operations, and delivery frameworks—keeping quality,
                schedules, and platform stability consistent.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E5A54]/12 flex flex-wrap gap-2 text-xs font-medium text-[#1E5A54]">
              <span className="px-2.5 py-1 rounded-md border border-[#1E5A54]/15 bg-[#EEE6E2]">
                Engineering operations
              </span>
              <span className="px-2.5 py-1 rounded-md border border-[#1E5A54]/15 bg-[#EEE6E2]">
                Technology strategy
              </span>
            </div>
          </div>

          <div className="p-7 md:p-8 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center shrink-0">
                  <span className="font-headline text-xl font-bold text-[#1E5A54]">BS</span>
                </div>
                <div>
                  <h4 className="font-headline text-xl font-bold text-[#1E5A54]">
                    Borson Saha
                  </h4>
                  <p className="text-xs font-medium text-[#F7623D]">
                    Co-Owner &amp; Founding Partner
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#1E5A54]/85 leading-relaxed font-sans">
                As a Co-Owner and founding partner of SBU TECH, Borson Saha focuses on technical
                partnerships, product implementation architectures, and client alignment—translating
                complex requirements into practical engineering solutions.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E5A54]/12 flex flex-wrap gap-2 text-xs font-medium text-[#1E5A54]">
              <span className="px-2.5 py-1 rounded-md border border-[#1E5A54]/15 bg-[#EEE6E2]">
                Technical partnerships
              </span>
              <span className="px-2.5 py-1 rounded-md border border-[#1E5A54]/15 bg-[#EEE6E2]">
                Product architecture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Squads */}
      <section className="site-container space-y-10">
        <div className="max-w-2xl space-y-2.5">
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#1E5A54]">
            Our engineering team
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            Focused multidisciplinary squads collaborating across system design and implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2] space-y-3">
            <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center text-[#F7623D]">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="font-headline text-lg font-bold text-[#1E5A54]">
              Frontend squad
            </h3>
            <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
              Next.js, React, Tailwind CSS, TypeScript, and React Native mobile clients built for speed.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2] space-y-3">
            <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center text-[#F7623D]">
              <Server className="h-5 w-5" />
            </div>
            <h3 className="font-headline text-lg font-bold text-[#1E5A54]">
              Backend &amp; systems
            </h3>
            <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
              Go and Node.js services, low-latency relational databases, and resilient APIs.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2] space-y-3">
            <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center text-[#F7623D]">
              <Cloud className="h-5 w-5" />
            </div>
            <h3 className="font-headline text-lg font-bold text-[#1E5A54]">
              Cloud &amp; DevOps
            </h3>
            <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
              Terraform environments, Kubernetes clusters, and automated deployment workflows.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2] space-y-3">
            <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center text-[#F7623D]">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-headline text-lg font-bold text-[#1E5A54]">
              AI &amp; data
            </h3>
            <p className="text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
              Grounded retrieval pipelines, vector indexes, and automated evaluation suites.
            </p>
          </div>
        </div>
      </section>

      {/* Five-Stage Process */}
      <section className="site-container space-y-10">
        <div className="max-w-2xl space-y-2.5">
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#1E5A54]">
            How we work
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            Five stages that keep timelines predictable, checkpoints clear, and releases production-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stages.map((stg) => (
            <div
              key={stg.step}
              className="p-6 rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="font-headline text-2xl font-bold text-[#F7623D] tabular-nums block">
                  {stg.step}
                </span>
                <h3 className="font-headline text-lg font-bold text-[#1E5A54]">
                  {stg.title}
                </h3>
                <p className="text-xs text-[#1E5A54]/80 leading-relaxed font-sans">
                  {stg.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E5A54]/12 space-y-1.5">
                <span className="text-[11px] font-semibold text-[#1E5A54]/70 block">
                  Deliverables
                </span>
                {stg.deliverables.map((deliv, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-1.5 text-xs text-[#1E5A54]/85 font-sans">
                    <span className="text-[#F7623D] font-bold">&middot;</span>
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="site-container space-y-10">
        <div className="max-w-2xl space-y-2.5">
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-[#1E5A54]">
            Technology stack
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            Proven modern technologies chosen for type safety, concurrency, and long-term stability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((cat, idx) => (
            <div
              key={idx}
              className="p-6 md:p-7 rounded-2xl border border-[#1E5A54]/15 bg-[#F8F4F2] space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2] flex items-center justify-center">
                  {cat.icon}
                </div>
                <h3 className="font-headline text-lg font-bold text-[#1E5A54]">
                  {cat.name}
                </h3>
              </div>

              <p className="text-xs text-[#1E5A54]/80 font-sans leading-relaxed">
                {cat.summary}
              </p>

              <div className="pt-1 flex flex-wrap gap-1.5">
                {cat.techs.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-md border border-[#1E5A54]/15 bg-[#EEE6E2] text-xs font-medium text-[#1E5A54]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="site-container">
        <div className="p-8 sm:p-12 md:p-16 rounded-2xl bg-[#1E5A54] text-[#EEE6E2] text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#EEE6E2] leading-tight">
              Have a project in mind? Let&apos;s talk.
            </h2>

            <p className="text-sm md:text-base text-[#EEE6E2]/80 max-w-xl mx-auto font-sans leading-relaxed">
              Whether you are scoping a new product, re-architecting an existing platform, or
              deploying private AI systems, our engineering team is ready to help.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#F7623D] hover:bg-[#E05330] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <span>Book a consultation</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#EEE6E2]/30 hover:bg-[#EEE6E2]/10 text-[#EEE6E2] text-sm font-semibold inline-flex items-center justify-center transition-colors"
            >
              <span>Contact our team</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
