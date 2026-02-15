
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
  const listeners: any[] = [];
  
  const notify = (event: string, session: any) => {
    listeners.forEach(cb => cb(event, session));
  };

  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        listeners.push(callback);
        const savedUser = localStorage.getItem('entrevistia_user_session');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          callback('INITIAL_SESSION', { user, session: { user } });
        } else {
          callback('INITIAL_SESSION', { user: null, session: null });
        }
        return { data: { subscription: { unsubscribe: () => {
          const idx = listeners.indexOf(callback);
          if (idx > -1) listeners.splice(idx, 1);
        } } } };
      },
      signInWithPassword: async ({ email }: { email: string }) => {
        const user = { 
          id: 'user_local_' + Math.random().toString(36).substr(2, 9), 
          email, 
          user_metadata: { full_name: email.split('@')[0] } 
        };
        localStorage.setItem('entrevistia_user_session', JSON.stringify(user));
        notify('SIGNED_IN', { user, session: { user } });
        return { data: { user }, error: null };
      },
      signUp: async ({ email, options }: { email: string, options?: any }) => {
        const user = { 
          id: 'user_local_' + Math.random().toString(36).substr(2, 9), 
          email, 
          user_metadata: { full_name: options?.data?.full_name || email.split('@')[0] } 
        };
        localStorage.setItem('entrevistia_user_session', JSON.stringify(user));
        notify('SIGNED_UP', { user, session: { user } });
        return { data: { user }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('entrevistia_user_session');
        notify('SIGNED_OUT', null);
        return { error: null };
      }
    },
    from: (table: string) => ({
      select: (_columns?: string) => ({
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
