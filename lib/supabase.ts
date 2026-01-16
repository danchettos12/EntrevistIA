
import { createClient } from '@supabase/supabase-js';

// En Vite, las variables definidas en vite.config.ts se inyectan en process.env
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

let supabaseClient: any = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Error crítico al inicializar el SDK de Supabase:", err);
  }
} else {
  console.warn("Advertencia: Las credenciales de Supabase no están configuradas en el entorno actual.");
}

export const supabase = supabaseClient;
