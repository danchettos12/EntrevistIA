
import React from 'react';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center animate-fadeIn py-20">
      {/* Hero Section */}
      <section className="relative text-center space-y-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-blue-600/20 blur-[180px] -z-10 rounded-full animate-pulse opacity-50"></div>
        
        <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/20 text-blue-400 text-[11px] font-black uppercase tracking-[0.5em] mb-10 shadow-2xl">
              <i className="ph-bold ph-sparkle"></i> IA de Élite Certificada
            </div>
            
            <h1 className="text-[10vw] md:text-[8rem] font-black tracking-tighter leading-[0.8] text-white italic uppercase mb-8">
              DOMINA <br />
              <span className="text-gradient">LA SALA</span>
            </h1>
        </div>
        
        <p className="text-slate-300 text-xl md:text-3xl max-w-4xl mx-auto leading-tight font-medium opacity-90">
          La primera plataforma de coaching que analiza tu <span className="text-white font-bold underline decoration-blue-500">ADN profesional</span> mediante IA generativa de última generación.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12">
          <button 
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-16 py-8 font-black text-white bg-blue-600 rounded-[2rem] shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] hover:bg-blue-500 transition-all transform hover:scale-110 active:scale-95 text-2xl uppercase tracking-tighter italic overflow-hidden w-full sm:w-auto border-t border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            Entrenar Ahora
            <i className="ph-bold ph-arrow-right ml-4 text-3xl"></i>
          </button>
          
          <button 
            onClick={onLogin}
            className="px-12 py-8 rounded-[2rem] glass border-white/20 text-white font-black hover:bg-white/10 transition-all uppercase text-sm tracking-widest w-full sm:w-auto hover:scale-105"
          >
            Acceso Miembros
          </button>
        </div>
      </section>

      {/* Floating Indicators */}
      <div className="mt-32 flex justify-center gap-20 opacity-40">
         <div className="flex flex-col items-center gap-2">
            <span className="text-4xl font-black text-white italic">200%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Más Confianza</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <span className="text-4xl font-black text-white italic">Gemini 3</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Motor de Análisis</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <span className="text-4xl font-black text-white italic">STAR</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Metodología Elite</span>
         </div>
      </div>

      {/* Footer Branding con separador de gradiente */}
      <div className="mt-40 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <footer className="text-center py-20">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">© 2025 ELITE CAREER LABS • POWERED BY GOOGLE GENAI</p>
      </footer>
    </div>
  );
};

export default LandingView;
