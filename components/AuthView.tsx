
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthViewProps {
  onBack: () => void;
  onGuest: () => void;
  initialMode?: 'login' | 'register';
}

const AuthView: React.FC<AuthViewProps> = ({ onBack, onGuest, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSupabaseConfigured = !!(supabase && supabase.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isSupabaseConfigured) {
        setError('Supabase no está configurado. Por favor, usa el Modo Invitado para probar la app.');
        return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        if (!name || !email || !password) {
          throw new Error('Todos los campos son obligatorios.');
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        setError('¡Cuenta creada! Revisa tu email para confirmar o intenta iniciar sesión.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 animate-fadeIn">
      <div className="w-full max-w-md relative">
        <button 
          onClick={onBack}
          className="absolute -top-16 left-0 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest group"
        >
          <i className="ph-bold ph-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Volver
        </button>

        <div className="glass p-10 rounded-[2.5rem] shadow-2xl border-white/10 relative overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center text-white text-3xl font-bold mb-6">
              <i className="ph-bold ph-lightning"></i>
            </div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Acceso Elite</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              {!isSupabaseConfigured ? 'Modo Demo Activado' : isLogin ? 'Bienvenido de nuevo' : 'Crea tu perfil'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500" placeholder="Juan Pérez" disabled={!isSupabaseConfigured}/>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500" placeholder="email@ejemplo.com" disabled={!isSupabaseConfigured}/>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500" placeholder="••••••••" disabled={!isSupabaseConfigured}/>
            </div>

            {error && (
              <div className={`p-4 rounded-2xl text-[11px] font-bold text-center border ${error.includes('Cuenta creada') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {error}
              </div>
            )}

            {isSupabaseConfigured ? (
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest">
                {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
              </button>
            ) : (
              <button type="button" onClick={onGuest} className="w-full bg-white text-slate-900 font-black py-5 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest hover:bg-slate-200">
                Entrar como Invitado (Modo Demo)
              </button>
            )}
          </form>

          {isSupabaseConfigured && (
            <div className="mt-8 text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-slate-500 hover:text-blue-400">
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entra'}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;
