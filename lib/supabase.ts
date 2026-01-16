
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  const val = process.env[key];
  if (!val || val === 'undefined' || val === 'null') return '';
  return val;
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

let supabaseClient: any = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Error al inicializar Supabase:", err);
  }
}

// Exportamos un objeto que SIEMPRE exista, aunque sus propiedades sean nulas,
// o simplemente el cliente que puede ser null (App.tsx lo maneja ahora).
export const supabase = supabaseClient;
