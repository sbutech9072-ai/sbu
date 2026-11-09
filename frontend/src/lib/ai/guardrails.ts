/**
 * Production Guardrails & Safety Filters for SBU TECH Edge AI Assistant.
 * Ported from Phase 4 Python implementation.
 */

import { KnowledgeChunk, SourceCitation } from './types';

// Regex patterns to detect adversarial injection attempts
const ADVERSARIAL_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /act\s+as\s+(dan|an\s+unrestricted|a\s+jailbreak)/i,
  /pretend\s+(you\s+are|to\s+be)\s+(someone\s+else|an\s+evil|godmode)/i,
  /disregard\s+(company\s+)?(guidelines|rules|policies|instructions)/i,
  /bypass\s+(guardrails|safety|rules|restrictions)/i,
  /reveal\s+(your\s+)?(system\s+prompt|developer\s+mode|internal\s+instructions)/i,
  /what\s+is\s+your\s+(secret\s+)?system\s+prompt/i,
  /tell\s+me\s+your\s+(api\s+key|token|instructions)/i,
  /show\s+me\s+(the\s+)?prompt\s+above/i,
  /sudo\s+mode|jailbreak|developer\s+override/i,
  /পূর্বের\s+সব\s+(নির্দেশ|নিয়ম)\s+ভুলে\s+যান/i,
  /সিস্টেম\s+প্রম্পট\s+দেখান/i,
];

// System prompt leak patterns to scrub from outputs
const LEAK_PATTERNS: RegExp[] = [
  /<retrieved_context>[\s\S]*?<\/retrieved_context>/gi,
  /system_prompt\.txt/gi,
  /models\.chat\.complete\.deepseek\.mpp/gi,
  /models\.embedding\.gemini/gi,
  /AGENTIC_API_KEY|GEMINI_API_KEY|SUPABASE_KEY/gi,
  /You are the official AI Assistant for SBU TECH/gi,
  /STRICT FACTUAL GROUNDING & KNOWLEDGE-BASE-ONLY RULES/gi,
];

export function isAdversarialOrInjection(text: string): boolean {
  if (!text) return false;
  return ADVERSARIAL_PATTERNS.some((pattern) => pattern.test(text));
}

export function detectBengali(text: string): boolean {
  // Unicode range for Bengali: 0980 - 09FF
  return /[\u0980-\u09FF]/.test(text);
}

export function getRefusalResponse(isBengali: boolean): string {
  if (isBengali) {
    return 'আমি SBU TECH-এর অফিসিয়াল AI সহকারী। আমি শুধুমাত্র SBU TECH-এর ইঞ্জিনিয়ারিং সেবা, প্রজেক্ট এবং প্রযুক্তি সংক্রান্ত বিষয়ে তথ্য দিতে পারি। অন্যান্য বা নিয়মবহির্ভূত বিষয়ে উত্তর দেওয়া আমার পক্ষে সম্ভব নয়।';
  }
  return 'I am the official AI assistant for SBU TECH and am designed exclusively to answer questions about SBU TECH and our software engineering services. I cannot process directives that bypass our studio guidelines.';
}

export function getAbstentionResponse(isBengali: boolean): string {
  if (isBengali) {
    return 'আমি SBU TECH-এর বর্তমান নলেজ বেজে এই তথ্যটি খুঁজে পাইনি। বিস্তারিত তথ্যের জন্য অনুগ্রহ করে আমাদের ইঞ্জিনিয়ারিং টিমের সাথে যোগাযোগ করুন (admin@sbutech.com)।';
  }
  return "I couldn't find this information in SBU TECH's current knowledge base. Please contact our team at admin@sbutech.com for direct confirmation.";
}

export function extractAndValidateCitations(
  rawAnswer: string,
  candidateChunks: KnowledgeChunk[]
): { cleanedAnswer: string; verifiedSources: SourceCitation[] } {
  let cleaned = rawAnswer;

  // Scrub any prompt leaks
  for (const leakPattern of LEAK_PATTERNS) {
    cleaned = cleaned.replace(leakPattern, '');
  }

  const validChunkMap = new Map<string, KnowledgeChunk>();
  for (const chunk of candidateChunks) {
    validChunkMap.set(chunk.chunk_id.trim().toLowerCase(), chunk);
  }

  const verifiedSources: SourceCitation[] = [];
  const seenChunkIds = new Set<string>();

  // Regex to match citation tags: [sbu_tech_kb_v1_p2_c006] or [Chunk 1] etc.
  const citationRegex = /\[(sbu_tech_kb_[a-z0-9_]+|chunk\s*\d+)\]/gi;

  cleaned = cleaned.replace(citationRegex, (match, rawId) => {
    const normalized = rawId.trim().toLowerCase();
    const matchedChunk = validChunkMap.get(normalized);

    if (matchedChunk) {
      if (!seenChunkIds.has(matchedChunk.chunk_id)) {
        seenChunkIds.add(matchedChunk.chunk_id);
        verifiedSources.push({
          chunk_id: matchedChunk.chunk_id,
          source_file: matchedChunk.metadata?.source_file || 'SBU_TECH.pdf',
          page_number: matchedChunk.page_number,
          section_title: matchedChunk.title || undefined,
          similarity_score: Math.round((matchedChunk.similarity || 0) * 100) / 100,
          preview: (matchedChunk.content || '').slice(0, 160).trim() + '...',
        });
      }
      return `[${matchedChunk.chunk_id}]`;
    }

    // Strip hallucinated or unverified citation marker
    return '';
  });

  // If no inline citations were used but chunks were retrieved and answer is grounded, include top 2 sources
  if (verifiedSources.length === 0 && candidateChunks.length > 0) {
    for (const chunk of candidateChunks.slice(0, 2)) {
      if (!seenChunkIds.has(chunk.chunk_id)) {
        seenChunkIds.add(chunk.chunk_id);
        verifiedSources.push({
          chunk_id: chunk.chunk_id,
          source_file: chunk.metadata?.source_file || 'SBU_TECH.pdf',
          page_number: chunk.page_number,
          section_title: chunk.title || undefined,
          similarity_score: Math.round((chunk.similarity || 0) * 100) / 100,
          preview: (chunk.content || '').slice(0, 160).trim() + '...',
        });
      }
    }
  }

  return {
    cleanedAnswer: cleaned.trim(),
    verifiedSources,
  };
}
