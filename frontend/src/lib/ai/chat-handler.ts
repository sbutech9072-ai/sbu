/**
 * Master Edge AI Chat Orchestrator for SBU TECH.
 * Operates entirely within Cloudflare Workers / Next.js Edge Runtime.
 * Zero external servers required.
 */

import { ChatRequest, ChatResponse, EdgeAIEnv, KnowledgeChunk } from './types';
import {
  isAdversarialOrInjection,
  detectBengali,
  getRefusalResponse,
  getAbstentionResponse,
  extractAndValidateCitations,
} from './guardrails';
import { generateGeminiEmbedding } from './gemini-embedding';
import { retrieveChunksFromSupabase } from './supabase-retriever';
import {
  generateAnswerWithAgentRouter,
  generateAnswerWithGemini,
} from './llm-generator';

export async function handleAIChat(
  payload: ChatRequest,
  env: EdgeAIEnv = {}
): Promise<ChatResponse> {
  const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const sessionId = payload.session_id || `sbu_${Math.random().toString(36).slice(2, 10)}`;
  const message = (payload.message || '').trim();

  // 1. Validate Input
  if (!message) {
    return {
      answer: 'Please provide a question or inquiry.',
      session_id: sessionId,
      status: 'error',
      confidence: 0,
      model: 'system',
      sources: [],
      request_id: requestId,
    };
  }

  const isBengali = detectBengali(message) || payload.language === 'bn';

  // 2. Guardrails: Adversarial / Prompt Injection Defense
  if (isAdversarialOrInjection(message)) {
    return {
      answer: getRefusalResponse(isBengali),
      session_id: sessionId,
      status: 'out_of_scope',
      confidence: 0.0,
      model: 'guardrails/defense',
      sources: [],
      request_id: requestId,
    };
  }

  // 3. Resolve Environment Variables
  const geminiKey =
    env.GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') ||
    '';

  const supabaseUrl =
    env.SUPABASE_URL ||
    (typeof process !== 'undefined' ? process.env?.SUPABASE_URL : '') ||
    'https://rwvziiwpitsupexrijxv.supabase.co';

  const supabaseKey =
    env.SUPABASE_KEY ||
    env.SUPABASE_ANON_KEY ||
    (typeof process !== 'undefined' ? process.env?.SUPABASE_KEY : '') ||
    '';

  const agenticKey =
    env.AGENTIC_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.AGENTIC_API_KEY : '') ||
    '';

  const agenticBaseUrl =
    env.AGENTIC_API_BASE_URL ||
    (typeof process !== 'undefined' ? process.env?.AGENTIC_API_BASE_URL : '') ||
    'https://api.agentrouter.to/api/agentic-api';

  const agenticModel = env.AGENTROUTER_MODEL || 'deepseek-flash';
  const agenticRouteKey = env.AGENTROUTER_ROUTE_KEY || 'models.chat.complete.deepseek.mpp';

  if (!geminiKey || geminiKey.startsWith('PASTE_YOUR_')) {
    throw new Error('GEMINI_API_KEY is not configured in Cloudflare environment secrets.');
  }

  // 4. Generate 1536-dim Embedding via Google Gemini Embedding API
  const queryVector = await generateGeminiEmbedding(
    message,
    geminiKey,
    'gemini-embedding-2',
    1536
  );

  // 5. Retrieve Grounded Context from Supabase pgvector
  let candidateChunks: KnowledgeChunk[] = [];
  try {
    candidateChunks = await retrieveChunksFromSupabase(
      queryVector,
      supabaseUrl,
      supabaseKey,
      5,
      0.25
    );
  } catch (err: any) {
    console.warn('Supabase retrieval warning:', err?.message || err);
    // If Supabase table is not yet seeded, continue with empty chunks so fallback works gracefully
    candidateChunks = [];
  }

  // 6. Check Retrieval Quality / Abstention
  const topSimilarity = candidateChunks[0]?.similarity || 0;
  if (candidateChunks.length === 0 || topSimilarity < 0.28) {
    // If query is an informal greeting, give friendly studio greeting
    const isGreeting = /^(hi|hello|hey|salam|assalamu\s*alaikum|ki\s*obsta|kemon\s*acho|hola)/i.test(
      message
    );
    if (isGreeting) {
      const greetingAnswer = isBengali
        ? 'হ্যালো! SBU TECH-এ আপনাকে স্বাগতম। আমি আমাদের সফটওয়্যার ইঞ্জিনিয়ারিং সার্ভিস, ওয়েব প্ল্যাটফর্ম, ক্লাউড আর্কিটেকচার এবং প্রজেক্ট সংক্রান্ত যেকোনো তথ্যে সাহায্য করতে পারি। কীভাবে সাহায্য করতে পারি?'
        : 'Hello! Welcome to SBU TECH. I am your studio AI assistant. I can help you with information about our software engineering services, web platforms, cloud architecture, and project workflows. How can I help you today?';

      return {
        answer: greetingAnswer,
        session_id: sessionId,
        status: 'grounded',
        confidence: 0.95,
        model: 'studio/greeting',
        sources: [],
        request_id: requestId,
      };
    }

    return {
      answer: getAbstentionResponse(isBengali),
      session_id: sessionId,
      status: 'no_relevant_information',
      confidence: 0.1,
      model: 'grounding/abstention',
      sources: [],
      request_id: requestId,
    };
  }

  // 7. Generate Answer (AgentRouter DeepSeek Flash or Gemini Flash)
  let rawAnswer = '';
  let modelUsed = '';

  const hasAgenticKey =
    Boolean(agenticKey) &&
    !agenticKey.startsWith('PASTE_YOUR_') &&
    agenticKey.length > 15;

  if (hasAgenticKey) {
    try {
      const genResult = await generateAnswerWithAgentRouter(
        message,
        candidateChunks,
        [],
        agenticKey,
        agenticBaseUrl,
        agenticModel,
        agenticRouteKey
      );
      rawAnswer = genResult.answer;
      modelUsed = genResult.model;
    } catch (e: any) {
      console.warn('AgentRouter invocation failed, falling back to Gemini Flash:', e?.message);
      const fallbackResult = await generateAnswerWithGemini(
        message,
        candidateChunks,
        [],
        geminiKey
      );
      rawAnswer = fallbackResult.answer;
      modelUsed = `${fallbackResult.model} (fallback)`;
    }
  } else {
    // Use Gemini Flash directly
    const genResult = await generateAnswerWithGemini(
      message,
      candidateChunks,
      [],
      geminiKey
    );
    rawAnswer = genResult.answer;
    modelUsed = genResult.model;
  }

  // 8. Citations & Safety Validation
  const { cleanedAnswer, verifiedSources } = extractAndValidateCitations(
    rawAnswer,
    candidateChunks
  );

  return {
    answer: cleanedAnswer,
    session_id: sessionId,
    status: 'grounded',
    confidence: Math.min(0.99, Math.max(0.6, topSimilarity + 0.15)),
    model: modelUsed,
    sources: verifiedSources,
    request_id: requestId,
  };
}
