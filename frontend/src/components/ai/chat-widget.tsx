'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Copy,
  Check,
  FileText,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
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

const INITIAL_GREETING: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `Hello! Welcome to SBU TECH.

I'm your AI assistant. I can help you with information about our services, projects, client portal, login guidance and other company-related questions.

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
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize session and restore history from localStorage
  useEffect(() => {
    try {
      const savedSid = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSid) {
        setSessionId(savedSid);
      } else {
        const newSid = `sbu_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
        setSessionId(newSid);
        localStorage.setItem(STORAGE_SESSION_KEY, newSid);
      }

      const savedHistory = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load chat history from localStorage', e);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(messages));
      } catch (e) {
        console.warn('Failed to save chat history to localStorage', e);
      }
    }
  }, [messages]);

  // Auto-scroll to bottom of message list
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      // Update session ID if backend re-allocated
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
        localStorage.setItem(STORAGE_SESSION_KEY, data.session_id);
      }

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'I could not retrieve an answer at this time.',
        status: data.status,
        sources: data.sources || [],
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
      localStorage.setItem(STORAGE_SESSION_KEY, newSid);
      localStorage.removeItem(STORAGE_HISTORY_KEY);
      await fetch('/api/ai/session/new', { method: 'POST' });
    } catch (e) {
      console.warn('Session reset error:', e);
    }
    setMessages([INITIAL_GREETING]);
    setExpandedSources({});
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
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
            aria-label="Open SBU TECH AI Assistant"
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1E5A54] dark:bg-[#FF642D] text-[#EEE6E2] dark:text-[#08090B] shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ease-out border border-[#F7623D]/30 dark:border-white/20"
          >
            {/* Subtle Glowing Pulse Effect */}
            <span className="absolute -inset-1 rounded-full bg-[#F7623D] dark:bg-[#FF642D] opacity-30 animate-pulse group-hover:opacity-50 blur-sm pointer-events-none" />

            {/* Icon */}
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:rotate-12 duration-300" />

            {/* Notification Badge / Online Dot */}
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#1E5A54] dark:border-[#08090B]" />
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Popup Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="SBU TECH AI Assistant"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-5rem)] rounded-2xl shadow-2xl overflow-hidden border border-[rgba(30,90,84,0.18)] dark:border-[#292D32] bg-[#F8F4F2] dark:bg-[#15181C] text-[#1E5A54] dark:text-[#F5F1EA] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#EEE6E2] dark:bg-[#101215] border-b border-[rgba(30,90,84,0.12)] dark:border-[#292D32] select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#1E5A54] dark:bg-[#FF642D] text-[#EEE6E2] dark:text-[#08090B]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm tracking-wide text-[#1E5A54] dark:text-[#F5F1EA]">
                    SBU TECH Assistant
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-[rgba(30,90,84,0.7)] dark:text-[#A9ADB3]">
                  Verified Studio RAG Knowledge Base
                </p>
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
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
                    {msg.content}

                    {/* Copy Button for Assistant Responses */}
                    {!isUser && !msg.isError && (
                      <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-[rgba(30,90,84,0.1)] dark:border-[#292D32]">
                        <span className="text-[10px] text-[rgba(30,90,84,0.6)] dark:text-[#A9ADB3]">
                          {msg.timestamp}
                        </span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
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

                  {/* Verified Knowledge-Base Sources Accordion */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="w-[88%] mt-1">
                      <button
                        onClick={() => toggleSources(msg.id)}
                        className="flex items-center gap-1 text-[11px] font-medium text-[#F7623D] dark:text-[#FF642D] hover:underline"
                      >
                        <FileText className="w-3 h-3" />
                        <span>
                          {expandedSources[msg.id] ? 'Hide' : 'View'} {msg.sources.length} Verified{' '}
                          {msg.sources.length === 1 ? 'Source' : 'Sources'}
                        </span>
                        {expandedSources[msg.id] ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {expandedSources[msg.id] && (
                        <div className="mt-1.5 p-2 rounded-lg bg-[#EEE6E2]/70 dark:bg-[#101215]/80 border border-[rgba(30,90,84,0.1)] dark:border-[#292D32] space-y-1.5 animate-in fade-in duration-200">
                          {msg.sources.map((src, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] flex items-start gap-1.5 text-[rgba(30,90,84,0.85)] dark:text-[#A9ADB3]"
                            >
                              <span className="font-semibold text-[#1E5A54] dark:text-[#F5F1EA]">
                                [{src.page_number ? `P.${src.page_number}` : 'Doc'}]
                              </span>
                              <span className="flex-1 truncate">{src.section_title}</span>
                              <span className="text-[10px] opacity-75">({src.source_file})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

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
                    <span className="w-2 h-2 rounded-full bg-[#1E5A54] dark:bg-[#FF642D] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#1E5A54] dark:bg-[#FF642D] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#1E5A54] dark:bg-[#FF642D] animate-bounce" />
                    <span className="text-xs text-[rgba(30,90,84,0.7)] dark:text-[#A9ADB3] ml-1.5">
                      Consulting knowledge base...
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
