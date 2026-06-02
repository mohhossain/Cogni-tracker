import React, { useState, useEffect } from 'react';
import { LogEntry, CognitiveInsights, ScreenTimeLog } from './types';
import { LogEntryForm } from './components/LogEntryForm';
import { Timeline } from './components/Timeline';
import { InsightsView } from './components/InsightsView';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { ScreenTimeView } from './components/ScreenTimeView';
import { Activity, BrainCircuit, Home, PlusSquare, Zap, User, Smartphone } from 'lucide-react';
import { cn } from './utils';

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [screenTimeLogs, setScreenTimeLogs] = useState<ScreenTimeLog[]>([]);
  const [insights, setInsights] = useState<CognitiveInsights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'log_form' | 'timeline' | 'insights' | 'profile' | 'screen_time'>('home');
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // Load from locale storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('cognitiveProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsOnboarded(true);
    } else {
      setIsOnboarded(false);
    }

    const savedLogs = localStorage.getItem('cognitiveLogs');
    const savedInsights = localStorage.getItem('cognitiveInsights');
    const savedScreenTime = localStorage.getItem('cognitiveScreenTime');
    
    let loadedLogs: LogEntry[] = [];
    if (savedLogs) {
      try {
        loadedLogs = JSON.parse(savedLogs);
        setLogs(loadedLogs);
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }

    if (savedScreenTime) {
      try {
        setScreenTimeLogs(JSON.parse(savedScreenTime));
      } catch (e) {
        console.error("Failed to parse screen time", e);
      }
    }
    
    if (savedInsights && loadedLogs.length > 0) {
      try {
        setInsights(JSON.parse(savedInsights));
      } catch (e) {
        console.error("Failed to parse insights", e);
      }
    } else if (loadedLogs.length === 0) {
      localStorage.removeItem('cognitiveInsights');
    }
  }, []);

  // Save to locale storage on change
  useEffect(() => {
    localStorage.setItem('cognitiveLogs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('cognitiveScreenTime', JSON.stringify(screenTimeLogs));
  }, [screenTimeLogs]);

  useEffect(() => {
    if (insights) {
      localStorage.setItem('cognitiveInsights', JSON.stringify(insights));
    }
  }, [insights]);

  const handleAddLog = (newLogEntry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...newLogEntry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev]);
    setActiveTab('home'); // Go back to home after logging via form
  };

  const handleAddScreenTimeLog = (log: ScreenTimeLog) => {
    setScreenTimeLogs(prev => [...prev, log]);
  };

  const handleQuickLog = (type: LogEntry['type'], tag: string, content?: string) => {
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      type,
      tags: [tag],
      context: [],
      content: content || '',
      intensity: 3,
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev]);
    // Could add a toast notification here
  };

  const handleGenerateInsights = async () => {
    if (logs.length < 3) {
      alert("Please log at least 3 actions or feelings before generating insights.");
      return;
    }
    
    setIsGenerating(true);
    setActiveTab('insights');
    
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Send last 30 logs approx and the foundational profile
        body: JSON.stringify({ 
          logs: logs.slice(0, 30),
          profile 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }
      
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error(error);
      alert("Failed to sync with the cognitive engine. Check your API key or network.");
      setActiveTab('home');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to permanently erase all logs and reset your contract?")) {
      localStorage.removeItem('cognitiveProfile');
      localStorage.removeItem('cognitiveLogs');
      localStorage.removeItem('cognitiveInsights');
      localStorage.removeItem('cognitiveScreenTime');
      setProfile(null);
      setLogs([]);
      setScreenTimeLogs([]);
      setInsights(null);
      setIsOnboarded(false);
      setActiveTab('home');
    }
  };

  if (isOnboarded === null) {
    return null; // or a loading spinner
  }

  if (!isOnboarded) {
    return (
      <Onboarding 
        onComplete={(profile) => {
          localStorage.setItem('cognitiveProfile', JSON.stringify(profile));
          setProfile(profile);
          setIsOnboarded(true);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-natural-bg flex flex-col font-sans relative pb-24 shadow-2xl relative">
      <header className="sticky top-0 z-10 bg-natural-bg/90 backdrop-blur-xl border-b border-natural-border px-6 py-5 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full bg-natural-dark text-white flex items-center justify-center border border-natural-border/50 shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-display font-semibold tracking-tight text-natural-dark">MirrorMind</h1>
        </div>
        
        <button 
          onClick={handleGenerateInsights}
          disabled={isGenerating || logs.length < 1}
          className="bg-natural-accent hover:bg-[#c27258] transition-colors text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md shadow-natural-accent/20 disabled:opacity-50 disabled:shadow-none font-bold"
        >
          {isGenerating ? "Analyzing..." : "Analyze"}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        {activeTab === 'home' && (
          <Dashboard 
            profile={profile} 
            logs={logs} 
            onQuickLog={handleQuickLog} 
            onNavigateInsights={() => setActiveTab('insights')} 
          />
        )}
        
        {activeTab === 'log_form' && (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="mb-6 px-2">
              <h2 className="text-2xl font-display font-bold text-natural-dark">Deep Log</h2>
              <p className="text-sm text-natural-text-mute mt-1">Record feelings, friction points, or add context to your actions.</p>
            </div>
            <LogEntryForm onAddLog={handleAddLog} />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-display font-bold text-natural-dark">Activity</h2>
              <span className="text-xs text-natural-text-mute font-bold bg-white px-3 py-1.5 rounded-full border border-natural-border shadow-sm">{logs.length} entries</span>
            </div>
            <Timeline logs={logs} />
          </div>
        )}
        
        {activeTab === 'insights' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InsightsView insights={insights} isLoading={isGenerating} />
          </div>
        )}

        {activeTab === 'profile' && (
          <Profile profile={profile} onReset={handleReset} />
        )}

        {activeTab === 'screen_time' && (
          <ScreenTimeView logs={screenTimeLogs} onAddLog={handleAddScreenTimeLog} />
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-natural-surface/90 backdrop-blur-md border-t border-natural-border px-6 py-4 flex gap-2 z-20 justify-between items-center">
        <button 
          onClick={() => setActiveTab('home')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 font-medium text-[10px] uppercase tracking-widest transition-all w-16 h-12 rounded-xl",
            activeTab === 'home' ? "text-natural-dark" : "text-natural-text-light hover:text-natural-text-mute"
          )}
        >
          <Home className="w-5 h-5" />
          Home
        </button>
        
        <button 
          onClick={() => setActiveTab('profile')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 font-medium text-[10px] uppercase tracking-widest transition-all w-16 h-12 rounded-xl",
            activeTab === 'profile' ? "text-natural-dark" : "text-natural-text-light hover:text-natural-text-mute"
          )}
        >
          <User className="w-5 h-5" />
          Profile
        </button>

        <button 
          onClick={() => setActiveTab('screen_time')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 font-medium text-[10px] uppercase tracking-widest transition-all w-16 h-12 rounded-xl",
            activeTab === 'screen_time' ? "text-natural-dark" : "text-natural-text-light hover:text-natural-text-mute"
          )}
        >
          <Smartphone className="w-5 h-5" />
          Load
        </button>

        <button 
          onClick={() => setActiveTab('log_form')}
          className="w-14 h-14 -mt-6 bg-natural-dark text-white rounded-full flex items-center justify-center shadow-lg shadow-natural-dark/20 hover:scale-105 transition-transform"
        >
          <PlusSquare className="w-6 h-6" />
        </button>

        <button 
          onClick={() => setActiveTab('timeline')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 font-medium text-[10px] uppercase tracking-widest transition-all w-16 h-12 rounded-xl",
            activeTab === 'timeline' ? "text-natural-dark" : "text-natural-text-light hover:text-natural-text-mute"
          )}
        >
          <Activity className="w-5 h-5" />
          Log
        </button>

        <button 
          onClick={() => setActiveTab('insights')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 font-medium text-[10px] uppercase tracking-widest transition-all w-16 h-12 rounded-xl",
            activeTab === 'insights' ? "text-natural-dark" : "text-natural-text-light hover:text-natural-text-mute"
          )}
        >
          <BrainCircuit className="w-5 h-5" />
          Map
        </button>
      </div>
    </div>
  );
}
