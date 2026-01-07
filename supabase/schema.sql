-- Unpack Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{"theme": "system", "dataMode": "cloud"}'::jsonb
);

-- Entries table (journal entries with photos)
CREATE TABLE IF NOT EXISTS public.entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  photo_urls TEXT[] DEFAULT '{}',
  extracted_text TEXT,
  overview TEXT
);

-- Tangents table (thought threads within entries)
CREATE TABLE IF NOT EXISTS public.tangents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emotion TEXT,
  is_interacted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (chat history)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tangent_id UUID NOT NULL REFERENCES public.tangents(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('ai', 'user')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON public.entries(user_id);
CREATE INDEX IF NOT EXISTS idx_tangents_user_id ON public.tangents(user_id);
CREATE INDEX IF NOT EXISTS idx_tangents_entry_id ON public.tangents(entry_id);
CREATE INDEX IF NOT EXISTS idx_messages_tangent_id ON public.messages(tangent_id);
CREATE INDEX IF NOT EXISTS idx_tangents_created_at ON public.tangents(created_at DESC);

-- Row Level Security (RLS) Policies
-- Users can only access their own data

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tangents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Entries policies
CREATE POLICY "Users can view own entries" ON public.entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own entries" ON public.entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" ON public.entries
  FOR DELETE USING (auth.uid() = user_id);

-- Tangents policies
CREATE POLICY "Users can view own tangents" ON public.tangents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tangents" ON public.tangents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tangents" ON public.tangents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tangents" ON public.tangents
  FOR DELETE USING (auth.uid() = user_id);

-- Messages policies (through tangent ownership)
CREATE POLICY "Users can view messages in own tangents" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tangents
      WHERE tangents.id = messages.tangent_id
      AND tangents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own tangents" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tangents
      WHERE tangents.id = messages.tangent_id
      AND tangents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages in own tangents" ON public.messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.tangents
      WHERE tangents.id = messages.tangent_id
      AND tangents.user_id = auth.uid()
    )
  );

-- Storage bucket for photos
-- Run this separately in Storage section or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('journal-photos', 'journal-photos', false);

