import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Plus, X, Check, Apple, Coffee, Utensils, Moon,
  ChevronRight, Droplets, Leaf, AlertCircle, Search, Camera, Clock
} from 'lucide-react';

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#F59E0B', time: '8:00 AM' },
  { key: 'lunch', label: 'Lunch', icon: Utensils, color: '#10B981', time: '1:00 PM' },
  { key: 'snack', label: 'Snack', icon: Apple, color: '#3B82F6', time: '4:30 PM' },
  { key: 'dinner', label: 'Dinner', icon: Moon, color: '#8B5CF6', time: '8:00 PM' },
];

interface FoodItem {
  id: number; name: string; calories: number; protein: number; carbs: number; fat: number;
  quantity: string; mealType: string; time: string; tag?: string;
}

const mockFoodLog: FoodItem[] = [
  { id: 1, name: 'Oats with milk', calories: 245, protein: 12, carbs: 38, fat: 5, quantity: '1 bowl', mealType: 'breakfast', time: '8:15 AM', tag: 'Home' },
  { id: 2, name: 'Banana', calories: 90, protein: 1, carbs: 23, fat: 0, quantity: '1 medium', mealType: 'breakfast', time: '8:30 AM' },
  { id: 3, name: 'Dal rice', calories: 380, protein: 15, carbs: 68, fat: 6, quantity: '1 plate', mealType: 'lunch', time: '1:10 PM', tag: 'Home' },
  { id: 4, name: 'Cucumber raita', calories: 65, protein: 3, carbs: 8, fat: 2, quantity: '1 bowl', mealType: 'lunch', time: '1:10 PM' },
  { id: 5, name: 'Green tea', calories: 5, protein: 0, carbs: 1, fat: 0, quantity: '1 cup', mealType: 'snack', time: '4:30 PM' },
];

const DIET_PLAN = [
  {
    meal: 'Breakfast',
    time: '8:00 AM',
    icon: Coffee,
    color: '#F59E0B',
    items: ['Oats with low-fat milk (1 bowl)', '1 medium banana', 'Boiled egg white (2 nos)'],
    note: 'Take Metformin after this meal',
    calories: 320,
  },
  {
    meal: 'Mid-morning Snack',
    time: '11:00 AM',
    icon: Apple,
    color: '#10B981',
    items: ['Handful of mixed nuts (10-12)', 'Coconut water / buttermilk'],
    calories: 160,
  },
  {
    meal: 'Lunch',
    time: '1:00 PM',
    icon: Utensils,
    color: '#3B82F6',
    items: ['2 multigrain rotis', 'Dal / sambar (1 bowl)', 'Sabzi (seasonal, no potato)', 'Salad (cucumber, carrot, tomato)'],
    note: 'Avoid rice or limit to 1 small bowl',
    calories: 450,
  },
  {
    meal: 'Evening Snack',
    time: '5:00 PM',
    icon: Coffee,
    color: '#F97316',
    items: ['Roasted chana (handful)', 'Green tea without sugar'],
    calories: 120,
  },
  {
    meal: 'Dinner',
    time: '7:30 PM',
    icon: Moon,
    color: '#8B5CF6',
    items: ['2 phulkas', 'Sabzi / paneer', 'Dahi (1 bowl)', 'Light khichdi option'],
    note: 'Finish dinner 2 hours before sleep',
    calories: 380,
  },
];

const INDIAN_FOODS: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number; category: string }> = [
  { name: 'Idli (2 nos)', calories: 134, protein: 4, carbs: 28, fat: 0.4, category: 'South Indian' },
  { name: 'Dosa (1 plain)', calories: 133, protein: 3, carbs: 25, fat: 2, category: 'South Indian' },
  { name: 'Upma (1 bowl)', calories: 220, protein: 5, carbs: 32, fat: 8, category: 'South Indian' },
  { name: 'Dal (1 bowl)', calories: 150, protein: 9, carbs: 23, fat: 3, category: 'Dals' },
  { name: 'Rajma (1 bowl)', calories: 200, protein: 12, carbs: 32, fat: 3, category: 'Dals' },
  { name: 'Roti (1 nos)', calories: 104, protein: 3, carbs: 20, fat: 1, category: 'Bread' },
  { name: 'Rice (1 cup cooked)', calories: 206, protein: 4, carbs: 45, fat: 0.4, category: 'Grains' },
  { name: 'Paneer (100g)', calories: 265, protein: 18, carbs: 4, fat: 20, category: 'Protein' },
  { name: 'Dahi (1 cup)', calories: 100, protein: 6, carbs: 7, fat: 4, category: 'Dairy' },
  { name: 'Sambar (1 bowl)', calories: 90, protein: 4, carbs: 14, fat: 2, category: 'South Indian' },
  { name: 'Aloo sabzi (1 bowl)', calories: 180, protein: 3, carbs: 28, fat: 7, category: 'Vegetables' },
  { name: 'Palak paneer (1 bowl)', calories: 250, protein: 14, carbs: 10, fat: 18, category: 'Vegetables' },
];

export function DietScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'plan' | 'log' | 'preferences'>('plan');
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [foodSearch, setFoodSearch] = useState('');
  const [dietType, setDietType] = useState<'vegetarian' | 'non-vegetarian' | 'jain'>('vegetarian');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>(['Low sugar', 'Low sodium']);

  const totalCals = mockFoodLog.reduce((a, b) => a + b.calories, 0);
  const totalProtein = mockFoodLog.reduce((a, b) => a + b.protein, 0);
  const totalCarbs = mockFoodLog.reduce((a, b) => a + b.carbs, 0);
  const totalFat = mockFoodLog.reduce((a, b) => a + b.fat, 0);
  const targetCals = 1800;

  const filteredFoods = INDIAN_FOODS.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase()));
  const groupedLog = MEAL_TYPES.map(mt => ({
    ...mt,
    items: mockFoodLog.filter(f => f.mealType === mt.key),
  })).filter(mt => mt.items.length > 0);

  const allergyOptions = ['Nuts', 'Dairy', 'Gluten', 'Eggs', 'Seafood', 'Soy', 'Sesame'];
  const prefOptions = ['Low sugar', 'Low sodium', 'Low fat', 'High protein', 'High fibre', 'No spicy', 'No fried'];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ChevronLeft size={22} />
          </button>
          <h1 className="font-bold text-slate-900" style={{ fontSize: '18px' }}>Nutrition & Diet</h1>
          <button onClick={() => setShowAddMeal(true)} className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-primary">
            <Plus size={22} />
          </button>
        </div>

        {/* Calorie Ring Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Calories Today</p>
              <p className="font-bold text-2xl text-slate-900">{totalCals} <span className="text-sm font-normal text-slate-400">/ {targetCals} kcal</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Remaining</p>
              <p className="font-bold text-lg" style={{ color: '#0A9B8F' }}>{targetCals - totalCals}</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
            <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${Math.min((totalCals / targetCals) * 100, 100)}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[{ label: 'Protein', val: totalProtein, unit: 'g', color: '#3B82F6' },
              { label: 'Carbs', val: totalCarbs, unit: 'g', color: '#F59E0B' },
              { label: 'Fat', val: totalFat, unit: 'g', color: '#EF4444' }].map(n => (
              <div key={n.label}>
                <p className="font-bold text-sm" style={{ color: n.color }}>{n.val}{n.unit}</p>
                <p className="text-[10px] text-slate-400">{n.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-100 flex-shrink-0">
        {([['plan', 'Diet Plan'], ['log', 'Food Log'], ['preferences', 'Preferences']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-3 text-xs font-semibold capitalize transition-all border-b-2 ${activeTab === t ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {activeTab === 'plan' && (
          <div className="pt-4 space-y-3">
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <p className="text-xs font-semibold text-green-700 mb-1">Your Diet Plan — Based on your health data</p>
              <p className="text-xs text-green-600">Tailored for Pre-diabetes + Hypertension management. Low GI, low sodium, high fibre.</p>
            </div>
            {DIET_PLAN.map((meal, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${meal.color}15` }}>
                    <meal.icon size={16} style={{ color: meal.color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{meal.meal}</h4>
                    <p className="text-xs text-slate-400">{meal.time} · ~{meal.calories} kcal</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded-lg">{meal.calories} kcal</span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {meal.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                {meal.note && (
                  <div className="mt-3 flex items-start gap-2 bg-amber-50 p-2.5 rounded-xl">
                    <AlertCircle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-amber-700">{meal.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'log' && (
          <div className="pt-4 space-y-4">
            <button onClick={() => setShowAddMeal(true)}
              className="w-full h-12 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary/20">
              <Plus size={18} /> Log a Meal
            </button>
            {groupedLog.map(mt => (
              <div key={mt.key}>
                <div className="flex items-center gap-2 mb-2">
                  <mt.icon size={14} style={{ color: mt.color }} />
                  <h4 className="font-semibold text-slate-700 text-sm">{mt.label}</h4>
                  <span className="text-xs text-slate-400">· {mt.time}</span>
                  <span className="ml-auto text-xs font-semibold text-slate-600">{mt.items.reduce((a, b) => a + b.calories, 0)} kcal</span>
                </div>
                {mt.items.map(food => (
                  <div key={food.id} className="bg-white rounded-xl p-3 border border-slate-100 mb-1.5 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{food.name}</p>
                      <p className="text-xs text-slate-400">{food.quantity} · {food.time}{food.tag ? ` · ${food.tag}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">{food.calories}</p>
                      <p className="text-[10px] text-slate-400">kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="pt-4 space-y-5">
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Dietary Type</h4>
              <div className="grid grid-cols-3 gap-2">
                {([['vegetarian', 'Vegetarian', '🥗'], ['non-vegetarian', 'Non-Veg', '🍗'], ['jain', 'Jain', '🌱']] as const).map(([key, label, emoji]) => (
                  <button key={key} onClick={() => setDietType(key)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${dietType === key ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'}`}>
                    <span className="text-2xl">{emoji}</span>
                    <span className={`text-xs font-semibold ${dietType === key ? 'text-primary' : 'text-slate-600'}`}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Food Allergies</h4>
              <div className="flex flex-wrap gap-2">
                {allergyOptions.map(a => (
                  <button key={a} onClick={() => setAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${allergies.includes(a) ? 'bg-red-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {prefOptions.map(p => (
                  <button key={p} onClick={() => setPreferences(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${preferences.includes(p) ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1.5">Daily Water Goal</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2">
                  <Droplets size={16} className="text-blue-500" />
                  <input defaultValue="2.5" className="flex-1 text-sm font-bold text-slate-900 bg-transparent" />
                  <span className="text-xs text-slate-400">litres/day</span>
                </div>
              </div>
            </div>
            <button className="w-full h-12 bg-primary text-white rounded-2xl font-semibold">Save Preferences</button>
          </div>
        )}
      </div>

      {/* Add Meal Sheet */}
      <AnimatePresence>
        {showAddMeal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/40 flex items-end">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl max-h-[90%] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
                <h3 className="font-bold text-slate-900">Log a Meal</h3>
                <button onClick={() => setShowAddMeal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-2 block">Meal Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {MEAL_TYPES.map(mt => (
                      <button key={mt.key} onClick={() => setSelectedMealType(mt.key)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${selectedMealType === mt.key ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                        <mt.icon size={16} style={{ color: mt.color }} />
                        <span className={`text-[10px] font-semibold ${selectedMealType === mt.key ? 'text-primary' : 'text-slate-500'}`}>{mt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 px-3">
                    <Search size={14} className="text-slate-400" />
                    <input value={foodSearch} onChange={e => setFoodSearch(e.target.value)} placeholder="Search Indian foods..." className="flex-1 bg-transparent text-sm text-slate-900" />
                  </div>
                  <button className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {(foodSearch ? filteredFoods : INDIAN_FOODS).map((food, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-left active:scale-[0.99] transition-transform">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{food.name}</p>
                        <p className="text-xs text-slate-400">{food.category} · P:{food.protein}g C:{food.carbs}g F:{food.fat}g</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-primary">{food.calories}</p>
                        <p className="text-[10px] text-slate-400">kcal</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAddMeal(false)} className="w-full h-12 bg-primary text-white rounded-2xl font-semibold">Add to Log</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
