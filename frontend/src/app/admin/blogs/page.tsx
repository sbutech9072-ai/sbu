'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, BookOpen, ExternalLink, CheckCircle2 } from 'lucide-react';
import { blogsData as initialBlogs } from '@/data/blogs';
import { BlogPost } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { slugify, formatDate } from '@/lib/utils';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    category: 'Engineering' | 'Architecture' | 'Design' | 'AI & Tech';
    excerpt: string;
    readTime: string;
    authorName: string;
    content: string;
  }>({
    title: '',
    category: 'Engineering',
    excerpt: '',
    readTime: '5 min read',
    authorName: 'David Kim',
    content: '',
  });

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category: 'Engineering',
      excerpt: '',
      readTime: '5 min read',
      authorName: 'David Kim',
      content: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BlogPost) => {
    setEditingBlog(b);
    setFormData({
      title: b.title,
      category: b.category,
      excerpt: b.excerpt,
      readTime: b.readTime,
      authorName: b.author.name,
      content: b.content,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete post "${title}"? (Local state)`)) {
      setBlogs(blogs.filter((b) => b.id !== id));
      showNotification(`Article "${title}" removed.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingBlog) {
      setBlogs(
        blogs.map((b) =>
          b.id === editingBlog.id
            ? {
                ...b,
                ...formData,
                slug: slugify(formData.title),
                author: { ...b.author, name: formData.authorName },
              }
            : b
        )
      );
      showNotification(`Article "${formData.title}" updated.`);
    } else {
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        slug: slugify(formData.title),
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        readTime: formData.readTime,
        publishedAt: new Date().toISOString().split('T')[0],
        author: {
          name: formData.authorName,
          role: 'Engineering Lead',
          avatar: '/team/default.jpg',
        },
        tags: ['Architecture', 'Sbu Tech'],
      };
      setBlogs([newPost, ...blogs]);
      showNotification(`Article "${formData.title}" published.`);
    }

    setIsModalOpen(false);
  };

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-amber-400" />
            <span>Manage Blog Articles</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author and publish architectural insights and technical writeups.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs">
          <Plus className="h-4 w-4" />
          <span>New Article</span>
        </Button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Filter by title, category, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/40">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Title & Slug</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4">Published</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filtered.map((post) => (
              <tr key={post.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-white block">{post.title}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    /blog/{post.slug}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant="default" className="text-[10px]">
                    {post.category}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-slate-300">{post.author.name}</td>
                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                  {formatDate(post.publishedAt)}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="View Article"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(post)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-500/10"
                      title="Edit Article"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10"
                      title="Delete Article"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlog ? 'Edit Article' : 'Compose Blog Article'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Article Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Scaling Next.js to 10M Monthly Sessions"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Category</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="Engineering">Engineering</option>
                <option value="Architecture">Architecture</option>
                <option value="Design">Design</option>
                <option value="AI & Tech">AI & Tech</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Read Time</label>
              <Input
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="6 min read"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Author</label>
              <Input
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="David Kim"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Excerpt / Meta Description</label>
            <Textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Short 2-line summary for cards and search..."
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Article Content (Markdown supported)</label>
            <Textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write article paragraphs..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingBlog ? 'Save Article' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

