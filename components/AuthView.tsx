
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
          Volver al Inicio
        </button>

        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 blur-[100px] -z-10 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/20 blur-[100px] -z-10 rounded-full"></div>

        <div className="glass p-10 rounded-[2.5rem] shadow-2xl border-white/10 relative overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/30 mb-6">
              <i className="ph-bold ph-lightning"></i>
            </div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">EntrevistIA</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              {isLogin ? 'Bienvenido de nuevo a la élite' : 'Crea tu perfil de alto rendimiento'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Nombre Completo</label>
                <input 
                  type="text" 
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all"
                placeholder="email@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Contraseña</label>
              <input 
                type="password" 
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className={`p-4 rounded-2xl text-[11px] font-bold text-center border ${error.includes('Cuenta creada') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase text-xs tracking-[0.2em] mt-4 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : isLogin ? 'Entrar al Dashboard' : 'Crear Mi Cuenta'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya eres miembro? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
