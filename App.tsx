
import React, { useState, useEffect } from 'react';
import { AppView, SessionConfig, SessionRecord, User } from './types';
import { DEFAULT_CONFIG } from './constants';
import { supabase } from './lib/supabase';
import { getUserSessions, saveSession } from './services/databaseService';
import Dashboard from './components/Dashboard';
import SetupForm from './components/SetupForm';
import InterviewSession from './components/InterviewSession';
import FeedbackView from './components/FeedbackView';
import AuthView from './components/AuthView';
import LandingView from './components/LandingView';

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
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Usuario',
          email: session.user.email!,
          preferredRole: session.user.user_metadata.preferred_role || ''
        };
        setUser(loggedUser);
        setView(prev => (prev === AppView.AUTH || prev === AppView.LANDING) ? AppView.DASHBOARD : prev);
        fetchSessions(session.user.id);
      } else {
        setUser(null);
        setSessions([]);
        if (view !== AppView.LANDING && view !== AppView.AUTH) setView(AppView.LANDING);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [view]);

  const fetchSessions = async (userId: string) => {
    if (!supabase) return;
    const data = await getUserSessions(userId);
    setSessions(data);
  };

  const handleLogout = async () => {
    if (supabase && supabase.auth) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setView(AppView.LANDING);
  };

  const handleFinishSession = async (record: Omit<SessionRecord, 'id'>) => {
    const saved = await saveSession(record);
    if (saved) {
      setSessions([saved, ...sessions]);
      setActiveSession(saved);
      setView(AppView.FEEDBACK);
    } else {
      // Fallback visual en caso de error de red, aunque se recomienda persistencia real
      const fallbackRecord: SessionRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
      setActiveSession(fallbackRecord);
      setView(AppView.FEEDBACK);
    }
  };

  const handleViewSession = (record: SessionRecord) => {
    setActiveSession(record);
    setView(AppView.FEEDBACK);
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setView(AppView.AUTH);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isMarketingView = view === AppView.LANDING || view === AppView.AUTH;
  const bgClass = isMarketingView ? 'mesh-bg' : 'dashboard-grid';

  const renderView = () => {
    switch (view) {
      case AppView.LANDING:
        return <LandingView onGetStarted={() => openAuth('register')} onLogin={() => openAuth('login')} />;
      case AppView.AUTH:
        return <AuthView initialMode={authMode} onBack={() => setView(AppView.LANDING)} />;
      case AppView.DASHBOARD:
        return <Dashboard user={user!} sessions={sessions} onStart={() => setView(AppView.SETUP)} onViewSession={handleViewSession} />;
      case AppView.SETUP:
        return <SetupForm initialRole={user?.preferredRole} onStart={(c) => { setCurrentConfig(c); setView(AppView.INTERVIEW); }} onBack={() => setView(AppView.DASHBOARD)} />;
      case AppView.INTERVIEW:
        return <InterviewSession config={currentConfig} userId={user!.id} onFinish={handleFinishSession} onCancel={() => setView(AppView.DASHBOARD)} />;
      case AppView.FEEDBACK:
        return <FeedbackView session={activeSession!} onClose={() => setView(AppView.DASHBOARD)} />;
      default:
        return <LandingView onGetStarted={() => openAuth('register')} onLogin={() => openAuth('login')} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 ${bgClass}`}>
      {user && (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
          <div className="glass px-6 py-3 rounded-xl flex items-center justify-between shadow-2xl border-white/5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                <i className="ph-bold ph-briefcase"></i>
              </div>
              <span className="text-lg font-bold tracking-tighter text-white uppercase">EntrevistIA</span>
            </div>
            <nav className="flex gap-6 items-center">
              <button onClick={() => setView(AppView.DASHBOARD)} className={`text-[10px] font-bold uppercase tracking-widest ${view === AppView.DASHBOARD ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>Panel</button>
              <button onClick={handleLogout} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-400 transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/5">Cerrar Sesión</button>
            </nav>
          </div>
        </header>
      )}
      <main className={`flex-1 ${user ? 'pt-32' : 'pt-0'} pb-20 px-4 max-w-7xl mx-auto w-full`}>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
