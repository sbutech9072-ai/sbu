'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, CheckCircle2 } from 'lucide-react';
import { teamData as initialTeam } from '@/data/team';
import { TeamMember } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    department: 'Leadership' | 'Engineering' | 'Design' | 'Product';
    bio: string;
    isLeadership: boolean;
  }>({
    name: '',
    role: '',
    department: 'Engineering',
    bio: '',
    isLeadership: false,
  });

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      department: 'Engineering',
      bio: '',
      isLeadership: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      role: m.role,
      department: m.department,
      bio: m.bio,
      isLeadership: !!m.isLeadership,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove member "${name}"? (Local state)`)) {
      setTeam(team.filter((m) => m.id !== id));
      showNotification(`Member "${name}" removed.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) return;

    if (editingMember) {
      setTeam(
        team.map((m) => (m.id === editingMember.id ? { ...m, ...formData } : m))
      );
      showNotification(`Team member "${formData.name}" updated.`);
    } else {
      const newMember: TeamMember = {
        id: `team-${Date.now()}`,
        avatar: '/team/default.jpg',
        skills: ['Software Architecture', 'TypeScript'],
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
        ...formData,
      };
      setTeam([...team, newMember]);
      showNotification(`Team member "${formData.name}" added.`);
    }

    setIsModalOpen(false);
  };

  const filtered = team.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E5A54]/20">
        <div>
          <h1 className="font-headline text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-[#F7623D]" />
            <span>Manage Team Profiles</span>
          </h1>
          <p className="text-xs text-[#1E5A54] mt-1">
            Organize engineering staff, leadership profiles, and public bios.
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs rounded-full">
          <Plus className="h-4 w-4" />
          <span>Add Member</span>
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
          placeholder="Filter by name, role, department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9 text-xs rounded-full bg-[#F8F4F2] border-[#1E5A54]/25"
        />
      </div>

      <Card className="overflow-hidden border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#1E5A54]/20 bg-[#E2D7D1] text-[#1E5A54] font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E5A54]/15">
            {filtered.map((member) => (
              <tr key={member.id} className="hover:bg-[#E2D7D1]/50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#1E5A54]">{member.name}</td>
                <td className="py-3.5 px-4 text-[#1E5A54] font-medium">{member.role}</td>
                <td className="py-3.5 px-4">
                  <Badge variant="default" className="text-[10px]">
                    {member.department}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-[#1E5A54]">
                  {member.isLeadership ? (
                    <span className="text-[#1E5A54] decoration-[#F7623D] font-bold">Leadership</span>
                  ) : (
                    <span>Staff</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 text-[#1E5A54] hover:bg-[#E2D7D1] rounded-full"
                      title="Edit Member"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="p-1.5 text-[#1E5A54] decoration-[#F7623D] hover:bg-[#E2D7D1] rounded-full"
                      title="Delete Member"
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
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Full Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Rivera"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Role / Job Title *</label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Senior Cloud Architect"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#1E5A54]">Department</label>
              <Select
                value={formData.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value as TeamMember['department'],
                  })
                }
              >
                <option value="Leadership">Leadership</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#1E5A54]">Leadership Badge</label>
              <Select
                value={formData.isLeadership ? 'yes' : 'no'}
                onChange={(e) =>
                  setFormData({ ...formData, isLeadership: e.target.value === 'yes' })
                }
              >
                <option value="no">Staff Member</option>
                <option value="yes">Executive / Partner</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1E5A54]">Bio</label>
            <Textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Short bio description..."
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
              {editingMember ? 'Save Profile' : 'Add Profile'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
