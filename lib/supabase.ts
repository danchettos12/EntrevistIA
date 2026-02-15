
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url === "" || url === "undefined" || url === "null" || url.includes("YOUR_")) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const createInternalClient = () => {
  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        const checkAuth = () => {
          const savedUser = localStorage.getItem('entrevistia_user_session');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            callback('SIGNED_IN', { user, session: { user } });
          } else {
            // Usuario invitado por defecto para que la app funcione siempre
            const guest = { id: 'guest_local', email: 'invitado@entrevistia.pro', user_metadata: { full_name: 'Usuario Invitado' } };
            localStorage.setItem('entrevistia_user_session', JSON.stringify(guest));
            callback('SIGNED_IN', { user: guest, session: { user: guest } });
          }
        };
        checkAuth();
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async () => ({ data: null, error: { message: 'Inicia sesión en la nube para sincronizar.' } }),
      signUp: async () => ({ data: null, error: { message: 'Crea una cuenta en la nube para sincronizar.' } }),
      signOut: async () => {
        localStorage.removeItem('entrevistia_user_session');
        window.location.reload();
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

export const supabase = (isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== "undefined")
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createInternalClient();
