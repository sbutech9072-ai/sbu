export interface SourceCitation {
  chunk_id: string;
  source_file: string;
  page_number: number;
  section_title?: string;
  similarity_score?: number;
  preview?: string;
}

export interface ChatRequest {
  session_id?: string;
  message: string;
  language?: string;
}

export interface ChatResponse {
  answer: string;
  session_id: string;
  status: 'grounded' | 'no_relevant_information' | 'out_of_scope' | 'error';
  confidence: number;
  model: string;
  sources: SourceCitation[];
  request_id: string;
}

export interface KnowledgeChunk {
  id: number;
  chunk_id: string;
  title?: string;
  page_number: number;
  content: string;
  metadata?: {
    document_id?: string;
    source_file?: string;
    chunk_index?: number;
    content_type?: string;
    [key: string]: any;
  };
  similarity: number;
}

export interface ConversationHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface EdgeAIEnv {
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
  GEMINI_API_KEY?: string;
  GEMINI_EMBEDDING_MODEL?: string;
  AGENTIC_API_KEY?: string;
  AGENTIC_API_BASE_URL?: string;
  AGENTROUTER_MODEL?: string;
  AGENTROUTER_ROUTE_KEY?: string;
  [key: string]: any;
}

