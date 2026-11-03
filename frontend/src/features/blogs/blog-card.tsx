import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group flex flex-col justify-between rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:-translate-y-1 hover:border-[#1E5A54] hover:bg-[#EEE6E2] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E5A54]/15">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5A54]">
            NOTE // {post.id.toUpperCase()}
          </span>
          <span className="flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider text-[#1E5A54]/85">
            <Clock className="h-3 w-3 stroke-[1.75] text-[#F7623D]" />
            {post.readTime}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="default"
            className="text-[10px] uppercase tracking-[0.16em] bg-[#1E5A54] text-[#EEE6E2]"
          >
            {post.category}
          </Badge>
          <span className="text-[11px] text-[#1E5A54]/85 flex items-center gap-1 font-bold uppercase tracking-wider">
            <Calendar className="h-3 w-3 stroke-[1.75]" />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <div>
          <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-[#1E5A54] leading-tight line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-[#1E5A54]/90 mt-2.5 leading-relaxed line-clamp-3 font-sans">
            {post.excerpt}
          </p>
        </div>

        {/* Author info */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#1E5A54]/15">
          <div className="h-9 w-9 rounded-full border border-[#1E5A54] bg-[#E2D7D1] flex items-center justify-center text-xs font-bold text-[#1E5A54]">
            {post.author.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#1E5A54]">{post.author.name}</span>
            <span className="text-[11px] text-[#1E5A54]/85 font-semibold">
              {post.author.role}
            </span>
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0">
        <Link
          href={`/blog/${post.slug}`}
          className="group/btn inline-flex w-full items-center justify-between rounded-full border border-[#1E5A54] bg-[#EEE6E2] pl-5 pr-1.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          <span>Read Field Notes</span>
          <span className="w-6 h-6 rounded-full bg-[#F7623D] text-[#F8F4F2] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5">
            <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
          </span>
        </Link>
      </div>
    </Card>
  );
}
