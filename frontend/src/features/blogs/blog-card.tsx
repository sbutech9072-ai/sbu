import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group flex flex-col justify-between border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Badge variant="default" className="text-[11px]">
            {post.category}
          </Badge>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Author info */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800/60">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-white">
            {post.author.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-200">{post.author.name}</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" />
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex w-full items-center justify-between rounded-xl bg-slate-800/40 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
        >
          <span>Read Article</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}

