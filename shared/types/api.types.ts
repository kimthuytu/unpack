// Shared API types

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextToken?: string;
}

export interface CreateEntryRequest {
  images: string[];
}

export interface SendChatMessageRequest {
  message: string;
}


