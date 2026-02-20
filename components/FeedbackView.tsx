
import React, { useState } from 'react';
import { SessionRecord } from '../types.ts';

interface FeedbackViewProps {
  session: SessionRecord;
  onClose: () => void;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ session, onClose }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'preguntas' | 'comunicacion' | 'mejora'>('global');
  const [selectedQ, setSelectedQ] = useState(0);

  const currentQ = session.questions[selectedQ];

  const getStatusColor = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('faltante') || lower.includes('no detectado') || lower.includes('pobre') || lower.includes('vago') || lower.includes('débil')) return 'text-red-400 border-red-500/20 bg-red-500/5';
    if (lower.includes('aceptable') || lower.includes('parcial') || lower.includes('analizado')) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  };

  const getMetricColor = (score: number) => {
    if (score <= 10) return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    if (score < 50) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (score < 75) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  const getMetricLabel = (score: number) => {
    if (score === 0) return 'Incompleto';
    if (score < 40) return 'Crítico';
    if (score < 60) return 'Deficiente';
    if (score < 80) return 'Competente';
    return 'Excelente';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-red-600/10 text-red-400 text-[9px] font-bold uppercase tracking-widest rounded border border-red-500/20">Auditoría de Desempeño</span>
            <span className="text-slate-500 text-[9px] font-medium uppercase tracking-widest">Cargo: {session.config.role}</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reporte de Feedback Senior</h1>
        </div>
        <button 
          onClick={onClose}
          className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-xl"
        >
          Finalizar Revisión
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/5 overflow-x-auto pb-px">
        {[
          { id: 'global', label: 'Resumen Ejecutivo' },
          { id: 'preguntas', label: 'Estructura STAR' },
          { id: 'comunicacion', label: 'Auditoría de Oratoria' },
          { id: 'mejora', label: 'Comparativa Nivel C' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
          </button>
        ))}
      </div>

      {/* View: Global (Resumen Ejecutivo) */}
      {activeTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-10 rounded-[2.5rem] text-center relative overflow-hidden border border-white/5">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Puntuación de Candidato</span>
              <div className="text-8xl font-black text-white my-4 tracking-tighter">
                {session.overallScore}<span className="text-2xl text-slate-600 ml-1">%</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic px-4 mt-6">
                "{session.overallSummary}"
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 space-y-6">
              <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                <i className="ph-fill ph-prohibit text-red-500"></i> Fallos de Alto Impacto
              </h4>
              <ul className="space-y-4">
                {session.mistakes.map((m, i) => (
                  <li key={i} className="text-[11px] text-slate-400 flex gap-4 leading-relaxed bg-red-500/5 p-5 rounded-2xl border border-red-500/10 group hover:border-red-500/30 transition-all">
                    <span className="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">{i+1}</span> 
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8 glass p-10 rounded-[2.5rem] space-y-12 border border-white/5">
             <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Veredicto Profesional</h4>
                <p className="text-slate-200 text-xl leading-relaxed font-semibold">
                  Tu desempeño global se sitúa en el percentil de {session.overallScore}%. 
                  {session.overallScore < 70 ? ' Tu comunicación requiere ajustes técnicos en la estructuración de impacto para alcanzar niveles senior.' : ' Muestras rasgos de competencia sólida, pero con vicios técnicos corregibles en la cuantificación.'}
                </p>
             </div>

             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                   <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fortalezas Identificadas</h5>
                   <div className="space-y-3">
                      <div className="flex items-center gap-4 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                         <i className="ph-bold ph-check-circle text-emerald-400"></i>
                         <span className="text-xs text-slate-300">Coherencia estructural STAR {session.overallScore > 60 ? 'sólida' : 'básica'}</span>
                      </div>
                   </div>
                </div>
                <div className="space-y-6">
                   <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Debilidades Críticas</h5>
                   <div className="space-y-3">
                      <div className="flex items-center gap-4 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                         <i className="ph-bold ph-x-circle text-red-400"></i>
                         <span className="text-xs text-slate-300">{session.overallScore < 50 ? 'Falta total de resultados' : 'Falta de cuantificación precisa'}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* View: Preguntas (STAR) */}
      {activeTab === 'preguntas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          <div className="lg:col-span-4 space-y-3">
            <div className="p-4 mb-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auditoría por Pregunta</h4>
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
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${selectedQ === i ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500'}`}>Caso {i + 1}</span>
                    <span className={`text-[11px] font-bold ${getMetricColor(q.starAnalysis.score)} px-2 rounded-full`}>{q.starAnalysis.score}%</span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-2 leading-relaxed">{q.question}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 glass p-10 rounded-[2.5rem] space-y-8 relative border border-white/5 overflow-y-auto max-h-[80vh]">
            {currentQ ? (
              <>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pregunta del Entrevistador</span>
                    <h3 className="text-xl font-bold text-white leading-tight">"{currentQ.question}"</h3>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Tu Respuesta Transcrita</span>
                    <div className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/10">
                      <p className="text-sm text-slate-400 italic leading-relaxed">"{currentQ.originalResponse}"</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-6">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Desglose de Estructura STAR</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Situación', content: currentQ.starAnalysis.situation, icon: 'ph-map-pin' },
                      { label: 'Tarea', content: currentQ.starAnalysis.task, icon: 'ph-clipboard-text' },
                      { label: 'Acción', content: currentQ.starAnalysis.action, icon: 'ph-lightning' },
                      { label: 'Resultado', content: currentQ.starAnalysis.result, icon: 'ph-chart-bar' }
                    ].map(x => (
                      <div key={x.label} className={`p-6 rounded-[1.5rem] border ${getStatusColor(x.content)} flex flex-col gap-3 transition-all`}>
                        <div className="flex items-center gap-3">
                           <i className={`ph-bold ${x.icon} text-lg`}></i>
                           <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">{x.label}</div>
                        </div>
                        <p className="text-xs leading-relaxed font-bold">{x.content || "Información no proporcionada"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-black/40 rounded-3xl border border-white/5">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <i className="ph ph-warning-octagon text-amber-500"></i> Crítica del Evaluador
                    </h5>
                    <p className="text-slate-300 text-sm leading-relaxed border-l-4 border-blue-500/50 pl-6 italic">
                      {currentQ.generalFeedback}
                    </p>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 italic">Selecciona un caso para auditar</div>
            )}
          </div>
        </div>
      )}

      {/* View: Auditoría de Oratoria */}
      {activeTab === 'comunicacion' && (
        <div className="animate-fadeIn space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Ritmo (Pacing)', score: session.communicationMetrics?.pacing || 0, icon: 'ph-waveform', desc: 'Control de velocidad y pausas tácticas.' },
                { label: 'Vocabulario', score: session.communicationMetrics?.vocabulary || 0, icon: 'ph-book-bookmark', desc: 'Riqueza léxica y términos de industria.' },
                { label: 'Claridad', score: session.communicationMetrics?.clarity || 0, icon: 'ph-broadcast', desc: 'Articulación y ausencia de ambigüedad.' },
                { label: 'Confianza', score: session.communicationMetrics?.confidence || 0, icon: 'ph-shield-check', desc: 'Autoridad verbal y asertividad.' }
              ].map((m, i) => (
                <div key={i} className="glass p-8 rounded-3xl border border-white/5 space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                         <i className={`ph-bold ${m.icon} text-xl`}></i>
                      </div>
                      <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase ${getMetricColor(m.score)}`}>
                        {getMetricLabel(m.score)}
                      </span>
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-white font-bold text-sm uppercase tracking-tight">{m.label}</h4>
                      <div className="text-2xl font-black text-white">{m.score}%</div>
                   </div>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${m.score < 50 ? 'bg-red-500' : m.score < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${m.score}%` }}></div>
                   </div>
                   <p className="text-[10px] text-slate-500 leading-relaxed">{m.desc}</p>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-8 h-full">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                       <i className="ph-fill ph-warning-circle text-lg"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Análisis Forense de Fluidez</h3>
                 </div>
                 
                 <div className="prose prose-invert max-w-none">
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5 text-slate-300 text-sm leading-relaxed whitespace-pre-line border-l-4 border-red-500/50">
                       {session.fillerWordAnalysis || "No se detectaron suficientes datos de audio para un análisis de fluidez detallado."}
                    </div>
                 </div>
              </div>

              <div className="glass p-10 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 space-y-8 h-full">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                       <i className="ph-fill ph-shooting-star text-lg"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Plan de Mejora Crítico</h3>
                 </div>

                 <div className="space-y-4">
                    {(session.improvementPlan || [
                       "Eliminar el uso de muletillas de inicio ('Bueno', 'Eh').",
                       "Cuantificar resultados en cada respuesta (ej: '+20% eficiencia').",
                       "Reducir la velocidad del habla un 15% para mayor autoridad."
                    ]).map((item, idx) => (
                       <div key={idx} className="flex gap-4 p-6 bg-black/40 rounded-2xl border border-white/5 group hover:border-blue-500/50 transition-all">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-xs">
                             {idx + 1}
                          </span>
                          <p className="text-xs text-slate-200 font-bold leading-relaxed">{item}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* View: Mejora (Comparativa Nivel C) */}
      {activeTab === 'mejora' && (
        <div className="glass p-12 rounded-[2.5rem] space-y-12 animate-fadeIn relative border border-white/5 overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
              <i className="ph-fill ph-crown text-[20rem] text-blue-400"></i>
           </div>
           
           <div className="max-w-2xl relative">
              <h2 className="text-3xl font-bold text-white mb-4">Optimización de Elite (C-Level)</h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Transformamos tus respuestas promedio en declaraciones de impacto ejecutivo. No cambies tu historia, cambia tu <span className="text-blue-400 font-bold">autoridad</span>.
              </p>
           </div>
           
           <div className="space-y-16">
             {session.questions.map((q, i) => (
               <div key={i} className="space-y-6 relative">
                 <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm">{i + 1}</span>
                    <h4 className="font-bold text-white text-xl">{q.question}</h4>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                          <i className="ph ph-microphone-slash"></i> Tu Respuesta Original
                       </span>
                       <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 h-full">
                          <p className="text-sm text-slate-400 italic leading-relaxed">"{q.originalResponse}"</p>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <span className="text-[10px] font-bold uppercase text-blue-400 tracking-widest flex items-center gap-2">
                          <i className="ph-fill ph-seal-check"></i> Versión de Alto Impacto
                       </span>
                       <div className="p-8 rounded-[2rem] bg-blue-600/10 border border-blue-500/30 h-full relative group">
                          <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
                             <i className="ph-bold ph-lightning"></i>
                          </div>
                          <p className="text-sm text-slate-100 leading-relaxed font-bold">"{q.idealResponse}"</p>
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
