export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  category: string;
  features: string[];
  deliverables: string[];
  technologies: string[];
  processSteps: { title: string; description: string }[];
  isFeatured?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: 'Web App' | 'Mobile App' | 'Cloud & DevOps' | 'AI & Data';
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  year: number;
  duration: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  challenge: string;
  solution: string;
  results: string[];
  isFeatured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Leadership' | 'Engineering' | 'Design' | 'Product';
  avatar: string;
  bio: string;
  skills: string[];
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  isLeadership?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Engineering' | 'Architecture' | 'Design' | 'AI & Tech';
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  isFeatured?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  avatar: string;
  rating: number;
  projectSlug?: string;
  verifiedClient: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  serviceCategory: string;
  budgetRange: string;
  timeline: string;
  projectOverview: string;
  featuresNeeded: string[];
  createdAt: string;
  status: 'pending' | 'reviewing' | 'contacted' | 'archived';
}

export interface SiteSettings {
  companyName: string;
  contactEmail: string;
  salesEmail: string;
  phoneNumber: string;
  officeAddress: string;
  metaTitle: string;
  metaDescription: string;
  enableMaintenanceMode: boolean;
  enableRegistration: boolean;
}

