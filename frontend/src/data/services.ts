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
      'Production web platforms built on Next.js, React, Node.js, and PostgreSQL for high-concurrency workloads.',
    fullDescription:
      'We build web applications structured around your actual operational bottlenecks. Whether you need a multi-tenant SaaS product, an internal operations console, or a real-time data platform, we write strict, type-safe TypeScript and SQL that your internal engineers can read, test, and maintain years later.',
    features: [
      'Next.js App Router and React Server Components for fast initial loads',
      'Modular service boundaries with explicit REST and GraphQL contracts',
      'End-to-end runtime validation using TypeScript and Zod schemas',
      'WebSocket and Server-Sent Events (SSE) pipelines for live state updates',
      'Keyboard navigation and WCAG 2.1 AA/AAA accessibility built in from day one',
    ],
    deliverables: [
      'Production-ready Next.js and React repository with clean git history',
      'OpenAPI / GraphQL schema documentation and Postman collections',
      'Automated unit, integration, and Playwright end-to-end test suites',
      'Containerized Docker builds and CI/CD deployment workflows',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    processSteps: [
      {
        title: 'Domain & Schema Design',
        description: 'We map database tables, indexing strategies, and API payloads before writing UI code.',
      },
      {
        title: 'Two-Week Engineering Sprints',
        description: 'We ship working code to a shared staging environment every Friday for direct review.',
      },
      {
        title: 'Load & Edge-Case Testing',
        description: 'We run k6 load tests and automated browser checks against realistic traffic spikes.',
      },
      {
        title: 'Zero-Downtime Cutover',
        description: 'We deploy behind feature flags with automated database migrations and instant rollback hooks.',
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
      'Reproducible Terraform infrastructure, Kubernetes cluster operations, and CI/CD pipelines across AWS and GCP.',
    fullDescription:
      'We replace brittle manual server setups with version-controlled infrastructure code. Our engineers design multi-availability-zone Kubernetes clusters, tighten IAM permissions, and cut wasted cloud spend without trading away reliability.',
    features: [
      'Declarative Infrastructure as Code (IaC) using Terraform and OpenTofu',
      'EKS and GKE Kubernetes cluster hardening with horizontal pod autoscaling',
      'Multi-region failover routing and automated database backup verification',
      'Full-stack telemetry with Prometheus, Grafana, OpenTelemetry, and Datadog',
      'Cloud cost audits targeting idle compute, unattached volumes, and NAT gateway fees',
    ],
    deliverables: [
      'Modular Terraform state and environment repositories',
      'Production Helm charts and Kubernetes network security policies',
      'GitHub Actions or GitLab CI pipelines with staging promotion gates',
      'Incident response runbooks and on-call escalation playbooks',
    ],
    technologies: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus', 'GitHub Actions'],
    processSteps: [
      {
        title: 'Infrastructure & Billing Audit',
        description: 'We inspect your current cloud bill, network topology, and deployment failure points.',
      },
      {
        title: 'Network & Cluster Blueprint',
        description: 'We design isolated VPC subnets, least-privilege IAM roles, and cluster sizing.',
      },
      {
        title: 'Terraform & Pipeline Build',
        description: 'We codify every resource in Terraform and wire up automated container builds.',
      },
      {
        title: 'Live Traffic Cutover',
        description: 'We shift DNS traffic in weighted stages and tune PagerDuty alert thresholds.',
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
      'iOS and Android applications built with React Native and Flutter, engineered for unreliable networks and 60fps UI.',
    fullDescription:
      'Mobile users do not forgive laggy scroll views or lost form data when a train enters a tunnel. We build cross-platform iOS and Android apps with local SQLite sync engines, hardware-backed biometric keys, and deterministic release pipelines to the App Store and Google Play.',
    features: [
      'Shared TypeScript or Dart codebase with native Swift/Kotlin bridges where needed',
      'Offline-first local storage and conflict resolution with SQLite and WatermelonDB',
      'Hardware enclave biometrics (FaceID, TouchID, and Android BiometricPrompt)',
      'Deep linking, background push notifications, and over-the-air hotfixes',
      'Automated Fastlane signing and store review compliance checks',
    ],
    deliverables: [
      'Signed iOS (.ipa) and Android (.aab) production binaries',
      'Complete mobile source repository with native module documentation',
      'App Store Connect and Google Play Console release pipelines',
      'Sentry crash reporting and frame-drop telemetry dashboards',
    ],
    technologies: ['React Native', 'Expo', 'Flutter', 'TypeScript', 'Redux Toolkit', 'Firebase'],
    processSteps: [
      {
        title: 'Navigation & Gesture Prototyping',
        description: 'We test thumb reachability, sheet transitions, and navigation stacks on physical devices.',
      },
      {
        title: 'Offline Sync & State Layer',
        description: 'We build the local persistence layer first so the app works even in airplane mode.',
      },
      {
        title: 'Physical Device QA',
        description: 'We profile memory usage and frame timing across older Android handsets and current iPhones.',
      },
      {
        title: 'Store Review & Rollout',
        description: 'We handle Apple and Google review submissions, phased rollouts, and crash monitoring.',
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
      'Private retrieval-augmented generation (RAG) pipelines, hybrid search systems, and evaluated LLM workflows.',
    fullDescription:
      'Most AI demos fail in production because they hallucinate facts or leak private records. We build retrieval systems grounded in your internal documents, combining keyword and vector search with strict citation checks and zero third-party model training on your data.',
    features: [
      'Hybrid retrieval pipelines combining BM25 keyword search with dense vector embeddings',
      'Cross-encoder reranking and deterministic prompt evaluation suites',
      'Private VPC or on-premise model hosting with strict tenant isolation',
      'Structured JSON extraction from messy PDFs, tables, and scanned contracts',
      'Token-budget rate limiting, caching, and latency tracing per user request',
    ],
    deliverables: [
      'Automated document ingestion, chunking, and vector indexing pipeline',
      'FastAPI inference service with Server-Sent Events (SSE) token streaming',
      'Golden-dataset evaluation harness measuring precision, recall, and groundedness',
      'Internal admin dashboard tracking token costs and flagged responses',
    ],
    technologies: ['Python', 'OpenAI', 'LangChain', 'Pinecone', 'FastAPI', 'PyTorch'],
    processSteps: [
      {
        title: 'Corpus Audit & Chunking',
        description: 'We clean your source PDFs, wikis, and SQL records and test chunk boundaries.',
      },
      {
        title: 'Eval Harness Construction',
        description: 'We build a test suite of 100+ real domain questions before tuning prompts or models.',
      },
      {
        title: 'API & UI Integration',
        description: 'We wire streaming responses and clickable source citations into your product.',
      },
      {
        title: 'PII Redaction & Guardrails',
        description: 'We enforce input/output filters to block prompt injection and redact sensitive fields.',
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
      'Interface architecture, interactive Figma prototypes, and tokenized component libraries built directly alongside engineers.',
    fullDescription:
      'We do not hand over static dribbble mockups that fall apart once real data loads. Our designers work directly with frontend engineers to map dense workflows, test prototypes with actual operators, and ship Figma variables that map 1:1 to Tailwind CSS tokens.',
    features: [
      'Task-flow mapping, information architecture, and clickable Figma prototypes',
      'Tokenized multi-brand design systems covering spacing, type scales, and states',
      'WCAG 2.1 AAA contrast verification and screen-reader focus order specs',
      'Empty states, loading skeletons, error boundaries, and dense table layouts',
      'Direct Figma-to-Storybook component parity with zero translation guesswork',
    ],
    deliverables: [
      'Structured Figma library with auto-layout components and variable modes',
      'Interactive user-testing prototype for stakeholder and customer validation',
      'Custom SVG icon set and typographic hierarchy guidelines',
      'Exported CSS/JSON design tokens synced to your frontend repository',
    ],
    technologies: ['Figma', 'FigJam', 'Tailwind CSS', 'Framer', 'Storybook'],
    processSteps: [
      {
        title: 'Workflow Teardown',
        description: 'We watch real users complete tasks in your current tool to spot friction and dead ends.',
      },
      {
        title: 'Wireframes & Information Density',
        description: 'We map screen hierarchy and data density using low-fidelity structural layouts.',
      },
      {
        title: 'Visual System & States',
        description: 'We design every interactive state: hover, focus, validation error, and bulk selection.',
      },
      {
        title: 'Storybook Spec Handoff',
        description: 'We pair with engineering to verify spacing, typography, and responsive breakpoints in code.',
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
      'Application penetration testing, dependency auditing, and technical remediation for SOC 2 Type II and ISO 27001.',
    fullDescription:
      'Enterprise deals stall when your team cannot answer a security questionnaire or pass a third-party penetration test. We audit your codebase, lock down authentication flows, encrypt sensitive stores, and set up automated compliance evidence collection.',
    features: [
      'Static and Dynamic Application Security Testing (SAST and DAST) in CI pipelines',
      'Manual penetration testing targeting OWASP Top 10 and business-logic flaws',
      'SOC 2 Type II, HIPAA, and ISO 27001 technical gap remediation',
      'Fine-grained RBAC, OAuth2 / OIDC session hardening, and key rotation',
      'Envelope encryption for data at rest (AWS KMS / Vault) and TLS 1.3 in transit',
    ],
    deliverables: [
      'Prioritized vulnerability report with proof-of-concept exploits and code patches',
      'Hardened authentication middleware and session management implementation',
      'Automated CI dependency scanning and container image signing setup',
      'Auditor-ready architecture diagrams and access-control policy documentation',
    ],
    technologies: ['Snyk', 'SonarQube', 'Vault', 'OAuth2', 'OWASP ZAP', 'AWS KMS'],
    processSteps: [
      {
        title: 'Threat Modeling',
        description: 'We trace trust boundaries, data flows, and privilege escalation paths across your stack.',
      },
      {
        title: 'Penetration Testing',
        description: 'We attempt real credential stuffing, IDOR, injection, and SSRF attacks against staging.',
      },
      {
        title: 'Patch & Harden',
        description: 'We ship pull requests to fix vulnerabilities, tighten CSP headers, and rotate secrets.',
      },
      {
        title: 'Audit Verification',
        description: 'We re-test every finding and package technical evidence for your external auditors.',
      },
    ],
  },
];
