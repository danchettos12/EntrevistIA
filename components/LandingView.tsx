
import React from 'react';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center animate-fadeIn py-20 overflow-hidden">
      <section className="relative text-center space-y-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>
        
        <h1 className="text-[10vw] md:text-[6rem] font-bold tracking-tighter leading-[0.9] text-white">
          POTENCIA TU <br />
          <span className="text-gradient uppercase">CARRERA ÉLITE</span>
        </h1>
        
        <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
          Simulación de entrevistas con IA avanzada para profesionales. Analiza tu estructura STAR y optimiza tu narrativa ejecutiva en tiempo real.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
          <button onClick={onGetStarted} className="px-12 py-6 font-bold text-white bg-blue-600 rounded-2xl shadow-xl hover:bg-blue-500 transition-all text-sm uppercase tracking-widest">
            Empezar Gratis
          </button>
          <button onClick={onLogin} className="px-12 py-6 rounded-2xl glass text-white font-bold hover:bg-white/10 transition-all uppercase text-sm tracking-widest">
            Acceso Miembros
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
