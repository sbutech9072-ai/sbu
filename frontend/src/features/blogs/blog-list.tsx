'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { BlogPost } from '@/types';
import { BlogCard } from '@/features/blogs/blog-card';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils';

interface BlogListProps {
  initialPosts: BlogPost[];
}

export function BlogList({ initialPosts }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Engineering', 'Architecture', 'Design', 'AI & Tech'];

  const filteredPosts = initialPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
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
            placeholder="Filter notes by topic or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-10 text-xs bg-[#EEE6E2] border-[#1E5A54]/35 text-[#1E5A54] placeholder-[#1E5A54]/70"
          />
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No engineering notes found"
          description="Try picking another topic or clearing your search filter."
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
