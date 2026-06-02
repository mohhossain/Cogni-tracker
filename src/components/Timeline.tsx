import React from 'react';
import { LogEntry } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { SmilePlus, Flame, MoveDownRight, BrainCircuit, Activity } from 'lucide-react';
import { cn } from '../utils';

interface TimelineProps {
  logs: LogEntry[];
}

export function Timeline({ logs }: TimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-natural-border rounded-[32px] bg-natural-surface/30">
        <Activity className="w-8 h-8 text-natural-text-light mb-3" />
        <p className="text-sm text-natural-text-mute font-medium">No behavioral data yet.</p>
        <p className="text-xs text-natural-text-light mt-1">Start logging to generate cognitive insights.</p>
      </div>
    );
  }

  const getConfig = (type: LogEntry['type']) => {
    switch (type) {
      case 'feeling':
        return { icon: <BrainCircuit className="w-4 h-4" />, color: 'bg-white text-natural-text border-natural-border/50', accent: 'bg-natural-text' };
      case 'action_positive':
        return { icon: <SmilePlus className="w-4 h-4" />, color: 'bg-white text-natural-accent-alt border-natural-border/50', accent: 'bg-natural-accent-alt' };
      case 'action_negative':
        return { icon: <MoveDownRight className="w-4 h-4" />, color: 'bg-white text-natural-accent border-natural-border/50', accent: 'bg-natural-accent' };
      case 'roadblock':
        return { icon: <Flame className="w-4 h-4" />, color: 'bg-white text-natural-accent border-natural-border/50', accent: 'bg-natural-accent' };
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {logs.map((log) => {
        const config = getConfig(log.type);
        return (
          <div key={log.id} className="flex gap-4 items-start">
            <div className="flex flex-col items-center gap-2 mt-1">
              <div className={cn("p-2 rounded-full border shadow-sm", config.color)}>
                {config.icon}
              </div>
              <div className="w-px h-full bg-natural-border min-h-[24px]"></div>
            </div>
            
            <div className="flex-1 bg-white border border-natural-border rounded-3xl p-5 shadow-sm pb-6">
              <div className="flex justify-between items-center mb-3 text-xs">
                <span className={cn("font-bold px-3 py-1 rounded-full uppercase tracking-widest text-[9px] bg-natural-surface border border-natural-border/50 text-natural-text-mute")}>
                  {log.type.replace('_', ' ')}
                </span>
                <span className="text-natural-text-light font-medium">{formatDistanceToNow(log.timestamp, { addSuffix: true })}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {log.tags?.map(tag => (
                  <span key={tag} className={cn("text-xs font-semibold px-2.5 py-1 rounded-md text-white shadow-sm", config.accent)}>
                    {tag}
                  </span>
                ))}
              </div>

              {log.context && log.context.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {log.context.map(ctx => (
                    <span key={ctx} className="text-[10px] font-bold text-natural-text-mute uppercase tracking-widest bg-natural-surface px-2 py-0.5 rounded border border-natural-border">
                      {ctx}
                    </span>
                  ))}
                </div>
              )}

              {log.content && (
                <p className="text-natural-text text-sm mt-2 font-medium leading-relaxed italic bg-natural-bg/50 p-3 rounded-xl border border-natural-border/50">
                  {log.content}
                </p>
              )}
              
              <div className="mt-4 flex gap-1.5 items-center">
                <span className="text-[10px] text-natural-text-light uppercase font-bold mr-1">Intensity</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-4 h-1 rounded-full",
                      i < log.intensity ? config.accent : "bg-natural-surface"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
