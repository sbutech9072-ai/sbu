'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Shield, Globe, Bell } from 'lucide-react';
import { defaultSiteSettings } from '@/data/mock-admin';
import { SiteSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('Website configuration saved successfully in local mock state.');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-400" />
            <span>Website & Console Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global studio contact details, metadata defaults, and operational flags.
          </p>
        </div>

        <Button onClick={handleSave} size="sm" className="gap-1.5 text-xs">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <Card className="p-6 border-slate-800 bg-slate-900/40 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-white">
            <Globe className="h-4 w-4 text-blue-400" />
            <span>Studio Identity & Meta Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Company Name</label>
              <Input
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Default Page Title</label>
              <Input
                value={settings.metaTitle}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-300">Global Meta Description</label>
            <Textarea
              rows={2}
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
            />
          </div>
        </Card>

        {/* Contact Coordinates */}
        <Card className="p-6 border-slate-800 bg-slate-900/40 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-white">
            <Bell className="h-4 w-4 text-cyan-400" />
            <span>Public Communication Channels</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Primary Contact Email</label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Sales / Inquiries Email</label>
              <Input
                type="email"
                value={settings.salesEmail}
                onChange={(e) => setSettings({ ...settings, salesEmail: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Office Phone</label>
              <Input
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-300">Headquarters Address</label>
            <Input
              value={settings.officeAddress}
              onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
            />
          </div>
        </Card>

        {/* Feature Switches */}
        <Card className="p-6 border-slate-800 bg-slate-900/40 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-white">
            <Shield className="h-4 w-4 text-amber-400" />
            <span>Operational Toggles</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Maintenance Mode</span>
                <span className="text-slate-400">
                  Temporarily display a maintenance banner across public routes
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableMaintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, enableMaintenanceMode: e.target.checked })
                }
                className="h-4 w-4 accent-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Client Portal Self-Registration</span>
                <span className="text-slate-400">
                  Allow external clients to initiate self-registration requests
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableRegistration}
                onChange={(e) =>
                  setSettings({ ...settings, enableRegistration: e.target.checked })
                }
                className="h-4 w-4 accent-blue-600 rounded"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="default" className="gap-2">
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

