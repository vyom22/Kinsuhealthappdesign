import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Plus, Clock, Check, X, AlertTriangle, Pill, Bell,
  Sun, Coffee, Moon, UtensilsCrossed, TrendingUp, ChevronRight,
  Camera, Calendar, AlarmClock, Activity, User, ChevronDown, Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

type MedStatus = 'taken' | 'missed' | 'upcoming';
type MedFrequency = 'daily' | 'weekly' | 'monthly' | 'sos';

interface Medicine {
  id: number; name: string; dosage: string; mealTime: string;
  status: MedStatus; doctor: string; frequency: MedFrequency;
  weekDay?: string; monthDate?: number; alarm?: boolean; sideEffects?: string;
}

const MEAL_TIMES = [
  { key: 'empty_stomach', label: 'Empty Stomach', sublabel: 'First thing on waking', icon: Sun, color: '#F97316', alarm: true },
  { key: 'before_breakfast', label: 'Before Breakfast', sublabel: '7:30 AM', icon: Coffee, color: '#F59E0B' },
  { key: 'after_breakfast', label: 'After Breakfast', sublabel: '9:00 AM', icon: Coffee, color: '#10B981' },
  { key: 'before_lunch', label: 'Before Lunch', sublabel: '1:00 PM', icon: UtensilsCrossed, color: '#3B82F6' },
  { key: 'after_lunch', label: 'After Lunch', sublabel: '2:00 PM', icon: UtensilsCrossed, color: '#6366F1' },
  { key: 'before_dinner', label: 'Before Dinner', sublabel: '7:30 PM', icon: Moon, color: '#8B5CF6' },
  { key: 'after_dinner', label: 'After Dinner', sublabel: '9:00 PM', icon: Moon, color: '#EC4899' },
  { key: 'bedtime', label: 'At Bedtime', sublabel: '10:30 PM', icon: Moon, color: '#6366F1' },
];

const initialMedicines: Medicine[] = [
  { id: 1, name: 'Metformin', dosage: '500mg', mealTime: 'after_breakfast', status: 'taken', doctor: 'Dr. S. Reddy', frequency: 'daily', sideEffects: 'Nausea, stomach upset' },
  { id: 2, name: 'Ecosprin', dosage: '75mg', mealTime: 'after_breakfast', status: 'missed', doctor: 'Dr. R. Kapoor', frequency: 'daily' },
  { id: 3, name: 'Amlodipine', dosage: '5mg', mealTime: 'after_breakfast', status: 'upcoming', doctor: 'Dr. R. Kapoor', frequency: 'daily', sideEffects: 'Swelling in feet' },
  { id: 4, name: 'Atorvastatin', dosage: '10mg', mealTime: 'after_dinner', status: 'upcoming', doctor: 'Dr. R. Kapoor', frequency: 'daily', sideEffects: 'Muscle pain' },
  { id: 5, name: 'Calcium + D3', dosage: '500mg', mealTime: 'after_dinner', status: 'upcoming', doctor: 'Dr. A. Mehta', frequency: 'daily' },
  { id: 6, name: 'Vitamin D3', dosage: '60K IU', mealTime: 'after_breakfast', status: 'upcoming', doctor: 'Dr. A. Mehta', frequency: 'weekly', weekDay: 'Sunday' },
  { id: 7, name: 'B12 Injection', dosage: '1500mcg', mealTime: 'after_breakfast', status: 'upcoming', doctor: 'Dr. A. Mehta', frequency: 'monthly', monthDate: 1 },
];

const sosMeds = [
  { id: 101, name: 'Paracetamol', dosage: '650mg', reason: 'High Fever (>100°F)', doctor: 'Dr. S. Reddy', color: '#F97316' },
  { id: 102, name: 'Ondansetron', dosage: '4mg', reason: 'Severe Nausea / Vomiting', doctor: 'Dr. R. Kapoor', color: '#3B82F6' },
  { id: 103, name: 'Pan 40', dosage: '40mg', reason: 'Severe Acidity / Heartburn', doctor: 'Dr. S. Reddy', color: '#8B5CF6' },
  { id: 104, name: 'SOS Nitrate', dosage: '0.5mg', reason: 'Chest Pain (Emergency)', doctor: 'Dr. R. Kapoor', color: '#DC2626' },
];

const adherenceData = [
  { day: 'M', taken: 5, missed: 0 }, { day: 'T', taken: 4, missed: 1 },
  { day: 'W', taken: 5, missed: 0 }, { day: 'T', taken: 4, missed: 0 },
  { day: 'F', taken: 3, missed: 1 }, { day: 'S', taken: 5, missed: 0 },
  { day: 'S', taken: 4, missed: 0 },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function MedCircle({ status }: { status: MedStatus }) {
  if (status === 'taken') return (
    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
      <Check size={13} className="text-white" strokeWidth={3} />
    </div>
  );
  if (status === 'missed') return (
    <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 shadow-sm">
      <X size={13} className="text-white" strokeWidth={3} />
    </div>
  );
  return (
    <div className="w-7 h-7 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center flex-shrink-0">
      <Clock size={11} className="text-slate-400" />
    </div>
  );
}

function WeeklyView({ medicines, onTake }: { medicines: Medicine[]; onTake: (id: number) => void }) {
  const allMeds = medicines.filter(m => m.frequency !== 'sos');
  const mockWeekStatus: Record<number, string[]> = {
    1: ['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken'],
    2: ['taken', 'missed', 'taken', 'taken', 'taken', 'taken', 'taken'],
    3: ['taken', 'taken', 'taken', 'taken', 'missed', 'taken', 'upcoming'],
    4: ['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'upcoming'],
    5: ['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'upcoming'],
    6: ['taken', '', '', '', '', '', 'upcoming'],
    7: ['upcoming', '', '', '', '', '', ''],
  };
  return (
    <div className="pt-3 space-y-3">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-8 border-b border-slate-100">
          <div className="p-2" />
          {weekDays.map(d => (
            <div key={d} className="p-2 text-center text-[10px] font-semibold text-slate-400">{d}</div>
          ))}
        </div>
        {allMeds.map((med) => {
          const weekStatuses = mockWeekStatus[med.id] || [];
          return (
            <div key={med.id} className="grid grid-cols-8 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <div className="p-2.5 flex flex-col justify-center">
                <p className="text-[11px] font-semibold text-slate-800 leading-tight">{med.name}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{med.dosage}</p>
                {med.frequency === 'weekly' && (
                  <span className="text-[9px] bg-blue-50 text-blue-600 rounded px-1 mt-0.5 w-fit">{med.weekDay}</span>
                )}
              </div>
              {weekDays.map((d, di) => {
                const s = weekStatuses[di];
                return (
                  <div key={d} className="p-1.5 flex items-center justify-center">
                    {s === 'taken' ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check size={10} className="text-white" strokeWidth={3} />
                      </div>
                    ) : s === 'missed' ? (
                      <div className="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center">
                        <X size={10} className="text-white" strokeWidth={3} />
                      </div>
                    ) : s === 'upcoming' ? (
                      <div className="w-6 h-6 rounded-full border-2 border-primary/40 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      </div>
                    ) : med.frequency === 'weekly' && d !== med.weekDay?.slice(0, 3) ? (
                      <div className="w-1 h-1 rounded-full bg-slate-100" />
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-slate-100" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 px-1">
        {[{ color: 'bg-green-500', label: 'Taken' }, { color: 'bg-red-400', label: 'Missed' }, { color: 'border-2 border-primary/40', label: 'Upcoming' }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${l.color}`} />
            <span className="text-xs text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyView({ medicines }: { medicines: Medicine[] }) {
  const days = Array.from({ length: 29 }, (_, i) => i + 1);
  const mockAdherence = (day: number) => {
    if (day > 28) return null;
    if (day === 2 || day === 9 || day === 16) return 60;
    if (day === 5 || day === 12) return 80;
    return 95 + Math.floor(Math.random() * 5);
  };
  return (
    <div className="pt-3">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <h4 className="font-semibold text-slate-900 text-sm mb-3">February 2026 - Monthly Adherence</h4>
        <div className="grid grid-cols-7 gap-1.5">
          {['S','M','T','W','T','F','S'].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-slate-400 pb-1">{d}</div>
          ))}
          {[...Array(6)].map((_, i) => <div key={`e${i}`} />)}
          {days.map(day => {
            const adh = mockAdherence(day);
            const color = !adh ? 'bg-slate-50 text-slate-300' : adh >= 90 ? 'bg-green-500 text-white' : adh >= 70 ? 'bg-amber-400 text-white' : 'bg-red-400 text-white';
            return (
              <div key={day} className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-semibold ${color}`}>
                {day <= 28 ? day : ''}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3">
          {[{ color: 'bg-green-500', label: '≥90%' }, { color: 'bg-amber-400', label: '70-89%' }, { color: 'bg-red-400', label: '<70%' }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded ${l.color}`} />
              <span className="text-[10px] text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddMedicationModal({ onClose, onAdd }: { onClose: () => void; onAdd: (med: Partial<Medicine>) => void }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [mealTime, setMealTime] = useState('after_breakfast');
  const [frequency, setFrequency] = useState<MedFrequency>('daily');
  const [weekDay, setWeekDay] = useState('Monday');
  const [monthDate, setMonthDate] = useState(1);
  const [doctor, setDoctor] = useState('');
  const [alarm, setAlarm] = useState(false);
  const [step, setStep] = useState<'form' | 'confirm'>('form');

  const handleSave = () => {
    onAdd({ name, dosage, mealTime, frequency, weekDay, monthDate, doctor, alarm, status: 'upcoming' });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/40 flex items-end"
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full bg-white rounded-t-3xl max-h-[90%] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-900">Add Medication</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Medicine Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Metformin 500mg"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Dosage</label>
            <input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g. 1 tablet, 5mg"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">When to Take</label>
            <div className="grid grid-cols-2 gap-2">
              {MEAL_TIMES.map(mt => (
                <button key={mt.key} onClick={() => setMealTime(mt.key)}
                  className={`p-3 rounded-xl border text-left transition-all ${mealTime === mt.key ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center gap-2">
                    <mt.icon size={14} style={{ color: mt.color }} />
                    <div>
                      <p className={`text-xs font-semibold ${mealTime === mt.key ? 'text-primary' : 'text-slate-700'}`}>{mt.label}</p>
                      <p className="text-[10px] text-slate-400">{mt.sublabel}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Frequency</label>
            <div className="grid grid-cols-4 gap-2">
              {(['daily', 'weekly', 'monthly', 'sos'] as MedFrequency[]).map(f => (
                <button key={f} onClick={() => setFrequency(f)}
                  className={`py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${frequency === f ? 'bg-primary text-white' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          {frequency === 'weekly' && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Day of Week</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <button key={d} onClick={() => setWeekDay(d)}
                    className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap font-medium transition-all ${weekDay === d ? 'bg-primary text-white' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}
          {frequency === 'monthly' && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Date of Month</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[1, 5, 10, 15, 20, 25, 28].map(d => (
                  <button key={d} onClick={() => setMonthDate(d)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold flex-shrink-0 transition-all ${monthDate === d ? 'bg-primary text-white' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Prescribing Doctor</label>
            <input value={doctor} onChange={e => setDoctor(e.target.value)} placeholder="e.g. Dr. Kapoor"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400" />
          </div>
          {(mealTime === 'empty_stomach') && (
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-3">
                <AlarmClock size={18} className="text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Set Wake-Up Alarm</p>
                  <p className="text-xs text-amber-600">Recommended for empty stomach meds</p>
                </div>
              </div>
              <button onClick={() => setAlarm(!alarm)}
                className={`w-11 h-6 rounded-full transition-all relative ${alarm ? 'bg-amber-500' : 'bg-slate-200'}`}>
                <motion.div className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                  animate={{ left: alarm ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 h-12 border border-slate-200 rounded-2xl text-slate-600 font-medium">Cancel</button>
            <button onClick={handleSave} disabled={!name}
              className="flex-1 h-12 bg-primary text-white rounded-2xl font-semibold disabled:opacity-40 active:scale-[0.98] transition-transform">
              Save Medicine
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MedicationsScreen() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedMed, setExpandedMed] = useState<number | null>(null);

  const dailyMeds = medicines.filter(m => m.frequency === 'daily');
  const taken = dailyMeds.filter(m => m.status === 'taken').length;
  const missed = dailyMeds.filter(m => m.status === 'missed').length;
  const upcoming = dailyMeds.filter(m => m.status === 'upcoming').length;
  const progress = dailyMeds.length > 0 ? (taken / dailyMeds.length) * 100 : 0;

  const takeMed = (id: number) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, status: 'taken' as MedStatus } : m));
  };

  const addMed = (med: Partial<Medicine>) => {
    setMedicines(prev => [...prev, { id: Date.now(), status: 'upcoming', ...med } as Medicine]);
  };

  const groupedByMealTime = MEAL_TIMES.map(mt => ({
    ...mt,
    meds: medicines.filter(m => m.mealTime === mt.key && m.frequency !== 'sos'),
  })).filter(mt => mt.meds.length > 0);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ChevronLeft size={24} className="text-slate-900" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Medications</h1>
          <button onClick={() => setShowAddModal(true)} className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-primary">
            <Plus size={24} />
          </button>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-primary to-[#088A7F] rounded-2xl p-4 text-white">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-white/70 text-xs mb-0.5">Today's Progress</p>
              <h2 className="text-3xl font-bold">{Math.round(progress)}<span className="text-lg font-normal text-white/80">%</span></h2>
            </div>
            <div className="flex gap-2 text-center">
              {[{ label: 'Taken', val: taken, bg: 'bg-white/20' }, { label: 'Missed', val: missed, bg: 'bg-red-400/30' }, { label: 'Left', val: upcoming, bg: 'bg-white/10' }].map(b => (
                <div key={b.label} className={`${b.bg} rounded-xl px-2.5 py-2`}>
                  <p className="text-xs text-white/70">{b.label}</p>
                  <p className="font-bold text-lg leading-tight">{b.val}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Medication dots: green=taken, red=missed, white/dim=upcoming */}
          <div className="flex gap-1.5 mb-1.5">
            {dailyMeds.map(m => (
              <div key={m.id} className={`flex-1 h-1.5 rounded-full ${m.status === 'taken' ? 'bg-white' : m.status === 'missed' ? 'bg-red-300' : 'bg-white/30'}`} />
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {dailyMeds.map(m => (
              <div key={m.id} className={`w-5 h-5 rounded-full flex items-center justify-center ${m.status === 'taken' ? 'bg-white' : m.status === 'missed' ? 'bg-red-400' : 'bg-white/20 border border-white/30'}`}>
                {m.status === 'taken' && <Check size={10} className="text-primary" strokeWidth={3} />}
                {m.status === 'missed' && <X size={10} className="text-white" strokeWidth={3} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="px-5 pt-3 pb-1 flex-shrink-0">
        <div className="flex bg-white rounded-xl p-1 border border-slate-100 shadow-sm">
          {(['daily', 'weekly', 'monthly'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${view === v ? 'bg-primary text-white shadow-sm' : 'text-slate-400'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {view === 'daily' && (
          <div className="space-y-4 pt-3">
            {groupedByMealTime.map(mt => (
              <div key={mt.key}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${mt.color}20` }}>
                    <mt.icon size={14} style={{ color: mt.color }} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{mt.label}</span>
                  <span className="text-xs text-slate-400">· {mt.sublabel}</span>
                  {mt.alarm && (
                    <div className="ml-auto flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <AlarmClock size={9} /> Alarm set
                    </div>
                  )}
                </div>
                {mt.meds.map(med => (
                  <div key={med.id} className="mb-2">
                    <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-sm flex items-center gap-3">
                      <MedCircle status={med.status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm">{med.name}</h4>
                          {med.frequency === 'weekly' && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Weekly · {med.weekDay}</span>
                          )}
                          {med.frequency === 'monthly' && (
                            <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">Monthly · {med.monthDate}st</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{med.dosage} · <span className="text-slate-400">{med.doctor}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        {med.sideEffects && (
                          <button onClick={() => setExpandedMed(expandedMed === med.id ? null : med.id)}
                            className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center">
                            <ChevronDown size={12} className={`text-slate-400 transition-transform ${expandedMed === med.id ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                        {med.status === 'upcoming' ? (
                          <button onClick={() => takeMed(med.id)}
                            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm shadow-primary/20">
                            Take
                          </button>
                        ) : med.status === 'taken' ? (
                          <div className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-semibold rounded-xl border border-green-100">✓ Taken</div>
                        ) : (
                          <div className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">Missed</div>
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedMed === med.id && med.sideEffects && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden">
                          <div className="bg-amber-50 border border-amber-100 rounded-b-xl px-4 py-3 -mt-2 pt-4">
                            <p className="text-xs font-semibold text-amber-700 mb-1">Possible Side Effects</p>
                            <p className="text-xs text-amber-600">{med.sideEffects}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ))}

            {/* SOS Section */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center">
                  <Zap size={14} className="text-red-500" />
                </div>
                <h3 className="font-bold text-slate-900">SOS / Emergency Medicines</h3>
                <span className="ml-auto text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full border border-red-100">Use only when needed</span>
              </div>
              {sosMeds.map(med => (
                <div key={med.id} className="bg-white rounded-2xl p-4 border border-red-100 mb-2 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${med.color}15` }}>
                      <Pill size={18} style={{ color: med.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">{med.name} <span className="text-slate-400 font-normal">({med.dosage})</span></h4>
                      <p className="text-xs text-slate-500 mt-0.5">For: <span className="text-amber-700 font-medium">{med.reason}</span></p>
                      <p className="text-[10px] text-slate-400">{med.doctor}</p>
                    </div>
                    <button className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl">
                      Log Use
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Adherence Chart */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900">This Week's Adherence</h3>
                <span className="text-sm font-bold text-primary">89%</span>
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adherenceData} barCategoryGap="25%">
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis hide />
                    <Bar dataKey="taken" fill="#0A9B8F" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="missed" fill="#FCA5A5" radius={[4, 4, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-1">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-primary" /><span className="text-xs text-slate-500">Taken</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-red-300" /><span className="text-xs text-slate-500">Missed</span></div>
              </div>
            </div>
          </div>
        )}

        {view === 'weekly' && <WeeklyView medicines={medicines} onTake={takeMed} />}
        {view === 'monthly' && <MonthlyView medicines={medicines} />}
      </div>

      {/* FAB */}
      <div className="absolute bottom-6 right-5">
        <button onClick={() => setShowAddModal(true)}
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {showAddModal && <AddMedicationModal onClose={() => setShowAddModal(false)} onAdd={addMed} />}
      </AnimatePresence>
    </div>
  );
}
