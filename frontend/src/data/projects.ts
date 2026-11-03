import { Project } from '@/types';

export const projectsData: Project[] = [
  {
    id: 'proj-1',
    slug: 'pulseflow-analytics-saas',
    title: 'PulseFlow Enterprise Analytics Engine',
    client: 'PulseFlow Systems Inc. (Sample Client)',
    category: 'Web App',
    shortDescription:
      'Real-time telemetry ingestion and visualization platform processing 100M+ daily events with sub-second query latency.',
    fullDescription:
      'PulseFlow needed to replace an overloaded analytics backend that was choking on telemetry streams from thousands of IoT devices and enterprise clusters. Sbu Tech architected a Go and ClickHouse ingestion pipeline paired with a Next.js dashboard capable of rendering high-density WebGL time-series charts without dropping frames.',
    coverImage: '/projects/pulseflow.jpg',
    year: 2025,
    duration: '5 Months',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Go', 'ClickHouse', 'Kafka', 'Docker'],
    metrics: [
      { label: 'Event Ingestion', value: '100M+ / day' },
      { label: 'Query Latency', value: '< 220ms' },
      { label: 'Dashboard Load Time', value: '0.8s' },
      { label: 'Cost Reduction', value: '38%' },
    ],
    challenge:
      'The existing monolithic relational backend stalled under rising event volume, causing multi-minute query timeouts, browser tab crashes, and climbing AWS compute bills.',
    solution:
      'We decoupled ingestion using Apache Kafka and ClickHouse columnar storage, then built a Next.js App Router interface with virtualized tables and server-side rollups.',
    results: [
      'Query response speeds improved by 14x across all standard analytics widgets.',
      'Reduced cloud infrastructure expenditure by 38% via columnar data compression.',
      'Zero downtime migration for 2,400 active enterprise organizations.',
    ],
    isFeatured: true,
    liveUrl: 'https://example.com/projects/pulseflow',
    githubUrl: 'https://github.com/sbutech/pulseflow-case-study',
  },
  {
    id: 'proj-2',
    slug: 'novavault-fintech-mobile',
    title: 'NovaVault Cross-Border Banking App',
    client: 'NovaPay Financial (Sample Client)',
    category: 'Mobile App',
    shortDescription:
      'Multi-currency mobile wallet and cross-border FX settlement app built with React Native and hardware biometric keys.',
    fullDescription:
      'NovaVault was expanding from European markets into North America and needed a mobile wallet capable of instant multi-currency exchange, virtual card issuance, and live international wire tracking under strict banking regulations.',
    coverImage: '/projects/novavault.jpg',
    year: 2024,
    duration: '6 Months',
    technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    metrics: [
      { label: 'Active Users', value: '250,000+' },
      { label: 'App Store Rating', value: '4.9 / 5.0' },
      { label: 'Transaction Speed', value: '< 3.2s' },
      { label: 'Fraud Detection', value: '99.9%' },
    ],
    challenge:
      'Enforcing bank-grade cryptographic signing and KYC identity verification while keeping onboarding under three minutes on mid-range mobile devices.',
    solution:
      'We built a React Native application backed by Secure Enclave / Keystore biometric signing, on-device document OCR, and idempotent settlement ledgers in PostgreSQL.',
    results: [
      'Grew active monthly users from 40,000 to over 250,000 within 9 months of launch.',
      'Maintained a 4.9-star average rating across both iOS App Store and Google Play.',
      'Achieved SOC 2 and PCI-DSS Level 1 compliance on the first external audit.',
    ],
    isFeatured: true,
    liveUrl: 'https://example.com/projects/novavault',
  },
  {
    id: 'proj-3',
    slug: 'stratos-cloud-migration',
    title: 'Stratos Logistics Cloud Modernization',
    client: 'Stratos Global Freight (Sample Client)',
    category: 'Cloud & DevOps',
    shortDescription:
      'Multi-region AWS EKS migration and GitOps release automation for an international maritime freight network.',
    fullDescription:
      'Stratos ran its core dispatch software on aging co-located racks prone to regional network outages and manual SSH deployment mistakes. Sbu Tech designed and executed a live cutover to multi-region AWS EKS clusters managed entirely through Terraform and ArgoCD.',
    coverImage: '/projects/stratos.jpg',
    year: 2024,
    duration: '4 Months',
    technologies: ['AWS', 'Kubernetes', 'Terraform', 'ArgoCD', 'Prometheus', 'Grafana'],
    metrics: [
      { label: 'Deployment Frequency', value: '25x faster' },
      { label: 'Service Uptime', value: '99.99%' },
      { label: 'Failover Time', value: '< 15s' },
      { label: 'Server Fleet', value: '180 Nodes' },
    ],
    challenge:
      'Migrating 45 interconnected microservices and 12TB of live shipping records without halting active seaport dispatch operations.',
    solution:
      'We set up dual-write database replication, shadow traffic mirroring, and ArgoCD canary rollouts with automated Prometheus metric gates.',
    results: [
      'Eliminated deployment downtime windows entirely (previously required 4-hour weekend pauses).',
      'Reduced MTTR (Mean Time to Recovery) from 2.5 hours to under 45 seconds.',
      'Saved an estimated $210,000 annually on physical server maintenance.',
    ],
    isFeatured: true,
    liveUrl: 'https://example.com/projects/stratos',
  },
  {
    id: 'proj-4',
    slug: 'lexicon-ai-legal-copilot',
    title: 'Lexicon AI Legal Research Copilot',
    client: 'Lexicon Partners Law Group (Sample Client)',
    category: 'AI & Data',
    shortDescription:
      'On-premise legal RAG platform indexing 2.5M+ case filings and contracts with paragraph-level citation verification.',
    fullDescription:
      'Lexicon wanted an internal research tool to help litigators cross-reference precedent, flag non-standard indemnity clauses, and draft brief summaries while guaranteeing that zero client records ever left the firm network.',
    coverImage: '/projects/lexicon.jpg',
    year: 2025,
    duration: '3.5 Months',
    technologies: ['Python', 'FastAPI', 'LangChain', 'Pinecone', 'Next.js', 'Tailwind CSS'],
    metrics: [
      { label: 'Time Saved per Brief', value: '65%' },
      { label: 'Citation Accuracy', value: '99.4%' },
      { label: 'Indexed Documents', value: '2.5M+' },
      { label: 'Zero Data Leaks', value: '100% On-Premise' },
    ],
    challenge:
      'Off-the-shelf commercial LLMs invented fake case citations and violated strict client confidentiality rules around external API logging.',
    solution:
      'We deployed self-hosted open-weights models paired with BM25 + dense vector hybrid search, cross-encoder reranking, and deterministic citation checking.',
    results: [
      'Reduced preliminary contract review time from 6 hours to under 45 minutes.',
      'Adopted by over 320 practicing partners and paralegals in the firm.',
      'Achieved zero hallucinations through strict citation grounding guardrails.',
    ],
    isFeatured: true,
    liveUrl: 'https://example.com/projects/lexicon',
    githubUrl: 'https://github.com/sbutech/lexicon-ai-copilot',
  },
  {
    id: 'proj-5',
    slug: 'zenith-healthcare-telemedicine',
    title: 'Zenith Health Telemedicine Platform',
    client: 'Zenith Health Alliance (Sample Client)',
    category: 'Web App',
    shortDescription:
      'HIPAA-compliant telehealth portal with browser-based WebRTC video consults, e-prescriptions, and HL7 FHIR EHR sync.',
    fullDescription:
      'Zenith Health needed a unified patient portal connecting patients with board-certified physicians over encrypted video while syncing clinical notes and prescriptions directly with Epic and Cerner EHR systems.',
    coverImage: '/projects/zenith.jpg',
    year: 2024,
    duration: '7 Months',
    technologies: ['Next.js', 'TypeScript', 'WebRTC', 'Tailwind CSS', 'PostgreSQL', 'AWS HIPAA'],
    metrics: [
      { label: 'Virtual Consults', value: '500,000+' },
      { label: 'Patient CSAT', value: '98.2%' },
      { label: 'Video Latency', value: '< 90ms' },
      { label: 'HIPAA Compliance', value: '100%' },
    ],
    challenge:
      'Meeting strict HIPAA encryption and audit-logging mandates while keeping the video room simple enough for elderly patients on low-bandwidth connections.',
    solution:
      'We built a zero-install WebRTC browser client with automatic bitrate adaptation, high-contrast accessible controls, and encrypted FHIR record synchronization.',
    results: [
      'Processed over 500,000 telehealth appointments with 99.98% video stream stability.',
      'Increased patient adherence to routine follow-up consultations by 42%.',
    ],
    isFeatured: false,
    liveUrl: 'https://example.com/projects/zenith-health',
  },
  {
    id: 'proj-6',
    slug: 'orbit-ecommerce-design-system',
    title: 'Orbit Commerce Modular Design System',
    client: 'Orbit Retail Brands (Sample Client)',
    category: 'Web App',
    shortDescription:
      'Multi-brand React component library and Turborepo monorepo powering 12 international retail storefronts.',
    fullDescription:
      'Orbit Retail runs 12 clothing and consumer goods brands across 8 countries. Each brand maintained a separate frontend codebase, turning simple checkout fixes and seasonal campaigns into months of duplicated work.',
    coverImage: '/projects/orbit.jpg',
    year: 2023,
    duration: '4 Months',
    technologies: ['Figma', 'React', 'Tailwind CSS', 'Storybook', 'Next.js', 'Turborepo'],
    metrics: [
      { label: 'Storefronts Powered', value: '12 Brands' },
      { label: 'Time to Market', value: '4x Faster' },
      { label: 'Accessibility Score', value: '100/100' },
      { label: 'Code Reusability', value: '82%' },
    ],
    challenge:
      'Twelve separate repositories meant inconsistent cart logic, repeated accessibility bugs, and slow regional campaign launches.',
    solution:
      'We consolidated all 12 storefronts into a Turborepo monorepo backed by shared accessible React primitives and per-brand CSS token themes.',
    results: [
      'Cut new campaign launch time from 6 weeks down to 4 business days.',
      'Consistently achieved 95+ Google Lighthouse scores across all 12 storefronts.',
    ],
    isFeatured: false,
    liveUrl: 'https://example.com/projects/orbit',
  },
];
