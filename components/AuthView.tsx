
import React, { useState } from 'react';
import { supabase, setLocalMode } from '../lib/supabase.ts';

interface AuthViewProps {
  onBack: () => void;
  initialMode?: 'login' | 'register';
}

const AuthView: React.FC<AuthViewProps> = ({ onBack, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIsNetworkError(false);

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        if (supabase.isInternal) window.location.reload();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (signUpError) throw signUpError;
        if (supabase.isInternal) window.location.reload();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Detección mejorada de errores de red o CORS por Supabase
      if (err.message?.includes('fetch') || err.name === 'TypeError' || !err.status) {
        setError('El servidor de autenticación no responde. Esto puede deberse a restricciones de red o firewall.');
        setIsNetworkError(true);
      } else {
        setError(err.message || 'Error en la solicitud.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 animate-fadeIn px-4">
      <div className="w-full max-w-md relative">
        <button onClick={onBack} className="absolute -top-16 left-0 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
          <i className="ph ph-arrow-left"></i> Volver al inicio
        </button>

        <div className="glass p-10 rounded-[2.5rem] shadow-2xl border-white/10 overflow-hidden relative">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">{isLogin ? 'Acceso Senior' : 'Crear Perfil'}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 font-medium">
              Sincronización en la Nube
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                placeholder="Tu nombre" 
                required 
              />
            )}
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" 
              placeholder="Email profesional" 
              required 
            />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" 
              placeholder="Contraseña" 
              required 
            />
            
            {error && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fadeIn space-y-4">
                <p className="text-[11px] text-red-400 text-center font-semibold leading-relaxed">
                  {error}
                </p>
                {isNetworkError && (
                  <button 
                    type="button"
                    onClick={() => setLocalMode(true)}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all border border-white/10 flex items-center justify-center gap-3"
                  >
                    <i className="ph-bold ph-wifi-slash text-base"></i>
                    Continuar en Modo Offline
                  </button>
                )}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em] disabled:opacity-50 shadow-xl shadow-blue-900/20 mt-4"
            >
              {loading ? 'Validando...' : isLogin ? 'Entrar' : 'Registrar'}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setIsNetworkError(false); }} 
              className="text-[9px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
            >
              {isLogin ? '¿Nuevo aquí? Regístrate' : '¿Ya eres miembro? Loguéate'}
            </button>
            <div className="h-px bg-white/5 w-1/3 mx-auto"></div>
            <button 
              onClick={() => setLocalMode(true)}
              className="text-[9px] font-bold text-blue-500/50 hover:text-blue-400 uppercase tracking-widest transition-colors"
            >
              Usar Modo Local (Sin Cuenta)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
