
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
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      } else {
        if (!name || !email || !password) {
          throw new Error('Todos los campos son obligatorios.');
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
        
        if (!isMock) {
          setError('Registro exitoso. Verifique su correo electrónico.');
        }
      }
    } catch (err: any) {
      console.error("Auth Exception:", err);
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Error de Red: No se puede conectar con el servidor de autenticación. Verifique su conexión o intente limpiar las variables de entorno para usar el Modo Local.');
      } else {
        setError(err.message || 'Ocurrió un error inesperado durante la autenticación.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 animate-fadeIn px-4">
      <div className="w-full max-w-md relative">
        <button 
          onClick={onBack}
          className="absolute -top-16 left-0 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest group"
        >
          <i className="ph ph-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Volver al Inicio
        </button>

        <div className="glass p-8 md:p-10 rounded-[2rem] shadow-2xl border-white/10 relative overflow-hidden">
          {isMock && (
            <div className="absolute top-0 left-0 w-full bg-amber-500/20 py-1 text-[8px] font-bold text-amber-400 text-center uppercase tracking-[0.2em] border-b border-amber-500/20">
              Modo Invitado: Almacenamiento Local
            </div>
          )}
          
          <div className="text-center mb-8 pt-4">
            <div className="inline-flex w-14 h-14 bg-blue-600 rounded-2xl items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-900/40">
              <i className="ph ph-lock-key"></i>
            </div>
            <h1 className="text-xl font-bold text-white uppercase tracking-tight">
              {isLogin ? 'Acceso Seguro' : 'Crear Perfil'}
            </h1>
            <p className="text-slate-400 text-[9px] mt-2 font-bold uppercase tracking-[0.2em] leading-relaxed">
              {isLogin ? 'Inicie sesión en su panel de coaching' : 'Únase a la red de profesionales senior'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Nombre Completo</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Email Profesional</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className={`p-4 rounded-xl text-[10px] font-bold text-center border leading-relaxed ${error.includes('exitoso') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-xl transition-all uppercase text-[10px] tracking-[0.2em] disabled:opacity-50 mt-4"
            >
              {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-[9px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
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
