
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Define hardcoded values for development
// IMPORTANT: In production, these should come from environment variables
const SUPABASE_URL = "https://qainlosbrisovatxvxxx.supabase.co";
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaW5sb3Nicmlzb3ZhdHh2eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjkzMzQsImV4cCI6MjA2MjA0NTMzNH0.IUmUKVIU4mjE7iuwbm-V-pGbUDjP2dj_jAl9fzILJXs';

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
      storageKey: 'supabase-auth-token',
      storage: localStorage,
      detectSessionInUrl: true, // This enables OAuth redirects
    },
  }
);

// Debug supabase client initialization
console.log('[supabase] Client initialized successfully');

// Function to clean up any stale auth state
export const cleanupAuthState = () => {
  console.log("[supabase] Cleaning up auth state");
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`[supabase] Removing key: ${key}`);
      localStorage.removeItem(key);
    }
  });
};

// Add a helper function to diagnose auth issues
export const logAuthDiagnostics = () => {
  console.log("🔍 Auth Diagnostics Report");
  console.log("---------------------------");

  // Check current session
  supabase.auth.getSession().then(({ data: { session } }) => {
    console.log("Current session:", session ? "Active" : "None");
    if (session) {
      console.log("Session expires at:", new Date(session.expires_at! * 1000).toLocaleString());
      console.log("User ID:", session.user.id);
      console.log("User email:", session.user.email);
    }
  });

  // Check localStorage items
  console.log("\nLocal Storage Auth Items:");
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`- ${key}: [${typeof localStorage.getItem(key)}]`);
    }
  });

  console.log("---------------------------");
};
