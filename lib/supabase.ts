
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

const createMockClient = () => {
  console.warn("ENTREVISTIA: Activando Modo Local (Almacenamiento en Navegador).");
  
  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        const checkAuth = () => {
          const savedUser = localStorage.getItem('entrevistia_mock_user');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            callback('SIGNED_IN', { user, session: { user } });
          } else {
            callback('SIGNED_OUT', null);
          }
        };
        
        checkAuth();
        const listener = (e: StorageEvent) => {
          if (e.key === 'entrevistia_mock_user') checkAuth();
        };
        window.addEventListener('storage', listener);

        return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', listener) } } };
      },
      signInWithPassword: async ({ email, password }: any) => {
        const users = JSON.parse(localStorage.getItem('entrevistia_mock_users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('entrevistia_mock_user', JSON.stringify(user));
          // Emit custom event for local tab sync
          window.dispatchEvent(new Event('storage'));
          return { data: { user }, error: null };
        }
        return { data: null, error: { message: 'Credenciales inválidas en modo local.' } };
      },
      signUp: async ({ email, password, options }: any) => {
        const users = JSON.parse(localStorage.getItem('entrevistia_mock_users') || '[]');
        if (users.find((u: any) => u.email === email)) {
          return { data: null, error: { message: 'El correo ya está registrado localmente.' } };
        }
        const newUser = { 
          id: 'local_' + Math.random().toString(36).substr(2, 9), 
          email, 
          password,
          user_metadata: options?.data || {} 
        };
        users.push(newUser);
        localStorage.setItem('entrevistia_mock_users', JSON.stringify(users));
        localStorage.setItem('entrevistia_mock_user', JSON.stringify(newUser));
        window.dispatchEvent(new Event('storage'));
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('entrevistia_mock_user');
        window.dispatchEvent(new Event('storage'));
        return { error: null };
      }
    },
    from: (table: string) => ({
      select: (_columns: string = '*') => ({
        eq: (col: string, val: any) => ({
          order: (_colOrder: string, _options: any) => {
            let data = JSON.parse(localStorage.getItem(`entrevistia_mock_${table}`) || '[]');
            if (col && val) {
              data = data.filter((item: any) => item[col] === val);
            }
            return Promise.resolve({ data, error: null });
          }
        }),
        order: (_colOrder: string, _options: any) => {
            const data = JSON.parse(localStorage.getItem(`entrevistia_mock_${table}`) || '[]');
            return Promise.resolve({ data, error: null });
        }
      }),
      insert: (rows: any[]) => ({
        select: () => ({
          single: () => {
            const data = JSON.parse(localStorage.getItem(`entrevistia_mock_${table}`) || '[]');
            const newRow = { 
              ...rows[0], 
              id: 'rec_' + Math.random().toString(36).substr(2, 9), 
              timestamp: new Date().toISOString() 
            };
            data.push(newRow);
            localStorage.setItem(`entrevistia_mock_${table}`, JSON.stringify(data));
            return Promise.resolve({ data: newRow, error: null });
          }
        })
      })
    }),
    isMock: true
  };
};

let supabaseClient: any = null;
const forceLocal = localStorage.getItem('entrevistia_force_local') === 'true';

if (!forceLocal && isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== "" && supabaseAnonKey !== "undefined") {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey);
  } catch (err) {
    console.error("Fallo al inicializar cliente Supabase, cayendo a Modo Local:", err);
    supabaseClient = createMockClient();
  }
} else {
  supabaseClient = createMockClient();
}

export const supabase = supabaseClient;
