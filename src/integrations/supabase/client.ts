// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Carrega do .env (VITE_*) — certifique-se de ter no seu .env:
// VITE_SUPABASE_URL=https://…
// VITE_SUPABASE_ANON_KEY=eyJ…
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

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
    // opcional: define timeout de requisição, logging etc
    // global: { fetch: customFetch },
  }
);
