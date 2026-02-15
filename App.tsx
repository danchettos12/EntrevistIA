
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
    if (!supabase || !supabase.auth) {
      setIsLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (session?.user) {
        const loggedUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
          email: session.user.email!,
          preferredRole: session.user.user_metadata?.preferred_role || ''
        };
        setUser(loggedUser);
        setView(prev => (prev === AppView.AUTH || prev === AppView.LANDING) ? AppView.DASHBOARD : prev);
        fetchSessions(session.user.id);
      } else {
        setUser(null);
        setSessions([]);
        if (view !== AppView.LANDING && view !== AppView.AUTH && view !== AppView.DOCUMENTATION) {
          setView(AppView.LANDING);
        }
      }
      setIsLoading(false);
    });

    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [view]);

  const fetchSessions = async (userId: string) => {
    if (!supabase) return;
    try {
      const data = await getUserSessions(userId);
      setSessions(data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const handleLogout = async () => {
    if (supabase && supabase.auth) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setView(AppView.LANDING);
  };

  const handleFinishSession = async (record: SessionRecord) => {
    const { id: _tmpId, ...sessionData } = record;
    const saved = await saveSession(sessionData);
    
    if (saved) {
      setSessions([saved, ...sessions]);
      setActiveSession(saved);
      setView(AppView.FEEDBACK);
    } else {
      setActiveSession(record);
      setView(AppView.FEEDBACK);
    }
  };

  const handleViewSession = (record: SessionRecord) => {
    setActiveSession(record);
    setView(AppView.FEEDBACK);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Iniciando Sistemas...</span>
        </div>
      </div>
    );
  }

  const isMarketingView = view === AppView.LANDING || view === AppView.AUTH || view === AppView.DOCUMENTATION;
  const bgClass = isMarketingView ? 'mesh-bg' : 'dashboard-grid';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 ${bgClass}`}>
      {user && (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl print:hidden">
          <div className="glass px-6 py-3 rounded-xl flex items-center justify-between shadow-2xl border-white/5 relative overflow-hidden">
            {supabase?.isMock && (
              <div className="absolute top-0 left-0 h-0.5 w-full bg-amber-500 animate-pulse"></div>
            )}
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                <i className="ph-bold ph-briefcase"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tighter text-white uppercase leading-none">EntrevistIA</span>
                {supabase?.isMock && <span className="text-[7px] font-bold text-amber-500 uppercase tracking-widest mt-1">Modo Local</span>}
              </div>
            </div>
            
            <nav className="flex gap-6 items-center">
              <button onClick={() => setView(AppView.DASHBOARD)} className={`text-[10px] font-bold uppercase tracking-widest ${view === AppView.DASHBOARD ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>Panel</button>
              <button onClick={() => setView(AppView.DOCUMENTATION)} className={`text-[10px] font-bold uppercase tracking-widest ${view === AppView.DOCUMENTATION ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>Manual</button>
              <button onClick={handleLogout} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-400 transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/5">Cerrar Sesión</button>
            </nav>
          </div>
        </header>
      )}
      <main className={`flex-1 ${user && view !== AppView.DOCUMENTATION ? 'pt-32' : 'pt-0'} pb-20 px-4 max-w-7xl mx-auto w-full`}>
        {view === AppView.LANDING && <LandingView onGetStarted={() => { setAuthMode('register'); setView(AppView.AUTH); }} onLogin={() => { setAuthMode('login'); setView(AppView.AUTH); }} />}
        {view === AppView.AUTH && <AuthView initialMode={authMode} onBack={() => setView(AppView.LANDING)} />}
        {view === AppView.DASHBOARD && user && <Dashboard user={user} sessions={sessions} onStart={() => setView(AppView.SETUP)} onViewSession={handleViewSession} />}
        {view === AppView.SETUP && <SetupForm initialRole={user?.preferredRole} onStart={(c) => { setCurrentConfig(c); setView(AppView.INTERVIEW); }} onBack={() => setView(AppView.DASHBOARD)} />}
        {view === AppView.INTERVIEW && user && <InterviewSession config={currentConfig} userId={user.id} onFinish={handleFinishSession} onCancel={() => setView(AppView.DASHBOARD)} />}
        {view === AppView.FEEDBACK && activeSession && <FeedbackView session={activeSession} onClose={() => setView(AppView.DASHBOARD)} />}
        {view === AppView.DOCUMENTATION && <DocumentationView onBack={() => setView(user ? AppView.DASHBOARD : AppView.LANDING)} />}
      </main>
    </div>
  );
};

export default App;
