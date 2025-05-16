// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Dados do novo projeto:
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qwacvlrepozukurrqodd.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3YWN2bHJlcG96dWt1cnJxb2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTMxNjgsImV4cCI6MjA2Mjk4OTE2OH0.pe6MBI9X0dj438I5UiK2p0hxbiORxRKB_v6AvGSg0Ac';

// Helper para limpar tokens antigos:
export function cleanupAuthState() {
  console.log('[supabase] Cleaning up auth state...');
  try {
    const currentStorageKey = `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`;
    localStorage.removeItem(currentStorageKey);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(currentStorageKey);
    }
    console.log('[supabase] Auth state cleanup complete');
  } catch (err) {
    console.error('[supabase] Error during auth state cleanup:', err);
  }
}

// Inicializa o cliente Supabase:
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`,
      debug: true,
    },
  }
);

console.log('[supabase] Initializing client with URL:', SUPABASE_URL);
console.log('[supabase] Anonymous key present:', SUPABASE_ANON_KEY.length > 0);

supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) console.error('[supabase] Connection test failed:', error);
    else console.log('[supabase] Connection test successful, session:', !!data.session);
  })
  .catch(err => console.error('[supabase] Connection test exception:', err));