
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
    
    if (!supabase || !supabase.auth) {
        setError('Error: El servicio de autenticación no está disponible. Verifique la configuración del servidor.');
        return;
    }

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
          throw new Error('Todos los campos son obligatorios para el registro profesional.');
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
        setError('Cuenta registrada correctamente. Por favor, verifique su bandeja de entrada para activar su acceso profesional.');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || 'No se pudo completar la solicitud de autenticación.');
    } finally {
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
          Regresar al Inicio
        </button>

        <div className="glass p-10 rounded-[2rem] shadow-2xl border-white/10 relative overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-blue-900/40">
              <i className="ph ph-user-focus"></i>
            </div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
              {isLogin ? 'Acceso Corporativo' : 'Registro de Consultor'}
            </h1>
            <p className="text-slate-400 text-xs mt-2 font-medium uppercase tracking-widest leading-relaxed">
              {isLogin ? 'Inicie sesión en su plataforma de coaching' : 'Cree su perfil profesional para comenzar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Nombre y Apellidos</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                  placeholder="Ej: Alejandro Magno"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Correo Electrónico Profesional</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all text-sm" 
                placeholder="usuario@dominio.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Contraseña Segura</label>
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
              <div className={`p-4 rounded-xl text-[10px] font-bold text-center border leading-relaxed ${error.includes('activar su acceso') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-xl shadow-xl transition-all uppercase text-[10px] tracking-[0.2em] disabled:opacity-50"
            >
              {loading ? 'Validando Credenciales...' : isLogin ? 'Ingresar a EntrevistIA' : 'Finalizar Registro'}
            </button>
          </form>

          <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                {isLogin ? '¿No tiene una cuenta? Regístrese aquí' : '¿Ya es miembro? Inicie sesión'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
