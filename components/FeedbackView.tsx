
import React, { useState } from 'react';
import { SessionRecord } from '../types';

interface FeedbackViewProps {
  session: SessionRecord;
  onClose: () => void;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ session, onClose }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'analysis' | 'mirror'>('global');
  const [selectedQ, setSelectedQ] = useState(0);

  const currentQ = session.questions[selectedQ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20">Reporte Finalizado</span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">| {new Date(session.timestamp).toLocaleString()}</span>
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Informe de Sesión Elite</h1>
        </div>
        <button 
          onClick={onClose}
          className="px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest shadow-xl shadow-white/5"
        >
          Volver al Dashboard
        </button>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5">
        {[
          { id: 'global', label: 'Análisis Global', icon: 'ph-chart-line-up' },
          { id: 'analysis', label: 'Pregunta a Pregunta', icon: 'ph-list-checks' },
          { id: 'mirror', label: 'Modo Espejo', icon: 'ph-magic-wand' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <i className={`ph-bold ${tab.icon} text-sm`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Global Tab Content */}
      {activeTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* Left Column: Score & Mistakes */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-10 rounded-[2.5rem] text-center border-t-4 border-blue-600 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Maestría Global</span>
              <div className="text-8xl font-black text-white my-6 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                {session.overallScore}<span className="text-3xl text-blue-500">%</span>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
                "{session.overallSummary}"
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/20">
              <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="ph-bold ph-warning-circle"></i> Dónde la cagaste (Crítico)
              </h4>
              <ul className="space-y-4">
                {session.mistakes.map((m, i) => (
                  <li key={i} className="text-xs text-slate-400 flex gap-4 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-red-500 font-black">0{i+1}</span> {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Detailed Feedback & Fillers */}
          <div className="lg:col-span-8 space-y-8">
            <div className="glass p-10 rounded-[2.5rem] border-amber-500/20 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 blur-[50px] rounded-full"></div>
              
              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="ph-bold ph-waveform"></i> Laboratorio de Voz: Muletillas y Vicios
              </h4>

              <div className="space-y-6">
                <div className="p-8 bg-amber-500/5 rounded-[2rem] border border-amber-500/10">
                  <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest block mb-4">Análisis de Impacto Verbal</span>
                  <div className="text-slate-300 leading-relaxed text-lg font-medium whitespace-pre-line">
                    {session.fillerWordAnalysis}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                        <i className="ph-bold ph-x-circle"></i>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vicio Detectado</span>
                    </div>
                    <p className="text-xs text-slate-500">Uso recurrente de conectores débiles que proyectan inseguridad o falta de preparación.</p>
                  </div>

                  <div className="p-6 bg-blue-600/5 rounded-2xl border border-blue-500/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <i className="ph-bold ph-lightning"></i>
                      </div>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Reemplazo Sugerido</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">Sustituye por pausas de 1-2 segundos o palabras asertivas como "Específicamente" o "Considerando".</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-[2rem]">
                <i className="ph ph-shield-check text-blue-500 text-3xl mb-4"></i>
                <h5 className="text-white font-bold mb-2">Estructura STAR</h5>
                <p className="text-xs text-slate-500">Tu capacidad de organizar respuestas por contexto, acción y resultado ha mejorado notablemente en esta sesión.</p>
              </div>
              <div className="glass p-8 rounded-[2rem]">
                <i className="ph ph-chart-polar text-indigo-500 text-3xl mb-4"></i>
                <h5 className="text-white font-bold mb-2">Tono Senior</h5>
                <p className="text-xs text-slate-500">Mantienes un tono profesional, pero la IA sugiere mayor énfasis en los resultados cuantitativos de tus acciones.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          <div className="lg:col-span-4 space-y-3">
            {session.questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setSelectedQ(i)}
                className={`w-full text-left p-6 rounded-[2rem] transition-all border ${
                  selectedQ === i 
                    ? 'glass border-blue-500/50 bg-blue-500/5 shadow-xl shadow-blue-500/10' 
                    : 'border-transparent hover:bg-white/5 text-slate-500'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest">Pregunta {i + 1}</span>
                    <span className="text-[9px] font-bold text-blue-400">{q.starAnalysis.score}% Eficacia</span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-2">{q.question}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 glass p-10 rounded-[2.5rem] space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <i className="ph ph-trend-up text-[150px]"></i>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white italic mb-6 leading-tight">"{currentQ.question}"</h3>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10 relative">
                <span className="absolute -top-3 left-8 px-4 py-1 bg-slate-900 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">Tu Respuesta Original</span>
                <p className="text-slate-300 italic text-lg leading-relaxed">"{currentQ.originalResponse}"</p>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Puntaje de Tono</span>
                    <span className="text-xl font-black text-white">{currentQ.toneScore || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${currentQ.toneScore || 0}%` }}></div>
                  </div>
                  <div className="p-4 bg-blue-500/5 rounded-xl">
                    <p className="text-[10px] text-slate-400 italic leading-relaxed">
                      <span className="text-blue-400 font-bold">Análisis IA:</span> {currentQ.toneExplanation || 'El tono determina cómo conectas emocionalmente con el entrevistador.'}
                    </p>
                  </div>
               </div>

               <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Asertividad</span>
                    <span className="text-xl font-black text-white">{currentQ.assertivenessScore || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${currentQ.assertivenessScore || 0}%` }}></div>
                  </div>
                  <div className="p-4 bg-emerald-500/5 rounded-xl">
                    <p className="text-[10px] text-slate-400 italic leading-relaxed">
                      <span className="text-emerald-400 font-bold">Análisis IA:</span> {currentQ.assertivenessExplanation || 'La asertividad mide la seguridad y claridad al defender tus ideas.'}
                    </p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'Situación', content: currentQ.starAnalysis.situation, color: 'text-blue-400' },
                 { label: 'Tarea', content: currentQ.starAnalysis.task, color: 'text-indigo-400' },
                 { label: 'Acción', content: currentQ.starAnalysis.action, color: 'text-purple-400' },
                 { label: 'Resultado', content: currentQ.starAnalysis.result, color: 'text-emerald-400' }
               ].map(x => (
                 <div key={x.label} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                   <div className={`text-[9px] font-black uppercase tracking-widest mb-3 ${x.color}`}>{x.label}</div>
                   <p className="text-[11px] text-slate-400 leading-relaxed">{x.content || 'No detectado'}</p>
                 </div>
               ))}
            </div>

            <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
              <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="ph-bold ph-lightbulb"></i> Feedback Táctico
              </h5>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">{currentQ.generalFeedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mirror Mode Tab */}
      {activeTab === 'mirror' && (
        <div className="space-y-10 animate-fadeIn">
          <div className="glass p-12 rounded-[3rem] bg-indigo-600/5 border-indigo-500/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <i className="ph ph-magic-wand text-[200px]"></i>
             </div>
             
             <div className="max-w-4xl relative z-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
                 <i className="ph-bold ph-sparkle"></i> IA Mirror Mode Activado
               </div>
               <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">La Versión Elite de tus Historias</h2>
               <p className="text-slate-400 text-lg mb-12">He analizado tus experiencias reales y las he reescrito para que suenen como un profesional de nivel Senior. Estudia estas versiones para tu próxima entrevista real.</p>
               
               <div className="space-y-16">
                 {session.questions.map((q, i) => (
                   <div key={i} className="space-y-8 animate-fadeIn" style={{ animationDelay: `${i * 0.2}s` }}>
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-500/20">{i + 1}</div>
                       <h4 className="font-bold text-white text-xl tracking-tight leading-tight">{q.question}</h4>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Comparison User */}
                        <div className="space-y-4">
                          <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest pl-2">Tu Base Original</span>
                          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 opacity-60">
                            <p className="text-xs text-slate-400 italic leading-relaxed">"{q.originalResponse}"</p>
                          </div>
                        </div>

                        {/* Comparison Elite */}
                        <div className="space-y-4 relative">
                          <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest pl-2 flex items-center gap-2">
                             <i className="ph-bold ph-lightning"></i> Versión Mejorada (Senior Path)
                          </span>
                          <div className="p-10 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-500/30 shadow-2xl relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none"></div>
                            <p className="text-sm text-indigo-100 leading-relaxed font-bold relative z-10">
                              "{q.idealResponse}"
                            </p>
                          </div>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackView;
