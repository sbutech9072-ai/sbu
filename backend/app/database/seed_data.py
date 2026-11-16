from typing import List, Dict, Any

SEED_ADMIN = {
    "email": "admin@sbutech.internal",
    "password": "password123",
    "full_name": "SBU Principal Architect",
    "role": "owner",
    "country": "United States of America",
    "whatsapp_number": "+14158903412",
}

SEED_SERVICES: List[Dict[str, Any]] = [
    {
        "id": "srv-1",
        "slug": "custom-web-application-development",
        "title": "Custom Web Application Development",
        "short_description": "We engineer production web applications using Next.js, React, Node.js, and Python FastAPI.",
        "full_description": "Our custom web app engineering focuses on sub-second rendering, deterministic state hydration, and resilient transactional databases.",
        "icon_name": "Code2",
        "category": "Web Engineering",
        "features": ["React & Next.js 14 App Router", "Strict TypeScript & Type-Safe APIs", "FastAPI & Distributed Queues", "Real-Time WebSocket Sync"],
        "deliverables": ["Production-tested Monorepo", "CI/CD Deployment Pipelines", "Architecture Diagram & OpenAPI Spec"],
        "technologies": ["Next.js", "React", "TypeScript", "FastAPI", "Tailwind CSS", "PostgreSQL"],
        "process_steps": [
            {"title": "01. Architecture & Schema Modeling", "description": "We define domain entities and invariant rules."},
            {"title": "02. Milestone Sprints", "description": "Continuous delivery with review builds every week."}
        ],
        "is_featured": True,
    },
    {
        "id": "srv-2",
        "slug": "cloud-architecture-and-devops",
        "title": "Cloud Architecture & DevOps",
        "short_description": "Multi-region Kubernetes clusters, automated zero-downtime deployment pipelines, and SOC 2 compliance.",
        "full_description": "We design scalable cloud infrastructure on AWS, Google Cloud, and Cloudflare with Terraform and GitOps workflows.",
        "icon_name": "Cloud",
        "category": "Cloud & Infrastructure",
        "features": ["Terraform Infrastructure as Code", "Kubernetes (EKS/GKE)", "Zero-Downtime Blue/Green Deploys", "Automated Backup & Disaster Recovery"],
        "deliverables": ["Terraform Modules & State Vault", "ArgoCD GitOps Manifests", "Prometheus & Grafana Dashboards"],
        "technologies": ["AWS", "Google Cloud", "Kubernetes", "Terraform", "Docker", "Prometheus"],
        "process_steps": [
            {"title": "01. Cloud Assessment", "description": "Audit security posture, IAM permissions, and bottlenecks."},
            {"title": "02. GitOps Infrastructure", "description": "Automated pipeline provisioning and secret injection."}
        ],
        "is_featured": True,
    },
    {
        "id": "srv-3",
        "slug": "ai-and-private-llm-workflows",
        "title": "AI & Private LLM Workflows",
        "short_description": "Enterprise Retrieval-Augmented Generation (RAG), vector databases, and semantic search pipelines.",
        "full_description": "We build secure, private AI applications that connect company knowledge bases to frontier LLMs without data leakage.",
        "icon_name": "Cpu",
        "category": "Applied AI",
        "features": ["Hybrid BM25 & Dense Vector Retrieval", "Document Parsing & OCR Pipeline", "Deterministic Evaluation Harness", "Local Offline LLM Deployment"],
        "deliverables": ["Vector Database Integration", "Fine-Tuned Embeddings & Prompts", "Observability Dashboard"],
        "technologies": ["LangChain", "Qdrant", "pgvector", "OpenAI", "HuggingFace", "FastAPI"],
        "process_steps": [
            {"title": "01. Knowledge Ingestion", "description": "Chunking and indexing technical corpus."},
            {"title": "02. Retrieval Tuning", "description": "Benchmarking precision, recall, and hallucination guardrails."}
        ],
        "is_featured": True,
    }
]

SEED_MESSAGES: List[Dict[str, Any]] = [
    {
        "id": "msg-1",
        "name": "Jonathan Miller",
        "email": "jmiller@apexlogistics.io",
        "phone": "+1 (555) 782-9011",
        "subject": "Enterprise Cloud Migration Consultation",
        "message": "We are planning to move our legacy dispatch backend to AWS EKS with Terraform and GitHub Actions CI/CD. Can we book a 30-minute technical call next Tuesday?",
        "status": "new",
    },
    {
        "id": "msg-2",
        "name": "Sophia Patel",
        "email": "sophia@healthbridge.co",
        "phone": "+1 (555) 442-1920",
        "subject": "HIPAA-Compliant Patient Portal Architecture",
        "message": "We read your Zenith Health case study and need a similar WebRTC video consultation portal with Epic EHR sync. How do you structure initial architecture sprints?",
        "status": "read",
    },
    {
        "id": "msg-3",
        "name": "Alexander Wright",
        "email": "a.wright@solisfintech.com",
        "phone": "+44 20 7946 0912",
        "subject": "Cross-Platform React Native Fintech App",
        "message": "Our team is launching a multi-currency business account app in the UK and needs senior React Native engineers to own the mobile wallet and biometric auth layer.",
        "status": "replied",
    }
]

