import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  X, Shield, Eye, ChevronRight, Lock, Share2, Bell, Download,
  Trash2, AlertCircle, Check, Settings, LogOut, HelpCircle,
  Apple, Coffee, Salad, UtensilsCrossed, Clock, Flame, Plus,
  Wifi, WifiOff, Search, FolderOpen, Loader2, RefreshCw, Moon, Sun
} from 'lucide-react';
import { useApp } from './AppContext';

// --- Nutrition Recommendations ---
const nutritionData = {
  recommendations: [
    { title: 'Increase Fiber Intake', desc: 'Helps manage blood sugar levels', foods: ['Oats', 'Lentils', 'Green vegetables', 'Brown rice'], icon: Salad, color: '#16A34A' },
    { title: 'Reduce Sodium', desc: 'Important for blood pressure management', foods: ['Use herbs instead of salt', 'Avoid processed foods', 'Read labels carefully'], icon: AlertCircle, color: '#F59E0B' },
    { title: 'Omega-3 Rich Foods', desc: 'Heart health benefits', foods: ['Flaxseeds', 'Walnuts', 'Fish (2x/week)', 'Chia seeds'], icon: Apple, color: '#3B82F6' },
  ],
  mealPlan: [
    { time: '7:00 AM', meal: 'Breakfast', items: 'Oats upma with vegetables, 1 boiled egg, green tea', calories: 320, icon: Coffee },
    { time: '10:00 AM', meal: 'Snack', items: 'Mixed nuts (10 almonds, 5 walnuts), 1 apple', calories: 180, icon: Apple },
    { time: '1:00 PM', meal: 'Lunch', items: 'Brown rice, dal, palak sabzi, raita, salad', calories: 520, icon: UtensilsCrossed },
    { time: '4:00 PM', meal: 'Snack', items: 'Sprouts chaat, buttermilk', calories: 150, icon: Salad },
    { time: '7:30 PM', meal: 'Dinner', items: 'Multigrain roti (2), lauki sabzi, grilled paneer', calories: 440, icon: UtensilsCrossed },
    { time: '9:30 PM', meal: 'Post-dinner', items: 'Warm turmeric milk', calories: 80, icon: Coffee },
  ],
};

export function NutritionScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'recs' | 'plan'>('recs');

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Nutrition</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('recs')} className={`flex-1 py-2 rounded-xl ${tab === 'recs' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`} style={{ fontSize: '13px' }}>Recommendations</button>
          <button onClick={() => setTab('plan')} className={`flex-1 py-2 rounded-xl ${tab === 'plan' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`} style={{ fontSize: '13px' }}>Meal Plan</button>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        {tab === 'recs' ? (
          <>
            <p className="text-muted-foreground" style={{ fontSize: '13px' }}>Based on your health conditions</p>
            {nutritionData.recommendations.map((r, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${r.color}12` }}>
                    <r.icon size={16} style={{ color: r.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>{r.title}</p>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{r.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.foods.map((f, j) => (
                    <span key={j} className="px-2.5 py-1 bg-muted rounded-lg text-foreground" style={{ fontSize: '12px' }}>{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground" style={{ fontSize: '13px' }}>Today's Plan · ~1,690 kcal</p>
              <span className="flex items-center gap-1 text-primary" style={{ fontSize: '12px' }}>
                <Flame size={12} /> Diabetic-friendly
              </span>
            </div>
            {nutritionData.mealPlan.map((m, i) => (
              <div key={i} className="bg-card rounded-2xl p-3.5 border border-border flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <m.icon size={16} className="text-primary" />
                  </div>
                  <span className="text-muted-foreground mt-1" style={{ fontSize: '10px' }}>{m.time}</span>
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{m.meal}</p>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: '12px', lineHeight: '1.5' }}>{m.items}</p>
                  <span className="text-muted-foreground mt-1 inline-block" style={{ fontSize: '11px' }}>{m.calories} kcal</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// --- Privacy & Settings ---
export function SettingsScreen() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useApp();

  const settingGroups = [
    {
      title: 'Privacy & Consent',
      items: [
        { icon: Lock, label: 'Data Encryption', desc: 'End-to-end encrypted', toggle: true, value: true },
        { icon: Share2, label: 'Data Sharing', desc: 'Control who sees your records', action: true },
        { icon: Eye, label: 'Profile Visibility', desc: 'Visible to caregivers only', action: true },
        { icon: Shield, label: 'Consent History', desc: 'View past consent decisions', action: true },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Medication Reminders', desc: 'Push notifications', toggle: true, value: true },
        { icon: Bell, label: 'Lab Report Alerts', desc: 'When new reports arrive', toggle: true, value: true },
        { icon: Bell, label: 'SOS Alerts', desc: 'Emergency notifications', toggle: true, value: true },
        { icon: Bell, label: 'AI Insights', desc: 'Weekly health summaries', toggle: true, value: false },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: Download, label: 'Export Health Data', desc: 'Download all records', action: true },
        { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs and contact', action: true },
        { icon: Trash2, label: 'Delete Account', desc: 'Permanently remove data', action: true, danger: true },
      ],
    },
  ];

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Settings</h3>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-5">
        {/* Dark Mode Toggle */}
        <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            {darkMode ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-amber-500" />}
          </div>
          <div className="flex-1">
            <p style={{ fontSize: '14px', fontWeight: 500 }}>Dark Mode</p>
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>For Home, Vault, SOS, AI Chat</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full transition-all relative ${darkMode ? 'bg-primary' : 'bg-muted'}`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
              animate={{ left: darkMode ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {settingGroups.map((group, gi) => (
          <div key={gi}>
            <p className="text-muted-foreground mb-2 px-1" style={{ fontSize: '13px', fontWeight: 600 }}>{group.title}</p>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {group.items.map((item, ii) => (
                <div key={ii} className="px-4 py-3 flex items-center gap-3 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <item.icon size={15} className={item.danger ? 'text-red-500' : 'text-muted-foreground'} />
                  </div>
                  <div className="flex-1">
                    <p className={item.danger ? 'text-red-600' : ''} style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</p>
                    <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{item.desc}</p>
                  </div>
                  {item.toggle && (
                    <div className={`w-11 h-6 rounded-full relative ${item.value ? 'bg-primary' : 'bg-muted'}`}>
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" style={{ left: item.value ? 22 : 2 }} />
                    </div>
                  )}
                  {item.action && <ChevronRight size={14} className="text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full h-12 border border-red-200 bg-red-50 rounded-2xl flex items-center justify-center gap-2 text-red-600">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}

// --- Error / Empty / Loading / Offline States ---
export function StatesScreen() {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<'error' | 'empty' | 'loading' | 'offline'>('error');

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>App States</h3>
        </div>
        <div className="flex gap-1.5">
          {(['error', 'empty', 'loading', 'offline'] as const).map(s => (
            <button key={s} onClick={() => setCurrentState(s)} className={`flex-1 py-1.5 rounded-lg capitalize ${currentState === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`} style={{ fontSize: '11px' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-20">
        {currentState === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={28} className="text-red-500" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">Something Went Wrong</h3>
            <p className="text-muted-foreground text-center" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              We couldn't load your data. This might be a temporary issue.
            </p>
            <button className="mt-6 px-6 h-11 bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
              <RefreshCw size={14} /> Try Again
            </button>
          </>
        )}
        {currentState === 'empty' && (
          <>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FolderOpen size={28} className="text-muted-foreground" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">No Records Yet</h3>
            <p className="text-muted-foreground text-center" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              Upload your first health record to get started with your digital vault.
            </p>
            <button className="mt-6 px-6 h-11 bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
              <Plus size={14} /> Upload Record
            </button>
          </>
        )}
        {currentState === 'loading' && (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Loader2 size={40} className="text-primary" />
            </motion.div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mt-6 mb-2">Loading Your Data</h3>
            <p className="text-muted-foreground text-center" style={{ fontSize: '14px' }}>
              Syncing your health records...
            </p>
            <div className="w-48 bg-muted rounded-full h-1.5 mt-4">
              <motion.div className="bg-primary h-1.5 rounded-full" animate={{ width: ['0%', '70%', '100%'] }} transition={{ duration: 3, repeat: Infinity }} />
            </div>
          </>
        )}
        {currentState === 'offline' && (
          <>
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <WifiOff size={28} className="text-amber-500" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mb-2">You're Offline</h3>
            <p className="text-muted-foreground text-center" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              Some features are limited. Your data will sync when you're back online.
            </p>
            <div className="mt-6 bg-card rounded-xl p-3 border border-border w-full">
              <p style={{ fontSize: '13px', fontWeight: 500 }} className="mb-2">Available offline:</p>
              {['View cached records', 'Log vitals & symptoms', 'Medication reminders'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <Check size={12} className="text-green-600" />
                  <span style={{ fontSize: '12px' }}>{item}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Design System Page ---
export function DesignSystemPage() {
  const navigate = useNavigate();

  const colors = [
    { name: 'Primary', value: '#0A9B8F', token: '--primary' },
    { name: 'Primary Light', value: '#E6F7F6', token: '--secondary' },
    { name: 'Accent', value: '#FF6B35', token: '--accent' },
    { name: 'Destructive', value: '#DC2626', token: '--destructive' },
    { name: 'Success', value: '#16A34A', token: 'semantic' },
    { name: 'Warning', value: '#F59E0B', token: 'semantic' },
    { name: 'Info', value: '#3B82F6', token: 'semantic' },
    { name: 'Foreground', value: '#1A1D29', token: '--foreground' },
    { name: 'Muted', value: '#6B7280', token: '--muted-fg' },
    { name: 'Background', value: '#F8FAFB', token: '--background' },
    { name: 'Card', value: '#FFFFFF', token: '--card' },
    { name: 'Border', value: '#E5E7EB', token: '--border' },
  ];

  const darkColors = [
    { name: 'Primary', value: '#2DD4BF' },
    { name: 'Background', value: '#0F1117' },
    { name: 'Card', value: '#1A1D29' },
    { name: 'Foreground', value: '#F0F2F5' },
    { name: 'Muted FG', value: '#9CA3AF' },
    { name: 'Border', value: '#2D3142' },
  ];

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/app/home')} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Design System</h3>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-6">
        {/* Colors */}
        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Color Tokens (Light)</h4>
          <div className="grid grid-cols-4 gap-2">
            {colors.map(c => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <div className="w-full aspect-square rounded-xl border border-border" style={{ backgroundColor: c.value }} />
                <span style={{ fontSize: '10px', fontWeight: 500 }}>{c.name}</span>
                <span className="text-muted-foreground" style={{ fontSize: '9px' }}>{c.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Color Tokens (Dark)</h4>
          <div className="grid grid-cols-3 gap-2">
            {darkColors.map(c => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <div className="w-full h-10 rounded-xl border border-border" style={{ backgroundColor: c.value }} />
                <span style={{ fontSize: '10px', fontWeight: 500 }}>{c.name}</span>
                <span className="text-muted-foreground" style={{ fontSize: '9px' }}>{c.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Typography Scale</h4>
          <div className="bg-card rounded-2xl p-4 border border-border flex flex-col gap-3">
            <div><span className="text-muted-foreground" style={{ fontSize: '10px' }}>H1 / 28px / 700</span><p style={{ fontSize: '28px', fontWeight: 700 }}>Heading One</p></div>
            <div><span className="text-muted-foreground" style={{ fontSize: '10px' }}>H2 / 22px / 700</span><p style={{ fontSize: '22px', fontWeight: 700 }}>Heading Two</p></div>
            <div><span className="text-muted-foreground" style={{ fontSize: '10px' }}>H3 / 18px / 600</span><p style={{ fontSize: '18px', fontWeight: 600 }}>Heading Three</p></div>
            <div><span className="text-muted-foreground" style={{ fontSize: '10px' }}>Body / 15px / 400</span><p style={{ fontSize: '15px' }}>Body text for general content</p></div>
            <div><span className="text-muted-foreground" style={{ fontSize: '10px' }}>Caption / 13px / 400</span><p style={{ fontSize: '13px' }} className="text-muted-foreground">Caption text for supporting info</p></div>
            <div><span className="text-muted-foreground" style={{ fontSize: '10px' }}>Micro / 11px / 500</span><p style={{ fontSize: '11px', fontWeight: 500 }}>Micro text for badges and labels</p></div>
          </div>
        </section>

        {/* Spacing */}
        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Spacing Scale</h4>
          <div className="bg-card rounded-2xl p-4 border border-border flex flex-col gap-2">
            {[4, 8, 12, 16, 20, 24, 32].map(s => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-12 text-muted-foreground" style={{ fontSize: '11px' }}>{s}px</span>
                <div className="bg-primary/20 rounded" style={{ width: `${s * 3}px`, height: '12px' }} />
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Button Variants</h4>
          <div className="bg-card rounded-2xl p-4 border border-border flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              <button className="h-11 px-5 bg-primary text-primary-foreground rounded-xl">Primary</button>
              <button className="h-11 px-5 bg-muted text-foreground rounded-xl">Secondary</button>
              <button className="h-11 px-5 border border-border rounded-xl text-foreground">Outline</button>
              <button className="h-11 px-5 bg-destructive text-destructive-foreground rounded-xl">Danger</button>
            </div>
            <div className="flex gap-2">
              <button className="h-11 px-5 bg-primary/40 text-primary-foreground rounded-xl cursor-not-allowed">Disabled</button>
              <button className="h-11 px-5 bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Loading
              </button>
            </div>
          </div>
        </section>

        {/* Chips */}
        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Chips & Badges</h4>
          <div className="bg-card rounded-2xl p-4 border border-border flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full" style={{ fontSize: '12px' }}>✓ Grounded</span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full" style={{ fontSize: '12px' }}>⚠ Needs Review</span>
            <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full" style={{ fontSize: '12px' }}>⚕ Not medical diagnosis</span>
            <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full" style={{ fontSize: '12px' }}>HbA1c</span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full" style={{ fontSize: '12px' }}>Lab Report</span>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full" style={{ fontSize: '12px' }}>Imaging</span>
            <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-full" style={{ fontSize: '12px' }}>Tag</span>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Card Variants</h4>
          <div className="flex flex-col gap-2">
            <div className="bg-card rounded-2xl p-4 border border-border">
              <p style={{ fontSize: '11px' }} className="text-muted-foreground">Card/Record</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Standard card with border</p>
            </div>
            <div className="bg-card rounded-2xl p-4 shadow-md">
              <p style={{ fontSize: '11px' }} className="text-muted-foreground">Card/Elevated</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Elevated card with shadow</p>
            </div>
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
              <p style={{ fontSize: '11px' }} className="text-primary">Card/Highlighted</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Highlighted accent card</p>
            </div>
          </div>
        </section>

        {/* Elevation */}
        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Elevation Levels</h4>
          <div className="flex flex-col gap-3">
            {[
              { name: 'Level 0', class: 'border border-border' },
              { name: 'Level 1', class: 'shadow-sm border border-border' },
              { name: 'Level 2', class: 'shadow-md' },
              { name: 'Level 3', class: 'shadow-lg' },
              { name: 'Level 4', class: 'shadow-xl' },
            ].map(e => (
              <div key={e.name} className={`bg-card rounded-2xl p-3 ${e.class}`}>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{e.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Radius */}
        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Border Radius</h4>
          <div className="flex gap-3 flex-wrap">
            {[{ name: 'sm', r: '8px' }, { name: 'md', r: '12px' }, { name: 'lg', r: '16px' }, { name: 'xl', r: '20px' }, { name: '2xl', r: '24px' }, { name: 'full', r: '9999px' }].map(r => (
              <div key={r.name} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 bg-primary/20 border border-primary/30" style={{ borderRadius: r.r }} />
                <span style={{ fontSize: '10px' }}>{r.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Input States */}
        <section>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Input States</h4>
          <div className="flex flex-col gap-2">
            <input placeholder="Default input" className="w-full h-11 px-4 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '14px' }} />
            <input value="Filled input" readOnly className="w-full h-11 px-4 bg-muted rounded-xl text-foreground border-2 border-primary" style={{ fontSize: '14px' }} />
            <div>
              <input placeholder="Error input" className="w-full h-11 px-4 bg-red-50 rounded-xl text-foreground border-2 border-red-400 placeholder:text-red-400" style={{ fontSize: '14px' }} />
              <span className="text-red-500 mt-1 block" style={{ fontSize: '11px' }}>This field is required</span>
            </div>
            <input placeholder="Disabled" disabled className="w-full h-11 px-4 bg-muted rounded-xl text-muted-foreground opacity-50 cursor-not-allowed" style={{ fontSize: '14px' }} />
          </div>
        </section>

        {/* Icon Style */}
        <section className="pb-6">
          <h4 style={{ fontSize: '16px', fontWeight: 700 }} className="mb-3">Icon Style (Lucide)</h4>
          <p className="text-muted-foreground mb-2" style={{ fontSize: '12px' }}>Stroke width: 1.8 (default) / 2.5 (active)</p>
          <div className="bg-card rounded-2xl p-4 border border-border flex gap-4 flex-wrap">
            {[Shield, Bell, Settings, Search, Plus, Check, X, AlertCircle, ChevronRight, Lock].map((Icon, i) => (
              <div key={i} className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-foreground" strokeWidth={1.8} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
