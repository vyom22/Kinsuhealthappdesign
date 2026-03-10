import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Plus, X, Check, Flame, Clock, Activity, 
  TrendingUp, Dumbbell, Wind, Footprints, Bike, Play, Pause,
  ChevronRight, Heart, ZapOff, Timer
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const EXERCISE_CATEGORIES = [
  { id: 'cardio', label: 'Cardio', color: '#DC2626', bg: '#FEF2F2', icon: Activity },
  { id: 'strength', label: 'Strength', color: '#3B82F6', bg: '#EFF6FF', icon: Dumbbell },
  { id: 'yoga', label: 'Yoga & Pranayama', color: '#8B5CF6', bg: '#F5F3FF', icon: Wind },
  { id: 'walk', label: 'Walk / Run', color: '#10B981', bg: '#F0FDF4', icon: Footprints },
  { id: 'cycle', label: 'Cycling', color: '#F59E0B', bg: '#FFFBEB', icon: Bike },
  { id: 'other', label: 'Other', color: '#6B7280', bg: '#F9FAFB', icon: Activity },
];

const EXERCISES: Record<string, Array<{ name: string; unit: string; hasSets?: boolean; hasDuration?: boolean; hasDistance?: boolean; hasIncline?: boolean; hasSpeed?: boolean; mets?: number }>> = {
  cardio: [
    { name: 'Treadmill', unit: 'mins', hasDuration: true, hasIncline: true, hasSpeed: true, mets: 7 },
    { name: 'Jumping Jacks', unit: 'reps', hasSets: true, mets: 8 },
    { name: 'Burpees', unit: 'reps', hasSets: true, mets: 10 },
    { name: 'Jump Rope', unit: 'mins', hasDuration: true, mets: 11 },
    { name: 'High Knees', unit: 'mins', hasDuration: true, mets: 9 },
    { name: 'Mountain Climbers', unit: 'reps', hasSets: true, mets: 9 },
  ],
  strength: [
    { name: 'Push-ups', unit: 'reps', hasSets: true, mets: 4 },
    { name: 'Pull-ups', unit: 'reps', hasSets: true, mets: 5 },
    { name: 'Squats', unit: 'reps', hasSets: true, mets: 5 },
    { name: 'Lunges', unit: 'reps', hasSets: true, mets: 4 },
    { name: 'Plank', unit: 'secs', hasDuration: true, mets: 4 },
    { name: 'Deadlift', unit: 'reps', hasSets: true, mets: 5 },
    { name: 'Bench Press', unit: 'reps', hasSets: true, mets: 5 },
  ],
  yoga: [
    { name: 'Surya Namaskar', unit: 'rounds', mets: 3.3 },
    { name: 'Kapalbhati', unit: 'mins', hasDuration: true, mets: 3 },
    { name: 'Anulom Vilom', unit: 'mins', hasDuration: true, mets: 2 },
    { name: 'Bhujangasana', unit: 'rounds', mets: 2.5 },
    { name: 'Trikonasana', unit: 'secs', hasDuration: true, mets: 2.5 },
    { name: 'Virabhadrasana', unit: 'secs', hasDuration: true, mets: 3 },
    { name: 'Meditation', unit: 'mins', hasDuration: true, mets: 1.5 },
    { name: 'Shavasana', unit: 'mins', hasDuration: true, mets: 1 },
  ],
  walk: [
    { name: 'Walking', unit: 'mins', hasDuration: true, hasDistance: true, mets: 3.5 },
    { name: 'Brisk Walking', unit: 'mins', hasDuration: true, hasDistance: true, mets: 5 },
    { name: 'Running', unit: 'mins', hasDuration: true, hasDistance: true, mets: 9 },
    { name: 'Jogging', unit: 'mins', hasDuration: true, hasDistance: true, mets: 7 },
    { name: 'Stairs Climbing', unit: 'floors', mets: 6 },
  ],
  cycle: [
    { name: 'Outdoor Cycling', unit: 'mins', hasDuration: true, hasDistance: true, mets: 7 },
    { name: 'Stationary Bike', unit: 'mins', hasDuration: true, hasSpeed: true, mets: 7 },
  ],
  other: [
    { name: 'Swimming', unit: 'laps', mets: 8 },
    { name: 'HIIT', unit: 'mins', hasDuration: true, mets: 10 },
    { name: 'Stretching', unit: 'mins', hasDuration: true, mets: 2.5 },
    { name: 'Dance', unit: 'mins', hasDuration: true, mets: 6 },
    { name: 'Cricket', unit: 'mins', hasDuration: true, mets: 5 },
    { name: 'Badminton', unit: 'mins', hasDuration: true, mets: 5.5 },
  ],
};

interface LoggedExercise {
  id: number;
  category: string;
  name: string;
  reps?: number;
  sets?: number;
  duration?: number;
  distance?: number;
  incline?: number;
  speed?: number;
  calories: number;
}

const weeklyData = [
  { day: 'M', cal: 320 }, { day: 'T', cal: 180 }, { day: 'W', cal: 450 },
  { day: 'T', cal: 0 }, { day: 'F', cal: 280 }, { day: 'S', cal: 520 }, { day: 'S', cal: 220 },
];

export function ExerciseScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'log' | 'history' | 'recommendations'>('log');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([
    { id: 1, category: 'walk', name: 'Brisk Walking', duration: 30, distance: 2.5, calories: 157 },
    { id: 2, category: 'yoga', name: 'Surya Namaskar', reps: 5, calories: 58 },
    { id: 3, category: 'strength', name: 'Push-ups', reps: 20, sets: 3, calories: 42 },
  ]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<(typeof EXERCISES.cardio)[0] | null>(null);
  const [form, setForm] = useState({ reps: '', sets: '', duration: '', distance: '', incline: '', speed: '' });
  const [showPreWorkoutVitals, setShowPreWorkoutVitals] = useState(false);

  const totalCalories = loggedExercises.reduce((a, b) => a + b.calories, 0);
  const totalDuration = loggedExercises.reduce((a, b) => a + (b.duration || 0), 0);

  const addExercise = () => {
    if (!selectedExercise || !selectedCategory) return;
    const weight = 68; // kg - from profile
    const mets = selectedExercise.mets || 5;
    const duration = parseFloat(form.duration || '20');
    const cal = Math.round((mets * weight * duration) / 60);
    const newEx: LoggedExercise = {
      id: Date.now(),
      category: selectedCategory,
      name: selectedExercise.name,
      reps: form.reps ? parseInt(form.reps) : undefined,
      sets: form.sets ? parseInt(form.sets) : undefined,
      duration: form.duration ? parseFloat(form.duration) : undefined,
      distance: form.distance ? parseFloat(form.distance) : undefined,
      incline: form.incline ? parseFloat(form.incline) : undefined,
      speed: form.speed ? parseFloat(form.speed) : undefined,
      calories: cal,
    };
    setLoggedExercises(prev => [newEx, ...prev]);
    setShowAddExercise(false);
    setSelectedCategory(null);
    setSelectedExercise(null);
    setForm({ reps: '', sets: '', duration: '', distance: '', incline: '', speed: '' });
  };

  const recommendations = [
    { title: 'Morning Walk', desc: 'Good for blood sugar management', duration: '30 min', intensity: 'Low', tag: 'Recommended for Diabetes' },
    { title: 'Chair Yoga', desc: 'Safe for hypertension patients', duration: '20 min', intensity: 'Low', tag: 'Recommended for Hypertension' },
    { title: 'Anulom Vilom', desc: 'Reduces stress and calms the nervous system', duration: '10 min', intensity: 'Very Low', tag: 'Stress Relief' },
    { title: 'Kapalbhati', desc: 'Improves metabolism and energy', duration: '5 min', intensity: 'Moderate', tag: 'General Wellness' },
    { title: 'Surya Namaskar', desc: '5 rounds good for maintaining flexibility', duration: '10 min', intensity: 'Moderate', tag: 'General Wellness' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ChevronLeft size={22} />
          </button>
          <h1 className="font-bold text-slate-900" style={{ fontSize: '18px' }}>Exercise & Activity</h1>
          <button onClick={() => setShowPreWorkoutVitals(true)} className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-rose-500">
            <Heart size={20} />
          </button>
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Calories', val: totalCalories, unit: 'kcal', color: '#DC2626', icon: Flame },
            { label: 'Duration', val: totalDuration, unit: 'min', color: '#0A9B8F', icon: Timer },
            { label: 'Activities', val: loggedExercises.length, unit: 'done', color: '#3B82F6', icon: Activity },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <s.icon size={16} style={{ color: s.color }} className="mx-auto mb-1" />
              <p className="font-bold text-slate-900" style={{ fontSize: '20px' }}>{s.val}</p>
              <p className="text-xs text-slate-400">{s.unit}</p>
              <p className="text-[10px] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-100 flex-shrink-0">
        {(['log', 'history', 'recommendations'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-all border-b-2 ${activeTab === t ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {activeTab === 'log' && (
          <div className="pt-4 space-y-4">
            {/* Add Button */}
            <button onClick={() => setShowAddExercise(true)}
              className="w-full h-14 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
              <Plus size={20} />
              <span className="font-semibold">Log an Activity</span>
            </button>

            {/* Today's Log */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Today's Activity</h3>
              {loggedExercises.map(ex => {
                const cat = EXERCISE_CATEGORIES.find(c => c.id === ex.category);
                return (
                  <div key={ex.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat?.bg }}>
                      {cat && <cat.icon size={18} style={{ color: cat.color }} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{ex.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ex.sets && ex.reps ? `${ex.sets} × ${ex.reps} reps` : ''}
                        {ex.duration ? `${ex.duration} min` : ''}
                        {ex.distance ? ` · ${ex.distance} km` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm" style={{ color: '#DC2626' }}>{ex.calories}</p>
                      <p className="text-[10px] text-slate-400">kcal</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="pt-4 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3" style={{ fontSize: '14px' }}>Weekly Calories Burned</h4>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barCategoryGap="30%">
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis hide />
                    <Bar dataKey="cal" fill="#DC2626" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 text-center mt-1">Total this week: <span className="font-bold text-slate-900">1,970 kcal</span></p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3" style={{ fontSize: '14px' }}>Streak & Consistency</h4>
              <div className="flex gap-2">
                {weeklyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full h-8 rounded-lg flex items-center justify-center ${d.cal > 0 ? 'bg-green-500' : 'bg-slate-100'}`}>
                      {d.cal > 0 && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] text-slate-400">{d.day}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">6 of 7 days active this week 🔥</p>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="pt-4 space-y-3">
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Personalized for You</p>
              <p className="text-xs text-amber-600">Based on your current medications (Metformin, Amlodipine), avoid high-intensity exercise without doctor's advice. Low-to-moderate activity is ideal.</p>
            </div>
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{rec.desc}</p>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{rec.intensity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} />{rec.duration}</span>
                    <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full">{rec.tag}</span>
                  </div>
                  <button className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg">Start</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Exercise Sheet */}
      <AnimatePresence>
        {showAddExercise && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/40 flex items-end">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl max-h-[90%] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  {(selectedCategory || selectedExercise) && (
                    <button onClick={() => { if (selectedExercise) setSelectedExercise(null); else setSelectedCategory(null); }}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  <h3 className="font-bold text-slate-900">
                    {selectedExercise ? selectedExercise.name : selectedCategory ? EXERCISE_CATEGORIES.find(c => c.id === selectedCategory)?.label : 'Choose Exercise'}
                  </h3>
                </div>
                <button onClick={() => { setShowAddExercise(false); setSelectedCategory(null); setSelectedExercise(null); }}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="p-5">
                {!selectedCategory && (
                  <div className="grid grid-cols-2 gap-3">
                    {EXERCISE_CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                        className="p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-transform" style={{ backgroundColor: cat.bg }}>
                        <cat.icon size={24} style={{ color: cat.color }} />
                        <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {selectedCategory && !selectedExercise && (
                  <div className="space-y-2">
                    {(EXERCISES[selectedCategory] || []).map(ex => (
                      <button key={ex.name} onClick={() => setSelectedExercise(ex)}
                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-left">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{ex.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">~{Math.round((ex.mets || 5) * 68 * 20 / 60)} kcal / 20 min</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </button>
                    ))}
                  </div>
                )}

                {selectedExercise && (
                  <div className="space-y-4">
                    {selectedExercise.hasSets && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Sets</label>
                          <input type="number" value={form.sets} onChange={e => setForm(f => ({ ...f, sets: e.target.value }))}
                            placeholder="e.g. 3" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Reps</label>
                          <input type="number" value={form.reps} onChange={e => setForm(f => ({ ...f, reps: e.target.value }))}
                            placeholder="e.g. 15" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl" />
                        </div>
                      </div>
                    )}
                    {selectedExercise.hasDuration && (
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Duration (minutes)</label>
                        <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                          placeholder="e.g. 30" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl" />
                      </div>
                    )}
                    {selectedExercise.hasDistance && (
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Distance (km)</label>
                        <input type="number" value={form.distance} onChange={e => setForm(f => ({ ...f, distance: e.target.value }))}
                          placeholder="e.g. 2.5" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl" />
                      </div>
                    )}
                    {selectedExercise.hasIncline && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Incline (%)</label>
                          <input type="number" value={form.incline} onChange={e => setForm(f => ({ ...f, incline: e.target.value }))}
                            placeholder="e.g. 5" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Speed (km/h)</label>
                          <input type="number" value={form.speed} onChange={e => setForm(f => ({ ...f, speed: e.target.value }))}
                            placeholder="e.g. 6" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl" />
                        </div>
                      </div>
                    )}
                    {form.duration && (
                      <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                        <p className="text-xs text-green-700">Estimated calories burned: <span className="font-bold">{Math.round((selectedExercise.mets || 5) * 68 * parseFloat(form.duration || '0') / 60)} kcal</span></p>
                      </div>
                    )}
                    <button onClick={addExercise} className="w-full h-12 bg-primary text-white rounded-2xl font-semibold">
                      Save Activity
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre/Post Workout Vitals Sheet */}
      <AnimatePresence>
        {showPreWorkoutVitals && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/40 flex items-end">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Log Workout Vitals</h3>
                <button onClick={() => setShowPreWorkoutVitals(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {['pre', 'post'].map(t => (
                    <div key={t} className={`p-3 rounded-xl border ${t === 'pre' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}`}>
                      <p className={`text-xs font-bold mb-3 capitalize ${t === 'pre' ? 'text-blue-700' : 'text-green-700'}`}>{t}-Workout</p>
                      {['Heart Rate', 'BP'].map(v => (
                        <div key={v} className="mb-2">
                          <label className="text-[10px] font-semibold text-slate-500 mb-1 block">{v}</label>
                          <input placeholder={v === 'Heart Rate' ? 'BPM' : 'e.g. 120/80'}
                            className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowPreWorkoutVitals(false)} className="w-full h-12 bg-primary text-white rounded-2xl font-semibold">Save Vitals</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
