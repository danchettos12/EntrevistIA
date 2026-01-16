
import React from 'react';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="space-y-32 py-12 overflow-hidden animate-fadeIn">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[150px] -z-10 rounded-full animate-pulse"></div>
        
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
          <i className="ph-bold ph-sparkle"></i> IA de Próxima Generación
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white italic uppercase">
          Domina tu <br />
          <span className="text-gradient">Futuro Profesional</span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
          Entrena con la plataforma de simulación de entrevistas más avanzada del mundo. 
          Análisis STAR, feedback biométrico-vocal y perfeccionamiento de narrativa.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <button 
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white bg-blue-600 rounded-2xl shadow-2xl shadow-blue-600/40 hover:bg-blue-500 transition-all transform hover:scale-105 active:scale-95 text-lg uppercase tracking-tighter italic overflow-hidden w-full sm:w-auto"
          >
            Comenzar Entrenamiento Gratis
            <i className="ph-bold ph-arrow-right ml-3 text-xl"></i>
          </button>
          
          <button 
            onClick={onLogin}
            className="px-10 py-5 rounded-2xl glass border-white/10 text-white font-black hover:bg-white/5 transition-all uppercase text-xs tracking-widest w-full sm:w-auto"
          >
            Acceso Miembros Elite
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {[
          { 
            icon: 'ph-brain', 
            title: 'Análisis Estructural STAR', 
            desc: 'Nuestra IA desglosa tus respuestas en Situación, Tarea, Acción y Resultado para garantizar impacto.' 
          },
          { 
            icon: 'ph-microphone-stage', 
            title: 'Detección de Vicios Vocales', 
            desc: 'Elimina muletillas y mejora tu asertividad con análisis de tono y ritmo en tiempo real.' 
          },
          { 
            icon: 'ph-magic-wand', 
            title: 'Mirror Mode (Modo Espejo)', 
            desc: 'Mira cómo la IA reescribe tus experiencias para que suenen como un líder senior.' 
          }
        ].map((feature, idx) => (
          <div key={idx} className="glass p-10 rounded-[3rem] border-white/5 hover:border-blue-500/20 transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <i className={`ph-bold ${feature.icon} text-3xl text-blue-500`}></i>
            </div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{feature.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Trust Section */}
      <section className="text-center py-20 glass rounded-[4rem] border-white/5 mx-4 max-w-5xl md:mx-auto">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-12">Diseñado para perfiles de alto impacto</h4>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
          <span className="text-2xl font-black italic tracking-tighter text-white">MAANG READY</span>
          <span className="text-2xl font-black italic tracking-tighter text-white">TECH ELITE</span>
          <span className="text-2xl font-black italic tracking-tighter text-white">SENIOR PATH</span>
          <span className="text-2xl font-black italic tracking-tighter text-white">LEADERSHIP</span>
        </div>
      </section>
      
      {/* Footer Branding */}
      <footer className="text-center pb-20">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            <i className="ph-bold ph-lightning"></i>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white uppercase italic">EntrevistIA</span>
        </div>
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">© 2025 Elite Career Coaching • Impulsado por Gemini 3</p>
      </footer>
    </div>
  );
};

export default LandingView;
