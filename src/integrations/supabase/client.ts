
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lvqmmjdqrxtsxmwbrmqb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cW1tamRxcnh0c3htd2JybXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjU5NjgsImV4cCI6MjA1ODQwMTk2OH0.L49gkRXDOk0Kon_3LJoSFFpsjb0zLDIckVdStxGHt8k";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
