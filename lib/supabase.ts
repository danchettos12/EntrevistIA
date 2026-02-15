
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url === "" || url.includes("YOUR_") || url === "undefined" || url === "null") return false;
  try {
    const parsedUrl = new URL(url);
    return (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') && parsedUrl.hostname !== '';
  } catch {
    return false;
  }
};

let supabaseClient: any = null;

if (isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== "" && supabaseAnonKey !== "undefined") {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey);
  } catch (err) {
    console.error("Error al inicializar Supabase:", err);
  }
}

export const supabase = supabaseClient;
