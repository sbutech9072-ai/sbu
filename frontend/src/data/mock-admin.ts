import { ContactMessage, SiteSettings } from '@/types';

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
