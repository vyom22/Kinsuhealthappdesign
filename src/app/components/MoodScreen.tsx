import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, X, Camera, BookOpen, Heart, Smile, Frown, Meh, Lock, Sun, Wind, Music, PhoneCall, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const MOODS = [
  { value: 5, label: 'Joyful', emoji: '😄', color: '#10B981' },
  { value: 4, label: 'Happy', emoji: '😊', color: '#34D399' },
  { value: 3, label: 'Okay', emoji: '😐', color: '#F59E0B' },
  { value: 2, label: 'Sad', emoji: '😔', color: '#F97316' },
  { value: 1, label: 'Low', emoji: '😢', color: '#EF4444' },
];

const TRIGGERS = ['Work stress', 'Pain', 'Poor sleep', 'Good news', 'Family time', 'Exercise', 'Medicine side effect', 'Weather', 'Loneliness', 'Achievement'];

const STRESS_RESOURCES = [
  { title: '4-7-8 Breathing', desc: 'Breathe in 4s, hold 7s, out 8s', icon: Wind, duration: '5 min', color: '#3B82F6', tag: 'Breathing' },
  { title: 'Body Scan Meditation', desc: 'Progressive relaxation from head to toe', icon: Heart, duration: '10 min', color: '#8B5CF6', tag: 'Meditation' },
  { title: 'Gratitude Journal', desc: 'Write 3 things you\'re grateful for today', icon: BookOpen, duration: '5 min', color: '#10B981', tag: 'Journaling' },
  { title: 'Sunshine Walk', desc: '10-minute walk in natural light', icon: Sun, duration: '10 min', color: '#F59E0B', tag: 'Activity' },
  { title: 'Music Therapy', desc: 'Listen to calming ragas or nature sounds', icon: Music, duration: '15 min', color: '#EC4899', tag: 'Music' },
  { title: 'Talk to Someone', desc: 'Call a family member or friend', icon: PhoneCall, duration: 'Anytime', color: '#0A9B8F', tag: 'Social' },
];

const moodHistory = [
  { day: 'Mon', mood: 4 }, { day: 'Tue', mood: 3 }, { day: 'Wed', mood: 5 },
  { day: 'Thu', mood: 2 }, { day: 'Fri', mood: 4 }, { day: 'Sat', mood: 5 }, { day: 'Sun', mood: 4 },
];

interface JournalEntry {
  id: number; mood: number; moodLabel: string; emoji: string; triggers: string[];
  note: string; time: string; private: boolean;
}

export function MoodScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'checkin' | 'journal' | 'support'>('checkin');
  const [selectedMood, setSelectedMood] = useState(4);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [journalText, setJournalText] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [loggedMood, setLoggedMood] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: 1, mood: 4, moodLabel: 'Happy', emoji: '😊', triggers: ['Exercise', 'Family time'], note: 'Felt good after morning walk. Family dinner was lovely.', time: 'Yesterday, 9:00 PM', private: true },
    { id: 2, mood: 2, moodLabel: 'Sad', emoji: '😔', triggers: ['Pain', 'Poor sleep'], note: 'Joint pain was bad last night. Didn\'t sleep well.', time: '2 days ago, 8:30 AM', private: true },
  ]);

  const handleLogMood = () => {
    const m = MOODS.find(m => m.value === selectedMood)!;
    setEntries(prev => [{
      id: Date.now(), mood: selectedMood, moodLabel: m.label, emoji: m.emoji,
      triggers: selectedTriggers, note: journalText, time: 'Just now', private: isPrivate,
    }, ...prev]);
    setLoggedMood(true);
    setTimeout(() => setLoggedMood(false), 2000);
    setJournalText('');
    setSelectedTriggers([]);
  };

  const avgMood = moodHistory.reduce((a, b) => a + b.mood, 0) / moodHistory.length;
  const moodData = moodHistory.map(m => ({ ...m, moodVal: m.mood * 20 }));

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ChevronLeft size={22} />
          </button>
          <h1 className="font-bold text-slate-900" style={{ fontSize: '18px' }}>Mood & Wellbeing</h1>
          <div className="w-9" />
        </div>
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">This week's mood</p>
            <p className="font-bold text-xl text-slate-900">{avgMood.toFixed(1)}/5</p>
            <p className="text-xs text-slate-400">Average</p>
          </div>
          <div className="flex gap-1">
            {moodHistory.map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-base">{MOODS.find(md => md.value === m.mood)?.emoji}</span>
                <span className="text-[9px] text-slate-400">{m.day.slice(0, 1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-100 flex-shrink-0">
        {([['checkin', 'Check-in'], ['journal', 'Journal'], ['support', 'Support']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-3 text-xs font-semibold capitalize transition-all border-b-2 ${activeTab === t ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {activeTab === 'checkin' && (
          <div className="pt-4 space-y-5">
            {loggedMood ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center py-12 gap-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                  <Check size={28} className="text-green-600" />
                </div>
                <h3 className="font-bold text-slate-900">Mood logged! 💙</h3>
                <p className="text-sm text-slate-500 text-center">Your feelings are valid. We're here for you.</p>
              </motion.div>
            ) : (
              <>
                <div>
                  <h4 className="font-bold text-slate-900 mb-3">How are you feeling right now?</h4>
                  <div className="flex gap-2">
                    {MOODS.map(m => (
                      <button key={m.value} onClick={() => setSelectedMood(m.value)}
                        className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-1.5 border transition-all ${selectedMood === m.value ? 'border-primary bg-primary/5 scale-105' : 'border-slate-200 bg-white'}`}>
                        <span className="text-2xl">{m.emoji}</span>
                        <span className={`text-[10px] font-semibold ${selectedMood === m.value ? 'text-primary' : 'text-slate-400'}`}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-2">What's influencing your mood?</h4>
                  <div className="flex flex-wrap gap-2">
                    {TRIGGERS.map(t => (
                      <button key={t} onClick={() => setSelectedTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${selectedTriggers.includes(t) ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900">How was your day?</h4>
                    <div className="flex items-center gap-2">
                      <Lock size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-400">Private</span>
                      <button onClick={() => setIsPrivate(!isPrivate)}
                        className={`w-9 h-5 rounded-full relative transition-all ${isPrivate ? 'bg-primary' : 'bg-slate-200'}`}>
                        <motion.div className="w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm"
                          animate={{ left: isPrivate ? 18 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                      </button>
                    </div>
                  </div>
                  <textarea value={journalText} onChange={e => setJournalText(e.target.value)}
                    placeholder="Write freely... this is your safe space 🌸"
                    className="w-full h-28 p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 resize-none placeholder:text-slate-300" />
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-600">
                    <Camera size={16} /> Selfie Mood
                  </button>
                  <button onClick={handleLogMood}
                    className="flex-1 h-12 bg-primary text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <Heart size={16} /> Save Mood
                  </button>
                </div>
                <p className="text-center text-xs text-slate-400">📷 We can detect your mood from your selfie using AI (coming soon)</p>
              </>
            )}
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="pt-4 space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{entry.emoji}</span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{entry.moodLabel}</p>
                      <p className="text-xs text-slate-400">{entry.time}</p>
                    </div>
                  </div>
                  {entry.private && <Lock size={12} className="text-slate-300 mt-1" />}
                </div>
                {entry.triggers.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {entry.triggers.map(t => (
                      <span key={t} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
                {entry.note && <p className="text-xs text-slate-600 leading-relaxed">{entry.note}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="pt-4 space-y-4">
            <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
              <p className="text-sm font-semibold text-pink-800 mb-1">💙 You're not alone</p>
              <p className="text-xs text-pink-600">Based on your recent mood entries, here are some activities that may help you feel better today.</p>
            </div>
            {STRESS_RESOURCES.map((res, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${res.color}15` }}>
                    <res.icon size={18} style={{ color: res.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-slate-900 text-sm">{res.title}</h4>
                      <span className="text-[10px] text-slate-400">{res.duration}</span>
                    </div>
                    <p className="text-xs text-slate-500">{res.desc}</p>
                    <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full mt-1.5 inline-block">{res.tag}</span>
                  </div>
                  <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg mt-1">Try</button>
                </div>
              </div>
            ))}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ When to seek help</p>
              <p className="text-xs text-amber-700">If you're feeling consistently low for more than 2 weeks, please speak to a mental health professional or call iCall: <span className="font-bold">9152987821</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
