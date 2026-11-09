'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/shared/section-heading';
import { StudioStamp } from '@/components/human/hand-crafted-svg';
import { cn } from '@/lib/utils';

export function Technologies() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'cloud' | 'ai'>('all');

  const techCategories = [
    {
      category: 'frontend',
      code: 'LAYER 01',
      label: 'Frontend & Mobile Clients',
      items: [
        { name: 'Next.js', tag: 'App Router', desc: 'React Server Components & Edge SSR' },
        { name: 'React 19', tag: 'UI Core', desc: 'Concurrent rendering & strict hooks' },
        { name: 'TypeScript', tag: 'Type System', desc: 'Strict end-to-end schema safety' },
        { name: 'Tailwind CSS', tag: 'Design Tokens', desc: 'Deterministic utility styling' },
        { name: 'React Native', tag: 'iOS / Android', desc: '60fps native mobile clients' },
      ],
    },
    {
      category: 'backend',
      code: 'LAYER 02',
      label: 'Backend & Data Storage',
      items: [
        { name: 'Go (Golang)', tag: 'Systems', desc: 'Low-latency concurrent microservices' },
        { name: 'Node.js', tag: 'Runtime', desc: 'Event-driven API & worker services' },
        { name: 'PostgreSQL', tag: 'Relational', desc: 'ACID transactions & JSONB indexing' },
        { name: 'Redis', tag: 'In-Memory', desc: 'Sub-millisecond cache & pub/sub' },
        { name: 'ClickHouse', tag: 'Columnar OLAP', desc: '100M+ daily event telemetry queries' },
      ],
    },
    {
      category: 'cloud',
      code: 'LAYER 03',
      label: 'Cloud & Infrastructure',
      items: [
        { name: 'AWS', tag: 'Cloud Core', desc: 'EKS, RDS, S3, Lambda, CloudFront' },
        { name: 'GCP', tag: 'Data Cloud', desc: 'GKE clusters & BigQuery analytics' },
        { name: 'Kubernetes', tag: 'Orchestration', desc: 'Auto-scaling multi-zone workloads' },
        { name: 'Terraform', tag: 'IaC', desc: 'Versioned declarative infrastructure' },
        { name: 'Docker', tag: 'Containers', desc: 'Reproducible multi-stage images' },
      ],
    },
    {
      category: 'ai',
      code: 'LAYER 04',
      label: 'AI & Retrieval Pipelines',
      items: [
        { name: 'Python', tag: 'ML Runtime', desc: 'FastAPI inference & data workers' },
        { name: 'LangChain', tag: 'Orchestration', desc: 'Multi-step agentic tool execution' },
        { name: 'Pinecone', tag: 'Vector Index', desc: 'Hybrid semantic & keyword retrieval' },
        { name: 'OpenAI / Claude', tag: 'Foundation', desc: 'Grounded enterprise RAG & evals' },
        { name: 'PyTorch', tag: 'Custom Models', desc: 'Domain embeddings & fine-tuning' },
      ],
    },
  ];

  const filteredCategories =
    activeCategory === 'all'
      ? techCategories
      : techCategories.filter((c) => c.category === activeCategory);

  return (
    <section className="py-20 md:py-28 border-b border-[#1E5A54]/20 bg-[#EEE6E2]">
      <div className="site-container space-y-12 xl:space-y-16">
        {/* Header + Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <StudioStamp
              text="PRODUCTION TESTED"
              subtext="STANDARD STUDIO MATRIX"
              rotate="slight-right"
              variant="teal"
            />
            <SectionHeading
              align="left"
              badge="Technology Stack"
              title="Our Production Specification Matrix"
              subtitle="We choose boring, proven infrastructure where reliability matters and modern runtimes where speed wins."
            />
          </div>

          {/* Tactile Pill Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-end">
            {[
              { id: 'all', label: 'Full Matrix (20)' },
              { id: 'frontend', label: 'Frontend & Mobile' },
              { id: 'backend', label: 'Backend & Data' },
              { id: 'cloud', label: 'Cloud & Infra' },
              { id: 'ai', label: 'AI & RAG' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all',
                  activeCategory === tab.id
                    ? 'bg-[#1E5A54] text-[#EEE6E2] shadow-[2px_3px_0px_rgba(247,98,61,0.9)]'
                    : 'border border-[#1E5A54]/30 bg-[#F8F4F2] text-[#1E5A54] hover:border-[#1E5A54]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Architectural Specification Table / Matrix */}
        <div className="rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] divide-y divide-[#1E5A54]/20 overflow-hidden">
          {filteredCategories.map((catGroup) => (
            <div key={catGroup.category} className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Category Column */}
              <div className="lg:col-span-3 p-6 bg-[#E2D7D1]/45 border-b lg:border-b-0 lg:border-r border-[#1E5A54]/20 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5A54] decoration-[#F7623D] block">
                    {catGroup.code}
                  </span>
                  <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#1E5A54] leading-tight">
                    {catGroup.label}
                  </h3>
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#1E5A54] mt-4">
                  {catGroup.items.length} STANDARD TOOLS
                </span>
              </div>

              {/* Right 5-Cell Specification Row */}
              <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#1E5A54]/15">
                {catGroup.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-5 flex flex-col justify-between gap-3 transition-all duration-200 hover:bg-[#EEE6E2] hover:-translate-y-0.5"
                  >
                    <div className="space-y-1.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#E2D7D1] font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#1E5A54]">
                        {item.tag}
                      </span>
                      <h4 className="font-headline text-xl font-bold uppercase tracking-tight text-[#1E5A54]">
                        {item.name}
                      </h4>
                    </div>
                    <p className="text-xs text-[#1E5A54] leading-relaxed font-sans">
                      {item.desc}
                    </p>
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
