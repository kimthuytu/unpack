export interface ChatMessage {
  id: string;
  entryId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    highlightedSentences?: string[];
    emotionFocus?: string;
  };
}

export interface SendChatMessageRequest {
  message: string;
}



