
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url === "" || url.includes("YOUR_") || url === "undefined") return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

const createMockClient = () => {
  console.warn("MODO DEMO ACTIVO: Utilizando almacenamiento local.");
  
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
        window.addEventListener('storage', (e) => {
          if (e.key === 'entrevistia_mock_user') checkAuth();
        });

        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async ({ email, password }: any) => {
        const users = JSON.parse(localStorage.getItem('entrevistia_mock_users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('entrevistia_mock_user', JSON.stringify(user));
          setTimeout(() => window.location.reload(), 100);
          return { data: { user }, error: null };
        }
        return { data: null, error: { message: 'Credenciales inválidas en modo local.' } };
      },
      signUp: async ({ email, password, options }: any) => {
        const users = JSON.parse(localStorage.getItem('entrevistia_mock_users') || '[]');
        if (users.find((u: any) => u.email === email)) {
          return { data: null, error: { message: 'El usuario ya existe localmente.' } };
        }
        const newUser = { 
          id: Math.random().toString(36).substr(2, 9), 
          email, 
          password,
          user_metadata: options?.data || {} 
        };
        users.push(newUser);
        localStorage.setItem('entrevistia_mock_users', JSON.stringify(users));
        localStorage.setItem('entrevistia_mock_user', JSON.stringify(newUser));
        setTimeout(() => window.location.reload(), 100);
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('entrevistia_mock_user');
        setTimeout(() => window.location.reload(), 100);
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
              id: Math.random().toString(36).substr(2, 9), 
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

if (isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== "" && supabaseAnonKey !== "undefined") {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey);
  } catch (err) {
    supabaseClient = createMockClient();
  }
} else {
  supabaseClient = createMockClient();
}

export const supabase = supabaseClient;
