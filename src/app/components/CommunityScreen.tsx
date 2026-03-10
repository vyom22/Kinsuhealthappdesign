import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Plus, X, Heart, MessageCircle, Search, Filter,
  ChevronRight, Check, Shield, Stethoscope, Users, Award, BookOpen, ThumbsUp
} from 'lucide-react';

type UserRole = 'patient' | 'caregiver' | 'doctor';

interface Post {
  id: number; role: UserRole; name: string; avatar: string; tag: string;
  condition?: string; title: string; content: string; likes: number; replies: number;
  time: string; verified?: boolean; liked?: boolean;
}

const CONDITION_TAGS = ['All', 'Diabetes', 'Hypertension', 'Thyroid', 'Liver', 'Depression', 'Migraine', 'Heart', 'PCOD', 'Arthritis', 'Cancer', 'General'];

const POSTS: Post[] = [
  {
    id: 1, role: 'patient', name: 'Meena R.', avatar: 'MR', tag: 'Diabetes', condition: 'Type 2 Diabetes',
    title: 'HbA1c went from 9.2 to 6.8 in 6 months! 🎉',
    content: 'Wanted to share my journey! Changed to multigrain roti, daily 30-min walk, and strict meds. The streak feature really helped me stay accountable.',
    likes: 142, replies: 38, time: '2 hours ago', liked: true,
  },
  {
    id: 2, role: 'doctor', name: 'Dr. Sanjay Gupta', avatar: 'SG', tag: 'General',
    title: 'Important: Don\'t stop BP medication without consulting',
    content: 'Seeing many patients stop Amlodipine due to leg swelling. Please don\'t! Discuss alternatives with your doctor. Sudden discontinuation can cause rebound hypertension.',
    likes: 284, replies: 62, time: '5 hours ago', verified: true,
  },
  {
    id: 3, role: 'caregiver', name: 'Ravi S.', avatar: 'RS', tag: 'General',
    title: 'Tips for caring for an elderly parent with diabetes',
    content: 'My mother (68) was resistant to regular sugar checks. Small wins: I made it a morning ritual with chai. She now reminds me! Routine is everything.',
    likes: 97, replies: 24, time: '1 day ago',
  },
  {
    id: 4, role: 'patient', name: 'Preethi K.', avatar: 'PK', tag: 'PCOD',
    title: 'PCOD and weight loss - what actually worked for me',
    content: 'After 2 years of trying, intermittent fasting (16:8) + metformin + yoga combination worked. Lost 8 kg in 4 months. Consult your gynecologist before starting IF.',
    likes: 213, replies: 87, time: '2 days ago',
  },
  {
    id: 5, role: 'doctor', name: 'Dr. Nandini Rao', avatar: 'NR', tag: 'Migraine', condition: 'Migraine',
    title: 'Weather changes and migraines — what the research says',
    content: 'Barometric pressure changes are a real migraine trigger. App tip: log your migraines with weather data. Patterns emerge after 4-6 weeks. Data helps us prescribe better.',
    likes: 176, replies: 41, time: '3 days ago', verified: true,
  },
];

function RoleBadge({ role, verified }: { role: UserRole; verified?: boolean }) {
  const styles: Record<UserRole, { bg: string; text: string; label: string; icon: React.ElementType }> = {
    patient: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Patient', icon: Heart },
    caregiver: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Caregiver', icon: Users },
    doctor: { bg: 'bg-green-50', text: 'text-green-700', label: 'Doctor', icon: Stethoscope },
  };
  const s = styles[role];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      <s.icon size={9} />
      {s.label}
      {verified && <Shield size={8} className="text-green-500" />}
    </span>
  );
}

export function CommunityScreen() {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState('All');
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('General');
  const [myRole] = useState<UserRole>('patient');

  const filteredPosts = posts.filter(p => {
    const matchesTag = activeTag === 'All' || p.tag === activeTag;
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const submitPost = () => {
    if (!newPostTitle || !newPostContent) return;
    const newPost: Post = {
      id: Date.now(), role: myRole, name: 'Priya S.', avatar: 'PS',
      tag: newPostTag, title: newPostTitle, content: newPostContent,
      likes: 0, replies: 0, time: 'Just now',
    };
    setPosts(prev => [newPost, ...prev]);
    setShowNewPost(false);
    setNewPostTitle(''); setNewPostContent('');
  };

  const roleColors: Record<UserRole, string> = {
    patient: '#3B82F6', caregiver: '#8B5CF6', doctor: '#10B981',
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ChevronLeft size={22} />
          </button>
          <h1 className="font-bold text-slate-900" style={{ fontSize: '18px' }}>Community</h1>
          <button onClick={() => setShowNewPost(true)} className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-primary">
            <Plus size={22} />
          </button>
        </div>

        {/* Search */}
        <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 px-3 mb-3">
          <Search size={14} className="text-slate-400" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search discussions..." className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400" />
        </div>

        {/* Condition Tags */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {CONDITION_TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all ${activeTag === tag ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Role banner */}
      <div className="px-5 pt-3 pb-1 flex gap-2 overflow-x-auto flex-shrink-0">
        {[
          { role: 'patient' as UserRole, count: posts.filter(p => p.role === 'patient').length },
          { role: 'caregiver' as UserRole, count: posts.filter(p => p.role === 'caregiver').length },
          { role: 'doctor' as UserRole, count: posts.filter(p => p.role === 'doctor').length },
        ].map(({ role, count }) => {
          const labels: Record<UserRole, string> = { patient: 'Patients', caregiver: 'Caregivers', doctor: 'Doctors' };
          return (
            <div key={role} className="flex-shrink-0 bg-white border border-slate-100 rounded-xl px-3 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: roleColors[role] }} />
              <span className="text-xs font-semibold text-slate-600">{count} {labels[role]}</span>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        <div className="pt-3 space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="py-12 flex flex-col items-center text-center">
              <MessageCircle size={40} className="text-slate-200 mb-3" />
              <p className="font-semibold text-slate-400">No posts found</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                {/* Author */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: roleColors[post.role] }}>
                      {post.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 text-sm">{post.name}</span>
                        {post.verified && <Shield size={10} className="text-green-500" />}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <RoleBadge role={post.role} verified={post.verified} />
                        <span className="text-[10px] text-slate-300">·</span>
                        <span className="text-[10px] text-slate-400">{post.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">{post.tag}</span>
                </div>

                {/* Content */}
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">{post.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50">
                  <button onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-all ${post.liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}>
                    <Heart size={14} className={post.liked ? 'fill-current' : ''} />
                    <span className="text-xs font-semibold">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-400">
                    <MessageCircle size={14} />
                    <span className="text-xs font-semibold">{post.replies}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-400 ml-auto">
                    <ThumbsUp size={13} />
                    <span className="text-xs">Helpful</span>
                  </button>
                </div>

                {post.role === 'doctor' && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg">
                    <Shield size={9} />
                    Verified medical professional — Not a substitute for personal consultation
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Post Sheet */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/40 flex items-end">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl max-h-[90%] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
                <h3 className="font-bold text-slate-900">Share with Community</h3>
                <button onClick={() => setShowNewPost(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-2 block">Topic / Condition</label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {CONDITION_TAGS.filter(t => t !== 'All').map(tag => (
                      <button key={tag} onClick={() => setNewPostTag(tag)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${newPostTag === tag ? 'bg-primary text-white' : 'bg-slate-50 border border-slate-200 text-slate-500'}`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Title</label>
                  <input value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} placeholder="What would you like to share?"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Your Story / Advice</label>
                  <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder="Share your experience, tips, or questions..."
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm resize-none" />
                </div>
                <div className="bg-amber-50 rounded-xl p-3 flex gap-2">
                  <BookOpen size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">Please don't share personal health data like test reports. Community posts are public. Consult a doctor for medical decisions.</p>
                </div>
                <button onClick={submitPost} disabled={!newPostTitle || !newPostContent}
                  className="w-full h-12 bg-primary text-white rounded-2xl font-semibold disabled:opacity-40">
                  Post to Community
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
