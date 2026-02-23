import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Bell, AlertTriangle, FileText, Pill, Activity, Heart, Thermometer,
  ChevronRight, Calendar, Upload, Plus, Moon, Sun, TrendingUp, Clock, Sparkles, X,
  Stethoscope, TestTube, Syringe, Brain, Settings, Palette
} from 'lucide-react';
import { useApp } from './AppContext';

const quickActions = [
  { icon: Upload, label: 'Upload Record', color: '#0A9B8F', bg: '#E6F7F6', path: '/app/vault' },
  { icon: Pill, label: 'Add Medication', color: '#3B82F6', bg: '#EFF6FF', path: '/app/track' },
  { icon: Activity, label: 'Log Vitals', color: '#8B5CF6', bg: '#F5F3FF', path: '/app/track' },
  { icon: AlertTriangle, label: 'SOS', color: '#DC2626', bg: '#FEF2F2', path: '/app/sos' },
];

const moreLinks = [
  { label: 'Nutrition', path: '/app/nutrition', icon: Heart },
  { label: 'Settings', path: '/app/settings', icon: Settings },
  { label: 'App States', path: '/app/states', icon: AlertTriangle },
  { label: 'Design System', path: '/app/design-system', icon: Palette },
];

const upcomingMeds = [
  { name: 'Metformin 500mg', time: '8:00 AM', status: 'taken', doctor: 'Dr. Anand' },
  { name: 'Amlodipine 5mg', time: '2:00 PM', status: 'upcoming', doctor: 'Dr. Kapoor' },
  { name: 'Vitamin D3 60K', time: '9:00 PM', status: 'upcoming', doctor: 'Dr. Mehta' },
];

const recentRecords = [
  { type: 'Lab Report', title: 'Complete Blood Count', hospital: 'Apollo Hospital', date: '12 Feb 2026', icon: TestTube, color: '#0A9B8F' },
  { type: 'Prescription', title: 'Cardiology Consultation', hospital: 'Dr. Kapoor Clinic', date: '8 Feb 2026', icon: Stethoscope, color: '#3B82F6' },
  { type: 'Imaging', title: 'Chest X-Ray', hospital: 'Max Diagnostics', date: '5 Feb 2026', icon: Syringe, color: '#8B5CF6' },
];

const healthInsights = [
  { title: 'Blood Sugar Trend', value: '142 mg/dL', trend: '+8%', status: 'warning', desc: 'Slightly elevated fasting glucose' },
  { title: 'Blood Pressure', value: '128/84', trend: '-3%', status: 'good', desc: 'Within acceptable range' },
  { title: 'HbA1c', value: '6.8%', trend: '+0.2', status: 'warning', desc: 'Pre-diabetic range' },
];

const searchResults = [
  { type: 'Record', title: 'CBC Report - Apollo Hospital', date: '12 Feb 2026', icon: TestTube },
  { type: 'Medicine', title: 'Metformin 500mg', date: 'Active', icon: Pill },
  { type: 'Doctor', title: 'Dr. Anand Kapoor - Cardiologist', date: 'Last visit: 8 Feb', icon: Stethoscope },
  { type: 'Lab Parameter', title: 'HbA1c - 6.8%', date: '12 Feb 2026', icon: Brain },
  { type: 'Symptom', title: 'Headache - logged 3 times', date: 'This week', icon: Activity },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode, currentUser } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);

  const notifications = [
    { id: 1, title: 'Medication Reminder', desc: 'Amlodipine 5mg due at 2:00 PM', time: '10 min ago', unread: true },
    { id: 2, title: 'Lab Report Ready', desc: 'Your CBC report from Apollo is available', time: '1 hr ago', unread: true },
    { id: 3, title: 'Appointment Reminder', desc: 'Dr. Kapoor - Tomorrow 10:30 AM', time: '3 hr ago', unread: false },
    { id: 4, title: 'Health Insight', desc: 'Your blood sugar has been trending higher this week', time: '5 hr ago', unread: false },
    { id: 5, title: 'Family Update', desc: 'Amma\'s BP reading logged by Ravi', time: 'Yesterday', unread: false },
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
              <p className="text-white/70" style={{ fontSize: '12px' }}>Good Morning</p>
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

        {/* Search Bar */}
        <button onClick={() => setSearchOpen(true)} className="w-full h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center gap-3 px-4">
          <Search size={16} className="text-white/60" />
          <span className="text-white/60" style={{ fontSize: '14px' }}>Search records, meds, doctors...</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-5 -mt-5">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map(a => (
              <button key={a.label} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: a.bg }}>
                  <a.icon size={20} style={{ color: a.color }} />
                </div>
                <span className="text-foreground text-center" style={{ fontSize: '11px', lineHeight: '1.3' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Health Insights */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Health Insights</h3>
          <button className="text-primary flex items-center gap-1" style={{ fontSize: '13px' }}>
            <Sparkles size={14} /> AI Summary
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {healthInsights.map((h, i) => (
            <div key={i} className="min-w-[160px] bg-card rounded-2xl p-3.5 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: '11px' }}>{h.title}</span>
                <span className={`px-1.5 py-0.5 rounded-md ${h.status === 'good' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                  <TrendingUp size={10} className="inline mr-0.5" />{h.trend}
                </span>
              </div>
              <p className="text-foreground mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>{h.value}</p>
              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Medications */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Today's Medications</h3>
          <button onClick={() => navigate('/app/track')} className="text-primary" style={{ fontSize: '13px' }}>View All</button>
        </div>
        <div className="flex flex-col gap-2">
          {upcomingMeds.map((m, i) => (
            <div key={i} className="bg-card rounded-2xl p-3.5 border border-border flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.status === 'taken' ? 'bg-green-50' : 'bg-blue-50'}`}>
                <Pill size={18} className={m.status === 'taken' ? 'text-green-600' : 'text-blue-600'} />
              </div>
              <div className="flex-1">
                <p className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>{m.name}</p>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{m.time} · {m.doctor}</p>
              </div>
              {m.status === 'taken' ? (
                <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full" style={{ fontSize: '11px', fontWeight: 600 }}>✓ Taken</span>
              ) : (
                <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full" style={{ fontSize: '11px', fontWeight: 600 }}>Take</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Records */}
      <div className="px-5 mt-5 pb-6">
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

      {/* More */}
      <div className="px-5 pb-6">
        <h3 style={{ fontSize: '16px', fontWeight: 600 }} className="mb-3">Quick Links</h3>
        <div className="grid grid-cols-2 gap-2">
          {moreLinks.map((link, i) => (
            <button key={i} onClick={() => navigate(link.path)} className="bg-card rounded-2xl p-3 border border-border flex items-center gap-2.5 active:scale-[0.98] transition-transform">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <link.icon size={14} className="text-muted-foreground" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background z-50 flex flex-col"
          >
            <div className="px-5 pt-12 pb-3 flex items-center gap-3">
              <div className="flex-1 h-11 bg-muted rounded-2xl flex items-center gap-3 px-4">
                <Search size={16} className="text-muted-foreground" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search everything..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground"
                  style={{ fontSize: '15px' }}
                />
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
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-[28px] max-h-[80%] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 pb-3 sticky top-0 bg-card">
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Notifications</h3>
                <button onClick={() => setShowNotifs(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <div className="px-5 pb-8 flex flex-col gap-1">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3.5 rounded-xl flex gap-3 ${n.unread ? 'bg-primary/5' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.unread ? 'bg-primary' : 'bg-transparent'}`} />
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