'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  FolderGit2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { projectsData as initialProjects } from '@/data/projects';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { slugify } from '@/lib/utils';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    client: string;
    category: 'Web App' | 'Mobile App' | 'Cloud & DevOps' | 'AI & Data';
    year: number;
    duration: string;
    shortDescription: string;
    challenge: string;
    solution: string;
  }>({
    title: '',
    client: '',
    category: 'Web App',
    year: new Date().getFullYear(),
    duration: '3 Months',
    shortDescription: '',
    challenge: '',
    solution: '',
  });

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      client: '',
      category: 'Web App',
      year: new Date().getFullYear(),
      duration: '3 Months',
      shortDescription: '',
      challenge: '',
      solution: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      client: project.client,
      category: project.category,
      year: project.year,
      duration: project.duration,
      shortDescription: project.shortDescription,
      challenge: project.challenge,
      solution: project.solution,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}"? (Local state only)`)) {
      setProjects(projects.filter((p) => p.id !== id));
      showNotification(`Case study "${title}" removed successfully.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.client.trim()) {
      alert('Please fill in title and client fields.');
      return;
    }

    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id
            ? {
                ...p,
                ...formData,
                slug: slugify(formData.title),
              }
            : p
        )
      );
      showNotification(`Project "${formData.title}" updated.`);
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        slug: slugify(formData.title),
        ...formData,
        fullDescription: formData.shortDescription,
        coverImage: '/projects/default.jpg',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        metrics: [{ label: 'Status', value: 'Live' }],
        results: ['System architected and released to production.'],
      };
      setProjects([newProj, ...projects]);
      showNotification(`Project "${formData.title}" created.`);
    }

    setIsModalOpen(false);
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-blue-400" />
            <span>Manage Portfolio Case Studies</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, and organize client case studies displayed on the public site.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Notification Toast */}
      {feedback && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Filter by title, client, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Projects Table */}
      <Card className="overflow-hidden border-slate-800 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Title & Slug</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{proj.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      /projects/{proj.slug}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{proj.client}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="default" className="text-[10px]">
                      {proj.category}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{proj.year}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/projects/${proj.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        title="View Public Page"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-500/10"
                        title="Edit Project"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id, proj.title)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No matching projects located.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Case Study'}
        description="Local state modification. Updates take effect immediately in current browser session."
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Project Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Apex Cloud Observability"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Client Name *</label>
              <Input
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Apex Global Systems"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Category</label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as any })
                }
              >
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="AI & Data">AI & Data</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Year</label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2026 })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Duration</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="4 Months"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Short Summary</label>
            <Textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="High-level outcome and technical description..."
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">The Challenge</label>
            <Textarea
              rows={2}
              value={formData.challenge}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              placeholder="What architectural bottleneck was the client facing?"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">The Solution</label>
            <Textarea
              rows={2}
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              placeholder="How did Sbu Tech engineer the solution?"
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
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

