


import { DeedDefinition, SinDefinition, QadaCounts, WorkoutDefinition } from './types';

export const DEEDS: DeedDefinition[] = [
  // Prayers
  { id: 'prayer_fajr', title: 'نماز اول وقت صبح', type: 'prayer', category: 'نمازهای واجب', weight: 2, isMandatory: true },
  { id: 'prayer_dhuhr', title: 'نماز اول وقت ظهر', type: 'prayer', category: 'نمازهای واجب', weight: 2, isMandatory: true },
  { id: 'prayer_maghrib', title: 'نماز اول وقت شب', type: 'prayer', category: 'نمازهای واجب', weight: 2, isMandatory: true },

  // Binary Deeds (0 or 100)
  { id: 'ziyarat_ashura', title: 'زیارت عاشورا', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },
  { id: 'ziyarat_ale_yasin', title: 'زیارت آل یاسین', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },
  { id: 'surah_fath', title: 'سوره فتح', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  { id: 'surah_dhariyat', title: 'سوره ذاریات', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  { id: 'surah_waqiah', title: 'سوره واقعه', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  { id: 'surah_yasin', title: 'سوره یس', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  
  // Scalar Deeds (0 to 100)
  { id: 'gaze_control', title: 'کنترل نگاه (نگاه نکردن به نامحرم)', type: 'scalar', category: 'مراقبت‌های اخلاقی', weight: 3 },
  { id: 'truthfulness', title: 'صداقت (نگفتن دروغ)', type: 'scalar', category: 'مراقبت‌های اخلاقی', weight: 3 },
  { id: 'sleep_time', title: 'خوابیدن سر زمان مناسب', type: 'scalar', category: 'سبک زندگی', weight: 1 },

  // Golden Deeds (Bonus Score)
  { id: 'golden_night_prayer', title: 'نماز شب', type: 'golden', category: 'اعمال طلایی', weight: 20 },
  { id: 'golden_father_hand', title: 'بوسیدن دست پدر', type: 'golden', category: 'اعمال طلایی', weight: 20 },
  { id: 'golden_mother_hand', title: 'بوسیدن دست مادر', type: 'golden', category: 'اعمال طلایی', weight: 20 },
  { id: 'golden_salawat', title: '۱۰۰ تا صلوات', type: 'golden', category: 'اعمال طلایی', weight: 10 },
  { id: 'golden_parents', title: 'خوشحال کردن پدر و مادر', type: 'golden', category: 'اعمال طلایی', weight: 10 },
  { id: 'golden_others', title: 'خوشحال کردن دیگران', type: 'golden', category: 'اعمال طلایی', weight: 10 },
];

export const DEED_CATALOG: DeedDefinition[] = [
  // نمازهای واجب
  { id: 'prayer_fajr', title: 'نماز اول وقت صبح', type: 'prayer', category: 'نمازهای واجب', weight: 2, isMandatory: true },
  { id: 'prayer_dhuhr', title: 'نماز اول وقت ظهر', type: 'prayer', category: 'نمازهای واجب', weight: 2, isMandatory: true },
  { id: 'prayer_maghrib', title: 'نماز اول وقت شب', type: 'prayer', category: 'نمازهای واجب', weight: 2, isMandatory: true },

  // نمازهای مستحب
  { id: 'golden_night_prayer', title: 'نماز شب', type: 'golden', category: 'نمازهای مستحب', weight: 20 },
  { id: 'prayer_jafar_tayyar', title: 'نماز جعفر طیار', type: 'golden', category: 'نمازهای مستحب', weight: 20 },
  { id: 'prayer_ghafilah', title: 'نماز غفیله', type: 'binary', category: 'نمازهای مستحب', weight: 1 },
  { id: 'prayer_navafil', title: 'نوافل روزانه', type: 'scalar', category: 'نمازهای مستحب', weight: 1 },
  { id: 'prayer_first_month', title: 'نماز اول ماه قمری', type: 'binary', category: 'نمازهای مستحب', weight: 1 },

  // ادعیه و زیارات
  { id: 'ziyarat_ashura', title: 'زیارت عاشورا', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },
  { id: 'ziyarat_ale_yasin', title: 'زیارت آل یاسین', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },
  { id: 'dua_ahd', title: 'دعای عهد', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },
  { id: 'dua_kumayl', title: 'دعای کمیل', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },
  { id: 'dua_tavassol', title: 'دعای توسل', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },
  { id: 'dua_nodbah', title: 'دعای ندبه', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },
  { id: 'hadith_kisa', title: 'حدیث کساء', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },
  { id: 'dua_samat', title: 'دعای سمات', type: 'binary', category: 'ادعیه و زیارات', weight: 1 },

  // سوره‌های قرآن
  { id: 'surah_fath', title: 'سوره فتح', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  { id: 'surah_dhariyat', title: 'سوره ذاریات', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  { id: 'surah_waqiah', title: 'سوره واقعه', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  { id: 'surah_yasin', title: 'سوره یس', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  { id: 'surah_mulk', title: 'سوره ملک', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  { id: 'surah_rahman', title: 'سوره الرحمن', type: 'binary', category: 'سوره‌های قرآن', weight: 1 },
  { id: 'quran_reading', title: 'تلاوت روزانه قرآن', type: 'scalar', category: 'سوره‌های قرآن', weight: 1 },

  // مراقبت‌های اخلاقی
  { id: 'gaze_control', title: 'کنترل نگاه (نگاه نکردن به نامحرم)', type: 'scalar', category: 'مراقبت‌های اخلاقی', weight: 3 },
  { id: 'truthfulness', title: 'صداقت (نگفتن دروغ)', type: 'scalar', category: 'مراقبت‌های اخلاقی', weight: 3 },
  { id: 'tongue_control', title: 'کنترل زبان (دوری از غیبت، تهمت و دروغ)', type: 'scalar', category: 'مراقبت‌های اخلاقی', weight: 3 },
  { id: 'anger_control', title: 'کنترل خشم و پرخاشگری', type: 'scalar', category: 'مراقبت‌های اخلاقی', weight: 2 },
  { id: 'respect_parents_life', title: 'احترام به والدین و خانواده', type: 'scalar', category: 'مراقبت‌های اخلاقی', weight: 2 },
  { id: 'gossip_avoidance', title: 'دوری از غیبت و شنیدن آن', type: 'scalar', category: 'مراقبت‌های اخلاقی', weight: 3 },

  // اعمال طلایی
  { id: 'golden_father_hand', title: 'بوسیدن دست پدر', type: 'golden', category: 'اعمال طلایی', weight: 20 },
  { id: 'golden_mother_hand', title: 'بوسیدن دست مادر', type: 'golden', category: 'اعمال طلایی', weight: 20 },
  { id: 'golden_parents', title: 'خوشحال کردن پدر و مادر', type: 'golden', category: 'اعمال طلایی', weight: 10 },
  { id: 'golden_salawat', title: '۱۰۰ تا صلوات', type: 'golden', category: 'اعمال طلایی', weight: 10 },
  { id: 'golden_others', title: 'خوشحال کردن دیگران', type: 'golden', category: 'اعمال طلایی', weight: 10 },
  { id: 'golden_sadagah', title: 'پرداخت صدقه', type: 'golden', category: 'اعمال طلایی', weight: 10 },
  { id: 'golden_solving_problem', title: 'حل مشکل برادر دینی', type: 'golden', category: 'اعمال طلایی', weight: 15 },

  // سبک زندگی اسلامی
  { id: 'sleep_time', title: 'خوابیدن سر زمان مناسب', type: 'scalar', category: 'سبک زندگی', weight: 1 },
  { id: 'early_wake', title: 'بیداری قبل از اذان صبح', type: 'binary', category: 'سبک زندگی', weight: 1 },
  { id: 'always_wudu', title: 'دائم‌الوضو بودن', type: 'scalar', category: 'سبک زندگی', weight: 1 },
  { id: 'reading_books', title: 'مطالعه کتب دینی یا علمی', type: 'scalar', category: 'سبک زندگی', weight: 1 },

  // درسی و آموزشی
  { id: 'study_books', title: 'مطالعه کتاب‌های درسی و تخصصی', type: 'scalar', category: 'درسی و آموزشی', weight: 1 },
  { id: 'study_homework', title: 'انجام تکالیف و تمرین‌های درسی', type: 'scalar', category: 'درسی و آموزشی', weight: 1 },
  { id: 'study_class', title: 'حضور فعال و به موقع در کلاس', type: 'binary', category: 'درسی و آموزشی', weight: 1 },
  { id: 'study_language', title: 'تمرین زبان روزانه', type: 'scalar', category: 'درسی و آموزشی', weight: 1 },

  // کاری و مهارتی
  { id: 'work_focus', title: 'تمرکز روی کارهای اصلی و تخصصی', type: 'scalar', category: 'کاری و مهارتی', weight: 1 },
  { id: 'work_skill', title: 'یادگیری و تمرین مهارت جدید', type: 'scalar', category: 'کاری و مهارتی', weight: 1 },
  { id: 'work_organized', title: 'نظم و آراستگی محیط کار', type: 'binary', category: 'کاری و مهارتی', weight: 1 },

  // ورزش و سلامت
  { id: 'health_workout', title: 'ورزش روزانه یا پیاده‌روی', type: 'scalar', category: 'ورزش و سلامت', weight: 1 },
  { id: 'health_water', title: 'نوشیدن آب کافی (۸ لیوان)', type: 'binary', category: 'ورزش و سلامت', weight: 1 },
  { id: 'health_food', title: 'تغذیه سالم و دوری از فست‌فود', type: 'binary', category: 'ورزش و سلامت', weight: 1 },

  // مالی و اقتصادی
  { id: 'finance_track', title: 'ثبت دقیق هزینه‌ها و درآمدها', type: 'binary', category: 'مالی و اقتصادی', weight: 1 },
  { id: 'finance_saving', title: 'پس‌انداز روزانه یا مدیریت مخارج', type: 'binary', category: 'مالی و اقتصادی', weight: 1 },
];

export const WORKOUTS: WorkoutDefinition[] = [
    { id: 'pushups', title: 'شنا سوئدی', unit: 'تعداد' },
    { id: 'situps', title: 'دراز و نشست', unit: 'تعداد' },
    { id: 'squats', title: 'اسکات پا', unit: 'تعداد' },
    { id: 'plank', title: 'پلانک', unit: 'ثانیه' },
    { id: 'running', title: 'دویدن', unit: 'دقیقه' },
];

export const SINS_LIST: SinDefinition[] = [
  // --- گناهان زبان ---
  { id: 'ghibat', title: 'غیبت (پشت سر دیگران حرف زدن)' },
  { id: 'dorough', title: 'دروغ (جدی یا شوخی)' },
  { id: 'tohmat', title: 'تهمت و افترا' },
  { id: 'masakhara', title: 'مسخره کردن و استهزاء دیگران' },
  { id: 'fahashi', title: 'فحاشی، بددهانی و ناسزا' },
  { id: 'sokhan_chini', title: 'سخن‌چینی و دو بهم زنی' },
  { id: 'bad_gholi', title: 'بدقولی و خلف وعده' },
  { id: 'shookhi_nabaja', title: 'شوخی نابجا و زننده با نامحرم یا مؤمن' },
  { id: 'mojadele', title: 'مجادله، لجبازی و جر و بحث بیهوده' },
  { id: 'ayb_juyi', title: 'عیب‌جویی و فاش کردن عیوب دیگران' },
  { id: 'raz_dari', title: 'فاش کردن راز دیگران' },
  { id: 'kaneh_jouyi', title: 'کنجکاوی و تجسس در امور دیگران' },
  { id: 'ghasam_dorough', title: 'قسم دروغ خوردن' },
  { id: 'shahadat_dorough', title: 'شهادت ناحق و دروغ' },
  { id: 'minnat', title: 'منت گذاشتن بعد از کار خیر' },
  { id: 'zakhm_zaban', title: 'زخم زبان و نیش زدن' },
  { id: 'tamalloq', title: 'تملق و چاپلوسی بیجا' },
  { id: 'fash_kardan_sir', title: 'افشای سرّ خود (بازگو کردن گناهان گذشته)' },
  { id: 'shaye_parakani', title: 'شایعه‌پراکنی بدون تحقیق' },
  { id: 'mora_a', title: 'مراء (بحث کردن برای اظهار فضل)' },

  // --- گناهان چشم و گوش و ارتباطات ---
  { id: 'negah_haram', title: 'نگاه به حرام و نامحرم (حضوری یا مجازی)' },
  { id: 'goushe_haram', title: 'گوش دادن به موسیقی حرام و غنا' },
  { id: 'goushe_ghibat', title: 'گوش دادن به غیبت و سکوت در برابر آن' },
  { id: 'negah_tahghir', title: 'نگاه تحقیرآمیز به دیگران' },
  { id: 'khelvat_namahram', title: 'خلوت کردن با نامحرم' },
  { id: 'dast_dadan_namahram', title: 'دست دادن یا تماس بدنی با نامحرم' },
  { id: 'tabarroh', title: 'تبرّج و خودنمایی برای نامحرم' },
  { id: 'shookhi_ba_namahram', title: 'شوخی و خندیدن با نامحرم' },

  // --- رذایل اخلاقی و قلبی ---
  { id: 'khasm', title: 'خشم، عصبانیت بیجا و پرخاشگری' },
  { id: 'hasad', title: 'حسادت (آرزوی زوال نعمت دیگران)' },
  { id: 'takabbor', title: 'تکبر، غرور و خودبرتربینی' },
  { id: 'riya', title: 'ریا و خودنمایی در عبادات یا کار خیر' },
  { id: 'ojb', title: 'عُجب (خودپسندی و راضی بودن از خود)' },
  { id: 'kineh', title: 'کینه و دشمنی با مؤمن' },
  { id: 'sue_zan', title: 'سوء ظن و بدبینی به دیگران' },
  { id: 'qezavat', title: 'قضاوت زود و نابجا' },
  { id: 'hubb_donya', title: 'حب دنیا و دلبستگی افراطی' },
  { id: 'tama', title: 'طمع و چشم‌داشت به مال مردم' },
  { id: 'naomidi', title: 'ناامیدی از رحمت خدا (یأس)' },
  { id: 'nasopasi', title: 'ناسپاسی و کفران نعمت' },
  { id: 'bad_akhlaghi', title: 'بد اخلاقی و تندخویی با خانواده یا مردم' },
  { id: 'shamatat', title: 'شماتت (شادی از گرفتاری دیگران)' },
  { id: 'hars', title: 'حرص (زیاده‌خواهی در مال دنیا)' },
  { id: 'hubb_maqam', title: 'حب مقام و ریاست‌طلبی' },
  { id: 'nifaq', title: 'نفاق و دورویی' },
  { id: 'bad_goman_be_khoda', title: 'بدگمانی به وعده‌های خدا' },

  // --- حق الناس و رفتار اجتماعی ---
  { id: 'azar_waledain', title: 'آزار پدر و مادر و بی‌احترامی (عاق والدین)' },
  { id: 'hagh_nas_mali', title: 'مدیونی مالی (عدم پرداخت بدهی)' },
  { id: 'hagh_nas_aberoo', title: 'ریختن آبروی مومن' },
  { id: 'azar_hamsaye', title: 'آزار همسایه' },
  { id: 'ghat_rahem', title: 'قطع رحم (قهر با خویشاوندان)' },
  { id: 'komak_be_zalem', title: 'کمک به ظالم یا تایید کار او' },
  { id: 'bi_tafavoti', title: 'بی‌تفاوت بودن نسبت به امر به معروف' },
  { id: 'khianat_amanat', title: 'خیانت در امانت (مالی یا غیرمالی)' },
  { id: 'kam_foroushi', title: 'کم‌فروشی و غش در معامله' },
  { id: 'gran_foroushi', title: 'گران‌فروشی بیجا' },
  { id: 'reshve', title: 'رشوه دادن یا رشوه گرفتن' },
  { id: 'beytolmal', title: 'استفاده شخصی از بیت‌المال یا اموال عمومی' },
  { id: 'sad_mabar', title: 'سد معبر و ایجاد مزاحمت برای عابران' },
  { id: 'ghanoon_shekani', title: 'قانون‌گریزی (مثل تخلفات رانندگی)' },
  { id: 'azar_heyvan', title: 'آزار حیوانات' },
  { id: 'tahghir_momen', title: 'تحقیر و کوچک شمردن مؤمن' },

  // --- کاهلی و رفتار فردی ---
  { id: 'israf', title: 'اسراف و زیاده‌روی (در خوراک، پوشاک، آب و...)' },
  { id: 'talaf_vaqt', title: 'تلف کردن وقت در فضای مجازی یا بیهودگی' },
  { id: 'tanbaly_namaz', title: 'سبک شمردن نماز یا تاخیر بدون عذر' },
  { id: 'porkhori', title: 'پرخوری و شکم‌پرستی' },
  { id: 'ghaflet_yad_khoda', title: 'غفلت از یاد خدا' },
  { id: 'ozr_tarashi', title: 'توجیه گناه و بهانه‌تراشی' },
  { id: 'shekan_ahd_khoda', title: 'شکستن عهد با خدا (توبه شکنی)' },
  { id: 'tabzir', title: 'تبذیر (ریخت و پاش بیجا)' },
  { id: 'tark_talom', title: 'ترک یادگیری مسائل شرعی مورد نیاز' },
  { id: 'takhir_ghosl', title: 'تاخیر انداختن غسل واجب' },
  { id: 'nejasat_masjed', title: 'نجس کردن مسجد یا اماکن مقدس' },
  { id: 'cheshm_ham_cheshmi', title: 'چشم و هم‌چشمی و رقابت ناسالم' },
  { id: 'tajammol', title: 'تجمل‌گرایی افراطی' },
];

export const APP_STORAGE_KEY = 'muhasabah_app_data';
export const APP_SETTINGS_KEY = 'muhasabah_app_settings';
export const APP_QADA_KEY = 'muhasabah_qada_data';
export const APP_WORKOUT_PR_KEY = 'muhasabah_workout_pr';
export const APP_WORKOUT_SETTINGS_KEY = 'muhasabah_workout_settings';
export const APP_CHALLENGES_KEY = 'muhasabah_challenges';

export const QADA_ITEMS: { key: keyof QadaCounts; title: string }[] = [
    { key: 'fajr', title: 'نماز صبح' },
    { key: 'dhuhr', title: 'نماز ظهر' },
    { key: 'asr', title: 'نماز عصر' },
    { key: 'maghrib', title: 'نماز مغرب' },
    { key: 'isha', title: 'نماز عشا' },
    { key: 'ayat', title: 'نماز آیات' },
    { key: 'fasting', title: 'روزه' },
];

// Helper to get today's date in YYYY-MM-DD format relative to local time
export const getTodayStr = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- Persian Digit Helpers ---

export const toPersianDigits = (n: number | string | undefined): string => {
    if (n === undefined || n === null) return '';
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, x => farsiDigits[parseInt(x)]);
};

export const toEnglishDigits = (str: string): string => {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /۸/g, /٩/g];
    
    if (typeof str !== 'string') return str;
    
    let result = str;
    for (let i = 0; i < 10; i++) {
        result = result.replace(persianNumbers[i], i.toString()).replace(arabicNumbers[i], i.toString());
    }
    return result;
};

export const toShamsiDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    } catch (e) {
        return dateStr;
    }
};
