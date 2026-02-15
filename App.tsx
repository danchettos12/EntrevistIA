
import React, { useState, useEffect } from 'react';
import { AppView, SessionConfig, SessionRecord, User } from './types.ts';
import { DEFAULT_CONFIG } from './constants.ts';
import { supabase } from './lib/supabase.ts';
import { getUserSessions, saveSession } from './services/databaseService.ts';
import Dashboard from './components/Dashboard.tsx';
import SetupForm from './components/SetupForm.tsx';
import InterviewSession from './components/InterviewSession.tsx';
import FeedbackView from './components/FeedbackView.tsx';
import AuthView from './components/AuthView.tsx';
import LandingView from './components/LandingView.tsx';
import DocumentationView from './components/DocumentationView.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [currentConfig, setCurrentConfig] = useState<SessionConfig>(DEFAULT_CONFIG);
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
      if (session?.user) {
        const loggedUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
          email: session.user.email!,
          preferredRole: session.user.user_metadata?.preferred_role || ''
        };
        setUser(loggedUser);
        fetchSessions(session.user.id);
        
        setView(prev => {
          if (prev === AppView.AUTH || prev === AppView.LANDING) {
            return AppView.DASHBOARD;
          }
          return prev;
        });
      } else {
        setUser(null);
        setSessions([]);
        setView(prev => {
          if (prev !== AppView.LANDING && prev !== AppView.AUTH) {
            return AppView.LANDING;
          }
          return prev;
        });
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSessions = async (userId: string) => {
    try {
      const data = await getUserSessions(userId);
      setSessions(data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setView(AppView.LANDING);
    setIsLoading(false);
  };

  const handleFinishSession = async (record: SessionRecord) => {
    // Intentamos guardar en la base de datos/localstorage
    const saved = await saveSession(record);
    if (saved) {
      // Si se guardó, usamos el registro con ID real y lo añadimos al historial
      setSessions(prev => [saved, ...prev]);
      setActiveSession(saved);
    } else {
      // Fallback si falla el guardado, pero mostramos el feedback de la sesión actual
      setActiveSession(record);
    }
    setView(AppView.FEEDBACK);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Iniciando EntrevistIA...</span>
        </div>
      </div>
    );
  }

  const safeView = (!user && view !== AppView.LANDING && view !== AppView.AUTH) ? AppView.LANDING : view;

  return (
    <div className={`min-h-screen flex flex-col ${safeView === AppView.LANDING ? 'mesh-bg' : 'dashboard-grid'}`}>
      {user && safeView !== AppView.LANDING && safeView !== AppView.AUTH && (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
          <div className="glass px-6 py-3 rounded-xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                <i className="ph-bold ph-chats"></i>
              </div>
              <span className="text-lg font-bold tracking-tighter text-white uppercase">EntrevistIA</span>
            </div>
            <nav className="flex gap-6 items-center">
              <button onClick={() => setView(AppView.DASHBOARD)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Inicio</button>
              <button onClick={handleLogout} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-400 transition-colors">Salir</button>
            </nav>
          </div>
        </header>
      )}

      <main className={`flex-1 ${user && safeView !== AppView.LANDING ? 'pt-32' : ''} px-4 max-w-7xl mx-auto w-full`}>
        {safeView === AppView.LANDING && (
          <LandingView 
            onGetStarted={() => { setAuthMode('register'); setView(AppView.AUTH); }} 
            onLogin={() => { setAuthMode('login'); setView(AppView.AUTH); }} 
            onSkip={() => { setAuthMode('login'); setView(AppView.AUTH); }}
          />
        )}
        
        {safeView === AppView.AUTH && <AuthView initialMode={authMode} onBack={() => setView(AppView.LANDING)} />}
        
        {safeView === AppView.DASHBOARD && user && (
          <Dashboard 
            user={user} 
            sessions={sessions} 
            onStart={() => setView(AppView.SETUP)} 
            onViewSession={(s) => { setActiveSession(s); setView(AppView.FEEDBACK); }} 
          />
        )}
        
        {safeView === AppView.SETUP && <SetupForm initialRole={user?.preferredRole} onStart={(c) => { setCurrentConfig(c); setView(AppView.INTERVIEW); }} onBack={() => setView(AppView.DASHBOARD)} />}
        
        {safeView === AppView.INTERVIEW && user && <InterviewSession config={currentConfig} userId={user.id} onFinish={handleFinishSession} onCancel={() => setView(AppView.DASHBOARD)} />}
        
        {safeView === AppView.FEEDBACK && activeSession && <FeedbackView session={activeSession} onClose={() => setView(AppView.DASHBOARD)} />}
        
        {safeView === AppView.DOCUMENTATION && <DocumentationView onBack={() => setView(AppView.DASHBOARD)} />}
      </main>
    </div>
  );
};

export default App;
