
import React, { useState, useEffect } from 'react';
import { AppView, SessionConfig, SessionRecord, User } from './types';
import { DEFAULT_CONFIG, STORAGE_KEY } from './constants';
import Dashboard from './components/Dashboard';
import SetupForm from './components/SetupForm';
import InterviewSession from './components/InterviewSession';
import FeedbackView from './components/FeedbackView';
import AuthView from './components/AuthView';
import LandingView from './components/LandingView';

const CURRENT_USER_KEY = 'entrevistia_current_user';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [currentConfig, setCurrentConfig] = useState<SessionConfig>(DEFAULT_CONFIG);
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setView(AppView.DASHBOARD);
      loadSessions(parsedUser.id);
    }
  }, []);

  const loadSessions = (userId: string) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const allSessions: SessionRecord[] = JSON.parse(saved);
        setSessions(allSessions.filter(s => s.userId === userId));
      } catch (e) {
        console.error("Error cargando sesiones", e);
      }
    }
  };

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedUser));
    loadSessions(loggedUser.id);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    setSessions([]);
    setView(AppView.LANDING);
  };

  const handleFinishSession = (record: SessionRecord) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let allSessions: SessionRecord[] = saved ? JSON.parse(saved) : [];
    const updatedAll = [record, ...allSessions];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
    setSessions([record, ...sessions]);
    setActiveSession(record);
    setView(AppView.FEEDBACK);
  };

  const handleViewSession = (record: SessionRecord) => {
    setActiveSession(record);
    setView(AppView.FEEDBACK);
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setView(AppView.AUTH);
  };

  const renderView = () => {
    // Si no hay usuario, solo permitir Landing o Auth
    if (!user && view !== AppView.LANDING && view !== AppView.AUTH) {
        setView(AppView.LANDING);
        return null;
    }

    switch (view) {
      case AppView.LANDING:
        return <LandingView onGetStarted={() => openAuth('register')} onLogin={() => openAuth('login')} />;
      case AppView.AUTH:
        return <AuthView initialMode={authMode} onAuthSuccess={handleAuthSuccess} onBack={() => setView(AppView.LANDING)} />;
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
    <div className="min-h-screen flex flex-col">
      {user && (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-5xl">
          <div className="glass px-6 py-4 rounded-2xl flex items-center justify-between shadow-2xl border-white/5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                <i className="ph-bold ph-lightning"></i>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white uppercase italic">EntrevistIA</span>
            </div>
            <nav className="flex gap-4 items-center">
              <button onClick={handleLogout} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-400 transition-colors">Cerrar Sesión</button>
            </nav>
          </div>
        </header>
      )}
      <main className={`flex-1 ${user ? 'pt-32' : 'pt-10'} pb-20 px-4 max-w-7xl mx-auto w-full`}>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
