
import React from 'react';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center animate-fadeIn py-20 overflow-hidden">
      <section className="relative text-center space-y-12 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>
        
        <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">
          Powered by Gemini 2.5 & 3
        </div>

        <h1 className="text-[12vw] md:text-[6rem] font-bold tracking-tighter leading-[0.9] text-white">
          POTENCIA TU <br />
          <span className="text-gradient uppercase">CARRERA ÉLITE</span>
        </h1>
        
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Entrenamiento de entrevistas de alto impacto. Analiza tu estructura <span className="text-blue-400 font-bold">STAR</span> y optimiza tu narrativa ejecutiva con IA.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
          <button 
            onClick={onGetStarted} 
            className="w-full sm:w-auto px-12 py-6 font-bold text-white bg-blue-600 rounded-2xl shadow-2xl shadow-blue-900/40 hover:bg-blue-500 hover:-translate-y-1 transition-all text-sm uppercase tracking-widest"
          >
            Empezar Gratis
          </button>
          <button 
            onClick={onLogin} 
            className="w-full sm:w-auto px-12 py-6 rounded-2xl glass text-white font-bold hover:bg-white/10 transition-all uppercase text-sm tracking-widest"
          >
            Acceso Miembros
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
