
import React, { useState, useEffect, useRef } from 'react';
import { SessionConfig, QuestionFeedback, SessionRecord } from '../types.ts';
import { generateInterviewQuestion, analyzeQuestionResponse, generateSessionSummary, transcribeAudio } from '../services/geminiService.ts';

interface InterviewSessionProps {
  config: SessionConfig;
  userId: string;
  onFinish: (record: SessionRecord) => void;
  onCancel: () => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ config, userId, onFinish, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [showForceBtn, setShowForceBtn] = useState(false);
  const [results, setResults] = useState<QuestionFeedback[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  
  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const questionsDone = useRef<string[]>([]);
  const transcriptionPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setShowForceBtn(false);
      try {
        const q = await generateInterviewQuestion(config, questionsDone.current);
        if (isMounted) {
          setQuestion(q);
          questionsDone.current.push(q);
          setTimeLeft(config.timeLimit);
          setLoading(false);
          startTimer();
        }
      } catch (err) {
        console.error("Error cargando pregunta:", err);
        if (isMounted) forceStart();
      }
    };

    load();

    const forceTimer = setTimeout(() => {
      if (isMounted && loading) setShowForceBtn(true);
    }, 4000);

    return () => {
      isMounted = false;
      clearTimeout(forceTimer);
      if (timerRef.current) clearInterval(timerRef.current);
      stopRecording();
    };
  }, [currentIdx]);

  const forceStart = () => {
    setQuestion("Cuéntame sobre un desafío importante que hayas enfrentado en tu carrera.");
    setLoading(false);
    setShowForceBtn(false);
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0) {
          handleNext();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const encodeToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleTranscription = async (blob: Blob) => {
    setTranscribing(true);
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const base64Audio = encodeToBase64(arrayBuffer);
      const transcription = await transcribeAudio(base64Audio, blob.type || 'audio/webm');
      if (transcription) {
        setResponse(prev => prev + (prev ? " " : "") + transcription);
      }
    } catch (err) {
      console.error("Error en transcripción:", err);
    } finally {
      setTranscribing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => e.data.size > 0 && audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Error al acceder al micrófono. Por favor, revisa los permisos.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleNext = async () => {
    if (processing) return;
    setProcessing(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (isRecording) stopRecording();

    try {
      const finalRes = response.trim() || "Respuesta breve del candidato.";
      const feedback = await analyzeQuestionResponse(question, finalRes, config);
      const updatedResults = [...results, feedback];
      setResults(updatedResults);

      if (currentIdx + 1 < config.questionCount) {
        setResponse("");
        setCurrentIdx(prev => prev + 1);
      } else {
        const summary = await generateSessionSummary(updatedResults, config);
        onFinish({
          id: 'session_' + Date.now(),
          userId,
          timestamp: Date.now(),
          config,
          questions: updatedResults,
          ...summary
        });
      }
    } catch (err) {
      console.error("Error en handleNext:", err);
      onCancel();
    } finally {
      setProcessing(false);
    }
  };

  if (loading || processing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-fadeIn text-center px-4">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full"></div>
          <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <i className="ph-bold ph-brain text-4xl text-blue-500 animate-pulse"></i>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-white font-bold uppercase tracking-[0.4em] text-xs">
            {processing ? 'Sincronizando con Gemini Pro...' : 'Preparando Escenario IA...'}
          </h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest max-w-sm">
            {processing ? 'Analizando estructura STAR y coherencia narrativa.' : 'Generando pregunta personalizada según tu perfil profesional.'}
          </p>
          {showForceBtn && (
            <button 
              onClick={forceStart}
              className="mt-8 px-8 py-4 bg-white/5 border border-white/10 text-blue-400 hover:text-white hover:bg-white/10 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all shadow-xl"
            >
              ¿La red está lenta? Forzar inicio manual
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 animate-fadeIn px-4">
      <div className="flex justify-between items-center px-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Módulo de Simulación</span>
          <span className="text-white font-bold text-sm">Pregunta {currentIdx + 1} de {config.questionCount}</span>
        </div>
        <div className={`px-5 py-2 rounded-xl border-2 font-mono text-sm flex items-center gap-3 transition-colors ${timeLeft < 20 ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
          <i className="ph-bold ph-timer"></i> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="glass p-12 rounded-[2.5rem] border-l-8 border-blue-600 shadow-2xl">
        <h2 className="text-2xl font-bold text-white leading-tight">{question}</h2>
      </div>

      <div className="relative group">
        <textarea 
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full h-80 p-12 rounded-[2.5rem] glass border border-white/5 outline-none text-xl text-slate-200 resize-none placeholder:text-slate-800 transition-all focus:border-blue-500/30"
          placeholder="Comienza a hablar o escribe tu respuesta aquí..."
        />
        
        <div className="absolute bottom-8 right-8 flex items-center gap-6">
          {transcribing && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">Procesando Voz...</span>}
          <button 
            onClick={() => isRecording ? stopRecording() : startRecording()}
            disabled={transcribing}
            title={isRecording ? "Detener grabación" : "Grabar respuesta"}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-2xl ${isRecording ? 'bg-red-600 text-white scale-110' : 'bg-white text-slate-900 hover:scale-105'}`}
          >
            <i className={`ph-bold ${isRecording ? 'ph-stop' : 'ph-microphone-stage'} text-3xl`}></i>
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-end items-center">
        <button onClick={onCancel} className="px-8 py-5 rounded-2xl text-slate-500 font-bold hover:text-red-400 uppercase text-[10px] tracking-widest transition-colors">Cancelar</button>
        <button 
          onClick={handleNext} 
          disabled={!response.trim() || transcribing || processing} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-12 rounded-2xl uppercase text-[10px] tracking-[0.2em] transition-all disabled:opacity-20 shadow-xl shadow-blue-900/20"
        >
          {currentIdx + 1 === config.questionCount ? 'Finalizar y Analizar' : 'Siguiente Pregunta'}
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;
