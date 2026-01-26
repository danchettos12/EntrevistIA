
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

// Motor de simulación para persistencia local cuando no hay base de datos configurada
const createMockClient = () => {
  console.warn("ENTREVISTIA: Modo Local Activo (Sin Conexión a Base de Datos Externa).");
  
  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        const savedUser = localStorage.getItem('entrevistia_user');
        if (savedUser) {
          setTimeout(() => callback('SIGNED_IN', { user: JSON.parse(savedUser) }), 50);
        } else {
          setTimeout(() => callback('SIGNED_OUT', null), 50);
        }
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async ({ email, password }: any) => {
        const users = JSON.parse(localStorage.getItem('entrevistia_mock_db_users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('entrevistia_user', JSON.stringify(user));
          window.location.reload(); 
          return { data: { user }, error: null };
        }
        return { data: null, error: { message: 'Usuario no encontrado en modo local. Prueba el acceso como invitado.' } };
      },
      signInAnonymously: async () => {
        const guestUser = {
          id: `guest-${Math.random().toString(36).substr(2, 5)}`,
          email: 'guest@entrevistia.local',
          user_metadata: { 
            full_name: 'Invitado EntrevistIA', 
            is_guest: true
          }
        };
        localStorage.setItem('entrevistia_user', JSON.stringify(guestUser));
        window.location.reload();
        return { data: { user: guestUser }, error: null };
      },
      signUp: async ({ email, password, options }: any) => {
        const users = JSON.parse(localStorage.getItem('entrevistia_mock_db_users') || '[]');
        const newUser = { 
          id: Math.random().toString(36).substr(2, 9), 
          email, 
          password, 
          user_metadata: options?.data || {} 
        };
        users.push(newUser);
        localStorage.setItem('entrevistia_mock_db_users', JSON.stringify(users));
        localStorage.setItem('entrevistia_user', JSON.stringify(newUser));
        window.location.reload();
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('entrevistia_user');
        window.location.reload();
        return { error: null };
      }
    },
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: any) => ({
          order: () => {
            const allData = JSON.parse(localStorage.getItem(`entrevistia_mock_db_${table}`) || '[]');
            const data = allData.filter((row: any) => row[col] === val || (col === 'user_id' && row.userId === val));
            return { data, error: null };
          }
        })
      }),
      insert: (rows: any[]) => ({
        select: () => ({
          single: () => {
            const data = JSON.parse(localStorage.getItem(`entrevistia_mock_db_${table}`) || '[]');
            const newRow = { ...rows[0], id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() };
            data.push(newRow);
            localStorage.setItem(`entrevistia_mock_db_${table}`, JSON.stringify(data));
            return { data: newRow, error: null };
          }
        })
      })
    }),
    isMock: true
  };
};

const isConfigured = supabaseUrl && 
                    supabaseAnonKey && 
                    !supabaseUrl.includes('your-project-url') &&
                    supabaseUrl.startsWith('https://');

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : createMockClient();
