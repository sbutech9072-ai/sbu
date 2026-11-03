'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/shared/section-heading';
import { cn } from '@/lib/utils';

export function Technologies() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'cloud' | 'ai'>('all');

  const techCategories = [
    {
      category: 'frontend',
      label: 'Frontend & Mobile',
      items: [
        { name: 'Next.js', tag: 'Framework', desc: 'App Router, RSC, Edge SSR' },
        { name: 'React', tag: 'Core', desc: 'Component architecture & hooks' },
        { name: 'TypeScript', tag: 'Language', desc: 'Strict end-to-end type safety' },
        { name: 'Tailwind CSS', tag: 'Styling', desc: 'Design tokens & responsive UI' },
        { name: 'React Native', tag: 'Mobile', desc: 'Cross-platform native apps' },
      ],
    },
    {
      category: 'backend',
      label: 'Backend & Data',
      items: [
        { name: 'Node.js', tag: 'Runtime', desc: 'High-concurrency microservices' },
        { name: 'Go (Golang)', tag: 'Systems', desc: 'Ultra-low latency streaming APIs' },
        { name: 'PostgreSQL', tag: 'Database', desc: 'ACID relational data modeling' },
        { name: 'Redis', tag: 'Cache', desc: 'In-memory caching & pub/sub' },
        { name: 'ClickHouse', tag: 'Analytics', desc: 'Columnar telemetry ingestion' },
      ],
    },
    {
      category: 'cloud',
      label: 'Cloud & Infrastructure',
      items: [
        { name: 'AWS', tag: 'Cloud', desc: 'EKS, Lambda, S3, RDS, CloudFront' },
        { name: 'GCP', tag: 'Cloud', desc: 'Google Cloud Platform & BigQuery' },
        { name: 'Kubernetes', tag: 'Orchestration', desc: 'Container auto-scaling & clusters' },
        { name: 'Terraform', tag: 'IaC', desc: 'Reproducible declarative infra' },
        { name: 'Docker', tag: 'Containers', desc: 'Immutable multi-stage builds' },
      ],
    },
    {
      category: 'ai',
      label: 'AI & Data Engineering',
      items: [
        { name: 'Python', tag: 'Language', desc: 'Data modeling & ML pipelines' },
        { name: 'LangChain', tag: 'Orchestration', desc: 'Autonomous agentic workflows' },
        { name: 'Pinecone', tag: 'Vector DB', desc: 'Sub-millisecond semantic search' },
        { name: 'OpenAI / Claude', tag: 'LLMs', desc: 'Custom enterprise fine-tuning' },
        { name: 'PyTorch', tag: 'Deep Learning', desc: 'Embedding & model training' },
      ],
    },
  ];

  const filteredCategories =
    activeCategory === 'all'
      ? techCategories
      : techCategories.filter((c) => c.category === activeCategory);

  return (
    <section className="py-20 md:py-28 border-b border-[#1E5A54]/18 bg-[#EEE6E2]">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <SectionHeading
          badge="Technology Stack"
          title="Engineered With Modern, High-Performance Tools"
          subtitle="We select battle-tested, high-concurrency technologies designed for security, velocity, and sub-second response times."
        />

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Technologies' },
            { id: 'frontend', label: 'Frontend' },
            { id: 'backend', label: 'Backend' },
            { id: 'cloud', label: 'Cloud & DevOps' },
            { id: 'ai', label: 'AI & Data' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={cn(
                'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.16em] transition-all',
                activeCategory === tab.id
                  ? 'bg-[#1E5A54] text-[#EEE6E2]'
                  : 'border border-[#1E5A54]/25 bg-transparent text-[#1E5A54] hover:bg-[#1E5A54]/5'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tech Grid */}
        <div className="space-y-10">
          {filteredCategories.map((catGroup) => (
            <div key={catGroup.category} className="space-y-4">
              <h4 className="font-headline text-lg font-bold uppercase tracking-wider text-[#1E5A54] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D]" />
                <span>{catGroup.label}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {catGroup.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="p-5 rounded-2xl border border-[#1E5A54]/18 bg-[#EEE6E2] hover:border-[#1E5A54]/35 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-headline text-base font-bold uppercase tracking-tight text-[#1E5A54]">
                        {item.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#1E5A54]/60">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#1E5A54]/80 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
