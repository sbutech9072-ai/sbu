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
  Sparkles,
  GitBranch,
  Lock,
  Workflow,
  Compass,
  CheckCircle2,
  Terminal,
  Activity,
  Server,
  Network,
  RefreshCw,
  FolderGit2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { HandUnderline, StudioStamp } from '@/components/human/hand-crafted-svg';
import { MagneticWrap } from '@/components/human/magnetic-button';

export const metadata: Metadata = {
  title: 'About Us | Sbu Tech',
  description:
    'Discover SBU TECH: our founding leadership, story, mission, core values, engineering capabilities, and development methodology.',
};

export default function AboutPage() {
  // Core Values (Required Section 04)
  const coreValues = [
    {
      icon: <Zap className="h-5 w-5 text-[#F7623D]" />,
      title: 'Quality First',
      desc: 'We enforce strict typing, comprehensive automated testing, and clean architecture so our software remains fast, secure, and maintainable over time.',
    },
    {
      icon: <EyeIcon className="h-5 w-5 text-[#F7623D]" />,
      title: 'Transparency',
      desc: 'We operate with complete openness: shared repositories, transparent sprint tracking, direct communication channels, and honest technical guidance.',
    },
    {
      icon: <Sparkles className="h-5 w-5 text-[#F7623D]" />,
      title: 'Innovation',
      desc: 'We thoughtfully adopt proven modern technologies, cloud-native paradigms, and applied AI systems to give our clients a distinct technical edge.',
    },
    {
      icon: <Users className="h-5 w-5 text-[#F7623D]" />,
      title: 'Client Partnership',
      desc: 'We collaborate as an embedded engineering ally rather than a detached agency, deeply aligning our technical efforts with your business milestones.',
    },
    {
      icon: <Target className="h-5 w-5 text-[#F7623D]" />,
      title: 'Accountability',
      desc: 'We take full responsibility for technical outcomes, code quality, deadline integrity, and the long-term operational health of every system we ship.',
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-[#F7623D]" />,
      title: 'Continuous Improvement',
      desc: 'We continuously review telemetry, benchmark system latency, refine developer workflows, and iterate to achieve peak performance across every sprint.',
    },
  ];

  // Why Choose SBU TECH (Required Section 05)
  const strengths = [
    {
      num: '01',
      title: 'Senior-Led Engineering',
      desc: 'You work directly with founding principals and senior engineers who design schemas, review pull requests, and make critical architectural decisions.',
    },
    {
      num: '02',
      title: 'Scalable Architecture',
      desc: 'Every system is engineered from day one to handle high concurrency, data volume growth, and complex transactional workloads without degrading.',
    },
    {
      num: '03',
      title: 'Transparent Communication',
      desc: 'No administrative middlemen or confusing account managers. You have direct access via dedicated collaboration channels and weekly demo cycles.',
    },
    {
      num: '04',
      title: 'Security-Focused Development',
      desc: 'Role-based access control, encrypted secrets management, automated dependency vulnerability scans, and strict data security protocols built-in.',
    },
    {
      num: '05',
      title: 'Reliable Project Delivery',
      desc: 'Structured two-week sprint cadences, type-safe pull requests, and automated staging environments ensure predictable, on-time project execution.',
    },
    {
      num: '06',
      title: 'Long-Term Technical Partnership',
      desc: 'Complete documentation, comprehensive test suites, clear operational runbooks, and ongoing advisory so your internal team can scale with confidence.',
    },
  ];

  // Five-Stage Development Process (Required Section 08)
  const stages = [
    {
      step: '01',
      phase: 'STAGE 01',
      title: 'Discovery & Planning',
      desc: 'We thoroughly assess your product requirements, user journeys, and technical constraints to establish a clear project scope and realistic milestone roadmap.',
      deliverables: ['Product Scope & Specifications', 'User Journey Mapping', 'Sprint Milestones Roadmap'],
    },
    {
      step: '02',
      phase: 'STAGE 02',
      title: 'Strategy & Architecture',
      desc: 'We design the foundational system topology, data models, API specifications, and cloud infrastructure layout before building production features.',
      deliverables: ['System Architecture Blueprint', 'Database Schema Models', 'API Contract Specifications'],
    },
    {
      step: '03',
      phase: 'STAGE 03',
      title: 'Design & Development',
      desc: 'Our senior team writes type-safe, modular code across frontend and backend in rapid two-week sprints with continuous integration and staging builds.',
      deliverables: ['Interactive UI/UX Prototypes', 'Production-Grade Application Code', 'Live Staging Previews'],
    },
    {
      step: '04',
      phase: 'STAGE 04',
      title: 'Testing & Quality Assurance',
      desc: 'We execute automated integration tests, simulated concurrency benchmarks, cross-platform checks, and security audits to guarantee zero defects.',
      deliverables: ['Automated Test Suites', 'Load & Latency Benchmarks', 'Security & Accessibility Pass'],
    },
    {
      step: '05',
      phase: 'STAGE 05',
      title: 'Deployment & Ongoing Support',
      desc: 'We orchestrate zero-downtime production cutovers with live telemetry monitoring, complete source code handoff, and ongoing technical support.',
      deliverables: ['Zero-Downtime Deployment', 'Telemetry Monitoring Dashboards', 'Full Code & IP Handoff'],
    },
  ];

  // Technology Stack by Category (Required Section 09)
  const techCategories = [
    {
      icon: <Code2 className="h-5 w-5 text-[#F7623D]" />,
      name: 'Frontend Development',
      summary: 'Responsive, accessible, and high-performance user interfaces.',
      techs: ['Next.js (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS', 'React Native'],
    },
    {
      icon: <Server className="h-5 w-5 text-[#F7623D]" />,
      name: 'Backend Development',
      summary: 'High-throughput APIs, microservices, and event-driven backends.',
      techs: ['Go (Golang)', 'Node.js', 'Express / Fastify', 'Python', 'REST & GraphQL APIs'],
    },
    {
      icon: <Database className="h-5 w-5 text-[#F7623D]" />,
      name: 'Databases',
      summary: 'ACID-compliant relational storage, distributed cache, and analytics.',
      techs: ['PostgreSQL', 'Redis', 'MongoDB', 'ClickHouse', 'Prisma / Drizzle ORM'],
    },
    {
      icon: <Cloud className="h-5 w-5 text-[#F7623D]" />,
      name: 'Cloud Infrastructure',
      summary: 'Multi-region, fault-tolerant, auto-scaling cloud deployments.',
      techs: ['Amazon Web Services (AWS)', 'Google Cloud Platform (GCP)', 'Cloudflare Edge', 'S3 & Object Storage', 'VPC & Cloud Networking'],
    },
    {
      icon: <Cpu className="h-5 w-5 text-[#F7623D]" />,
      name: 'AI & Machine Learning',
      summary: 'Applied enterprise retrieval, custom embeddings, and private workflows.',
      techs: ['Python / PyTorch', 'LangChain', 'Vector Search (Pinecone/pgvector)', 'OpenAI / Claude APIs', 'Automated Model Evals'],
    },
    {
      icon: <GitBranch className="h-5 w-5 text-[#F7623D]" />,
      name: 'DevOps & Deployment',
      summary: 'Declarative infrastructure, automated pipelines, and telemetry.',
      techs: ['Docker Containers', 'Kubernetes Orchestration', 'Terraform (IaC)', 'GitHub Actions CI/CD', 'Prometheus & Grafana'],
    },
  ];

  return (
    <div className="space-y-20 md:space-y-28 pb-24 bg-[#EEE6E2] text-[#1E5A54] transition-colors duration-200">
      {/* ========================================================================= */}
      {/* 01. ABOUT HERO SECTION                                                   */}
      {/* ========================================================================= */}
      <PageHeader
        badge="About SBU TECH // Engineering Studio"
        title="We Engineer Production Systems That Power Modern Digital Enterprises"
        description="SBU TECH is a senior software engineering studio pairing robust systems architecture with refined digital interface craft. We work directly with ambitious businesses and enterprises to design, build, and scale durable technology platforms."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* ========================================================================= */}
      {/* 02. OUR STORY SECTION                                                    */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* Left Column: Narrative Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#F7623D]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-[#1E5A54]/80">
                {'Studio Dossier // Purpose & Origins'}
              </span>
            </div>

            <div className="inline-block">
              <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54] leading-tight">
                Our Story & Architectural Philosophy
              </h2>
              <div className="w-40 mt-1.5">
                <HandUnderline className="h-3 w-full" />
              </div>
            </div>

            <div className="space-y-4 text-sm md:text-base text-[#1E5A54]/85 leading-relaxed font-sans">
              <p>
                SBU TECH was founded on a straightforward observation: growing businesses, digital innovators, and forward-thinking enterprises often struggle with the typical agency model. Too often, projects suffer from excessive management layers, disconnected design phases, and junior handoffs that result in brittle architectures and technical debt.
              </p>
              <p>
                We established SBU TECH to offer a fundamentally better alternative—a senior-led software engineering studio where clients work directly with the principal architects designing the schema and writing production code.
              </p>
              <p>
                Our approach unites rigorous backend discipline with high-performance frontend interfaces. Whether architecting cloud infrastructure, building high-concurrency web platforms, or integrating private AI capabilities, we prioritize durability, speed, clean code, and outright client intellectual property ownership.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]/75">
              <span className="px-3 py-1.5 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2]">
                100% Client IP Ownership
              </span>
              <span className="px-3 py-1.5 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2]">
                Zero Junior Hand-offs
              </span>
              <span className="px-3 py-1.5 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2]">
                Type-Safe Production Code
              </span>
            </div>
          </div>

          {/* Right Column: Visual Philosophy Card */}
          <div className="lg:col-span-5">
            <div className="p-8 md:p-10 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#1E5A54]/15 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-[#F7623D]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E5A54]">
                    Studio Manifesto
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E5A54]/50">
                  REF: SBU-SYS-01
                </span>
              </div>

              <blockquote className="font-headline text-2xl md:text-3xl uppercase tracking-tight text-[#1E5A54] leading-snug">
                &ldquo;We treat software engineering as an exacting craft. Every architecture decision is made for longevity, clarity, and real business impact.&rdquo;
              </blockquote>

              <div className="space-y-3 pt-2 text-xs text-[#1E5A54]/80">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#F7623D] shrink-0" />
                  <span>Direct architectural collaboration with company founders</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#F7623D] shrink-0" />
                  <span>Strict TypeScript schemas and reproducible infrastructure</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#F7623D] shrink-0" />
                  <span>Production-tested performance, security, and scalability</span>
                </div>
              </div>

              <div className="pt-2">
                <StudioStamp
                  text="SOFTWARE STUDIO"
                  subtext="PRINCIPAL-LED ENGINEERING"
                  rotate="slight-left"
                  variant="teal"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. OUR MISSION & VISION SECTION                                         */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2] text-xs font-semibold tracking-[0.16em] uppercase text-[#1E5A54]">
            <Compass className="w-3.5 h-3.5 text-[#F7623D]" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
            Our Mission & Vision
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            Clear technical purpose and a long-term roadmap define how we build software for our partners today and into the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="p-8 md:p-10 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-5 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl border border-[#1E5A54] bg-[#EEE6E2] flex items-center justify-center text-[#F7623D]">
                  <Target className="h-6 w-6 stroke-[1.75]" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#1E5A54]/60 font-bold">
                  {'FOCUS 01 // MISSION'}
                </span>
              </div>
              <h3 className="font-headline text-2xl md:text-3xl uppercase tracking-tight text-[#1E5A54]">
                Our Mission
              </h3>
              <p className="text-sm md:text-base text-[#1E5A54]/85 leading-relaxed font-sans">
                To design, build, and maintain mission-critical software systems that empower modern enterprises to operate efficiently, scale reliably, and innovate continuously. We are dedicated to delivering production-grade engineering free from unnecessary complexity, ensuring every solution brings measurable return on investment and clear architectural ownership.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E5A54]/15 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D]" />
              <span>Engineering Excellence • Client Empowerment • Measurable Outcomes</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="p-8 md:p-10 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-5 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl border border-[#1E5A54] bg-[#EEE6E2] flex items-center justify-center text-[#F7623D]">
                  <Workflow className="h-6 w-6 stroke-[1.75]" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#1E5A54]/60 font-bold">
                  {'FOCUS 02 // VISION'}
                </span>
              </div>
              <h3 className="font-headline text-2xl md:text-3xl uppercase tracking-tight text-[#1E5A54]">
                Our Vision
              </h3>
              <p className="text-sm md:text-base text-[#1E5A54]/85 leading-relaxed font-sans">
                To become the premier engineering studio trusted by visionary founders, scaling startups, and global enterprises to construct their most important digital products. We envision an industry where software engineering is defined by uncompromising craft, genuine collaboration, zero artificial lock-in, and forward-thinking technological resilience.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E5A54]/15 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D]" />
              <span>Global Technical Reach • Durable Architectures • Future-Proof Platforms</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. OUR CORE VALUES SECTION                                              */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2] text-xs font-semibold tracking-[0.16em] uppercase text-[#1E5A54]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F7623D]" />
            <span>Our Foundation</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
            Core Values
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            These six core commitments govern how our engineers write code, communicate with partners, and deliver production systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-3.5 hover:border-[#1E5A54]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/30 bg-[#EEE6E2] flex items-center justify-center">
                  {val.icon}
                </div>
                <span className="font-mono text-xs font-bold text-[#1E5A54]/50">
                  0{idx + 1}
                </span>
              </div>
              <h3 className="font-headline text-xl uppercase tracking-tight text-[#1E5A54]">
                {val.title}
              </h3>
              <p className="text-xs md:text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. WHY CHOOSE SBU TECH? SECTION                                         */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="p-8 md:p-12 lg:p-16 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#1E5A54]/15 pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] text-xs font-semibold tracking-[0.16em] uppercase text-[#1E5A54]">
                <Activity className="w-3.5 h-3.5 text-[#F7623D]" />
                <span>Distinct Advantages</span>
              </div>
              <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
                Why Choose SBU TECH?
              </h2>
              <p className="text-sm md:text-base text-[#1E5A54]/80 max-w-xl font-sans">
                We combine architectural rigor with rapid agile delivery, ensuring your project is built to standard and delivered without friction.
              </p>
            </div>

            <StudioStamp
              text="MEASURABLE IMPACT"
              subtext="HIGH-THROUGHPUT ENGINEERING"
              rotate="slight-right"
              variant="orange"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {strengths.map((item) => (
              <div key={item.num} className="space-y-3">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#F7623D]">
                  {item.num} {'//'} ADVANTAGE
                </div>
                <h3 className="font-headline text-xl uppercase tracking-tight text-[#1E5A54]">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-[#1E5A54]/80 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. MEET OUR FOUNDING TEAM (THREE OWNERS)                                */}
      {/* ========================================================================= */}
      <section className="site-container space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2] text-xs font-semibold tracking-[0.16em] uppercase text-[#1E5A54]">
            <Users className="w-3.5 h-3.5 text-[#F7623D]" />
            <span>Leadership</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
            Meet Our Founding Team
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            SBU TECH is guided by three founding partners who steer the company&apos;s architectural vision, technology strategies, and client partnerships.
          </p>
        </div>

        {/* Primary Prominence: Main Owner Card */}
        <div className="p-8 md:p-12 rounded-3xl border-2 border-[#1E5A54] bg-[#F8F4F2] shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Monogram Portrait Placeholder */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="h-44 w-44 sm:h-52 sm:w-52 rounded-3xl border-2 border-[#1E5A54] bg-[#EEE6E2] flex flex-col items-center justify-center p-6 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#1E5A54]/5 pointer-events-none" />
                  <span className="font-headline text-5xl sm:text-6xl font-bold tracking-tight text-[#1E5A54]">
                    BSD
                  </span>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-[#F7623D] mt-2">
                    Executive Monogram
                  </span>
                </div>
                <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-[#1E5A54] text-[#EEE6E2] text-[10px] font-mono font-bold uppercase tracking-wider shadow">
                    Main Owner
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Leadership Profile Details */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F7623D]/30 bg-[#EEE6E2] text-[11px] font-mono font-bold uppercase tracking-wider text-[#F7623D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D]" />
                  <span>{'Founding Leadership // Primary Executive'}</span>
                </div>
                <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
                  Bidhan Shaha Dhrubo
                </h3>
                <p className="font-mono text-sm sm:text-base font-bold uppercase tracking-widest text-[#1E5A54]/80">
                  Main Owner & Founding Partner
                </p>
              </div>

              <p className="text-sm md:text-base text-[#1E5A54]/85 leading-relaxed font-sans max-w-2xl">
                Serving as the Main Owner of SBU TECH, Bidhan Shaha Dhrubo directs the overall company strategy, engineering ethos, and business governance. Overseeing core architectural standards and enterprise client engagements, he ensures the studio maintains its foundational commitment to software excellence, transparent execution, and technical discipline across all project initiatives.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]/75">
                <span className="px-3 py-1.5 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2]">
                  Executive Leadership
                </span>
                <span className="px-3 py-1.5 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2]">
                  Systems Architecture
                </span>
                <span className="px-3 py-1.5 rounded-xl border border-[#1E5A54]/20 bg-[#EEE6E2]">
                  Strategic Governance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Both Co-Owners: Equal Founding Partners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Co-Owner 01: Utsob Saha */}
          <div className="p-7 md:p-9 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-start gap-5">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-[#1E5A54] bg-[#EEE6E2] flex flex-col items-center justify-center p-3 shrink-0 shadow-inner">
                  <span className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-[#1E5A54]">
                    US
                  </span>
                  <span className="font-mono text-[9px] uppercase font-bold tracking-[0.16em] text-[#F7623D] mt-1">
                    Co-Owner
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1E5A54]/10 text-[#1E5A54] text-[10px] font-mono font-bold uppercase tracking-wider inline-block">
                    Co-Owner 01
                  </span>
                  <h4 className="font-headline text-2xl sm:text-3xl uppercase tracking-tight text-[#1E5A54]">
                    Utsob Saha
                  </h4>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E5A54]/75">
                    Co-Owner & Founding Partner
                  </p>
                </div>
              </div>

              <p className="text-xs md:text-sm text-[#1E5A54]/85 leading-relaxed font-sans">
                As a Co-Owner and founding partner of SBU TECH, Utsob Saha collaborates closely on organizational planning, technical operations, and delivery frameworks. His leadership ensures seamless coordination across engineering workflows, maintaining consistency in quality, schedule adherence, and platform stability.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E5A54]/15 flex flex-wrap items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E5A54]/70">
              <span className="px-2.5 py-1 rounded-lg border border-[#1E5A54]/20 bg-[#EEE6E2]">
                Engineering Operations
              </span>
              <span className="px-2.5 py-1 rounded-lg border border-[#1E5A54]/20 bg-[#EEE6E2]">
                Technology Strategy
              </span>
            </div>
          </div>

          {/* Co-Owner 02: Borson Saha */}
          <div className="p-7 md:p-9 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-start gap-5">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-[#1E5A54] bg-[#EEE6E2] flex flex-col items-center justify-center p-3 shrink-0 shadow-inner">
                  <span className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-[#1E5A54]">
                    BS
                  </span>
                  <span className="font-mono text-[9px] uppercase font-bold tracking-[0.16em] text-[#F7623D] mt-1">
                    Co-Owner
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1E5A54]/10 text-[#1E5A54] text-[10px] font-mono font-bold uppercase tracking-wider inline-block">
                    Co-Owner 02
                  </span>
                  <h4 className="font-headline text-2xl sm:text-3xl uppercase tracking-tight text-[#1E5A54]">
                    Borson Saha
                  </h4>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E5A54]/75">
                    Co-Owner & Founding Partner
                  </p>
                </div>
              </div>

              <p className="text-xs md:text-sm text-[#1E5A54]/85 leading-relaxed font-sans">
                As a Co-Owner and founding partner of SBU TECH, Borson Saha focuses on technical partnerships, product implementation architectures, and client alignment. He plays a central role in translating complex business requirements into high-impact engineering solutions and fostering enduring client relationships.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E5A54]/15 flex flex-wrap items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E5A54]/70">
              <span className="px-2.5 py-1 rounded-lg border border-[#1E5A54]/20 bg-[#EEE6E2]">
                Technical Partnerships
              </span>
              <span className="px-2.5 py-1 rounded-lg border border-[#1E5A54]/20 bg-[#EEE6E2]">
                Product Architecture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07. OUR ENGINEERING TEAM STRUCTURE                                       */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="p-8 md:p-12 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#1E5A54]/15 pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] text-xs font-semibold tracking-[0.16em] uppercase text-[#1E5A54]">
                <Network className="w-3.5 h-3.5 text-[#F7623D]" />
                <span>Squad Organization</span>
              </div>
              <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
                Our Engineering Team
              </h2>
              <p className="text-sm md:text-base text-[#1E5A54]/80 max-w-xl font-sans">
                Our multidisciplinary studio is organized into focused engineering squads that collaborate closely across every phase of system design and implementation.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1E5A54]/70">
              <span className="h-2 w-2 rounded-full bg-[#F7623D] animate-ping" />
              <span>Active Squad Matrix</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-[#1E5A54]/20 bg-[#EEE6E2] space-y-3">
              <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/30 bg-[#F8F4F2] flex items-center justify-center text-[#F7623D]">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-headline text-lg uppercase tracking-tight text-[#1E5A54]">
                Frontend Squad
              </h3>
              <p className="text-xs text-[#1E5A54]/80 leading-relaxed font-sans">
                Focused on Next.js, React, Tailwind CSS, TypeScript, and React Native mobile clients with high fidelity and sub-second rendering.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#1E5A54]/20 bg-[#EEE6E2] space-y-3">
              <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/30 bg-[#F8F4F2] flex items-center justify-center text-[#F7623D]">
                <Server className="h-5 w-5" />
              </div>
              <h3 className="font-headline text-lg uppercase tracking-tight text-[#1E5A54]">
                Backend & Systems Squad
              </h3>
              <p className="text-xs text-[#1E5A54]/80 leading-relaxed font-sans">
                Engineers specializing in Go and Node.js microservices, low-latency relational and transactional databases, and resilient APIs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#1E5A54]/20 bg-[#EEE6E2] space-y-3">
              <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/30 bg-[#F8F4F2] flex items-center justify-center text-[#F7623D]">
                <Cloud className="h-5 w-5" />
              </div>
              <h3 className="font-headline text-lg uppercase tracking-tight text-[#1E5A54]">
                Cloud & DevOps Squad
              </h3>
              <p className="text-xs text-[#1E5A54]/80 leading-relaxed font-sans">
                Infrastructure engineers building automated Terraform environments, Kubernetes clusters, and continuous deployment workflows.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#1E5A54]/20 bg-[#EEE6E2] space-y-3">
              <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/30 bg-[#F8F4F2] flex items-center justify-center text-[#F7623D]">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-headline text-lg uppercase tracking-tight text-[#1E5A54]">
                AI & Data Squad
              </h3>
              <p className="text-xs text-[#1E5A54]/80 leading-relaxed font-sans">
                Applied AI engineers developing grounded retrieval pipelines, vector index topologies, and automated evaluation harnesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08. HOW WE WORK (FIVE-STAGE DEVELOPMENT PROCESS)                         */}
      {/* ========================================================================= */}
      <section className="site-container space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#1E5A54]/15 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2] text-xs font-semibold tracking-[0.16em] uppercase text-[#1E5A54]">
              <Workflow className="w-3.5 h-3.5 text-[#F7623D]" />
              <span>Disciplined Methodology</span>
            </div>
            <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
              How We Work
            </h2>
            <p className="text-sm md:text-base text-[#1E5A54]/80 max-w-xl font-sans">
              Our five-stage development process provides predictable timelines, clear architectural checkpoints, and consistent production-ready deliverables.
            </p>
          </div>

          <StudioStamp
            text="CHRONOLOGICAL BLUEPRINT"
            subtext="FIVE STAGE PROCESS"
            rotate="slight-left"
            variant="teal"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stages.map((stg) => (
            <div
              key={stg.step}
              className="p-6 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1E5A54]/15 pb-3">
                  <span className="font-headline text-3xl font-bold text-[#F7623D]">
                    {stg.step}
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#1E5A54]/60">
                    {stg.phase}
                  </span>
                </div>
                <h3 className="font-headline text-lg uppercase tracking-tight text-[#1E5A54]">
                  {stg.title}
                </h3>
                <p className="text-xs text-[#1E5A54]/80 leading-relaxed font-sans">
                  {stg.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E5A54]/15 space-y-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-[#1E5A54]/60 block tracking-wider">
                  Deliverables:
                </span>
                {stg.deliverables.map((deliv, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-1.5 text-[11px] text-[#1E5A54]/85 font-sans">
                    <span className="text-[#F7623D] font-bold mt-0.5">•</span>
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09. OUR TECHNOLOGY STACK SECTION                                         */}
      {/* ========================================================================= */}
      <section className="site-container space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1E5A54]/25 bg-[#F8F4F2] text-xs font-semibold tracking-[0.16em] uppercase text-[#1E5A54]">
            <Layers className="w-3.5 h-3.5 text-[#F7623D]" />
            <span>Technical Ecosystem</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl uppercase tracking-tight text-[#1E5A54]">
            Our Technology Stack
          </h2>
          <p className="text-sm md:text-base text-[#1E5A54]/80 font-sans">
            We build with proven modern technologies, prioritizing type safety, concurrency, developer experience, and long-term ecosystem stability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((cat, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] space-y-4 hover:border-[#1E5A54]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl border border-[#1E5A54]/30 bg-[#EEE6E2] flex items-center justify-center">
                  {cat.icon}
                </div>
                <h3 className="font-headline text-xl uppercase tracking-tight text-[#1E5A54]">
                  {cat.name}
                </h3>
              </div>

              <p className="text-xs text-[#1E5A54]/75 font-sans leading-relaxed">
                {cat.summary}
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                {cat.techs.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg border border-[#1E5A54]/18 bg-[#EEE6E2] text-[11px] font-mono font-medium text-[#1E5A54]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FINAL CALL TO ACTION SECTION                                         */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="p-8 sm:p-12 md:p-16 lg:p-20 rounded-3xl border-2 border-[#1E5A54] bg-[#F8F4F2] text-center space-y-8 relative overflow-hidden shadow-sm">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1E5A54]/25 bg-[#EEE6E2] text-xs font-semibold tracking-[0.16em] uppercase text-[#1E5A54]">
              <Sparkles className="w-3.5 h-3.5 text-[#F7623D]" />
              <span>Start The Conversation</span>
            </div>

            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-[#1E5A54] leading-tight">
              Have an Idea? Let&apos;s Build Something Great Together.
            </h2>

            <p className="text-sm md:text-base text-[#1E5A54]/80 max-w-xl mx-auto font-sans leading-relaxed">
              Whether you are scoping a greenfield software product, re-architecting an existing platform, or deploying private AI systems, our founding engineering team is ready to assist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <MagneticWrap>
              <Link
                href="/get-a-quote"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1E5A54] border-2 border-[#F7623D] text-[#EEE6E2] text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2.5 hover:bg-[#16443F] transition-all shadow-md"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4 stroke-2" />
              </Link>
            </MagneticWrap>

            <MagneticWrap>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#1E5A54] bg-[#EEE6E2] text-[#1E5A54] text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
              >
                <span>Contact Our Team</span>
              </Link>
            </MagneticWrap>
          </div>

          <div className="pt-6 border-t border-[#1E5A54]/15 max-w-md mx-auto flex items-center justify-center gap-4 text-xs font-mono text-[#1E5A54]/70">
            <span>Direct Principal Response</span>
            <span>•</span>
            <span>Zero Agency Theater</span>
            <span>•</span>
            <span>Non-Disclosure Protected</span>
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
