
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

  const isMock = supabase?.isMock;

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
        if (!isMock) setError('Verifique su correo para confirmar registro.');
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación.');
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

        <div className="glass p-10 rounded-[2rem] shadow-2xl border-white/10 overflow-hidden relative">
          {isMock && <div className="absolute top-0 left-0 w-full bg-amber-500/20 py-1 text-[8px] font-bold text-amber-400 text-center uppercase tracking-widest border-b border-amber-500/20">MODO DEMO LOCAL</div>}
          
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-white uppercase tracking-tight">{isLogin ? 'Acceso Seguro' : 'Crear Perfil'}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-blue-500" placeholder="Nombre" required />
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-blue-500" placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:border-blue-500" placeholder="Contraseña" required />
            
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all uppercase text-[10px] tracking-widest disabled:opacity-50">
              {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-[9px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest">
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
