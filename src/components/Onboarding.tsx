import React, { useState } from 'react';
import { ArrowRight, Target, ShieldAlert, Swords, Zap } from 'lucide-react';
import { cn } from '../utils';

interface OnboardingProps {
  onComplete: (profile: any) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [habitsToDestroy, setHabitsToDestroy] = useState<string[]>([]);
  const [habitsToBuild, setHabitsToBuild] = useState<string[]>([]);

  const toggleItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const steps = [
    {
      id: 'welcome',
      content: (
        <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
          <div className="w-20 h-20 rounded-full bg-natural-dark text-white flex items-center justify-center border-4 border-natural-border shadow-lg">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-natural-dark mb-4">Take Charge.</h1>
            <p className="text-natural-text-mute text-[15px] leading-relaxed max-w-sm px-4">
              This isn't just another habit tracker. We map your actions, roadblocks, and patterns to build an actionable path forward. Radical honesty required.
            </p>
          </div>
          <button 
            onClick={() => setStep(1)}
            className="mt-8 bg-natural-text text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-natural-text/20 hover:bg-natural-dark transition-all flex items-center gap-2"
          >
            I'm Ready <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )
    },
    {
      id: 'goals',
      content: (
        <div className="flex flex-col space-y-6 w-full animate-in slide-in-from-right-8 fade-in duration-500">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-natural-accent" />
              <h2 className="text-2xl font-display font-bold text-natural-dark">The Mission</h2>
            </div>
            <p className="text-natural-text-mute text-sm">What are the primary goals we are striving for? (Tap all that apply)</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Career Vanguard", "Financial Freedom", 
              "Mental Resilience", "Physical Peak", 
              "Deeper Relationships", "Master My Routine"
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => toggleItem(setGoals, opt)}
                className={cn(
                  "p-4 text-center rounded-[24px] border-2 transition-all font-bold text-sm",
                  goals.includes(opt)
                    ? "border-natural-accent bg-natural-accent text-white shadow-md shadow-natural-accent/20"
                    : "border-natural-border bg-white text-natural-text hover:border-natural-accent-alt"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <button 
            disabled={goals.length === 0}
            onClick={() => setStep(2)}
            className="mt-6 bg-natural-text text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-natural-dark transition-all disabled:opacity-50 self-end flex items-center gap-2"
          >
            Next <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )
    },
    {
      id: 'issues',
      content: (
        <div className="flex flex-col space-y-6 w-full animate-in slide-in-from-right-8 fade-in duration-500">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-6 h-6 text-natural-accent" />
              <h2 className="text-2xl font-display font-bold text-natural-dark">The Roadblocks</h2>
            </div>
            <p className="text-natural-text-mute text-sm">What heavy friction is currently standing in your way?</p>
          </div>
           <div className="grid grid-cols-1 gap-3">
            {[
              "Burnout & Overwork",
              "Financial Stress",
              "Depressive States / Anxiety",
              "Addictive Behaviors / Vices",
              "Chronic Procrastination",
              "Brain Fog & Lack of Clarity"
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => toggleItem(setIssues, opt)}
                className={cn(
                  "p-4 text-left rounded-2xl border-2 transition-all font-bold text-[15px]",
                  issues.includes(opt)
                    ? "border-natural-dark bg-natural-dark text-white shadow-md"
                    : "border-natural-border bg-white text-natural-text hover:border-natural-text-mute"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <button 
            disabled={issues.length === 0}
            onClick={() => setStep(3)}
            className="mt-6 bg-natural-text text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-natural-dark transition-all disabled:opacity-50 self-end flex items-center gap-2"
          >
            Next <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )
    },
    {
      id: 'habits',
      content: (
       <div className="flex flex-col space-y-6 w-full animate-in slide-in-from-right-8 fade-in duration-500 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Swords className="w-6 h-6 text-natural-accent-alt" />
              <h2 className="text-2xl font-display font-bold text-natural-dark">The Contract</h2>
            </div>
            <p className="text-natural-text-mute text-sm">Define what stays and what goes.</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-natural-text text-sm uppercase tracking-widest pl-1 border-l-2 border-rose-500">Destroy</h3>
            <div className="flex flex-wrap gap-2">
              {['Doomscrolling', 'Junk Food', 'Snoozing', 'Self-Isolation', 'Impulse Buying', 'Complaining'].map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleItem(setHabitsToDestroy, opt)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                    habitsToDestroy.includes(opt)
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white text-natural-text-mute border-natural-border hover:border-rose-400"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-natural-text text-sm uppercase tracking-widest pl-1 border-l-2 border-emerald-500 mt-2">Build</h3>
            <div className="flex flex-wrap gap-2">
              {['Early Riser', 'Deep Work', 'Daily Exercise', 'Meditation', 'Reading', 'Meal Prep'].map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleItem(setHabitsToBuild, opt)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                    habitsToBuild.includes(opt)
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-white text-natural-text-mute border-natural-border hover:border-emerald-400"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button 
              disabled={habitsToDestroy.length === 0 && habitsToBuild.length === 0}
              onClick={() => onComplete({ goals, issues, habitsToDestroy, habitsToBuild })}
              className="w-full bg-natural-text text-white px-8 py-4 rounded-[24px] font-bold shadow-lg shadow-natural-text/20 hover:bg-natural-dark transition-all disabled:opacity-50"
            >
              Sign Contract & Enter
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-natural-bg flex flex-col font-sans p-6 justify-center overflow-hidden relative shadow-2xl">
      {step > 0 && (
        <div className="absolute top-12 left-6 right-6 flex gap-2 z-10">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={cn(
                "h-1.5 rounded-full flex-1 transition-all duration-500",
                s <= step ? "bg-natural-dark" : "bg-natural-surface border border-natural-border"
              )}
            />
          ))}
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center pt-12">
        {steps[step].content}
      </div>
    </div>
  );
}

