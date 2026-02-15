
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

/**
 * Cliente Interno de Respaldo (Silencioso)
 * Maneja la persistencia en localStorage sin emitir logs ni avisos.
 */
const createInternalClient = () => {
  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        const checkAuth = () => {
          const savedUser = localStorage.getItem('app_persistence_u');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            callback('SIGNED_IN', { user, session: { user } });
          } else {
            callback('SIGNED_OUT', null);
          }
        };
        checkAuth();
        const listener = () => checkAuth();
        window.addEventListener('storage', listener);
        return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', listener) } } };
      },
      signInWithPassword: async ({ email, password }: any) => {
        const users = JSON.parse(localStorage.getItem('app_persistence_db_u') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('app_persistence_u', JSON.stringify(user));
          window.dispatchEvent(new Event('storage'));
          return { data: { user }, error: null };
        }
        return { data: null, error: { message: 'Credenciales no encontradas.' } };
      },
      signUp: async ({ email, password, options }: any) => {
        const users = JSON.parse(localStorage.getItem('app_persistence_db_u') || '[]');
        if (users.find((u: any) => u.email === email)) {
          return { data: null, error: { message: 'El correo ya está registrado.' } };
        }
        const newUser = { 
          id: 'u_' + Math.random().toString(36).substr(2, 9), 
          email, 
          password,
          user_metadata: options?.data || {} 
        };
        users.push(newUser);
        localStorage.setItem('app_persistence_db_u', JSON.stringify(users));
        localStorage.setItem('app_persistence_u', JSON.stringify(newUser));
        window.dispatchEvent(new Event('storage'));
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('app_persistence_u');
        window.dispatchEvent(new Event('storage'));
        return { error: null };
      }
    },
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: any) => ({
          order: () => {
            let data = JSON.parse(localStorage.getItem(`app_persistence_db_${table}`) || '[]');
            if (col && val) data = data.filter((item: any) => item[col] === val);
            return Promise.resolve({ data, error: null });
          }
        }),
        order: () => {
          const data = JSON.parse(localStorage.getItem(`app_persistence_db_${table}`) || '[]');
          return Promise.resolve({ data, error: null });
        }
      }),
      insert: (rows: any[]) => ({
        select: () => ({
          single: () => {
            const data = JSON.parse(localStorage.getItem(`app_persistence_db_${table}`) || '[]');
            const newRow = { ...rows[0], id: 'r_' + Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() };
            data.push(newRow);
            localStorage.setItem(`app_persistence_db_${table}`, JSON.stringify(data));
            return Promise.resolve({ data: newRow, error: null });
          }
        })
      })
    }),
    isInternal: true
  };
};

let client: any = null;

if (isValidUrl(supabaseUrl) && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl!, supabaseAnonKey);
  } catch {
    client = createInternalClient();
  }
} else {
  client = createInternalClient();
}

export const supabase = client;
