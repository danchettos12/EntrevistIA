
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
        // If it's mock, we might need a manual reload to trigger the app's auth listener properly
        if (isMock) window.location.reload();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (signUpError) throw signUpError;
        if (isMock) {
          window.location.reload();
        } else {
          setError('Registro exitoso. Verifique su correo para confirmar su cuenta.');
        }
      }
    } catch (err: any) {
      console.error("Auth Error Trace:", err);
      let msg = 'Error de conexión con el servidor.';
      if (err.message) msg = err.message;
      if (err.status === 400) msg = 'Credenciales inválidas o formato incorrecto.';
      if (err.name === 'AuthRetryableFetchError' || err.message?.includes('fetch')) {
        msg = 'Error de Red: No se puede conectar con el servidor de autenticación. Verifique su conexión o use el Modo Local.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableLocalMode = () => {
    localStorage.setItem('entrevistia_force_local', 'true');
    window.location.reload();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 animate-fadeIn px-4">
      <div className="w-full max-w-md relative">
        <button onClick={onBack} className="absolute -top-16 left-0 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
          <i className="ph ph-arrow-left"></i> Volver al inicio
        </button>

        <div className="glass p-10 rounded-[2.5rem] shadow-2xl border-white/10 overflow-hidden relative">
          {isMock && (
            <div className="absolute top-0 left-0 w-full bg-amber-500/20 py-1.5 text-[8px] font-bold text-amber-400 text-center uppercase tracking-[0.2em] border-b border-amber-500/20">
              MODO LOCAL ACTIVO (ALMACENAMIENTO OFFLINE)
            </div>
          )}
          
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">{isLogin ? 'Bienvenido' : 'Crear Perfil'}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 font-medium">
              {isMock ? 'Tus datos se guardarán solo en este navegador' : 'Accede a tu cuenta sincronizada'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm" 
                  placeholder="Tu nombre completo" 
                  required 
                />
              </div>
            )}
            <div className="space-y-1">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm" 
                placeholder="Correo electrónico" 
                required 
              />
            </div>
            <div className="space-y-1">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm" 
                placeholder="Contraseña" 
                required 
              />
            </div>
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-4 animate-fadeIn">
                <p className="text-[11px] text-red-400 text-center font-semibold leading-relaxed">
                  <i className="ph-bold ph-warning-circle mr-1"></i> {error}
                </p>
                {!isMock && (
                  <button 
                    type="button"
                    onClick={handleEnableLocalMode}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-bold text-white uppercase tracking-widest transition-all"
                  >
                    Usar Modo Local (Guardar en Navegador)
                  </button>
                )}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em] disabled:opacity-50 shadow-xl shadow-blue-900/20 mt-4"
            >
              {loading ? 'Validando...' : isLogin ? 'Entrar al Panel' : 'Registrar Perfil'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-[9px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Crea una aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
