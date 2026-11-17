'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface SourceCitation {
  chunk_id: string;
  source_file: string;
  page_number: number;
  section_title: string;
}

interface BackendChatResponse {
  session_id: string;
  answer: string;
  status: string;
  language: string;
  sources: SourceCitation[];
  model: string;
  request_id: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: string;
  sources?: SourceCitation[];
  timestamp: string;
  isError?: boolean;
}

const STORAGE_SESSION_KEY = 'sbu_ai_session_id';
const STORAGE_HISTORY_KEY = 'sbu_ai_chat_history';

const cleanMessageText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\[\s*(?:sbu_tech_kb_[a-z0-9_]+|chunk[\s_]*\d+[^\]]*|p\d+_c\d+[^\]]*)\]/gi, '')
    .replace(/\[\s*sbu_[^\]]+\]/gi, '')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
};

const INITIAL_GREETING: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `Hello! Welcome to SBU TECH.

I can help you with our engineering services, past projects, client portal access, and general company questions.

How can I help you today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize ephemeral in-memory session (clears automatically on page refresh/tab close)
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch {
      // Ignore storage access errors
    }
    const newSid = `sbu_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    setSessionId(newSid);
  }, []);

  // Auto-scroll to bottom of message list
  useEffect(() => {
    if (isOpen) {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isLoading, isOpen]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = (await response.json()) as BackendChatResponse;

      // Update session ID in memory if backend re-allocated
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
      }

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: cleanMessageText(data.answer) || 'I could not retrieve an answer at this time.',
        status: data.status,
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content:
          'I am currently experiencing connectivity issues reaching the AI knowledge base. Please try again in a moment.',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = async () => {
    const newSid = `sbu_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    setSessionId(newSid);
    try {
      await fetch('/api/ai/session/new', { method: 'POST' });
    } catch (e) {
      console.warn('Session reset error:', e);
    }
    setMessages([INITIAL_GREETING]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isRTLText = (text: string) => {
    return /[\u0600-\u06FF]/.test(text);
  };

  return (
    <>
      {/* Floating AI Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open SBU TECH Assistant"
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1E5A54] dark:bg-[#FF642D] text-[#EEE6E2] dark:text-[#08090B] shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ease-out border border-[#1E5A54]/30 dark:border-white/20"
          >
            {/* Icon */}
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105 duration-200" />

            {/* Online Dot */}
            <span className="absolute top-1 right-1 inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#1E5A54] dark:border-[#08090B]" />
          </button>
        )}
      </div>

      {/* Floating Chat Popup Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="SBU TECH AI Assistant"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onWheel={(e) => {
            // Forward mouse wheel scrolling to messages if cursor is over header or footer (not textarea)
            if (
              messagesContainerRef.current &&
              !messagesContainerRef.current.contains(e.target as Node) &&
              e.target !== textareaRef.current
            ) {
              messagesContainerRef.current.scrollTop += e.deltaY;
            }
          }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-5rem)] rounded-2xl shadow-2xl overflow-hidden border border-[rgba(30,90,84,0.18)] dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] text-[#1E5A54] dark:text-[#F5F1EA] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 overscroll-contain"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#EEE6E2] dark:bg-[#101215] border-b border-[rgba(30,90,84,0.12)] dark:border-[#292D32] select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-[#1E5A54]/20 dark:border-white/20 bg-white shadow-sm shrink-0">
                <Image
                  src="/logo.jpeg"
                  alt="SBU TECH"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm tracking-wide text-[#1E5A54] dark:text-[#F5F1EA]">
                  SBU TECH Assistant
                </h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* New Conversation Button */}
              <button
                onClick={handleNewConversation}
                title="Start new conversation"
                aria-label="Start new conversation"
                className="p-1.5 rounded-lg text-[rgba(30,90,84,0.7)] dark:text-[#A9ADB3] hover:text-[#1E5A54] dark:hover:text-[#F5F1EA] hover:bg-[rgba(30,90,84,0.08)] dark:hover:bg-[#1D2025] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close AI Assistant"
                aria-label="Close AI Assistant"
                className="p-1.5 rounded-lg text-[rgba(30,90,84,0.7)] dark:text-[#A9ADB3] hover:text-[#F7623D] dark:hover:text-[#FF642D] hover:bg-[rgba(30,90,84,0.08)] dark:hover:bg-[#1D2025] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            ref={messagesContainerRef}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain"
            style={{ overscrollBehavior: 'contain' }}
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const rtl = isRTLText(msg.content);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    dir={rtl ? 'rtl' : 'auto'}
                    className={`relative max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-[#1E5A54] dark:bg-[#FF642D] text-[#EEE6E2] dark:text-[#08090B] rounded-br-none shadow-md'
                        : msg.isError
                        ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 rounded-bl-none'
                        : 'bg-[#EEE6E2] dark:bg-[#1D2025] text-[#1E5A54] dark:text-[#F5F1EA] border border-[rgba(30,90,84,0.12)] dark:border-[#292D32] rounded-bl-none shadow-sm'
                    }`}
                  >
                    {cleanMessageText(msg.content)}

                    {/* Copy Button for Assistant Responses */}
                    {!isUser && !msg.isError && (
                      <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-[rgba(30,90,84,0.1)] dark:border-[#292D32]">
                        <span className="text-[10px] text-[rgba(30,90,84,0.6)] dark:text-[#A9ADB3]">
                          {msg.timestamp}
                        </span>
                        <button
                          onClick={() => handleCopy(msg.id, cleanMessageText(msg.content))}
                          className="flex items-center gap-1 text-[11px] text-[rgba(30,90,84,0.7)] dark:text-[#A9ADB3] hover:text-[#1E5A54] dark:hover:text-[#F5F1EA] transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Retry Option on Error */}
                  {msg.isError && (
                    <button
                      onClick={() => {
                        const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
                        if (lastUserMsg) handleSendMessage(lastUserMsg.content);
                      }}
                      className="text-[11px] text-[#F7623D] dark:text-[#FF642D] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry question</span>
                    </button>
                  )}
                </div>
              );
            })}

            {/* Thinking / Typing Animation */}
            {isLoading && (
              <div className="flex items-start space-y-1">
                <div className="bg-[#EEE6E2] dark:bg-[#1D2025] border border-[rgba(30,90,84,0.12)] dark:border-[#292D32] rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E5A54] dark:bg-[#FF642D] animate-pulse [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E5A54] dark:bg-[#FF642D] animate-pulse [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E5A54] dark:bg-[#FF642D] animate-pulse" />
                    <span className="text-xs text-[rgba(30,90,84,0.7)] dark:text-[#A9ADB3] ml-1.5">
                      Replying...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#EEE6E2] dark:bg-[#101215] border-t border-[rgba(30,90,84,0.12)] dark:border-[#292D32]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center gap-2"
            >
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about SBU TECH services, portal, etc..."
                rows={1}
                maxLength={2000}
                disabled={isLoading}
                dir="auto"
                className="w-full resize-none rounded-xl px-3.5 py-2.5 text-sm bg-[#F8F4F2] dark:bg-[#15181C] text-[#1E5A54] dark:text-[#F5F1EA] placeholder-[rgba(30,90,84,0.5)] dark:placeholder-[#A9ADB3]/60 border border-[rgba(30,90,84,0.18)] dark:border-[#292D32] focus:outline-none focus:ring-1 focus:ring-[#F7623D] dark:focus:ring-[#FF642D] disabled:opacity-50 transition-all max-h-28"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send message"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1E5A54] dark:bg-[#FF642D] text-[#EEE6E2] dark:text-[#08090B] hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Notice */}
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-[rgba(30,90,84,0.55)] dark:text-[#A9ADB3]/70">
              <span>Press Enter to send (Shift+Enter for newline)</span>
              <span>{inputMessage.length}/2000</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
