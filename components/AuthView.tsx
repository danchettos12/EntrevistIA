
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthViewProps {
  onBack: () => void;
  initialMode?: 'login' | 'register';
}

const AuthView: React.FC<AuthViewProps> = ({ onBack, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGuestAccess = async () => {
    setLoading(true);
    setError('');
    try {
      if (supabase?.auth?.signInAnonymously) {
        await supabase.auth.signInAnonymously();
      } else {
        throw new Error('El sistema de acceso rápido no está disponible.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al entrar como invitado.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      } else {
        if (!name || !email || !password) {
          throw new Error('Completa todos los campos para continuar.');
        }
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (signUpError) throw signUpError;
      }
    } catch (err: any) {
      console.error("Error Auth:", err);
      setError(err.message || 'Error de conexión con el servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 animate-fadeIn">
      <div className="w-full max-w-md relative">
        <button 
          onClick={onBack}
          className="absolute -top-16 left-0 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest group"
        >
          <i className="ph ph-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Volver al Inicio
        </button>

        <div className="glass p-10 rounded-[2rem] shadow-2xl border-white/10 relative overflow-hidden">
          {supabase?.isMock && (
            <div className="absolute top-0 left-0 w-full bg-blue-600/10 py-1 text-[8px] font-bold text-blue-400 text-center uppercase tracking-[0.2em] border-b border-blue-500/10">
              Modo de Entrenamiento Local
            </div>
          )}
          
          <div className="text-center mb-10 pt-4">
            <div className="inline-flex w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-blue-900/40">
              <i className={`ph ph-${isLogin ? 'user' : 'user-plus'}`}></i>
            </div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
              {isLogin ? 'Acceso Seguro' : 'Crear Perfil'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Nombre</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                  placeholder="Juan Pérez"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl text-[10px] font-bold text-center border bg-red-500/10 border-red-500/20 text-red-400">
                {error}
              </div>
            )}

            <div className="pt-2 space-y-3">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-xl shadow-xl transition-all uppercase text-[10px] tracking-[0.2em] disabled:opacity-50"
              >
                {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
              </button>
              
              <button 
                type="button"
                onClick={handleGuestAccess}
                disabled={loading}
                className="w-full border border-white/10 hover:bg-white/5 text-slate-300 font-bold py-4 rounded-xl transition-all uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2"
              >
                <i className="ph ph-lightning text-lg text-amber-400"></i>
                Entrar como Invitado (Rápido)
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya eres miembro? Inicia sesión'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
