import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Send, X, ChevronRight, AlertTriangle, FileText, Shield,
  ExternalLink, Cloud, Plane, ThermometerSnowflake, Info, BookOpen,
  ChevronDown, Check, Brain, Loader2, TestTube, Pill, Heart
} from 'lucide-react';

type AIView = 'summary' | 'chat' | 'context' | 'refusal';

const summaryCards = [
  {
    id: 1, title: 'Blood Sugar Management', badge: 'Needs Review',
    badgeColor: 'bg-amber-50 text-amber-700',
    summary: 'Your fasting blood sugar has been trending upward over the past 4 weeks (avg 140 mg/dL). HbA1c at 6.8% indicates pre-diabetic range.',
    sources: [
      { type: 'Lab Report', title: 'CBC from Apollo Hospital', date: '12 Feb 2026' },
      { type: 'Vital Log', title: 'Blood Sugar Readings (7 days)', date: 'Feb 2026' },
    ],
    action: 'Consider discussing with Dr. Reddy about adjusting Metformin dosage.',
  },
  {
    id: 2, title: 'Blood Pressure Overview', badge: 'Grounded',
    badgeColor: 'bg-green-50 text-green-700',
    summary: 'Blood pressure readings have improved over the past month (128/84 avg). Amlodipine 5mg appears to be effective. Continue current regimen.',
    sources: [
      { type: 'Vital Log', title: 'BP Readings (30 days)', date: 'Jan-Feb 2026' },
      { type: 'Prescription', title: 'Dr. Kapoor Cardiology Rx', date: '8 Feb 2026' },
    ],
    action: 'Next check-up recommended in 4 weeks per Dr. Kapoor.',
  },
  {
    id: 3, title: 'Vitamin D Status', badge: 'Grounded',
    badgeColor: 'bg-green-50 text-green-700',
    summary: 'Vitamin D supplementation (60K IU weekly) was prescribed 3 months ago. No follow-up test done yet to check levels.',
    sources: [
      { type: 'Prescription', title: 'Dr. Mehta - General Medicine', date: 'Nov 2025' },
    ],
    action: 'Consider scheduling a Vitamin D level test.',
  },
];

const chatMessages = [
  {
    id: 1, role: 'user' as const,
    text: 'Can you summarize my recent blood reports?',
  },
  {
    id: 2, role: 'ai' as const,
    text: 'Based on your most recent CBC report from Apollo Hospital (12 Feb 2026), here are the key findings:\n\n• Hemoglobin: 14.1 g/dL — within normal range\n• RBC: 4.8 million/µL — normal\n• WBC: 7,200/µL — normal\n• Platelets: 2,45,000/µL — normal\n\nYour HbA1c from the same lab is at 6.8%, which is in the pre-diabetic range. This correlates with your elevated fasting blood sugar readings (avg 140 mg/dL this month).',
    sources: [
      { type: 'Lab Report', title: 'CBC - Apollo Hospital', date: '12 Feb 2026', icon: TestTube },
      { type: 'Vital Log', title: 'Blood Sugar Readings', date: 'Feb 2026', icon: Heart },
    ],
    badges: ['Grounded'],
  },
  {
    id: 3, role: 'user' as const,
    text: 'Should I increase my Metformin dose?',
  },
  {
    id: 4, role: 'ai' as const,
    text: 'I cannot recommend medication dosage changes — that decision should be made by your prescribing doctor, Dr. S. Reddy.\n\nWhat I can tell you is that your current Metformin 500mg dose was prescribed in January 2024, and your HbA1c has slightly increased from 6.5% to 6.8% over the past 6 months. This information may be helpful to discuss with Dr. Reddy at your next appointment.',
    sources: [
      { type: 'Prescription', title: 'Diabetes Management - Dr. Reddy', date: 'Jan 2024', icon: Pill },
    ],
    badges: ['Not medical diagnosis'],
  },
];

const contextAdvice = [
  {
    trigger: 'Weather Alert',
    icon: ThermometerSnowflake,
    color: '#3B82F6',
    title: 'Cold Wave Advisory — Delhi NCR',
    desc: 'Temperature dropping to 4°C tonight. For patients with hypertension, cold weather can cause temporary BP spikes.',
    advice: [
      'Monitor your blood pressure more frequently',
      'Keep warm — layer clothing and use room heating',
      'Take medications on time, especially Amlodipine',
      'Avoid sudden exposure to cold wind',
    ],
    conditions: ['Hypertension'],
  },
  {
    trigger: 'Travel Context',
    icon: Plane,
    color: '#8B5CF6',
    title: 'Upcoming Travel — Mumbai',
    desc: 'Based on your calendar, you have a trip to Mumbai (high humidity, 32°C). Diabetes management tips for travel:',
    advice: [
      'Carry extra medication and insulin (if applicable)',
      'Monitor blood sugar more frequently during travel',
      'Stay hydrated — carry ORS packets',
      'Keep a copy of your prescriptions accessible',
    ],
    conditions: ['Pre-diabetes'],
  },
];

export default function AIScreen() {
  const [view, setView] = useState<AIView>('summary');

  if (view === 'chat') return <AIChatScreen onBack={() => setView('summary')} onRefusal={() => setView('refusal')} />;
  if (view === 'context') return <ContextAdviceScreen onBack={() => setView('summary')} />;
  if (view === 'refusal') return <AIRefusalScreen onBack={() => setView('chat')} />;

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>AI Health Insights</h2>
          <button onClick={() => setView('context')} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <Cloud size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Chat CTA */}
        <button onClick={() => setView('chat')} className="w-full bg-gradient-to-r from-primary to-[#088A7F] rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>Ask Kinsu AI</p>
            <p className="text-white/70" style={{ fontSize: '12px' }}>Chat about your health data with citations</p>
          </div>
          <ChevronRight size={18} className="text-white/60" />
        </button>
      </div>

      {/* Medical Disclaimer */}
      <div className="mx-5 mt-4 bg-amber-50 rounded-xl p-3 flex gap-2.5">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800" style={{ fontSize: '11px', lineHeight: '1.5' }}>
          <strong>Not a medical diagnosis.</strong> AI insights are generated from your health records and should not replace professional medical advice. Always consult your doctor.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Health Summary</h3>
        {summaryCards.map(card => (
          <div key={card.id} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontSize: '15px', fontWeight: 600 }}>{card.title}</p>
                <span className={`px-2 py-0.5 rounded-full ${card.badgeColor}`} style={{ fontSize: '11px', fontWeight: 600 }}>
                  {card.badge}
                </span>
              </div>
              <p className="text-muted-foreground" style={{ fontSize: '13px', lineHeight: '1.6' }}>{card.summary}</p>

              {/* Action */}
              <div className="mt-3 bg-primary/5 rounded-xl p-3">
                <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-primary mb-0.5">Suggested Action</p>
                <p className="text-foreground" style={{ fontSize: '12px' }}>{card.action}</p>
              </div>
            </div>

            {/* Sources */}
            <div className="border-t border-border px-4 py-3">
              <p className="text-muted-foreground mb-2 flex items-center gap-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                <BookOpen size={11} /> Source Records
              </p>
              <div className="flex flex-col gap-1.5">
                {card.sources.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText size={12} className="text-muted-foreground" />
                    <span className="text-foreground" style={{ fontSize: '12px' }}>{s.title}</span>
                    <span className="text-muted-foreground" style={{ fontSize: '10px' }}>· {s.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Context Advice Preview */}
        <h3 style={{ fontSize: '16px', fontWeight: 600 }} className="mt-2">Context Alerts</h3>
        {contextAdvice.slice(0, 1).map((c, i) => (
          <button key={i} onClick={() => setView('context')} className="bg-card rounded-2xl p-4 border border-border text-left w-full active:scale-[0.99] transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c.color}12` }}>
                <c.icon size={18} style={{ color: c.color }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{c.title}</p>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{c.trigger}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AIChatScreen({ onBack, onRefusal }: { onBack: () => void; onRefusal: () => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: messages.length + 1, role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Check for diagnostic question
    if (input.toLowerCase().includes('diagnos') || input.toLowerCase().includes('what disease')) {
      setTimeout(() => {
        setTyping(false);
        onRefusal();
      }, 1500);
      return;
    }

    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'ai' as const,
        text: 'Based on your recent health data, I can share the following observations. However, please note this is not a medical diagnosis — always consult your healthcare provider for clinical decisions.',
        sources: [{ type: 'General', title: 'Your Health Records', date: 'Recent', icon: FileText }],
        badges: ['Grounded'],
      }]);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-5 pt-12 pb-3 bg-card border-b border-border flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
        <div className="flex-1">
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Kinsu AI</h3>
          <p className="text-muted-foreground" style={{ fontSize: '11px' }}>Grounded in your health records</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-green-700" style={{ fontSize: '10px', fontWeight: 600 }}>Online</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mx-5 mt-3 bg-amber-50 rounded-xl p-2.5 flex gap-2">
        <Shield size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-700" style={{ fontSize: '10px', lineHeight: '1.4' }}>
          AI responses are based on your health records. This is not a replacement for professional medical advice.
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3' : ''}`}>
              {msg.role === 'ai' ? (
                <div className="bg-card rounded-2xl rounded-bl-md border border-border overflow-hidden">
                  <div className="p-4">
                    {'badges' in msg && msg.badges && (
                      <div className="flex gap-1.5 mb-2">
                        {msg.badges.map((b: string) => (
                          <span key={b} className={`px-2 py-0.5 rounded-full ${b === 'Grounded' ? 'bg-green-50 text-green-700' : b === 'Needs Review' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                            {b === 'Grounded' ? '✓ ' : b === 'Not medical diagnosis' ? '⚕ ' : ''}{b}
                          </span>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: '13px', lineHeight: '1.7' }} className="text-foreground whitespace-pre-line">{msg.text}</p>
                  </div>
                  {'sources' in msg && msg.sources && (
                    <div className="border-t border-border px-4 py-2.5 bg-muted/30">
                      <p className="text-muted-foreground flex items-center gap-1 mb-1.5" style={{ fontSize: '10px', fontWeight: 600 }}>
                        <BookOpen size={10} /> SOURCE RECORDS
                      </p>
                      {msg.sources.map((s: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 py-1">
                          <s.icon size={11} className="text-muted-foreground" />
                          <span style={{ fontSize: '11px' }} className="text-foreground">{s.title}</span>
                          <span className="text-muted-foreground" style={{ fontSize: '10px' }}>· {s.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-card rounded-2xl border border-border px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-muted-foreground"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 py-3 bg-card border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your health..."
            className="flex-1 h-11 px-4 bg-muted rounded-2xl text-foreground placeholder:text-muted-foreground"
            style={{ fontSize: '14px' }}
          />
          <button onClick={sendMessage} disabled={!input.trim()} className="w-11 h-11 bg-primary rounded-full flex items-center justify-center disabled:opacity-40">
            <Send size={16} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AIRefusalScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-5 pt-12 pb-3 bg-card border-b border-border flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Kinsu AI</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-center mb-2">Insufficient Evidence for Diagnosis</h3>
        <p className="text-muted-foreground text-center mb-6" style={{ fontSize: '14px', lineHeight: '1.6' }}>
          Kinsu AI cannot provide medical diagnoses. This question requires clinical examination and professional medical judgment.
        </p>

        <div className="w-full bg-card rounded-2xl p-4 border border-border mb-4">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-2">What I Can Help With</h4>
          <div className="flex flex-col gap-2">
            {['Summarize your health records', 'Track trends in lab values', 'Explain medical terminology', 'Prepare questions for your doctor'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check size={14} className="text-green-600" />
                <span style={{ fontSize: '13px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-card rounded-2xl p-4 border border-border">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-2">What I Cannot Do</h4>
          <div className="flex flex-col gap-2">
            {['Diagnose diseases or conditions', 'Prescribe or change medications', 'Replace doctor consultations', 'Interpret imaging results clinically'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <X size={14} className="text-red-500" />
                <span style={{ fontSize: '13px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onBack} className="w-full h-12 bg-primary text-primary-foreground rounded-2xl mt-6">Go Back to Chat</button>
      </div>
    </div>
  );
}

function ContextAdviceScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Context Advice</h3>
        </div>
        <p className="text-muted-foreground ml-12" style={{ fontSize: '13px' }}>Personalized tips based on weather & travel</p>
      </div>

      {/* Disclaimer */}
      <div className="mx-5 mt-4 bg-amber-50 rounded-xl p-3 flex gap-2.5">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800" style={{ fontSize: '11px', lineHeight: '1.5' }}>
          <strong>Not a replacement for your doctor.</strong> These are general wellness tips based on your conditions and current context. Always follow your doctor's specific advice.
        </p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {contextAdvice.map((c, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c.color}12` }}>
                  <c.icon size={18} style={{ color: c.color }} />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: '10px' }}>{c.trigger}</span>
                  <p className="mt-1" style={{ fontSize: '15px', fontWeight: 600 }}>{c.title}</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '13px', lineHeight: '1.5' }}>{c.desc}</p>
              <div className="flex flex-col gap-2">
                {c.advice.map((a, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    <span style={{ fontSize: '13px' }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-border px-4 py-2.5 flex gap-2">
              <span className="text-muted-foreground" style={{ fontSize: '11px' }}>Relevant conditions:</span>
              {c.conditions.map(cond => (
                <span key={cond} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full" style={{ fontSize: '11px' }}>{cond}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
