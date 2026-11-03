'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Project } from '@/types';
import { ProjectCard } from '@/features/projects/project-card';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils';

interface ProjectListProps {
  initialProjects: Project[];
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Web App', 'Mobile App', 'Cloud & DevOps', 'AI & Data'];

  const filteredProjects = initialProjects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2]">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer flex items-center gap-2',
                  isSelected
                    ? 'bg-[#1E5A54] text-[#EEE6E2] border border-[#1E5A54]'
                    : 'bg-[#EEE6E2] text-[#1E5A54] border border-[#1E5A54]/25 hover:border-[#1E5A54]'
                )}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F7623D]" />
                )}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-3 h-4 w-4 text-[#1E5A54]/85" />
          <Input
            placeholder="Filter by stack, client, or system..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-10 text-xs bg-[#EEE6E2] border-[#1E5A54]/35 text-[#1E5A54] placeholder-[#1E5A54]/70"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching case studies"
          description="Try picking another system category or clearing your search filter."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
}
