'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Eye,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { mockQuoteRequests as initialQuotes } from '@/data/mock-admin';
import { QuoteRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { formatDate } from '@/lib/utils';

export default function AdminQuoteRequestsPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>(initialQuotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleUpdateStatus = (id: string, status: QuoteRequest['status']) => {
    setQuotes(quotes.map((q) => (q.id === id ? { ...q, status } : q)));
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote({ ...selectedQuote, status });
    }
    showNotification(`Scope status changed to "${status}".`);
  };

  const handleDelete = (id: string) => {
    setQuotes(quotes.filter((q) => q.id !== id));
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote(null);
    }
    showNotification('Quote request archived.');
  };

  const filtered = quotes.filter(
    (q) =>
      q.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E5A54]/20">
        <div>
          <h1 className="font-headline text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-[#F7623D]" />
            <span>Incoming Project Scopes & Quotes</span>
          </h1>
          <p className="text-xs text-[#1E5A54] mt-1">
            Review detailed project scopes, budgets, feature sets, and target timelines.
          </p>
        </div>

        <div className="text-xs text-[#1E5A54] font-mono">
          Submissions: <span className="text-[#1E5A54] font-bold">{quotes.length}</span>
        </div>
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
          placeholder="Filter by company, name, or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9 text-xs rounded-full bg-[#F8F4F2] border-[#1E5A54]/25"
        />
      </div>

      <Card className="overflow-hidden border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#1E5A54]/20 bg-[#E2D7D1] text-[#1E5A54] font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Company & Lead</th>
              <th className="py-3.5 px-4">Requested Service</th>
              <th className="py-3.5 px-4">Budget Range</th>
              <th className="py-3.5 px-4">Timeline</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E5A54]/15">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-[#E2D7D1]/50 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#1E5A54] block">{q.companyName}</span>
                  <span className="text-[10px] text-[#1E5A54]">{q.fullName}</span>
                </td>
                <td className="py-3.5 px-4 text-[#1E5A54] font-medium">{q.serviceCategory}</td>
                <td className="py-3.5 px-4 text-[#1E5A54] decoration-[#F7623D] font-mono font-bold">
                  {q.budgetRange}
                </td>
                <td className="py-3.5 px-4 text-[#1E5A54]">{q.timeline}</td>
                <td className="py-3.5 px-4">
                  <Badge
                    variant={
                      q.status === 'pending'
                        ? 'warning'
                        : q.status === 'reviewing'
                        ? 'default'
                        : 'success'
                    }
                    className="capitalize text-[10px]"
                  >
                    {q.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedQuote(q)}
                      className="p-1.5 text-[#1E5A54] hover:bg-[#E2D7D1] rounded-full"
                      title="Inspect Scope"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 text-[#1E5A54] decoration-[#F7623D] hover:bg-[#E2D7D1] rounded-full"
                      title="Archive Scope"
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

      {/* Scope Inspector Modal */}
      <Modal
        isOpen={!!selectedQuote}
        onClose={() => setSelectedQuote(null)}
        title={`${selectedQuote?.companyName} • Scope Assessment`}
        description={`Submitted by ${selectedQuote?.fullName} (${selectedQuote?.email}) on ${
          selectedQuote ? formatDate(selectedQuote.createdAt) : ''
        }`}
        maxWidth="xl"
      >
        {selectedQuote && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#EEE6E2] border border-[#1E5A54]/25">
              <div>
                <span className="text-[#1E5A54] block mb-0.5">Budget Estimate</span>
                <span className="font-bold text-[#1E5A54] text-sm">{selectedQuote.budgetRange}</span>
              </div>
              <div>
                <span className="text-[#1E5A54] block mb-0.5">Target Delivery</span>
                <span className="font-semibold text-[#1E5A54]">{selectedQuote.timeline}</span>
              </div>
              <div>
                <span className="text-[#1E5A54] block mb-0.5">Phone Contact</span>
                <span className="font-mono text-[#1E5A54]">
                  {selectedQuote.phone || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-[#1E5A54] block">Requested Features</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedQuote.featuresNeeded.map((feat) => (
                  <span
                    key={feat}
                    className="px-3 py-1 rounded-full bg-[#EEE6E2] text-[#1E5A54] border border-[#1E5A54]/25 font-medium"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-[#1E5A54] block">Project Vision & Summary</span>
              <div className="p-4 rounded-2xl border border-[#1E5A54]/25 bg-[#EEE6E2] text-[#1E5A54] leading-relaxed text-sm">
                {selectedQuote.projectOverview}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1E5A54]/20">
              <div className="flex items-center gap-2">
                <span className="text-[#1E5A54]">Current status:</span>
                <Badge variant="default" className="capitalize">
                  {selectedQuote.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedQuote.id, 'reviewing')}
                  className="rounded-full"
                >
                  Mark Reviewing
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedQuote.id, 'contacted')}
                  className="rounded-full"
                >
                  Mark Contacted
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
