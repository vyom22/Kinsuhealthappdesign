import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Filter, Plus, FileText, TestTube, Stethoscope, ImageIcon, ChevronRight,
  X, Upload, Camera, FolderOpen, Check, AlertCircle, SlidersHorizontal, Calendar,
  Hospital, User, Tag, Download, Share2, Eye, Loader2, TrendingUp, Brain, Building2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

const records = [
  { id: 1, type: 'Lab Report', title: 'Complete Blood Count (CBC)', hospital: 'Apollo Hospital, Chennai', doctor: 'Dr. Anand Mehta', date: '12 Feb 2026', tags: ['Blood', 'Routine'], icon: TestTube, color: '#0A9B8F', patient: 'Self' },
  { id: 2, type: 'Prescription', title: 'Cardiology Follow-up', hospital: 'Dr. Kapoor Clinic', doctor: 'Dr. Rahul Kapoor', date: '8 Feb 2026', tags: ['Heart', 'Medication'], icon: Stethoscope, color: '#3B82F6', patient: 'Self' },
  { id: 3, type: 'Imaging', title: 'Chest X-Ray (PA View)', hospital: 'Max Diagnostics', doctor: 'Dr. Priya Nair', date: '5 Feb 2026', tags: ['Chest', 'Radiology'], icon: ImageIcon, color: '#8B5CF6', patient: 'Self' },
  { id: 4, type: 'Discharge Summary', title: 'Post Appendectomy Discharge', hospital: 'Fortis Hospital', doctor: 'Dr. S. Kumar', date: '20 Jan 2026', tags: ['Surgery', 'Emergency'], icon: FileText, color: '#F59E0B', patient: 'Self' },
  { id: 5, type: 'Lab Report', title: 'Thyroid Profile (T3/T4/TSH)', hospital: 'SRL Diagnostics', doctor: 'Dr. Anand Mehta', date: '15 Jan 2026', tags: ['Thyroid', 'Routine'], icon: TestTube, color: '#0A9B8F', patient: 'Amma' },
  { id: 6, type: 'Prescription', title: 'Diabetes Management', hospital: 'Medanta Hospital', doctor: 'Dr. S. Reddy', date: '10 Jan 2026', tags: ['Diabetes', 'Chronic'], icon: Stethoscope, color: '#3B82F6', patient: 'Self' },
  { id: 7, type: 'Handwritten Note', title: 'Dr. Sharma Consultation Notes', hospital: 'Local Clinic', doctor: 'Dr. V. Sharma', date: '5 Jan 2026', tags: ['General', 'Notes'], icon: FileText, color: '#6B7280', patient: 'Self' },
];

const filterOptions = {
  docType: ['Lab Report', 'Prescription', 'Imaging', 'Discharge Summary', 'Handwritten Note'],
  patient: ['Self (Priya)', 'Amma (Lakshmi)', 'Papa (Rajesh)', 'Ravi (Brother)'],
  hospital: ['Apollo Hospital', 'Max Diagnostics', 'Fortis Hospital', 'SRL Diagnostics', 'Medanta Hospital'],
  timeframe: ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year', 'All time'],
  labParams: ['AFP', 'RBC', 'WBC', 'HbA1c', 'TSH', 'Hemoglobin', 'Creatinine', 'Cholesterol'],
};

const labTrendData = [
  { month: 'Sep', value: 13.2 }, { month: 'Oct', value: 12.8 }, { month: 'Nov', value: 13.5 },
  { month: 'Dec', value: 12.1 }, { month: 'Jan', value: 13.8 }, { month: 'Feb', value: 14.1 },
];

const rbcData = [
  { month: 'Sep', value: 4.5 }, { month: 'Oct', value: 4.3 }, { month: 'Nov', value: 4.6 },
  { month: 'Dec', value: 4.2 }, { month: 'Jan', value: 4.7 }, { month: 'Feb', value: 4.8 },
];

type VaultView = 'list' | 'detail' | 'upload' | 'labTrends' | 'imaging' | 'prescription' | 'interop';

export default function VaultScreen() {
  const [view, setView] = useState<VaultView>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(records[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadStep, setUploadStep] = useState(0);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedParam, setSelectedParam] = useState('Hemoglobin');

  const filteredRecords = records.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (view === 'detail') return (
    <RecordDetail record={selectedRecord} onBack={() => setView('list')} onViewImaging={() => setView('imaging')} onViewLabTrends={() => setView('labTrends')} />
  );
  if (view === 'upload') return <UploadFlow step={uploadStep} setStep={setUploadStep} onComplete={() => { setView('list'); setUploadStep(0); }} />;
  if (view === 'labTrends') return <LabTrendsScreen param={selectedParam} setParam={setSelectedParam} onBack={() => setView('list')} />;
  if (view === 'imaging') return <ImagingViewer onBack={() => setView('detail')} />;
  if (view === 'prescription') return <PrescriptionDetail onBack={() => setView('list')} />;
  if (view === 'interop') return <InteropScreen onBack={() => setView('list')} />;

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Health Vault</h2>
          <div className="flex gap-2">
            <button onClick={() => setView('interop')} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <Building2 size={16} className="text-muted-foreground" />
            </button>
            <button onClick={() => setView('upload')} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Plus size={16} className="text-primary-foreground" />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-muted rounded-xl flex items-center gap-2 px-3">
            <Search size={15} className="text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search records..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground"
              style={{ fontSize: '14px' }}
            />
          </div>
          <button onClick={() => setShowFilters(true)} className={`h-10 px-3 rounded-xl flex items-center gap-1.5 ${activeFilters.length > 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <SlidersHorizontal size={15} />
            {activeFilters.length > 0 && <span style={{ fontSize: '12px', fontWeight: 600 }}>{activeFilters.length}</span>}
          </button>
        </div>
        {/* Quick filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {['All', 'Lab Reports', 'Prescriptions', 'Imaging', 'Summaries'].map((f, i) => (
            <button key={f} className={`px-3 py-1.5 rounded-full whitespace-nowrap ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`} style={{ fontSize: '12px', fontWeight: 500 }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-5 py-3 flex gap-2">
        <button onClick={() => setView('labTrends')} className="flex-1 h-10 bg-card border border-border rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <TrendingUp size={14} className="text-primary" />
          <span style={{ fontSize: '12px', fontWeight: 500 }}>Lab Trends</span>
        </button>
        <button onClick={() => setView('prescription')} className="flex-1 h-10 bg-card border border-border rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <Stethoscope size={14} className="text-blue-500" />
          <span style={{ fontSize: '12px', fontWeight: 500 }}>Prescriptions</span>
        </button>
      </div>

      {/* Records List */}
      <div className="px-5 pb-6">
        <p className="text-muted-foreground mb-2" style={{ fontSize: '12px' }}>{filteredRecords.length} records</p>
        <div className="flex flex-col gap-2">
          {filteredRecords.map(r => (
            <button key={r.id} onClick={() => { setSelectedRecord(r); setView('detail'); }} className="bg-card rounded-2xl p-3.5 border border-border flex items-start gap-3 w-full text-left active:scale-[0.99] transition-transform">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${r.color}12` }}>
                <r.icon size={18} style={{ color: r.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-foreground truncate" style={{ fontSize: '14px', fontWeight: 500 }}>{r.title}</p>
                    <p className="text-muted-foreground mt-0.5" style={{ fontSize: '12px' }}>{r.hospital}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-muted-foreground" style={{ fontSize: '11px' }}>{r.date}</span>
                  {r.patient !== 'Self' && (
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded" style={{ fontSize: '10px', fontWeight: 500 }}>{r.patient}</span>
                  )}
                  {r.tags.map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded" style={{ fontSize: '10px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bottom Sheet */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowFilters(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-[28px] max-h-[85%] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card px-5 pt-5 pb-3 flex items-center justify-between">
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Advanced Filters</h3>
                <button onClick={() => setShowFilters(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="px-5 pb-8 flex flex-col gap-5">
                {Object.entries(filterOptions).map(([key, opts]) => (
                  <div key={key}>
                    <p className="text-foreground mb-2 capitalize" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {key === 'docType' ? 'Document Type' : key === 'labParams' ? 'Lab Parameters' : key.charAt(0).toUpperCase() + key.slice(1)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opts.map(o => {
                        const isActive = activeFilters.includes(o);
                        return (
                          <button
                            key={o}
                            onClick={() => setActiveFilters(prev => isActive ? prev.filter(f => f !== o) : [...prev, o])}
                            className={`px-3 py-1.5 rounded-full border transition-all ${isActive ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}
                            style={{ fontSize: '12px' }}
                          >
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setActiveFilters([])} className="flex-1 h-[48px] border border-border rounded-2xl text-foreground" style={{ fontSize: '14px' }}>Clear All</button>
                  <button onClick={() => setShowFilters(false)} className="flex-1 h-[48px] bg-primary text-primary-foreground rounded-2xl" style={{ fontSize: '14px' }}>Apply Filters</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecordDetail({ record, onBack, onViewImaging, onViewLabTrends }: any) {
  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="flex-1">Record Detail</h3>
          <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><Share2 size={16} className="text-muted-foreground" /></button>
          <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><Download size={16} className="text-muted-foreground" /></button>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${record.color}12` }}>
              <record.icon size={22} style={{ color: record.color }} />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: '11px' }}>{record.type}</span>
              <h3 className="mt-1" style={{ fontSize: '16px', fontWeight: 600 }}>{record.title}</h3>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-card rounded-2xl p-4 border border-border flex flex-col gap-3">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Details</h4>
          {[
            { label: 'Hospital', value: record.hospital, icon: Hospital },
            { label: 'Doctor', value: record.doctor, icon: User },
            { label: 'Date', value: record.date, icon: Calendar },
            { label: 'Patient', value: record.patient, icon: User },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-3">
              <d.icon size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground" style={{ fontSize: '13px' }}>{d.label}:</span>
              <span className="text-foreground" style={{ fontSize: '13px', fontWeight: 500 }}>{d.value}</span>
            </div>
          ))}
          <div className="flex gap-2 mt-1">
            {record.tags.map((t: string) => (
              <span key={t} className="px-2 py-1 bg-muted rounded-lg flex items-center gap-1" style={{ fontSize: '11px' }}>
                <Tag size={10} className="text-muted-foreground" />{t}
              </span>
            ))}
          </div>
        </div>

        {/* Extracted Text */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-2">Extracted Content (OCR)</h4>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-foreground" style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <strong>Hemoglobin:</strong> 14.1 g/dL (Normal: 12.0-15.5)<br />
              <strong>RBC Count:</strong> 4.8 million/µL (Normal: 4.0-5.5)<br />
              <strong>WBC Count:</strong> 7,200 /µL (Normal: 4,500-11,000)<br />
              <strong>Platelets:</strong> 2,45,000 /µL (Normal: 1,50,000-4,00,000)<br />
              <strong>MCV:</strong> 88 fL (Normal: 80-100)
            </p>
          </div>
        </div>

        {/* Linked Entities */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-3">Linked Entities</h4>
          <div className="flex flex-col gap-2">
            <button onClick={onViewLabTrends} className="flex items-center gap-3 p-2.5 bg-muted rounded-xl">
              <TrendingUp size={16} className="text-primary" />
              <span style={{ fontSize: '13px' }}>View Hemoglobin Trend Chart</span>
              <ChevronRight size={14} className="text-muted-foreground ml-auto" />
            </button>
            {record.type === 'Imaging' && (
              <button onClick={onViewImaging} className="flex items-center gap-3 p-2.5 bg-muted rounded-xl">
                <Eye size={16} className="text-purple-500" />
                <span style={{ fontSize: '13px' }}>View Full Image</span>
                <ChevronRight size={14} className="text-muted-foreground ml-auto" />
              </button>
            )}
            <button className="flex items-center gap-3 p-2.5 bg-muted rounded-xl">
              <Brain size={16} className="text-blue-500" />
              <span style={{ fontSize: '13px' }}>Related Episode: Routine Checkup</span>
              <ChevronRight size={14} className="text-muted-foreground ml-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadFlow({ step, setStep, onComplete }: { step: number; setStep: (s: number) => void; onComplete: () => void }) {
  const [selectedType, setSelectedType] = useState('');
  const [progress, setProgress] = useState(0);

  const docTypes = [
    { label: 'Lab Report', icon: TestTube, color: '#0A9B8F' },
    { label: 'Prescription', icon: Stethoscope, color: '#3B82F6' },
    { label: 'Imaging (X-Ray/CT)', icon: ImageIcon, color: '#8B5CF6' },
    { label: 'Discharge Summary', icon: FileText, color: '#F59E0B' },
    { label: 'Handwritten Notes', icon: FileText, color: '#6B7280' },
  ];

  const startProcessing = () => {
    setStep(2);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(() => setStep(3), 500); }
      setProgress(Math.min(p, 100));
    }, 400);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onComplete} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Upload Record</h3>
        </div>
        <div className="flex gap-2 mt-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
      </div>

      <div className="px-5 py-6">
        {step === 0 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }} className="mb-4">Select Document Type</h3>
            <div className="flex flex-col gap-2">
              {docTypes.map(d => (
                <button
                  key={d.label}
                  onClick={() => { setSelectedType(d.label); setStep(1); }}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${selectedType === d.label ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${d.color}12` }}>
                    <d.icon size={18} style={{ color: d.color }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{d.label}</span>
                  <ChevronRight size={16} className="text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col items-center">
            <h3 style={{ fontSize: '16px', fontWeight: 600 }} className="mb-6 self-start">Upload Document</h3>
            <div className="w-full border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-4 bg-card">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload size={28} className="text-primary" />
              </div>
              <p className="text-foreground" style={{ fontSize: '15px', fontWeight: 500 }}>Tap to upload or take a photo</p>
              <p className="text-muted-foreground text-center" style={{ fontSize: '13px' }}>Supports PDF, JPG, PNG, DICOM</p>
            </div>
            <div className="flex gap-3 w-full mt-6">
              <button onClick={startProcessing} className="flex-1 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2">
                <FolderOpen size={16} /> Choose File
              </button>
              <button onClick={startProcessing} className="flex-1 h-12 border border-border rounded-2xl flex items-center justify-center gap-2 text-foreground">
                <Camera size={16} /> Camera
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center pt-16">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <Loader2 size={48} className="text-primary" />
            </motion.div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mt-6">Processing Document</h3>
            <p className="text-muted-foreground mt-2 text-center" style={{ fontSize: '14px' }}>Extracting text and identifying parameters...</p>
            <div className="w-full bg-muted rounded-full h-2 mt-8">
              <motion.div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-muted-foreground mt-2" style={{ fontSize: '12px' }}>{Math.round(progress)}% complete</p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center pt-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center"
            >
              <Check size={36} className="text-green-600" />
            </motion.div>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="mt-6">Upload Successful!</h3>
            <p className="text-muted-foreground mt-2 text-center" style={{ fontSize: '14px' }}>Lab Report has been added to your vault. 8 parameters extracted.</p>
            <div className="w-full mt-8 bg-card rounded-2xl p-4 border border-border">
              <h4 style={{ fontSize: '13px', fontWeight: 600 }} className="mb-2">Extracted Parameters</h4>
              <div className="flex flex-wrap gap-1.5">
                {['Hemoglobin: 14.1', 'RBC: 4.8M', 'WBC: 7.2K', 'Platelets: 245K', 'MCV: 88', 'MCH: 28', 'MCHC: 33', 'ESR: 12'].map(p => (
                  <span key={p} className="px-2 py-1 bg-primary/10 text-primary rounded-lg" style={{ fontSize: '11px', fontWeight: 500 }}>{p}</span>
                ))}
              </div>
            </div>
            <button onClick={onComplete} className="w-full h-12 bg-primary text-primary-foreground rounded-2xl mt-6">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function LabTrendsScreen({ param, setParam, onBack }: { param: string; setParam: (p: string) => void; onBack: () => void }) {
  const params = ['Hemoglobin', 'RBC', 'WBC', 'HbA1c', 'TSH', 'Cholesterol'];
  const data = param === 'RBC' ? rbcData : labTrendData;
  const unit = param === 'Hemoglobin' ? 'g/dL' : param === 'RBC' ? 'M/µL' : '';

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Lab Parameter Trends</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {params.map(p => (
            <button key={p} onClick={() => setParam(p)} className={`px-3 py-1.5 rounded-full whitespace-nowrap ${param === p ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`} style={{ fontSize: '12px', fontWeight: 500 }}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 py-5">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{param}</h4>
              <p className="text-muted-foreground" style={{ fontSize: '12px' }}>6-month trend</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize: '24px', fontWeight: 700 }} className="text-foreground">{data[data.length - 1].value}</p>
              <p className="text-green-600" style={{ fontSize: '12px', fontWeight: 500 }}>↑ Normal range</p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A9B8F" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0A9B8F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0A9B8F" strokeWidth={2.5} fill="url(#colorVal)" dot={{ fill: '#0A9B8F', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-4 bg-card rounded-2xl p-4 border border-border">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-3">History</h4>
          {data.slice().reverse().map((d, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <span className="text-muted-foreground" style={{ fontSize: '13px' }}>{d.month} 2025</span>
              <span className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>{d.value} {unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImagingViewer({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-[#1a1a2e] flex flex-col">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"><X size={16} className="text-white" /></button>
        <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-white">Chest X-Ray (PA View)</h3>
      </div>
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="w-full aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-4">
          <ImageIcon size={48} className="text-white/30" />
          <p className="text-white/50" style={{ fontSize: '14px' }}>DICOM Viewer Placeholder</p>
          <p className="text-white/30 text-center px-8" style={{ fontSize: '12px' }}>Medical imaging viewer with zoom, pan, contrast adjustment, and DICOM metadata</p>
        </div>
      </div>
      <div className="px-5 pb-8 flex gap-3">
        <button className="flex-1 h-10 bg-white/10 rounded-xl text-white flex items-center justify-center gap-2" style={{ fontSize: '13px' }}>
          <Eye size={14} /> Full Screen
        </button>
        <button className="flex-1 h-10 bg-white/10 rounded-xl text-white flex items-center justify-center gap-2" style={{ fontSize: '13px' }}>
          <Download size={14} /> Download
        </button>
      </div>
    </div>
  );
}

function PrescriptionDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Prescription Detail</h3>
        </div>
      </div>
      <div className="px-5 py-4 flex flex-col gap-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Stethoscope size={18} className="text-blue-600" /></div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>Cardiology Follow-up</p>
              <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Dr. Rahul Kapoor · 8 Feb 2026</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-3">Prescribed Medications</h4>
          {[
            { name: 'Amlodipine 5mg', dose: '1 tablet, morning', duration: '30 days' },
            { name: 'Atorvastatin 10mg', dose: '1 tablet, night', duration: '30 days' },
            { name: 'Ecosprin 75mg', dose: '1 tablet, after lunch', duration: '30 days' },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><span style={{ fontSize: '14px' }}>💊</span></div>
              <div className="flex-1">
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{m.name}</p>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{m.dose} · {m.duration}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h4 style={{ fontSize: '14px', fontWeight: 600 }} className="mb-2">Doctor's Notes</h4>
          <p className="text-muted-foreground" style={{ fontSize: '13px', lineHeight: '1.6' }}>
            BP slightly elevated at 138/88. Continue current medication. Follow up in 4 weeks. Reduce salt intake. Regular walking 30 min/day recommended.
          </p>
        </div>
      </div>
    </div>
  );
}

function InteropScreen({ onBack }: { onBack: () => void }) {
  const connections = [
    { name: 'Apollo Hospitals', type: 'Hospital', status: 'connected', lastSync: '2 hours ago', records: 12 },
    { name: 'SRL Diagnostics', type: 'Lab', status: 'connected', lastSync: '1 day ago', records: 8 },
    { name: 'Max Diagnostics', type: 'Radiology', status: 'connected', lastSync: '3 days ago', records: 3 },
    { name: 'Fortis Hospital', type: 'Hospital', status: 'pending', lastSync: 'Never', records: 0 },
    { name: 'Thyrocare', type: 'Lab', status: 'disconnected', lastSync: 'Never', records: 0 },
  ];

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Connected Services</h3>
        </div>
        <p className="text-muted-foreground ml-12" style={{ fontSize: '13px' }}>Hospitals, labs & radiology centers linked via ABDM</p>
      </div>
      <div className="px-5 py-4 flex flex-col gap-2">
        {connections.map((c, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.status === 'connected' ? 'bg-green-50' : c.status === 'pending' ? 'bg-amber-50' : 'bg-muted'}`}>
              <Building2 size={18} className={c.status === 'connected' ? 'text-green-600' : c.status === 'pending' ? 'text-amber-600' : 'text-muted-foreground'} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: '14px', fontWeight: 500 }}>{c.name}</p>
              <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{c.type} · {c.records} records · Synced {c.lastSync}</p>
            </div>
            <span className={`px-2 py-1 rounded-full ${c.status === 'connected' ? 'bg-green-50 text-green-600' : c.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-muted text-muted-foreground'}`} style={{ fontSize: '11px', fontWeight: 500 }}>
              {c.status === 'connected' ? '● Active' : c.status === 'pending' ? '◐ Pending' : '○ Link'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
