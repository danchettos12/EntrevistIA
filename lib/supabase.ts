
import { createClient } from '@supabase/supabase-js';

// Intentamos obtener las variables de entorno de forma segura
const getEnv = (key: string): string => {
  const val = process.env[key];
  // Evitamos strings literales "undefined" que pueden inyectarse por error en el build
  if (!val || val === 'undefined' || val === 'null') return '';
  return val;
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

let supabaseClient = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Error al inicializar Supabase:", err);
  }
} else {
  console.warn("ADVERTENCIA: Credenciales de Supabase no detectadas. La autenticación y base de datos estarán deshabilitadas.");
}

export const supabase = supabaseClient as any;
