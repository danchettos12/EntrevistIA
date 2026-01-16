
import React, { useState } from 'react';
import { SessionConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

interface SetupFormProps {
  initialRole?: string;
  onStart: (config: SessionConfig) => void;
  onBack: () => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ initialRole, onStart, onBack }) => {
  const [config, setConfig] = useState<SessionConfig>({
      ...DEFAULT_CONFIG,
      role: initialRole || DEFAULT_CONFIG.role
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')} min`;
  };

  return (
    <div className="max-w-2xl mx-auto glass rounded-3xl border border-white/10 overflow-hidden animate-slideUp shadow-2xl">
      <div className="bg-slate-800 p-8 text-white">
        <h2 className="text-xl font-bold uppercase tracking-widest italic">Parámetros de Evaluación</h2>
        <p className="text-slate-400 mt-1 text-xs font-medium uppercase tracking-widest">Defina el rigor de la simulación profesional.</p>
      </div>
      
      <div className="p-10 space-y-8">
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cargo u Objetivo Profesional</label>
          <input 
            type="text" 
            value={config.role}
            onChange={(e) => setConfig({...config, role: e.target.value})}
            className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 text-white outline-none transition-all font-medium text-sm"
            placeholder="Ej: Gerente de Proyectos, Senior Software Engineer..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Número de Reactivos</label>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 rounded text-blue-400">
                {config.questionCount} ítems
              </span>
            </div>
            <input 
              type="range" 
              min="1" max="10" 
              value={config.questionCount}
              onChange={(e) => setConfig({...config, questionCount: parseInt(e.target.value)})}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tiempo de Respuesta</label>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 rounded text-slate-400">
                {formatTime(config.timeLimit)}
              </span>
            </div>
            <input 
              type="range" 
              min="30" max="300" step="30"
              value={config.timeLimit}
              onChange={(e) => setConfig({...config, timeLimit: parseInt(e.target.value)})}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rigor del Entrevistador</label>
              <span className="text-[10px] font-bold text-blue-400">{config.pressure}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={config.pressure}
              onChange={(e) => setConfig({...config, pressure: parseInt(e.target.value)})}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enfoque de Análisis</label>
              <span className="text-[10px] font-bold text-emerald-400">{config.focus}% Técnico</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={config.focus}
              onChange={(e) => setConfig({...config, focus: parseInt(e.target.value)})}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-8">
          <button 
            onClick={onBack}
            className="flex-1 px-6 py-4 rounded-xl text-slate-500 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onStart(config)}
            className="flex-[2] px-6 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-xl transition-all uppercase text-[10px] tracking-widest"
          >
            Iniciar Sesión Profesional
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
