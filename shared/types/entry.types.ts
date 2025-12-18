// Shared types for Entry model between frontend and backend

export interface Entry {
  id: string;
  userId: string;
  createdAt: string;
  images: string[];
  ocrText?: string;
  ocrConfidence?: number;
  sentiment?: {
    label: string;
    score: number;
  };
  emotions?: string[];
  summary?: string;
  keySentences?: string[];
}

export interface Sentiment {
  label: string;
  score: number;
}


