
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
    name: `S${idx + 1}`,
    score: s.overallScore,
  }));

  const averageScore = sessions.length 
    ? (sessions.reduce((acc, s) => acc + s.overallScore, 0) / sessions.length).toFixed(0) 
    : 0;

  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 space-y-12 animate-fadeIn">
        <div className="glass p-16 rounded-[3rem] border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)]"></div>
          <div className="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <i className="ph-bold ph-lightning text-4xl text-blue-500"></i>
          </div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Módulo de Entrenamiento Offline</h1>
          <p className="text-slate-400 text-lg font-medium max-w-lg mx-auto mb-10">
            Aún no has registrado ninguna sesión. Inicia tu primera simulación para activar el análisis biométrico y STAR.
          </p>
          <button 
            onClick={onStart} 
            className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase text-xs tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/20"
          >
            Lanzar Protocolo Inicial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Info - Más técnico y limpio */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sistema Operativo v1.0 • Usuario: {user.name}</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Command Center</h1>
        </div>
        <button 
          onClick={onStart} 
          className="bg-white text-slate-950 hover:bg-slate-200 font-black py-4 px-10 rounded-xl shadow-xl flex items-center gap-3 uppercase text-[10px] tracking-widest transition-all"
        >
          <i className="ph-bold ph-plus-circle text-lg"></i> Nueva Simulación
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric Card - Look más técnico */}
        <div className="lg:col-span-4 glass p-8 rounded-2xl border-l-4 border-blue-600 flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Performance</span>
                <span className="text-[9px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">AVG_SCORE</span>
             </div>
             <div className="text-7xl font-black text-white mt-4 italic">
               {averageScore}<span className="text-2xl text-blue-500 opacity-50">%</span>
             </div>
           </div>
           
           <div className="mt-10 space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Progreso Objetivo</span>
                <span className="text-white">{averageScore}/100</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${averageScore}%` }}></div>
              </div>
           </div>
        </div>

        {/* Analytic Graph - Más integrado */}
        <div className="lg:col-span-8 glass p-8 rounded-2xl">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-black uppercase text-[10px] tracking-widest text-slate-400 flex items-center gap-2">
                <i className="ph-bold ph-chart-line text-blue-500"></i> Histórico de Sesiones
              </h3>
           </div>
           <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '11px' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area type="step" dataKey="score" stroke="#3b82f6" fill="url(#colorScore)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* History List - Cambio de Grid a Lista para que parezca más una base de datos */}
        <div className="lg:col-span-12 space-y-4">
           <div className="flex items-center gap-3 mb-2 px-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registros de Actividad</span>
              <div className="flex-1 h-px bg-white/5"></div>
           </div>
           
           <div className="space-y-3">
              {sessions.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => onViewSession(s)}
                  className="glass group p-5 rounded-xl border-white/5 hover:border-blue-500/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex flex-col items-center justify-center text-slate-500 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-colors">
                        <span className="text-[8px] font-black uppercase">{new Date(s.timestamp).toLocaleDateString('es-ES', { month: 'short' })}</span>
                        <span className="text-sm font-black">{new Date(s.timestamp).getDate()}</span>
                    </div>
                    <div>
                        <div className="text-xs font-black text-white uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{s.config.role}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{s.config.questionCount} Desafíos • {s.overallScore}% Éxito</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                     <div className="hidden md:block">
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Métricas STAR</div>
                        <div className="flex gap-1">
                           {[1,2,3,4].map(i => (
                             <div key={i} className={`w-3 h-1 rounded-full ${s.overallScore > 70 ? 'bg-emerald-500' : 'bg-blue-500/30'}`}></div>
                           ))}
                        </div>
                     </div>
                     <i className="ph-bold ph-caret-right text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"></i>
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
