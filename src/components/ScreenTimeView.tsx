import React, { useState, useMemo } from 'react';
import { Smartphone, RefreshCcw, AlertCircle, Plus } from 'lucide-react';
import { ScreenTimeLog } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../utils';

interface ScreenTimeViewProps {
  logs: ScreenTimeLog[];
  onAddLog: (log: ScreenTimeLog) => void;
}

export function ScreenTimeView({ logs, onAddLog }: ScreenTimeViewProps) {
  const [totalHours, setTotalHours] = useState('');
  const [totalMinutes, setTotalMinutes] = useState('');
  const [socialHours, setSocialHours] = useState('');
  const [socialMinutes, setSocialMinutes] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const chartData = useMemo(() => {
    return [...logs].sort((a, b) => a.timestamp - b.timestamp).slice(-7).map(log => ({
      name: new Date(log.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
      total: Number((log.totalMinutes / 60).toFixed(1)),
      social: Number((log.socialMinutes / 60).toFixed(1))
    }));
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tMin = (parseInt(totalHours || '0') * 60) + parseInt(totalMinutes || '0');
    const sMin = (parseInt(socialHours || '0') * 60) + parseInt(socialMinutes || '0');
    
    if (tMin === 0) return;

    onAddLog({
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      totalMinutes: tMin,
      socialMinutes: sMin,
      timestamp: Date.now()
    });

    setTotalHours('');
    setTotalMinutes('');
    setSocialHours('');
    setSocialMinutes('');
    setIsLogging(false);
  };

  const handleNativeSync = () => {
    alert("Native OS Screen Time sync requires the iOS/Android app companion or MDM profile. For this web interface, please log your screen time manually.");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end px-2 mb-2">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Smartphone className="w-5 h-5 text-indigo-500" />
            <h2 className="text-2xl font-display font-bold text-natural-dark">Digital Load</h2>
          </div>
          <p className="text-sm text-natural-text-mute mt-1">Track device fatigue and doomscrolling.</p>
        </div>
        <button 
          onClick={handleNativeSync}
          className="bg-natural-surface border border-natural-border p-2.5 rounded-xl text-natural-text hover:bg-white hover:border-indigo-400 transition-colors group shadow-sm"
          title="Sync with OS"
        >
          <RefreshCcw className="w-5 h-5 group-hover:text-indigo-500 transition-colors" />
        </button>
      </div>

      <div className="bg-natural-dark text-white rounded-[32px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Weekly Pattern</h2>
          
          {logs.length > 0 && (
            <div className="text-right">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Avg Total</p>
              <p className="text-lg font-display font-bold text-white">
                {(logs.reduce((acc, log) => acc + log.totalMinutes, 0) / logs.length / 60).toFixed(1)} <span className="text-xs text-white/50 font-sans">hrs/day</span>
              </p>
            </div>
          )}
        </div>
        
        {logs.length === 0 ? (
          <div className="text-center py-8 relative z-10 border border-dashed border-white/10 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-white/30 mx-auto mb-3" />
            <p className="font-bold text-sm">No Screen Time Data</p>
            <p className="text-xs text-white/50 mt-1">Log your usage to reveal cognitive patterns.</p>
          </div>
        ) : (
          <div className="h-48 w-full mt-4 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '16px', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                />
                <Bar dataKey="social" stackId="a" fill="#818cf8" radius={[0, 0, 4, 4]} name="Social (hrs)" />
                <Bar dataKey="total" stackId="a" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} name="Total (hrs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {!isLogging && (
        <button 
          onClick={() => setIsLogging(true)}
          className="w-full bg-white border-2 border-dashed border-natural-border rounded-[32px] p-6 text-natural-text-mute hover:border-indigo-400 hover:text-indigo-500 hover:bg-slate-50 transition-all font-bold flex flex-col items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Log Today's Screen Time
        </button>
      )}

      {isLogging && (
        <form onSubmit={handleSubmit} className="bg-white border border-natural-border rounded-[32px] p-6 shadow-sm flex flex-col gap-6 animate-in slide-in-from-top-4 fade-in">
          <div className="flex items-center justify-between border-b border-natural-border pb-4">
            <h3 className="font-bold text-natural-dark text-sm uppercase tracking-widest text-indigo-500 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Manual Entry
            </h3>
            <button type="button" onClick={() => setIsLogging(false)} className="text-xs font-bold text-natural-text-light hover:text-natural-text border px-3 py-1.5 rounded-full">CANCEL</button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-natural-text-mute uppercase tracking-widest pl-1 mb-2">Total Screen Time</label>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  min="0"
                  max="24"
                  value={totalHours} 
                  onChange={e => setTotalHours(e.target.value)} 
                  placeholder="Hrs" 
                  className="flex-1 bg-natural-surface border border-natural-border rounded-2xl px-4 py-3 font-bold text-natural-dark focus:outline-none focus:border-indigo-400 placeholder:text-natural-text-light"
                />
                <input 
                  type="number" 
                  min="0"
                  max="59"
                  value={totalMinutes} 
                  onChange={e => setTotalMinutes(e.target.value)} 
                  placeholder="Min" 
                  className="flex-1 bg-natural-surface border border-natural-border rounded-2xl px-4 py-3 font-bold text-natural-dark focus:outline-none focus:border-indigo-400 placeholder:text-natural-text-light"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-500 uppercase tracking-widest pl-1 mb-2">Social / Doomscrolling</label>
               <div className="flex gap-3">
                <input 
                  type="number" 
                  min="0"
                  max="24"
                  value={socialHours} 
                  onChange={e => setSocialHours(e.target.value)} 
                  placeholder="Hrs" 
                  className="flex-1 bg-natural-surface border border-natural-border rounded-2xl px-4 py-3 font-bold text-natural-dark focus:outline-none focus:border-rose-400 placeholder:text-natural-text-light"
                />
                <input 
                  type="number" 
                  min="0"
                  max="59"
                  value={socialMinutes} 
                  onChange={e => setSocialMinutes(e.target.value)} 
                  placeholder="Min" 
                  className="flex-1 bg-natural-surface border border-natural-border rounded-2xl px-4 py-3 font-bold text-natural-dark focus:outline-none focus:border-rose-400 placeholder:text-natural-text-light"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={(!totalHours && !totalMinutes)}
            className="w-full bg-indigo-500 text-white px-6 py-4 rounded-full font-bold shadow-md shadow-indigo-500/20 hover:bg-indigo-600 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            Save Record
          </button>
        </form>
      )}
    </div>
  );
}
