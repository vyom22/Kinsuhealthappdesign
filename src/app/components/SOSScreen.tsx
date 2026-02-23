import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle, Phone, MapPin, X, Check, ChevronRight,
  Shield, Clock, Users, Hospital, Navigation, Radio, Heart
} from 'lucide-react';

type SOSView = 'entry' | 'confirm' | 'active';

const emergencyContacts = [
  { name: 'Ravi Sharma', relation: 'Brother', phone: '+91 98765 43211', notified: false },
  { name: 'Rajesh Sharma', relation: 'Father', phone: '+91 98765 43212', notified: false },
  { name: 'Dr. Rahul Kapoor', relation: 'Cardiologist', phone: '+91 98765 43213', notified: false },
];

const nearbyHospitals = [
  { name: 'Apollo Hospital', distance: '1.2 km', time: '5 min', hasEmergency: true },
  { name: 'Fortis Hospital', distance: '2.8 km', time: '12 min', hasEmergency: true },
  { name: 'Max Super Speciality', distance: '4.1 km', time: '18 min', hasEmergency: true },
];

export default function SOSScreen() {
  const [view, setView] = useState<SOSView>('entry');
  const navigate = useNavigate();

  const goBack = () => navigate('/app/home');

  if (view === 'confirm') return <SOSConfirmation onActivate={() => setView('active')} onCancel={goBack} />;
  if (view === 'active') return <SOSActive onDeactivate={goBack} />;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={goBack} className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center">
          <X size={16} className="text-foreground" />
        </button>
        <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Emergency SOS</h3>
      </div>

      {/* Main SOS Button */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <motion.button
          onClick={() => setView('confirm')}
          className="relative w-48 h-48 rounded-full bg-red-600 shadow-xl flex items-center justify-center active:scale-95 transition-transform"
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-400"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-300"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <div className="flex flex-col items-center gap-2 z-10">
            <AlertTriangle size={40} className="text-white" />
            <span className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>SOS</span>
          </div>
        </motion.button>

        <p className="text-red-600 mt-6" style={{ fontSize: '16px', fontWeight: 600 }}>Tap to trigger emergency</p>
        <p className="text-muted-foreground mt-2 text-center max-w-[280px]" style={{ fontSize: '13px', lineHeight: '1.5' }}>
          This will alert your emergency contacts, share your location, and show nearby hospitals.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-5 pb-10 flex flex-col gap-2">
        <a href="tel:112" className="w-full h-12 bg-white border border-border rounded-2xl flex items-center justify-center gap-2 text-foreground active:scale-[0.98] transition-transform">
          <Phone size={16} className="text-red-600" />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Call 112 (Emergency)</span>
        </a>
        <a href="tel:102" className="w-full h-12 bg-white border border-border rounded-2xl flex items-center justify-center gap-2 text-foreground active:scale-[0.98] transition-transform">
          <Hospital size={16} className="text-blue-600" />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Call 102 (Ambulance)</span>
        </a>
      </div>
    </div>
  );
}

function SOSConfirmation({ onActivate, onCancel }: { onActivate: () => void; onCancel: () => void }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    } else {
      onActivate();
    }
  }, [countdown, onActivate]);

  return (
    <div className="h-full flex flex-col bg-red-600">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onCancel} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <X size={16} className="text-white" />
        </button>
        <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>Confirm SOS</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <motion.div
          className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-white" style={{ fontSize: '56px', fontWeight: 700 }}>{countdown}</span>
        </motion.div>

        <p className="text-white text-center" style={{ fontSize: '18px', fontWeight: 600 }}>Emergency alert activating...</p>
        <p className="text-white/70 text-center mt-2" style={{ fontSize: '14px' }}>Tap cancel to stop</p>
      </div>

      {/* Recipients */}
      <div className="px-5 pb-6">
        <p className="text-white/80 mb-3" style={{ fontSize: '13px', fontWeight: 600 }}>Will notify:</p>
        {emergencyContacts.map((c, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Users size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>{c.name}</p>
              <p className="text-white/60" style={{ fontSize: '12px' }}>{c.relation}</p>
            </div>
          </div>
        ))}

        <div className="flex gap-3 mt-4">
          <button onClick={onCancel} className="flex-1 h-12 bg-white/20 rounded-2xl text-white" style={{ fontSize: '14px' }}>Cancel</button>
          <button onClick={onActivate} className="flex-1 h-12 bg-white rounded-2xl text-red-600" style={{ fontSize: '14px', fontWeight: 600 }}>Activate Now</button>
        </div>
      </div>
    </div>
  );
}

function SOSActive({ onDeactivate }: { onDeactivate: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [contacts, setContacts] = useState(emergencyContacts.map(c => ({ ...c, notified: false })));

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timeouts = contacts.map((_, i) =>
      setTimeout(() => {
        setContacts(prev => {
          const next = [...prev];
          next[i] = { ...next[i], notified: true };
          return next;
        });
      }, (i + 1) * 2000)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const escalationTimeline = [
    { time: '0:00', event: 'SOS Triggered', desc: 'Emergency contacts being notified', status: 'done' },
    { time: '0:05', event: 'Contacts Notified', desc: 'Location shared with all contacts', status: elapsed > 5 ? 'done' : 'pending' },
    { time: '0:30', event: 'Location Update', desc: 'Real-time location being shared', status: elapsed > 30 ? 'done' : 'pending' },
    { time: '2:00', event: 'Escalation', desc: 'Alert nearby hospital if no response', status: 'pending' },
  ];

  return (
    <div className="h-full flex flex-col bg-red-600">
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>🔴 SOS Active</h3>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full"
        >
          <Radio size={12} className="text-white" />
          <span className="text-white" style={{ fontSize: '12px', fontWeight: 600 }}>LIVE</span>
        </motion.div>
      </div>

      {/* Timer */}
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="bg-white/20 rounded-2xl p-4 flex-1 text-center">
          <p className="text-white/70" style={{ fontSize: '12px' }}>Active for</p>
          <p className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>{formatTime(elapsed)}</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 flex-1 text-center">
          <p className="text-white/70" style={{ fontSize: '12px' }}>Location</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <MapPin size={14} className="text-white" />
            <p className="text-white" style={{ fontSize: '13px', fontWeight: 500 }}>Sharing live</p>
          </div>
        </div>
      </div>

      {/* Contacts Status */}
      <div className="px-5">
        <p className="text-white/80 mb-2" style={{ fontSize: '13px', fontWeight: 600 }}>Contact Status</p>
        <div className="bg-white/10 rounded-2xl overflow-hidden">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-white/10 last:border-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${c.notified ? 'bg-green-400/30' : 'bg-white/20'}`}>
                {c.notified ? <Check size={14} className="text-green-300" /> : (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Clock size={14} className="text-white/60" />
                  </motion.div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>{c.name}</p>
                <p className="text-white/60" style={{ fontSize: '11px' }}>{c.relation}</p>
              </div>
              <span className="text-white/70" style={{ fontSize: '11px' }}>
                {c.notified ? '✓ Notified' : 'Notifying...'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Hospitals */}
      <div className="px-5 mt-4">
        <p className="text-white/80 mb-2" style={{ fontSize: '13px', fontWeight: 600 }}>Nearby Hospitals</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {nearbyHospitals.map((h, i) => (
            <div key={i} className="min-w-[160px] bg-white/10 rounded-xl p-3">
              <p className="text-white" style={{ fontSize: '13px', fontWeight: 500 }}>{h.name}</p>
              <div className="flex items-center gap-2 mt-1 text-white/60" style={{ fontSize: '11px' }}>
                <Navigation size={10} />{h.distance} · {h.time}
              </div>
              {h.hasEmergency && <span className="text-green-300 mt-1 inline-block" style={{ fontSize: '10px' }}>● Emergency dept</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Timeline */}
      <div className="px-5 mt-4">
        <p className="text-white/80 mb-2" style={{ fontSize: '13px', fontWeight: 600 }}>Escalation Timeline</p>
        <div className="bg-white/10 rounded-2xl p-4">
          {escalationTimeline.map((e, i) => (
            <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${e.status === 'done' ? 'bg-green-400/30' : 'bg-white/20'}`}>
                {e.status === 'done' ? <Check size={10} className="text-green-300" /> : <Clock size={10} className="text-white/50" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white/50" style={{ fontSize: '11px' }}>{e.time}</span>
                  <span className="text-white" style={{ fontSize: '13px', fontWeight: 500 }}>{e.event}</span>
                </div>
                <p className="text-white/60" style={{ fontSize: '11px' }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deactivate */}
      <div className="px-5 py-6 mt-auto">
        <button onClick={onDeactivate} className="w-full h-12 bg-white rounded-2xl text-red-600 active:scale-[0.98] transition-transform" style={{ fontWeight: 600 }}>
          Deactivate SOS
        </button>
      </div>
    </div>
  );
}
