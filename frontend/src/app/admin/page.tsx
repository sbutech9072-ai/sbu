'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Cpu,
  Users,
  BookOpen,
  Mail,
  FileSpreadsheet,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockQuoteRequests, mockMessages } from '@/data/mock-admin';
import { projectsData } from '@/data/projects';
import { servicesData } from '@/data/services';
import { teamData } from '@/data/team';
import { blogsData } from '@/data/blogs';

export default function AdminDashboardOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E5A54]/20">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl uppercase text-[#1E5A54] tracking-tight">
            Studio Operations Ledger
          </h1>
          <p className="text-xs text-[#1E5A54]/85 mt-1">
            Review case studies, service lines, engineering staff, and incoming project scopes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="gap-1.5 text-xs rounded-full">
            <Link href="/admin/projects">
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Project</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs rounded-full">
            <Link href="/admin/settings">Settings</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Projects"
          value={projectsData.length}
          change="+2 this month"
          changeType="positive"
          icon={FolderGit2}
          helper="Published case studies"
        />
        <StatsCard
          title="Core Services"
          value={servicesData.length}
          change="100% active"
          changeType="positive"
          icon={Cpu}
          helper="Engineering practices"
        />
        <StatsCard
          title="Quote Requests"
          value={mockQuoteRequests.length}
          change="1 pending review"
          changeType="neutral"
          icon={FileSpreadsheet}
          helper="Valued > $175,000"
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

      {/* Two Column Layout: Recent Quote Requests & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Quote Submissions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl uppercase text-[#1E5A54] flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-[#F7623D]" />
              <span>Incoming Project Scopes</span>
            </h3>
            <Link
              href="/admin/quote-requests"
              className="text-xs text-[#1E5A54] hover:text-[#F7623D] flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <Card className="divide-y divide-[#1E5A54]/15 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl overflow-hidden">
            {mockQuoteRequests.map((req) => (
              <div key={req.id} className="p-5 hover:bg-[#E2D7D1]/50 transition-colors space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#1E5A54]">{req.companyName}</h4>
                    <span className="text-xs text-[#1E5A54]/85">
                      Contact: {req.fullName} ({req.email})
                    </span>
                  </div>
                  <Badge
                    variant={
                      req.status === 'pending'
                        ? 'warning'
                        : req.status === 'reviewing'
                        ? 'default'
                        : 'success'
                    }
                    className="capitalize text-[10px]"
                  >
                    {req.status}
                  </Badge>
                </div>

                <p className="text-xs text-[#1E5A54]/85 line-clamp-2 leading-relaxed">
                  {req.projectOverview}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-[#1E5A54]/85 font-mono">
                  <span>Scope: {req.serviceCategory}</span>
                  <span className="text-[#1E5A54] font-bold">{req.budgetRange}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right Column: Recent Messages */}
        <div className="lg:col-span-5 space-y-4">
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
                <h5 className="text-xs font-semibold text-[#F7623D] truncate">{msg.subject}</h5>
                <p className="text-xs text-[#1E5A54]/85 line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="pt-4 border-t border-[#1E5A54]/20">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1E5A54]/85 mb-4">
          Quick Management Portals
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/projects"
            className="p-5 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:bg-[#E2D7D1] transition-all space-y-1 block"
          >
            <FolderGit2 className="h-5 w-5 text-[#F7623D] mb-2" />
            <h4 className="font-headline text-lg uppercase text-[#1E5A54]">Projects</h4>
            <p className="text-xs text-[#1E5A54]/85">{projectsData.length} Case studies</p>
          </Link>

          <Link
            href="/admin/services"
            className="p-5 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:bg-[#E2D7D1] transition-all space-y-1 block"
          >
            <Cpu className="h-5 w-5 text-[#1E5A54] mb-2" />
            <h4 className="font-headline text-lg uppercase text-[#1E5A54]">Services</h4>
            <p className="text-xs text-[#1E5A54]/85">{servicesData.length} Practice areas</p>
          </Link>

          <Link
            href="/admin/team"
            className="p-5 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:bg-[#E2D7D1] transition-all space-y-1 block"
          >
            <Users className="h-5 w-5 text-[#1E5A54] mb-2" />
            <h4 className="font-headline text-lg uppercase text-[#1E5A54]">Team Members</h4>
            <p className="text-xs text-[#1E5A54]/85">{teamData.length} Staff profiles</p>
          </Link>

          <Link
            href="/admin/blogs"
            className="p-5 rounded-3xl border border-[#1E5A54]/25 bg-[#F8F4F2] hover:bg-[#E2D7D1] transition-all space-y-1 block"
          >
            <BookOpen className="h-5 w-5 text-[#F7623D] mb-2" />
            <h4 className="font-headline text-lg uppercase text-[#1E5A54]">Blog Posts</h4>
            <p className="text-xs text-[#1E5A54]/85">{blogsData.length} Articles</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
