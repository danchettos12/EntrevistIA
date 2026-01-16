
import React, { useState, useEffect, useRef } from 'react';
import { SessionConfig, QuestionFeedback, SessionRecord } from '../types';
import { generateInterviewQuestion, analyzeQuestionResponse, generateSessionSummary, transcribeAudio } from '../services/geminiService';

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

  useEffect(() => {
    loadNextQuestion();
    return () => clearInterval(timerRef.current);
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
      setTimeLeft(t => t > 0 ? t - 1 : 0);
    }, 1000);
  };

  const handleNext = async () => {
    if (!response.trim()) return;
    setProcessing(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (isRecording) await stopRecording();

    try {
      const feedback = await analyzeQuestionResponse(question, response, config);
      const updatedResults = [...results, feedback];
      setResults(updatedResults);

      if (currentIdx + 1 < config.questionCount) {
        setCurrentIdx(currentIdx + 1);
        setResponse("");
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
    } finally {
      setProcessing(false);
    }
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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Acceso al micrófono denegado.", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const transcription = await transcribeAudio(base64Audio, 'audio/webm');
        if (transcription) {
          setResponse(prev => prev + (prev ? " " : "") + transcription);
        }
      };
    } catch (err) {
      console.error("Error en procesamiento de audio.", err);
    } finally {
      setTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (loading || processing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <div className="w-12 h-12 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium uppercase tracking-[0.3em] text-[10px]">
          {processing ? 'Generando análisis de respuesta...' : 'Generando pregunta de entrevista...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 animate-fadeIn">
      <div className="flex justify-between items-center px-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Reactivo {currentIdx + 1} de {config.questionCount}
        </span>
        <div className={`px-4 py-1.5 rounded-lg border font-mono text-xs ${timeLeft < 20 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
          TIEMPO: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="glass p-12 rounded-3xl border-l-8 border-blue-600">
        <h2 className="text-2xl font-bold text-white leading-relaxed">{question}</h2>
      </div>

      <div className="relative">
        <textarea 
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full h-64 p-10 rounded-3xl glass border border-white/5 focus:border-blue-500 outline-none text-lg text-slate-300 resize-none transition-all"
          placeholder="Escriba o grabe su respuesta profesional..."
        />
        
        <div className="absolute bottom-6 right-6 flex items-center gap-4">
          {transcribing && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded-full animate-pulse">
               <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Procesando audio...</span>
            </div>
          )}
          <button 
            onClick={toggleRecording}
            disabled={transcribing}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-white text-slate-900 hover:bg-slate-200 disabled:opacity-50'}`}
          >
            <i className={`ph-bold ${isRecording ? 'ph-stop' : 'ph-microphone'} text-xl`}></i>
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button onClick={onCancel} className="px-6 py-4 rounded-xl text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-white">Abortar Evaluación</button>
        <button 
          onClick={handleNext} 
          disabled={!response.trim() || transcribing}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg uppercase text-[10px] tracking-widest transition-all disabled:opacity-50"
        >
          {currentIdx + 1 === config.questionCount ? 'Finalizar y Generar Reporte' : 'Enviar y Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;
