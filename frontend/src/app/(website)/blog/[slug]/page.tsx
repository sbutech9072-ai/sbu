import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Bookmark } from 'lucide-react';
import { blogsData } from '@/data/blogs';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return blogsData.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = blogsData.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const post = blogsData.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogsData.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="space-y-12 pb-20">
      <PageHeader
        badge={post.category}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Author & Read Time Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
              {post.author.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-white block">{post.author.name}</span>
              <span className="text-slate-400">{post.author.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="prose prose-invert prose-slate max-w-none py-10 space-y-6 text-slate-300 leading-relaxed text-base">
          <div className="whitespace-pre-line leading-relaxed font-sans">{post.content}</div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-800">
          <Tag className="h-4 w-4 text-slate-500 mr-1" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 p-6 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 shrink-0">
            {post.author.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{post.author.name}</h4>
            <p className="text-xs text-slate-400 mt-1">
              Senior engineering contributor at Sbu Tech writing on cloud architecture, distributed
              systems, and performance engineering.
            </p>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white">Recommended Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/80 transition-colors space-y-2 block"
                >
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                    {r.category}
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-2">{r.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Articles</span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

