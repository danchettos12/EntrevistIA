
import { createClient } from '@supabase/supabase-js';

// En entornos Vite, process.env es inyectado vía vite.config.ts
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabaseClient: any = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "" && supabaseAnonKey !== "") {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase inicializado correctamente.");
  } catch (err) {
    console.error("Error al crear el cliente de Supabase:", err);
  }
} else {
  console.error("ERROR DE CONFIGURACIÓN: Faltan las variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY.");
  console.log("Asegúrate de configurar estas variables en el panel de Vercel.");
}

export const supabase = supabaseClient;
