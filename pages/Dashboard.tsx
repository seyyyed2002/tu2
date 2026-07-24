import React, { useEffect, useMemo, useState } from 'react';
import { DEEDS, DEED_CATALOG, getTodayStr, toPersianDigits, WORKOUTS, toEnglishDigits } from '../constants';
import { DailyRecord, DeedDefinition, DeedType, WorkoutDefinition } from '../types';
import { 
  saveRecord, 
  getRecord, 
  loadSettings, 
  saveCustomDeed, 
  removeCustomDeed, 
  saveDeletedDeedIds,
  loadQada, 
  saveQada,
  saveActiveDeeds,
  loadWorkoutSettings,
  loadWorkoutPRs,
  saveWorkoutPRs,
  saveCustomWorkout,
  removeCustomWorkout,
  saveDeletedWorkoutIds
} from '../services/storage';
import { DeedInput } from '../components/DeedInput';
import { CustomSelect } from '../components/CustomSelect';
import { SinInput } from '../components/SinInput';
import { 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Star, 
  Plus, 
  Minus,
  X, 
  AlertCircle,
  Settings,
  Search,
  Trash2,
  Sliders,
  Check,
  RefreshCw,
  Sparkles,
  Compass,
  Award,
  Shield,
  BookOpen,
  Eye,
  Settings2,
  ArrowLeft,
  ChevronDown,
  Activity,
  Heart,
  GraduationCap,
  Briefcase,
  Dumbbell,
  Trophy,
  Coins
} from 'lucide-react';

interface DashboardProps {
  initialDate?: string;
  onDateChange?: (date: string) => void;
  activeTab?: string;
}

// Icons map for categories
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'نمازهای واجب': <Compass className="w-4 h-4 text-emerald-500" />,
  'نمازهای مستحب': <Sparkles className="w-4 h-4 text-teal-500" />,
  'ادعیه و زیارات': <BookOpen className="w-4 h-4 text-indigo-500" />,
  'سوره‌های قرآن': <BookOpen className="w-4 h-4 text-blue-500" />,
  'مراقبت‌های اخلاقی': <Shield className="w-4 h-4 text-amber-500" />,
  'اعمال طلایی': <Award className="w-4 h-4 text-yellow-500 font-bold" />,
  'سبک زندگی': <Activity className="w-4 h-4 text-rose-500" />,
  'درسی و آموزشی': <GraduationCap className="w-4 h-4 text-violet-500" />,
  'کاری و مهارتی': <Briefcase className="w-4 h-4 text-cyan-500" />,
  'ورزش و سلامت': <Dumbbell className="w-4 h-4 text-emerald-500" />,
  'مالی و اقتصادی': <Coins className="w-4 h-4 text-orange-500" />,
  'سایر اعمال': <Settings2 className="w-4 h-4 text-gray-500" />
};

const TYPE_OPTIONS = [
  { value: 'binary', label: 'بله/خیر (باینری)' },
  { value: 'scalar', label: '۰ تا ۱۰۰ (کیفی)' },
  { value: 'golden', label: 'عمل طلایی (پاداش)' }
];

const CATEGORY_OPTIONS = [
  { value: 'نمازهای مستحب', label: 'نمازهای مستحب', icon: CATEGORY_ICONS['نمازهای مستحب'] },
  { value: 'ادعیه و زیارات', label: 'ادعیه و زیارات', icon: CATEGORY_ICONS['ادعیه و زیارات'] },
  { value: 'سوره‌های قرآن', label: 'سوره‌های قرآن', icon: CATEGORY_ICONS['سوره‌های قرآن'] },
  { value: 'مراقبت‌های اخلاقی', label: 'مراقبت‌های اخلاقی', icon: CATEGORY_ICONS['مراقبت‌های اخلاقی'] },
  { value: 'اعمال طلایی', label: 'اعمال طلایی', icon: CATEGORY_ICONS['اعمال طلایی'] },
  { value: 'سبک زندگی', label: 'سبک زندگی', icon: CATEGORY_ICONS['سبک زندگی'] },
  { value: 'درسی و آموزشی', label: 'درسی و آموزشی', icon: CATEGORY_ICONS['درسی و آموزشی'] },
  { value: 'کاری و مهارتی', label: 'کاری و مهارتی', icon: CATEGORY_ICONS['کاری و مهارتی'] },
  { value: 'ورزش و سلامت', label: 'ورزش و سلامت', icon: CATEGORY_ICONS['ورزش و سلامت'] },
  { value: 'مالی و اقتصادی', label: 'مالی و اقتصادی', icon: CATEGORY_ICONS['مالی و اقتصادی'] },
];

const WeightSlider = ({
  value,
  onChange,
  max = 10,
  min = 1,
  label = 'ضریب اهمیت'
}: {
  value: number;
  onChange: (val: number) => void;
  max?: number;
  min?: number;
  label?: string;
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 font-extrabold">
        <span>{label}</span>
        <span className="text-primary-600 dark:text-primary-400 font-black text-xs bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-md border border-primary-100/50 dark:border-primary-900/50">
          {toPersianDigits(value)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition-all cursor-pointer shrink-0"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
        </div>

        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-1 pt-0.5">
        {(max > 10 ? [5, 10, 25, 50] : [1, 3, 5, 10]).map((preset) => (
          <button
            type="button"
            key={preset}
            onClick={() => onChange(preset)}
            className={`flex-1 py-0.5 text-[9px] font-extrabold rounded-md transition-all cursor-pointer text-center ${
              value === preset
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-gray-100/80 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {toPersianDigits(preset)}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ initialDate, onDateChange, activeTab }) => {
  const [date, setDate] = useState(initialDate || getTodayStr());
  const [scores, setScores] = useState<Record<string, number>>({});
  const [sins, setSins] = useState<string[]>([]);
  const [custom_titles, setCustomTitles] = useState<Record<string, string>>({});
  const [report, setReport] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  
  // Custom & Active Deeds State
  const [activeDeeds, setActiveDeeds] = useState<DeedDefinition[]>([]);
  const [customDeeds, setCustomDeeds] = useState<DeedDefinition[]>([]);
  const [deletedDeedIds, setDeletedDeedIds] = useState<string[]>([]);
  
  // Catalog Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('همه');
  
  // Custom Deed Quick Builder State
  const [newDeedTitle, setNewDeedTitle] = useState('');
  const [newDeedCategory, setNewDeedCategory] = useState('مراقبت‌های اخلاقی');
  const [newDeedType, setNewDeedType] = useState<DeedType>('binary');
  const [newDeedWeight, setNewDeedWeight] = useState(1);
  const [showCustomForm, setShowCustomForm] = useState(false);

  // In-line Settings Drawer or Overlay for particular active deed
  const [editingDeedId, setEditingDeedId] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState<number>(1);
  const [editingType, setEditingType] = useState<DeedType>('binary');

  // Workout/Gym States
  const [prs, setPrs] = useState<Record<string, number>>({});
  const [customWorkouts, setCustomWorkouts] = useState<WorkoutDefinition[]>([]);
  const [deletedWorkoutIds, setDeletedWorkoutIds] = useState<string[]>([]);
  const [workoutValues, setWorkoutValues] = useState<Record<string, string>>({});
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
  const [newWorkoutUnit, setNewWorkoutUnit] = useState('تعداد');
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [newPrIds, setNewPrIds] = useState<string[]>([]);
  const [workoutFilter, setWorkoutFilter] = useState<'all' | 'active'>('all');

  // Combine default and custom workouts (excluding deleted ones)
  const allWorkouts = useMemo(() => {
    const deletedSet = new Set(deletedWorkoutIds);
    const filteredDefault = WORKOUTS.filter(w => !deletedSet.has(w.id));
    const filteredCustom = customWorkouts.filter(w => !deletedSet.has(w.id));
    return [...filteredDefault, ...filteredCustom];
  }, [customWorkouts, deletedWorkoutIds]);

  // Mobile Workspace Navigation state ('log' = daily log, 'elementor' = configure)
  const [mobileTab, setMobileTab] = useState<'log' | 'elementor'>('log');

  // Generate random star positions once on mount (stable across renders)
  const randomStars = useMemo(() => {
      return Array.from({ length: 40 }).map(() => ({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size: Math.random() * 3 + 2,
          delay: `${Math.random() * 3}s`,
          duration: `${Math.random() * 2 + 2}s`
      }));
  }, []);

  // Calculate readonly state
  const today = getTodayStr();
  const isReadOnly = date !== today;

  // Load data and settings on mount, date change, activeTab change, or storage updates
  useEffect(() => {
    const loadDashboardData = () => {
      const settings = loadSettings();
      const loadedDeletedIds = settings.deletedDeedIds || [];
      const deletedSet = new Set(loadedDeletedIds);

      setCustomDeeds((settings.customDeeds || []).filter(d => !deletedSet.has(d.id)));
      setDeletedDeedIds(loadedDeletedIds);
      
      // Initialize activeDeeds from settings. If not customized yet, fallback to default DEEDS
      if (settings.activeDeeds && settings.activeDeeds.length > 0) {
        setActiveDeeds(settings.activeDeeds.filter(d => !deletedSet.has(d.id)));
      } else {
        setActiveDeeds(DEEDS.filter(d => !deletedSet.has(d.id)));
      }

      // Load workout settings & PRs
      const wSettings = loadWorkoutSettings();
      const loadedDeletedWorkoutIds = wSettings.deletedWorkoutIds || [];
      setCustomWorkouts((wSettings.customWorkouts || []).filter(w => !loadedDeletedWorkoutIds.includes(w.id)));
      setDeletedWorkoutIds(loadedDeletedWorkoutIds);
      const loadedPrs = loadWorkoutPRs();
      setPrs(loadedPrs);
      setNewPrIds([]);

      const record = getRecord(date);
      if (record) {
        setScores(record.scores || {});
        setReport(record.report || '');
        setCustomTitles(record.custom_titles || {});
        setSins(record.sins || []);
        
        // Load workouts of the day
        if (record.workouts) {
          const stringValues: Record<string, string> = {};
          Object.entries(record.workouts).forEach(([k, v]) => {
            const val = v as number;
            stringValues[k] = val > 0 ? val.toString() : '';
          });
          setWorkoutValues(stringValues);
        } else {
          setWorkoutValues({});
        }
      } else {
        setScores({});
        setReport('');
        setCustomTitles({});
        setSins([]);
        setWorkoutValues({});
      }
    };

    loadDashboardData();
    if (onDateChange) onDateChange(date);

    const handleStorageUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener('app_storage_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('app_storage_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [date, onDateChange, activeTab]);

  const handleScoreChange = (id: string, val: number) => {
    if (isReadOnly) return;
    setScores(prev => ({ ...prev, [id]: val }));
  };

  const handleSinsChange = (newSins: string[]) => {
    if (isReadOnly) return;
    setSins(newSins);
  };

  // --- Workout/Gym Handlers ---

  const handleWorkoutInputChange = (workoutId: string, valStr: string) => {
    if (isReadOnly) return;
    const englishVal = toEnglishDigits(valStr);
    const numericVal = englishVal.replace(/[^0-9]/g, '');

    if (numericVal.length > 3) return;

    setWorkoutValues(prev => ({
      ...prev,
      [workoutId]: numericVal
    }));
  };

  const handleAddWorkout = () => {
    if (!newWorkoutTitle.trim()) return;
    
    const id = `custom_workout_${Date.now()}`;
    const newWorkout: WorkoutDefinition = {
      id,
      title: newWorkoutTitle,
      unit: newWorkoutUnit,
      isCustom: true
    };
    
    const updatedList = saveCustomWorkout(newWorkout);
    setCustomWorkouts(updatedList);
    setShowAddWorkoutModal(false);
    setNewWorkoutTitle('');
    setNewWorkoutUnit('تعداد');
  };

  const handleDeleteWorkout = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedCustom = removeCustomWorkout(id);
    setCustomWorkouts(updatedCustom);
    
    setDeletedWorkoutIds(prev => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      saveDeletedWorkoutIds(updated);
      return updated;
    });
    
    // Clean up form value if exists
    if (workoutValues[id]) {
      const newValues = { ...workoutValues };
      delete newValues[id];
      setWorkoutValues(newValues);
    }
  };

  // --- Elementor Add/Remove/Modify Routine Logic ---
  
  const handleAddToRoutine = (deed: DeedDefinition) => {
    if (activeDeeds.some(d => d.id === deed.id)) return;
    
    const updated = [...activeDeeds, { ...deed }];
    setActiveDeeds(updated);
    saveActiveDeeds(updated);
  };

  const handleRemoveFromRoutine = (id: string) => {
    const deed = activeDeeds.find(d => d.id === id);
    if (deed?.isMandatory) return;

    const updated = activeDeeds.filter(d => d.id !== id);
    setActiveDeeds(updated);
    saveActiveDeeds(updated);

    const newScores = { ...scores };
    delete newScores[id];
    setScores(newScores);
    
    if (editingDeedId === id) {
      setEditingDeedId(null);
    }
  };

  const handleEditDeedInRoutine = (deed: DeedDefinition) => {
    if (editingDeedId === deed.id) {
      setEditingDeedId(null);
    } else {
      setEditingDeedId(deed.id);
      setEditingWeight(deed.weight || 1);
      setEditingType(deed.type);
    }
  };

  const handleSaveDeedEdits = () => {
    if (!editingDeedId) return;

    const updated = activeDeeds.map(d => {
      if (d.id === editingDeedId) {
        return {
          ...d,
          weight: editingWeight,
          type: editingType
        };
      }
      return d;
    });

    setActiveDeeds(updated);
    saveActiveDeeds(updated);
    setEditingDeedId(null);
  };

  const handleAddCustomDeed = () => {
    if (!newDeedTitle.trim()) return;

    const id = `custom_${Date.now()}`;
    const newDeed: DeedDefinition = {
      id,
      title: newDeedTitle,
      type: newDeedType,
      category: newDeedCategory,
      weight: newDeedWeight,
      isCustom: true
    };

    const updatedCustom = saveCustomDeed(newDeed);
    setCustomDeeds(updatedCustom);

    const updatedActive = [...activeDeeds, newDeed];
    setActiveDeeds(updatedActive);
    saveActiveDeeds(updatedActive);

    setNewDeedTitle('');
    setNewDeedWeight(1);
    setShowCustomForm(false);
  };

  const handleDeleteDeedFromCatalog = (deed: DeedDefinition) => {
    if (deed.isMandatory) {
      return;
    }
    
    // If active in routine, remove from active routine
    if (activeDeeds.some(d => d.id === deed.id)) {
      handleRemoveFromRoutine(deed.id);
    }

    // Always remove from custom deeds if present
    const updatedCustom = removeCustomDeed(deed.id);
    setCustomDeeds(updatedCustom);

    // Add to deletedDeedIds array and store
    setDeletedDeedIds(prev => {
      if (prev.includes(deed.id)) return prev;
      const updated = [...prev, deed.id];
      saveDeletedDeedIds(updated);
      return updated;
    });
  };

  const handleRestoreDeletedDeeds = () => {
    setDeletedDeedIds([]);
    saveDeletedDeedIds([]);
  };

  const handleResetToDefaults = () => {
    setActiveDeeds(DEEDS);
    saveActiveDeeds(DEEDS);
    setDeletedDeedIds([]);
    saveDeletedDeedIds([]);
    setDeletedWorkoutIds([]);
    saveDeletedWorkoutIds([]);
    setScores({});
    setEditingDeedId(null);
  };

  // Group active deeds by category for structured entry mode
  const groupedActiveDeeds = useMemo<Record<string, DeedDefinition[]>>(() => {
    const groups: Record<string, DeedDefinition[]> = {};
    activeDeeds.forEach(deed => {
      const cat = deed.category || 'سایر اعمال';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(deed);
    });
    return groups;
  }, [activeDeeds]);

  // Catalog Category list
  const catalogCategories = useMemo(() => {
    const cats = new Set<string>();
    DEED_CATALOG.forEach(d => {
      if (d.category) cats.add(d.category);
    });
    return ['همه', ...Array.from(cats)];
  }, []);

  // Merge pre-defined DEED_CATALOG and any customDeeds defined by the user (excluding deleted items)
  const fullDeedCatalog = useMemo<DeedDefinition[]>(() => {
    const deletedSet = new Set(deletedDeedIds);
    const catalogFiltered = DEED_CATALOG.filter(d => !deletedSet.has(d.id));
    const existingIds = new Set(catalogFiltered.map(d => d.id));
    const customFiltered = customDeeds.filter(d => !existingIds.has(d.id) && !deletedSet.has(d.id));
    const merged = [...catalogFiltered, ...customFiltered];
    return merged.map(deed => {
      const activeVersion = activeDeeds.find(d => d.id === deed.id);
      if (activeVersion) {
        return {
          ...deed,
          weight: activeVersion.weight,
          type: activeVersion.type
        };
      }
      return deed;
    });
  }, [customDeeds, activeDeeds, deletedDeedIds]);

  // Group catalog by category for the library section, filtered by search and category filter
  const filteredCatalogDeeds = useMemo(() => {
    let list = fullDeedCatalog;
    
    if (selectedCategoryFilter !== 'همه') {
      list = list.filter(d => d.category === selectedCategoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(d => d.title.toLowerCase().includes(q));
    }

    const groups: Record<string, DeedDefinition[]> = {};
    list.forEach(deed => {
      const cat = deed.category || 'سایر اعمال';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(deed);
    });
    return groups;
  }, [fullDeedCatalog, searchQuery, selectedCategoryFilter]);

  // Completion percentage of active routine
  const routineCompletionStats = useMemo(() => {
    if (activeDeeds.length === 0) return { total: 0, completed: 0, percent: 0 };
    
    let completed = 0;
    activeDeeds.forEach(d => {
      const val = scores[d.id];
      if (val !== undefined && val !== 0) {
        completed += 1;
      }
    });

    return {
      total: activeDeeds.length,
      completed,
      percent: Math.round((completed / activeDeeds.length) * 100)
    };
  }, [activeDeeds, scores]);

  // Calculate dynamic average score based on custom weights and active routine
  const total_average = useMemo(() => {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    let goldenBonus = 0;

    activeDeeds.forEach((deed) => {
      const score = scores[deed.id] || 0;

      if (deed.type === 'golden') {
          if (score === 100) {
              const bonus = deed.weight !== undefined ? deed.weight : (
                  deed.id === 'golden_night_prayer' || deed.id === 'golden_father_hand' || deed.id === 'golden_mother_hand' ? 20 : 10
              );
              goldenBonus += bonus;
          }
      } else {
          let weight = deed.weight !== undefined ? deed.weight : 1;
          
          if (deed.weight === undefined) {
              if (deed.type === 'prayer') {
                 weight = 2;
              } else if (deed.id === 'gaze_control' || deed.id === 'truthfulness') {
                 weight = 3;
              }
          }
          
          totalWeightedScore += score * weight;
          totalWeight += weight;
      }
    });

    const baseAverage = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    const penalty = sins.length * 10;
    const finalScore = baseAverage + goldenBonus - penalty;
    
    return Math.round(finalScore);
  }, [scores, sins, activeDeeds]);

  const goldenStarsCount = useMemo(() => {
    let count = 0;
    activeDeeds.forEach(d => {
        if (d.type === 'golden' && scores[d.id] === 100) {
            if (d.id === 'golden_night_prayer' || d.id === 'golden_father_hand' || d.id === 'golden_mother_hand') {
                count += 2;
            } else {
                count += 1;
            }
        }
    });
    return count;
  }, [scores, activeDeeds]);

  const getScoreColorClass = (score: number) => {
    if (score > 100) {
        return 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 border-yellow-300 shadow-yellow-500/50';
    }
    if (score < 0) return 'bg-gradient-to-br from-red-800 to-rose-950';
    
    const tens = Math.floor(score / 10);
    switch (tens) {
        case 0: return 'bg-gradient-to-br from-red-600 to-orange-800'; 
        case 1: return 'bg-gradient-to-br from-orange-700 to-orange-900'; 
        case 2: return 'bg-gradient-to-br from-orange-600 to-amber-800'; 
        case 3: return 'bg-gradient-to-br from-orange-500 to-amber-700'; 
        case 4: return 'bg-gradient-to-br from-amber-600 to-yellow-700'; 
        case 5: return 'bg-gradient-to-br from-yellow-600 to-lime-800'; 
        case 6: return 'bg-gradient-to-br from-lime-600 to-green-800'; 
        case 7: return 'bg-gradient-to-br from-green-600 to-emerald-800'; 
        case 8: return 'bg-gradient-to-br from-emerald-600 to-teal-800'; 
        case 9: return 'bg-gradient-to-br from-teal-500 to-cyan-700'; 
        case 10: return 'bg-gradient-to-br from-cyan-500 to-blue-600'; 
        default: return 'bg-gradient-to-br from-cyan-500 to-blue-600'; 
    }
  };

  const handleSave = () => {
    if (isReadOnly) return;

    if (!report || !report.trim()) {
        setShowValidationError(true);
        setTimeout(() => setShowValidationError(false), 2500);
        
        const textarea = document.getElementById('report-textarea');
        if (textarea) {
            textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            textarea.focus();
        }
        return;
    }

    setIsSaving(true);

    const originalRecord = getRecord(date);
    const originalScores = originalRecord?.scores || {};
    const qadaData = loadQada();
    let qadaChanged = false;

    const updateQadaForPrayer = (key: string, qadaKeys: ('fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')[]) => {
        const isNowQada = scores[key] === -100;
        const wasQada = originalScores[key] === -100;

        if (isNowQada && !wasQada) {
            qadaKeys.forEach(k => qadaData[k] += 1);
            qadaChanged = true;
        } else if (!isNowQada && wasQada) {
            qadaKeys.forEach(k => qadaData[k] = Math.max(0, qadaData[k] - 1));
            qadaChanged = true;
        }
    };

    updateQadaForPrayer('prayer_fajr', ['fajr']);
    updateQadaForPrayer('prayer_dhuhr', ['dhuhr', 'asr']);
    updateQadaForPrayer('prayer_maghrib', ['maghrib', 'isha']);

    if (qadaChanged) {
        saveQada(qadaData);
    }

    // Process Workouts and check PRs
    const numericWorkouts: Record<string, number> = {};
    const potentialNewPrs: string[] = [];
    const updatedPrs = { ...prs };
    let prsChanged = false;

    Object.entries(workoutValues).forEach(([id, valStr]) => {
        const val = parseInt(valStr as string) || 0;
        if (val > 0) {
            numericWorkouts[id] = val;
            
            // Check PR
            const currentPr = updatedPrs[id] || 0;
            if (val > currentPr) {
                updatedPrs[id] = val;
                potentialNewPrs.push(id);
                prsChanged = true;
            }
        }
    });

    if (prsChanged) {
        saveWorkoutPRs(updatedPrs);
        setPrs(updatedPrs);
    }
    setNewPrIds(potentialNewPrs);

    const record: DailyRecord = {
      date,
      scores,
      sins,
      custom_titles,
      report,
      total_average,
      workouts: numericWorkouts,
      updated_at: Date.now()
    };
    saveRecord(record);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    }, 500);
  };

  const changeDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const newDateStr = `${year}-${month}-${day}`;
    
    if (days > 0 && newDateStr > getTodayStr()) return;
    setDate(newDateStr);
  };

  const persianDate = new Date(date).toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Styles per category block
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'نمازهای واجب':
        return { bg: 'bg-emerald-500/5 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/10 dark:border-emerald-500/20', dot: 'bg-emerald-500' };
      case 'نمازهای مستحب':
        return { bg: 'bg-teal-500/5 dark:bg-teal-500/10', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-500/10 dark:border-teal-500/20', dot: 'bg-teal-500' };
      case 'ادعیه و زیارات':
        return { bg: 'bg-indigo-500/5 dark:bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-500/10 dark:border-indigo-500/20', dot: 'bg-indigo-500' };
      case 'سوره‌های قرآن':
        return { bg: 'bg-blue-500/5 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500/10 dark:border-blue-500/20', dot: 'bg-blue-500' };
      case 'مراقبت‌های اخلاقی':
        return { bg: 'bg-amber-500/5 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-500/10 dark:border-amber-500/20', dot: 'bg-amber-500' };
      case 'اعمال طلایی':
        return { bg: 'bg-yellow-500/5 dark:bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-500/10 dark:border-yellow-500/20', dot: 'bg-yellow-500' };
      case 'سبک زندگی':
        return { bg: 'bg-rose-500/5 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/10 dark:border-rose-500/20', dot: 'bg-rose-500' };
      case 'درسی و آموزشی':
        return { bg: 'bg-violet-500/5 dark:bg-violet-500/10', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-500/10 dark:border-violet-500/20', dot: 'bg-violet-500' };
      case 'کاری و مهارتی':
        return { bg: 'bg-cyan-500/5 dark:bg-cyan-500/10', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-500/10 dark:border-cyan-500/20', dot: 'bg-cyan-500' };
      case 'ورزش و سلامت':
        return { bg: 'bg-emerald-500/5 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/10 dark:border-emerald-500/20', dot: 'bg-emerald-500' };
      case 'مالی و اقتصادی':
        return { bg: 'bg-orange-500/5 dark:bg-orange-500/10', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-500/10 dark:border-orange-500/20', dot: 'bg-orange-500' };
      default:
        return { bg: 'bg-gray-500/5 dark:bg-gray-500/10', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-500/10 dark:border-gray-500/20', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-6 relative max-w-7xl mx-auto pb-28">
      
      {/* 1. Date Selector & Score Card (KEPT EXACTLY UNCHANGED AS REQUESTED) */}
      <div className={`${getScoreColorClass(total_average)} rounded-3xl p-6 text-white shadow-lg relative overflow-hidden transition-all duration-700`}>
         {total_average > 100 && (
             <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                 <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-b from-white/20 to-transparent rotate-45 animate-pulse" style={{ animationDuration: '3s' }}></div>
                 {randomStars.map((star, i) => (
                     <div 
                        key={i}
                        className="absolute bg-white rounded-full animate-pulse shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDuration: star.duration,
                            animationDelay: star.delay,
                            opacity: Math.random() * 0.5 + 0.3
                        }}
                     />
                 ))}
             </div>
         )}

         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="2" fill="currentColor"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#p)"/>
            </svg>
         </div>

        <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => changeDate(-1)} className="p-1 hover:bg-white/20 rounded-full transition"><ChevronRight className="w-6 h-6" /></button>
                <div className="text-center">
                    <h2 className="text-lg font-bold opacity-90">امتیاز {isReadOnly ? (date < today ? 'روز گذشته' : 'روز آینده') : 'امروز'}</h2>
                    <div className="text-sm font-light opacity-80 mt-1">{persianDate}</div>
                </div>
                <button 
                    onClick={() => changeDate(1)} 
                    className={`p-1 hover:bg-white/20 rounded-full transition ${date === today ? 'opacity-30 cursor-not-allowed' : ''}`} 
                    disabled={date === today}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-col items-center mb-2">
                <div className="flex items-end gap-3" dir="ltr">
                    <span className={`text-6xl font-black tracking-tighter leading-none ${total_average > 100 ? 'drop-shadow-lg' : ''}`}>
                        {toPersianDigits(total_average)}
                    </span>
                    <span className="text-xl mb-1.5 opacity-80 font-bold">/ ۱۰۰+</span>
                </div>
                
                {goldenStarsCount > 0 && (
                    <div className="flex gap-1 mt-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                        {Array.from({ length: goldenStarsCount }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-200 text-yellow-200 drop-shadow-sm animate-pulse" style={{ animationDelay: `${i * 0.2}s`}} />
                        ))}
                    </div>
                )}
            </div>
            
            <div className="w-full bg-black/20 h-2 rounded-full mt-4 overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ease-out ${total_average < 0 ? 'bg-red-400' : 'bg-white'}`}
                    style={{ width: `${Math.max(0, Math.min(100, Math.abs(total_average)))}%` }}
                ></div>
            </div>
            
            {isReadOnly && (
                <div className="mt-4 flex justify-center">
                    <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>غیر قابل ویرایش</span>
                    </div>
                </div>
            )}
        </div>
      </div>
      {/* --- END OF SCORE CARD --- */}


      {/* 2. Micro Completion Tracker Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs">
            {toPersianDigits(routineCompletionStats.percent)}٪
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-gray-100 text-xs">میزان تکمیل مراقبت روزانه</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              تاکنون {toPersianDigits(routineCompletionStats.completed)} مورد از {toPersianDigits(routineCompletionStats.total)} مورد ثبت شده است.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-500 ease-out" 
            style={{ width: `${routineCompletionStats.percent}%` }}
          />
        </div>
      </div>


      {/* 3. Responsive Workspace */}
      
      {/* Tab Selector for Mobile Screens */}
      <div className="flex lg:hidden bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
        <button
          onClick={() => setMobileTab('log')}
          className={`flex-1 py-2.5 text-center rounded-lg font-bold text-xs transition duration-200 ${
            mobileTab === 'log'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          📝 ثبت اعمال امروز ({toPersianDigits(activeDeeds.length)})
        </button>
        <button
          onClick={() => setMobileTab('elementor')}
          className={`flex-1 py-2.5 text-center rounded-lg font-bold text-xs transition duration-200 flex items-center justify-center gap-1.5 ${
            mobileTab === 'elementor'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>شخصی‌سازی</span>
        </button>
      </div>


      {/* Main Grid: Left Side is Logger, Right Side is Elementor library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================= */}
        {/* COLUMN A: DAILY LOGGER WORKBENCH (7 cols)                  */}
        {/* ========================================================= */}
        <div className={`lg:col-span-7 space-y-6 ${mobileTab !== 'log' ? 'hidden lg:block' : 'block'}`}>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"></span>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">کاربرگ روزانه مراقبه نفس</h3>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">
                امروز: {toPersianDigits(activeDeeds.length)} عمل فعال
              </span>
            </div>

            {activeDeeds.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-sm text-gray-500">برنامه‌ای تعریف نکرده‌اید! از بخش شخصی‌سازی (سمت چپ) اعمال خود را اضافه کنید.</p>
                <button
                  onClick={() => setMobileTab('elementor')}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs rounded-xl"
                >
                  افزودن اولین عمل
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedActiveDeeds).map(([category, val]) => {
                  const deeds = val as DeedDefinition[];
                  const theme = getCategoryTheme(category);
                  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS['سایر اعمال'];
                  
                  return (
                    <div 
                      key={category} 
                      className={`border ${theme.border} ${theme.bg} rounded-2xl p-4 shadow-sm space-y-3`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-gray-100/50 dark:border-gray-700/50 pb-2">
                        <h4 className={`font-bold text-xs ${theme.text} flex items-center gap-1.5`}>
                          {icon}
                          {category}
                        </h4>
                        
                        <span className="text-[9px] bg-white/70 dark:bg-gray-900/60 px-2 py-0.5 rounded-full font-bold opacity-80">
                          {toPersianDigits(deeds.length)} مورد
                        </span>
                      </div>

                      {/* Items */}
                      <div className="grid gap-3">
                        {deeds.map(deed => {
                          const isEditing = editingDeedId === deed.id;
                          return (
                            <div key={deed.id} className="group/item relative flex flex-col">
                              {/* Integrated Entry element with inline actions */}
                              <DeedInput
                                deed={deed}
                                value={scores[deed.id] || 0}
                                onChange={(val) => handleScoreChange(deed.id, val)}
                                disabled={isReadOnly}
                                onQuickEdit={!isReadOnly ? () => handleEditDeedInRoutine(deed) : undefined}
                                onRemoveFromRoutine={!isReadOnly ? () => handleRemoveFromRoutine(deed.id) : undefined}
                                isEditing={isEditing}
                              />

                              {/* Embedded quick editor drawer */}
                              {isEditing && (
                                <div className="mt-2 p-3 bg-white/80 dark:bg-gray-950/40 border border-primary-100 dark:border-primary-900/30 rounded-xl space-y-3 shadow-inner animate-scale-in">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-1.5">
                                    <span>تنظیم وزن و اندازه {deed.title}</span>
                                    {!deed.isMandatory && (
                                      <button 
                                        onClick={() => handleRemoveFromRoutine(deed.id)}
                                        className="text-red-500 flex items-center gap-0.5 hover:underline"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        حذف از دفترچه
                                      </button>
                                    )}
                                  </div>

                                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block">نوع سنجش</label>
                                      <CustomSelect
                                        value={editingType}
                                        disabled={deed.isMandatory}
                                        onChange={(val) => setEditingType(val as DeedType)}
                                        options={TYPE_OPTIONS}
                                      />
                                    </div>

                                    <WeightSlider
                                      value={editingWeight}
                                      onChange={setEditingWeight}
                                      max={editingType === 'golden' ? 50 : 10}
                                      label={editingType === 'golden' ? 'امتیاز پاداش' : 'ضریب اهمیت'}
                                    />
                                  </div>

                                  <div className="flex justify-end gap-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-800/80">
                                    <button
                                      onClick={() => setEditingDeedId(null)}
                                      className="px-2.5 py-1 text-[10px] font-bold text-gray-500 hover:bg-gray-100 rounded-md"
                                    >
                                      انصراف
                                    </button>
                                    <button
                                      onClick={handleSaveDeedEdits}
                                      className="px-3.5 py-1 bg-primary-600 text-white text-[10px] font-bold rounded-md shadow"
                                    >
                                      ذخیره
                                    </button>
                                  </div>
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sins Section (Always Default & Mandatory) */}
          <div>
            <SinInput 
              selectedSins={sins} 
              onChange={handleSinsChange} 
              disabled={isReadOnly}
            />
          </div>

          {/* Gym/Workout (باشگاه) Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700/50 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-base">باشگاه و تناسب اندام امروز</h3>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">رکوردهای شخصی خود را جابجا کنید و تندرستی را به یک عادت روزانه تبدیل کنید!</p>
              </div>
              
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {/* Filter Tabs */}
                <div className="flex bg-gray-100 dark:bg-gray-900/85 p-0.5 rounded-xl border border-gray-200/20">
                  <button
                    type="button"
                    onClick={() => setWorkoutFilter('all')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      workoutFilter === 'all'
                        ? 'bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                  >
                    همه تمرینات
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkoutFilter('active')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      workoutFilter === 'active'
                        ? 'bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                  >
                    انجام شده امروز
                  </button>
                </div>

                {!isReadOnly && (
                  <button
                    onClick={() => setShowAddWorkoutModal(!showAddWorkoutModal)}
                    className="flex items-center gap-1 text-xs bg-cyan-600 text-white hover:bg-cyan-700 px-3 py-1.5 rounded-xl shadow-sm transition-all font-bold cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>تمرین جدید</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inline Add Workout Form */}
            {showAddWorkoutModal && (
              <div className="bg-gradient-to-br from-cyan-500/[0.03] to-blue-500/[0.03] border border-cyan-100/70 dark:border-cyan-950/50 rounded-2xl p-4 space-y-4 animate-scale-in shadow-inner">
                <div className="flex justify-between items-center text-xs font-bold text-cyan-700 dark:text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                    ایجاد تمرین جدید
                  </span>
                  <button onClick={() => setShowAddWorkoutModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 dark:text-gray-500 font-extrabold mb-1.5">نام تمرین</label>
                    <input
                      type="text"
                      value={newWorkoutTitle}
                      onChange={(e) => setNewWorkoutTitle(e.target.value)}
                      placeholder="مثال: شنا سوئدی، پیاده‌روی، پرس سینه، اسکوات"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-gray-400 dark:text-gray-500 font-extrabold mb-2">واحد اندازه‌گیری</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {['تعداد', 'ست', 'دقیقه', 'ثانیه', 'متر', 'کیلومتر'].map(unit => (
                        <button
                          type="button"
                          key={unit}
                          onClick={() => setNewWorkoutUnit(unit)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-center ${
                            newWorkoutUnit === unit
                              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/10 scale-102 border-transparent'
                              : 'bg-gray-100/50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100/10">
                  <button
                    onClick={() => setShowAddWorkoutModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleAddWorkout}
                    disabled={!newWorkoutTitle.trim()}
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-600/15 cursor-pointer"
                  >
                    ثبت تمرین
                  </button>
                </div>
              </div>
            )}

            {/* Workouts Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {(() => {
                const filteredList = allWorkouts.filter(workout => {
                  if (workoutFilter === 'active') {
                    const val = parseInt(workoutValues[workout.id] || '0') || 0;
                    return val > 0;
                  }
                  return true;
                });

                if (filteredList.length === 0) {
                  return (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-center space-y-2 bg-gray-50/50 dark:bg-gray-900/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500 flex items-center justify-center mb-1">
                        <Dumbbell className="w-6 h-6 opacity-60" />
                      </div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {workoutFilter === 'active' 
                          ? 'هنوز تمرینی برای امروز ثبت نکرده‌اید! دست به کار شوید 💪' 
                          : 'تمرینی یافت نشد. می‌توانید تمرین جدیدی اضافه کنید!'}
                      </p>
                    </div>
                  );
                }

                return filteredList.map(workout => {
                  const pr = prs[workout.id] || 0;
                  const currentVal = parseInt(workoutValues[workout.id] || '0') || 0;
                  const isNewPr = newPrIds.includes(workout.id) || (currentVal > 0 && currentVal > pr);
                  const displayValue = toPersianDigits(workoutValues[workout.id] || '');
                  
                  // Calculate progress percentage against Personal Record (PR)
                  const progressPercentage = pr > 0 ? Math.min(100, (currentVal / pr) * 100) : 0;
                  const isRecordBeaten = currentVal > 0 && currentVal >= pr;

                  // Dynamic step values for quick-add pills based on unit
                  let steps = [1, 5, 10];
                  if (['ثانیه', 'دقیقه'].includes(workout.unit)) {
                    steps = [5, 15, 30];
                  } else if (workout.unit === 'متر') {
                    steps = [10, 50, 100];
                  } else if (workout.unit === 'کیلومتر') {
                    steps = [1, 2, 5];
                  }

                  return (
                    <div 
                      key={workout.id} 
                      className={`relative bg-gradient-to-b from-gray-50/70 to-white dark:from-gray-900/40 dark:to-gray-800 p-4 rounded-3xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between gap-4 ${
                        isRecordBeaten 
                          ? 'border-amber-200/80 dark:border-amber-900/30 ring-1 ring-amber-400/20' 
                          : 'border-gray-100 dark:border-gray-800/80 hover:border-cyan-100/80 dark:hover:border-cyan-950/50'
                      }`}
                    >
                      {/* Top Row: Activity & Controls */}
                      <div className="flex items-start justify-between gap-3">
                        {/* Title Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-colors ${
                            isRecordBeaten
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-500 dark:text-cyan-400 border-cyan-100/15'
                          }`}>
                            <Dumbbell className="w-5 h-5" />
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="font-extrabold text-sm text-gray-800 dark:text-gray-100 truncate">{workout.title}</span>
                              {!isReadOnly && (
                                <button
                                  onClick={(e) => handleDeleteWorkout(workout.id, e)}
                                  className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                                  title="حذف تمرین"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <Trophy className={`w-3.5 h-3.5 ${isRecordBeaten ? 'text-amber-500 fill-amber-500 animate-bounce' : 'text-gray-400 dark:text-gray-500'}`} />
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">
                                بهترین رکورد: <span className="font-extrabold text-gray-600 dark:text-gray-300">{toPersianDigits(pr)}</span> {workout.unit}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Input Value Counter */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex items-center bg-gray-100 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-0.5 shadow-inner">
                            <button
                              type="button"
                              disabled={isReadOnly}
                              onClick={() => {
                                const currentValStr = workoutValues[workout.id] || '';
                                const val = parseInt(toEnglishDigits(currentValStr)) || 0;
                                const newVal = Math.max(0, val - 1);
                                handleWorkoutInputChange(workout.id, String(newVal));
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 transition-all cursor-pointer"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={displayValue}
                              onChange={(e) => handleWorkoutInputChange(workout.id, e.target.value)}
                              placeholder="۰"
                              disabled={isReadOnly}
                              className="w-10 text-center font-extrabold text-sm bg-transparent border-0 outline-none focus:ring-0 text-gray-800 dark:text-gray-100 placeholder-gray-300"
                            />
                            
                            <button
                              type="button"
                              disabled={isReadOnly}
                              onClick={() => {
                                const currentValStr = workoutValues[workout.id] || '';
                                const val = parseInt(toEnglishDigits(currentValStr)) || 0;
                                const newVal = val + 1;
                                handleWorkoutInputChange(workout.id, String(newVal));
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-green-500 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <span className="text-[9px] font-extrabold bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-md text-gray-500 dark:text-gray-400 border border-gray-200/10">{workout.unit}</span>
                        </div>
                      </div>

                      {/* Middle Row: Progress Bar to Personal Record */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-extrabold">
                          <span className="text-gray-400">پیشرفت تا رکورد</span>
                          {isRecordBeaten ? (
                            <span className="text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                              <span>رکورد جدید ثبت شد!</span>
                              <span>🏆</span>
                            </span>
                          ) : (
                            <span className="text-cyan-500 dark:text-cyan-400">
                              {toPersianDigits(Math.round(progressPercentage))}%
                            </span>
                          )}
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden border border-gray-200/10">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isRecordBeaten 
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 glow-success' 
                                : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                            }`}
                            style={{ width: `${pr > 0 ? progressPercentage : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Row: Quick Add Pills & Quick Reset */}
                      {!isReadOnly && (
                        <div className="flex items-center justify-between gap-1 border-t border-gray-100/50 dark:border-gray-800/85 pt-3">
                          <div className="flex items-center gap-1">
                            {steps.map(step => (
                              <button
                                type="button"
                                key={step}
                                onClick={() => {
                                  const currentValStr = workoutValues[workout.id] || '';
                                  const val = parseInt(toEnglishDigits(currentValStr)) || 0;
                                  const newVal = val + step;
                                  handleWorkoutInputChange(workout.id, String(newVal));
                                }}
                                className="px-2.5 py-1 text-[10px] font-extrabold bg-gray-50 hover:bg-cyan-50 hover:text-cyan-600 dark:bg-gray-900 dark:hover:bg-cyan-950/45 dark:hover:text-cyan-400 text-gray-500 dark:text-gray-400 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-cyan-200/50 dark:hover:border-cyan-900/50 transition-all cursor-pointer shadow-sm"
                              >
                                +{toPersianDigits(step)}
                              </button>
                            ))}
                          </div>
                          
                          {currentVal > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('آیا می‌خواهید مقدار این تمرین را صفر کنید؟')) {
                                  handleWorkoutInputChange(workout.id, '');
                                }
                              }}
                              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 px-2 py-1 rounded-lg text-[9px] font-extrabold flex items-center gap-0.5 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3 animate-spin-hover" />
                              <span>پاک کردن</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Imam Zaman (AS) Daily Heart Letter (Always Default & Mandatory) */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700/60 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
                <label className="block text-gray-800 dark:text-gray-100 font-bold text-xs flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>گزارش قلبی به محضر امام زمان (عجل الله فرجه)</span>
                    <span className="text-[9px] text-red-500 font-bold bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-md">اجباری</span>
                </label>
                 {showValidationError && (
                    <div className="flex items-center gap-1 text-red-500 text-xs font-bold animate-bounce">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>لطفا این بخش را خالی نگذارید</span>
                    </div>
                )}
            </div>
            <textarea
                id="report-textarea"
                value={report}
                onChange={(e) => !isReadOnly && setReport(e.target.value)}
                placeholder={isReadOnly ? "گزارشی ثبت نشده است." : "دل‌نوشته، عهد جدید با مولا، اعتراف، استغفار، یا شرح حال اعمال امروز..."}
                disabled={isReadOnly}
                className={`w-full h-32 p-4 rounded-2xl border outline-none resize-none text-gray-700 dark:text-gray-300 text-xs leading-relaxed transition-all placeholder-gray-400 dark:placeholder-gray-500 ${
                    showValidationError
                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50/50 dark:bg-red-900/10'
                        : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                } ${
                    isReadOnly
                        ? 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800'
                }`}
            />
          </div>

          {/* Floating Action Button for Save */}
          {!isReadOnly && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl pb-4 flex justify-center z-[90] pointer-events-none">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`pointer-events-auto flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-lg transform transition-all active:scale-95 ${
                        showSaveSuccess ? 'bg-green-600 dark:bg-green-700 scale-105' : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600'
                    }`}
                >
                    {isSaving ? (
                        <span>در حال ذخیره...</span>
                    ) : showSaveSuccess ? (
                        <span>با موفقیت ذخیره شد</span>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>ثبت دفترچه مراقبه امروز</span>
                        </>
                    )}
                </button>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* COLUMN B: ELEMENTOR WORKSPACE BUILDER (5 cols)             */}
        {/* ========================================================= */}
        <div className={`lg:col-span-5 space-y-6 ${mobileTab !== 'elementor' ? 'hidden lg:block' : 'block'}`}>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm space-y-5 sticky top-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-primary-500" />
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">چینش و شخصی‌سازی برنامه</h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">برنامه روزانه خود را کم یا زیاد کنید</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {deletedDeedIds.length > 0 && (
                  <button
                    onClick={handleRestoreDeletedDeeds}
                    className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200/50 dark:border-amber-800/40 px-2 py-1 rounded-lg transition"
                    title="بازگرداندن اعمال حذف‌شده پیش‌فرض"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>بازیابی ({toPersianDigits(deletedDeedIds.length)})</span>
                  </button>
                )}
                <button
                  onClick={handleResetToDefaults}
                  className="flex items-center gap-1 text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-1 rounded-lg transition"
                  title="بازگشت به برنامه اولیه پیش فرض"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>برنامه پیش‌فرض</span>
                </button>
              </div>
            </div>

            {/* Quick custom deed form toggler */}
            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full py-2.5 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 font-bold text-xs rounded-xl hover:bg-primary-100 dark:hover:bg-primary-950/50 transition duration-200 border border-primary-200/40 dark:border-primary-800/40 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>تعریف عمل اختصاصی جدید</span>
              </button>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl space-y-3.5 animate-scale-in">
                <div className="flex justify-between items-center text-xs font-bold text-gray-800 dark:text-gray-200">
                  <span>تعریف عمل جدید</span>
                  <button onClick={() => setShowCustomForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">عنوان عمل</label>
                    <input
                      type="text"
                      value={newDeedTitle}
                      onChange={(e) => setNewDeedTitle(e.target.value)}
                      placeholder="مثال: دعای توسل، زیارت امین الله، مطالعه"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">دسته‌بندی</label>
                      <CustomSelect
                        value={newDeedCategory}
                        onChange={(val) => setNewDeedCategory(val)}
                        options={CATEGORY_OPTIONS}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">نوع سنجش</label>
                      <CustomSelect
                        value={newDeedType}
                        onChange={(val) => setNewDeedType(val as DeedType)}
                        options={TYPE_OPTIONS}
                      />
                    </div>
                  </div>

                  <WeightSlider
                    value={newDeedWeight}
                    onChange={setNewDeedWeight}
                    max={newDeedType === 'golden' ? 50 : 10}
                    label={newDeedType === 'golden' ? 'امتیاز پاداش' : 'ضریب اهمیت'}
                  />
                </div>

                <div className="flex justify-end gap-1.5 pt-2">
                  <button
                    onClick={() => setShowCustomForm(false)}
                    className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-lg"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleAddCustomDeed}
                    disabled={!newDeedTitle.trim()}
                    className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
                  >
                    ایجاد و اضافه شدن
                  </button>
                </div>
              </div>
            )}

            {/* Search and Category Filters */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی سوره، زیارت یا دعا..."
                  className="w-full pl-4 pr-9 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categorization chips (horizontal scrollable) */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" dir="rtl">
                {catalogCategories.map(cat => {
                  const isActive = selectedCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`whitespace-nowrap px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-850 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Catalog List */}
            <div className="max-h-[420px] overflow-y-auto pr-1 space-y-4 scrollbar-thin">
              {Object.entries(filteredCatalogDeeds).length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                  موردی یافت نشد. می‌توانید با دکمه بالا آن را دستی ایجاد کنید.
                </div>
              ) : (
                Object.entries(filteredCatalogDeeds).map(([category, val]) => {
                  const deeds = val as DeedDefinition[];
                  const theme = getCategoryTheme(category);
                  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS['سایر اعمال'];
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-1 px-1">
                        {icon}
                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">{category}</span>
                      </div>

                      <div className="space-y-1.5">
                        {deeds.map(deed => {
                          const isActive = activeDeeds.some(d => d.id === deed.id);
                          const isEditingInCatalog = editingDeedId === deed.id;
                          return (
                            <div key={deed.id} className="flex flex-col gap-1.5">
                              <div 
                                className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between text-xs ${
                                  isActive
                                    ? 'bg-green-50/40 dark:bg-green-950/10 border-green-200/40 dark:border-green-900/30'
                                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800/80 hover:border-gray-200 dark:hover:border-gray-700'
                                }`}
                              >
                                <div className="flex flex-col min-w-0 pr-1">
                                  <span className="font-bold text-gray-700 dark:text-gray-200 truncate">{deed.title}</span>
                                  <span className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5" dir="rtl">
                                    {deed.type === 'binary' ? 'بله/خیر' : deed.type === 'scalar' ? 'مقداری' : deed.type === 'golden' ? 'طلایی' : 'نماز'}
                                    {' | '}
                                    {deed.type === 'golden' ? `پاداش: ${toPersianDigits(deed.weight || 10)}` : `ضریب: ${toPersianDigits(deed.weight || 1)}`}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 pl-1">
                                  {isActive ? (
                                    <>
                                      <button
                                        onClick={() => handleEditDeedInRoutine(deed)}
                                        className={`p-1 hover:bg-primary-50 dark:hover:bg-primary-950/20 text-gray-400 hover:text-primary-500 rounded-lg transition-colors ${
                                          isEditingInCatalog ? 'text-primary-500 bg-primary-50 dark:bg-primary-950/20' : ''
                                        }`}
                                        title="ویرایش وزن و نوع عمل"
                                      >
                                        <Settings2 className="w-3.5 h-3.5" />
                                      </button>
                                      {!deed.isMandatory && (
                                        <button
                                          onClick={() => handleRemoveFromRoutine(deed.id)}
                                          className="p-1 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-500 hover:text-amber-600 rounded-lg transition"
                                          title="خروج از روال مراقبه روزانه"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      <span className="text-[9px] font-bold text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-900/30 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                                        <Check className="w-3 h-3" />
                                        فعال
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      {!deed.isMandatory && (
                                        <button
                                          onClick={() => handleDeleteDeedFromCatalog(deed)}
                                          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 rounded-lg transition"
                                          title="حذف کامل از لیست"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleAddToRoutine(deed)}
                                        className="px-2.5 py-1 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition"
                                      >
                                        + افزودن
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Catalog Inline Quick Editor */}
                              {isEditingInCatalog && (
                                <div className="p-3 bg-gray-50/80 dark:bg-gray-900/40 border border-primary-100 dark:border-primary-900/30 rounded-xl space-y-3 shadow-inner animate-scale-in">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-1.5">
                                    <span>تنظیم وزن و اندازه {deed.title}</span>
                                  </div>

                                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block">نوع سنجش</label>
                                      <CustomSelect
                                        value={editingType}
                                        disabled={deed.isMandatory}
                                        onChange={(val) => setEditingType(val as DeedType)}
                                        options={TYPE_OPTIONS}
                                      />
                                    </div>

                                    <WeightSlider
                                      value={editingWeight}
                                      onChange={setEditingWeight}
                                      max={editingType === 'golden' ? 50 : 10}
                                      label={editingType === 'golden' ? 'امتیاز پاداش' : 'ضریب اهمیت'}
                                    />
                                  </div>

                                  <div className="flex justify-end gap-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-850">
                                    <button
                                      onClick={() => setEditingDeedId(null)}
                                      className="px-2.5 py-1 text-[10px] font-bold text-gray-500 hover:bg-gray-200 rounded-md"
                                    >
                                      انصراف
                                    </button>
                                    <button
                                      onClick={handleSaveDeedEdits}
                                      className="px-3.5 py-1 bg-primary-600 text-white text-[10px] font-bold rounded-md shadow"
                                    >
                                      ذخیره
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick tips about the scoring system */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-3 flex items-start gap-2.5 text-[10px] text-amber-800 dark:text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">سیستم وزن‌دهی برنامه</span>
                <p className="opacity-80 mt-0.5 leading-relaxed">
                  افزایش ضریب اهمیت (وزن) هر عمل، تاثیر آن را در معدل کل افزایش می‌دهد. اعمال طلایی نیز به عنوان پاداش مستقل به صورت مستقیم امتیاز اضافه می‌کنند.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
