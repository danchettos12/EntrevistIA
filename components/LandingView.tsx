
import React from 'react';
import Logo from './Logo.tsx';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSkip: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onLogin, onSkip }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center animate-fadeIn py-20 overflow-hidden">
      <section className="relative text-center space-y-12 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-600/5 blur-[150px] -z-10 rounded-full"></div>
        
        <div className="flex flex-col items-center gap-6 mb-8">
          <Logo className="h-16 md:h-20" />
          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">
            Impulsado por IA • Preparación Personalizada
          </div>
        </div>

        <h1 className="text-[12vw] md:text-[5.5rem] font-bold tracking-tighter leading-[0.95] text-white">
          DOMINA TU PRÓXIMA <br />
          <span className="text-gradient uppercase">ENTREVISTA</span>
        </h1>
        
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Practica en un entorno seguro, recibe feedback constructivo y mejora tu comunicación para conseguir el empleo que buscas.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
          <button 
            onClick={onSkip} 
            className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 hover:-translate-y-1 transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40"
          >
            <i className="ph-bold ph-play"></i>
            Comenzar Práctica
          </button>
          <button 
            onClick={onGetStarted} 
            className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all uppercase text-sm tracking-widest"
          >
            Registrarse
          </button>
        </div>
        
        <div className="pt-8">
            <button 
              onClick={onLogin} 
              className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
            >
              ¿Ya tienes cuenta? Entrar
            </button>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
