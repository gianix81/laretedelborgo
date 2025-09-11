import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Usa valori di fallback se le variabili d'ambiente non sono configurate
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-key';

// Verifica se Supabase è configurato correttamente
export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         supabaseUrl !== fallbackUrl && 
         supabaseAnonKey !== fallbackKey &&
         !supabaseUrl.includes('placeholder') &&
         !supabaseAnonKey.includes('placeholder');
};

export const supabase = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseAnonKey || fallbackKey
);