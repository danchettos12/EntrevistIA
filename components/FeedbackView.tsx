
import React, { useState } from 'react';
import { SessionRecord } from '../types.ts';

interface FeedbackViewProps {
  session: SessionRecord;
  onClose: () => void;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ session, onClose }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'preguntas' | 'mejora'>('global');
  const [selectedQ, setSelectedQ] = useState(0);

  const currentQ = session.questions[selectedQ];

  const getStatusColor = (text: string) => {
    if (text.toLowerCase().includes('faltante') || text.toLowerCase().includes('no detectado')) return 'text-red-400 border-red-500/20 bg-red-500/5';
    return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-[9px] font-bold uppercase tracking-widest rounded border border-blue-500/20">Reporte de Desempeño</span>
            <span className="text-slate-500 text-[9px] font-medium uppercase tracking-widest">{new Date(session.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Análisis Experto IA</h1>
        </div>
        <button 
          onClick={onClose}
          className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-500 hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/10"
        >
          Finalizar Revisión
        </button>
      </div>

      <div className="flex gap-8 border-b border-white/5 overflow-x-auto pb-px">
        {[
          { id: 'global', label: 'Dashboard' },
          { id: 'preguntas', label: 'Estructura STAR' },
          { id: 'mejora', label: 'Comparativa' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab.id ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
          </button>
        ))}
      </div>

      {activeTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-10 rounded-[2.5rem] text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Puntuación Global</span>
              <div className="text-8xl font-black text-white my-4 tracking-tighter">
                {session.overallScore}<span className="text-2xl text-slate-600 ml-1">%</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic px-4 mt-6">
                "{session.overallSummary}"
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 space-y-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <i className="ph-fill ph-warning-circle text-amber-500"></i> Puntos Críticos
              </h4>
              <ul className="space-y-4">
                {session.mistakes.map((m, i) => (
                  <li key={i} className="text-[11px] text-slate-400 flex gap-4 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-blue-500/20 transition-all">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">{i+1}</span> 
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="glass p-10 rounded-[2.5rem] space-y-6 border-t-4 border-blue-500">
              <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Análisis de Comunicación y Fluidez</h4>
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line font-medium">
                {session.fillerWordAnalysis}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass p-8 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tono de Voz</span>
                    <span className="text-blue-400 font-mono font-bold">85%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase leading-relaxed tracking-wider">Profesional, calmado y enfocado a resultados.</p>
               </div>
               <div className="glass p-8 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asertividad</span>
                    <span className="text-emerald-400 font-mono font-bold">70%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase leading-relaxed tracking-wider">Directo pero receptivo a sugerencias técnicas.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preguntas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          <div className="lg:col-span-4 space-y-3">
            <div className="p-4 mb-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Seleccionar Respuesta</h4>
            </div>
            {session.questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setSelectedQ(i)}
                className={`w-full text-left p-6 rounded-[1.5rem] transition-all border ${
                  selectedQ === i ? 'glass border-blue-500/50 bg-blue-500/10 shadow-lg' : 'border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${selectedQ === i ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500'}`}>Pregunta {i + 1}</span>
                    <span className={`text-[11px] font-bold ${q.starAnalysis.score > 70 ? 'text-emerald-400' : 'text-blue-400'}`}>{q.starAnalysis.score}%</span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-2 leading-relaxed">{q.question}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 glass p-10 rounded-[2.5rem] space-y-10 relative">
            {currentQ ? (
              <>
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Análisis STAR Detallado</span>
                  <h3 className="text-2xl font-bold text-white leading-tight">"{currentQ.question}"</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     { label: 'Situación', content: currentQ.starAnalysis.situation, icon: 'ph-map-pin' },
                     { label: 'Tarea', content: currentQ.starAnalysis.task, icon: 'ph-clipboard-text' },
                     { label: 'Acción', content: currentQ.starAnalysis.action, icon: 'ph-lightning' },
                     { label: 'Resultado', content: currentQ.starAnalysis.result, icon: 'ph-chart-bar' }
                   ].map(x => (
                     <div key={x.label} className={`p-6 rounded-[1.5rem] border ${getStatusColor(x.content)} flex flex-col gap-3 group transition-all`}>
                       <div className="flex items-center gap-3">
                          <i className={`ph-bold ${x.icon} text-lg`}></i>
                          <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">{x.label}</div>
                       </div>
                       <p className="text-xs leading-relaxed font-medium">{x.content}</p>
                     </div>
                   ))}
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="p-8 bg-slate-900/40 rounded-3xl border border-white/5">
                      <div className="flex items-center gap-3 mb-4">
                        <i className="ph-bold ph-chat-circle-dots text-blue-400"></i>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Feedback Técnico del Coach</span>
                      </div>
                      <p className="text-slate-300 italic text-sm leading-relaxed border-l-2 border-blue-500/30 pl-6">
                        {currentQ.generalFeedback}
                      </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 italic">Selecciona una pregunta para ver el análisis</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'mejora' && (
        <div className="glass p-12 rounded-[2.5rem] space-y-12 animate-fadeIn relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
              <i className="ph ph-magic-wand text-[20rem]"></i>
           </div>
           
           <div className="max-w-2xl relative">
              <h2 className="text-3xl font-bold text-white mb-4">Optimización Estratégica</h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Comparamos tu respuesta original con una propuesta de nivel Senior. Fíjate en el uso de palabras de acción y métricas cuantificables.
              </p>
           </div>
           
           <div className="space-y-16">
             {session.questions.map((q, i) => (
               <div key={i} className="space-y-6">
                 <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-bold text-sm border border-white/10">{i + 1}</span>
                    <h4 className="font-bold text-white text-xl">{q.question}</h4>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                          <i className="ph ph-user"></i> Tu versión original
                       </span>
                       <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 h-full">
                          <p className="text-sm text-slate-400 italic leading-relaxed">"{q.originalResponse}"</p>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <span className="text-[10px] font-bold uppercase text-blue-400 tracking-widest flex items-center gap-2">
                          <i className="ph-fill ph-sparkle"></i> Recomendación de la IA
                       </span>
                       <div className="p-8 rounded-[2rem] bg-blue-600/5 border border-blue-500/20 h-full relative group">
                          <div className="absolute -top-3 -right-3 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/40 group-hover:scale-110 transition-transform">
                             <i className="ph-bold ph-check"></i>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed font-medium">"{q.idealResponse}"</p>
                       </div>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackView;
