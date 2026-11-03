import { Project } from '@/types';

export const projectsData: Project[] = [
  {
    id: 'proj-1',
    slug: 'pulseflow-analytics-saas',
    title: 'PulseFlow Enterprise Analytics Engine',
    client: 'PulseFlow Systems Inc. (Sample Client)',
    category: 'Web App',
    shortDescription:
      'A real-time telemetry processing and data visualization dashboard handling 100M+ events daily with sub-second querying.',
    fullDescription:
      'PulseFlow required a modern cloud-native analytics dashboard capable of ingesting high-throughput telemetry streams from thousands of IoT devices and enterprise clusters. Sbu Tech engineered an end-to-end Next.js and Go microservices platform featuring custom WebGL timeline charts and automated anomaly detection.',
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
      'The legacy monolithic backend was buckling under growing telemetry volume, suffering from multi-minute queries, UI freezes, and skyrocketing AWS compute costs.',
    solution:
      'We designed an event-driven architecture using Apache Kafka and ClickHouse columnar storage, paired with an optimized Next.js App Router frontend with virtualized data lists and server-side pre-aggregations.',
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
      'Cross-border payments and multi-currency mobile wallet engineered with React Native and biometric security.',
    fullDescription:
      'NovaVault wanted to expand from European markets into North America with an upgraded, lightning-fast mobile wallet that allows instant currency exchange, virtual debit card issuance, and international wire tracking.',
    coverImage: '/projects/novavault.jpg',
    year: 2024,
    duration: '6 Months',
    technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    metrics: [
      { label: 'Active Users', value: '250,000+' },
      { label: 'App Store Rating', value: '4.9 ★' },
      { label: 'Transaction Speed', value: '< 3.2s' },
      { label: 'Fraud Detection', value: '99.9%' },
    ],
    challenge:
      'Maintaining rigorous banking-grade cryptographic security while providing an intuitive, friction-free onboarding flow with KYC identity verification.',
    solution:
      'We engineered a React Native mobile application integrating hardware-level biometric keys, on-device document OCR scanning, and automated multi-currency liquidity routing.',
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
      'Automated multi-region Kubernetes migration and GitOps continuous delivery for an international freight network.',
    fullDescription:
      'Stratos operated on legacy on-premise hardware prone to regional power outages and manual deployment errors. Sbu Tech planned and executed a zero-downtime migration to an auto-scaling AWS EKS cluster managed via Terraform and ArgoCD.',
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
      'Migrating 45 interconnected microservices and 12TB of mission-critical logistics shipping history without stopping live seaport dispatch operations.',
    solution:
      'Implemented dual-write synchronization patterns, automated canary verification tests, and standardized containerized build pipelines with GitOps release automation.',
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
      'Enterprise RAG system summarizing thousands of contract precedents and litigation transcripts with citation verification.',
    fullDescription:
      'Lexicon needed an intelligent legal assistant to help attorneys cross-reference case law, identify non-standard indemnity clauses, and generate contract summaries while strictly keeping sensitive litigation documents private.',
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
      'General commercial LLMs hallucinated case citations and violated client confidentiality guidelines regarding third-party model training.',
    solution:
      'We deployed dedicated self-hosted open-weights models connected via hybrid vector-keyword retrieval with cryptographic audit trails and paragraph-level source attribution.',
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
      'HIPAA-compliant patient portal with WebRTC video consultations, electronic prescription dispatch, and records sync.',
    fullDescription:
      'Zenith Health needed a modern patient engagement web application connecting patients with board-certified physicians, providing secure encrypted video conferencing and seamless sync with Cerner and Epic EHR records.',
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
      'Meeting strict healthcare compliance regulations while keeping the video consultation interface simple enough for elderly patients to use without technical support.',
    solution:
      'Engineered an ultra-clean, accessible browser-based WebRTC experience that requires no downloads, featuring automatic bandwidth adaptation and encrypted clinical notes.',
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
      'Unified design system and component architecture powering 12 distinct international e-commerce storefronts.',
    fullDescription:
      'Orbit Retail operates distinct clothing and consumer goods brands across 8 countries. They suffered from fragmented user experiences and months of redundant frontend rework for every new campaign.',
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
      'Each brand had its own bespoke code repository, leading to inconsistent checkout behaviors, bugs, and sluggish feature rollouts.',
    solution:
      'Built a headless monorepo design system with Tailwind CSS tokens and accessible React components, enabling each brand to skin themes via CSS variables while sharing proven logic.',
    results: [
      'Cut new campaign launch time from 6 weeks down to 4 business days.',
      'Consistently achieved 95+ Google Lighthouse scores across all 12 storefronts.',
    ],
    isFeatured: false,
    liveUrl: 'https://example.com/projects/orbit',
  },
];

