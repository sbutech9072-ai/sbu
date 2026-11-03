import { ContactMessage, QuoteRequest, SiteSettings } from '@/types';

export const mockMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Jonathan Miller',
    email: 'jmiller@apexlogistics.io',
    phone: '+1 (555) 782-9011',
    subject: 'Enterprise Cloud Migration Consultation',
    message:
      'We are looking to modernize our legacy logistics backend to AWS EKS with Kubernetes and automated CI/CD. Would love to schedule a 30-minute discovery call next Tuesday.',
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
      'We read your case study on Zenith Health and want to build a similar WebRTC tele-consultation platform with EHR sync. Please share your typical project engagement structure.',
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
      'Our team is launching a digital banking solution in the UK and needs experienced mobile architects to build our native crypto & fiat exchange application.',
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
      'We want to consolidate 6 European media storefronts into a unified Next.js and Tailwind CSS design system. What is your estimated timeline for design and token setup?',
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
      'We need a multi-tenant B2B wholesale platform for managing 15,000 SKUs, real-time inventory synchronization with SAP, and automated customer credit limits.',
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
      'Building an on-premise RAG pipeline that processes biomedical research papers, indexes gene sequences, and assists researchers with semantic literature cross-referencing.',
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
      'Modernizing infrastructure to Kubernetes on AWS GovCloud with strict SOC 2 and FedRAMP readiness controls.',
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
  metaTitle: 'Sbu Tech | Modern Software Engineering & Digital Product Studio',
  metaDescription:
    'Sbu Tech builds scalable cloud software, enterprise web applications, and intuitive digital experiences for high-growth companies worldwide.',
  enableMaintenanceMode: false,
  enableRegistration: true,
};

