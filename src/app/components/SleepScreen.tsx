import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, X, Moon, Sun, Clock, Star, TrendingUp, ZapOff, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const SLEEP_QUALITY = [
  { value: 5, label: 'Great', emoji: '😴', color: '#10B981' },
  { value: 4, label: 'Good', emoji: '😊', color: '#0A9B8F' },
  { value: 3, label: 'Okay', emoji: '😐', color: '#F59E0B' },
  { value: 2, label: 'Poor', emoji: '😔', color: '#F97316' },
  { value: 1, label: 'Bad', emoji: '😫', color: '#EF4444' },
];

const sleepHistory = [
  { day: 'Mon', hours: 7.5, quality: 4 },
  { day: 'Tue', hours: 6.0, quality: 3 },
  { day: 'Wed', hours: 8.0, quality: 5 },
  { day: 'Thu', hours: 5.5, quality: 2 },
  { day: 'Fri', hours: 7.0, quality: 4 },
  { day: 'Sat', hours: 8.5, quality: 5 },
  { day: 'Sun', hours: 7.5, quality: 4 },
];

const weeklyTrend = [
  { week: 'W1', avg: 6.8 }, { week: 'W2', avg: 7.2 }, { week: 'W3', avg: 6.5 },
  { week: 'W4', avg: 7.5 }, { week: 'W5', avg: 7.1 }, { week: 'W6', avg: 7.8 },
];

const sleepTips = [
  { tip: 'Avoid screens 1 hour before bed', icon: Moon },
  { tip: 'Keep a consistent sleep schedule', icon: Clock },
  { tip: 'Avoid caffeine after 4 PM', icon: Sun },
  { tip: 'Cool room temperature (18-22°C) helps', icon: Star },
];

interface SleepEntry {
  id: number; bedtime: string; wakeTime: string; duration: number; quality: number;
  qualityLabel: string; isNap: boolean; notes?: string;
}

export function SleepScreen() {
  const navigate = useNavigate();
  const [showLogSleep, setShowLogSleep] = useState(false);
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [quality, setQuality] = useState(4);
  const [isNap, setIsNap] = useState(false);
  const [notes, setNotes] = useState('');
  const [logged, setLogged] = useState(false);
  const [sleepLog, setSleepLog] = useState<SleepEntry[]>([
    { id: 1, bedtime: '22:30', wakeTime: '06:00', duration: 7.5, quality: 4, qualityLabel: 'Good', isNap: false },
  ]);

  const avgSleep = sleepHistory.reduce((a, b) => a + b.hours, 0) / sleepHistory.length;
  const today = sleepLog[0];

  const calcDuration = (bed: string, wake: string) => {
    const [bh, bm] = bed.split(':').map(Number);
    const [wh, wm] = wake.split(':').map(Number);
    let diff = (wh * 60 + wm) - (bh * 60 + bm);
    if (diff < 0) diff += 1440;
    return Math.round(diff / 60 * 10) / 10;
  };

  const handleSave = () => {
    const dur = calcDuration(bedtime, wakeTime);
    const q = SLEEP_QUALITY.find(s => s.value === quality);
    setSleepLog(prev => [{
      id: Date.now(), bedtime, wakeTime, duration: dur,
      quality, qualityLabel: q?.label || 'Good', isNap, notes,
    }, ...prev]);
    setLogged(true);
    setTimeout(() => { setLogged(false); setShowLogSleep(false); }, 1500);
  };

  const qualityColor = (q: number) => {
    const found = SLEEP_QUALITY.find(s => s.value === q);
    return found?.color || '#0A9B8F';
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ChevronLeft size={22} />
          </button>
          <h1 className="font-bold text-slate-900" style={{ fontSize: '18px' }}>Sleep Tracker</h1>
          <button onClick={() => setShowLogSleep(true)} className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-primary">
            <Plus size={22} />
          </button>
        </div>

        {/* Tonight's Sleep Card */}
        <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/60 text-xs mb-1">Last Night's Sleep</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">{today?.duration || 7.5}</span>
                <span className="text-white/70 text-sm mb-1">hours</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-1">{SLEEP_QUALITY.find(s => s.value === (today?.quality || 4))?.emoji}</div>
              <p className="text-xs text-white/70">{today?.qualityLabel || 'Good'} sleep</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Moon size={12} className="text-indigo-300" />
              <span className="text-xs text-white/70">Slept at <span className="text-white font-semibold">{today?.bedtime || '22:30'}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sun size={12} className="text-yellow-300" />
              <span className="text-xs text-white/70">Woke at <span className="text-white font-semibold">{today?.wakeTime || '06:00'}</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {/* Weekly Summary */}
        <div className="pt-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm">This Week</h4>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">😴</span>
                <span className="font-bold text-primary text-sm">{avgSleep.toFixed(1)} hrs avg</span>
              </div>
            </div>
            <div className="flex gap-1.5">
              {sleepHistory.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col justify-end" style={{ height: '60px' }}>
                    <div className="w-full rounded-lg transition-all" style={{ height: `${(s.hours / 10) * 100}%`, backgroundColor: qualityColor(s.quality) + '90', minHeight: '8px' }} />
                  </div>
                  <span className="text-[10px] text-slate-400">{s.day}</span>
                  <span className="text-[10px] font-semibold text-slate-600">{s.hours}h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-3">6-Week Trend</h4>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend}>
                  <defs>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#312e81" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#312e81" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                  <YAxis domain={[4, 10]} hide />
                  <Tooltip formatter={(v: number) => [`${v} hrs`, 'Avg Sleep']} />
                  <Area type="monotone" dataKey="avg" stroke="#4f46e5" strokeWidth={2.5} fill="url(#sleepGrad)" dot={{ fill: '#4f46e5', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-[10px] text-slate-400 ml-1">Recommended: 7-9 hours/night</span>
            </div>
          </div>

          {/* Sleep History */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-50">
              <h4 className="font-bold text-slate-900 text-sm">Sleep Log</h4>
            </div>
            {sleepLog.map(s => (
              <div key={s.id} className="px-4 py-3 border-b border-slate-50 last:border-0 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Moon size={16} className="text-indigo-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 text-sm">{s.duration} hours</p>
                    {s.isNap && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">Nap</span>}
                  </div>
                  <p className="text-xs text-slate-400">{s.bedtime} → {s.wakeTime} · {s.qualityLabel}</p>
                </div>
                <div className="text-xl">{SLEEP_QUALITY.find(q => q.value === s.quality)?.emoji}</div>
              </div>
            ))}
          </div>

          {/* Sleep Tips */}
          <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
            <h4 className="font-bold text-indigo-900 text-sm mb-3">💡 Sleep Better Tonight</h4>
            <div className="space-y-2.5">
              {sleepTips.map((tip, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <tip.icon size={12} className="text-indigo-500" />
                  </div>
                  <p className="text-xs text-indigo-700">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Sleep Sheet */}
      <AnimatePresence>
        {showLogSleep && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/40 flex items-end">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Log Sleep</h3>
                <button onClick={() => setShowLogSleep(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><X size={16} /></button>
              </div>
              {logged ? (
                <div className="p-8 flex flex-col items-center gap-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                    className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <Check size={28} className="text-green-600" />
                  </motion.div>
                  <p className="font-bold text-slate-900">Sleep logged! 😴</p>
                </div>
              ) : (
                <div className="p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-500">Is this a Nap?</label>
                    <button onClick={() => setIsNap(!isNap)} className={`w-11 h-6 rounded-full transition-all relative ${isNap ? 'bg-amber-400' : 'bg-slate-200'}`}>
                      <motion.div className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                        animate={{ left: isNap ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 block flex items-center gap-1"><Moon size={10} className="text-indigo-400" /> Bedtime</label>
                      <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 block flex items-center gap-1"><Sun size={10} className="text-amber-400" /> Wake Time</label>
                      <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-indigo-500">Duration</p>
                    <p className="font-bold text-indigo-900 text-lg">{calcDuration(bedtime, wakeTime)} hours</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-2 block">Sleep Quality</label>
                    <div className="flex gap-2">
                      {SLEEP_QUALITY.map(q => (
                        <button key={q.value} onClick={() => setQuality(q.value)}
                          className={`flex-1 p-2 rounded-xl flex flex-col items-center gap-1 border transition-all ${quality === q.value ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50'}`}>
                          <span className="text-lg">{q.emoji}</span>
                          <span className={`text-[10px] font-semibold ${quality === q.value ? 'text-primary' : 'text-slate-500'}`}>{q.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Notes (optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="How do you feel? Any dreams or disturbances?"
                      className="w-full h-16 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm resize-none placeholder:text-slate-400" />
                  </div>
                  <button onClick={handleSave} className="w-full h-12 bg-indigo-600 text-white rounded-2xl font-semibold">Save Sleep Log</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
