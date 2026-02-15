
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
  const [results, setResults] = useState<QuestionFeedback[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  
  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const questionsDone = useRef<string[]>([]);
  const transcriptionPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    loadNextQuestion();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopRecording();
    };
  }, []);

  const loadNextQuestion = async () => {
    setLoading(true);
    try {
      const q = await generateInterviewQuestion(config, questionsDone.current);
      setQuestion(q);
      questionsDone.current.push(q);
      setTimeLeft(config.timeLimit);
      startTimer();
    } finally {
      setLoading(false);
    }
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
    const transcriptionPromise = (async () => {
      try {
        const arrayBuffer = await blob.arrayBuffer();
        const base64Audio = encodeToBase64(arrayBuffer);
        const transcription = await transcribeAudio(base64Audio, blob.type || 'audio/webm');
        if (transcription) {
          setResponse(prev => prev + (prev ? " " : "") + transcription);
        }
      } catch (err) {
        console.error("Error en procesamiento de audio:", err);
      } finally {
        setTranscribing(false);
      }
    })();
    transcriptionPromiseRef.current = transcriptionPromise;
    return transcriptionPromise;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Se requiere acceso al micrófono para realizar la entrevista profesional.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleNext = async () => {
    if (processing) return;
    
    setProcessing(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Si estaba grabando, detenemos y esperamos la transcripción
    if (isRecording) {
      stopRecording();
    }

    // Esperamos a que cualquier transcripción pendiente termine
    if (transcriptionPromiseRef.current) {
      await transcriptionPromiseRef.current;
    }

    try {
      const finalResponse = response.trim() || "El candidato no proporcionó una respuesta verbal.";
      const feedback = await analyzeQuestionResponse(question, finalResponse, config);
      const updatedResults = [...results, feedback];
      setResults(updatedResults);

      if (currentIdx + 1 < config.questionCount) {
        setCurrentIdx(currentIdx + 1);
        setResponse("");
        transcriptionPromiseRef.current = null;
        loadNextQuestion();
      } else {
        const summary = await generateSessionSummary(updatedResults, config);
        const record: SessionRecord = {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          timestamp: Date.now(),
          config,
          questions: updatedResults,
          ...summary
        };
        onFinish(record);
      }
    } catch (err) {
      console.error("Error procesando respuesta:", err);
      // Fallback simple para no bloquear la app
      if (currentIdx + 1 < config.questionCount) {
         setCurrentIdx(currentIdx + 1);
         setResponse("");
         loadNextQuestion();
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading || processing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 animate-pulse">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="ph-bold ph-lightning text-blue-500 text-xl"></i>
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-white font-bold uppercase tracking-[0.3em] text-xs">
            {processing ? 'Analizando Competencias...' : 'Sincronizando Entrevistador...'}
          </p>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">Esto puede tardar unos segundos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 animate-fadeIn">
      <div className="flex justify-between items-center px-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Fase de Evaluación Conductual
          </span>
          <span className="text-white font-bold text-sm">
            Pregunta {currentIdx + 1} de {config.questionCount}
          </span>
        </div>
        <div className={`px-5 py-2 rounded-xl border-2 font-mono text-sm transition-all shadow-lg flex items-center gap-3 ${timeLeft < 20 ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse' : 'bg-white/5 border-white/10 text-slate-400'}`}>
          <i className="ph-bold ph-timer"></i>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="glass p-12 rounded-[2.5rem] border-l-8 border-blue-600 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <i className="ph-bold ph-quotes text-8xl text-white"></i>
        </div>
        <h2 className="text-3xl font-bold text-white leading-tight relative z-10">{question}</h2>
      </div>

      <div className="relative">
        <textarea 
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full h-80 p-12 rounded-[2.5rem] glass border border-white/5 focus:border-blue-500/50 outline-none text-xl text-slate-200 resize-none transition-all shadow-inner placeholder:text-slate-700 font-light leading-relaxed"
          placeholder="Comience a hablar para transcribir su respuesta o escriba aquí directamente..."
        />
        
        {isRecording && (
          <div className="absolute top-12 right-12 flex gap-1.5 items-end h-10">
            {[1,2,3,4,5,6].map(i => (
              <div 
                key={i} 
                className="w-2 bg-blue-500 rounded-full animate-bounce" 
                style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.15}s`, animationDuration: '0.6s' }}
              ></div>
            ))}
          </div>
        )}

        <div className="absolute bottom-8 right-8 flex items-center gap-6">
          {transcribing && (
            <div className="flex items-center gap-3 px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full animate-pulse shadow-lg">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
               <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Procesando Voz...</span>
            </div>
          )}
          <button 
            onClick={() => isRecording ? stopRecording() : startRecording()}
            disabled={transcribing}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-2xl ${isRecording ? 'bg-red-600 text-white scale-110 shadow-red-900/40' : 'bg-white text-slate-900 hover:bg-slate-200 disabled:opacity-50'}`}
            title={isRecording ? "Detener grabación" : "Iniciar grabación de voz"}
          >
            <i className={`ph-bold ${isRecording ? 'ph-stop' : 'ph-microphone-stage'} text-3xl`}></i>
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button onClick={onCancel} className="px-8 py-5 rounded-2xl text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors">Abortar Sesión</button>
        <button 
          onClick={handleNext} 
          disabled={!response.trim() || transcribing || processing}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl shadow-blue-900/40 uppercase text-[10px] tracking-[0.2em] transition-all disabled:opacity-30 flex items-center gap-3 border border-blue-400/20"
        >
          {currentIdx + 1 === config.questionCount ? 'Finalizar Evaluación' : 'Siguiente Dimensión'}
          <i className="ph-bold ph-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;
