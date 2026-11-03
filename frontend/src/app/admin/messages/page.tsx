'use client';

import React, { useState } from 'react';
import { Mail, Search, Eye, CheckCircle2, Trash2, Phone } from 'lucide-react';
import { mockMessages as initialMessages } from '@/data/mock-admin';
import { ContactMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { formatDate } from '@/lib/utils';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleOpenDetail = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'new') {
      setMessages(
        messages.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
      );
    }
  };

  const handleUpdateStatus = (id: string, status: 'new' | 'read' | 'replied') => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status });
    }
    showNotification(`Message status marked as "${status}".`);
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
    showNotification('Message deleted.');
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E5A54]/20">
        <div>
          <h1 className="font-headline text-3xl uppercase text-[#1E5A54] tracking-tight flex items-center gap-2">
            <Mail className="h-6 w-6 text-[#F7623D]" />
            <span>Contact Messages & Inquiries</span>
          </h1>
          <p className="text-xs text-[#1E5A54] mt-1">
            Review incoming consultation requests and correspondence from the public site.
          </p>
        </div>

        <div className="text-xs text-[#1E5A54] font-mono">
          Total Inquiries: <span className="text-[#1E5A54] font-bold">{messages.length}</span>
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
          placeholder="Filter by sender, email, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9 text-xs rounded-full bg-[#F8F4F2] border-[#1E5A54]/25"
        />
      </div>

      <Card className="overflow-hidden border-[#1E5A54]/25 bg-[#F8F4F2] rounded-3xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#1E5A54]/20 bg-[#E2D7D1] text-[#1E5A54] font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Sender</th>
              <th className="py-3.5 px-4">Subject</th>
              <th className="py-3.5 px-4">Received</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E5A54]/15">
            {filtered.map((msg) => (
              <tr key={msg.id} className="hover:bg-[#E2D7D1]/50 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#1E5A54] block">{msg.name}</span>
                  <span className="text-[10px] text-[#1E5A54]">{msg.email}</span>
                </td>
                <td className="py-3.5 px-4 text-[#1E5A54] font-medium max-w-xs truncate">
                  {msg.subject}
                </td>
                <td className="py-3.5 px-4 text-[#1E5A54] font-mono text-[11px]">
                  {formatDate(msg.createdAt)}
                </td>
                <td className="py-3.5 px-4">
                  <Badge
                    variant={
                      msg.status === 'new'
                        ? 'destructive'
                        : msg.status === 'read'
                        ? 'default'
                        : 'success'
                    }
                    className="capitalize text-[10px]"
                  >
                    {msg.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenDetail(msg)}
                      className="p-1.5 text-[#1E5A54] hover:bg-[#E2D7D1] rounded-full"
                      title="Read Message"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 text-[#1E5A54] decoration-[#F7623D] hover:bg-[#E2D7D1] rounded-full"
                      title="Delete"
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

      {/* Message Reader Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || 'Message Details'}
        description={`Sent by ${selectedMessage?.name} (${selectedMessage?.email}) on ${
          selectedMessage ? formatDate(selectedMessage.createdAt) : ''
        }`}
        maxWidth="lg"
      >
        {selectedMessage && (
          <div className="space-y-6 text-xs">
            {selectedMessage.phone && (
              <div className="flex items-center gap-2 text-[#1E5A54] font-mono">
                <Phone className="h-3.5 w-3.5 text-[#F7623D]" />
                <span>{selectedMessage.phone}</span>
              </div>
            )}

            <div className="p-4 rounded-2xl border border-[#1E5A54]/25 bg-[#EEE6E2] text-[#1E5A54] leading-relaxed text-sm whitespace-pre-wrap">
              {selectedMessage.message}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1E5A54]/20">
              <div className="flex items-center gap-2">
                <span className="text-[#1E5A54]">Current status:</span>
                <Badge variant="default" className="capitalize">
                  {selectedMessage.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                  className="rounded-full"
                >
                  Mark as Read
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                  className="rounded-full"
                >
                  Mark as Replied
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
