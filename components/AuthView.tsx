
import React, { useState } from 'react';
import { supabase } from '../lib/supabase.ts';

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
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (signUpError) throw signUpError;
      }
      // El cambio de estado se maneja en el listener de App.tsx
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 animate-fadeIn px-4">
      <div className="w-full max-w-md relative">
        <button onClick={onBack} className="absolute -top-16 left-0 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
          <i className="ph ph-arrow-left"></i> Volver
        </button>

        <div className="glass p-10 rounded-[2.5rem] shadow-2xl border-white/10 relative">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">{isLogin ? 'Acceso Senior' : 'Crear Perfil'}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">Sincroniza tus sesiones en la nube</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                placeholder="Nombre completo" 
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
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-[10px] text-red-400 text-center font-bold uppercase tracking-widest">
                  {error}
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-900/20"
            >
              {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-[9px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Accede'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
