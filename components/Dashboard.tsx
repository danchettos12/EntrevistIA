
import React, { useState } from 'react';
import { SessionRecord, User, DocumentationTopic } from '../types.ts';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  user: User;
  sessions: SessionRecord[];
  onStart: () => void;
  onViewSession: (session: SessionRecord) => void;
  onNavigateDoc: (topic: DocumentationTopic) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, sessions, onStart, onViewSession, onNavigateDoc }) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'historial' | 'recursos'>('resumen');

  const chartData = [...sessions].reverse().map((s, idx) => ({
    name: `S${idx + 1}`,
    puntuacion: s.overallScore,
  }));

  const averageScore = sessions.length 
    ? (sessions.reduce((acc, s) => acc + s.overallScore, 0) / sessions.length).toFixed(0) 
    : 0;

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const GUIDES: { title: string; icon: string; color: string; desc: string; topic: DocumentationTopic }[] = [
    {
      title: "Método STAR",
      icon: "ph-star-four",
      color: "text-blue-400",
      desc: "Aprende a estructurar tus logros: Situación, Tarea, Acción y Resultado. Una forma clara de contar tus éxitos.",
      topic: 'star'
    },
    {
      title: "Comunicación Clara",
      icon: "ph-chat-teardrop-text",
      color: "text-emerald-400",
      desc: "Mantén un tono profesional pero natural. La clave es la autenticidad y la claridad al expresarte.",
      topic: 'communication'
    },
    {
      title: "Preguntas de Impacto",
      icon: "ph-question",
      color: "text-purple-400",
      desc: "Prepara respuestas para las preguntas más difíciles y aprende a preguntar tú también.",
      topic: 'questions'
    },
    {
      title: "Pausas y Ritmo",
      icon: "ph-hourglass",
      color: "text-amber-400",
      desc: "No tengas prisa por responder. Una pequeña pausa ayuda a organizar tus ideas antes de hablar.",
      topic: 'rhythm'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass p-8 rounded-3xl border-l-4 border-blue-600 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-lg font-medium text-white shadow-inner">
               {getInitials(user.name)}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">Hola, {user.name.split(' ')[0]}</h2>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{user.preferredRole || 'Explorando oportunidades'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 glass p-2 rounded-3xl flex gap-2 shadow-xl">
            <button onClick={() => setActiveTab('resumen')} className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'resumen' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <i className="ph-bold ph-chart-line"></i> Resumen
            </button>
            <button onClick={() => setActiveTab('historial')} className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'historial' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <i className="ph-bold ph-clock-counter-clockwise"></i> Actividad
            </button>
            <button onClick={() => setActiveTab('recursos')} className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'recursos' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <i className="ph-bold ph-notebook"></i> Guías
            </button>
        </div>
      </div>

      {activeTab === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          <div className="lg:col-span-4 glass p-8 rounded-3xl space-y-8 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Progreso General</span>
              <div className="text-6xl font-light text-white">{averageScore}<span className="text-xl text-slate-500">%</span></div>
              <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">Puntaje basado en tus últimas prácticas y feedback de la IA.</p>
            </div>
            <button onClick={onStart} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-3 group">
              <i className="ph-bold ph-plus group-hover:rotate-90 transition-transform"></i> Nueva Práctica
            </button>
          </div>

          <div className="lg:col-span-8 glass p-8 rounded-3xl shadow-xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Evolución de tus Respuestas</h3>
            <div className="h-64 w-full">
              {sessions.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Area type="monotone" dataKey="puntuacion" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-3xl space-y-4">
                  <i className="ph ph-chart-line text-4xl opacity-20"></i>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Tus resultados aparecerán aquí cuando practiques</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="glass rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl animate-fadeIn">
          {sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-10 py-6">Fecha</th>
                    <th className="px-10 py-6">Puesto Practicado</th>
                    <th className="px-10 py-6 text-center">Desempeño</th>
                    <th className="px-10 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-10 py-6 text-sm text-white font-medium">
                        {new Date(session.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-10 py-6 text-sm text-slate-400">{session.config.role}</td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-bold ${session.overallScore > 70 ? 'text-emerald-400 bg-emerald-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                          {session.overallScore}%
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => onViewSession(session)} 
                          className="px-6 py-2 bg-white/5 hover:bg-white text-slate-400 hover:text-slate-900 rounded-lg font-bold uppercase text-[9px] tracking-widest transition-all"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center space-y-6">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                  <i className="ph ph-folder-open text-3xl"></i>
               </div>
               <div className="text-center">
                  <h4 className="text-white font-bold">Sin sesiones guardadas</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Tus prácticas se guardarán aquí automáticamente.</p>
               </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recursos' && (
        <div className="animate-fadeIn space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {GUIDES.map((guide, idx) => (
               <button 
                 key={idx} 
                 onClick={() => onNavigateDoc(guide.topic)}
                 className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group shadow-xl text-left"
               >
                 <div className="flex items-start gap-6">
                   <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                     <i className={`ph-bold ${guide.icon} text-xl ${guide.color}`}></i>
                   </div>
                   <div className="space-y-2 flex-1">
                     <h4 className="text-white font-bold text-lg flex items-center justify-between">
                       {guide.title}
                       <i className="ph ph-arrow-up-right text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
                     </h4>
                     <p className="text-slate-400 text-sm leading-relaxed">{guide.desc}</p>
                   </div>
                 </div>
               </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
