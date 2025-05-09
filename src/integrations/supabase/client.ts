
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

// Validate that we have required configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[supabase] Missing required configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  throw new Error('Supabase environment variables are not set.');
}

// DEBUG: log Supabase connection info
console.log('[supabase] Initializing client with URL:', supabaseUrl);
console.log('[supabase] ANON_KEY valid:', !!supabaseAnonKey && supabaseAnonKey.length > 20);

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-auth-token',
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
