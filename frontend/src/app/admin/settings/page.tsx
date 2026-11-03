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
    setFeedback('Website configuration saved in local mock state.');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E5A54]/20">
        <div>
          <h1 className="font-headline text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#1E5A54] decoration-[#F7623D]" />
            <span>Website & Console Settings</span>
          </h1>
          <p className="text-xs text-[#1E5A54] mt-1">
            Global studio contact details, metadata defaults, and operational flags.
          </p>
        </div>

        <Button onClick={handleSave} size="sm" className="gap-1.5 text-xs rounded-full">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-[#1E5A54]/30 bg-[#F8F4F2] text-[#1E5A54] text-xs font-medium">
          <CheckCircle2 className="h-4 w-4 text-[#F7623D] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <Card className="p-6 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E5A54]/20 font-headline text-xl uppercase text-[#1E5A54]">
            <Globe className="h-4 w-4 text-[#F7623D]" />
            <span>Studio Identity & Meta Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#1E5A54]">Company Name</label>
              <Input
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#1E5A54]">Default Page Title</label>
              <Input
                value={settings.metaTitle}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-[#1E5A54]">Global Meta Description</label>
            <Textarea
              rows={2}
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
            />
          </div>
        </Card>

        {/* Contact Coordinates */}
        <Card className="p-6 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E5A54]/20 font-headline text-xl uppercase text-[#1E5A54]">
            <Bell className="h-4 w-4 text-[#1E5A54] decoration-[#F7623D]" />
            <span>Public Communication Channels</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#1E5A54]">Primary Contact Email</label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#1E5A54]">Sales / Inquiries Email</label>
              <Input
                type="email"
                value={settings.salesEmail}
                onChange={(e) => setSettings({ ...settings, salesEmail: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#1E5A54]">Office Phone</label>
              <Input
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-[#1E5A54]">Headquarters Address</label>
            <Input
              value={settings.officeAddress}
              onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
            />
          </div>
        </Card>

        {/* Feature Switches */}
        <Card className="p-6 border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E5A54]/20 font-headline text-xl uppercase text-[#1E5A54]">
            <Shield className="h-4 w-4 text-[#F7623D]" />
            <span>Operational Toggles</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EEE6E2] border border-[#1E5A54]/25">
              <div>
                <span className="font-bold text-[#1E5A54] block">Maintenance Mode</span>
                <span className="text-[#1E5A54]">
                  Temporarily display a maintenance banner across public routes
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableMaintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, enableMaintenanceMode: e.target.checked })
                }
                className="h-4 w-4 accent-[#F7623D] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EEE6E2] border border-[#1E5A54]/25">
              <div>
                <span className="font-bold text-[#1E5A54] block">Client Portal Self-Registration</span>
                <span className="text-[#1E5A54]">
                  Allow external clients to initiate self-registration requests
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableRegistration}
                onChange={(e) =>
                  setSettings({ ...settings, enableRegistration: e.target.checked })
                }
                className="h-4 w-4 accent-[#F7623D] rounded"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="default" className="gap-2 rounded-full">
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
