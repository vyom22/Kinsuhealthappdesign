import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Bell, AlertTriangle, FileText, Pill, Activity, Heart, Thermometer,
  ChevronRight, Calendar, Upload, Plus, Moon, Sun, TrendingUp, Clock, Sparkles, X,
  Stethoscope, TestTube, Syringe, Brain, Settings, Palette, Flame, Dumbbell, Utensils,
  Wind, Smile, Users, AlertCircle, ChevronLeft
} from 'lucide-react';
import { useApp } from './AppContext';

const MOTIVATIONAL_SLIDES = [
  { emoji: '🌅', headline: 'Great morning, Priya!', subline: 'Your health journey continues today.', bg: 'from-primary to-[#088A7F]', tip: 'Tip: Take Metformin after breakfast' },
  { emoji: '💪', headline: 'Day 15 — Keep it up!', subline: 'You\'re building a health habit, one day at a time.', bg: 'from-[#3B82F6] to-[#1D4ED8]', tip: 'Your blood pressure is improving 📉' },
  { emoji: '🎯', headline: 'Goal: Manage Blood Sugar', subline: 'Your HbA1c went from 7.2 → 6.8. Progress!', bg: 'from-[#8B5CF6] to-[#6D28D9]', tip: 'Log today\'s vitals to stay on track' },
  { emoji: '❤️', headline: 'Your family is rooting for you', subline: 'Amma\'s readings are looking good too!', bg: 'from-[#EC4899] to-[#BE185D]', tip: 'Caregiving is a two-way street 🤝' },
];

const quickActions = [
  { icon: Upload, label: 'Upload Record', color: '#0A9B8F', bg: '#E6F7F6', path: '/app/vault', action: 'upload' },
  { icon: Pill, label: 'Medications', color: '#3B82F6', bg: '#EFF6FF', path: '/app/medications' },
  { icon: Activity, label: 'Log Vitals', color: '#8B5CF6', bg: '#F5F3FF', path: '/app/track', action: 'vitals' },
  { icon: AlertTriangle, label: 'SOS', color: '#DC2626', bg: '#FEF2F2', path: '/app/sos' },
];

const moreQuickActions = [
  { icon: Dumbbell, label: 'Exercise', color: '#DC2626', bg: '#FEF2F2', path: '/app/exercise' },
  { icon: Utensils, label: 'Diet', color: '#F59E0B', bg: '#FFFBEB', path: '/app/diet' },
  { icon: Moon, label: 'Sleep', color: '#4F46E5', bg: '#EEF2FF', path: '/app/sleep' },
  { icon: Smile, label: 'Mood', color: '#EC4899', bg: '#FDF2F8', path: '/app/mood' },
  { icon: Users, label: 'Community', color: '#10B981', bg: '#F0FDF4', path: '/app/community' },
  { icon: Settings, label: 'Settings', color: '#6B7280', bg: '#F9FAFB', path: '/app/settings' },
];

const upcomingMeds = [
  { id: 1, name: 'Metformin 500mg', time: '8:00 AM', status: 'taken', doctor: 'Dr. S. Reddy' },
  { id: 2, name: 'Ecosprin 75mg', time: '9:00 AM', status: 'missed', doctor: 'Dr. R. Kapoor' },
  { id: 3, name: 'Amlodipine 5mg', time: '9:00 AM', status: 'upcoming', doctor: 'Dr. R. Kapoor' },
  { id: 4, name: 'Atorvastatin 10mg', time: '9:00 PM', status: 'upcoming', doctor: 'Dr. R. Kapoor' },
];

const upcomingAppointments = [
  { id: 1, doctor: 'Dr. R. Kapoor', specialty: 'Cardiologist', date: 'Thu, 5 Mar', time: '10:30 AM', hospital: 'Apollo Hospital', urgent: false },
  { id: 2, doctor: 'Dr. A. Mehta', specialty: 'Endocrinologist', date: 'Mon, 8 Mar', time: '2:00 PM', hospital: 'Max Hospital', urgent: false },
];

const recentRecords = [
  { type: 'Lab Report', title: 'Complete Blood Count', hospital: 'Apollo Hospital', date: '12 Feb 2026', icon: TestTube, color: '#0A9B8F' },
  { type: 'Prescription', title: 'Cardiology Consultation', hospital: 'Dr. Kapoor Clinic', date: '8 Feb 2026', icon: Stethoscope, color: '#3B82F6' },
];

const healthInsights = [
  { title: 'Blood Sugar', value: '142 mg/dL', trend: '↑ 8%', status: 'warning', desc: 'A bit high this week — let\'s watch it', emoji: '🩸' },
  { title: 'Blood Pressure', value: '128/84', trend: '↓ 3%', status: 'good', desc: 'Doing well! Meds are working 💊', emoji: '❤️' },
  { title: 'HbA1c', value: '6.8%', trend: '↓ 0.4', status: 'good', desc: 'Down from 7.2 — great progress! 🎯', emoji: '📊' },
];

const contextAlert = {
  title: 'AI Health Alert',
  message: 'Your blood sugar readings have been consistently above 140 mg/dL this week. Consider tracking your meals and limiting refined carbs.',
  severity: 'warning',
  source: 'Kinsu AI Summary',
};

export default function HomeScreen() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode, currentUser } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [medStatuses, setMedStatuses] = useState<Record<number, string>>(
    Object.fromEntries(upcomingMeds.map(m => [m.id, m.status]))
  );
  const [showAlert, setShowAlert] = useState(true);
  const activeDays = 15;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % MOTIVATIONAL_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const takeMed = (id: number) => {
    setMedStatuses(prev => ({ ...prev, [id]: 'taken' }));
  };

  const notifications = [
    { id: 1, title: '⚠️ AI Health Insight', desc: 'Blood sugar has been above 140 all week. Check diet.', time: '30 min ago', unread: true, alert: true },
    { id: 2, title: '💊 Medication Reminder', desc: 'Amlodipine 5mg is due at 9:00 AM', time: '1 hr ago', unread: true },
    { id: 3, title: '🧪 Lab Report Ready', desc: 'CBC from Apollo is available in your vault', time: '2 hr ago', unread: false },
    { id: 4, title: '📅 Appointment Tomorrow', desc: 'Dr. Kapoor — 10:30 AM, Apollo Hospital', time: '4 hr ago', unread: false },
    { id: 5, title: '👨‍👩‍👧 Family Update', desc: "Amma's BP reading logged by you", time: 'Yesterday', unread: false },
  ];

  const slide = MOTIVATIONAL_SLIDES[currentSlide];

  const searchResults = [
    { type: 'Record', title: 'CBC Report - Apollo Hospital', date: '12 Feb 2026', icon: TestTube },
    { type: 'Medicine', title: 'Metformin 500mg', date: 'Active', icon: Pill },
    { type: 'Doctor', title: 'Dr. Kapoor - Cardiologist', date: 'Last visit: 8 Feb', icon: Stethoscope },
    { type: 'Lab Parameter', title: 'HbA1c - 6.8%', date: '12 Feb 2026', icon: Brain },
  ];

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6 rounded-b-[28px]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>{currentUser.avatar}</span>
            </div>
            <div>
              <p className="text-white/70" style={{ fontSize: '12px' }}>Good Morning 🌤</p>
              <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>{currentUser.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              {darkMode ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
            </button>
            <button onClick={() => setShowNotifs(true)} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center relative">
              <Bell size={16} className="text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white" style={{ fontSize: '9px', fontWeight: 700 }}>3</span>
              </div>
            </button>
          </div>
        </div>
        <button onClick={() => setSearchOpen(true)} className="w-full h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center gap-3 px-4">
          <Search size={16} className="text-white/60" />
          <span className="text-white/60" style={{ fontSize: '14px' }}>Search records, meds, doctors...</span>
        </button>
      </div>

      {/* Motivational Banner */}
      <div className="px-5 -mt-4">
        <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ height: '130px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className={`absolute inset-0 bg-gradient-to-br ${slide.bg} p-4 flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white" style={{ fontSize: '22px' }}>{slide.emoji}</p>
                  <h3 className="text-white mt-1" style={{ fontSize: '16px', fontWeight: 700 }}>{slide.headline}</h3>
                  <p className="text-white/80" style={{ fontSize: '12px' }}>{slide.subline}</p>
                </div>
                <div className="bg-white/15 rounded-full px-3 py-1 flex items-center gap-1.5">
                  <Flame size={14} className="text-orange-200" />
                  <span className="text-white" style={{ fontSize: '12px', fontWeight: 700 }}>{activeDays} days</span>
                </div>
              </div>
              <div className="bg-white/15 rounded-xl px-3 py-2">
                <p className="text-white/90" style={{ fontSize: '11px' }}>{slide.tip}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Slide dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {MOTIVATIONAL_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`h-1 rounded-full transition-all ${i === currentSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Context Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mx-5 mt-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-amber-800" style={{ fontSize: '12px', fontWeight: 700 }}>{contextAlert.title}</p>
                <p className="text-amber-600 mt-0.5" style={{ fontSize: '11px' }}>{contextAlert.message}</p>
                <button onClick={() => navigate('/app/ai')} className="text-amber-700 mt-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                  View AI Summary →
                </button>
              </div>
              <button onClick={() => setShowAlert(false)} className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <X size={10} className="text-amber-600" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="px-5 mt-4">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="grid grid-cols-4 gap-3 mb-3">
            {quickActions.map(a => (
              <button key={a.label} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: a.bg }}>
                  <a.icon size={20} style={{ color: a.color }} />
                </div>
                <span className="text-foreground text-center" style={{ fontSize: '10px', lineHeight: '1.3' }}>{a.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-2 pt-3 border-t border-border">
            {moreQuickActions.map(a => (
              <button key={a.label} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: a.bg }}>
                  <a.icon size={15} style={{ color: a.color }} />
                </div>
                <span className="text-foreground text-center" style={{ fontSize: '9px', lineHeight: '1.2' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Upcoming Appointments</h3>
          <button className="text-primary" style={{ fontSize: '13px' }}>Add +</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {upcomingAppointments.map(appt => (
            <div key={appt.id} className="min-w-[220px] bg-card rounded-2xl p-4 border border-border flex-shrink-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Stethoscope size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground" style={{ fontSize: '13px', fontWeight: 600 }}>{appt.doctor}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{appt.specialty}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Calendar size={11} className="text-primary" />
                <span className="text-primary" style={{ fontSize: '11px', fontWeight: 600 }}>{appt.date}</span>
                <span className="text-muted-foreground" style={{ fontSize: '11px' }}>{appt.time}</span>
              </div>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: '10px' }}>{appt.hospital}</p>
            </div>
          ))}
          <button className="min-w-[100px] bg-card rounded-2xl p-4 border border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground flex-shrink-0">
            <Plus size={20} />
            <span style={{ fontSize: '11px' }}>Add appt.</span>
          </button>
        </div>
      </div>

      {/* Today's Medications */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Today's Medicines</h3>
          <button onClick={() => navigate('/app/medications')} className="text-primary" style={{ fontSize: '13px' }}>View All</button>
        </div>
        {/* Progress bar */}
        <div className="bg-card rounded-2xl px-4 py-3 border border-border mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
              {Object.values(medStatuses).filter(s => s === 'taken').length}/{upcomingMeds.length} medicines taken
            </span>
            <span className="text-primary" style={{ fontSize: '12px', fontWeight: 600 }}>
              {Math.round((Object.values(medStatuses).filter(s => s === 'taken').length / upcomingMeds.length) * 100)}%
            </span>
          </div>
          <div className="flex gap-1">
            {upcomingMeds.map(m => (
              <div key={m.id} className={`flex-1 h-2 rounded-full ${medStatuses[m.id] === 'taken' ? 'bg-green-500' : medStatuses[m.id] === 'missed' ? 'bg-red-400' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {upcomingMeds.slice(0, 3).map(m => {
            const status = medStatuses[m.id];
            return (
              <div key={m.id} className="bg-card rounded-2xl p-3.5 border border-border flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'taken' ? 'bg-green-50' : status === 'missed' ? 'bg-red-50' : 'bg-blue-50'}`}>
                  <Pill size={18} className={status === 'taken' ? 'text-green-600' : status === 'missed' ? 'text-red-500' : 'text-blue-600'} />
                </div>
                <div className="flex-1">
                  <p className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>{m.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{m.time} · {m.doctor}</p>
                </div>
                {status === 'taken' ? (
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full border border-green-100" style={{ fontSize: '11px', fontWeight: 600 }}>✓ Taken</span>
                ) : status === 'missed' ? (
                  <span className="px-2.5 py-1 bg-red-50 text-red-500 rounded-full border border-red-100" style={{ fontSize: '11px', fontWeight: 600 }}>Missed</span>
                ) : (
                  <button onClick={() => takeMed(m.id)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full active:scale-95 transition-transform" style={{ fontSize: '11px', fontWeight: 600 }}>Take</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Health Insights */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Health Insights</h3>
          <button onClick={() => navigate('/app/ai')} className="text-primary flex items-center gap-1" style={{ fontSize: '13px' }}>
            <Sparkles size={14} /> AI Summary
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {healthInsights.map((h, i) => (
            <div key={i} className="min-w-[160px] bg-card rounded-2xl p-3.5 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: '11px' }}>{h.emoji} {h.title}</span>
                <span className={`px-1.5 py-0.5 rounded-md ${h.status === 'good' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                  {h.trend}
                </span>
              </div>
              <p className="text-foreground mb-1.5" style={{ fontSize: '20px', fontWeight: 700 }}>{h.value}</p>
              <p className="text-muted-foreground" style={{ fontSize: '11px', lineHeight: '1.4' }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Records */}
      <div className="px-5 mt-5 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Records</h3>
          <button onClick={() => navigate('/app/vault')} className="text-primary" style={{ fontSize: '13px' }}>View All</button>
        </div>
        <div className="flex flex-col gap-2">
          {recentRecords.map((r, i) => (
            <button key={i} onClick={() => navigate('/app/vault')} className="bg-card rounded-2xl p-3.5 border border-border flex items-center gap-3 w-full text-left active:scale-[0.99] transition-transform">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${r.color}12` }}>
                <r.icon size={18} style={{ color: r.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground truncate" style={{ fontSize: '14px', fontWeight: 500 }}>{r.title}</p>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{r.hospital} · {r.date}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background z-50 flex flex-col">
            <div className="px-5 pt-12 pb-3 flex items-center gap-3">
              <div className="flex-1 h-11 bg-muted rounded-2xl flex items-center gap-3 px-4">
                <Search size={16} className="text-muted-foreground" />
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search everything..." className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground" style={{ fontSize: '15px' }} />
              </div>
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-primary" style={{ fontSize: '14px' }}>Cancel</button>
            </div>
            {searchQuery.length > 0 ? (
              <div className="px-5 flex flex-col gap-1">
                <p className="text-muted-foreground mb-2" style={{ fontSize: '12px' }}>{searchResults.length} results</p>
                {searchResults.map((r, i) => (
                  <button key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors w-full text-left">
                    <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
                      <r.icon size={16} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>{r.title}</p>
                      <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{r.type} · {r.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-5 pt-4">
                <p className="text-muted-foreground mb-3" style={{ fontSize: '13px', fontWeight: 500 }}>Recent Searches</p>
                {['Blood sugar reports', 'Dr. Kapoor prescription', 'Vitamin D levels'].map((s, i) => (
                  <button key={i} onClick={() => setSearchQuery(s)} className="flex items-center gap-3 py-2.5 w-full text-left">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-foreground" style={{ fontSize: '14px' }}>{s}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Sheet */}
      <AnimatePresence>
        {showNotifs && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowNotifs(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-[28px] max-h-[80%] overflow-y-auto">
              <div className="flex items-center justify-between p-5 pb-3 sticky top-0 bg-card">
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Notifications</h3>
                <button onClick={() => setShowNotifs(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <div className="px-5 pb-8 flex flex-col gap-1">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3.5 rounded-xl flex gap-3 ${n.unread ? 'bg-primary/5' : ''} ${n.alert ? 'border border-amber-200 bg-amber-50' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.unread ? (n.alert ? 'bg-amber-500' : 'bg-primary') : 'bg-transparent'}`} />
                    <div>
                      <p className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>{n.title}</p>
                      <p className="text-muted-foreground mt-0.5" style={{ fontSize: '13px' }}>{n.desc}</p>
                      <p className="text-muted-foreground mt-1" style={{ fontSize: '11px' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
