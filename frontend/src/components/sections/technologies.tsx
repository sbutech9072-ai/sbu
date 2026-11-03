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
    <section className="py-20 md:py-28 border-b border-slate-800/80">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <SectionHeading
          badge="Technology Stack"
          title="Engineered with the Industry's Most Modern Tools"
          subtitle="We select technologies that maximize developer productivity, operational reliability, and user-facing speed."
        />

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold transition-colors',
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            )}
          >
            All Technologies
          </button>
          {techCategories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category as any)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold transition-colors',
                activeCategory === cat.category
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Categorized Tech Grid */}
        <div className="space-y-8">
          {filteredCategories.map((group) => (
            <div key={group.category} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                {group.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.items.map((tech) => (
                  <div
                    key={tech.name}
                    className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/90 hover:border-slate-700 transition-all duration-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{tech.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {tech.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{tech.desc}</p>
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

