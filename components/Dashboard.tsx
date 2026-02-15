
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

  const GUIDES = [
    {
      title: "Método STAR",
      icon: "ph-star-four",
      color: "text-blue-400",
      desc: "Estructura tus respuestas: Situación, Tarea, Acción y Resultado. Es el estándar de oro en empresas Fortune 500."
    },
    {
      title: "Lenguaje Corporal",
      icon: "ph-user-focus",
      color: "text-emerald-400",
      desc: "Mantén contacto visual con la cámara, usa gestos moderados para enfatizar y proyecta una postura de 'Poder Abierto'."
    },
    {
      title: "Cierre Maestro",
      icon: "ph-handshake",
      color: "text-purple-400",
      desc: "Termina siempre con una pregunta de impacto: '¿Qué define el éxito para este rol en los primeros 90 días?'"
    },
    {
      title: "Manejo de Silencios",
      icon: "ph-chat-circle-dots",
      color: "text-amber-400",
      desc: "Un silencio de 3 segundos antes de responder proyecta reflexión y autoridad. No tengas miedo a la pausa cognitiva."
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass p-8 rounded-3xl border-l-4 border-blue-600 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xl font-light text-white overflow-hidden shadow-inner">
               {getInitials(user.name)}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{user.preferredRole || 'Perfil Profesional Elite'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">IA Active</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 glass p-2 rounded-3xl flex gap-2 shadow-xl">
            <button onClick={() => setActiveTab('resumen')} className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'resumen' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <i className="ph-bold ph-chart-line text-lg"></i> Resumen
            </button>
            <button onClick={() => setActiveTab('historial')} className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'historial' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <i className="ph-bold ph-clock-counter-clockwise text-lg"></i> Historial
            </button>
            <button onClick={() => setActiveTab('guias')} className={`flex-1 rounded-2xl flex items-center justify-center gap-3 font-semibold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'guias' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <i className="ph-bold ph-book-open text-lg"></i> Guías
            </button>
        </div>
      </div>

      {activeTab === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          <div className="lg:col-span-4 glass p-8 rounded-3xl space-y-8 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Desempeño Promedio</span>
              <div className="text-6xl font-light text-white">{averageScore}<span className="text-xl text-slate-500">%</span></div>
              <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">Puntaje basado en análisis semántico y estructura de respuestas.</p>
            </div>
            <button onClick={onStart} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-3 group">
              <i className="ph-bold ph-lightning group-hover:scale-125 transition-transform"></i> Nueva Sesión
            </button>
          </div>

          <div className="lg:col-span-8 glass p-8 rounded-3xl shadow-xl">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Evolución de Competencias Narrativas</h3>
            <div className="h-64 w-full">
              {sessions.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Area type="monotone" dataKey="puntuacion" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-3xl space-y-4">
                  <i className="ph ph-chart-bar text-4xl opacity-20"></i>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sin datos de rendimiento disponibles</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl animate-fadeIn">
          {sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-10 py-6">Fecha y Hora</th>
                    <th className="px-10 py-6">Perfil Simulado</th>
                    <th className="px-10 py-6 text-center">Precisión</th>
                    <th className="px-10 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-10 py-6 text-sm text-white font-medium">
                        {new Date(session.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-10 py-6 text-sm text-slate-400">{session.config.role}</td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${session.overallScore > 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {session.overallScore}%
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => onViewSession(session)} 
                          className="px-6 py-2.5 bg-white/5 hover:bg-white text-slate-400 hover:text-slate-900 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all"
                        >
                          Ver Reporte
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center space-y-6">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                  <i className="ph ph-folder-open text-4xl"></i>
               </div>
               <div className="text-center">
                  <h4 className="text-white font-bold text-lg">Historial Vacío</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Tus simulaciones aparecerán aquí una vez que completes tu primer entrenamiento.</p>
               </div>
               <button onClick={onStart} className="px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                  Iniciar Primera Simulación
               </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'guias' && (
        <div className="animate-fadeIn space-y-8">
           <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5"></div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Biblioteca de Estrategia Elite</h3>
              <div className="h-px flex-1 bg-white/5"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {GUIDES.map((guide, idx) => (
               <div key={idx} className="glass p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group shadow-xl">
                 <div className="flex items-start gap-6">
                   <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                     <i className={`ph-bold ${guide.icon} text-2xl ${guide.color}`}></i>
                   </div>
                   <div className="space-y-3 flex-1">
                     <h4 className="text-white font-bold text-lg tracking-tight">{guide.title}</h4>
                     <p className="text-slate-400 text-sm leading-relaxed">{guide.desc}</p>
                   </div>
                 </div>
               </div>
             ))}
           </div>

           <div className="glass p-10 rounded-[2.5rem] bg-blue-600/5 border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h4 className="text-white font-bold text-xl">¿Necesitas un manual completo?</h4>
                <p className="text-slate-400 text-sm">Consulta nuestra documentación técnica sobre métricas senior y el motor de IA.</p>
              </div>
              <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">
                Abrir Documentación
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
