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
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
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
import { formatDate } from '@/lib/utils';

export default function AdminDashboardOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome to the Sbu Tech administration console. Manage portfolio case studies, services, team members, and incoming leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="gap-1.5 text-xs">
            <Link href="/admin/projects">
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Project</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs">
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
          helper="Portfolio items published"
        />
        <StatsCard
          title="Core Services"
          value={servicesData.length}
          change="100% active"
          changeType="positive"
          icon={Cpu}
          helper="Engineering offerings"
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
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-blue-400" />
              <span>Incoming Project Scopes</span>
            </h3>
            <Link
              href="/admin/quote-requests"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <Card className="divide-y divide-slate-800 border-slate-800 bg-slate-900/40">
            {mockQuoteRequests.map((req) => (
              <div key={req.id} className="p-4 hover:bg-slate-900/80 transition-colors space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{req.companyName}</h4>
                    <span className="text-xs text-slate-400">
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

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {req.projectOverview}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                  <span>Scope: {req.serviceCategory}</span>
                  <span className="text-blue-300 font-semibold">{req.budgetRange}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right Column: Recent Messages */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>Recent Inquiries</span>
            </h3>
            <Link
              href="/admin/messages"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <Card className="divide-y divide-slate-800 border-slate-800 bg-slate-900/40">
            {mockMessages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-slate-900/80 transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{msg.name}</span>
                  <Badge
                    variant={msg.status === 'new' ? 'destructive' : 'secondary'}
                    className="text-[10px] capitalize"
                  >
                    {msg.status}
                  </Badge>
                </div>
                <h5 className="text-xs font-medium text-blue-400 truncate">{msg.subject}</h5>
                <p className="text-xs text-slate-400 line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="pt-4 border-t border-slate-800">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Quick Management Portals
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/projects"
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/80 transition-all space-y-1 block"
          >
            <FolderGit2 className="h-5 w-5 text-blue-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Projects</h4>
            <p className="text-xs text-slate-400">{projectsData.length} Case studies</p>
          </Link>

          <Link
            href="/admin/services"
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/80 transition-all space-y-1 block"
          >
            <Cpu className="h-5 w-5 text-cyan-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Services</h4>
            <p className="text-xs text-slate-400">{servicesData.length} Practice areas</p>
          </Link>

          <Link
            href="/admin/team"
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/80 transition-all space-y-1 block"
          >
            <Users className="h-5 w-5 text-indigo-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Team Members</h4>
            <p className="text-xs text-slate-400">{teamData.length} Staff profiles</p>
          </Link>

          <Link
            href="/admin/blogs"
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/80 transition-all space-y-1 block"
          >
            <BookOpen className="h-5 w-5 text-amber-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Blog Posts</h4>
            <p className="text-xs text-slate-400">{blogsData.length} Articles</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

