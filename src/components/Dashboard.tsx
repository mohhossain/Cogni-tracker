import React from 'react';
import { Target, Flame, ChevronRight, Zap } from 'lucide-react';
import { LogEntry } from '../types';
import { cn } from '../utils';

interface DashboardProps {
  profile: any;
  logs: LogEntry[];
  onQuickLog: (type: LogEntry['type'], tag: string, content?: string) => void;
  onNavigateInsights: () => void;
}

export function Dashboard({ profile, logs, onQuickLog, onNavigateInsights }: DashboardProps) {
  const todayLogs = logs.filter(l => l.timestamp > Date.now() - 24 * 60 * 60 * 1000);
  const positiveCount = todayLogs.filter(l => l.type === 'action_positive').length;
  const negativeCount = todayLogs.filter(l => l.type === 'action_negative').length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Welcome & Mission */}
      <div className="bg-natural-dark text-white rounded-[32px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
        <h2 className="text-2xl font-display font-bold mb-1">Your Protocol</h2>
        <p className="text-natural-surface/80 text-sm mb-6">Mission: {profile?.goals?.join(' • ') || 'Take Charge'}</p>
        
        <div className="flex gap-4">
          <div className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/10 shadow-inner">
            <p className="text-xs text-white/50 font-bold uppercase tracking-widest mb-1">Wins Today</p>
            <p className="text-2xl font-display font-bold text-emerald-400">{positiveCount}</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/10 shadow-inner">
            <p className="text-xs text-white/50 font-bold uppercase tracking-widest mb-1">Slips Today</p>
            <p className="text-2xl font-display font-bold text-rose-400">{negativeCount}</p>
          </div>
        </div>
      </div>

      {/* Quick Logging triggers */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-natural-text-light uppercase tracking-widest pl-1">One-Tap Tracking</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {profile?.habitsToBuild?.map((habit: string) => (
            <button
              key={`build-${habit}`}
              onClick={() => onQuickLog('action_positive', habit)}
              className="bg-white border border-natural-border p-4 rounded-2xl text-left hover:border-emerald-400 transition-colors shadow-sm group"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-xs text-natural-text-mute font-bold uppercase tracking-wide mb-1">I did it</p>
              <p className="font-bold text-natural-text text-sm leading-tight">{habit}</p>
            </button>
          ))}
          
          {profile?.habitsToDestroy?.map((habit: string) => (
            <button
              key={`destroy-${habit}`}
              onClick={() => onQuickLog('action_negative', habit)}
              className="bg-white border border-natural-border p-4 rounded-2xl text-left hover:border-rose-400 transition-colors shadow-sm group"
            >
              <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
              <p className="text-xs text-natural-text-mute font-bold uppercase tracking-wide mb-1">I slipped</p>
              <p className="font-bold text-natural-text text-sm leading-tight">{habit}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cognitive Maps Promo - directs to insights */}
      <button 
        onClick={onNavigateInsights}
        className="w-full bg-natural-surface border border-natural-border rounded-3xl p-5 flex items-center justify-between hover:bg-white transition-colors group shadow-sm mt-4"
      >
        <div className="text-left">
          <h3 className="font-bold text-natural-dark mb-1">View Cognitive Map</h3>
          <p className="text-xs text-natural-text-mute">See how your actions correlate</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-natural-bg border border-natural-border flex items-center justify-center group-hover:bg-natural-accent group-hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>

    </div>
  );
}
