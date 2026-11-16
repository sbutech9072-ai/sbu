'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Users,
  Quote,
  Mail,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockMessages } from '@/data/mock-admin';
import { projectsData } from '@/data/projects';
import { teamData } from '@/data/team';
import { testimonialsData } from '@/data/testimonials';
import { VisitorTraffic } from '@/components/admin/visitor-traffic';
import { useAdminAuth, ADMIN_ROLE_LABELS } from '@/context/admin-auth-context';

export default function AdminDashboardOverviewPage() {
  const { adminUser } = useAdminAuth();
  const isMainOwner = adminUser?.role === 'main_owner';
  const canManageAccounts =
    adminUser?.role === 'main_owner' || adminUser?.role === 'co_owner';

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E5A54]/20">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl uppercase text-[#1E5A54] tracking-tight">
            Studio Operations Ledger
          </h1>
          <p className="text-xs text-[#1E5A54] mt-1">
            {adminUser
              ? `Signed in as ${adminUser.full_name} (${ADMIN_ROLE_LABELS[adminUser.role]}) • ${adminUser.email}`
              : 'Review case studies, engineering staff, and inquiries.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="gap-1.5 text-xs rounded-full">
            <Link href="/admin/projects">
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Project</span>
            </Link>
          </Button>
          {canManageAccounts && (
            <Button asChild variant="outline" size="sm" className="text-xs rounded-full">
              <Link href="/admin/accounts">Admin Accounts</Link>
            </Button>
          )}
          {isMainOwner && (
            <Button asChild variant="outline" size="sm" className="text-xs rounded-full">
              <Link href="/admin/settings">Settings</Link>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Active Projects"
          value={projectsData.length}
          change="+2 this month"
          changeType="positive"
          icon={FolderGit2}
          helper="Published case studies"
        />
        <StatsCard
          title="Engineering Staff"
          value={teamData.length}
          change="Senior practitioners"
          changeType="positive"
          icon={Users}
          helper="Architecture & systems"
        />
        <StatsCard
          title="Contact Inquiries"
          value={mockMessages.length}
          change="3 responded"
          changeType="positive"
          icon={Mail}
          helper="Response SLA < 24h"
        />
      </div>

      {/* Visitor Traffic Analytics */}
      <VisitorTraffic />

      {/* Recent Messages / Inquiries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xl uppercase text-[#1E5A54] flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#F7623D]" />
            <span>Recent Inquiries</span>
          </h3>
          <Link
            href="/admin/messages"
            className="text-xs text-[#1E5A54] hover:text-[#F7623D] flex items-center gap-1 font-semibold"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <Card className="divide-y divide-[#1E5A54]/15 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl overflow-hidden">
          {mockMessages.map((msg) => (
            <div key={msg.id} className="p-5 hover:bg-[#E2D7D1]/50 transition-colors space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E5A54]">{msg.name}</span>
                <Badge
                  variant={msg.status === 'new' ? 'destructive' : 'secondary'}
                  className="text-[10px] capitalize"
                >
                  {msg.status}
                </Badge>
              </div>
              <h5 className="text-xs font-semibold text-[#1E5A54] decoration-[#F7623D] truncate">{msg.subject}</h5>
              <p className="text-xs text-[#1E5A54] line-clamp-2">{msg.message}</p>
            </div>
          ))}
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="pt-4 border-t border-[#1E5A54]/20">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1E5A54] mb-4">
          Quick Management Portals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/projects"
            className="p-5 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:bg-[#E2D7D1] transition-all space-y-1 block"
          >
            <FolderGit2 className="h-5 w-5 text-[#1E5A54] decoration-[#F7623D] mb-2" />
            <h4 className="font-headline text-lg uppercase text-[#1E5A54]">Projects</h4>
            <p className="text-xs text-[#1E5A54]">{projectsData.length} Case studies</p>
          </Link>

          <Link
            href="/admin/team"
            className="p-5 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:bg-[#E2D7D1] transition-all space-y-1 block"
          >
            <Users className="h-5 w-5 text-[#1E5A54] mb-2" />
            <h4 className="font-headline text-lg uppercase text-[#1E5A54]">Team Members</h4>
            <p className="text-xs text-[#1E5A54]">{teamData.length} Staff profiles</p>
          </Link>

          <Link
            href="/admin/testimonials"
            className="p-5 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:bg-[#E2D7D1] transition-all space-y-1 block"
          >
            <Quote className="h-5 w-5 text-[#1E5A54] decoration-[#F7623D] mb-2" />
            <h4 className="font-headline text-lg uppercase text-[#1E5A54]">Testimonials</h4>
            <p className="text-xs text-[#1E5A54]">{testimonialsData.length} Reviews</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
