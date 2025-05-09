
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Read Supabase configuration from environment, with safe fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qainlosbrisovatxvxxx.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjkzMzQsImV4cCI6MjA2MjA0NTMzNH0.IUmUKVIU4mjE7iuwbm-V-pGbUDjP2dj_jAl9fzILJXs';

// Warn if variables are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '[supabase] Missing configuration: please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env'
  );
}

// Helper to clean up any leftover auth tokens
export function cleanupAuthState() {
  console.log('[supabase] Cleaning up auth state');
  
  // Remove Supabase session tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Clear all Supabase auth-related keys in localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`[supabase] Removing localStorage key: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Clear all Supabase auth-related keys in sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log(`[supabase] Removing sessionStorage key: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
  }
  
  console.log('[supabase] Auth state cleanup complete');
}

// Initialize Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-qainlosbrisovatxvxxx-auth-token',
    },
  }
);

// Debug initialization
console.log('[supabase] Initializing client with URL:', SUPABASE_URL);
console.log('[supabase] Anonymous key present:', SUPABASE_ANON_KEY.length > 20);

// Test connection
supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) console.error('[supabase] Connection test failed:', error);
    else console.log('[supabase] Connection test successful, session:', !!data.session);
  })
  .catch(err => console.error('[supabase] Connection test exception:', err));
