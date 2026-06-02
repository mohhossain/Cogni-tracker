import React, { useState } from 'react';
import { LogType, LogEntry } from '../types';
import { SmilePlus, Flame, MoveDownRight, BrainCircuit } from 'lucide-react';
import { cn } from '../utils';

interface LogEntryFormProps {
  onAddLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const SUGGESTED_TAGS: Record<LogType, string[]> = {
  feeling: ['Anxious', 'Exhausted', 'Overwhelmed', 'Motivated', 'Calm', 'Frustrated', 'Brain Fog', 'Restless'],
  action_positive: ['Deep Work', 'Exercised', 'Healthy Meal', 'Read', 'Stretched', 'Hydrated', 'Woke Early', 'Meditated'],
  action_negative: ['Doomscrolled', 'Skipped Workout', 'Junk Food', 'Procrastinated', 'Slept Late', 'Avoided task', 'Caffeine Crash'],
  roadblock: ['Low Energy', 'Distractions', 'Unexpected task', 'Bad weather', 'Poor Sleep', 'Social pressure', 'Tech issues']
};

const CONTEXT_TAGS = ['Home', 'Work', 'Commute', 'Alone', 'With Partner', 'With Friends', 'Family', 'Public Form'];

export function LogEntryForm({ onAddLog }: LogEntryFormProps) {
  const [type, setType] = useState<LogType>('feeling');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [intensity, setIntensity] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTags.length === 0 && !content.trim()) return;

    onAddLog({ type, tags: selectedTags, context: selectedContexts, content: content.trim(), intensity });
    setContent('');
    setSelectedTags([]);
    setSelectedContexts([]);
    setIntensity(3);
  };

  const handleTypeChange = (newType: LogType) => {
    setType(newType);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const toggleContext = (ctx: string) => {
    setSelectedContexts(prev => prev.includes(ctx) ? prev.filter(c => c !== ctx) : [...prev, ctx]);
  };

  const types: { value: LogType; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'feeling', label: 'Feeling', icon: <BrainCircuit className="w-4 h-4" />, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { value: 'action_positive', label: 'Win', icon: <SmilePlus className="w-4 h-4" />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { value: 'action_negative', label: 'Slip', icon: <MoveDownRight className="w-4 h-4" />, color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { value: 'roadblock', label: 'Friction', icon: <Flame className="w-4 h-4" />, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-natural-border rounded-[32px] shadow-sm flex flex-col gap-6">
      
      <div className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-none">
        {types.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => handleTypeChange(t.value)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all min-w-[70px]",
              type === t.value 
                ? "bg-natural-surface border-natural-accent text-natural-text"
                : "bg-white text-natural-text-mute border-natural-surface hover:bg-natural-surface/50"
            )}
          >
            {t.icon}
            <span className="text-[10px] uppercase font-bold mt-2 tracking-wide">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-natural-text-light uppercase tracking-wide">
          What's happening?
        </label>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS[type].map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                selectedTags.includes(tag)
                  ? "bg-natural-accent text-white border-natural-accent"
                  : "bg-natural-bg text-natural-text-mute border-natural-border hover:border-natural-accent-alt hover:text-natural-text"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-natural-text-light uppercase tracking-wide">
          Context (Optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTEXT_TAGS.map(ctx => (
            <button
              key={ctx}
              type="button"
              onClick={() => toggleContext(ctx)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                selectedContexts.includes(ctx)
                  ? "bg-natural-accent-alt text-white border-natural-accent-alt"
                  : "bg-natural-bg text-natural-text-mute border-natural-border hover:border-natural-accent-alt hover:text-natural-text"
              )}
            >
              {ctx}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
         <label className="text-xs font-bold text-natural-text-light uppercase tracking-wide">
          Additional Note (Optional)
        </label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Type any extra details...`}
          className="w-full bg-natural-bg/50 border border-natural-border rounded-2xl px-4 py-3.5 text-sm text-natural-text placeholder:text-natural-text-light focus:outline-none focus:ring-2 focus:ring-natural-accent-alt/30 focus:border-natural-accent-alt transition-all"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-natural-text-light uppercase tracking-wide flex justify-between">
          <span>Intensity / Weight</span>
          <span className="text-natural-text-mute">{intensity}/5</span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
          className="w-full h-2 bg-natural-surface rounded-lg appearance-none cursor-pointer accent-natural-accent"
        />
        <div className="flex justify-between text-[10px] font-medium text-natural-text-light px-1">
          <span>Light</span>
          <span>Moderate</span>
          <span>Heavy</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={selectedTags.length === 0 && !content.trim()}
        className="w-full py-3.5 rounded-2xl bg-natural-text hover:bg-natural-text/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wide transition-all mt-2"
      >
        Save Entry
      </button>

    </form>
  );
}
