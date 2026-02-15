
import React from 'react';

interface DocumentationViewProps {
  onBack: () => void;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">
        <i className="ph ph-arrow-left"></i> Volver
      </button>

      <div className="glass p-12 rounded-[2.5rem] space-y-8">
        <h1 className="text-4xl font-bold text-white">Manual EntrevistIA</h1>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-blue-400">Metodología STAR</h2>
          <p className="text-slate-400">Analizamos tus respuestas buscando Situación, Tarea, Acción y Resultado. Esta estructura es el estándar de oro en entrevistas conductuales de alto nivel.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-emerald-400">Modo Espejo</h2>
          <p className="text-slate-400">Nuestra IA reescribe tus experiencias para proyectar autoridad senior. Compara tu respuesta original con la optimizada para aprender a articular mejor tus logros.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-purple-400">Rigor de Evaluación</h2>
          <p className="text-slate-400">Ajusta el nivel de presión para simular desde una charla amistosa hasta un panel técnico implacable.</p>
        </section>
      </div>
    </div>
  );
};

export default DocumentationView;
