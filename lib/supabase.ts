
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url === "" || url === "undefined" || url === "null" || url.includes("YOUR_")) return false;
  try {
    const parsedUrl = new URL(url);
    return (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') && parsedUrl.hostname !== '';
  } catch {
    return false;
  }
};

const createInternalClient = () => {
  console.warn("⚠️ EntrevistIA: Operando en Modo Local (Base de datos del navegador activa)");
  
  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        const checkAuth = () => {
          const savedUser = localStorage.getItem('entrevistia_user_session');
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
        const users = JSON.parse(localStorage.getItem('entrevistia_db_users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('entrevistia_user_session', JSON.stringify(user));
          window.dispatchEvent(new Event('storage'));
          return { data: { user }, error: null };
        }
        return { data: null, error: { message: 'Credenciales inválidas en modo local.' } };
      },
      signUp: async ({ email, password, options }: any) => {
        const users = JSON.parse(localStorage.getItem('entrevistia_db_users') || '[]');
        if (users.find((u: any) => u.email === email)) {
          return { data: null, error: { message: 'Este correo ya está registrado localmente.' } };
        }
        const newUser = { 
          id: 'local_' + Math.random().toString(36).substr(2, 9), 
          email, 
          password,
          user_metadata: options?.data || {} 
        };
        users.push(newUser);
        localStorage.setItem('entrevistia_db_users', JSON.stringify(users));
        localStorage.setItem('entrevistia_user_session', JSON.stringify(newUser));
        window.dispatchEvent(new Event('storage'));
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('entrevistia_user_session');
        window.dispatchEvent(new Event('storage'));
        return { error: null };
      }
    },
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: any) => ({
          order: (orderCol: string, { ascending }: any = {}) => {
            let data = JSON.parse(localStorage.getItem(`entrevistia_db_${table}`) || '[]');
            if (col && val) data = data.filter((item: any) => item[col] === val);
            data.sort((a: any, b: any) => {
               const valA = new Date(a[orderCol] || 0).getTime();
               const valB = new Date(b[orderCol] || 0).getTime();
               return ascending ? valA - valB : valB - valA;
            });
            return Promise.resolve({ data, error: null });
          }
        }),
        order: (orderCol: string, { ascending }: any = {}) => {
          const data = JSON.parse(localStorage.getItem(`entrevistia_db_${table}`) || '[]');
          data.sort((a: any, b: any) => {
            const valA = new Date(a[orderCol] || 0).getTime();
            const valB = new Date(b[orderCol] || 0).getTime();
            return ascending ? valA - valB : valB - valA;
          });
          return Promise.resolve({ data, error: null });
        }
      }),
      insert: (rows: any[]) => ({
        select: () => ({
          single: () => {
            const data = JSON.parse(localStorage.getItem(`entrevistia_db_${table}`) || '[]');
            const newRow = { 
              ...rows[0], 
              id: 'rec_' + Math.random().toString(36).substr(2, 9), 
              timestamp: new Date().toISOString() 
            };
            data.unshift(newRow);
            localStorage.setItem(`entrevistia_db_${table}`, JSON.stringify(data));
            return Promise.resolve({ data: newRow, error: null });
          }
        })
      })
    }),
    isInternal: true
  };
};

let client: any = null;
const isCloudConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== "undefined";

if (isCloudConfigured) {
  // Si hay credenciales válidas en el entorno, desactivamos automáticamente el modo local forzado
  localStorage.removeItem('entrevistia_force_local');
  try {
    client = createClient(supabaseUrl!, supabaseAnonKey!);
  } catch (e) {
    console.error("Error al inicializar Supabase, recurriendo a modo local:", e);
    client = createInternalClient();
  }
} else {
  client = createInternalClient();
}

export const supabase = client;

export const setLocalMode = (enabled: boolean) => {
  if (enabled) {
    localStorage.setItem('entrevistia_force_local', 'true');
    if (!localStorage.getItem('entrevistia_user_session')) {
      const guestUser = {
        id: 'guest_' + Math.random().toString(36).substr(2, 9),
        email: 'invitado@entrevistia.local',
        user_metadata: { full_name: 'Entrenador Invitado' }
      };
      localStorage.setItem('entrevistia_user_session', JSON.stringify(guestUser));
    }
  } else {
    localStorage.removeItem('entrevistia_force_local');
    localStorage.removeItem('entrevistia_user_session');
  }
  window.location.reload();
};
