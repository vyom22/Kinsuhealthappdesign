import { useNavigate } from 'react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pill, Plus, X, Check, Clock, Calendar, ChevronRight, AlertCircle,
  Heart, Thermometer, Droplets, Moon, Smile, Activity, TrendingUp, TrendingDown,
  Brain, Zap, Scale, Ruler, Wind, Eye, Frown, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

type TrackView = 'main' | 'addMed' | 'adherence' | 'symptomLog' | 'chronicTracker' | 'vitalsLog' | 'vitalsDash' | 'episodeTimeline' | 'episodeDetail';

const medications = [
  { id: 1, name: 'Metformin 500mg', dose: '1 tablet', schedule: 'Morning, after breakfast', adherence: 92, doctor: 'Dr. S. Reddy', status: 'active', nextDose: '8:00 AM tomorrow' },
  { id: 2, name: 'Amlodipine 5mg', dose: '1 tablet', schedule: 'Morning', adherence: 88, doctor: 'Dr. R. Kapoor', status: 'active', nextDose: '2:00 PM today' },
  { id: 3, name: 'Vitamin D3 60K IU', dose: '1 sachet', schedule: 'Weekly, Sunday', adherence: 75, doctor: 'Dr. A. Mehta', status: 'active', nextDose: 'Sunday' },
  { id: 4, name: 'Atorvastatin 10mg', dose: '1 tablet', schedule: 'Night, after dinner', adherence: 95, doctor: 'Dr. R. Kapoor', status: 'active', nextDose: '10:00 PM today' },
];

const adherenceData = [
  { day: 'Mon', taken: 3, missed: 0 }, { day: 'Tue', taken: 3, missed: 1 },
  { day: 'Wed', taken: 4, missed: 0 }, { day: 'Thu', taken: 3, missed: 0 },
  { day: 'Fri', taken: 2, missed: 1 }, { day: 'Sat', taken: 4, missed: 0 },
  { day: 'Sun', taken: 3, missed: 0 },
];

const bpData = [
  { date: '13 Feb', systolic: 132, diastolic: 86 }, { date: '14 Feb', systolic: 128, diastolic: 82 },
  { date: '15 Feb', systolic: 135, diastolic: 88 }, { date: '16 Feb', systolic: 126, diastolic: 80 },
  { date: '17 Feb', systolic: 130, diastolic: 84 }, { date: '18 Feb', systolic: 128, diastolic: 82 },
  { date: '19 Feb', systolic: 125, diastolic: 79 },
];

const sugarData = [
  { date: '13 Feb', fasting: 138, pp: 185 }, { date: '14 Feb', fasting: 142, pp: 192 },
  { date: '15 Feb', fasting: 135, pp: 178 }, { date: '16 Feb', fasting: 148, pp: 200 },
  { date: '17 Feb', fasting: 140, pp: 188 }, { date: '18 Feb', fasting: 136, pp: 182 },
  { date: '19 Feb', fasting: 142, pp: 190 },
];

const vitalCards = [
  { label: 'Blood Pressure', value: '128/84', unit: 'mmHg', icon: Heart, color: '#DC2626', trend: '↓ 3%', status: 'normal' },
  { label: 'Blood Sugar', value: '142', unit: 'mg/dL', icon: Droplets, color: '#F59E0B', trend: '↑ 8%', status: 'elevated' },
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Activity, color: '#0A9B8F', trend: '→ 0%', status: 'normal' },
  { label: 'SpO2', value: '98', unit: '%', icon: Wind, color: '#3B82F6', trend: '→', status: 'normal' },
  { label: 'Weight', value: '68.5', unit: 'kg', icon: Scale, color: '#8B5CF6', trend: '↓ 0.5', status: 'normal' },
  { label: 'Temperature', value: '98.4', unit: '°F', icon: Thermometer, color: '#F97316', trend: '→', status: 'normal' },
];

const symptoms = ['Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Body ache', 'Fever', 'Cough', 'Breathlessness'];
const chronicSymptoms = [
  { name: 'Nausea', severity: 'mild', frequency: '2x this week', trend: 'improving' },
  { name: 'Joint Pain', severity: 'moderate', frequency: '4x this week', trend: 'stable' },
  { name: 'Swelling (ankles)', severity: 'mild', frequency: '1x this week', trend: 'improving' },
  { name: 'Fatigue', severity: 'moderate', frequency: 'Daily', trend: 'worsening' },
];

const episodes = [
  { id: 1, title: 'Viral Fever Episode', date: '5-12 Feb 2026', status: 'resolved', symptoms: ['Fever', 'Body ache', 'Fatigue'], consults: 2, labs: 1 },
  { id: 2, title: 'Diabetes Management', date: 'Ongoing since Jan 2024', status: 'chronic', symptoms: ['Fatigue', 'Frequent urination'], consults: 8, labs: 6 },
  { id: 3, title: 'Hypertension Follow-up', date: 'Ongoing since Mar 2025', status: 'chronic', symptoms: ['Headache', 'Dizziness'], consults: 4, labs: 3 },
];

export default function TrackScreen() {
  const navigate = useNavigate();
  const [view, setView] = useState<TrackView>('main');
  const [selectedEpisode, setSelectedEpisode] = useState(episodes[0]);

  if (view === 'addMed') return <AddMedicationScreen onBack={() => setView('main')} />;
  if (view === 'adherence') return <AdherenceScreen onBack={() => setView('main')} />;
  if (view === 'symptomLog') return <SymptomLogScreen onBack={() => setView('main')} />;
  if (view === 'chronicTracker') return <ChronicTrackerScreen onBack={() => setView('main')} />;
  if (view === 'vitalsLog') return <VitalsLogScreen onBack={() => setView('main')} />;
  if (view === 'vitalsDash') return <VitalsDashboard onBack={() => setView('main')} />;
  if (view === 'episodeTimeline') return <EpisodeTimeline episodes={episodes} onSelect={(e) => { setSelectedEpisode(e); setView('episodeDetail'); }} onBack={() => setView('main')} />;
  if (view === 'episodeDetail') return <EpisodeDetail episode={selectedEpisode} onBack={() => setView('episodeTimeline')} />;

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Track</h2>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        {/* Quick Vitals */}
        <div className="flex items-center justify-between mb-1">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Today's Vitals</h3>
          <button onClick={() => setView('vitalsDash')} className="text-primary" style={{ fontSize: '13px' }}>View Trends</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {vitalCards.slice(0, 3).map((v, i) => (
            <button key={i} onClick={() => setView('vitalsLog')} className="bg-card rounded-2xl p-3 border border-border text-left active:scale-[0.97] transition-transform">
              <v.icon size={16} style={{ color: v.color }} />
              <p className="text-foreground mt-2" style={{ fontSize: '18px', fontWeight: 700 }}>{v.value}</p>
              <p className="text-muted-foreground" style={{ fontSize: '10px' }}>{v.unit}</p>
              <span className={`mt-1 inline-block px-1 rounded text-[10px] ${v.status === 'normal' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{v.trend}</span>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button onClick={() => setView('vitalsLog')} className="bg-card rounded-2xl p-3.5 border border-border flex items-center gap-3 active:scale-[0.98] transition-transform">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center"><Plus size={16} className="text-purple-600" /></div>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Log Vitals</span>
          </button>
          <button onClick={() => setView('symptomLog')} className="bg-card rounded-2xl p-3.5 border border-border flex items-center gap-3 active:scale-[0.98] transition-transform">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"><Zap size={16} className="text-orange-600" /></div>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Log Symptom</span>
          </button>
        </div>

        {/* Medications */}
        <div className="flex items-center justify-between mt-3 mb-1">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Medications</h3>
          <button onClick={() => navigate('/app/medications')} className="text-primary" style={{ fontSize: '13px' }}>View All →</button>
        </div>
        {medications.slice(0, 3).map(m => (
          <button key={m.id} onClick={() => navigate('/app/medications')} className="bg-card rounded-2xl p-3.5 border border-border flex items-center gap-3 w-full text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Pill size={16} className="text-blue-600" /></div>
            <div className="flex-1">
              <p style={{ fontSize: '14px', fontWeight: 500 }}>{m.name}</p>
              <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{m.schedule} · {m.adherence}% adherence</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}

        {/* More Tracking */}
        <div className="flex items-center justify-between mt-3 mb-1">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>More Tracking</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setView('chronicTracker')} className="bg-card rounded-2xl p-3.5 border border-border text-left active:scale-[0.98] transition-transform">
            <AlertCircle size={18} className="text-amber-500 mb-2" />
            <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-foreground">Chronic Symptoms</p>
            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>Track ongoing conditions</p>
          </button>
          <button onClick={() => setView('episodeTimeline')} className="bg-card rounded-2xl p-3.5 border border-border text-left active:scale-[0.98] transition-transform">
            <Brain size={18} className="text-purple-500 mb-2" />
            <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-foreground">Illness Episodes</p>
            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>Linked health events</p>
          </button>
          <button onClick={() => navigate('/app/exercise')} className="bg-card rounded-2xl p-3.5 border border-border text-left active:scale-[0.98] transition-transform">
            <Zap size={18} className="text-green-500 mb-2" />
            <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-foreground">Exercise Log</p>
            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>Log workouts & activity</p>
          </button>
          <button onClick={() => navigate('/app/sleep')} className="bg-card rounded-2xl p-3.5 border border-border text-left active:scale-[0.98] transition-transform">
            <Moon size={18} className="text-indigo-500 mb-2" />
            <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-foreground">Sleep Tracker</p>
            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>Log sleep schedule</p>
          </button>
        </div>

        {/* Routine Tracking */}
        <div className="mt-3 mb-1">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Routine Tracking</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { label: 'Sleep', icon: Moon, value: '7.5 hrs', color: '#6366F1' },
            { label: 'Mood', icon: Smile, value: 'Good', color: '#F59E0B' },
            { label: 'Stress', icon: Frown, value: 'Low', color: '#EF4444' },
            { label: 'Vitamins', icon: Pill, value: '2/3 taken', color: '#10B981' },
          ].map((r, i) => (
            <div key={i} className="min-w-[110px] bg-card rounded-2xl p-3 border border-border">
              <r.icon size={16} style={{ color: r.color }} />
              <p className="text-foreground mt-2" style={{ fontSize: '14px', fontWeight: 600 }}>{r.value}</p>
              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{r.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddMedicationScreen({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [times, setTimes] = useState(['08:00 AM']);

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Add Medication</h3>
        </div>
      </div>
      <div className="px-5 py-5 flex flex-col gap-5">
        <div>
          <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Medication Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Metformin 500mg" className="w-full h-12 px-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '15px' }} />
        </div>
        <div>
          <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Dosage</label>
          <input value={dose} onChange={e => setDose(e.target.value)} placeholder="e.g. 1 tablet" className="w-full h-12 px-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '15px' }} />
        </div>
        <div>
          <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Frequency</label>
          <div className="flex gap-2">
            {['Daily', 'Twice/day', 'Weekly', 'As needed'].map(f => (
              <button key={f} onClick={() => setFrequency(f)} className={`px-3 py-2 rounded-xl ${frequency === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`} style={{ fontSize: '12px' }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Reminder Times</label>
          {times.map((t, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-12 px-4 bg-card border border-border rounded-xl flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span style={{ fontSize: '15px' }}>{t}</span>
              </div>
            </div>
          ))}
          <button onClick={() => setTimes([...times, '02:00 PM'])} className="text-primary flex items-center gap-1 mt-1" style={{ fontSize: '13px' }}>
            <Plus size={14} /> Add another time
          </button>
        </div>
        <div>
          <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Prescribing Doctor</label>
          <input placeholder="e.g. Dr. Kapoor" className="w-full h-12 px-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '15px' }} />
        </div>
        <button onClick={onBack} className="w-full h-12 bg-primary text-primary-foreground rounded-2xl mt-4">Save Medication</button>
      </div>
    </div>
  );
}

function AdherenceScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Medication Adherence</h3>
        </div>
      </div>
      <div className="px-5 py-4 flex flex-col gap-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Overall Adherence</span>
            <span style={{ fontSize: '28px', fontWeight: 700 }} className="text-primary">89%</span>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adherenceData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis hide />
                <Bar dataKey="taken" fill="#0A9B8F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="missed" fill="#FCA5A5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: '11px' }}><span className="w-2 h-2 rounded-sm bg-primary" /> Taken</span>
            <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: '11px' }}><span className="w-2 h-2 rounded-sm bg-red-300" /> Missed</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-3">Reminder Timeline</h4>
          {[
            { time: '8:00 AM', med: 'Metformin 500mg', status: 'taken', at: '8:05 AM' },
            { time: '8:00 AM', med: 'Amlodipine 5mg', status: 'taken', at: '8:05 AM' },
            { time: '2:00 PM', med: 'Ecosprin 75mg', status: 'upcoming', at: '' },
            { time: '10:00 PM', med: 'Atorvastatin 10mg', status: 'upcoming', at: '' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${r.status === 'taken' ? 'bg-green-100' : 'bg-muted'}`}>
                {r.status === 'taken' ? <Check size={12} className="text-green-600" /> : <Clock size={12} className="text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '13px', fontWeight: 500 }}>{r.med}</p>
                <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{r.time}{r.at ? ` · Taken at ${r.at}` : ''}</p>
              </div>
              {r.status === 'upcoming' && (
                <button className="px-2.5 py-1 bg-primary text-primary-foreground rounded-full" style={{ fontSize: '11px' }}>Mark Taken</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SymptomLogScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [severity, setSeverity] = useState(5);
  const [logged, setLogged] = useState(false);

  if (logged) return (
    <div className="min-h-full bg-background flex flex-col items-center justify-center px-5">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
        <Check size={28} className="text-green-600" />
      </motion.div>
      <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">Symptoms Logged</h3>
      <p className="text-muted-foreground text-center" style={{ fontSize: '14px' }}>Your symptoms have been recorded and linked to your health timeline.</p>
      <button onClick={onBack} className="mt-6 px-8 h-12 bg-primary text-primary-foreground rounded-2xl">Done</button>
    </div>
  );

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Quick Symptom Log</h3>
        </div>
      </div>
      <div className="px-5 py-5 flex flex-col gap-5">
        <div>
          <p className="text-foreground mb-3" style={{ fontSize: '14px', fontWeight: 600 }}>What are you experiencing?</p>
          <div className="flex flex-wrap gap-2">
            {symptoms.map(s => (
              <button
                key={s}
                onClick={() => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                className={`px-3.5 py-2 rounded-full transition-all ${selected.includes(s) ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}
                style={{ fontSize: '13px' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-foreground mb-3" style={{ fontSize: '14px', fontWeight: 600 }}>Severity (1-10)</p>
          <input type="range" min="1" max="10" value={severity} onChange={e => setSeverity(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between text-muted-foreground" style={{ fontSize: '11px' }}>
            <span>Mild</span><span className="text-foreground" style={{ fontWeight: 600 }}>{severity}/10</span><span>Severe</span>
          </div>
        </div>
        <div>
          <p className="text-foreground mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>Notes (optional)</p>
          <textarea placeholder="Add any additional details..." className="w-full h-20 p-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none" style={{ fontSize: '14px' }} />
        </div>
        <button onClick={() => setLogged(true)} disabled={selected.length === 0} className="w-full h-12 bg-primary text-primary-foreground rounded-2xl disabled:opacity-40">Log Symptoms</button>
      </div>
    </div>
  );
}

function ChronicTrackerScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Chronic Symptom Tracker</h3>
        </div>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3">
        <p className="text-muted-foreground" style={{ fontSize: '13px' }}>Track recurring symptoms over time</p>
        {chronicSymptoms.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: '15px', fontWeight: 600 }}>{s.name}</p>
              <span className={`px-2 py-0.5 rounded-full ${s.trend === 'improving' ? 'bg-green-50 text-green-600' : s.trend === 'worsening' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`} style={{ fontSize: '11px', fontWeight: 500 }}>
                {s.trend === 'improving' ? '↓' : s.trend === 'worsening' ? '↑' : '→'} {s.trend}
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-muted-foreground" style={{ fontSize: '12px' }}>Severity: <span className="text-foreground" style={{ fontWeight: 500 }}>{s.severity}</span></span>
              <span className="text-muted-foreground" style={{ fontSize: '12px' }}>Freq: <span className="text-foreground" style={{ fontWeight: 500 }}>{s.frequency}</span></span>
            </div>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: 7 }).map((_, d) => (
                <div key={d} className={`flex-1 h-6 rounded ${d < (i === 3 ? 7 : i === 1 ? 4 : 2) ? (i === 3 ? 'bg-red-200' : i === 1 ? 'bg-amber-200' : 'bg-green-200') : 'bg-muted'}`} />
              ))}
            </div>
            <div className="flex justify-between text-muted-foreground mt-1" style={{ fontSize: '9px' }}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        ))}
        <button className="w-full h-12 border border-border rounded-2xl text-foreground flex items-center justify-center gap-2 mt-2">
          <Plus size={16} /> Add Symptom to Track
        </button>
      </div>
    </div>
  );
}

function VitalsLogScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Log Vitals</h3>
        </div>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4">
        {[
          { label: 'Blood Pressure', placeholder1: 'Systolic', placeholder2: 'Diastolic', unit: 'mmHg' },
          { label: 'Blood Sugar (Fasting)', placeholder1: 'Value', unit: 'mg/dL' },
          { label: 'Heart Rate', placeholder1: 'BPM', unit: 'bpm' },
          { label: 'Weight', placeholder1: 'Weight', unit: 'kg' },
          { label: 'Temperature', placeholder1: 'Temp', unit: '°F' },
          { label: 'SpO2', placeholder1: 'Value', unit: '%' },
        ].map((v, i) => (
          <div key={i}>
            <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>{v.label}</label>
            <div className="flex gap-2">
              <input placeholder={v.placeholder1} className="flex-1 h-11 px-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '14px' }} />
              {v.placeholder2 && <input placeholder={v.placeholder2} className="flex-1 h-11 px-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '14px' }} />}
              <span className="h-11 px-3 flex items-center text-muted-foreground bg-muted rounded-xl" style={{ fontSize: '12px' }}>{v.unit}</span>
            </div>
          </div>
        ))}
        <button onClick={onBack} className="w-full h-12 bg-primary text-primary-foreground rounded-2xl mt-2">Save Vitals</button>
      </div>
    </div>
  );
}

function VitalsDashboard({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Vitals Trends</h3>
        </div>
      </div>
      <div className="px-5 py-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {vitalCards.map((v, i) => (
            <div key={i} className="bg-card rounded-2xl p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <v.icon size={14} style={{ color: v.color }} />
                <span className="text-muted-foreground" style={{ fontSize: '11px' }}>{v.label}</span>
              </div>
              <p style={{ fontSize: '20px', fontWeight: 700 }}>{v.value} <span className="text-muted-foreground" style={{ fontSize: '11px' }}>{v.unit}</span></p>
              <span className={`text-[10px] ${v.status === 'normal' ? 'text-green-600' : 'text-amber-600'}`}>{v.trend}</span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-2">Blood Pressure (7 days)</h4>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bpData}>
                <defs>
                  <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="systolic" stroke="#DC2626" strokeWidth={2} fill="url(#bpGrad)" dot={{ r: 3, fill: '#DC2626' }} />
                <Area type="monotone" dataKey="diastolic" stroke="#F97316" strokeWidth={2} fill="transparent" dot={{ r: 3, fill: '#F97316' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-2">Blood Sugar (7 days)</h4>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sugarData}>
                <defs>
                  <linearGradient id="sugarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="fasting" stroke="#F59E0B" strokeWidth={2} fill="url(#sugarGrad)" dot={{ r: 3, fill: '#F59E0B' }} />
                <Area type="monotone" dataKey="pp" stroke="#EF4444" strokeWidth={2} fill="transparent" dot={{ r: 3, fill: '#EF4444' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function EpisodeTimeline({ episodes, onSelect, onBack }: { episodes: any[]; onSelect: (e: any) => void; onBack: () => void }) {
  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Illness Episodes</h3>
        </div>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3">
        {episodes.map((ep: any) => (
          <button key={ep.id} onClick={() => onSelect(ep)} className="bg-card rounded-2xl p-4 border border-border text-left w-full active:scale-[0.99] transition-transform">
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: '15px', fontWeight: 600 }}>{ep.title}</p>
              <span className={`px-2 py-0.5 rounded-full ${ep.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`} style={{ fontSize: '11px', fontWeight: 500 }}>
                {ep.status}
              </span>
            </div>
            <p className="text-muted-foreground mb-2" style={{ fontSize: '12px' }}>{ep.date}</p>
            <div className="flex gap-2">
              {ep.symptoms.map((s: string) => (
                <span key={s} className="px-2 py-0.5 bg-muted rounded text-muted-foreground" style={{ fontSize: '10px' }}>{s}</span>
              ))}
            </div>
            <div className="flex gap-3 mt-2 text-muted-foreground" style={{ fontSize: '11px' }}>
              <span>{ep.consults} consults</span>
              <span>{ep.labs} lab reports</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function EpisodeDetail({ episode, onBack }: { episode: any; onBack: () => void }) {
  const timeline = [
    { date: '5 Feb', event: 'Symptom onset', desc: 'Fever 101°F, body ache, fatigue', type: 'symptom' },
    { date: '6 Feb', event: 'Consultation', desc: 'Dr. Anand Mehta - General Medicine', type: 'consult' },
    { date: '7 Feb', event: 'Lab Test', desc: 'CBC + Dengue NS1 + Typhoid Panel', type: 'lab' },
    { date: '8 Feb', event: 'Results', desc: 'CBC: WBC 5.2K, Platelets 180K. NS1 Negative.', type: 'lab' },
    { date: '10 Feb', event: 'Follow-up', desc: 'Fever resolved. Continue medication 3 more days.', type: 'consult' },
    { date: '12 Feb', event: 'Resolved', desc: 'All symptoms cleared. No further medication.', type: 'resolved' },
  ];

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{episode.title}</h3>
        </div>
      </div>
      <div className="px-5 py-4 flex flex-col gap-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-0.5 rounded-full ${episode.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`} style={{ fontSize: '11px', fontWeight: 500 }}>{episode.status}</span>
            <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{episode.date}</span>
          </div>
          <div className="flex gap-2 mt-2">
            {episode.symptoms.map((s: string) => (
              <span key={s} className="px-2.5 py-1 bg-primary/10 text-primary rounded-full" style={{ fontSize: '12px' }}>{s}</span>
            ))}
          </div>
        </div>

        <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Timeline</h4>
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
          {timeline.map((t, i) => (
            <div key={i} className="relative mb-4 last:mb-0">
              <div className={`absolute left-[-18px] top-1 w-3 h-3 rounded-full border-2 ${t.type === 'resolved' ? 'bg-green-500 border-green-500' : t.type === 'consult' ? 'bg-blue-500 border-blue-500' : t.type === 'lab' ? 'bg-purple-500 border-purple-500' : 'bg-amber-500 border-amber-500'}`} />
              <div className="bg-card rounded-xl p-3 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{t.event}</p>
                  <span className="text-muted-foreground" style={{ fontSize: '11px' }}>{t.date}</span>
                </div>
                <p className="text-muted-foreground" style={{ fontSize: '12px', lineHeight: '1.5' }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}