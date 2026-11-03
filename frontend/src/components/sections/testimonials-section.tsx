import React from 'react';
import { testimonialsData } from '@/data/testimonials';
import { TestimonialCard } from '@/features/testimonials/testimonial-card';
import { SectionHeading } from '@/components/shared/section-heading';

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 border-b border-slate-800/80">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <SectionHeading
          badge="Client Endorsements"
          title="What Engineering & Product Leaders Say About Sbu Tech"
          subtitle="Honest feedback from technology executives who trust our team with their mission-critical software systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonialsData.map((test) => (
            <TestimonialCard key={test.id} testimonial={test} />
          ))}
        </div>
      </div>
    </section>
  );
}

