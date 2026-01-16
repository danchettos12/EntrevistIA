
import React from 'react';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center animate-fadeIn py-20 overflow-hidden">
      <section className="relative text-center space-y-12">
        {/* Glow de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-blue-600/10 blur-[180px] -z-10 rounded-full animate-pulse opacity-50"></div>
        
        <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.5em] mb-10 shadow-2xl">
              <i className="ph ph-shield-check"></i> Coaching de Carrera Certificado
            </div>
            
            <h1 className="text-[10vw] md:text-[6rem] font-bold tracking-tighter leading-[0.9] text-white mb-8">
              ALCANZA TU <br />
              <span className="text-gradient uppercase">MÁXIMO POTENCIAL</span>
            </h1>
        </div>
        
        <p className="text-slate-300 text-lg md:text-2xl max-w-4xl mx-auto leading-relaxed font-medium opacity-90 px-4">
          Optimiza tu narrativa profesional con la primera plataforma de simulación de entrevistas que utiliza <span className="text-white font-bold underline decoration-blue-500 underline-offset-8">inteligencia artificial avanzada</span> para analizar tu asertividad y estructura.
        </p>
        
        <div className="flex flex-col items-center gap-8 pt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-6">
            <button 
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center px-12 py-6 font-bold text-white bg-blue-600 rounded-2xl shadow-[0_0_60px_-15px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all transform hover:scale-105 active:scale-95 text-lg uppercase tracking-widest overflow-hidden w-full sm:w-auto border-t border-white/20"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                Crear Cuenta Gratuita
                <i className="ph ph-arrow-right ml-4"></i>
            </button>
            
            <button 
                onClick={onLogin}
                className="px-12 py-6 rounded-2xl glass border-white/20 text-white font-bold hover:bg-white/10 transition-all uppercase text-sm tracking-widest w-full sm:w-auto hover:scale-105"
            >
                Acceso Miembros
            </button>
          </div>
          
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">
            Sin tarjetas de crédito • Registro instantáneo
          </p>
        </div>
      </section>

      {/* Indicadores de valor */}
      <div className="mt-32 flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 px-6 text-center">
         <div className="flex flex-col items-center gap-2">
            <span className="text-2xl md:text-4xl font-bold text-white tracking-tighter">+85%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tasa de Éxito</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <span className="text-2xl md:text-4xl font-bold text-white tracking-tighter">Gemini 3</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Motor de Análisis</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <span className="text-2xl md:text-4xl font-bold text-white tracking-tighter">STAR</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Metodología Aplicada</span>
         </div>
      </div>

      <footer className="text-center py-20 mt-20 border-t border-white/5">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em]">© 2025 ENTREVISTIA • CONSULTORÍA DE CARRERA PROFESIONAL</p>
      </footer>
    </div>
  );
};

export default LandingView;
