import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { MOCK_MODE } from './config';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Custom storage adapter for React Native using SecureStore
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Ignore storage errors in mock mode
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignore storage errors in mock mode
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: !MOCK_MODE,
    persistSession: !MOCK_MODE,
    detectSessionInUrl: false,
  },
});

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    dataMode: 'cloud' | 'local' | 'shred';
  };
}

export interface Entry {
  id: string;
  user_id: string;
  created_at: string;
  photo_urls: string[];
  extracted_text: string;
  overview: string;
}

export interface Tangent {
  id: string;
  entry_id: string;
  user_id: string;
  name: string;
  emotion: string;
  is_interacted: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  tangent_id: string;
  role: 'ai' | 'user';
  content: string;
  created_at: string;
}
