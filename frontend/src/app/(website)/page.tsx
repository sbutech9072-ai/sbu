import { Metadata } from 'next';
import { Hero } from '@/components/sections/hero';
import { CompanyIntro } from '@/components/sections/company-intro';
import { ServicesOverview } from '@/components/sections/services-overview';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { DevelopmentProcess } from '@/components/sections/development-process';
import { Technologies } from '@/components/sections/technologies';
import { TeamOverview } from '@/components/sections/team-overview';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { CTASection } from '@/components/sections/cta-section';
import { ContactSection } from '@/components/sections/contact-section';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.name} | Modern Software Engineering & Cloud Solutions`,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CompanyIntro />
      <ServicesOverview />
      <FeaturedProjects />
      <WhyChooseUs />
      <DevelopmentProcess />
      <Technologies />
      <TeamOverview />
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
    </>
  );
}

