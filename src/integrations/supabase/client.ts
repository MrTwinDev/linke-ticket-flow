
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Define hardcoded values for development
const SUPABASE_URL = "https://qainlosbrisovatxvxxx.supabase.co";
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjkzMzQsImV4cCI6MjA2MjA0NTMzNH0.IUmUKVIU4mjE7iuwbm-V-pGbUDjP2dj_jAl9fzILJXs';

// Helper function to clean up auth state (important for preventing auth limbo states)
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// DEBUG: log Supabase connection info
console.log('[supabase] Initializing client with URL:', SUPABASE_URL);
console.log('[supabase] ANON_KEY valid:', !!SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20);

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

// Debug supabase client initialization
console.log('[supabase] Client initialized successfully');

// Testing supabase connectivity
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('[supabase] Connection test failed:', error);
  } else {
    console.log('[supabase] Connection test successful, session:', !!data.session);
  }
}).catch(err => {
  console.error('[supabase] Connection test exception:', err);
});
