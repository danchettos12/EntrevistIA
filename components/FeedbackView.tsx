
import React, { useState } from 'react';
import { SessionRecord } from '../types.ts';

interface FeedbackViewProps {
  session: SessionRecord;
  onClose: () => void;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ session, onClose }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'preguntas' | 'espejo'>('global');
  const [selectedQ, setSelectedQ] = useState(0);

  const currentQ = session.questions[selectedQ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded border border-blue-500/20">Informe de Evaluación</span>
            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">{new Date(session.timestamp).toLocaleString('es-ES')}</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Análisis de Desempeño Profesional</h1>
        </div>
        <button 
          onClick={onClose}
          className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest"
        >
          Cerrar Informe
        </button>
      </div>

      <div className="flex gap-4 border-b border-white/5 overflow-x-auto pb-px">
        {[
          { id: 'global', label: 'Resumen Ejecutivo' },
          { id: 'preguntas', label: 'Análisis STAR' },
          { id: 'espejo', label: 'Modo Espejo' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
          </button>
        ))}
      </div>

      {activeTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-10 rounded-3xl text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Puntaje Global</span>
              <div className="text-8xl font-light text-white my-6">
                {session.overallScore}<span className="text-2xl text-slate-500">%</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                "{session.overallSummary}"
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/50 border border-white/5">
              <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="ph ph-warning-circle text-amber-500"></i> Áreas de Mejora
              </h4>
              <ul className="space-y-4">
                {session.mistakes.map((m, i) => (
                  <li key={i} className="text-xs text-slate-400 flex gap-4 leading-relaxed bg-white/5 p-4 rounded-xl">
                    <span className="text-blue-500 font-bold">{i+1}.</span> {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="glass p-8 rounded-3xl">
              <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6">Comunicación Oral y Fluidez</h4>
              <p className="text-slate-300 leading-relaxed text-base font-medium whitespace-pre-line mb-8">
                {session.fillerWordAnalysis}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preguntas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          <div className="lg:col-span-4 space-y-2">
            {session.questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setSelectedQ(i)}
                className={`w-full text-left p-6 rounded-2xl transition-all border ${
                  selectedQ === i ? 'glass border-blue-500/30 bg-blue-500/5' : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">P{i + 1}</span>
                    <span className="text-[9px] font-bold text-blue-400">{q.starAnalysis.score}%</span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">{q.question}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 glass p-10 rounded-3xl space-y-8">
            {currentQ ? (
              <>
                <h3 className="text-xl font-bold text-white mb-6">"{currentQ.question}"</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {[
                     { label: 'Situación', content: currentQ.starAnalysis.situation },
                     { label: 'Tarea', content: currentQ.starAnalysis.task },
                     { label: 'Acción', content: currentQ.starAnalysis.action },
                     { label: 'Resultado', content: currentQ.starAnalysis.result }
                   ].map(x => (
                     <div key={x.label} className="p-4 bg-white/5 rounded-xl border border-white/5">
                       <div className="text-[8px] font-bold uppercase tracking-widest mb-2 text-slate-500">{x.label}</div>
                       <p className="text-[10px] text-slate-400 leading-tight">{x.content || 'N/A'}</p>
                     </div>
                   ))}
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Respuesta Original</span>
                    <p className="text-slate-300 italic text-sm leading-relaxed">"{currentQ.originalResponse}"</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {activeTab === 'espejo' && (
        <div className="glass p-12 rounded-3xl space-y-12 animate-fadeIn">
           <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-white mb-4">Optimización Senior</h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Reestructuración sugerida para sonar como un líder senior, basada en tus propias experiencias.
              </p>
           </div>
           
           <div className="space-y-12">
             {session.questions.map((q, i) => (
               <div key={i} className="space-y-6">
                 <h4 className="font-bold text-white text-lg tracking-tight">{i + 1}. {q.question}</h4>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                       <span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest block mb-4">Original</span>
                       <p className="text-xs text-slate-400 italic">"{q.originalResponse}"</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/20">
                       <span className="text-[9px] font-bold uppercase text-blue-400 tracking-widest block mb-4">Senior Rewrite</span>
                       <p className="text-sm text-slate-200 font-medium">"{q.idealResponse}"</p>
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
