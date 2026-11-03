import { Service } from '@/types';

export const servicesData: Service[] = [
  {
    id: 'srv-1',
    slug: 'custom-web-app-development',
    title: 'Custom Web Application Development',
    category: 'Engineering',
    iconName: 'Code2',
    isFeatured: true,
    shortDescription:
      'High-performance, scalable web platforms designed with modern frameworks like Next.js, React, and Node.js.',
    fullDescription:
      'We engineer resilient, scalable, and responsive web applications tailored to your precise business operations. From complex multi-tenant SaaS platforms to customer portals and data management hubs, our team writes clean, type-safe code that scales gracefully under high enterprise demand.',
    features: [
      'Next.js App Router & Server Components for extreme speed',
      'Microservices and modular API architecture',
      'Type-safe backend integration with TypeScript & Zod',
      'Real-time data streaming and WebSocket synchronization',
      'Cross-browser optimization and WCAG 2.1 accessibility compliance',
    ],
    deliverables: [
      'Production-ready Next.js & React source code',
      'Fully documented REST / GraphQL API endpoints',
      'Comprehensive unit and integration test suite',
      'CI/CD continuous delivery deployment scripts',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    processSteps: [
      {
        title: 'Architecture & Schema Planning',
        description: 'We define the domain model, API contracts, and infrastructure blueprints.',
      },
      {
        title: 'Iterative Sprint Execution',
        description: 'Two-week agile sprints with bi-weekly staging builds and sprint reviews.',
      },
      {
        title: 'Rigorous Quality Assurance',
        description: 'End-to-end automated testing, load testing, and edge-case validation.',
      },
      {
        title: 'Zero-Downtime Deployment',
        description: 'Automated release deployment with canary rollback protection.',
      },
    ],
  },
  {
    id: 'srv-2',
    slug: 'cloud-architecture-devops',
    title: 'Cloud Architecture & DevOps',
    category: 'Infrastructure',
    iconName: 'Cloud',
    isFeatured: true,
    shortDescription:
      'Automated cloud infrastructure, Kubernetes orchestration, and resilient CI/CD pipelines on AWS, GCP, and Azure.',
    fullDescription:
      'Scale your workloads efficiently while keeping cloud costs under tight control. We design secure, self-healing cloud topologies using Infrastructure as Code (Terraform), container orchestration (Kubernetes), and automated continuous deployment pipelines.',
    features: [
      'Infrastructure as Code (IaC) with Terraform & OpenTofu',
      'Kubernetes cluster management and auto-scaling configurations',
      'Multi-region redundancy and disaster recovery failover systems',
      'Observability and centralized logging with Prometheus, Grafana & Datadog',
      'FinOps audits to cut unnecessary cloud infrastructure spending',
    ],
    deliverables: [
      'Version-controlled Terraform infrastructure code',
      'Hardened Kubernetes Helm charts and manifest files',
      'Automated GitHub Actions / GitLab CI/CD release pipelines',
      'Comprehensive runbooks and disaster recovery architecture docs',
    ],
    technologies: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus', 'GitHub Actions'],
    processSteps: [
      {
        title: 'Cloud Audit & Benchmarking',
        description: 'Analyzing current infrastructure latency, bottlenecks, and billing.',
      },
      {
        title: 'Topology Blueprints',
        description: 'Designing high-availability VPC, subnetting, and cluster topologies.',
      },
      {
        title: 'IaC & Pipeline Codification',
        description: 'Writing reproducible Terraform stacks and secure deployment workflows.',
      },
      {
        title: 'Migration & Health Monitoring',
        description: 'Zero-downtime cutover and configuring 24/7 alerting thresholds.',
      },
    ],
  },
  {
    id: 'srv-3',
    slug: 'mobile-app-engineering',
    title: 'Mobile App Engineering',
    category: 'Mobile',
    iconName: 'Smartphone',
    isFeatured: true,
    shortDescription:
      'Native-grade iOS and Android mobile applications crafted using React Native and Flutter with offline-first synchronization.',
    fullDescription:
      'Reach your mobile audience with blazing-fast, fluid user experiences. We develop cross-platform mobile apps that feel 100% native, complete with background sync, hardware sensor integrations, secure biometric authentication, and Apple App Store / Google Play compliance.',
    features: [
      'Single codebase cross-platform delivery with React Native & Flutter',
      'Offline-first SQLite and WatermelonDB client sync engines',
      'Biometric authentication (FaceID, TouchID, Android Fingerprint)',
      'Push notification management and deep-linking routing',
      'App Store and Play Store review prep and compliance guarantees',
    ],
    deliverables: [
      'Compiled iOS and Android production release builds',
      'Full TypeScript mobile source repository',
      'App Store Connect & Google Play Console configurations',
      'Crash analytics and remote telemetry setup',
    ],
    technologies: ['React Native', 'Expo', 'Flutter', 'TypeScript', 'Redux Toolkit', 'Firebase'],
    processSteps: [
      {
        title: 'Mobile UX & Interactive Prototyping',
        description: 'Designing finger-friendly mobile layouts and tactile gestures in Figma.',
      },
      {
        title: 'Core App Engine Development',
        description: 'Implementing state management, local database, and offline sync.',
      },
      {
        title: 'Device Matrix Verification',
        description: 'Testing across real physical devices of different screen ratios and OS versions.',
      },
      {
        title: 'Store Publishing & Launch',
        description: 'Managing store submission, certificates, and approval walkthroughs.',
      },
    ],
  },
  {
    id: 'srv-4',
    slug: 'ai-machine-learning-solutions',
    title: 'AI & Machine Learning Solutions',
    category: 'AI & Data',
    iconName: 'Cpu',
    isFeatured: true,
    shortDescription:
      'Custom LLM integrations, retrieval-augmented generation (RAG) pipelines, and intelligent workflow automation.',
    fullDescription:
      'Empower your company with state-of-the-art artificial intelligence. We build custom RAG pipelines that securely unlock your internal documentation, automate repetitive knowledge workflows, and integrate cutting-edge LLMs with your existing databases.',
    features: [
      'RAG (Retrieval-Augmented Generation) architectures with vector databases',
      'Fine-tuning and prompt engineering for domain-specific accuracy',
      'Private enterprise model deployments with strict data boundary protections',
      'Automated semantic document classification and data extraction',
      'LangChain and LlamaIndex agentic workflow orchestration',
    ],
    deliverables: [
      'Vector database setup and embedding generation pipeline',
      'Custom AI assistant backend with streaming responses',
      'Enterprise evaluation benchmark suite measuring accuracy and hallucination rates',
      'Admin monitoring portal for usage and token metrics',
    ],
    technologies: ['Python', 'OpenAI', 'LangChain', 'Pinecone', 'FastAPI', 'PyTorch'],
    processSteps: [
      {
        title: 'Data Ingestion & Hygiene',
        description: 'Sanitizing, chunking, and indexing unstructured proprietary data.',
      },
      {
        title: 'Model Evaluation & Prototyping',
        description: 'Testing prompt chains, embeddings, and context window limits.',
      },
      {
        title: 'System Integration',
        description: 'Exposing streaming endpoints to your frontend web and mobile apps.',
      },
      {
        title: 'Guardrail Enforcement',
        description: 'Implementing strict content filtering and PII redaction filters.',
      },
    ],
  },
  {
    id: 'srv-5',
    slug: 'ui-ux-product-design',
    title: 'UI/UX Product Design & Design Systems',
    category: 'Design',
    iconName: 'Palette',
    isFeatured: false,
    shortDescription:
      'Human-centered digital design, high-fidelity prototypes, and comprehensive design systems built for seamless developer handoff.',
    fullDescription:
      'Great software balances raw capability with effortless usability. Our design team creates cohesive visual systems, interactive Figma prototypes, and component libraries that reduce cognitive load and delight your users from their very first click.',
    features: [
      'User journey mapping, wireframing, and interactive clickable prototypes',
      'Comprehensive design systems with tokens, variants, and guidelines',
      'Accessibility audits adhering to WCAG 2.1 AAA contrast guidelines',
      'Micro-interactions and motion design specifications',
      'Seamless Figma-to-Tailwind CSS component specifications',
    ],
    deliverables: [
      'Figma master design file with organized component library',
      'Interactive prototype for stakeholder presentations',
      'Exported icon, typography, and illustration assets',
      'Design tokens documentation (colors, spacing, elevations)',
    ],
    technologies: ['Figma', 'FigJam', 'Tailwind CSS', 'Framer', 'Storybook'],
    processSteps: [
      {
        title: 'User Research & Discovery',
        description: 'Customer interviews, competitor audits, and workflow teardowns.',
      },
      {
        title: 'Information Architecture',
        description: 'Low-fidelity wireframing and user task flow mapping.',
      },
      {
        title: 'High-Fidelity Visual Design',
        description: 'Crafting pixel-perfect screens, dark/light themes, and UI states.',
      },
      {
        title: 'Design System Documentation',
        description: 'Standardizing tokens and preparing components for development handoff.',
      },
    ],
  },
  {
    id: 'srv-6',
    slug: 'cybersecurity-compliance',
    title: 'Cybersecurity & Compliance',
    category: 'Security',
    iconName: 'ShieldCheck',
    isFeatured: false,
    shortDescription:
      'Application penetration testing, vulnerability remediation, and SOC 2 / ISO 27001 readiness engineering.',
    fullDescription:
      'Protect your intellectual property, client trust, and compliance standing. We perform deep security code audits, architectural threat modeling, and implement bank-grade encryption protocols so you can pass enterprise vendor assessments with confidence.',
    features: [
      'Static and Dynamic Application Security Testing (SAST & DAST)',
      'OWASP Top 10 vulnerability remediation',
      'SOC 2 Type II and ISO 27001 readiness technical gap assessments',
      'Role-based access control (RBAC) and OAuth2 / OIDC hardening',
      'Encrypted data-at-rest and data-in-transit compliance verification',
    ],
    deliverables: [
      'Comprehensive vulnerability assessment and remediation report',
      'Security posture roadmap with prioritized action items',
      'Hardened authentication and authorization middleware',
      'SOC 2 readiness documentation package',
    ],
    technologies: ['Snyk', 'SonarQube', 'Vault', 'OAuth2', 'OWASP ZAP', 'AWS KMS'],
    processSteps: [
      {
        title: 'Threat Modeling',
        description: 'Identifying attack vectors, entry points, and high-risk assets.',
      },
      {
        title: 'Automated & Manual Pen-Testing',
        description: 'Simulating intrusion scenarios and inspecting dependencies.',
      },
      {
        title: 'Code Hardening',
        description: 'Refactoring authentication gates and closing cryptographic gaps.',
      },
      {
        title: 'Compliance Certification Prep',
        description: 'Generating audit-ready evidence and continuous compliance monitors.',
      },
    ],
  },
];

