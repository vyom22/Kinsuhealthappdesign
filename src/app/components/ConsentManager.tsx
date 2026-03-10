import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, ChevronRight, Check, X, FileText, Lock, Eye, AlertCircle,
  Download, Clock, History, ChevronLeft, Database, UserCheck, Trash2,
  Edit3, MessageSquare, Phone, Mail, ExternalLink
} from 'lucide-react';

type ConsentStep = 'intro' | 'details' | 'granular' | 'history' | 'rights';

const DATA_CATEGORIES = [
  { icon: FileText, label: 'Medical Records', desc: 'Lab reports, prescriptions, discharge summaries, X-rays, scans', why: 'To store and display your health history', retention: '10 years or as legally required', color: '#0A9B8F' },
  { icon: Shield, label: 'Identity Information', desc: 'Name, date of birth, gender, mobile number, ABHA ID', why: 'To create and secure your account', retention: 'Until account deletion', color: '#3B82F6' },
  { icon: Database, label: 'Health Metrics', desc: 'Vitals, symptoms, medications, lab parameters you log', why: 'To track trends and provide AI insights', retention: '10 years or account deletion', color: '#8B5CF6' },
  { icon: Lock, label: 'Insurance Details', desc: 'Policy numbers, insurer name, claim history', why: 'Optional — only if you share records with insurers', retention: 'Until you withdraw consent', color: '#F59E0B' },
];

const CONSENT_ITEMS = [
  {
    key: 'core' as const, label: 'Core Healthcare Services', mandatory: true,
    desc: 'Storing your medical records, processing prescriptions, and core app functionality.',
    detail: 'Required for the app to work. Cannot be disabled.',
  },
  {
    key: 'insurance' as const, label: 'Insurance Coordination', mandatory: false,
    desc: 'Sharing reports with your insurer for faster claim settlements.',
    detail: 'Your reports will be shared only with insurers you specify. You can revoke anytime.',
  },
  {
    key: 'research' as const, label: 'Anonymized Medical Research', mandatory: false,
    desc: 'Contribute anonymized data to help improve Indian healthcare outcomes.',
    detail: 'Your identity is never shared. Only aggregated, de-identified data is used.',
  },
  {
    key: 'hospital' as const, label: 'Partner Hospital Sharing', mandatory: false,
    desc: 'Seamlessly share records with Apollo, Max, Fortis, Medanta for quicker care.',
    detail: 'You control which hospitals see which records. Each share is logged and shown in history.',
  },
  {
    key: 'marketing' as const, label: 'Health Offers & Wellness Tips', mandatory: false,
    desc: 'Receive personalized health packages, discounts, and wellness content.',
    detail: 'You can opt out at any time. We do not sell your data to advertisers.',
  },
];

const RIGHTS = [
  { icon: Eye, label: 'Right to Access', desc: 'Request a copy of all data we hold about you. Delivered within 30 days.', action: 'Request Data', color: '#3B82F6' },
  { icon: Edit3, label: 'Right to Correct', desc: 'Ask us to correct inaccurate personal data in your profile.', action: 'Correct Data', color: '#0A9B8F' },
  { icon: Trash2, label: 'Right to Erasure', desc: 'Request complete deletion of your account and all data. Irreversible.', action: 'Delete My Data', color: '#DC2626', danger: true },
  { icon: UserCheck, label: 'Right to Nominee', desc: 'Nominate a trusted person to manage your data if incapacitated.', action: 'Add Nominee', color: '#8B5CF6' },
  { icon: MessageSquare, label: 'Grievance Redressal', desc: 'Raise a complaint with our Data Protection Officer.', action: 'File Complaint', color: '#F59E0B' },
];

function Toggle({ on, onToggle, disabled }: { on: boolean; onToggle?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${on ? 'bg-primary' : 'bg-slate-200'} ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      <motion.span
        className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0"
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export function ConsentManager() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ConsentStep>('intro');
  const [consents, setConsents] = useState({ core: true, insurance: false, research: false, hospital: false, marketing: false });
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<Record<string, string>>({});

  const toggleConsent = (key: keyof typeof consents) => {
    if (key === 'core') return;
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAcceptAll = () => {
    setConsents({ core: true, insurance: true, research: true, hospital: true, marketing: true });
    setTimeout(() => navigate('/profile-setup'), 500);
  };

  const handleDeclineOptional = () => {
    setConsents({ core: true, insurance: false, research: false, hospital: false, marketing: false });
    setTimeout(() => navigate('/profile-setup'), 500);
  };

  const handleContinue = () => navigate('/profile-setup');

  const sendRequest = (label: string) => {
    setRequestStatus(prev => ({ ...prev, [label]: 'pending' }));
    setTimeout(() => setRequestStatus(prev => ({ ...prev, [label]: 'submitted' })), 1200);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          {step !== 'intro' && (
            <button onClick={() => setStep('intro')} className="p-1.5 rounded-full hover:bg-slate-100">
              <ChevronLeft size={20} className="text-slate-700" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield size={15} className="text-primary" />
            </div>
            <span className="font-semibold text-slate-800" style={{ fontSize: '14px' }}>Privacy & Consent</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStep('history')} className="text-primary flex items-center gap-1" style={{ fontSize: '12px' }}>
            <History size={13} /> History
          </button>
          <button onClick={() => setStep('rights')} className="text-slate-500 flex items-center gap-1" style={{ fontSize: '12px' }}>
            <UserCheck size={13} /> Rights
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <AnimatePresence mode="wait">
          {/* Intro Step */}
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="py-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-[#088A7F] rounded-3xl flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
                  <Shield size={28} className="text-white" />
                </div>
                <h1 className="text-slate-900 mb-2" style={{ fontSize: '24px', fontWeight: 700 }}>Your Data, Your Rules</h1>
                <p className="text-slate-500 mb-1" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  Kinsu Health is fully compliant with the <span className="font-semibold text-slate-700">Digital Personal Data Protection (DPDP) Act, 2023</span>.
                </p>
                <p className="text-slate-400 mb-6" style={{ fontSize: '12px' }}>
                  🔒 Your health data is encrypted end-to-end. We never sell your data.
                </p>

                {/* What we collect */}
                <div className="mb-5">
                  <h3 className="text-slate-800 mb-3" style={{ fontSize: '15px', fontWeight: 700 }}>What we collect & why</h3>
                  <div className="space-y-2.5">
                    {DATA_CATEGORIES.map(cat => (
                      <div key={cat.label} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}15` }}>
                          <cat.icon size={16} style={{ color: cat.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 font-semibold" style={{ fontSize: '13px' }}>{cat.label}</p>
                          <p className="text-slate-400 mt-0.5" style={{ fontSize: '11px' }}>{cat.desc}</p>
                          <p className="text-primary mt-1" style={{ fontSize: '11px', fontWeight: 500 }}>Purpose: {cat.why}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock size={9} className="text-slate-300" />
                            <p className="text-slate-400" style={{ fontSize: '10px' }}>Retained: {cat.retention}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { emoji: '🔐', label: 'End-to-End Encrypted' },
                    { emoji: '🇮🇳', label: 'DPDP Act 2023 Compliant' },
                    { emoji: '🚫', label: 'Never Sold to Advertisers' },
                  ].map(b => (
                    <div key={b.label} className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                      <p className="text-lg mb-0.5">{b.emoji}</p>
                      <p className="text-slate-500" style={{ fontSize: '9px', lineHeight: '1.4' }}>{b.label}</p>
                    </div>
                  ))}
                </div>

                <p className="text-slate-400 text-center" style={{ fontSize: '11px' }}>
                  ⚠️ Kinsu is not designed for collecting sensitive personal information. Avoid sharing information you're not comfortable storing digitally.
                </p>
              </div>
            </motion.div>
          )}

          {/* Granular Step */}
          {step === 'granular' && (
            <motion.div key="granular" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="py-5">
                <h2 className="text-slate-900 mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>Customise Permissions</h2>
                <p className="text-slate-400 mb-5" style={{ fontSize: '13px' }}>You can change these at any time in Settings → Privacy.</p>
                <div className="space-y-3">
                  {CONSENT_ITEMS.map(item => (
                    <div key={item.key} className={`rounded-2xl border overflow-hidden ${item.mandatory ? 'border-slate-100 bg-slate-50' : 'border-slate-200 bg-white'}`}>
                      <div className="p-4 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-slate-900" style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</h3>
                            {item.mandatory && (
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">Required</span>
                            )}
                          </div>
                          <p className="text-slate-500" style={{ fontSize: '12px', lineHeight: '1.4' }}>{item.desc}</p>
                          <button onClick={() => setExpandedItem(expandedItem === item.key ? null : item.key)}
                            className="text-primary mt-1.5" style={{ fontSize: '11px' }}>
                            {expandedItem === item.key ? 'Show less ↑' : 'Learn more ↓'}
                          </button>
                        </div>
                        <Toggle on={consents[item.key]} onToggle={() => toggleConsent(item.key)} disabled={item.mandatory} />
                      </div>
                      <AnimatePresence>
                        {expandedItem === item.key && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden">
                            <div className="px-4 pb-3 bg-primary/5 border-t border-primary/10">
                              <p className="text-primary mt-2" style={{ fontSize: '12px', lineHeight: '1.5' }}>{item.detail}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* History Step */}
          {step === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="py-5">
                <h2 className="text-slate-900 mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>Consent History</h2>
                <p className="text-slate-400 mb-5" style={{ fontSize: '13px' }}>A transparent audit trail of all consent decisions.</p>

                <div className="space-y-3 mb-6">
                  {[
                    { version: '2.4', date: '2 Mar 2026', time: '10:42 AM', action: 'Consent updated — Insurance enabled', current: true },
                    { version: '2.3', date: '15 Jan 2026', time: '9:15 AM', action: 'Initial consent given — Core services', current: false },
                    { version: '2.2', date: '1 Dec 2025', time: '2:30 PM', action: 'Research consent declined', current: false },
                  ].map((h, i) => (
                    <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${h.current ? 'bg-green-500' : 'bg-slate-300'}`} />
                          <span className="font-semibold text-slate-800" style={{ fontSize: '13px' }}>
                            {h.current ? 'Current' : 'Version'} {h.version}
                          </span>
                          {h.current && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-medium">Active</span>}
                        </div>
                        <span className="text-slate-400" style={{ fontSize: '11px' }}>{h.date}</span>
                      </div>
                      <p className="text-slate-500" style={{ fontSize: '12px' }}>{h.action}</p>
                      <p className="text-slate-400 mt-0.5" style={{ fontSize: '10px' }}>{h.time}</p>
                      <button className="text-primary mt-2 flex items-center gap-1" style={{ fontSize: '11px' }}>
                        <Download size={11} /> Download Agreement PDF
                      </button>
                    </div>
                  ))}
                </div>

                {/* Withdrawal */}
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <h4 className="text-red-700 font-semibold mb-1" style={{ fontSize: '13px' }}>Withdraw Consent</h4>
                  <p className="text-red-500 mb-3" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                    You may withdraw optional consents at any time. Withdrawing core consent will disable the app. This will not delete your data — use "Right to Erasure" for that.
                  </p>
                  <button className="w-full h-10 bg-white border border-red-200 text-red-600 rounded-xl font-medium" style={{ fontSize: '13px' }}>
                    Manage Withdrawal
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rights Step */}
          {step === 'rights' && (
            <motion.div key="rights" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="py-5">
                <h2 className="text-slate-900 mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>Your Rights as Data Principal</h2>
                <p className="text-slate-400 mb-5" style={{ fontSize: '13px' }}>Under DPDP Act 2023, you have the following rights.</p>
                <div className="space-y-3 mb-6">
                  {RIGHTS.map(r => {
                    const status = requestStatus[r.label];
                    return (
                      <div key={r.label} className="bg-white border border-slate-200 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${r.color}15` }}>
                            <r.icon size={16} style={{ color: r.color }} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900" style={{ fontSize: '14px' }}>{r.label}</p>
                            <p className="text-slate-500 mt-0.5" style={{ fontSize: '12px', lineHeight: '1.4' }}>{r.desc}</p>
                            {status === 'submitted' ? (
                              <div className="flex items-center gap-1.5 mt-2">
                                <Check size={12} className="text-green-600" />
                                <span className="text-green-600" style={{ fontSize: '11px' }}>Request submitted — We'll respond within 30 days</span>
                              </div>
                            ) : status === 'pending' ? (
                              <span className="text-primary mt-2 inline-block" style={{ fontSize: '11px' }}>Processing...</span>
                            ) : (
                              <button onClick={() => sendRequest(r.label)}
                                className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${r.danger ? 'bg-red-50 text-red-600 border border-red-200' : 'text-primary bg-primary/5'}`}>
                                {r.action}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DPO Contact */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3" style={{ fontSize: '14px' }}>Data Protection Officer (DPO)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span className="text-slate-700" style={{ fontSize: '13px' }}>dpo@kinsuhealth.in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      <span className="text-slate-700" style={{ fontSize: '13px' }}>+91 80 4567 8901 (Mon–Fri, 9 AM–6 PM IST)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink size={14} className="text-slate-400" />
                      <span className="text-primary" style={{ fontSize: '13px' }}>kinsuhealth.in/privacy</span>
                    </div>
                  </div>
                  <p className="text-slate-400 mt-2" style={{ fontSize: '10px' }}>You may also file a complaint with the Data Protection Board of India.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-5 pt-3 bg-white border-t border-slate-100">
        {step === 'intro' && (
          <div className="flex flex-col gap-3">
            <button onClick={handleAcceptAll}
              className="w-full h-[52px] bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              <Check size={18} /> Accept All & Continue
            </button>
            <button onClick={() => setStep('granular')}
              className="w-full h-[52px] bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl font-medium active:scale-[0.98] transition-transform">
              Customise Settings
            </button>
            <button onClick={handleDeclineOptional} className="text-slate-400 text-center py-1" style={{ fontSize: '12px' }}>
              Decline Optional Only (limited features)
            </button>
          </div>
        )}
        {step === 'granular' && (
          <button onClick={handleContinue}
            className="w-full h-[52px] bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            Save & Continue <ChevronRight size={18} />
          </button>
        )}
        {(step === 'history' || step === 'rights') && (
          <button onClick={() => setStep('intro')}
            className="w-full h-[52px] bg-slate-900 text-white rounded-2xl font-medium active:scale-[0.98] transition-transform">
            Back to Consent
          </button>
        )}
      </div>
    </div>
  );
}
