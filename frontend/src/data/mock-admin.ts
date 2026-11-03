import { ContactMessage, QuoteRequest, SiteSettings } from '@/types';

export const mockMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Jonathan Miller',
    email: 'jmiller@apexlogistics.io',
    phone: '+1 (555) 782-9011',
    subject: 'Enterprise Cloud Migration Consultation',
    message:
      'We are planning to move our legacy dispatch backend to AWS EKS with Terraform and GitHub Actions CI/CD. Can we book a 30-minute technical call next Tuesday?',
    createdAt: '2026-10-30T14:32:00Z',
    status: 'new',
  },
  {
    id: 'msg-2',
    name: 'Sophia Patel',
    email: 'sophia@healthbridge.co',
    phone: '+1 (555) 442-1920',
    subject: 'HIPAA-Compliant Patient Portal Architecture',
    message:
      'We read your Zenith Health case study and need a similar WebRTC video consultation portal with Epic EHR sync. How do you structure initial architecture sprints?',
    createdAt: '2026-10-29T10:15:00Z',
    status: 'read',
  },
  {
    id: 'msg-3',
    name: 'Alexander Wright',
    email: 'a.wright@solisfintech.com',
    phone: '+44 20 7946 0912',
    subject: 'Cross-Platform React Native Fintech App',
    message:
      'Our team is launching a multi-currency business account app in the UK and needs senior React Native engineers to own the mobile wallet and biometric auth layer.',
    createdAt: '2026-10-28T16:45:00Z',
    status: 'replied',
  },
  {
    id: 'msg-4',
    name: 'Emma Lindqvist',
    email: 'elindqvist@nordicmedia.se',
    phone: '+46 8 123 456',
    subject: 'Design System & Component Monorepo',
    message:
      'We want to consolidate 6 European media properties into one shared Next.js and Tailwind CSS component monorepo. What is a realistic timeline for token and Storybook setup?',
    createdAt: '2026-10-26T09:20:00Z',
    status: 'replied',
  },
];

export const mockQuoteRequests: QuoteRequest[] = [
  {
    id: 'qr-1',
    fullName: 'Robert Henderson',
    companyName: 'Vanguard Retail Systems',
    email: 'r.henderson@vanguard-retail.com',
    phone: '+1 (555) 234-8901',
    serviceCategory: 'Custom Web Application Development',
    budgetRange: '$50,000 - $100,000',
    timeline: '3 - 6 Months',
    projectOverview:
      'We need a multi-tenant B2B wholesale portal managing 15,000 SKUs, live inventory sync with SAP, and automated net-30 customer credit rules.',
    featuresNeeded: [
      'Multi-tenant authentication',
      'Real-time inventory sync',
      'Custom invoice PDF generation',
      'Payment gateway integration (Stripe & ACH)',
      'Admin analytics dashboard',
    ],
    createdAt: '2026-10-31T08:12:00Z',
    status: 'pending',
  },
  {
    id: 'qr-2',
    fullName: 'Camilla Vasquez',
    companyName: 'BioGenix Diagnostics',
    email: 'cvasquez@biogenix.org',
    phone: '+1 (555) 901-4433',
    serviceCategory: 'AI & Machine Learning Solutions',
    budgetRange: '$100,000+',
    timeline: '6+ Months',
    projectOverview:
      'Building an on-premise RAG system that ingests clinical research PDFs, parses assay tables, and helps lab scientists cross-reference prior studies with exact citations.',
    featuresNeeded: [
      'Private offline vector search',
      'PDF OCR and table extraction',
      'Role-based data access control',
      'Custom fine-tuned evaluation benchmark',
    ],
    createdAt: '2026-10-29T18:25:00Z',
    status: 'reviewing',
  },
  {
    id: 'qr-3',
    fullName: 'Liam Thorne',
    companyName: 'Kestrel Aerospace Logistics',
    email: 'liam@kestrel-aero.com',
    phone: '+1 (555) 678-1122',
    serviceCategory: 'Cloud Architecture & DevOps',
    budgetRange: '$25,000 - $50,000',
    timeline: '1 - 3 Months',
    projectOverview:
      'Migrating our container workloads to Kubernetes on AWS GovCloud with strict SOC 2 Type II and FedRAMP readiness controls.',
    featuresNeeded: [
      'Terraform IaC automation',
      'Prometheus and Grafana observability',
      'Automated disaster recovery drills',
    ],
    createdAt: '2026-10-27T11:40:00Z',
    status: 'contacted',
  },
];

export const defaultSiteSettings: SiteSettings = {
  companyName: 'Sbu Tech',
  contactEmail: 'contact@sbutech.com',
  salesEmail: 'hello@sbutech.com',
  phoneNumber: '+1 (555) 382-4900',
  officeAddress: '100 Innovation Way, Suite 400, San Francisco, CA 94107',
  metaTitle: 'Sbu Tech | Software Engineering & Digital Product Studio',
  metaDescription:
    'Sbu Tech is a software engineering studio based in San Francisco. We build production web applications, cloud infrastructure, and private AI systems for growing engineering teams.',
  enableMaintenanceMode: false,
  enableRegistration: true,
};
