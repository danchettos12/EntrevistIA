
import React from 'react';
import { SessionRecord, User } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  user: User;
  sessions: SessionRecord[];
  onStart: () => void;
  onViewSession: (session: SessionRecord) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, sessions, onStart, onViewSession }) => {
  const chartData = [...sessions].reverse().map((s, idx) => ({
    name: `Sesión ${idx + 1}`,
    score: s.overallScore,
  }));

  const averageScore = sessions.length 
    ? (sessions.reduce((acc, s) => acc + s.overallScore, 0) / sessions.length).toFixed(0) 
    : 0;

  if (sessions.length === 0) {
    return (
      <div className="space-y-24 py-12 overflow-hidden text-center animate-fadeIn">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] -z-10 rounded-full"></div>
        
        <div className="space-y-8 relative">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] animate-bounce">
            <i className="ph-bold ph-sparkle"></i> Sesión Lista para {user.name.split(' ')[0]}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white italic uppercase">
            Transforma tu <br /> 
            <span className="text-gradient">Carrera con IA</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Entrena con el coach de entrevistas más avanzado. Análisis estructural STAR, detección de muletillas y Modo Espejo para respuestas de élite.
          </p>
          <div className="pt-6">
            <button 
              onClick={onStart} 
              className="group relative inline-flex items-center justify-center px-12 py-6 font-black text-white bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-600/40 hover:bg-blue-500 transition-all transform hover:scale-105 active:scale-95 text-xl uppercase tracking-tighter italic overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              Iniciar Primera Simulación
              <i className="ph-bold ph-arrow-right ml-3 text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {[
             { i: 'ph-magic-wand', t: 'Modo Espejo', d: 'La IA reescribe tus propias historias para hacerlas sonar expertas.' },
             { i: 'ph-waveform', t: 'Detección de Vicios', d: 'Elimina muletillas y vacilaciones que restan autoridad a tu voz.' },
             { i: 'ph-target', t: 'Análisis STAR', d: 'Métricas precisas sobre cómo estructuras tus situaciones y resultados.' }
           ].map(item => (
             <div key={item.t} className="glass p-10 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all text-left group">
                <i className={`ph-bold ${item.i} text-4xl text-blue-500 mb-6 group-hover:scale-110 transition-transform`}></i>
                <h3 className="text-white font-black uppercase italic tracking-tighter mb-3">{item.t}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.d}</p>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Panel de Comando de {user.name}</h2>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Tu Progreso Maestro</h1>
        </div>
        <button 
          onClick={onStart} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center gap-3 uppercase text-xs tracking-widest transition-all transform hover:-translate-y-1"
        >
          <i className="ph-bold ph-plus-circle text-lg"></i> Nueva Sesión de Entrenamiento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Metric Card */}
        <div className="lg:col-span-4 glass p-10 rounded-[3rem] flex flex-col justify-between border-t-4 border-blue-600 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5">
             <i className="ph ph-medal text-9xl"></i>
           </div>
           <div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Score Promedio</span>
             <div className="text-8xl font-black text-white mt-4 flex items-baseline gap-2 italic">
               {averageScore}<span className="text-3xl text-blue-500">%</span>
             </div>
             <p className="text-slate-500 text-sm mt-6 font-medium leading-relaxed">
               Tu desempeño global ha subido un <span className="text-emerald-400 font-bold">12%</span> respecto a la semana pasada. ¡Sigue así!
             </p>
           </div>
           <div className="mt-12 pt-8 border-t border-white/5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                <span className="text-slate-400">Objetivo Senior</span>
                <span className="text-blue-400">95% de Maestría</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full p-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${averageScore}%` }}></div>
              </div>
           </div>
        </div>

        {/* Analytic Graph */}
        <div className="lg:col-span-8 glass p-10 rounded-[3rem] min-h-[400px]">
           <div className="flex items-center justify-between mb-10">
              <h3 className="font-black italic uppercase text-xs tracking-widest flex items-center gap-3">
                <i className="ph-bold ph-trend-up text-blue-400 text-lg"></i> Curva de Aprendizaje
              </h3>
              <div className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Últimas {sessions.length} simulaciones
              </div>
           </div>
           <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tick={{dy: 10}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '12px' }}
                    labelStyle={{ marginBottom: '8px', opacity: 0.5, fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="score" name="Nivel de Maestría" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* History Stream */}
        <div className="lg:col-span-12 space-y-6">
           <div className="flex items-center gap-4 px-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Archivo de Sesiones</h3>
              <div className="flex-1 h-px bg-white/5"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => onViewSession(s)}
                  className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-blue-500/40 transition-all group cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{new Date(s.timestamp).toLocaleDateString()}</span>
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter">{s.config.role}</span>
                    </div>
                    <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-lg border border-blue-500/20">
                      {s.overallScore}%
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <i className="ph ph-list-numbers text-blue-500"></i> {s.config.questionCount} Desafíos
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <i className="ph ph-timer text-amber-500"></i> {Math.floor(s.config.timeLimit/60)}m p/preg
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Abrir Informe Maestro</span>
                    <i className="ph-bold ph-arrow-right text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"></i>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
