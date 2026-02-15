
import React from 'react';

interface DocumentationViewProps {
  onBack: () => void;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 animate-fadeIn print:bg-white print:text-black">
      {/* Cabecera de Documento */}
      <div className="flex justify-between items-center border-b border-white/10 pb-8 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
        >
          <i className="ph ph-arrow-left"></i> Volver al Panel
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-xl"
        >
          <i className="ph ph-file-pdf"></i> Exportar a PDF
        </button>
      </div>

      {/* Portada del Manual */}
      <header className="text-center space-y-6 pt-10">
        <div className="inline-flex w-24 h-24 bg-blue-600 rounded-[2rem] items-center justify-center text-white text-5xl font-bold mb-4 shadow-2xl">
          <i className="ph ph-briefcase"></i>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white print:text-black">
          ENTREVIST<span className="text-blue-500">IA</span> ELITE
        </h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.5em] print:text-slate-600">
          Manual Completo del Sistema v1.0
        </p>
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-8"></div>
      </header>

      {/* Sección 1: Visión General */}
      <section className="glass p-12 rounded-[2.5rem] space-y-8 print:bg-transparent print:border-none print:shadow-none">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white print:text-black uppercase tracking-tight">1. Propósito de la Plataforma</h2>
          <p className="text-slate-300 print:text-slate-800 leading-relaxed text-lg">
            EntrevistIA es una herramienta de Inteligencia Artificial Generativa diseñada para elevar la competencia comunicativa de profesionales de nivel medio y senior. Utiliza el modelo <strong>Gemini 3 Pro</strong> para simular escenarios de alta presión, proporcionando una retroalimentación inmediata basada en estándares corporativos internacionales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 print:bg-slate-50 print:border-slate-200">
            <h3 className="font-bold text-blue-400 uppercase text-[10px] tracking-widest mb-4">Especialidad Principal</h3>
            <p className="text-sm text-slate-400 print:text-slate-700 leading-relaxed">
              Análisis estructural de respuestas conductuales mediante la metodología STAR (Situación, Tarea, Acción, Resultado), garantizando que el usuario demuestre impacto tangible.
            </p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 print:bg-slate-50 print:border-slate-200">
            <h3 className="font-bold text-emerald-400 uppercase text-[10px] tracking-widest mb-4">Inteligencia de Datos</h3>
            <p className="text-sm text-slate-400 print:text-slate-700 leading-relaxed">
              Detección de "filler words" (muletillas), análisis de tono emocional y métricas de asertividad para optimizar la proyección de autoridad ejecutiva.
            </p>
          </div>
        </div>
      </section>

      {/* Sección 2: Funciones Técnicas */}
      <section className="space-y-10 px-4">
        <h2 className="text-xl font-bold text-slate-500 uppercase tracking-[0.3em] text-center">Funciones y Capacidades</h2>
        
        <div className="space-y-12">
          {/* Función 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
               <i className="ph ph-microphone-stage"></i>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white print:text-black">Simulación de Voz en Tiempo Real</h3>
              <p className="text-slate-400 print:text-slate-700 text-sm leading-relaxed">
                El sistema integra un módulo de transcripción automática. El usuario puede hablar directamente a su micrófono; la IA procesa el audio, lo transcribe y lo analiza para buscar vicios de lenguaje o pausas sonoras innecesarias.
              </p>
            </div>
          </div>

          {/* Función 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
               <i className="ph ph-magic-wand"></i>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white print:text-black">Modo Espejo (Optimización de Narrativa)</h3>
              <p className="text-slate-400 print:text-slate-700 text-sm leading-relaxed">
                Esta es la función estrella: La IA toma la respuesta original del usuario (a veces desordenada o informal) y la reescribe completamente. Crea una versión "ideal" que suena como un director de alto rango, manteniendo la veracidad de los hechos del usuario.
              </p>
            </div>
          </div>

          {/* Función 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
               <i className="ph ph-gauge"></i>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white print:text-black">Niveles de Rigor Personalizables</h3>
              <p className="text-slate-400 print:text-slate-700 text-sm leading-relaxed">
                Antes de cada sesión, el usuario ajusta la "Presión del Entrevistador" y el "Enfoque Técnico". Esto cambia la personalidad de la IA: de un mentor amable a un reclutador implacable de Wall Street o Silicon Valley.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Arquitectura y Requisitos */}
      <section className="p-12 border border-white/10 rounded-[2.5rem] bg-slate-900/50 print:bg-transparent">
        <h2 className="text-2xl font-bold text-white print:text-black mb-8">Especificaciones Técnicas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="space-y-4">
             <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Motor de IA</h4>
             <ul className="text-sm text-slate-400 print:text-slate-700 space-y-2">
               <li>• Gemini 3 Pro (Razonamiento Complejo)</li>
               <li>• Gemini 3 Flash (Transcripción Veloz)</li>
               <li>• Análisis JSON Schema Validated</li>
             </ul>
          </div>
          <div className="space-y-4">
             <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Persistencia</h4>
             <ul className="text-sm text-slate-400 print:text-slate-700 space-y-2">
               <li>• Supabase Auth (Cuentas Reales)</li>
               <li>• PostgreSQL (Historial de Sesiones)</li>
               <li>• Encriptación AES-256 en tránsito</li>
             </ul>
          </div>
        </div>

        {/* Advertencia de Configuración */}
        <div className="mt-12 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl print:hidden">
          <h4 className="text-red-400 font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
            <i className="ph ph-warning-octagon"></i> IMPORTANTE: Configuración de Producción
          </h4>
          <p className="text-xs text-red-300/80 leading-relaxed">
            Para que el sistema de cuentas funcione correctamente, es imperativo configurar las variables <code>SUPABASE_URL</code> y <code>SUPABASE_ANON_KEY</code> en el panel de Vercel. De lo contrario, el sistema mostrará un error de servidor.
          </p>
        </div>
      </section>

      <footer className="text-center py-10 opacity-30 print:opacity-100">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.5em]">
          ENTREVISTIA ELITE - DOCUMENTO CONFIDENCIAL DE ENTRENAMIENTO
        </p>
        <p className="text-[8px] mt-2">© 2025 AI Career Coaching Platform</p>
      </footer>
    </div>
  );
};

export default DocumentationView;
