
import React, { useState, useEffect } from 'react';
import { DocumentationTopic } from '../types.ts';

interface DocumentationViewProps {
  initialTopic?: DocumentationTopic;
  onBack: () => void;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ initialTopic = 'star', onBack }) => {
  const [activeTopic, setActiveTopic] = useState<DocumentationTopic>(initialTopic);

  useEffect(() => {
    setActiveTopic(initialTopic);
  }, [initialTopic]);

  const topics: { id: DocumentationTopic; label: string; icon: string }[] = [
    { id: 'star', label: 'Método STAR', icon: 'ph-star-four' },
    { id: 'communication', label: 'Comunicación', icon: 'ph-chat-teardrop-text' },
    { id: 'questions', label: 'Preguntas Clave', icon: 'ph-question' },
    { id: 'rhythm', label: 'Oratoria y Ritmo', icon: 'ph-waveform' },
    { id: 'psychology', label: 'Psicología', icon: 'ph-brain' },
  ];

  const renderContent = () => {
    switch (activeTopic) {
      case 'star':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Domina el Método STAR</h2>
              <p className="text-slate-400 leading-relaxed">La técnica definitiva para estructurar respuestas conductuales y demostrar resultados tangibles.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { t: 'Situación', d: 'Describe el contexto de un desafío específico. Sé breve pero da los detalles necesarios para entender el entorno.', i: 'ph-map-pin' },
                { t: 'Tarea', d: '¿Cuál era tu objetivo o responsabilidad? ¿Qué se esperaba de ti en ese momento exacto?', i: 'ph-clipboard-text' },
                { t: 'Acción', d: 'La parte más importante. Detalla los pasos que TÚ tomaste. Usa verbos de acción fuertes.', i: 'ph-lightning' },
                { t: 'Resultado', d: 'El desenlace. Usa números si es posible. ¿Qué impacto tuvo tu acción en el negocio?', i: 'ph-chart-bar' }
              ].map(x => (
                <div key={x.t} className="glass p-6 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-3 text-blue-400">
                    <i className={`ph-bold ${x.i} text-xl`}></i>
                    <h4 className="font-bold uppercase tracking-widest text-[10px]">{x.t}</h4>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{x.d}</p>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
              <h4 className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                <i className="ph ph-check-circle"></i> Ejemplo de Éxito (Nivel Senior)
              </h4>
              <p className="text-sm text-slate-200 italic leading-relaxed">
                "En mi anterior rol (S), las ventas habían caído un 15% (T). Implementé un nuevo sistema de CRM y reentrené al equipo en cierre consultivo (A). Como resultado, recuperamos el volumen perdido y cerramos el año con un incremento neto del 22% en facturación (R)."
              </p>
            </div>
          </div>
        );
      case 'communication':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Comunicación Ejecutiva</h2>
              <p className="text-slate-400 leading-relaxed">Cómo sonar como un líder y transmitir autoridad sin parecer arrogante.</p>
            </header>

            <div className="space-y-6">
              <section className="glass p-8 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-white font-bold text-lg">La Regla de los 3 Segundos</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Cuando te hagan una pregunta difícil, no respondas inmediatamente. Haz una pausa de 2-3 segundos. Esto proyecta confianza, control y demuestra que estás procesando la información seriamente.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-4">
                   <h4 className="text-red-400 font-bold text-xs uppercase tracking-widest">A evitar</h4>
                   <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                     <li>Muletillas (eh, bueno, o sea, mmm).</li>
                     <li>Voz en tono ascendente al final de las frases.</li>
                     <li>Disculparse sin motivo.</li>
                   </ul>
                 </div>
                 <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-4">
                   <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest">A potenciar</h4>
                   <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                     <li>Contacto visual (incluso en videollamadas).</li>
                     <li>Manos visibles y gestos abiertos.</li>
                     <li>Voz modulada y con intención.</li>
                   </ul>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'questions':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Preguntas de Alto Impacto</h2>
              <p className="text-slate-400 leading-relaxed">Estrategias para las preguntas más temidas y cómo darlas vuelta a tu favor.</p>
            </header>

            <div className="space-y-4">
              {[
                { q: "¿Cuál es tu mayor debilidad?", a: "No menciones una virtud disfrazada. Elige una habilidad técnica real que estés mejorando activamente." },
                { q: "¿Por qué deberíamos contratarte?", a: "Enfócate en los problemas que puedes resolver para ellos, no en lo que tú ganas." },
                { q: "Cuéntame de un error...", a: "No culpes a otros. Acepta la responsabilidad, explica la lección y muestra cómo aplicas ese aprendizaje hoy." }
              ].map((item, idx) => (
                <div key={idx} className="glass p-8 rounded-3xl border border-white/5 group">
                  <h4 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.q}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'rhythm':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Oratoria y Ritmo</h2>
              <p className="text-slate-400 leading-relaxed">El arte de controlar el tiempo y el aire durante una conversación profesional.</p>
            </header>

            <div className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-8">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                     <i className="ph ph-metronome text-3xl"></i>
                  </div>
                  <div>
                     <h3 className="text-white font-bold text-xl">El 'Tempo' del Experto</h3>
                     <p className="text-slate-500 text-sm">Hablar rápido suele ser señal de nerviosismo.</p>
                  </div>
               </div>

               <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
                  <p>
                    Un orador profesional habla a unas 130-150 palabras por minuto. Si vas más rápido, tu cerebro no podrá procesar la siguiente frase y recurrirás a las muletillas. 
                  </p>
                  <div className="p-6 bg-white/5 rounded-2xl border-l-4 border-amber-500">
                    <span className="font-bold text-amber-400 block mb-1">PRO TIP:</span>
                    "Usa el silencio como puntuación. Al terminar un punto clave, calla durante un segundo completo. Deja que tu mensaje aterrice en el entrevistador."
                  </div>
               </div>
            </div>
          </div>
        );
      case 'psychology':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Psicología del Éxito</h2>
              <p className="text-slate-400 leading-relaxed">Manejo de la ansiedad y el "Síndrome del Impostor" antes de entrar a la sala.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
                  <i className="ph ph-mask-happy text-3xl text-purple-400"></i>
                  <h3 className="text-white font-bold">Reencuadre de Ansiedad</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    La ansiedad y la emoción son fisiológicamente casi iguales. Di en voz alta: "Estoy emocionado por esta oportunidad" en lugar de "Estoy nervioso". Tu cerebro cambiará su enfoque.
                  </p>
               </div>
               <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
                  <i className="ph ph-hand-fist text-3xl text-emerald-400"></i>
                  <h3 className="text-white font-bold">Posturas de Poder</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Dos minutos antes de empezar, párate derecho, manos en la cadera y respira profundo. Está demostrado que reduce el cortisol y aumenta la testosterona, mejorando tu presencia.
                  </p>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-8">
          <button 
            onClick={onBack} 
            className="flex items-center gap-3 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all mb-4"
          >
            <i className="ph ph-arrow-left"></i> Volver al panel
          </button>

          <div className="glass p-4 rounded-3xl border border-white/5 space-y-2">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-4 py-2 block">Temas de Aprendizaje</span>
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-sm font-bold ${
                  activeTopic === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className={`ph-bold ${t.icon} text-lg`}></i>
                {t.label}
              </button>
            ))}
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-600/10 text-blue-400 rounded-full flex items-center justify-center mx-auto">
               <i className="ph ph-lightbulb text-2xl"></i>
            </div>
            <h5 className="text-white font-bold text-sm">¿Sabías que?</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">El 70% de las decisiones de contratación se toman en los primeros 5 minutos de la entrevista.</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 glass p-10 md:p-16 rounded-[3rem] border border-white/5 shadow-2xl min-h-[70vh]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DocumentationView;
