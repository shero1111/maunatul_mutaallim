import React, { useState, useRef, useEffect } from 'react';

// Islamic Learning Management System - Maunatul Mutaallim
// COMPLETE IMPLEMENTATION WITH ALL FEATURES

interface User {
  id: string;
  username: string;
  password: string;
  role: 'superuser' | 'leitung' | 'lehrer' | 'student';
  name: string;
  isActive: boolean;
  created_at: string;
  lastPage?: string;
  isOnline?: boolean;
}

interface Student extends User {
  role: 'student';
  status: 'not_available' | 'revising' | 'khatamat';
  status_changed_at: string;
  halaqat_ids: string[];
  favorites: string[];
}

interface Teacher extends User {
  role: 'lehrer';
  halaqat_ids: string[];
  favorites: string[];
}

interface Halaqa {
  id: string;
  internal_number: number;
  name: string;
  type: 'memorizing' | 'explanation' | 'memorizing_intensive' | 'explanation_intensive';
  teacher_id: string;
  student_ids: string[];
  isActive: boolean;
  created_at: string;
}

interface Matn {
  id: string;
  name: string;
  section: string;
  status: 'red' | 'orange' | 'green';
  description: string;
  threshold: number;
  lastChange_date: string;
  memorization_pdf_link: string;
  memorization_audio_link: string;
  explanation_pdf_link: string;
  explanation_audio_link: string;
  created_at: string;
  user_id: string;
  days_since_last_revision: number;
}

interface News {
  id: string;
  title: string;
  description: string;
  images: string[];
  files: string[];
  publication_date: string;
  created_at: string;
  read_by: string[];
}

// Mutuun Template from specifications - CORRECTED PDF LINKS
const mutunTemplate = [
  {
    title: 'المستوى الأول',
    items: [
      { name: 'ثلاثة الأصول وأدلتها', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: 'https://docs.google.com/uc?export=open&id=1MGzggNyA4l5prN6XL2ah7jSByi4spcpV', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: 'https://docs.google.com/uc?export=open&id=1MGzggNyA4l5prN6XL2ah7jSByi4spcpV' },
      { name: 'المفتاح في الفقه', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav' },
      { name: 'معاني الفاتحة وقصار المفصل', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: 'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch3.wav', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: 'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch3.wav' },
      { name: 'الأربعين النووية', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: 'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: 'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav' },
      { name: 'الزيادة الرجبية', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: '' },
      { name: 'الآداب العشرة', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: '' },
      { name: 'الخلاصة الحسناء', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: '' },
      { name: 'الباقيات الصالحات', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: '' }
    ]
  },
  {
    title: 'المستوى الثاني',
    items: [
      { name: 'بهجة الطلب في آداب الطلب', memorization_pdf_link: 'https://drive.google.com/file/d/1THoLVMho76M3UH4xDwe8arKfJxCzDFwo/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/185NOVYEzqXWoKH_BG-2Grwiv1s0A2FyU/view?usp=sharing', explanation_audio_link: '' },
      { name: 'فضل الإسلام', memorization_pdf_link: 'https://drive.google.com/file/d/1THoLVMho76M3UH4xDwe8arKfJxCzDFwo/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/185NOVYEzqXWoKH_BG-2Grwiv1s0A2FyU/view?usp=sharing', explanation_audio_link: '' },
      { name: 'المقدمة الفقهية الصغرى', memorization_pdf_link: 'https://drive.google.com/file/d/1THoLVMho76M3UH4xDwe8arKfJxCzDFwo/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/185NOVYEzqXWoKH_BG-2Grwiv1s0A2FyU/view?usp=sharing', explanation_audio_link: '' },
      { name: 'خلاصة تعظيم العلم', memorization_pdf_link: 'https://drive.google.com/file/d/1THoLVMho76M3UH4xDwe8arKfJxCzDFwo/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/185NOVYEzqXWoKH_BG-2Grwiv1s0A2FyU/view?usp=sharing', explanation_audio_link: '' },
      { name: 'العقيدة الواسطية', memorization_pdf_link: 'https://drive.google.com/file/d/1THoLVMho76M3UH4xDwe8arKfJxCzDFwo/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/185NOVYEzqXWoKH_BG-2Grwiv1s0A2FyU/view?usp=sharing', explanation_audio_link: '' }
    ]
  },
  {
    title: 'المستوى الثالث',
    items: [
      { name: 'كتاب التوحيد', memorization_pdf_link: 'https://drive.google.com/file/d/1NQ22itB7WinIPdMGGkEyHOCh6mhBDTJp/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: '' },
      { name: 'القواعد الأربع', memorization_pdf_link: 'https://drive.google.com/file/d/1NQ22itB7WinIPdMGGkEyHOCh6mhBDTJp/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: '' },
      { name: 'كشف الشبهات', memorization_pdf_link: 'https://drive.google.com/file/d/1NQ22itB7WinIPdMGGkEyHOCh6mhBDTJp/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: '' }
    ]
  },
  {
    title: 'المستوى الرابع',
    items: [
      { name: 'منظومة القواعد الفقهية', memorization_pdf_link: 'https://drive.google.com/file/d/1dRY2HvNfAGY9jfEvhT1qjmz7M1eu31fb/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1L-tzUlNUPL9uuwEgGjKIiDMQ7z8D7yvZ/view?usp=sharing', explanation_audio_link: '' },
      { name: 'المقدمة الآجرومية', memorization_pdf_link: 'https://drive.google.com/file/d/1dRY2HvNfAGY9jfEvhT1qjmz7M1eu31fb/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1L-tzUlNUPL9uuwEgGjKIiDMQ7z8D7yvZ/view?usp=sharing', explanation_audio_link: '' },
      { name: 'خلاصة مقدمة أصول التفسير', memorization_pdf_link: 'https://drive.google.com/file/d/1dRY2HvNfAGY9jfEvhT1qjmz7M1eu31fb/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1L-tzUlNUPL9uuwEgGjKIiDMQ7z8D7yvZ/view?usp=sharing', explanation_audio_link: '' },
      { name: 'نخبة الفكر', memorization_pdf_link: 'https://drive.google.com/file/d/1dRY2HvNfAGY9jfEvhT1qjmz7M1eu31fb/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1L-tzUlNUPL9uuwEgGjKIiDMQ7z8D7yvZ/view?usp=sharing', explanation_audio_link: '' },
      { name: 'الورقات في أصول الفقه', memorization_pdf_link: 'https://drive.google.com/file/d/1dRY2HvNfAGY9jfEvhT1qjmz7M1eu31fb/view?usp=sharing', memorization_audio_link: '', explanation_pdf_link: 'https://drive.google.com/file/d/1L-tzUlNUPL9uuwEgGjKIiDMQ7z8D7yvZ/view?usp=sharing', explanation_audio_link: '' }
    ]
  }
];

const generatePersonalMutuun = (userId: string): Matn[] => {
  const personalMutuun: Matn[] = [];
  let matnId = 1;
  
  mutunTemplate.forEach(section => {
    section.items.forEach(item => {
      personalMutuun.push({
        id: `${userId}_matn_${matnId}`,
        name: item.name,
        section: section.title,
        status: 'red',
        description: '',
        threshold: 7,
        lastChange_date: new Date().toISOString().split('T')[0],
        memorization_pdf_link: item.memorization_pdf_link,
        memorization_audio_link: item.memorization_audio_link,
        explanation_pdf_link: item.explanation_pdf_link,
        explanation_audio_link: item.explanation_audio_link,
        created_at: new Date().toISOString(),
        user_id: userId,
        days_since_last_revision: 0
      });
      matnId++;
    });
  });
  
  return personalMutuun;
};

const demoUsers: (Student | Teacher | User)[] = [
  { id: 'admin', username: 'admin', password: 'admin', role: 'superuser', name: 'المدير العام', isActive: true, created_at: '2024-01-01', lastPage: 'home', isOnline: true },
  { id: 'leiter', username: 'Leiter', password: 'test', role: 'leitung', name: 'قائد الحلقات', isActive: true, created_at: '2024-01-01', lastPage: 'home', isOnline: true },
  { id: 'lehrer', username: 'Lehrer', password: 'test', role: 'lehrer', name: 'الشيخ أحمد', isActive: true, created_at: '2024-01-01', halaqat_ids: ['halaqa1', 'halaqa2'], favorites: ['student1', 'student2'], lastPage: 'home', isOnline: false } as Teacher,
  { id: 'student1', username: 'student1', password: 'test', role: 'student', name: 'محمد الطالب', isActive: true, created_at: '2024-01-01', status: 'revising', status_changed_at: '2024-01-15T10:30:00Z', halaqat_ids: ['halaqa1'], favorites: ['student2'], lastPage: 'home', isOnline: true } as Student,
  { id: 'student2', username: 'student2', password: 'test', role: 'student', name: 'عبدالله القارئ', isActive: true, created_at: '2024-01-01', status: 'khatamat', status_changed_at: '2024-01-14T09:15:00Z', halaqat_ids: ['halaqa1', 'halaqa2'], favorites: [], lastPage: 'home', isOnline: true } as Student
];

const demoHalaqat: Halaqa[] = [
  { id: 'halaqa1', internal_number: 101, name: 'حلقة تحفيظ القرآن الكريم', type: 'memorizing', teacher_id: 'lehrer', student_ids: ['student1', 'student2'], isActive: true, created_at: '2024-01-01' },
  { id: 'halaqa2', internal_number: 102, name: 'حلقة شرح الحديث النبوي', type: 'explanation', teacher_id: 'lehrer', student_ids: ['student2'], isActive: true, created_at: '2024-01-01' }
];

const demoNews: News[] = [
  { id: 'news1', title: 'إعلان مهم حول مواعيد الحلقات', description: 'تم تحديث مواعيد جميع الحلقات لهذا الأسبوع. يرجى مراجعة الجدول الجديد والالتزام بالمواعيد المحددة.', images: [], files: [], publication_date: '2024-01-15', created_at: '2024-01-15', read_by: [] },
  { id: 'news2', title: 'مسابقة الحفظ الشهرية', description: 'ستقام مسابقة الحفظ الشهرية يوم الجمعة القادم بعد صلاة العصر في المسجد النبوي الشريف.', images: [], files: [], publication_date: '2024-01-16', created_at: '2024-01-14', read_by: ['student1'] }
];

type Language = 'ar' | 'en';
type Theme = 'light' | 'dark';

const translations = {
  ar: {
    appName: 'معونة المتعلم', username: 'اسم المستخدم', password: 'كلمة المرور', login: 'دخول', home: 'الرئيسية', mutuun: 'متون', halaqat: 'حلقات', users: 'المستخدمون', news: 'الأخبار', more: 'المزيد',
    not_available: 'غير متاح', revising: 'مراجعة', khatamat: 'ختمات', changeStatus: 'تغيير الحالة', lastUpdate: 'آخر تحديث', totalUsers: 'إجمالي المستخدمين', onlineUsers: 'المستخدمون المتصلون', totalTeachers: 'إجمالي المعلمين', totalHalaqat: 'إجمالي الحلقات', studentsStatus: 'حالة الطلاب',
    logout: 'تسجيل الخروج', language: 'اللغة', theme: 'المظهر', aboutUs: 'من نحن', guide: 'دليل الاستخدام', version: 'الإصدار', materials: 'المواد', memorizationPdf: 'PDF التحفيظ', explanationPdf: 'PDF الشرح', audio: 'الصوت',
    search: 'البحث', edit: 'تعديل', delete: 'حذف', add: 'إضافة', loading: 'جاري التحميل...', play: 'تشغيل', pause: 'إيقاف', allStatuses: 'جميع الحالات', timer: 'مؤقت', stopwatch: 'ساعة إيقاف', start: 'ابدأ', stop: 'توقف', reset: 'إعادة تعيين',
    minutes: 'دقائق', seconds: 'ثواني', days: 'أيام', day: 'يوم', lastFullRevising: 'آخر ختمة كاملة كانت قبل', writeNote: 'اكتب ملاحظة', save: 'حفظ', settings: 'الإعدادات', threshold: 'عدد الأيام قبل إعادة تعيين اللون إلى الأحمر',
    issuesErrors: 'المشاكل والأخطاء', changePassword: 'تغيير كلمة المرور', invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة', close: 'إغلاق', cancel: 'إلغاء', confirm: 'تأكيد'
  },
  en: {
    appName: 'Maunatul Mutaallim', username: 'Username', password: 'Password', login: 'Login', home: 'Home', mutuun: 'Mutun', halaqat: 'Halaqat', users: 'Users', news: 'News', more: 'More',
    not_available: 'Not Available', revising: 'Revising', khatamat: 'Khatamat', changeStatus: 'Change Status', lastUpdate: 'Last Update', totalUsers: 'Total Users', onlineUsers: 'Online Users', totalTeachers: 'Total Teachers', totalHalaqat: 'Total Halaqat', studentsStatus: 'Students Status',
    logout: 'Logout', language: 'Language', theme: 'Theme', aboutUs: 'About Us', guide: 'Guide', version: 'Version', materials: 'Materials', memorizationPdf: 'Memorization PDF', explanationPdf: 'Explanation PDF', audio: 'Audio',
    search: 'Search', edit: 'Edit', delete: 'Delete', add: 'Add', loading: 'Loading...', play: 'Play', pause: 'Pause', allStatuses: 'All Statuses', timer: 'Timer', stopwatch: 'Stopwatch', start: 'Start', stop: 'Stop', reset: 'Reset',
    minutes: 'Minutes', seconds: 'Seconds', days: 'days', day: 'day', lastFullRevising: 'Last full revising was before', writeNote: 'Write a note', save: 'Save', settings: 'Settings', threshold: 'Number of days before color resets to red',
    issuesErrors: 'Issues & Errors', changePassword: 'Change Password', invalidCredentials: 'Invalid username or password', close: 'Close', cancel: 'Cancel', confirm: 'Confirm'
  }
};

const App: React.FC = () => {
  // Core State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Data State
  const [usersData, setUsersData] = useState(demoUsers);
  const [halaqatData] = useState(demoHalaqat);
  const [newsData, setNewsData] = useState(demoNews);
  const [mutunData, setMutunData] = useState<Matn[]>([]);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [audioPlayer, setAudioPlayer] = useState<{url: string, title: string} | null>(null);
  const [editingMatnId, setEditingMatnId] = useState<string | null>(null);
  const [thresholdModalMatn, setThresholdModalMatn] = useState<Matn | null>(null);
  const [tempThreshold, setTempThreshold] = useState<number>(7);
  // PDF Viewer removed - only external opening
  
  // Timer State
  const [timerState, setTimerState] = useState<{
    isOpen: boolean;
    mode: 'timer' | 'stopwatch';
    isRunning: boolean;
    time: number;
    startTime: number | null;
    targetTime: number;
    isMinimized: boolean;
  }>({
    isOpen: false,
    mode: 'timer',
    isRunning: false,
    time: 600,
    startTime: null,
    targetTime: 600,
    isMinimized: false
  });

  const t = translations[language];

  // Theme Colors
  const themeColors = {
    light: { 
      primary: '#2563eb', secondary: '#3b82f6', background: '#ffffff', surface: '#f8fafc', 
      text: '#1f2937', textSecondary: '#6b7280', border: '#e5e7eb', 
      success: '#10b981', warning: '#f59e0b', error: '#ef4444',
      overlay: 'rgba(0,0,0,0.5)'
    },
    dark: { 
      primary: '#3b82f6', secondary: '#60a5fa', background: '#111827', surface: '#1f2937', 
      text: '#f9fafb', textSecondary: '#d1d5db', border: '#374151', 
      success: '#10b981', warning: '#f59e0b', error: '#ef4444',
      overlay: 'rgba(0,0,0,0.7)'
    }
  };

  const colors = themeColors[theme];

  // Initialize personal Mutuun on first login
  useEffect(() => {
    if (currentUser && mutunData.filter(m => m.user_id === currentUser.id).length === 0) {
      const personalMutuun = generatePersonalMutuun(currentUser.id);
      setMutunData(prev => [...prev, ...personalMutuun]);
      localStorage.setItem('mutunData', JSON.stringify([...JSON.parse(localStorage.getItem('mutunData') || '[]'), ...personalMutuun]));
    }
  }, [currentUser, mutunData]);

  // Load data from localStorage + AUTO LOGIN
  useEffect(() => {
    const savedMutunData = localStorage.getItem('mutunData');
    const savedUsersData = localStorage.getItem('usersData');
    const savedNewsData = localStorage.getItem('newsData');
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedCurrentUser = localStorage.getItem('currentUser');
    const savedCurrentPage = localStorage.getItem('currentPage');
    
    if (savedMutunData) setMutunData(JSON.parse(savedMutunData));
    if (savedUsersData) setUsersData(JSON.parse(savedUsersData));
    if (savedNewsData) setNewsData(JSON.parse(savedNewsData));
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) setTheme(savedTheme);
    
    // AUTO LOGIN PERSISTENCE
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentPage(savedCurrentPage || 'home');
    }
  }, []);

  // Save language, theme, user and page to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
    localStorage.setItem('theme', theme);
  }, [language, theme]);

  // Save current user and page
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('currentPage', currentPage);
    }
  }, [currentUser, currentPage]);

  // Auto-check Mutuun thresholds
  useEffect(() => {
    if (currentPage === 'mutuun' && currentUser) {
      const today = new Date();
      const userMutun = mutunData.filter(m => m.user_id === currentUser.id);
      
      const updatedMutun = userMutun.map(matn => {
        const lastChangeDate = new Date(matn.lastChange_date);
        const daysDiff = Math.floor((today.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (matn.status === 'green' && daysDiff > matn.threshold) {
          return { ...matn, status: 'red' as const, lastChange_date: today.toISOString().split('T')[0], days_since_last_revision: daysDiff };
        }
        return { ...matn, days_since_last_revision: daysDiff };
      });
      
      setMutunData(prev => {
        const otherUsersMutun = prev.filter(m => m.user_id !== currentUser.id);
        const newData = [...otherUsersMutun, ...updatedMutun];
        localStorage.setItem('mutunData', JSON.stringify(newData));
        return newData;
      });
    }
  }, [currentPage, currentUser, mutunData]);

  // Mark news as read
  useEffect(() => {
    if (currentPage === 'news' && currentUser) {
      setNewsData(prev => {
        const updated = prev.map(news => ({ ...news, read_by: news.read_by.includes(currentUser.id) ? news.read_by : [...news.read_by, currentUser.id] }));
        localStorage.setItem('newsData', JSON.stringify(updated));
        return updated;
      });
    }
  }, [currentPage, currentUser]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerState.isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        
        if (timerState.mode === 'timer') {
          const elapsed = Math.floor((now - (timerState.startTime || now)) / 1000);
          const remaining = Math.max(0, timerState.targetTime - elapsed);
          
          if (remaining === 0) {
            const audio = new Audio('https://drive.google.com/uc?export=download&id=19RYrM-zU0KQj8fvRz08pm8UhHliOh0Ux');
            audio.play().catch(console.error);
            setTimerState(prev => ({ ...prev, isRunning: false, time: 0 }));
          } else {
            setTimerState(prev => ({ ...prev, time: remaining }));
          }
        } else {
          const elapsed = Math.floor((now - (timerState.startTime || now)) / 1000);
          setTimerState(prev => ({ ...prev, time: elapsed }));
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.startTime, timerState.mode, timerState.targetTime]);

  // Helper Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_available': return colors.error;
      case 'revising': return colors.warning;
      case 'khatamat': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getMatnColor = (status: string) => {
    switch (status) {
      case 'red': return colors.error;
      case 'orange': return colors.warning;
      case 'green': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const formatTime = (dateString: string) => new Date(dateString).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  const formatTimerDisplay = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  const changeMatnStatus = (matnId: string) => {
    setMutunData(prev => {
      const updated = prev.map(matn => {
        if (matn.id === matnId && matn.user_id === currentUser?.id) {
          let newStatus: 'red' | 'orange' | 'green' = 'red';
          if (matn.status === 'red') newStatus = 'orange';
          else if (matn.status === 'orange') newStatus = 'green';
          else if (matn.status === 'green') newStatus = 'red';
          
          return { ...matn, status: newStatus, lastChange_date: new Date().toISOString().split('T')[0], days_since_last_revision: newStatus === 'green' ? 0 : matn.days_since_last_revision };
        }
        return matn;
      });
      
      localStorage.setItem('mutunData', JSON.stringify(updated));
      return updated;
    });
  };

  const changeStudentStatus = (newStatus: 'not_available' | 'revising' | 'khatamat') => {
    if (currentUser && currentUser.role === 'student') {
      const updatedUser = { ...currentUser as Student, status: newStatus, status_changed_at: new Date().toISOString() };
      setCurrentUser(updatedUser);
      
      setUsersData(prev => {
        const updated = prev.map(user => user.id === currentUser.id ? updatedUser : user);
        localStorage.setItem('usersData', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const updateMatnDescription = (matnId: string, description: string) => {
    setMutunData(prev => {
      const updated = prev.map(matn => matn.id === matnId && matn.user_id === currentUser?.id ? { ...matn, description } : matn);
      localStorage.setItem('mutunData', JSON.stringify(updated));
      return updated;
    });
  };

  const updateMatnThreshold = (matnId: string, threshold: number) => {
    setMutunData(prev => {
      const updated = prev.map(matn => matn.id === matnId && matn.user_id === currentUser?.id ? { ...matn, threshold } : matn);
      localStorage.setItem('mutunData', JSON.stringify(updated));
      return updated;
    });
  };

  const openThresholdModal = (matn: Matn) => {
    setThresholdModalMatn(matn);
    setTempThreshold(matn.threshold);
  };

  const closeThresholdModal = () => {
    setThresholdModalMatn(null);
    setTempThreshold(7);
  };

  const saveThreshold = () => {
    if (thresholdModalMatn) {
      updateMatnThreshold(thresholdModalMatn.id, tempThreshold);
      closeThresholdModal();
    }
  };

  // Bottom Sheet Component (Fixed scope)
  const BottomSheet: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    
    // Use current theme colors and language
    const currentColors = themeColors[theme];
    const currentLang = language;

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: currentColors.overlay }} onClick={onClose} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: currentColors.surface, borderRadius: '20px 20px 0 0', maxHeight: '80vh', overflowY: 'auto', padding: '20px', direction: currentLang === 'ar' ? 'rtl' : 'ltr', boxShadow: '0 -10px 30px rgba(0,0,0,0.2)' }}>
          <div style={{ width: '40px', height: '4px', background: currentColors.border, borderRadius: '2px', margin: '0 auto 20px' }} />
          {children}
        </div>
      </div>
    );
  };

  // Threshold Modal Component
  const ThresholdModal: React.FC = () => {
    if (!thresholdModalMatn) return null;
    
    // Use current theme colors and language
    const currentColors = themeColors[theme];
    const currentLang = language;
    const currentT = translations[currentLang];

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: currentColors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1003, padding: '20px' }}>
        <div style={{ background: currentColors.surface, borderRadius: '15px', padding: '25px', maxWidth: '350px', width: '100%', direction: currentLang === 'ar' ? 'rtl' : 'ltr' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: currentColors.text, fontSize: '1.2rem' }}>⚙️ إعداد عتبة الإعادة</h3>
            <button onClick={closeThresholdModal} style={{ background: 'none', border: 'none', fontSize: '20px', color: currentColors.textSecondary, cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: currentColors.text, fontSize: '1rem', marginBottom: '10px', fontWeight: 'bold' }}>
              {thresholdModalMatn.name}
            </p>
            <p style={{ color: currentColors.textSecondary, fontSize: '0.9rem', marginBottom: '15px' }}>
              عدد الأيام قبل إعادة تعيين اللون إلى الأحمر
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
              <button onClick={() => setTempThreshold(Math.max(1, tempThreshold - 1))} style={{ 
                background: currentColors.primary, 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '10px 15px', 
                cursor: 'pointer', 
                fontSize: '16px',
                fontWeight: 'bold'
              }}>-</button>
              
              <div style={{ 
                background: currentColors.background, 
                border: `2px solid ${currentColors.border}`, 
                borderRadius: '8px', 
                padding: '10px 20px', 
                minWidth: '60px', 
                textAlign: 'center' 
              }}>
                <span style={{ color: currentColors.text, fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {tempThreshold}
                </span>
                <div style={{ color: currentColors.textSecondary, fontSize: '0.8rem' }}>أيام</div>
              </div>
              
              <button onClick={() => setTempThreshold(Math.min(365, tempThreshold + 1))} style={{ 
                background: currentColors.primary, 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '10px 15px', 
                cursor: 'pointer', 
                fontSize: '16px',
                fontWeight: 'bold'
              }}>+</button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
              {[3, 7, 14, 30].map(days => (
                <button key={days} onClick={() => setTempThreshold(days)} style={{ 
                  padding: '6px 12px', 
                  background: tempThreshold === days ? currentColors.primary : currentColors.border, 
                  color: tempThreshold === days ? 'white' : currentColors.text, 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '12px' 
                }}>
                  {days}د
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={saveThreshold} style={{ 
              flex: 1, 
              padding: '12px', 
              background: currentColors.success, 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 'bold' 
            }}>
              حفظ
            </button>
            <button onClick={closeThresholdModal} style={{ 
              flex: 1, 
              padding: '12px', 
              background: currentColors.border, 
              color: currentColors.text, 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}>
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Audio Player Component (Fixed scope)
  const AudioPlayer: React.FC<{ audioUrl: string; title: string; onClose: () => void }> = ({ audioUrl, title, onClose }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    // Use current theme colors and language
    const currentColors = themeColors[theme];
    const currentLang = language;
    const currentT = translations[currentLang];

    const togglePlay = () => {
      if (audioRef.current) {
        if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
        setIsPlaying(!isPlaying);
      }
    };

    const formatAudioTime = (time: number) => `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}`;
    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
      <div style={{ position: 'fixed', bottom: audioPlayer ? 0 : -200, left: 0, right: 0, background: `linear-gradient(135deg, ${currentColors.primary} 0%, ${currentColors.secondary} 100%)`, color: 'white', padding: '20px', borderRadius: '15px 15px 0 0', zIndex: 1001, boxShadow: '0 -10px 30px rgba(0,0,0,0.2)', direction: currentLang === 'ar' ? 'rtl' : 'ltr', transition: 'bottom 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🎧 {title}</h4>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>

        <audio 
          ref={audioRef} 
          src={audioUrl} 
          crossOrigin="anonymous"
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)} 
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} 
          onCanPlay={() => setIsLoading(false)} 
          onEnded={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('Audio Error:', e);
            setIsLoading(false);
          }}
          onLoadStart={() => console.log('Loading audio:', audioUrl)}
        />

        <div style={{ background: 'rgba(255,255,255,0.2)', height: '6px', borderRadius: '3px', marginBottom: '15px', cursor: 'pointer' }} onClick={(e) => {
          if (audioRef.current && duration) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * duration;
            audioRef.current.currentTime = newTime;
          }
        }}>
          <div style={{ background: 'white', height: '100%', width: `${progress}%`, borderRadius: '3px', transition: 'width 0.1s' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={togglePlay} disabled={isLoading} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '25px', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '16px', opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
            {isLoading ? `⏳ ${currentT.loading}` : isPlaying ? `⏸️ ${currentT.pause}` : `▶️ ${currentT.play}`}
          </button>
          <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>{formatAudioTime(currentTime)} / {formatAudioTime(duration)}</span>
        </div>
      </div>
    );
  };

  // Search Component (Fixed scope)
  const SearchBar: React.FC<{ onSearch: (query: string) => void; placeholder?: string; }> = ({ onSearch, placeholder = t.search }) => {
    const [query, setQuery] = useState('');
    
    // Use current theme colors and language
    const currentColors = themeColors[theme];
    const currentLang = language;

    const handleSearch = (value: string) => {
      setQuery(value);
      onSearch(value);
    };

    return (
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <input type="text" value={query} onChange={(e) => handleSearch(e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: currentLang === 'ar' ? '12px 80px 12px 40px' : '12px 80px 12px 40px', border: `2px solid ${currentColors.border}`, borderRadius: '25px', fontSize: '16px', outline: 'none', backgroundColor: currentColors.surface, color: currentColors.text, direction: currentLang === 'ar' ? 'rtl' : 'ltr', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = currentColors.primary} onBlur={(e) => e.target.style.borderColor = currentColors.border} />
        <span style={{ position: 'absolute', [currentLang === 'ar' ? 'right' : 'left']: '15px', top: '50%', transform: 'translateY(-50%)', color: currentColors.primary, fontSize: '18px' }}>🔍</span>
        {query && (
          <button onClick={() => handleSearch('')} style={{ position: 'absolute', [currentLang === 'ar' ? 'left' : 'right']: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: currentColors.textSecondary, cursor: 'pointer', fontSize: '18px', padding: '2px' }}>✕</button>
        )}
      </div>
    );
  };

  // Timer Modal Component - iPhone Style Redesign
  const TimerModal: React.FC = () => {
    if (!timerState.isOpen) return null;
    
    // Use current theme colors and language
    const currentColors = themeColors[theme];
    const currentLang = language;
    const currentT = translations[currentLang];

    const isRunning = timerState.isRunning;
    const canAdjust = !isRunning;

    const startTimer = () => {
      setTimerState(prev => ({ ...prev, isRunning: true, startTime: Date.now() }));
    };

    const stopTimer = () => {
      setTimerState(prev => ({ ...prev, isRunning: false, startTime: null }));
    };

    const resetTimer = () => {
      setTimerState(prev => ({ ...prev, isRunning: false, startTime: null, time: prev.mode === 'timer' ? prev.targetTime : 0 }));
    };

    const setTimerMinutes = (minutes: number) => {
      const seconds = minutes * 60;
      setTimerState(prev => ({ ...prev, targetTime: seconds, time: seconds }));
    };

    const adjustTime = (type: 'minutes' | 'seconds', direction: 'up' | 'down') => {
      const minutes = Math.floor(timerState.time / 60);
      const seconds = timerState.time % 60;
      
      let newMinutes = minutes;
      let newSeconds = seconds;
      
      if (type === 'minutes') {
        newMinutes = direction === 'up' ? Math.min(99, minutes + 1) : Math.max(0, minutes - 1);
      } else {
        newSeconds = direction === 'up' ? Math.min(59, seconds + 1) : Math.max(0, seconds - 1);
      }
      
      const newTime = newMinutes * 60 + newSeconds;
      setTimerState(prev => ({ ...prev, time: newTime, targetTime: newTime }));
    };

    const pauseTimer = () => {
      setTimerState(prev => ({ ...prev, isRunning: false }));
    };

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: currentColors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1002, padding: '20px' }}>
        <div style={{ 
          background: currentColors.surface, 
          borderRadius: '28px', 
          padding: '40px 30px', 
          maxWidth: '380px', 
          width: '100%', 
          direction: currentLang === 'ar' ? 'rtl' : 'ltr',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${currentColors.border}20`
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: 0, color: currentColors.text, fontSize: '1.4rem', fontWeight: '600' }}>
              {timerState.mode === 'timer' ? '⏰ المؤقت' : '⏱️ ساعة الإيقاف'}
            </h2>
            <button onClick={() => setTimerState(prev => ({ ...prev, isOpen: false }))} style={{ 
              background: currentColors.background, 
              border: 'none', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px', 
              fontSize: '18px', 
              color: currentColors.textSecondary, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}>✕</button>
          </div>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', background: currentColors.background, borderRadius: '16px', padding: '4px' }}>
            <button onClick={() => setTimerState(prev => ({ ...prev, mode: 'timer', time: prev.targetTime }))} style={{ 
              flex: 1, 
              padding: '12px', 
              background: timerState.mode === 'timer' ? `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})` : 'transparent', 
              color: timerState.mode === 'timer' ? 'white' : currentColors.text, 
              border: 'none', 
              borderRadius: '12px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}>⏰ {currentT.timer}</button>
            <button onClick={() => setTimerState(prev => ({ ...prev, mode: 'stopwatch', time: 0 }))} style={{ 
              flex: 1, 
              padding: '12px', 
              background: timerState.mode === 'stopwatch' ? `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})` : 'transparent', 
              color: timerState.mode === 'stopwatch' ? 'white' : currentColors.text, 
              border: 'none', 
              borderRadius: '12px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}>⏱️ {currentT.stopwatch}</button>
          </div>

          {/* Main Time Display Container */}
          <div style={{ 
            background: `linear-gradient(135deg, ${currentColors.primary}08, ${currentColors.secondary}08)`, 
            borderRadius: '24px', 
            padding: '30px 20px', 
            marginBottom: '25px',
            border: `1px solid ${currentColors.border}30`,
            textAlign: 'center'
          }}>
                         {/* Time Adjustment Layout - Minutes & Seconds */}
             {canAdjust && timerState.mode === 'timer' ? (
               <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', alignItems: 'center' }}>
                 {/* Minutes Section */}
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                   <button onClick={() => adjustTime('minutes', 'up')} style={{ 
                     background: `${currentColors.primary}20`, 
                     color: currentColors.primary, 
                     border: `1px solid ${currentColors.primary}40`, 
                     borderRadius: '50%', 
                     width: '44px', 
                     height: '44px', 
                     cursor: 'pointer', 
                     fontSize: '18px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     transition: 'all 0.2s',
                     fontWeight: 'bold'
                   }}>▲</button>
                   
                   {/* Minutes Display */}
                   <div style={{ 
                     background: currentColors.background, 
                     border: `2px solid ${currentColors.primary}40`, 
                     borderRadius: '16px', 
                     padding: '16px 20px', 
                     minWidth: '80px',
                     textAlign: 'center'
                   }}>
                     <div style={{ 
                       color: currentColors.text, 
                       fontSize: '2.5rem', 
                       fontWeight: '300', 
                       fontFamily: 'system-ui, -apple-system',
                       lineHeight: '1'
                     }}>
                       {Math.floor(timerState.time / 60).toString().padStart(2, '0')}
                     </div>
                     <div style={{ color: currentColors.textSecondary, fontSize: '0.8rem', fontWeight: '500', marginTop: '4px' }}>دقائق</div>
                   </div>
                   
                   <button onClick={() => adjustTime('minutes', 'down')} style={{ 
                     background: `${currentColors.primary}20`, 
                     color: currentColors.primary, 
                     border: `1px solid ${currentColors.primary}40`, 
                     borderRadius: '50%', 
                     width: '44px', 
                     height: '44px', 
                     cursor: 'pointer', 
                     fontSize: '18px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     transition: 'all 0.2s',
                     fontWeight: 'bold'
                   }}>▼</button>
                 </div>

                 {/* Colon Separator */}
                 <div style={{ color: currentColors.textSecondary, fontSize: '2rem', fontWeight: '300', alignSelf: 'center', marginTop: '-20px' }}>:</div>

                 {/* Seconds Section */}
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                   <button onClick={() => adjustTime('seconds', 'up')} style={{ 
                     background: `${currentColors.secondary}20`, 
                     color: currentColors.secondary, 
                     border: `1px solid ${currentColors.secondary}40`, 
                     borderRadius: '50%', 
                     width: '44px', 
                     height: '44px', 
                     cursor: 'pointer', 
                     fontSize: '18px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     transition: 'all 0.2s',
                     fontWeight: 'bold'
                   }}>▲</button>
                   
                   {/* Seconds Display */}
                   <div style={{ 
                     background: currentColors.background, 
                     border: `2px solid ${currentColors.secondary}40`, 
                     borderRadius: '16px', 
                     padding: '16px 20px', 
                     minWidth: '80px',
                     textAlign: 'center'
                   }}>
                     <div style={{ 
                       color: currentColors.text, 
                       fontSize: '2.5rem', 
                       fontWeight: '300', 
                       fontFamily: 'system-ui, -apple-system',
                       lineHeight: '1'
                     }}>
                       {(timerState.time % 60).toString().padStart(2, '0')}
                     </div>
                     <div style={{ color: currentColors.textSecondary, fontSize: '0.8rem', fontWeight: '500', marginTop: '4px' }}>ثواني</div>
                   </div>
                   
                   <button onClick={() => adjustTime('seconds', 'down')} style={{ 
                     background: `${currentColors.secondary}20`, 
                     color: currentColors.secondary, 
                     border: `1px solid ${currentColors.secondary}40`, 
                     borderRadius: '50%', 
                     width: '44px', 
                     height: '44px', 
                     cursor: 'pointer', 
                     fontSize: '18px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     transition: 'all 0.2s',
                     fontWeight: 'bold'
                   }}>▼</button>
                 </div>
               </div>
             ) : (
               /* Main Time Display - When Running or Stopwatch */
               <div style={{ 
                 fontSize: isRunning ? '4.5rem' : '4rem', 
                 fontWeight: '200', 
                 color: isRunning ? currentColors.primary : currentColors.text,
                 fontFamily: 'system-ui, -apple-system, SF Pro Display',
                 letterSpacing: '3px',
                 transition: 'all 0.4s ease',
                 textShadow: isRunning ? `0 0 20px ${currentColors.primary}40` : 'none',
                 textAlign: 'center'
               }}>
                 {formatTimerDisplay(timerState.time)}
               </div>
             )}
          </div>

          {/* Quick Select Buttons (only when not running and timer mode) */}
          {canAdjust && timerState.mode === 'timer' && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[1, 5, 10, 15, 25, 30, 45, 60].map(minutes => (
                <button key={minutes} onClick={() => setTimerMinutes(minutes)} style={{ 
                  padding: '8px 14px', 
                  background: currentColors.background, 
                  color: currentColors.text, 
                  border: `1px solid ${currentColors.border}`, 
                  borderRadius: '20px', 
                  cursor: 'pointer', 
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}>
                  {minutes}د
                </button>
              ))}
            </div>
          )}

                     {/* Control Buttons */}
           <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
             {/* Start/Pause Button */}
             <button onClick={timerState.isRunning ? pauseTimer : startTimer} style={{ 
               padding: '18px 32px', 
               background: timerState.isRunning ? 
                 `linear-gradient(135deg, ${currentColors.secondary}, #ffa726)` : 
                 `linear-gradient(135deg, ${currentColors.success}, #2ed573)`, 
               color: 'white', 
               border: 'none', 
               borderRadius: '28px', 
               cursor: 'pointer', 
               fontSize: '16px', 
               fontWeight: '600',
               minWidth: '130px',
               boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
               transition: 'all 0.3s',
               transform: isRunning ? 'scale(1.02)' : 'scale(1)',
               textShadow: '0 1px 2px rgba(0,0,0,0.3)'
             }}>
               {timerState.isRunning ? `⏸️ إيقاف مؤقت` : `▶️ ${currentT.start}`}
             </button>
             
             {/* Stop Button (only when paused or running) */}
             {(timerState.isRunning || (!timerState.isRunning && timerState.time !== timerState.targetTime)) && (
               <button onClick={stopTimer} style={{ 
                 padding: '18px 32px', 
                 background: `linear-gradient(135deg, ${currentColors.error}, #ff4757)`, 
                 color: 'white', 
                 border: 'none', 
                 borderRadius: '28px', 
                 cursor: 'pointer', 
                 fontSize: '16px',
                 fontWeight: '600',
                 minWidth: '130px',
                 boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                 transition: 'all 0.2s',
                 textShadow: '0 1px 2px rgba(0,0,0,0.3)'
               }}>🛑 {currentT.stop}</button>
             )}
             
             {/* Reset Button */}
             <button onClick={resetTimer} style={{ 
               padding: '18px 32px', 
               background: currentColors.background, 
               color: currentColors.text, 
               border: `1px solid ${currentColors.border}`, 
               borderRadius: '28px', 
               cursor: 'pointer', 
               fontSize: '16px',
               fontWeight: '500',
               minWidth: '130px',
               transition: 'all 0.2s'
             }}>🔄 {currentT.reset}</button>
           </div>
        </div>
      </div>
    );
  };

  // Login Component (Auto-fill for testing)
  const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('student1');
    const [password, setPassword] = useState('test');
    const [error, setError] = useState('');

    const handleLogin = () => {
      const user = usersData.find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setCurrentPage(user.lastPage && user.lastPage !== 'more' ? user.lastPage : 'home');
        setError('');
      } else {
        setError(t.invalidCredentials);
      }
    };

    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
        <div style={{ background: colors.background, borderRadius: '20px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: colors.text, fontSize: '1.8rem', marginBottom: '10px' }}>{t.appName}</h1>
            <p style={{ color: colors.textSecondary, fontSize: '14px' }}>نظام إدارة التعلم الإسلامي</p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: colors.text }}>{t.username}</label>
            <div style={{ position: 'relative' }}>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px', fontSize: '16px', backgroundColor: colors.surface, color: colors.text, direction: 'ltr', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} />
              {username && (
                <button onClick={() => setUsername('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontSize: '18px', padding: '2px' }}>✕</button>
              )}
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: colors.text }}>{t.password}</label>
            <div style={{ position: 'relative' }}>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px', fontSize: '16px', backgroundColor: colors.surface, color: colors.text, direction: 'ltr', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
              {password && (
                <button onClick={() => setPassword('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontSize: '18px', padding: '2px' }}>✕</button>
              )}
            </div>
          </div>
          
          {error && (
            <div style={{ color: colors.error, marginBottom: '20px', textAlign: 'center', padding: '10px', backgroundColor: colors.surface, borderRadius: '8px', border: `1px solid ${colors.error}` }}>{error}</div>
          )}
          
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s', marginBottom: '20px' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>{t.login}</button>
          
          <div style={{ textAlign: 'center', fontSize: '12px', color: colors.textSecondary, padding: '15px', background: colors.surface, borderRadius: '8px' }}>
            <p style={{ margin: '0 0 10px' }}>حسابات التجربة:</p>
            <div style={{ display: 'grid', gap: '5px', fontSize: '11px' }}>
              <span>👑 admin/admin (مدير عام)</span>
              <span>🏛️ Leiter/test (قائد)</span>
              <span>👨‍🏫 Lehrer/test (معلم)</span>
              <span>👨‍🎓 student1/test (طالب)</span>
              <span>👨‍🎓 student2/test (طالب)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Home Page Component - Role-based views
  const HomePage: React.FC = () => {
    const students = usersData.filter(u => u.role === 'student') as Student[];
    const teachers = usersData.filter(u => u.role === 'lehrer');
    const onlineUsers = usersData.filter(u => u.isOnline);
    
    const statusCounts = {
      not_available: students.filter(s => s.status === 'not_available').length,
      revising: students.filter(s => s.status === 'revising').length,
      khatamat: students.filter(s => s.status === 'khatamat').length
    };

    // STUDENT VIEW - Show Halaqa members
    if (currentUser?.role === 'student') {
      const student = currentUser as Student;
      const myHalaqat = halaqatData.filter(h => student.halaqat_ids.includes(h.id));
      
      return (
        <div style={{ padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: colors.primary, fontSize: '2rem', marginBottom: '10px' }}>مرحباً، {currentUser?.name}</h1>
            <p style={{ color: colors.textSecondary, fontSize: '1rem' }}>حلقاتي ومتابعة الطلاب</p>
          </div>

          {/* My Status */}
          <div style={{ background: colors.surface, borderRadius: '15px', padding: '20px', marginBottom: '20px', border: `1px solid ${colors.border}` }}>
            <h3 style={{ color: colors.text, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>📊</span>
              حالتي الحالية
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: getStatusColor(student.status) }} />
              <span style={{ color: colors.text, fontSize: '1.1rem', fontWeight: 'bold' }}>{t[student.status]}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {(['not_available', 'revising', 'khatamat'] as const).map(status => (
                <button key={status} onClick={() => changeStudentStatus(status)} style={{ 
                  padding: '10px 15px', 
                  background: student.status === status ? getStatusColor(status) : colors.border, 
                  color: student.status === status ? 'white' : colors.text, 
                  border: 'none', 
                  borderRadius: '10px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}>
                  {t[status]}
                </button>
              ))}
            </div>
            <p style={{ color: colors.textSecondary, fontSize: '0.9rem', marginTop: '10px' }}>
              {t.lastUpdate}: {formatTime(student.status_changed_at)}
            </p>
          </div>

          {/* My Halaqat */}
          {myHalaqat.map(halaqa => {
            const halaqaStudents = students.filter(s => s.halaqat_ids.includes(halaqa.id));
            const teacher = teachers.find(t => t.id === halaqa.teacher_id);
            
            return (
              <div key={halaqa.id} style={{ background: colors.surface, borderRadius: '15px', padding: '20px', marginBottom: '20px', border: `1px solid ${colors.border}` }}>
                <h3 style={{ color: colors.primary, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔵</span>
                  {halaqa.name}
                </h3>
                
                <div style={{ marginBottom: '15px', padding: '10px', background: colors.background, borderRadius: '8px' }}>
                  <p style={{ color: colors.text, margin: '5px 0' }}>
                    <strong>المعلم:</strong> {teacher?.name || 'غير محدد'}
                  </p>
                  <p style={{ color: colors.text, margin: '5px 0' }}>
                    <strong>النوع:</strong> {halaqa.type === 'memorizing' ? 'تحفيظ' : halaqa.type === 'explanation' ? 'شرح' : halaqa.type === 'memorizing_intensive' ? 'تحفيظ مكثف' : 'شرح مكثف'}
                  </p>
                  <p style={{ color: colors.text, margin: '5px 0' }}>
                    <strong>عدد الطلاب:</strong> {halaqaStudents.length}
                  </p>
                </div>

                <h4 style={{ color: colors.text, marginBottom: '10px' }}>طلاب الحلقة:</h4>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {halaqaStudents.map(halaqaStudent => (
                    <div key={halaqaStudent.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '12px', 
                      background: colors.background, 
                      borderRadius: '8px',
                      border: halaqaStudent.id === currentUser.id ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getStatusColor(halaqaStudent.status) }} />
                        <span style={{ color: colors.text, fontWeight: halaqaStudent.id === currentUser.id ? 'bold' : 'normal' }}>
                          {halaqaStudent.name} {halaqaStudent.id === currentUser.id ? '(أنت)' : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: getStatusColor(halaqaStudent.status), fontSize: '0.9rem', fontWeight: 'bold' }}>
                          {t[halaqaStudent.status]}
                        </span>
                        {halaqaStudent.isOnline && (
                          <span style={{ color: colors.success, fontSize: '0.8rem' }}>🟢 متصل</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {myHalaqat.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔵</div>
              <p>لم يتم تسجيلك في أي حلقة بعد</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: colors.primary, fontSize: '2rem', marginBottom: '10px' }}>مرحباً، {currentUser?.name}</h1>
          <p style={{ color: colors.textSecondary, fontSize: '1rem' }}>لوحة التحكم الرئيسية</p>
        </div>

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div style={{ background: colors.surface, padding: '20px', borderRadius: '15px', textAlign: 'center', border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👥</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary }}>{usersData.length}</div>
            <div style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>{t.totalUsers}</div>
          </div>
          
          <div style={{ background: colors.surface, padding: '20px', borderRadius: '15px', textAlign: 'center', border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🟢</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.success }}>{onlineUsers.length}</div>
            <div style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>{t.onlineUsers}</div>
          </div>
          
          <div style={{ background: colors.surface, padding: '20px', borderRadius: '15px', textAlign: 'center', border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👨‍🏫</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.secondary }}>{teachers.length}</div>
            <div style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>{t.totalTeachers}</div>
          </div>
          
          <div style={{ background: colors.surface, padding: '20px', borderRadius: '15px', textAlign: 'center', border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🔵</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary }}>{halaqatData.length}</div>
            <div style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>{t.totalHalaqat}</div>
          </div>
        </div>

        {/* Student Status Change removed - now in Student Homepage */}

        {/* Students Status Overview */}
        <div style={{ background: colors.surface, borderRadius: '15px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <h3 style={{ color: colors.text, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📈</span>
            {t.studentsStatus}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center', padding: '15px', background: colors.background, borderRadius: '10px', border: `2px solid ${colors.error}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔴</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colors.error }}>{statusCounts.not_available}</div>
              <div style={{ color: colors.textSecondary, fontSize: '0.8rem' }}>{t.not_available}</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', background: colors.background, borderRadius: '10px', border: `2px solid ${colors.warning}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🟡</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colors.warning }}>{statusCounts.revising}</div>
              <div style={{ color: colors.textSecondary, fontSize: '0.8rem' }}>{t.revising}</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', background: colors.background, borderRadius: '10px', border: `2px solid ${colors.success}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🟢</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colors.success }}>{statusCounts.khatamat}</div>
              <div style={{ color: colors.textSecondary, fontSize: '0.8rem' }}>{t.khatamat}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mutuun Page Component - Enhanced with Level Filters
  const MutunPage: React.FC = () => {
    const userMutun = mutunData.filter(m => m.user_id === currentUser?.id);
    
    const filteredMutun = userMutun.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.section.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchesLevel = levelFilter === 'all' || m.section === levelFilter;
      return matchesSearch && matchesStatus && matchesLevel;
    });

    const groupedMutun = filteredMutun.reduce((acc, matn) => {
      if (!acc[matn.section]) acc[matn.section] = [];
      acc[matn.section].push(matn);
      return acc;
    }, {} as Record<string, Matn[]>);

    const allLevels = ['المستوى الأول', 'المستوى الثاني', 'المستوى الثالث', 'المستوى الرابع'];
    
    const toggleSection = (section: string) => {
      setCollapsedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ color: colors.primary, fontSize: '1.8rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📚</span>
            {t.mutuun}
          </h1>
          
          {/* Search Bar - Compact */}
          <div style={{ marginBottom: '15px' }}>
            <SearchBar onSearch={setSearchQuery} placeholder="البحث في المتون..." />
          </div>
          
          {/* Level Filter Buttons */}
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ color: colors.text, fontSize: '1rem', marginBottom: '10px' }}>المستويات:</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => setLevelFilter('all')} style={{ 
                padding: '8px 12px', 
                background: levelFilter === 'all' ? colors.primary : colors.border, 
                color: levelFilter === 'all' ? 'white' : colors.text, 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontSize: '13px',
                fontWeight: levelFilter === 'all' ? 'bold' : 'normal'
              }}>
                جميع المستويات
              </button>
              {allLevels.map(level => (
                <button key={level} onClick={() => setLevelFilter(level)} style={{ 
                  padding: '8px 12px', 
                  background: levelFilter === level ? colors.secondary : colors.border, 
                  color: levelFilter === level ? 'white' : colors.text, 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontSize: '13px',
                  fontWeight: levelFilter === level ? 'bold' : 'normal'
                }}>
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          {/* Status Filter Buttons */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: colors.text, fontSize: '1rem', marginBottom: '10px' }}>حالة المراجعة:</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => setStatusFilter('all')} style={{ 
                padding: '8px 12px', 
                background: statusFilter === 'all' ? colors.primary : colors.border, 
                color: statusFilter === 'all' ? 'white' : colors.text, 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontSize: '13px',
                fontWeight: statusFilter === 'all' ? 'bold' : 'normal'
              }}>
                جميع الحالات
              </button>
              {['red', 'orange', 'green'].map(status => (
                <button key={status} onClick={() => setStatusFilter(status)} style={{ 
                  padding: '8px 12px', 
                  background: statusFilter === status ? getMatnColor(status) : colors.border, 
                  color: statusFilter === status ? 'white' : colors.text, 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: statusFilter === status ? 'bold' : 'normal'
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getMatnColor(status) }} />
                  {status === 'red' ? 'أحمر' : status === 'orange' ? 'برتقالي' : 'أخضر'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Collapsible Sections with Better Cards */}
        {Object.entries(groupedMutun).map(([section, mutun]) => {
          const isCollapsed = collapsedSections[section];
          const sectionStats = {
            total: mutun.length,
            red: mutun.filter(m => m.status === 'red').length,
            orange: mutun.filter(m => m.status === 'orange').length,
            green: mutun.filter(m => m.status === 'green').length
          };
          
          return (
            <div key={section} style={{ marginBottom: '25px' }}>
              {/* Collapsible Section Header */}
              <div onClick={() => toggleSection(section)} style={{ 
                background: colors.surface, 
                borderRadius: '12px', 
                padding: '15px 20px', 
                border: `1px solid ${colors.border}`, 
                cursor: 'pointer',
                marginBottom: isCollapsed ? '0' : '15px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ color: colors.primary, fontSize: '1.3rem', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{isCollapsed ? '📁' : '📂'}</span>
                      {section}
                    </h2>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
                        المجموع: <strong>{sectionStats.total}</strong>
                      </span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.error }} />
                          <span style={{ color: colors.textSecondary, fontSize: '0.8rem' }}>{sectionStats.red}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.warning }} />
                          <span style={{ color: colors.textSecondary, fontSize: '0.8rem' }}>{sectionStats.orange}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.success }} />
                          <span style={{ color: colors.textSecondary, fontSize: '0.8rem' }}>{sectionStats.green}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span style={{ color: colors.primary, fontSize: '1.5rem', transition: 'transform 0.3s ease', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                    ▼
                  </span>
                </div>
              </div>
              
              {/* Section Content */}
              {!isCollapsed && (
                                 <div style={{ display: 'grid', gap: '12px' }}>
                   {mutun.map(matn => (
                     <div key={matn.id} style={{ 
                       background: colors.surface, 
                       borderRadius: '12px', 
                       padding: '16px', 
                       border: `2px solid ${getMatnColor(matn.status)}`, 
                       transition: 'all 0.2s',
                       boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                     }}>
                       {/* Header with Clickable Status Badge */}
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                         <h3 style={{ color: colors.text, fontSize: '1.1rem', margin: 0, flex: 1, fontWeight: 'bold' }}>{matn.name}</h3>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <button onClick={() => changeMatnStatus(matn.id)} style={{ 
                             background: getMatnColor(matn.status), 
                             color: 'white', 
                             padding: '6px 12px', 
                             borderRadius: '12px', 
                             fontSize: '0.75rem', 
                             fontWeight: 'bold',
                             border: 'none',
                             cursor: 'pointer',
                             minWidth: '100px',
                             textAlign: 'center',
                             transition: 'transform 0.1s'
                           }}>
                             {matn.status === 'red' ? 'يحتاج مراجعة' : matn.status === 'orange' ? 'قريب الانتهاء' : 'تم المراجعة'}
                           </button>
                           <button onClick={() => openThresholdModal(matn)} style={{ 
                             background: colors.border, 
                             border: 'none', 
                             borderRadius: '6px', 
                             padding: '6px 8px', 
                             cursor: 'pointer', 
                             fontSize: '14px',
                             transition: 'background 0.2s'
                           }}>⚙️</button>
                         </div>
                       </div>
                       
                       {/* Days Since Last Completion */}
                       <div style={{ marginBottom: '12px' }}>
                         <div style={{ 
                           background: colors.background, 
                           padding: '10px', 
                           borderRadius: '8px',
                           border: `1px solid ${colors.border}`
                         }}>
                           <span style={{ color: colors.text, fontSize: '0.9rem' }}>
                             منذ آخر ختمة: <strong>{matn.days_since_last_revision} أيام</strong>
                           </span>
                         </div>
                       </div>
                       
                                               {/* Description Field - Always Visible */}
                        <div style={{ marginBottom: '12px' }}>
                          {editingMatnId === matn.id ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                              <textarea 
                                value={matn.description || ''} 
                                onChange={(e) => updateMatnDescription(matn.id, e.target.value)}
                                autoFocus
                                placeholder="أضف ملاحظة..."
                                style={{ 
                                  flex: 1,
                                  padding: '10px', 
                                  border: `2px solid ${colors.primary}`, 
                                  borderRadius: '8px', 
                                  fontSize: '0.9rem', 
                                  backgroundColor: colors.background, 
                                  color: colors.text, 
                                  minHeight: '60px', 
                                  resize: 'vertical',
                                  outline: 'none',
                                  fontFamily: 'inherit'
                                }} 
                              />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <button 
                                  onClick={() => setEditingMatnId(null)}
                                  style={{ 
                                    background: colors.success, 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    padding: '8px 10px', 
                                    cursor: 'pointer', 
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    minWidth: '40px'
                                  }}
                                >
                                  ✓
                                </button>
                                <button 
                                  onClick={() => {
                                    // Revert changes
                                    const originalMatn = mutunData.find(m => m.id === matn.id);
                                    if (originalMatn) {
                                      updateMatnDescription(matn.id, originalMatn.description || '');
                                    }
                                    setEditingMatnId(null);
                                  }}
                                  style={{ 
                                    background: colors.error, 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    padding: '8px 10px', 
                                    cursor: 'pointer', 
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    minWidth: '40px'
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => setEditingMatnId(matn.id)}
                              style={{ 
                                background: colors.background, 
                                padding: '10px', 
                                borderRadius: '8px',
                                border: `1px solid ${colors.border}`,
                                cursor: 'text',
                                minHeight: '40px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <span style={{ color: matn.description ? colors.text : colors.textSecondary, fontSize: '0.9rem', fontStyle: matn.description ? 'normal' : 'italic' }}>
                                {matn.description || 'انقر لإضافة ملاحظة...'}
                              </span>
                            </div>
                          )}
                        </div>
                       
                       {/* Action Buttons */}
                       <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                         {matn.memorization_pdf_link && (
                           <button onClick={() => window.open(matn.memorization_pdf_link, '_blank')} style={{ 
                             padding: '6px 12px', 
                             background: colors.primary, 
                             color: 'white', 
                             border: 'none', 
                             borderRadius: '6px', 
                             cursor: 'pointer', 
                             fontSize: '12px',
                             fontWeight: 'bold'
                           }}>
                             📄 {t.memorizationPdf}
                           </button>
                         )}
                         {matn.explanation_pdf_link && (
                           <button onClick={() => window.open(matn.explanation_pdf_link, '_blank')} style={{ 
                             padding: '6px 12px', 
                             background: colors.secondary, 
                             color: 'white', 
                             border: 'none', 
                             borderRadius: '6px', 
                             cursor: 'pointer', 
                             fontSize: '12px',
                             fontWeight: 'bold'
                           }}>
                             📖 {t.explanationPdf}
                           </button>
                         )}
                         {matn.memorization_audio_link && (
                           <button onClick={() => setAudioPlayer({ url: matn.memorization_audio_link, title: matn.name })} style={{ 
                             padding: '6px 12px', 
                             background: colors.success, 
                             color: 'white', 
                             border: 'none', 
                             borderRadius: '6px', 
                             cursor: 'pointer', 
                             fontSize: '12px',
                             fontWeight: 'bold'
                           }}>
                             🎧 {t.audio}
                           </button>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
              )}
            </div>
          );
        })}

        {filteredMutun.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📚</div>
            <p>لا توجد متون تطابق البحث</p>
          </div>
        )}
      </div>
    );
  };

  // News Page Component
  const NewsPage: React.FC = () => {
    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: colors.primary, fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📢</span>
          {t.news}
        </h1>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {newsData.map(news => {
            const isRead = news.read_by.includes(currentUser?.id || '');
            
            return (
              <div key={news.id} style={{ background: colors.surface, borderRadius: '15px', padding: '20px', border: `1px solid ${isRead ? colors.border : colors.primary}`, position: 'relative' }}>
                {!isRead && (
                  <div style={{ position: 'absolute', top: '15px', right: '15px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.primary }} />
                )}
                
                <h2 style={{ color: colors.text, fontSize: '1.2rem', marginBottom: '10px' }}>{news.title}</h2>
                <p style={{ color: colors.textSecondary, marginBottom: '15px', lineHeight: '1.6' }}>{news.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: colors.textSecondary }}>
                  <span>📅 {new Date(news.publication_date).toLocaleDateString('ar-SA')}</span>
                  <span>👁️ {news.read_by.length} قراءة</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {newsData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📢</div>
            <p>لا توجد أخبار حالياً</p>
          </div>
        )}
      </div>
    );
  };

  // More Page Component
  const MorePage: React.FC = () => {
    const handleLogout = () => {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setCurrentPage('home');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentPage');
    };

    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: colors.primary, fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⋯</span>
          {t.more}
        </h1>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {/* Settings Section */}
          <div style={{ background: colors.surface, borderRadius: '15px', padding: '20px', border: `1px solid ${colors.border}` }}>
            <h3 style={{ color: colors.text, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>⚙️</span>
              {t.settings}
            </h3>
            
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: colors.text }}>{t.language}</span>
                <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} style={{ padding: '8px 15px', background: colors.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  {language === 'ar' ? 'English' : 'العربية'}
                </button>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: colors.text }}>{t.theme}</span>
                <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ padding: '8px 15px', background: colors.secondary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  {theme === 'light' ? '🌙 داكن' : '☀️ فاتح'}
                </button>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div style={{ background: colors.surface, borderRadius: '15px', padding: '20px', border: `1px solid ${colors.border}` }}>
            <h3 style={{ color: colors.text, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>👤</span>
              معلومات الحساب
            </h3>
            
            <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
              <div><span style={{ color: colors.textSecondary }}>الاسم:</span> <span style={{ color: colors.text }}>{currentUser?.name}</span></div>
              <div><span style={{ color: colors.textSecondary }}>الدور:</span> <span style={{ color: colors.text }}>{currentUser?.role}</span></div>
              <div><span style={{ color: colors.textSecondary }}>تاريخ الإنشاء:</span> <span style={{ color: colors.text }}>{currentUser?.created_at}</span></div>
            </div>
          </div>

          {/* App Info */}
          <div style={{ background: colors.surface, borderRadius: '15px', padding: '20px', border: `1px solid ${colors.border}` }}>
            <h3 style={{ color: colors.text, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>ℹ️</span>
              {t.aboutUs}
            </h3>
            
            <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
              <div><span style={{ color: colors.textSecondary }}>{t.version}:</span> <span style={{ color: colors.text }}>1.0.0</span></div>
              <div><span style={{ color: colors.textSecondary }}>المطور:</span> <span style={{ color: colors.text }}>فريق معونة المتعلم</span></div>
              <div><span style={{ color: colors.textSecondary }}>النوع:</span> <span style={{ color: colors.text }}>نظام إدارة التعلم الإسلامي</span></div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout} style={{ background: colors.error, color: 'white', border: 'none', borderRadius: '15px', padding: '15px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span>🚪</span>
            {t.logout}
          </button>
        </div>
      </div>
    );
  };

  // Navigation Items
  const getNavigationItems = (role: string) => {
    switch (role) {
      case 'superuser': return [{ id: 'home', label: t.home, icon: '🏠' }, { id: 'mutuun', label: t.mutuun, icon: '📚' }, { id: 'halaqat', label: t.halaqat, icon: '🔵' }, { id: 'users', label: t.users, icon: '👥' }, { id: 'news', label: t.news, icon: '📢' }, { id: 'more', label: t.more, icon: '⋯' }];
      case 'leitung': return [{ id: 'home', label: t.home, icon: '🏠' }, { id: 'mutuun', label: t.mutuun, icon: '📚' }, { id: 'halaqat', label: t.halaqat, icon: '🔵' }, { id: 'users', label: t.users, icon: '👥' }, { id: 'news', label: t.news, icon: '📢' }, { id: 'more', label: t.more, icon: '⋯' }];
      case 'lehrer': return [{ id: 'home', label: t.home, icon: '🏠' }, { id: 'mutuun', label: t.mutuun, icon: '📚' }, { id: 'news', label: t.news, icon: '📢' }, { id: 'more', label: t.more, icon: '⋯' }];
      case 'student': return [{ id: 'home', label: t.home, icon: '🏠' }, { id: 'mutuun', label: t.mutuun, icon: '📚' }, { id: 'news', label: t.news, icon: '📢' }, { id: 'more', label: t.more, icon: '⋯' }];
      default: return [];
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'mutuun': return <MutunPage />;
      case 'news': return <NewsPage />;
      case 'more': return <MorePage />;
      default: return <HomePage />;
    }
  };

  if (!isLoggedIn) return <LoginPage />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, color: colors.text, direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Main Content */}
      <div style={{ minHeight: 'calc(100vh - 80px)', paddingBottom: '100px' }}>
        {renderCurrentPage()}
      </div>

      {/* Timer FAB */}
      {(currentPage === 'mutuun' || currentPage === 'halaqat') && (
        <button onClick={() => setTimerState(prev => ({ ...prev, isOpen: true }))} style={{ position: 'fixed', bottom: '100px', [language === 'ar' ? 'left' : 'right']: '20px', width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 999, transition: 'transform 0.2s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>⏱️</button>
      )}

      {/* PDF Viewer removed - only external opening */}

      {/* Audio Player */}
      {audioPlayer && <AudioPlayer audioUrl={audioPlayer.url} title={audioPlayer.title} onClose={() => setAudioPlayer(null)} />}

      {/* Timer Modal */}
      <TimerModal />

      {/* Threshold Modal */}
      <ThresholdModal />

      {/* Bottom Navigation */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: colors.surface, borderTop: `1px solid ${colors.border}`, padding: '10px 0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000, direction: 'ltr' }}>
        {getNavigationItems(currentUser?.role || '').map(item => {
          const unreadNews = newsData.filter(n => !n.read_by.includes(currentUser?.id || '')).length;
          
          return (
            <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer', color: currentPage === item.id ? colors.primary : colors.textSecondary, fontSize: '12px', position: 'relative', padding: '5px', transition: 'color 0.2s' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'news' && unreadNews > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: colors.error, color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{unreadNews}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default App;
