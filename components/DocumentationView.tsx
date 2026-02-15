
import React from 'react';

interface DocumentationViewProps {
  onBack: () => void;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">
        <i className="ph ph-arrow-left"></i> Volver al panel
      </button>

      <div className="glass p-10 rounded-[2rem] space-y-8">
        <h1 className="text-3xl font-bold text-white">Guía de Uso</h1>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-blue-400">¿Qué es el Método STAR?</h2>
          <p className="text-sm text-slate-400 leading-relaxed">Es una técnica para responder preguntas sobre tu experiencia pasada. Se basa en describir la Situación, la Tarea que tenías, la Acción que realizaste y el Resultado obtenido. Ayuda a que tus respuestas sean claras y concretas.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-emerald-400">Comparativa de Respuestas</h2>
          <p className="text-sm text-slate-400 leading-relaxed">Nuestra IA analiza lo que dices y te ofrece una versión alternativa. El objetivo no es que la memorices, sino que veas cómo podrías destacar mejor tus habilidades y logros.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-purple-400">Niveles de Práctica</h2>
          <p className="text-sm text-slate-400 leading-relaxed">Puedes ajustar qué tan difíciles son las preguntas. Si estás empezando, usa un nivel bajo. Si quieres un reto mayor, sube la intensidad para simular una entrevista más exigente.</p>
        </section>
      </div>
    </div>
  );
};

export default DocumentationView;
