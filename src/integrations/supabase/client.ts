
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Define hardcoded values for development
// IMPORTANT: In production, these should come from environment variables
const SUPABASE_URL = 'https://qainlosbrisovatxvxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjkzMzQsImV4cCI6MjA2MjA0NTMzNH0.IUmUKVIU4mjE7iuwbm-V-pGbUDjP2dj_jAl9fzILJXs';

// DEBUG: confira no console se as variáveis estão corretas
console.log('[supabase] URL:', SUPABASE_URL);
console.log('[supabase] ANON_KEY length:', SUPABASE_ANON_KEY?.length);
console.log('[supabase] ANON_KEY prefix:', SUPABASE_ANON_KEY?.substring(0,10));

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
