
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Mock del cliente para permitir el uso de la app sin configuración de servidor
const createMockClient = () => {
  console.warn("MODO DEMO ACTIVO: Utilizando almacenamiento local en lugar de Supabase.");
  
  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        const savedUser = localStorage.getItem('entrevistia_mock_user');
        // Importante: Simular el comportamiento de Supabase que dispara el evento inmediatamente
        if (savedUser) {
          setTimeout(() => callback('SIGNED_IN', { user: JSON.parse(savedUser) }), 50);
        } else {
          setTimeout(() => callback('SIGNED_OUT', null), 50);
        }
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async ({ email, password }: any) => {
        const users = JSON.parse(localStorage.getItem('entrevistia_mock_users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('entrevistia_mock_user', JSON.stringify(user));
          // En lugar de recargar, podrías dejar que el estado fluya, 
          // pero para el mock la recarga asegura coherencia.
          window.location.reload(); 
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
        window.location.reload();
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('entrevistia_mock_user');
        window.location.reload();
        return { error: null };
      }
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          order: () => {
            const data = JSON.parse(localStorage.getItem(`entrevistia_mock_${table}`) || '[]');
            return { data, error: null };
          }
        })
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
            return { data: newRow, error: null };
          }
        })
      })
    }),
    isMock: true
  };
};

let supabaseClient: any = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "" && supabaseAnonKey !== "") {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Error al crear el cliente de Supabase, activando Mock...", err);
    supabaseClient = createMockClient();
  }
} else {
  supabaseClient = createMockClient();
}

export const supabase = supabaseClient;
