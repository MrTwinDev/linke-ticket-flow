
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Read Supabase configuration from environment, with safe fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qainlosbrisovatxvxxx.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NDQ1ODQsImV4cCI6MjA2MjMyMDU4NH0.lclY8r3E25zZbvhPboYVNj0qZGuL4sM2EopH3G_BvAI';

// Helper to clean up any leftover auth tokens - Only remove Supabase specific tokens
export function cleanupAuthState() {
  console.log('[supabase] Cleaning up auth state...');
  
  try {
    // Only remove Supabase session tokens to avoid conflicts
    const currentStorageKey = `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`;
    
    // Clear localStorage and sessionStorage in safe manner
    // Only clear the exact keys we need to clear to prevent removing unrelated data
    localStorage.removeItem(currentStorageKey);
    
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(currentStorageKey);
    }
    
    console.log('[supabase] Auth state cleanup complete');
  } catch (err) {
    console.error('[supabase] Error during auth state cleanup:', err);
  }
}

// Initialize Supabase client with explicit configuration
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`,
      debug: true, // Enable debug logs for authentication issues
    },
  }
);

// Debug initialization
console.log('[supabase] Initializing client with URL:', SUPABASE_URL);
console.log('[supabase] Anonymous key present:', SUPABASE_ANON_KEY.length > 0);

// Test connection
supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) console.error('[supabase] Connection test failed:', error);
    else console.log('[supabase] Connection test successful, session:', !!data.session);
  })
  .catch(err => console.error('[supabase] Connection test exception:', err));
