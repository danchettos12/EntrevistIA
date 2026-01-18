
import React from 'react';

interface DocumentationViewProps {
  onBack: () => void;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-fadeIn print:p-0 print:bg-white print:text-black">
      {/* Botones de control - Ocultos en impresión */}
      <div className="flex justify-between items-center mb-12 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
        >
          <i className="ph ph-arrow-left"></i> Volver al Panel
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40"
        >
          <i className="ph ph-file-pdf text-lg"></i> Exportar a PDF Profesional
        </button>
      </div>

      {/* PORTADA DEL DOCUMENTO (PRD) */}
      <header className="text-center py-20 border-b border-white/10 mb-20 print:border-slate-200">
        <div className="inline-flex w-24 h-24 bg-blue-600 rounded-[2rem] items-center justify-center text-white text-5xl font-bold mb-8 shadow-3xl">
          <i className="ph ph-briefcase"></i>
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-white print:text-black mb-4 uppercase">
          Entrevist<span className="text-blue-500">IA</span> Elite
        </h1>
        <p className="text-blue-400 text-sm font-bold uppercase tracking-[1em] mb-12 print:text-blue-600">
          Product Requirements Document (PRD)
        </p>
        <div className="flex justify-center gap-12 opacity-40 print:opacity-100 print:text-slate-500">
          <div className="text-center">
            <span className="block text-[8px] font-bold uppercase tracking-widest">Documento ID</span>
            <span className="text-xs font-mono">EIA-2025-PRD-01</span>
          </div>
          <div className="text-center">
            <span className="block text-[8px] font-bold uppercase tracking-widest">Estado</span>
            <span className="text-xs font-mono">Final / Master</span>
          </div>
        </div>
      </header>

      <article className="space-y-20">
        {/* SECCIÓN 1: RESUMEN EJECUTIVO */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
             <span className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold">01</span>
             <h2 className="text-3xl font-bold text-white print:text-black tracking-tight">Visión y Propósito</h2>
          </div>
          <div className="glass p-10 rounded-[2.5rem] print:bg-transparent print:border-none print:p-0">
            <p className="text-slate-300 print:text-slate-800 leading-relaxed text-lg">
              EntrevistIA Elite es una plataforma de coaching de carrera diseñada para cerrar la brecha entre la experiencia técnica y la excelencia comunicativa. A diferencia de los simuladores genéricos, utiliza modelos de Inteligencia Artificial Generativa (LLMs) para auditar cada frase del usuario bajo estándares de selección ejecutiva internacional.
            </p>
          </div>
        </section>

        {/* SECCIÓN 2: CORE DE INTELIGENCIA */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <span className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-500 flex items-center justify-center font-bold">02</span>
             <h2 className="text-3xl font-bold text-white print:text-black tracking-tight">Arquitectura de Inteligencia Artificial</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 p-8 border border-white/5 rounded-3xl bg-white/5 print:bg-slate-50 print:border-slate-200">
              <h4 className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">Gemini 3 Flash (Latencia)</h4>
              <p className="text-xs text-slate-400 print:text-slate-700 leading-relaxed">
                Encargado del procesamiento de audio en tiempo real y la generación dinámica de preguntas. Su arquitectura optimizada permite transcribir y responder en milisegundos, manteniendo el flujo de la conversación natural.
              </p>
            </div>
            <div className="space-y-4 p-8 border border-white/5 rounded-3xl bg-white/5 print:bg-slate-50 print:border-slate-200">
              <h4 className="text-purple-400 font-bold uppercase text-[10px] tracking-widest">Gemini 3 Pro (Razonamiento)</h4>
              <p className="text-xs text-slate-400 print:text-slate-700 leading-relaxed">
                Motor central de análisis. Ejecuta el desglose STAR, evalúa la asertividad y genera el "Modo Espejo". Posee la capacidad de razonamiento necesaria para entender matices corporativos y sutilezas del lenguaje senior.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: FUNCIONALIDADES CLAVE */}
        <section className="space-y-10 page-break-before">
          <div className="flex items-center gap-4">
             <span className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-500 flex items-center justify-center font-bold">03</span>
             <h2 className="text-3xl font-bold text-white print:text-black tracking-tight">Desglose de Funcionalidades</h2>
          </div>
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-bold text-white print:text-black mb-4">A. Auditoría Estructural (STAR)</h3>
              <p className="text-sm text-slate-400 print:text-slate-700 leading-relaxed">
                El sistema descompone cada respuesta en cuatro pilares: <strong>Situación, Tarea, Acción y Resultado</strong>. Si un candidato omite las métricas (Resultado) o no define su responsabilidad (Tarea), la IA penaliza el puntaje y genera una recomendación correctiva inmediata.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white print:text-black mb-4">B. Modo Espejo (Narrativa Ejecutiva)</h3>
              <p className="text-sm text-slate-400 print:text-slate-700 leading-relaxed">
                Esta función transforma la transcripción cruda del usuario en un guion profesional. La IA reescribe la respuesta eliminando informalidades y potenciando palabras clave de liderazgo, permitiendo al usuario "escucharse" como un directivo de alto rango.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white print:text-black mb-4">C. Análisis de Comunicación Oral</h3>
              <p className="text-sm text-slate-400 print:text-slate-700 leading-relaxed">
                Detección automática de "filler words" (muletillas). El sistema analiza la frecuencia de pausas sonoras y evalúa el tono emocional para asegurar que el candidato proyecte confianza sin sonar arrogante.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: ESPECIFICACIONES TÉCNICAS */}
        <section className="space-y-8 page-break-before">
          <div className="flex items-center gap-4">
             <span className="w-10 h-10 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center font-bold">04</span>
             <h2 className="text-3xl font-bold text-white print:text-black tracking-tight">Especificaciones del Sistema</h2>
          </div>
          <div className="p-12 border border-white/10 rounded-[3rem] bg-slate-900/50 print:bg-transparent print:border-slate-200">
             <ul className="space-y-6 text-sm">
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">Persistencia:</span>
                  <span className="text-slate-400 print:text-slate-700">Arquitectura híbrida. Utiliza Supabase (PostgreSQL) para cuentas reales y LocalStorage con un motor de Mocking para demostraciones offline.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">Seguridad:</span>
                  <span className="text-slate-400 print:text-slate-700">Manejo de variables de entorno seguras inyectadas vía Vite/Vercel. Encriptación de audio en tránsito.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">UI Framework:</span>
                  <span className="text-slate-400 print:text-slate-700">Tailwind CSS con enfoque en "Glassmorphism" y diseño responsivo para móviles de alta gama.</span>
                </li>
             </ul>
          </div>
        </section>
      </article>

      <footer className="mt-32 pt-10 border-t border-white/5 text-center opacity-40 print:opacity-100">
         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mb-2">EntrevistIA Elite - Documento de Referencia Técnica</p>
         <p className="text-[8px] text-slate-600">© 2025 Professional AI Coaching Division</p>
      </footer>
    </div>
  );
};

export default DocumentationView;
