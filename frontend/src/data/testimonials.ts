import { Testimonial } from '@/types';

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    quote:
      'Sbu Tech rebuilt our entire telemetry pipeline in Go, Kafka, and ClickHouse. We went from multi-minute timeouts to ingesting 100M+ daily events with sub-second Next.js dashboard queries, and their engineers wrote code our own team actually enjoys maintaining.',
    author: 'Rachel Sterling (Sample Testimonial)',
    title: 'Chief Technology Officer',
    company: 'PulseFlow Systems Inc.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    projectSlug: 'pulseflow-analytics-saas',
    verifiedClient: true,
  },
  {
    id: 'test-2',
    quote:
      'We shipped NovaVault across Europe and North America two weeks ahead of our board deadline. Sbu Tech owned the hardest parts of the stack: hardware biometric signing, offline ledger sync, and passing our PCI-DSS Level 1 audit on the first attempt.',
    author: 'Liam O’Connor (Sample Testimonial)',
    title: 'Head of Mobile Engineering',
    company: 'NovaPay Financial Group',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    projectSlug: 'novavault-fintech-mobile',
    verifiedClient: true,
  },
  {
    id: 'test-3',
    quote:
      'Moving 45 live microservices onto AWS EKS without pausing seaport dispatch sounded like a recipe for an outage. Sbu Tech used dual-write replication and weighted DNS cutovers to migrate the whole fleet with zero dropped shipments, saving us over $200k a year.',
    author: 'Derrick Thorne (Sample Testimonial)',
    title: 'VP of Global Infrastructure',
    company: 'Stratos Logistics',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    projectSlug: 'stratos-cloud-migration',
    verifiedClient: true,
  },
  {
    id: 'test-4',
    quote:
      'Every commercial AI vendor we tried hallucinated case law or wanted us to upload confidential briefs to their cloud. Sbu Tech deployed an on-premise RAG system over our 2.5M documents that cites exact paragraphs and cut initial contract review from six hours to 45 minutes.',
    author: 'Victoria Vance (Sample Testimonial)',
    title: 'Senior Managing Partner',
    company: 'Lexicon Partners Law',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    projectSlug: 'lexicon-ai-legal-copilot',
    verifiedClient: true,
  },
];
