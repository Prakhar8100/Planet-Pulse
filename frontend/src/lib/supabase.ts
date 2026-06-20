import { createClient } from '@supabase/supabase-js';

// We fallback to empty strings to avoid crashing during build/mock modes
// Users must provide their own environment variables in .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
