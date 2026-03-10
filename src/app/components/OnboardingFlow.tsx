import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FolderHeart, Brain, ChevronRight, Phone, ArrowRight, Check, User, Droplets, Calendar, Camera, Target, Dumbbell, Heart, Apple, Activity, ChevronDown } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding'), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A9B8F] via-[#088A7F] to-[#06756B]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
            <span className="text-[#0A9B8F] text-2xl tracking-tight" style={{ fontWeight: 700 }}>K</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-white tracking-tight" style={{ fontSize: '28px', fontWeight: 700 }}>Kinsu Health</h1>
          <p className="text-white/70 mt-1" style={{ fontSize: '14px' }}>Your health, unified.</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/50"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const slides = [
  {
    icon: FolderHeart,
    color: '#0A9B8F',
    bg: 'from-[#E6F7F6] to-[#F0FDFA]',
    title: 'All Records, One Vault',
    desc: 'Upload prescriptions, lab reports, X-rays, and discharge summaries. Search across everything instantly.',
  },
  {
    icon: Shield,
    color: '#3B82F6',
    bg: 'from-[#EFF6FF] to-[#F0F9FF]',
    title: 'Family Care, Together',
    desc: 'Add family members and caregivers. Log vitals, symptoms, and medications on behalf of loved ones.',
  },
  {
    icon: Brain,
    color: '#8B5CF6',
    bg: 'from-[#F5F3FF] to-[#FAF5FF]',
    title: 'AI-Powered Insights',
    desc: 'Get evidence-grounded health summaries with source citations. Never a replacement for your doctor.',
  },
];

export function OnboardingScreens() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <div className={`w-32 h-32 rounded-[32px] bg-gradient-to-br ${slides[step].bg} flex items-center justify-center mb-8`}>
              {(() => { const Icon = slides[step].icon; return <Icon size={48} color={slides[step].color} strokeWidth={1.5} />; })()}
            </div>
            <h2 className="text-center text-foreground mb-3" style={{ fontSize: '24px', fontWeight: 700 }}>{slides[step].title}</h2>
            <p className="text-center text-muted-foreground max-w-[280px]" style={{ fontSize: '15px', lineHeight: '1.6' }}>{slides[step].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10 pt-4 flex flex-col gap-4">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-1.5 bg-border'}`} />
          ))}
        </div>
        <button
          onClick={() => step < 2 ? setStep(step + 1) : navigate('/signin')}
          className="w-full h-[52px] bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {step < 2 ? 'Continue' : 'Get Started'}
          <ChevronRight size={18} />
        </button>
        {step < 2 && (
          <button onClick={() => navigate('/signin')} className="text-muted-foreground text-center" style={{ fontSize: '14px' }}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

export function SignInScreen() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-white px-6 pt-16">
      <div className="mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <Phone size={24} className="text-primary" />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700 }} className="text-foreground mb-2">Welcome to Kinsu</h1>
        <p className="text-muted-foreground" style={{ fontSize: '15px' }}>Enter your mobile number to continue</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="h-[52px] px-4 bg-muted rounded-xl flex items-center gap-2">
          <span style={{ fontSize: '15px' }}>🇮🇳</span>
          <span className="text-foreground" style={{ fontSize: '15px' }}>+91</span>
        </div>
        <input
          type="tel"
          placeholder="Mobile number"
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          className="flex-1 h-[52px] px-4 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground"
          style={{ fontSize: '15px' }}
        />
      </div>

      <button
        onClick={() => navigate('/otp')}
        disabled={phone.length < 10}
        className="w-full h-[52px] bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all"
      >
        Send OTP <ArrowRight size={18} />
      </button>

      <p className="text-muted-foreground text-center mt-6" style={{ fontSize: '12px', lineHeight: '1.5' }}>
        By continuing, you agree to our Terms of Service and Privacy Policy. Your data is encrypted and stored securely.
      </p>

      <div className="mt-auto pb-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: '13px' }}>
          <Shield size={14} />
          <span>ABDM / ABHA Compatible</span>
        </div>
      </div>
    </div>
  );
}

export function OTPScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      const el = document.getElementById(`otp-${idx + 1}`);
      el?.focus();
    }
  };

  const filled = otp.every(d => d !== '');

  return (
    <div className="h-full flex flex-col bg-white px-6 pt-16">
      <div className="mb-8">
        <h1 style={{ fontSize: '28px', fontWeight: 700 }} className="text-foreground mb-2">Verify OTP</h1>
        <p className="text-muted-foreground" style={{ fontSize: '15px' }}>Code sent to +91 98765 43210</p>
      </div>

      <div className="flex gap-3 justify-center mb-8">
        {otp.map((d, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleOtpChange(i, e.target.value)}
            className="w-12 h-14 bg-muted rounded-xl text-center text-foreground border-2 border-transparent focus:border-primary transition-colors"
            style={{ fontSize: '20px', fontWeight: 600 }}
          />
        ))}
      </div>

      <button
        onClick={() => navigate('/consent')}
        disabled={!filled}
        className="w-full h-[52px] bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all"
      >
        <Check size={18} /> Verify
      </button>

      <button className="text-center mt-4 text-muted-foreground" style={{ fontSize: '14px' }}>
        {timer > 0 ? `Resend in ${timer}s` : <span className="text-primary">Resend OTP</span>}
      </button>
    </div>
  );
}

export function ProfileSetupScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'basic' | 'optional' | 'goals'>('basic');
  const [name, setName] = useState('Priya Sharma');
  const [gender, setGender] = useState('Female');
  const [dob, setDob] = useState('1992-03-15');
  const [blood, setBlood] = useState('B+');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [profession, setProfession] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const healthGoals = [
    { id: 'diabetes', label: 'Manage Diabetes', icon: Droplets, color: '#F59E0B' },
    { id: 'bp', label: 'Control Blood Pressure', icon: Heart, color: '#DC2626' },
    { id: 'weight', label: 'Lose Weight', icon: Activity, color: '#10B981' },
    { id: 'fitness', label: 'Get Fitter', icon: Dumbbell, color: '#3B82F6' },
    { id: 'diet', label: 'Eat Healthier', icon: Apple, color: '#F97316' },
    { id: 'thyroid', label: 'Manage Thyroid', icon: Target, color: '#8B5CF6' },
    { id: 'stress', label: 'Reduce Stress', icon: Brain, color: '#6366F1' },
    { id: 'chronic', label: 'Track Chronic Illness', icon: Activity, color: '#EC4899' },
    { id: 'records', label: 'Organize Medical Records', icon: FolderHeart, color: '#0A9B8F' },
    { id: 'family', label: 'Care for Family', icon: Shield, color: '#6B7280' },
  ];

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Progress */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex gap-1.5 mb-6">
          {['basic', 'optional', 'goals'].map((s, i) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s === step || (step === 'optional' && i <= 1) || (step === 'goals' && i <= 2) ? 'bg-primary' : 'bg-slate-100'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'basic' && (
            <motion.div key="basic" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-foreground mb-1">Tell us about yourself</h1>
              <p className="text-muted-foreground mb-6" style={{ fontSize: '14px' }}>This helps us personalize your experience</p>
            </motion.div>
          )}
          {step === 'optional' && (
            <motion.div key="optional" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-foreground mb-1">A little more... (optional)</h1>
              <p className="text-muted-foreground mb-6" style={{ fontSize: '14px' }}>Helps us give better health recommendations</p>
            </motion.div>
          )}
          {step === 'goals' && (
            <motion.div key="goals" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-foreground mb-1">What are you here for?</h1>
              <p className="text-muted-foreground mb-6" style={{ fontSize: '14px' }}>Select all that apply — we'll focus Kinsu around your goals</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <AnimatePresence mode="wait">
          {step === 'basic' && (
            <motion.div key="basic-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-5">
              {/* Photo */}
              <div className="flex flex-col items-center gap-2 mb-2">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                  {hasPhoto ? (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-[#088A7F] flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{name.slice(0, 2).toUpperCase()}</span>
                    </div>
                  ) : (
                    <User size={32} className="text-primary" />
                  )}
                </div>
                <button onClick={() => setHasPhoto(true)} className="text-primary flex items-center gap-1.5" style={{ fontSize: '13px' }}>
                  <Camera size={13} /> {hasPhoto ? 'Change Photo' : 'Add Photo'}
                </button>
              </div>

              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Full Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full h-[48px] px-4 bg-muted rounded-xl text-foreground" style={{ fontSize: '15px' }} />
              </div>

              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Gender</label>
                <div className="flex gap-2">
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`flex-1 py-2.5 rounded-xl transition-all text-center ${gender === g ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
                      style={{ fontSize: '12px', fontWeight: gender === g ? 600 : 400 }}>
                      {g === 'Prefer not to say' ? 'Other' : g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Date of Birth</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[48px] px-4 bg-muted rounded-xl flex items-center">
                    <Calendar size={16} className="text-muted-foreground mr-2" />
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="bg-transparent text-foreground flex-1" style={{ fontSize: '15px' }} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Blood Group</label>
                <div className="flex gap-2 flex-wrap">
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <button key={bg} onClick={() => setBlood(bg)}
                      className={`px-4 py-2 rounded-xl transition-all ${blood === bg ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
                      style={{ fontSize: '13px' }}>
                      <Droplets size={12} className="inline mr-1" />{bg}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'optional' && (
            <motion.div key="optional-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Height (cm)</label>
                  <input value={height} onChange={e => setHeight(e.target.value)} type="number" placeholder="e.g. 162"
                    className="w-full h-[48px] px-4 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '15px' }} />
                </div>
                <div>
                  <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Weight (kg)</label>
                  <input value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="e.g. 65"
                    className="w-full h-[48px] px-4 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '15px' }} />
                </div>
              </div>
              <div>
                <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Profession</label>
                <input value={profession} onChange={e => setProfession(e.target.value)} placeholder="e.g. Teacher, Engineer, Homemaker"
                  className="w-full h-[48px] px-4 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '15px' }} />
              </div>
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/15">
                <p className="text-primary" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                  💡 These details help us calculate calories burned, recommend appropriate exercises, and track your BMI over time.
                </p>
              </div>
            </motion.div>
          )}

          {step === 'goals' && (
            <motion.div key="goals-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-2.5">
                {healthGoals.map(g => (
                  <button key={g.id} onClick={() => toggleGoal(g.id)}
                    className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all active:scale-[0.97] ${selectedGoals.includes(g.id) ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'}`}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${g.color}15` }}>
                      <g.icon size={18} style={{ color: g.color }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: selectedGoals.includes(g.id) ? '#0A9B8F' : '#374151' }}>
                      {g.label}
                    </span>
                    {selectedGoals.includes(g.id) && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center ml-auto flex-shrink-0">
                        <Check size={10} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10 pt-4 border-t border-slate-100">
        {step === 'basic' && (
          <button onClick={() => setStep('optional')} disabled={!name}
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-40">
            Continue <ChevronRight size={18} />
          </button>
        )}
        {step === 'optional' && (
          <div className="flex flex-col gap-3">
            <button onClick={() => setStep('goals')}
              className="w-full h-[52px] bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              Continue <ChevronRight size={18} />
            </button>
            <button onClick={() => setStep('goals')} className="text-muted-foreground text-center" style={{ fontSize: '14px' }}>Skip for now</button>
          </div>
        )}
        {step === 'goals' && (
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/app/home')} disabled={selectedGoals.length === 0}
              className="w-full h-[52px] bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-40">
              Start Using Kinsu <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/app/home')} className="text-muted-foreground text-center" style={{ fontSize: '14px' }}>Skip for now</button>
          </div>
        )}
      </div>
    </div>
  );
}