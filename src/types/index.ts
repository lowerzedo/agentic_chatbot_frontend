export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
}

export interface ChatSession {
  session_id: string;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  original_filename: string;
  category: string;
  file_size: number;
  is_processed: boolean;
  chunk_count: number;
  uploaded_at: string;
}

export interface ChatResponse {
  confidence_score: number;
  message_id: string;
  response: string;
}

export interface UploadResponse {
  message: string;
  document_id: string;
  filename: string;
}

export interface DocumentsResponse {
  documents: Document[];
}

export interface VectorStats {
  vector_database: {
    total_chunks: number;
  };
  database: {
    total_documents: number;
    processed_documents: number;
    unprocessed_documents: number;
  };
}

export interface HealthResponse {
  status: string;
  timestamp: string;
} 