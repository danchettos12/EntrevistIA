
import React, { useState } from 'react';
import { SessionConfig } from '../types.ts';
import { DEFAULT_CONFIG } from '../constants.ts';

interface SetupFormProps {
  initialRole?: string;
  onStart: (config: SessionConfig) => void;
  onBack: () => void;
}

const PRESETS = [
  { 
    id: 'swe', 
    role: 'Desarrollador de Software', 
    pressure: 60, 
    focus: 40, 
    icon: 'ph-code', 
    label: 'Tecnología',
    desc: 'Lógica y procesos'
  },
  { 
    id: 'pm', 
    role: 'Gestor de Proyectos', 
    pressure: 50, 
    focus: 80, 
    icon: 'ph-kanban', 
    label: 'Gestión',
    desc: 'Equipos y plazos'
  },
  { 
    id: 'mkt', 
    role: 'Marketing', 
    pressure: 40, 
    focus: 70, 
    icon: 'ph-megaphone', 
    label: 'Estrategia',
    desc: 'Comunicación'
  },
  { 
    id: 'sales', 
    role: 'Ventas', 
    pressure: 70, 
    focus: 60, 
    icon: 'ph-chart-line-up', 
    label: 'Comercial',
    desc: 'Negociación'
  },
  { 
    id: 'data', 
    role: 'Analista de Datos', 
    pressure: 55, 
    focus: 30, 
    icon: 'ph-database', 
    label: 'Análisis',
    desc: 'Datos y hallazgos'
  }
];

const QUESTION_OPTIONS = [3, 5, 8, 10];
const TIME_OPTIONS = [
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '3 min', value: 180 },
  { label: '5 min', value: 300 }
];

const SetupForm: React.FC<SetupFormProps> = ({ initialRole, onStart, onBack }) => {
  const [config, setConfig] = useState<SessionConfig>({
      ...DEFAULT_CONFIG,
      role: initialRole || DEFAULT_CONFIG.role
  });

  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.id);
    setConfig({
      ...config,
      role: preset.role,
      pressure: preset.pressure,
      focus: preset.focus
    });
  };

  return (
    <div className="max-w-4xl mx-auto glass rounded-[2rem] border border-white/10 overflow-hidden animate-fadeIn shadow-2xl">
      <div className="bg-slate-800/40 p-8 text-white border-b border-white/5">
        <h2 className="text-xl font-bold uppercase tracking-widest">Configura tu práctica</h2>
        <p className="text-slate-400 mt-1 text-[10px] font-bold uppercase tracking-widest">Personaliza la sesión según tus objetivos actuales.</p>
      </div>
      
      <div className="p-10 space-y-10">
        {/* Presets */}
        <div className="space-y-4">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selecciona un área de interés</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group ${
                  activePreset === p.id 
                    ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/40' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  activePreset === p.id ? 'bg-white text-blue-600' : 'bg-white/5 text-slate-400 group-hover:text-white'
                }`}>
                  <i className={`ph-bold ${p.icon} text-xl`}></i>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${activePreset === p.id ? 'text-white' : 'text-slate-400'}`}>
                  {p.label}
                </span>
                <span className={`text-[8px] opacity-60 text-center leading-tight ${activePreset === p.id ? 'text-blue-100' : 'text-slate-500'}`}>
                  {p.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/5"></div>

        {/* Role Input */}
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">¿Para qué puesto te estás preparando?</label>
          <div className="relative">
            <input 
              type="text" 
              value={config.role}
              onChange={(e) => {
                setConfig({...config, role: e.target.value});
                setActivePreset(null);
              }}
              className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500/50 text-white outline-none transition-all font-medium text-lg placeholder:text-slate-700"
              placeholder="Ej: Administrador, Desarrollador, etc."
            />
          </div>
        </div>

        {/* Count and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cantidad de Preguntas</label>
            <div className="flex gap-2">
              {QUESTION_OPTIONS.map((num) => (
                <button
                  key={num}
                  onClick={() => setConfig({ ...config, questionCount: num })}
                  className={`flex-1 py-3 rounded-xl border transition-all font-bold text-xs ${
                    config.questionCount === num 
                      ? 'bg-blue-600 border-blue-400 text-white' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tiempo por Respuesta</label>
            <div className="flex gap-2">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setConfig({ ...config, timeLimit: opt.value })}
                  className={`flex-1 py-3 rounded-xl border transition-all font-bold text-[10px] uppercase tracking-tighter ${
                    config.timeLimit === opt.value 
                      ? 'bg-blue-600 border-blue-400 text-white' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nivel de Desafío</label>
                <span className="text-[9px] text-slate-600 uppercase font-medium">Complejidad de las preguntas</span>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${config.pressure > 70 ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {config.pressure}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={config.pressure}
              onChange={(e) => {
                setConfig({...config, pressure: parseInt(e.target.value)});
                setActivePreset(null);
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enfoque de la IA</label>
                <span className="text-[9px] text-slate-600 uppercase font-medium">Prioridad en habilidades blandas (STAR)</span>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                {config.focus}% STAR
              </span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={config.focus}
              onChange={(e) => {
                setConfig({...config, focus: parseInt(e.target.value)});
                setActivePreset(null);
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 pt-8 border-t border-white/5">
          <button 
            onClick={onBack}
            className="flex-1 px-8 py-5 rounded-2xl text-slate-500 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest border border-transparent hover:border-white/5"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onStart(config)}
            className="flex-[2] px-8 py-5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-2xl shadow-blue-900/40 transition-all uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3"
          >
            Comenzar Sesión
            <i className="ph-bold ph-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
