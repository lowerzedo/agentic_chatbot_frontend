import axios from 'axios';
import type {
  ChatSession,
  ChatResponse,
  DocumentsResponse,
  UploadResponse,
  VectorStats,
  HealthResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async (): Promise<HealthResponse> => {
  const response = await api.get('/health');
  return response.data;
};

export const createChatSession = async (): Promise<ChatSession> => {
  const response = await api.post('/chat/session');
  return response.data;
};

export const sendMessage = async (
  sessionId: string,
  message: string
): Promise<ChatResponse> => {
  const response = await api.post(`/chat/session/${sessionId}/message`, {
    message,
  });
  return response.data;
};

export const uploadDocument = async (
  file: File,
  title?: string,
  description?: string,
  category?: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (title) formData.append('title', title);
  if (description) formData.append('description', description);
  if (category) formData.append('category', category);

  const response = await api.post('/upload-document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getDocuments = async (): Promise<DocumentsResponse> => {
  const response = await api.get('/documents');
  return response.data;
};

export const deleteDocument = async (documentId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};

export const getVectorStats = async (): Promise<VectorStats> => {
  const response = await api.get('/vector-stats');
  return response.data;
};

export default api; 