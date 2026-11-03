import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Tag, ArrowRight } from 'lucide-react';
import { blogsData } from '@/data/blogs';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { StudioStamp, HandUnderline } from '@/components/human/hand-crafted-svg';
import { TiltCard } from '@/components/human/tilt-card';

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
    <article className="space-y-12 pb-24 bg-[#EEE6E2] text-[#1E5A54]">
      <PageHeader
        badge={post.category}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Author & Read Time Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] text-xs text-[#1E5A54]">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-[#1E5A54] flex items-center justify-center font-bold text-[#EEE6E2]">
              {post.author.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-bold text-[#1E5A54] text-sm block">{post.author.name}</span>
              <span className="text-[#1E5A54]">{post.author.role}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <StudioStamp
              text={`ISSUE // ${post.category.toUpperCase()}`}
              rotate="slight-right"
              variant="cream"
            />
            <span className="flex items-center gap-1.5 font-mono text-[#1E5A54]">
              <Calendar className="h-3.5 w-3.5 text-[#F7623D]" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[#1E5A54]">
              <Clock className="h-3.5 w-3.5 text-[#F7623D]" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Editorial Content Body */}
        <div className="my-10 p-8 md:p-12 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] text-[#1E5A54] leading-relaxed text-base">
          <div className="whitespace-pre-line leading-relaxed font-sans text-[#1E5A54]">
            {post.content}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <Tag className="h-4 w-4 text-[#F7623D] mr-1" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-3.5 py-1 rounded-full bg-[#F8F4F2] border border-[#1E5A54]/25 text-[#1E5A54] font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="mt-10 p-7 rounded-3xl border border-[#1E5A54]/25 bg-[#E2D7D1] flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[#1E5A54] border-2 border-[#F7623D] flex items-center justify-center font-bold text-[#EEE6E2] shrink-0">
            {post.author.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-headline text-xl uppercase text-[#1E5A54]">{post.author.name}</h4>
            <p className="text-xs text-[#1E5A54] mt-1 leading-relaxed">
              Principal contributor at Sbu Tech writing on distributed cloud systems, type-safe web
              architecture, and production reliability.
            </p>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#1E5A54]/20 space-y-6">
            <h3 className="font-headline text-2xl md:text-3xl uppercase text-[#1E5A54]">
              Further{' '}
              <span className="relative inline-block">
                Reading
                <HandUnderline className="mt-0.5" />
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((r) => (
                <TiltCard key={r.id}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="p-6 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:bg-[#E2D7D1] transition-colors space-y-3 block h-full"
                  >
                    <span className="text-[10px] font-mono font-bold text-[#1E5A54] decoration-[#F7623D] uppercase tracking-wider block">
                      {r.category}
                    </span>
                    <h4 className="font-headline text-xl uppercase text-[#1E5A54] line-clamp-2">
                      {r.title}
                    </h4>
                    <p className="text-xs text-[#1E5A54] line-clamp-2 leading-relaxed">
                      {r.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E5A54] pt-1">
                      <span>Read Dispatch</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#F7623D]" />
                    </span>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-full">
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
