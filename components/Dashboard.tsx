
import React, { useState } from 'react';
import { SessionRecord, User } from '../types.ts';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  user: User;
  sessions: SessionRecord[];
  onStart: () => void;
  onViewSession: (session: SessionRecord) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, sessions, onStart, onViewSession }) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'historial' | 'guias'>('resumen');

  const chartData = [...sessions].reverse().map((s, idx) => ({
    name: `E${idx + 1}`,
    puntuacion: s.overallScore,
  }));

  const averageScore = sessions.length 
    ? (sessions.reduce((acc, s) => acc + s.overallScore, 0) / sessions.length).toFixed(0) 
    : 0;

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const guiasProfesionales = [
    { title: 'Estructura STAR', desc: 'Metodología para responder preguntas conductuales: Situación, Tarea, Acción y Resultado.', icon: 'ph-briefcase', color: 'text-blue-400' },
    { title: 'Comunicación Ejecutiva', desc: 'Técnicas de modulación de voz y lenguaje corporal para cargos directivos.', icon: 'ph-presentation-chart', color: 'text-slate-400' },
    { title: 'Propuesta de Valor', desc: 'Cómo articular tus logros cuantitativos y tu impacto en organizaciones previas.', icon: 'ph-target', color: 'text-emerald-400' },
    { title: 'Técnicas de Negociación', desc: 'Cómo manejar la discusión de compensación y beneficios en etapas finales.', icon: 'ph-handshake', color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass p-8 rounded-3xl border-l-4 border-blue-600 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-2xl font-light text-white tracking-widest overflow-hidden shadow-inner">
             {getInitials(user.name)}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{user.preferredRole || 'Candidato Senior'}</p>
            <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
          </div>
        </div>

        <div className="lg:col-span-7 glass p-2 rounded-3xl flex gap-2">
            <button 
              onClick={() => setActiveTab('resumen')}
              className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'resumen' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <i className="ph-bold ph-chart-line text-lg"></i> Resumen
            </button>
            <button 
              onClick={() => setActiveTab('historial')}
              className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'historial' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <i className="ph-bold ph-clock-counter-clockwise text-lg"></i> Historial
            </button>
            <button 
              onClick={() => setActiveTab('guias')}
              className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'guias' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <i className="ph-bold ph-book-open text-lg"></i> Guías
            </button>
        </div>
      </div>

      {activeTab === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          <div className="lg:col-span-4 glass p-8 rounded-3xl space-y-8">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Puntaje Promedio</span>
              <div className="text-6xl font-light text-white">{averageScore}<span className="text-xl text-slate-500">%</span></div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Sesiones Completadas</span>
                <span className="text-white">{sessions.length}</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${Math.min(sessions.length * 10, 100)}%` }}></div>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-900/20 transition-all"
            >
              Nueva Sesión de Entrenamiento
            </button>
          </div>

          <div className="lg:col-span-8 glass p-8 rounded-3xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Evolución de Competencias</h3>
            <div className="h-64 w-full">
              {sessions.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                      itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="puntuacion" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-white/5 rounded-2xl">
                  Inicie su primera sesión para ver datos
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="glass rounded-3xl overflow-hidden animate-fadeIn border border-white/5 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-8 py-6">Fecha y Hora</th>
                  <th className="px-8 py-6">Cargo</th>
                  <th className="px-8 py-6 text-center">Rigor</th>
                  <th className="px-8 py-6 text-center">Score</th>
                  <th className="px-8 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-white">{new Date(session.timestamp).toLocaleDateString('es-ES')}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(session.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-300 font-medium">{session.config.role}</td>
                    <td className="px-8 py-6 text-center">
                       <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-400">{session.config.pressure}%</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className={`text-sm font-bold ${session.overallScore >= 80 ? 'text-emerald-400' : 'text-blue-400'}`}>
                         {session.overallScore}%
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => onViewSession(session)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all border border-white/5"
                      >
                        <i className="ph ph-magnifying-glass-plus"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">No hay registros de entrenamiento aún</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'guias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {guiasProfesionales.map((guia, i) => (
            <div key={i} className="glass p-8 rounded-[2rem] border border-white/5 group hover:border-blue-500/30 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:bg-blue-600 transition-colors shadow-lg">
                <i className={`ph ${guia.icon}`}></i>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{guia.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-wide opacity-70">{guia.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
