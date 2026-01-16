
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
    <div className="max-w-2xl mx-auto glass rounded-[2.5rem] border border-white/10 overflow-hidden animate-slideUp">
      <div className="bg-blue-600 p-10 text-white relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <i className="ph ph-sliders text-6xl"></i>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Configuración de Sesión</h2>
        <p className="text-blue-100 opacity-80 mt-1 text-sm font-medium">Personaliza el rigor de tu simulación.</p>
      </div>
      
      <div className="p-10 space-y-8">
        {/* Role Input */}
        <div className="space-y-3">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Puesto o Cargo Objetivo</label>
          <input 
            type="text" 
            value={config.role}
            onChange={(e) => setConfig({...config, role: e.target.value})}
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 text-white outline-none transition-all font-medium"
            placeholder="Ej: Senior Frontend Engineer..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Question Count */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Preguntas</label>
              <span className="text-[10px] font-black px-3 py-1 bg-blue-500/10 rounded-full text-blue-400">
                {config.questionCount} {config.questionCount === 1 ? 'Pregunta' : 'Preguntas'}
              </span>
            </div>
            <input 
              type="range" 
              min="1" max="10" 
              value={config.questionCount}
              onChange={(e) => setConfig({...config, questionCount: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Time Limit */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Tiempo Límite</label>
              <span className="text-[10px] font-black px-3 py-1 bg-amber-500/10 rounded-full text-amber-400">
                {formatTime(config.timeLimit)}
              </span>
            </div>
            <input 
              type="range" 
              min="30" max="300" step="30"
              value={config.timeLimit}
              onChange={(e) => setConfig({...config, timeLimit: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Pressure & Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Presión IA</label>
              <span className="text-[9px] font-black text-blue-400">{config.pressure}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={config.pressure}
              onChange={(e) => setConfig({...config, pressure: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Enfoque Técnico vs STAR</label>
              <span className="text-[9px] font-black text-emerald-400">{config.focus}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={config.focus}
              onChange={(e) => setConfig({...config, focus: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button 
            onClick={onBack}
            className="flex-1 px-8 py-4 rounded-2xl text-slate-500 font-bold hover:text-white hover:bg-white/5 transition-all uppercase text-[10px] tracking-widest"
          >
            Volver
          </button>
          <button 
            onClick={() => onStart(config)}
            className="flex-[2] px-8 py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 shadow-2xl shadow-blue-600/20 transition-all uppercase text-[10px] tracking-[0.2em]"
          >
            Lanzar Sesión de Maestría
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
