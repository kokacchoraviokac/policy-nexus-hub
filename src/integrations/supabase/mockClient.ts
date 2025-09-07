import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://lvqmmjdqrxtsxmwbrmqb.supabase.co";
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create a service role client that bypasses RLS for mock authentication
export const mockSupabaseClient = SUPABASE_SERVICE_KEY 
  ? createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Helper function to check if we should use mock mode
export const shouldUseMockMode = () => {
  return import.meta.env.VITE_USE_MOCK_AUTH === 'true' && mockSupabaseClient !== null;
};