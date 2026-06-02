import React from 'react';
import { CognitiveInsights } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface InsightsViewProps {
  insights: CognitiveInsights | null;
  isLoading: boolean;
}

export function InsightsView({ insights, isLoading }: InsightsViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-[32px] bg-white border border-natural-border shadow-sm">
        <Sparkles className="w-8 h-8 text-natural-accent mb-4 animate-pulse" />
        <p className="text-sm font-bold text-natural-text">Synthesizing behavioral patterns...</p>
        <p className="text-xs text-natural-text-mute mt-2 max-w-xs leading-relaxed">
          The engine is analyzing your inputs to map cognitive triggers and friction points.
        </p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-natural-border rounded-[32px] bg-natural-surface/30">
        <Sparkles className="w-8 h-8 text-natural-text-light mb-3" />
        <p className="text-sm text-natural-text-mute font-medium">No active insights.</p>
        <p className="text-xs text-natural-text-light mt-1">Log a few more actions to generate a psychological profile.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="bg-natural-dark text-white rounded-[32px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <Zap className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Current Status</h2>
        </div>
        <p className="text-lg font-display font-medium leading-tight relative z-10">
          {insights.summary}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-natural-text-light uppercase tracking-widest pl-1">Patterns</h3>
        <div className="grid gap-3">
        {insights.correlations.map((corr, i) => (
          <div key={i} className="bg-white border border-natural-border rounded-3xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-natural-surface border border-natural-border px-3 py-1 rounded-md text-[10px] font-bold text-natural-text-mute uppercase tracking-widest">
                {corr.factorA}
              </span>
              <ArrowRight className="w-3 h-3 text-natural-text-light" />
              <span className="bg-natural-surface border border-natural-border px-3 py-1 rounded-md text-[10px] font-bold text-natural-text-mute uppercase tracking-widest">
                {corr.factorB}
              </span>
            </div>
            <p className="text-[13px] text-natural-dark font-medium leading-tight">
              {corr.insight}
            </p>
          </div>
        ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-natural-text-light uppercase tracking-widest pl-1 mt-2">Action Plan</h3>
        <div className="bg-white border border-natural-border rounded-3xl p-5 shadow-sm">
          <ul className="space-y-4">
            {insights.preemptiveGuidance.map((guide, i) => (
              <li key={i} className="flex gap-3 items-start">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[13px] font-bold text-natural-dark leading-snug">
                  {guide}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
      <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/>
      <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
    </svg>
  )
}
