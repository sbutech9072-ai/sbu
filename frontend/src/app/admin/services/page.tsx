'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Cpu, ExternalLink, CheckCircle2 } from 'lucide-react';
import { servicesData as initialServices } from '@/data/services';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/lib/utils';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    shortDescription: '',
    fullDescription: '',
    iconName: 'Code2',
  });

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleOpenEdit = (svc: Service) => {
    setEditingService(svc);
    setFormData({
      title: svc.title,
      category: svc.category,
      shortDescription: svc.shortDescription,
      fullDescription: svc.fullDescription,
      iconName: svc.iconName,
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      category: 'Engineering',
      shortDescription: '',
      fullDescription: '',
      iconName: 'Code2',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? { ...s, ...formData, slug: slugify(formData.title) }
            : s
        )
      );
      showNotification(`Service "${formData.title}" updated.`);
    } else {
      const newSvc: Service = {
        id: `srv-${Date.now()}`,
        slug: slugify(formData.title),
        ...formData,
        features: ['High-throughput execution', 'Automated testing and QA', 'Modern stack standards'],
        deliverables: ['Production source code repository', 'Architectural documentation'],
        technologies: ['TypeScript', 'Cloud'],
        processSteps: [
          { title: 'Discovery', description: 'Domain modeling and requirements' },
          { title: 'Delivery', description: 'Production deployment' },
        ],
      };
      setServices([...services, newSvc]);
      showNotification(`Service "${formData.title}" created.`);
    }

    setIsModalOpen(false);
  };

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            <span>Manage Service Offerings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure core engineering practice areas and capabilities.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs">
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
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
          placeholder="Filter services by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/40">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Service & Slug</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Tech Count</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filtered.map((svc) => (
              <tr key={svc.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-white block">{svc.title}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    /services/{svc.slug}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant="default" className="text-[10px]">
                    {svc.category}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-slate-400 font-mono">
                  {svc.technologies.length} Technologies
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Link
                      href={`/services/${svc.slug}`}
                      target="_blank"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="View Public Page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(svc)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-500/10"
                      title="Edit Service"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
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
        title={editingService ? 'Edit Service' : 'Add Service Capability'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Service Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Distributed Database Engineering"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Engineering / Cloud / AI"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Brief Summary</label>
            <Textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Short card summary..."
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Full Description</label>
            <Textarea
              rows={3}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              placeholder="Detailed description shown on service detail page..."
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
              {editingService ? 'Save Updates' : 'Add Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

