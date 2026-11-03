'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Quote, Star, CheckCircle2 } from 'lucide-react';
import { testimonialsData as initialTestimonials } from '@/data/testimonials';
import { Testimonial } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    author: '',
    title: '',
    company: '',
    quote: '',
    rating: 5,
  });

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      author: '',
      title: '',
      company: '',
      quote: '',
      rating: 5,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingItem(t);
    setFormData({
      author: t.author,
      title: t.title,
      company: t.company,
      quote: t.quote,
      rating: t.rating,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, author: string) => {
    if (confirm(`Remove testimonial from "${author}"? (Local state)`)) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      showNotification(`Testimonial from "${author}" removed.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.quote.trim()) return;

    if (editingItem) {
      setTestimonials(
        testimonials.map((t) =>
          t.id === editingItem.id ? { ...t, ...formData } : t
        )
      );
      showNotification(`Testimonial updated.`);
    } else {
      const newItem: Testimonial = {
        id: `test-${Date.now()}`,
        avatar: '/team/default.jpg',
        verifiedClient: true,
        ...formData,
      };
      setTestimonials([...testimonials, newItem]);
      showNotification(`Testimonial added.`);
    }

    setIsModalOpen(false);
  };

  const filtered = testimonials.filter(
    (t) =>
      t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E5A54]/20">
        <div>
          <h1 className="font-headline text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2">
            <Quote className="h-6 w-6 text-[#F7623D]" />
            <span>Manage Client Testimonials</span>
          </h1>
          <p className="text-xs text-[#1E5A54] mt-1">
            Curate executive reviews and quotes featured across public pages.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs rounded-full">
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-[#1E5A54]/30 bg-[#F8F4F2] text-[#1E5A54] text-xs font-medium">
          <CheckCircle2 className="h-4 w-4 text-[#F7623D] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#1E5A54]" />
        <Input
          placeholder="Filter by author or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9 text-xs rounded-full bg-[#F8F4F2] border-[#1E5A54]/25"
        />
      </div>

      <Card className="overflow-hidden border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#1E5A54]/20 bg-[#E2D7D1] text-[#1E5A54] font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Author & Title</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Excerpt</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E5A54]/15">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-[#E2D7D1]/50 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#1E5A54] block">{t.author}</span>
                  <span className="text-[10px] text-[#1E5A54]">{t.title}</span>
                </td>
                <td className="py-3.5 px-4 text-[#1E5A54] font-medium">{t.company}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-0.5 text-[#1E5A54] decoration-[#F7623D]">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#F7623D]" />
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[#1E5A54] max-w-xs truncate">
                  &ldquo;{t.quote}&rdquo;
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 text-[#1E5A54] hover:bg-[#E2D7D1] rounded-full"
                      title="Edit Testimonial"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.author)}
                      className="p-1.5 text-[#1E5A54] decoration-[#F7623D] hover:bg-[#E2D7D1] rounded-full"
                      title="Delete Testimonial"
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
        title={editingItem ? 'Edit Testimonial' : 'Add Client Endorsement'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Author Full Name *</label>
            <Input
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="e.g. Rachel Sterling"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#1E5A54]">Job Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Chief Technology Officer"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#1E5A54]">Company</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="PulseFlow Systems"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Client Endorsement Quote *</label>
            <Textarea
              rows={4}
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="Enter review quote..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1E5A54]/20">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="rounded-full">
              {editingItem ? 'Save Updates' : 'Add Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
