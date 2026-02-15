
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

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass p-8 rounded-3xl border-l-4 border-blue-600 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xl font-light text-white overflow-hidden shadow-inner">
               {getInitials(user.name)}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{user.preferredRole || 'Perfil Profesional'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Gemini Engine Ready</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 glass p-2 rounded-3xl flex gap-2">
            <button onClick={() => setActiveTab('resumen')} className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'resumen' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>
              <i className="ph-bold ph-chart-line text-lg"></i> Resumen
            </button>
            <button onClick={() => setActiveTab('historial')} className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'historial' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>
              <i className="ph-bold ph-clock-counter-clockwise text-lg"></i> Historial
            </button>
            <button onClick={() => setActiveTab('guias')} className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'guias' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>
              <i className="ph-bold ph-book-open text-lg"></i> Guías
            </button>
        </div>
      </div>

      {activeTab === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          <div className="lg:col-span-4 glass p-8 rounded-3xl space-y-8">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Puntaje de Éxito</span>
              <div className="text-6xl font-light text-white">{averageScore}<span className="text-xl text-slate-500">%</span></div>
            </div>
            <button onClick={onStart} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3">
              <i className="ph-bold ph-lightning"></i> Entrenar con IA
            </button>
          </div>

          <div className="lg:col-span-8 glass p-8 rounded-3xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Análisis de Progreso Narrativo</h3>
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
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="puntuacion" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-white/5 rounded-2xl">
                  Sin datos. Comienza tu primera sesión.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-6">Fecha</th>
                <th className="px-8 py-6">Cargo Simulado</th>
                <th className="px-8 py-6 text-center">Score</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 text-sm text-white">{new Date(session.timestamp).toLocaleDateString()}</td>
                  <td className="px-8 py-6 text-sm text-slate-300">{session.config.role}</td>
                  <td className="px-8 py-6 text-center font-bold text-blue-400">{session.overallScore}%</td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => onViewSession(session)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><i className="ph ph-eye"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
