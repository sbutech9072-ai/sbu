import { Testimonial } from '@/types';

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    quote:
      'Sbu Tech engineered our analytics engine from the ground up. Their deep mastery of Next.js, Go, and Kafka allowed us to ingest 100M+ events every day with sub-second dashboard updates. They are genuine partners, not just contractors.',
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
      'We launched NovaVault across two continents ahead of schedule. Sbu Tech took ownership of our mobile security, biometric keys, and automated regulatory compliance. Their code quality is exemplary.',
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
      'Migrating 45 live enterprise microservices to AWS EKS with zero downtime felt impossible. The Sbu Tech team executed the entire switch without dropping a single shipment request. Our annual server costs dropped by nearly $200k.',
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
      'The AI legal copilot Sbu Tech built has saved our attorneys hundreds of hours every week. More importantly, they solved our private data privacy requirements with dedicated models and verifiable citations.',
    author: 'Victoria Vance (Sample Testimonial)',
    title: 'Senior Managing Partner',
    company: 'Lexicon Partners Law',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    projectSlug: 'lexicon-ai-legal-copilot',
    verifiedClient: true,
  },
];
