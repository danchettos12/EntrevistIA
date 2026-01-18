
import React, { useState } from 'react';
import { SessionRecord, User } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  user: User;
  sessions: SessionRecord[];
  onStart: () => void;
  onViewSession: (session: SessionRecord) => void;
  onOpenDoc?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, sessions, onStart, onViewSession, onOpenDoc }) => {
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
    { title: 'Gestión de Expectativas', desc: 'Estrategias de negociación salarial basadas en datos de mercado.', icon: 'ph-handshake', color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-10">
      {/* Perfil del Usuario y Cabecera de Estado */}
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
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Desempeño Promedio</span>
              <div className="text-7xl font-light text-white">
                {averageScore}<span className="text-2xl text-slate-500">%</span>
              </div>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Indicador de Competencias</span>
                  <span className="text-white">{averageScore}/100</span>
               </div>
               <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${averageScore}%` }}></div>
               </div>
            </div>
            <button 
              onClick={onStart}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em]"
            >
              Iniciar Nueva Evaluación
            </button>
          </div>

          <div className="lg:col-span-8 glass p-8 rounded-3xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Evolución Profesional</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '11px' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area type="monotone" dataKey="puntuacion" stroke="#3b82f6" fill="url(#colorScore)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Registro de Evaluaciones Realizadas</h3>
          {sessions.length === 0 ? (
            <div className="glass p-20 rounded-3xl text-center border-dashed border-2 border-white/5">
              <p className="text-slate-500 font-medium">No se registran evaluaciones previas en el sistema.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => onViewSession(s)}
                  className="glass p-6 rounded-2xl border-white/5 hover:border-blue-500/20 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center text-slate-400">
                        <span className="text-[8px] font-bold uppercase">{new Date(s.timestamp).toLocaleDateString('es-ES', { month: 'short' })}</span>
                        <span className="text-sm font-bold">{new Date(s.timestamp).getDate()}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{s.config.role}</h4>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{s.overallScore}% Éxito • {s.config.questionCount} Preguntas</p>
                    </div>
                  </div>
                  <i className="ph ph-arrow-right text-slate-600 group-hover:text-white transition-all"></i>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'guias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          {guiasProfesionales.map((guia, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl border-white/5 hover:bg-white/5 transition-all">
               <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${guia.color}`}>
                  <i className={`ph-bold ${guia.icon} text-2xl`}></i>
               </div>
               <h4 className="text-lg font-bold text-white mb-3">{guia.title}</h4>
               <p className="text-xs text-slate-400 leading-relaxed mb-6">{guia.desc}</p>
               <button className="text-[9px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors flex items-center gap-2">
                 Ver Detalles <i className="ph ph-arrow-right"></i>
               </button>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER SUTIL PARA ACCESO AL MANUAL PRD */}
      <footer className="pt-20 text-center opacity-10 hover:opacity-100 transition-opacity">
        <button 
          onClick={onOpenDoc}
          className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.4em] hover:text-blue-500"
        >
          Acceso Administrador - Manual PRD de la Plataforma
        </button>
      </footer>
    </div>
  );
};

export default Dashboard;
