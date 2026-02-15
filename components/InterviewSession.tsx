
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
    setQuestion("Cuéntame sobre una situación donde tuviste que resolver un problema bajo presión.");
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
    const promise = (async () => {
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
        transcriptionPromiseRef.current = null;
      }
    })();
    
    transcriptionPromiseRef.current = promise;
    return promise;
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
      alert("No se pudo acceder al micrófono.");
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

    if (transcriptionPromiseRef.current) {
      try {
        await transcriptionPromiseRef.current;
      } catch (e) {
        console.warn("Transcription error ignored to continue flow");
      }
    }

    try {
      const finalRes = response.trim() || "El usuario no proporcionó una respuesta detallada.";
      const feedback = await analyzeQuestionResponse(question, finalRes, config);
      const updatedResults = [...results, feedback];
      setResults(updatedResults);

      if (currentIdx + 1 < config.questionCount) {
        setResponse("");
        setCurrentIdx(prev => prev + 1);
        setProcessing(false);
      } else {
        // En la última pregunta, generamos el resumen
        try {
          const summary = await generateSessionSummary(updatedResults, config);
          onFinish({
            id: 'session_' + Date.now(),
            userId,
            timestamp: Date.now(),
            config,
            questions: updatedResults,
            ...summary
          });
        } catch (summaryErr) {
          console.error("Final summary error, finishing anyway:", summaryErr);
          // Fallback manual si falla todo
          onFinish({
            id: 'session_' + Date.now(),
            userId,
            timestamp: Date.now(),
            config,
            questions: updatedResults,
            overallScore: 70,
            overallSummary: "Sesión completada satisfactoriamente. Revisa el análisis STAR de cada pregunta.",
            fillerWordAnalysis: "Análisis de oratoria no disponible para esta sesión.",
            mistakes: ["No se pudieron extraer errores críticos automáticamente."],
            improvementPlan: ["Sigue practicando con el método STAR.", "Mejora la estructura de tus respuestas."]
          });
        }
      }
    } catch (err) {
      console.error("Error crítico en handleNext:", err);
      // Si falla todo, al menos cerramos la sesión para no quedar atrapados
      onCancel();
    }
  };

  if (loading || processing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-fadeIn text-center px-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="space-y-3">
          <h2 className="text-white font-bold uppercase tracking-widest text-[10px]">
            {processing ? 'Analizando tu desempeño...' : 'Preparando la pregunta...'}
          </h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">
            {processing ? 'Generando métricas de oratoria y estructura STAR.' : 'Personalizando la experiencia según tu perfil.'}
          </p>
        </div>
        {!processing && loading && showForceBtn && (
          <button 
            onClick={forceStart}
            className="mt-4 px-6 py-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            ¿Tarda demasiado? Iniciar pregunta fija
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 animate-fadeIn px-4">
      <div className="flex justify-between items-center px-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sesión de práctica</span>
          <span className="text-white font-bold text-sm">Pregunta {currentIdx + 1} de {config.questionCount}</span>
        </div>
        <div className={`px-4 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 transition-colors ${timeLeft < 20 ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
          <i className="ph ph-clock"></i> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="glass p-10 rounded-[2rem] border-l-4 border-blue-500 shadow-2xl">
        <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">{question}</h2>
      </div>

      <div className="relative group">
        <textarea 
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full h-72 p-10 rounded-[2rem] glass border border-white/5 outline-none text-lg text-slate-200 resize-none placeholder:text-slate-800 transition-all focus:border-blue-500/20"
          placeholder="Escribe tu respuesta o usa el micrófono para hablar..."
        />
        
        <div className="absolute bottom-6 right-6 flex items-center gap-4">
          {transcribing && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">Escuchando...</span>}
          <button 
            onClick={() => isRecording ? stopRecording() : startRecording()}
            disabled={transcribing}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-white text-slate-900 hover:scale-105'}`}
          >
            <i className={`ph-bold ${isRecording ? 'ph-stop' : 'ph-microphone'} text-2xl`}></i>
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-end items-center">
        <button onClick={onCancel} className="px-6 py-4 rounded-xl text-slate-500 font-bold hover:text-white uppercase text-[10px] tracking-widest transition-colors">Cancelar</button>
        <button 
          onClick={handleNext} 
          disabled={!response.trim() || transcribing || processing} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl uppercase text-[10px] tracking-[0.2em] transition-all disabled:opacity-20 shadow-lg"
        >
          {currentIdx + 1 === config.questionCount ? 'Finalizar práctica' : 'Siguiente pregunta'}
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;
