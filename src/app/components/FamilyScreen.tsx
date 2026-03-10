import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Plus, X, ChevronRight, Shield, Eye, Edit3, Heart,
  FileText, Pill, Activity, Phone, Check, AlertCircle, UserPlus, Camera, User, Droplets, Calendar
} from 'lucide-react';

const familyMembers = [
  {
    id: 'self', name: 'Priya Sharma', relation: 'Self', age: 34, blood: 'B+',
    avatar: 'PS', color: '#0A9B8F', conditions: ['Pre-diabetes', 'Hypertension'],
    lastActivity: 'BP logged today', records: 24, meds: 4,
  },
  {
    id: 'amma', name: 'Lakshmi Sharma', relation: 'Mother', age: 62, blood: 'A+',
    avatar: 'LS', color: '#8B5CF6', conditions: ['Type 2 Diabetes', 'Thyroid'],
    lastActivity: 'Sugar logged yesterday', records: 18, meds: 6,
  },
  {
    id: 'papa', name: 'Rajesh Sharma', relation: 'Father', age: 65, blood: 'O+',
    avatar: 'RS', color: '#3B82F6', conditions: ['Hypertension', 'Cholesterol'],
    lastActivity: 'Medication taken today', records: 15, meds: 5,
  },
  {
    id: 'ravi', name: 'Ravi Sharma', relation: 'Brother', age: 28, blood: 'B+',
    avatar: 'RV', color: '#F59E0B', conditions: [],
    lastActivity: 'Profile created', records: 3, meds: 0,
  },
];

const caregiverPermissions = [
  { action: 'View health records', desc: 'Access uploaded documents and reports', enabled: true },
  { action: 'Log vitals', desc: 'Record blood pressure, sugar, and other vitals', enabled: true },
  { action: 'Manage medications', desc: 'Add or update medication schedules', enabled: true },
  { action: 'Log symptoms', desc: 'Record symptoms on behalf of patient', enabled: true },
  { action: 'Receive SOS alerts', desc: 'Get notified during emergency triggers', enabled: true },
  { action: 'View AI summaries', desc: 'Access AI-generated health insights', enabled: false },
  { action: 'Share records externally', desc: 'Share documents with other providers', enabled: false },
  { action: 'Delete records', desc: 'Permanently remove health documents', enabled: false },
];

type FamilyView = 'list' | 'permissions' | 'addMember';

export default function FamilyScreen() {
  const [view, setView] = useState<FamilyView>('list');
  const [selectedMember, setSelectedMember] = useState(familyMembers[1]);

  if (view === 'permissions') return (
    <CaregiverPermissions member={selectedMember} onBack={() => setView('list')} />
  );

  if (view === 'addMember') return (
    <AddFamilyMemberScreen onBack={() => setView('list')} onSave={() => setView('list')} />
  );

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Family</h2>
          <button onClick={() => setView('addMember')} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <UserPlus size={16} className="text-primary-foreground" />
          </button>
        </div>
        <p className="text-muted-foreground mt-1" style={{ fontSize: '13px' }}>Manage family members and caregiver access</p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        {/* Active Caregiver Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p style={{ fontSize: '14px', fontWeight: 600 }} className="text-primary">Caregiver Mode Available</p>
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Log health data on behalf of family members</p>
          </div>
        </div>

        {/* Family Members */}
        {familyMembers.map(m => (
          <div key={m.id} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${m.color}18` }}>
                <span style={{ color: m.color, fontSize: '15px', fontWeight: 600 }}>{m.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p style={{ fontSize: '15px', fontWeight: 600 }}>{m.name}</p>
                  {m.id === 'self' && <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded" style={{ fontSize: '10px', fontWeight: 600 }}>You</span>}
                </div>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{m.relation} · {m.age}y · {m.blood}</p>
              </div>
              <button
                onClick={() => { setSelectedMember(m); setView('permissions'); }}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            </div>

            {m.conditions.length > 0 && (
              <div className="px-4 pb-3 flex gap-1.5 flex-wrap">
                {m.conditions.map(c => (
                  <span key={c} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full" style={{ fontSize: '11px' }}>{c}</span>
                ))}
              </div>
            )}

            <div className="border-t border-border px-4 py-2.5 flex items-center gap-4">
              <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: '11px' }}>
                <FileText size={11} /> {m.records} records
              </span>
              <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: '11px' }}>
                <Pill size={11} /> {m.meds} medications
              </span>
              <span className="text-muted-foreground ml-auto" style={{ fontSize: '11px' }}>{m.lastActivity}</span>
            </div>
          </div>
        ))}

        {/* Add Member */}
        <button onClick={() => setView('addMember')} className="bg-card rounded-2xl p-4 border border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground">
          <Plus size={18} />
          <span style={{ fontSize: '14px' }}>Add Family Member</span>
        </button>
      </div>
    </div>
  );
}

function CaregiverPermissions({ member, onBack }: { member: typeof familyMembers[0]; onBack: () => void }) {
  const [perms, setPerms] = useState(caregiverPermissions);

  const toggle = (idx: number) => {
    const next = [...perms];
    next[idx] = { ...next[idx], enabled: !next[idx].enabled };
    setPerms(next);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Caregiver Controls</h3>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Member Info */}
        <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${member.color}18` }}>
            <span style={{ color: member.color, fontSize: '15px', fontWeight: 600 }}>{member.avatar}</span>
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>{member.name}</p>
            <p className="text-muted-foreground" style={{ fontSize: '13px' }}>{member.relation} · {member.age} years · {member.blood}</p>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-4 pb-2">
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Your Permissions for {member.name.split(' ')[0]}</h4>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: '12px' }}>Control what you can do as a caregiver</p>
          </div>
          {perms.map((p, i) => (
            <div key={i} className="px-4 py-3 border-t border-border flex items-center gap-3">
              <div className="flex-1">
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{p.action}</p>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{p.desc}</p>
              </div>
              <button
                onClick={() => toggle(i)}
                className={`w-11 h-6 rounded-full transition-all relative ${p.enabled ? 'bg-primary' : 'bg-muted'}`}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                  animate={{ left: p.enabled ? 22 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Consent Notice */}
        <div className="bg-amber-50 rounded-2xl p-4 flex gap-3">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-amber-800">Consent Required</p>
            <p className="text-amber-700 mt-0.5" style={{ fontSize: '12px', lineHeight: '1.5' }}>
              Changes to caregiver permissions require confirmation from the patient ({member.name.split(' ')[0]}). An OTP will be sent to their registered number.
            </p>
          </div>
        </div>

        <button onClick={onBack} className="w-full h-12 bg-primary text-primary-foreground rounded-2xl">Save Permissions</button>
      </div>
    </div>
  );
}

function AddFamilyMemberScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [dob, setDob] = useState('');
  const [blood, setBlood] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);

  const relations = ['Mother', 'Father', 'Spouse', 'Son', 'Daughter', 'Sibling', 'Grandparent', 'Other'];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onSave(); }, 1500);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Add Family Member</h3>
        </div>
      </div>

      {saved ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 px-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
            className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <Check size={28} className="text-green-600" />
          </motion.div>
          <p className="font-bold text-slate-900 text-center">Family member added!</p>
          <p className="text-muted-foreground text-center text-sm">They'll receive an invite to join as a caregiver or be managed by you.</p>
        </div>
      ) : (
        <div className="px-5 py-5 flex flex-col gap-5">
          {/* Photo */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={32} className="text-primary" />
            </div>
            <button className="text-primary flex items-center gap-1.5" style={{ fontSize: '13px' }}>
              <Camera size={13} /> Add Photo
            </button>
          </div>

          <div>
            <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Full Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Lakshmi Sharma"
              className="w-full h-12 px-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '15px' }} />
          </div>

          <div>
            <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Relationship *</label>
            <div className="flex gap-2 flex-wrap">
              {relations.map(r => (
                <button key={r} onClick={() => setRelation(r)}
                  className={`px-3 py-2 rounded-xl transition-all ${relation === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
                  style={{ fontSize: '13px' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Date of Birth</label>
            <div className="flex items-center gap-2 h-12 px-4 bg-card border border-border rounded-xl">
              <Calendar size={14} className="text-muted-foreground" />
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="flex-1 bg-transparent text-foreground" style={{ fontSize: '15px' }} />
            </div>
          </div>

          <div>
            <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Blood Group</label>
            <div className="flex gap-2 flex-wrap">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                <button key={bg} onClick={() => setBlood(bg)}
                  className={`px-4 py-2 rounded-xl transition-all ${blood === bg ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
                  style={{ fontSize: '13px' }}>
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-foreground mb-1.5 block" style={{ fontSize: '13px' }}>Mobile Number (optional)</label>
            <div className="flex gap-2">
              <div className="h-12 px-3 bg-muted rounded-xl flex items-center gap-1.5">
                <span style={{ fontSize: '14px' }}>🇮🇳</span>
                <span style={{ fontSize: '13px' }}>+91</span>
              </div>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number"
                className="flex-1 h-12 px-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground" style={{ fontSize: '15px' }} />
            </div>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '11px' }}>An invite will be sent to link their profile</p>
          </div>

          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/15 flex gap-3">
            <Shield size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-primary" style={{ fontSize: '12px', lineHeight: '1.5' }}>
              As the primary account holder, you'll manage their health data under DPDP Act 2023 guidelines. Consent is logged.
            </p>
          </div>

          <button onClick={handleSave} disabled={!name || !relation}
            className="w-full h-12 bg-primary text-primary-foreground rounded-2xl font-medium disabled:opacity-40">
            Add {relation || 'Family Member'}
          </button>
        </div>
      )}
    </div>
  );
}