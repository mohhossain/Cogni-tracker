import React from 'react';
import { Target, ShieldAlert, Trash2, User } from 'lucide-react';

interface ProfileProps {
  profile: any;
  onReset: () => void;
}

export function Profile({ profile, onReset }: ProfileProps) {
  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col items-center mb-4 mt-2">
        <div className="w-20 h-20 bg-natural-dark text-white rounded-full flex items-center justify-center shadow-lg border-4 border-natural-border mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-bold text-natural-dark">Your Contract</h2>
        <p className="text-sm text-natural-text-mute">This is what you signed up for.</p>
      </div>

      <div className="space-y-4 bg-white border border-natural-border rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-natural-accent" />
          <h3 className="font-bold text-natural-dark">Mission Goals</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile?.goals?.map((g: string) => (
            <span key={g} className="px-3 py-1.5 rounded-full bg-natural-bg border border-natural-border text-xs font-bold text-natural-text">{g}</span>
          ))}
        </div>
      </div>

      <div className="space-y-4 bg-white border border-natural-border rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-natural-accent" />
          <h3 className="font-bold text-natural-dark">Key Frictions</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile?.issues?.map((i: string) => (
            <span key={i} className="px-3 py-1.5 rounded-full bg-natural-bg border border-natural-border text-xs font-bold text-natural-text">{i}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-rose-100 rounded-3xl p-5 shadow-sm">
          <h3 className="font-bold text-rose-500 text-xs uppercase tracking-widest mb-3 border-l-2 border-rose-500 pl-2">Destroy</h3>
          <div className="flex flex-col gap-2">
            {profile?.habitsToDestroy?.map((h: string) => (
              <span key={h} className="text-xs font-bold text-natural-dark">{h}</span>
            ))}
          </div>
        </div>
        
        <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-sm">
          <h3 className="font-bold text-emerald-500 text-xs uppercase tracking-widest mb-3 border-l-2 border-emerald-500 pl-2">Build</h3>
          <div className="flex flex-col gap-2">
            {profile?.habitsToBuild?.map((h: string) => (
              <span key={h} className="text-xs font-bold text-natural-dark">{h}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-natural-border flex flex-col items-center">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-rose-500 font-bold text-sm px-6 py-3 rounded-full hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Reset Mission & Erase Data
        </button>
      </div>
    </div>
  );
}
