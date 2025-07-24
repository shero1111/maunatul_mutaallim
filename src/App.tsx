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
      { name: 'ثلاثة الأصول وأدلتها', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: 'https://raw.githubusercontent.com/shero1111/maunatul_mutaallim_resources/main/1-1-usul-althalatha.mp3', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: 'https://raw.githubusercontent.com/shero1111/maunatul_mutaallim_resources/main/1-1-usul-althalatha.mp3' },
      { name: 'المفتاح في الفقه', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { name: 'معاني الفاتحة وقصار المفصل', memorization_pdf_link: 'https://drive.google.com/file/d/15yoRycyZ0H7CfAEyc11bsS99ur18UYNq/view?usp=sharing', memorization_audio_link: 'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3', explanation_pdf_link: 'https://drive.google.com/file/d/1BiWtqilJXJ5Me_sytvjt7UX1VODX3gYh/view?usp=sharing', explanation_audio_link: 'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' },
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
  { id: 'admin', username: 'admin1', password: 'test', role: 'superuser', name: 'admin1', isActive: true, created_at: '2024-01-01', lastPage: 'home', isOnline: true },
  { id: 'leiter', username: 'leitung1', password: 'test', role: 'leitung', name: 'leitung1', isActive: true, created_at: '2024-01-01', lastPage: 'home', isOnline: true },
  { id: 'lehrer', username: 'lehrer1', password: 'test', role: 'lehrer', name: 'lehrer1', isActive: true, created_at: '2024-01-01', halaqat_ids: ['halaqa1', 'halaqa2'], favorites: ['student1', 'student2'], lastPage: 'home', isOnline: false } as Teacher,
  { id: 'student1', username: 'student1', password: 'test', role: 'student', name: 'student1', isActive: true, created_at: '2024-01-01', status: 'revising', status_changed_at: '2024-01-15T10:30:00Z', halaqat_ids: ['halaqa1'], favorites: ['student2'], lastPage: 'home', isOnline: true } as Student,
  { id: 'student2', username: 'student2', password: 'test', role: 'student', name: 'student2', isActive: true, created_at: '2024-01-01', status: 'khatamat', status_changed_at: '2024-01-14T09:15:00Z', halaqat_ids: ['halaqa1', 'halaqa2'], favorites: [], lastPage: 'home', isOnline: true } as Student
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
    issuesErrors: 'المشاكل والأخطاء', changePassword: 'تغيير كلمة المرور', invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة', close: 'إغلاق', cancel: 'إلغاء', confirm: 'تأكيد',
    // Halaqat & Users page translations
    createHalaqa: 'إنشاء حلقة جديدة', halaqaName: 'اسم الحلقة', halaqaType: 'نوع الحلقة', teacher: 'المعلم', students: 'الطلاب', active: 'نشط', inactive: 'غير نشط', 
    memorizing: 'تحفيظ', explanation: 'شرح', memorizingIntensive: 'تحفيظ مكثف', explanationIntensive: 'شرح مكثف',
    createUser: 'إنشاء مستخدم جديد', name: 'الاسم', role: 'الدور', status: 'الحالة', createdAt: 'تاريخ الإنشاء', lastSeen: 'آخر ظهور',
    superuser: 'المدير العام', leitung: 'قائد الحلقات', lehrer: 'المعلم', student: 'الطالب', online: 'متصل', offline: 'غير متصل',
    assignToHalaqa: 'إضافة إلى حلقة', removeFromHalaqa: 'إزالة من حلقة', noStudentsAssigned: 'لا يوجد طلاب مسجلون', noHalaqatAvailable: 'لا توجد حلقات متاحة',
    // News management translations
    createNews: 'إنشاء خبر جديد', editNews: 'تعديل الخبر', newsTitle: 'عنوان الخبر', newsDescription: 'وصف الخبر', publish: 'نشر', draft: 'مسودة', published: 'منشور',
    // User management translations
    editUser: 'تعديل المستخدم', deleteUser: 'حذف المستخدم', confirmDelete: 'هل أنت متأكد من حذف هذا المستخدم؟', userDeleted: 'تم حذف المستخدم بنجاح',
    searchUsers: 'البحث في المستخدمين', noUsersFound: 'لا يوجد مستخدمون', newPassword: 'كلمة المرور الجديدة'
  },
  en: {
    appName: 'Maunatul Mutaallim', username: 'Username', password: 'Password', login: 'Login', home: 'Home', mutuun: 'Mutun', halaqat: 'Halaqat', users: 'Users', news: 'News', more: 'More',
    not_available: 'Not Available', revising: 'Revising', khatamat: 'Khatamat', changeStatus: 'Change Status', lastUpdate: 'Last Update', totalUsers: 'Total Users', onlineUsers: 'Online Users', totalTeachers: 'Total Teachers', totalHalaqat: 'Total Halaqat', studentsStatus: 'Students Status',
    logout: 'Logout', language: 'Language', theme: 'Theme', aboutUs: 'About Us', guide: 'Guide', version: 'Version', materials: 'Materials', memorizationPdf: 'Memorization PDF', explanationPdf: 'Explanation PDF', audio: 'Audio',
    search: 'Search', edit: 'Edit', delete: 'Delete', add: 'Add', loading: 'Loading...', play: 'Play', pause: 'Pause', allStatuses: 'All Statuses', timer: 'Timer', stopwatch: 'Stopwatch', start: 'Start', stop: 'Stop', reset: 'Reset',
    minutes: 'Minutes', seconds: 'Seconds', days: 'days', day: 'day', lastFullRevising: 'Last full revising was before', writeNote: 'Write a note', save: 'Save', settings: 'Settings', threshold: 'Number of days before color resets to red',
    issuesErrors: 'Issues & Errors', changePassword: 'Change Password', invalidCredentials: 'Invalid username or password', close: 'Close', cancel: 'Cancel', confirm: 'Confirm',
    // Halaqat & Users page translations
    createHalaqa: 'Create New Halaqa', halaqaName: 'Halaqa Name', halaqaType: 'Halaqa Type', teacher: 'Teacher', students: 'Students', active: 'Active', inactive: 'Inactive',
    memorizing: 'Memorizing', explanation: 'Explanation', memorizingIntensive: 'Intensive Memorizing', explanationIntensive: 'Intensive Explanation',
    createUser: 'Create New User', name: 'Name', role: 'Role', status: 'Status', createdAt: 'Created At', lastSeen: 'Last Seen',
    superuser: 'Super Admin', leitung: 'Halaqa Leader', lehrer: 'Teacher', student: 'Student', online: 'Online', offline: 'Offline',
    assignToHalaqa: 'Assign to Halaqa', removeFromHalaqa: 'Remove from Halaqa', noStudentsAssigned: 'No students assigned', noHalaqatAvailable: 'No halaqat available',
    // News management translations
    createNews: 'Create New Article', editNews: 'Edit Article', newsTitle: 'Article Title', newsDescription: 'Article Description', publish: 'Publish', draft: 'Draft', published: 'Published',
    // User management translations
    editUser: 'Edit User', deleteUser: 'Delete User', confirmDelete: 'Are you sure you want to delete this user?', userDeleted: 'User deleted successfully',
    searchUsers: 'Search Users', noUsersFound: 'No users found', newPassword: 'New Password'
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
  const [halaqatData, setHalaqatData] = useState(demoHalaqat);
  const [newsData, setNewsData] = useState(demoNews);
  const [mutunData, setMutunData] = useState<Matn[]>([]);
  
  // UI State

  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'المستوى الأول': false,
    'المستوى الثاني': false, 
    'المستوى الثالث': false,
    'المستوى الرابع': false
  });
  const [audioPlayer, setAudioPlayer] = useState<{url: string, title: string, matnId: string} | null>(null);
  // Simple state for note editing
  const [noteStates, setNoteStates] = useState<Record<string, string>>({});
  
  // Helper function to calculate days since last green status
  const calculateDaysSinceLastGreen = (lastStatusChangeDate: string): number => {
    const lastChangeDate = new Date(lastStatusChangeDate);
    const today = new Date();
    
    // Reset time to start of day for accurate day calculation
    lastChangeDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastChangeDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays); // Ensure never negative
  };
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

  // News management state
  const [isCreatingNews, setIsCreatingNews] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({ title: '', description: '' });

  // User management state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ 
    username: '', 
    name: '', 
    password: '', 
    role: 'student' as User['role'] 
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

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

  // Load data from localStorage + AUTO LOGIN + AUTO THRESHOLD CHECK
  useEffect(() => {
    const savedMutunData = localStorage.getItem('mutunData');
    const savedUsersData = localStorage.getItem('usersData');
    const savedNewsData = localStorage.getItem('newsData');
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedCurrentUser = localStorage.getItem('currentUser');
    const savedCurrentPage = localStorage.getItem('currentPage');
    
    // Load and automatically check for expired mutun
    if (savedMutunData) {
      const loadedMutun = JSON.parse(savedMutunData);
      const updatedMutun = checkAndUpdateExpiredMutun(loadedMutun);
      
      // Only update state and storage if changes were made
      if (JSON.stringify(loadedMutun) !== JSON.stringify(updatedMutun)) {
        setMutunData(updatedMutun);
        localStorage.setItem('mutunData', JSON.stringify(updatedMutun));
      } else {
        setMutunData(loadedMutun);
      }
    }
    
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
          
          // Update lastChange_date when going from ORANGE to GREEN (complete repetition)
          const shouldUpdateDate = matn.status === 'orange' && newStatus === 'green';
          
          return { 
            ...matn, 
            status: newStatus,
            lastChange_date: shouldUpdateDate ? new Date().toISOString().split('T')[0] : matn.lastChange_date,
            days_since_last_revision: newStatus === 'green' ? 0 : matn.days_since_last_revision 
          };
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

  // Check and update expired mutun (automatic threshold check)
  const checkAndUpdateExpiredMutun = (mutunData: Matn[]): Matn[] => {
    const today = new Date().toISOString().split('T')[0];
    
    return mutunData.map(matn => {
      // Only check GREEN status mutun with valid lastChange_date
      if (matn.status === 'green' && matn.lastChange_date) {
        const lastChangeDate = new Date(matn.lastChange_date);
        const todayDate = new Date(today);
        const daysSinceLastChange = Math.floor((todayDate.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // If threshold exceeded, automatically change to RED and update lastChange_date
        if (daysSinceLastChange >= matn.threshold) {
          return {
            ...matn,
            status: 'red' as const,
            lastChange_date: today // Update to today when automatically expired
          };
        }
      }
      return matn;
    });
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





  // Search Component (Available for other pages if needed)
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
      if (timerState.mode === 'timer') {
        // Timer mode: calculate remaining time when resuming
        const now = Date.now();
        setTimerState(prev => ({ 
          ...prev, 
          isRunning: true, 
          startTime: now - (prev.targetTime - prev.time) * 1000 
        }));
      } else {
        // Stopwatch mode: continue from current time
        const now = Date.now();
        setTimerState(prev => ({ 
          ...prev, 
          isRunning: true, 
          startTime: now - prev.time * 1000 
        }));
      }
    };

    const pauseTimer = () => {
      setTimerState(prev => ({ ...prev, isRunning: false, startTime: null }));
    };

    const stopTimer = () => {
      // Reset to original target time
      setTimerState(prev => ({ 
        ...prev, 
        isRunning: false, 
        startTime: null, 
        time: prev.mode === 'timer' ? prev.targetTime : 0 
      }));
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

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: currentColors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1002, padding: '20px' }}>
        <div style={{ 
          background: currentColors.surface, 
          borderRadius: '24px', 
          padding: '30px 25px', 
          maxWidth: '350px', 
          width: '100%', 
          direction: currentLang === 'ar' ? 'rtl' : 'ltr',
          boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(15px)',
          border: `1px solid ${currentColors.border}30`
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
             background: `linear-gradient(135deg, ${currentColors.primary}06, ${currentColors.secondary}06)`, 
             borderRadius: '20px', 
             padding: '25px 20px', 
             marginBottom: '20px',
             border: `1px solid ${currentColors.border}25`,
             textAlign: 'center'
           }}>
                                      {/* Time Adjustment Layout - Minutes & Seconds */}
                             {canAdjust && timerState.mode === 'timer' ? (
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', maxWidth: '300px', margin: '0 auto', direction: 'ltr' }}>
                   {/* Minutes Section - LEFT */}
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1 }}>
                     <button onClick={() => adjustTime('minutes', 'up')} style={{ 
                       background: `${currentColors.primary}20`, 
                       color: currentColors.primary, 
                       border: `1px solid ${currentColors.primary}40`, 
                       borderRadius: '50%', 
                       width: '40px', 
                       height: '40px', 
                       cursor: 'pointer', 
                       fontSize: '16px',
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
                       borderRadius: '12px', 
                       padding: '12px 16px', 
                       width: '100%',
                       textAlign: 'center'
                     }}>
                       <div style={{ 
                         color: currentColors.text, 
                         fontSize: '2rem', 
                         fontWeight: '300', 
                         fontFamily: 'system-ui, -apple-system',
                         lineHeight: '1'
                       }}>
                         {Math.floor(timerState.time / 60).toString().padStart(2, '0')}
                       </div>
                       <div style={{ color: currentColors.textSecondary, fontSize: '0.75rem', fontWeight: '500', marginTop: '2px' }}>MIN</div>
                     </div>
                     
                     <button onClick={() => adjustTime('minutes', 'down')} style={{ 
                       background: `${currentColors.primary}20`, 
                       color: currentColors.primary, 
                       border: `1px solid ${currentColors.primary}40`, 
                       borderRadius: '50%', 
                       width: '40px', 
                       height: '40px', 
                       cursor: 'pointer', 
                       fontSize: '16px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       transition: 'all 0.2s',
                       fontWeight: 'bold'
                     }}>▼</button>
                   </div>

                   {/* Colon Separator */}
                   <div style={{ color: currentColors.textSecondary, fontSize: '1.5rem', fontWeight: '300', alignSelf: 'center', marginTop: '-10px' }}>:</div>

                   {/* Seconds Section - RIGHT */}
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1 }}>
                     <button onClick={() => adjustTime('seconds', 'up')} style={{ 
                       background: `${currentColors.secondary}20`, 
                       color: currentColors.secondary, 
                       border: `1px solid ${currentColors.secondary}40`, 
                       borderRadius: '50%', 
                       width: '40px', 
                       height: '40px', 
                       cursor: 'pointer', 
                       fontSize: '16px',
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
                       borderRadius: '12px', 
                       padding: '12px 16px', 
                       width: '100%',
                       textAlign: 'center'
                     }}>
                       <div style={{ 
                         color: currentColors.text, 
                         fontSize: '2rem', 
                         fontWeight: '300', 
                         fontFamily: 'system-ui, -apple-system',
                         lineHeight: '1'
                       }}>
                         {(timerState.time % 60).toString().padStart(2, '0')}
                       </div>
                       <div style={{ color: currentColors.textSecondary, fontSize: '0.75rem', fontWeight: '500', marginTop: '2px' }}>SEC</div>
                     </div>
                     
                     <button onClick={() => adjustTime('seconds', 'down')} style={{ 
                       background: `${currentColors.secondary}20`, 
                       color: currentColors.secondary, 
                       border: `1px solid ${currentColors.secondary}40`, 
                       borderRadius: '50%', 
                       width: '40px', 
                       height: '40px', 
                       cursor: 'pointer', 
                       fontSize: '16px',
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
                  fontSize: isRunning ? '4rem' : '3.5rem', 
                  fontWeight: '200', 
                  color: isRunning ? currentColors.primary : currentColors.text,
                  fontFamily: 'system-ui, -apple-system, SF Pro Display',
                  letterSpacing: '2px',
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
             <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
               {[1, 5, 10, 15, 25, 30].map(minutes => (
                 <button key={minutes} onClick={() => setTimerMinutes(minutes)} style={{ 
                   padding: '6px 12px', 
                   background: currentColors.background, 
                   color: currentColors.text, 
                   border: `1px solid ${currentColors.border}`, 
                   borderRadius: '16px', 
                   cursor: 'pointer', 
                   fontSize: '12px',
                   fontWeight: '500',
                   transition: 'all 0.2s',
                   minWidth: '40px'
                 }}>
                   {minutes}د
                 </button>
               ))}
             </div>
           )}

                                           {/* Control Buttons - Compact */}
             <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
               {/* Start/Pause Button */}
               <button onClick={timerState.isRunning ? pauseTimer : startTimer} style={{ 
                 padding: '14px 24px', 
                 background: timerState.isRunning ? 
                   `linear-gradient(135deg, #ff9500, #ff6b35)` : 
                   `linear-gradient(135deg, ${currentColors.success}, #2ed573)`, 
                 color: 'white', 
                 border: 'none', 
                 borderRadius: '22px', 
                 cursor: 'pointer', 
                 fontSize: '15px', 
                 fontWeight: '600',
                 minWidth: '120px',
                 boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                 transition: 'all 0.2s'
               }}>
                 {timerState.isRunning ? `⏸️ إيقاف مؤقت` : `▶️ ${currentT.start}`}
               </button>
               
               {/* Stop Button (only when running) */}
               {timerState.isRunning && (
                 <button onClick={stopTimer} style={{ 
                   padding: '14px 24px', 
                   background: `linear-gradient(135deg, ${currentColors.error}, #ff4757)`, 
                   color: 'white', 
                   border: 'none', 
                   borderRadius: '22px', 
                   cursor: 'pointer', 
                   fontSize: '15px',
                   fontWeight: '600',
                   minWidth: '120px',
                   boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                   transition: 'all 0.2s'
                 }}>🛑 إيقاف</button>
               )}
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
                  {/* App Header with Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
            <img 
              src="/logo.jpg" 
              alt="معونة المتعلم"
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '16px',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: `2px solid ${colors.primary}20`
              }} 
            />
            <div>
              <h1 style={{ color: colors.primary, fontSize: '1.8rem', margin: '0 0 4px 0', fontWeight: '700' }}>معونة المتعلم</h1>
              <p style={{ color: colors.textSecondary, fontSize: '0.9rem', margin: 0 }}>نظام إدارة التعلم الإسلامي</p>
            </div>
          </div>
          <div>
            <h2 style={{ color: colors.text, fontSize: '1.4rem', marginBottom: '8px' }}>مرحباً، {currentUser?.name}</h2>
            <p style={{ color: colors.textSecondary, fontSize: '1rem' }}>حلقاتي ومتابعة الطلاب</p>
          </div>
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
        {/* App Header with Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
            <img 
              src="/logo.jpg" 
              alt="معونة المتعلم"
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '16px',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: `2px solid ${colors.primary}20`
              }} 
            />
            <div>
              <h1 style={{ color: colors.primary, fontSize: '1.8rem', margin: '0 0 4px 0', fontWeight: '700' }}>معونة المتعلم</h1>
              <p style={{ color: colors.textSecondary, fontSize: '0.9rem', margin: 0 }}>نظام إدارة التعلم الإسلامي</p>
            </div>
          </div>
          <div>
            <h2 style={{ color: colors.text, fontSize: '1.4rem', marginBottom: '8px' }}>مرحباً، {currentUser?.name}</h2>
            <p style={{ color: colors.textSecondary, fontSize: '1rem' }}>لوحة التحكم الرئيسية</p>
          </div>
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

  // Mutuun Page Component - Simplified with Auto-Expand Logic
  const MutunPage: React.FC = () => {
    const userMutun = mutunData.filter(m => m.user_id === currentUser?.id);
    
    const filteredMutun = userMutun.filter(m => {
      const matchesLevel = levelFilter === 'all' || m.section === levelFilter;
      return matchesLevel;
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

    // Check if section should be expanded
    const shouldExpandSection = (section: string) => {
      // Always respect the manual toggle state
      return !collapsedSections[section];
    };

    const handleLevelFilterChange = (newFilter: string) => {
      setLevelFilter(newFilter);
      
      // Auto-expand logic
      if (newFilter === 'all') {
        // Expand all sections
        const newCollapsed: Record<string, boolean> = {};
        allLevels.forEach(level => {
          newCollapsed[level] = false;
        });
        setCollapsedSections(newCollapsed);
      } else {
        // Collapse all except the selected one
        const newCollapsed: Record<string, boolean> = {};
        allLevels.forEach(level => {
          newCollapsed[level] = level !== newFilter;
        });
        setCollapsedSections(newCollapsed);
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ color: colors.primary, fontSize: '1.8rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📚</span>
            {t.mutuun}
          </h1>
          
          {/* Level Filter Buttons Only */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: colors.text, fontSize: '1rem', marginBottom: '10px' }}>المستويات:</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => handleLevelFilterChange('all')} style={{ 
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
                <button key={level} onClick={() => handleLevelFilterChange(level)} style={{ 
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
        </div>

        {/* Simplified Collapsible Sections */}
        {Object.entries(groupedMutun).map(([section, mutun]) => {
          const isCollapsed = !shouldExpandSection(section);
          
          return (
            <div key={section} style={{ marginBottom: '25px' }}>
              {/* Simple Section Header */}
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
                  <h2 style={{ color: colors.primary, fontSize: '1.3rem', margin: '0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{isCollapsed ? '📁' : '📂'}</span>
                    {section}
                  </h2>
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
                             {matn.status === 'red' ? 'يحتاج مراجعة' : matn.status === 'orange' ? 'قريب الانتهاء' : 'تم الختمة'}
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
                       
                                               {/* Note Field - Completely Isolated */}
                               <div 
                                 style={{ marginBottom: '12px' }}
                                 onClick={(e) => e.stopPropagation()}
                                 onTouchStart={(e) => e.stopPropagation()}
                               >
                                 <input
                                   key={`note-${matn.id}-${matn.description}`}
                                   type="text"
                                   defaultValue={matn.description || ''}
                                   onBlur={(e) => {
                                     e.stopPropagation();
                                     updateMatnDescription(matn.id, e.target.value);
                                   }}
                                   onFocus={(e) => e.stopPropagation()}
                                   onClick={(e) => e.stopPropagation()}
                                   onTouchStart={(e) => e.stopPropagation()}
                                   onTouchEnd={(e) => e.stopPropagation()}
                                   placeholder={language === 'ar' ? 'اكتب ملاحظة...' : 'Write a note...'}
                                   style={{
                                     width: '100%',
                                     padding: '12px',
                                     border: `1px solid ${colors.border}`,
                                     borderRadius: '8px',
                                     fontSize: '16px',
                                     fontFamily: 'inherit',
                                     backgroundColor: colors.background,
                                     color: colors.text,
                                     outline: 'none',
                                     direction: language === 'ar' ? 'rtl' : 'ltr',
                                     textAlign: language === 'ar' ? 'right' : 'left',
                                     boxSizing: 'border-box',
                                     touchAction: 'manipulation',
                                     WebkitTapHighlightColor: 'transparent'
                                   }}
                                 />
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
                             <button onClick={() => setAudioPlayer({ url: matn.memorization_audio_link, title: matn.name, matnId: matn.id })} style={{ 
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
                       
                       {/* Days Since Last Green Status */}
                       <div style={{ textAlign: 'center', marginTop: '8px' }}>
                         <span style={{ color: colors.textSecondary, fontSize: '0.75rem' }}>
                           آخر ختمة قبل: {matn.lastChange_date ? calculateDaysSinceLastGreen(matn.lastChange_date) : 0} يوم
                         </span>
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

  // Halaqat Page Component
  const HalaqatPage: React.FC = () => {
    const canManageHalaqat = currentUser?.role === 'superuser' || currentUser?.role === 'leitung';
    
    // Halaqat management state
    const [isCreatingHalaqa, setIsCreatingHalaqa] = useState(false);
    const [editingHalaqaId, setEditingHalaqaId] = useState<string | null>(null);
    const [halaqaForm, setHalaqaForm] = useState({
      name: '',
      type: 'memorizing' as Halaqa['type'],
      teacher_id: '',
      student_ids: [] as string[],
      internal_number: 0,
      isActive: true
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const handleCreateHalaqa = () => {
      if (halaqaForm.name.trim() && halaqaForm.teacher_id && halaqaForm.internal_number > 0) {
        const newHalaqa: Halaqa = {
          id: `halaqa_${Date.now()}`,
          name: halaqaForm.name,
          type: halaqaForm.type,
          teacher_id: halaqaForm.teacher_id,
          student_ids: halaqaForm.student_ids,
          internal_number: halaqaForm.internal_number,
          isActive: halaqaForm.isActive,
          created_at: new Date().toISOString()
        };
        
        setHalaqatData(prev => {
          const updated = [...prev, newHalaqa];
          localStorage.setItem('halaqatData', JSON.stringify(updated));
          return updated;
        });
        
        setHalaqaForm({ name: '', type: 'memorizing', teacher_id: '', student_ids: [], internal_number: 0, isActive: true });
        setStudentSearchQuery('');
        setIsCreatingHalaqa(false);
      }
    };

    const handleEditHalaqa = (halaqaId: string) => {
      const halaqa = halaqatData.find(h => h.id === halaqaId);
      if (halaqa) {
        setHalaqaForm({
          name: halaqa.name,
          type: halaqa.type,
          teacher_id: halaqa.teacher_id,
          student_ids: halaqa.student_ids,
          internal_number: halaqa.internal_number,
          isActive: halaqa.isActive
        });
        setEditingHalaqaId(halaqaId);
        setIsCreatingHalaqa(true);
      }
    };

    const handleUpdateHalaqa = () => {
      if (editingHalaqaId && halaqaForm.name.trim() && halaqaForm.teacher_id && halaqaForm.internal_number > 0) {
        setHalaqatData(prev => {
          const updated = prev.map(halaqa => 
            halaqa.id === editingHalaqaId 
              ? {
                  ...halaqa,
                  name: halaqaForm.name,
                  type: halaqaForm.type,
                  teacher_id: halaqaForm.teacher_id,
                  student_ids: halaqaForm.student_ids,
                  internal_number: halaqaForm.internal_number,
                  isActive: halaqaForm.isActive
                }
              : halaqa
          );
          localStorage.setItem('halaqatData', JSON.stringify(updated));
          return updated;
        });
        
        setHalaqaForm({ name: '', type: 'memorizing', teacher_id: '', student_ids: [], internal_number: 0, isActive: true });
        setStudentSearchQuery('');
        setEditingHalaqaId(null);
        setIsCreatingHalaqa(false);
      }
    };

    const handleDeleteHalaqa = (halaqaId: string) => {
      setHalaqatData(prev => {
        const updated = prev.filter(halaqa => halaqa.id !== halaqaId);
        localStorage.setItem('halaqatData', JSON.stringify(updated));
        return updated;
      });
      setShowDeleteConfirm(null);
    };

    // Get available teachers and students
    const availableTeachers = usersData.filter(user => user.role === 'lehrer');
    const availableStudents = usersData.filter(user => user.role === 'student');
    
    // Student search state
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    
    // Filter students based on search
    const filteredStudents = availableStudents.filter(student => 
      student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.username.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: colors.primary, fontSize: '1.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔵</span>
            {t.halaqat}
          </h1>
          {canManageHalaqat && (
            <button 
              onClick={() => setIsCreatingHalaqa(true)}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600'
              }}
            >
              <span>➕</span>
              {t.createHalaqa}
            </button>
          )}
        </div>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {halaqatData.map(halaqa => {
            const teacher = usersData.find(u => u.id === halaqa.teacher_id);
            const students = usersData.filter(u => halaqa.student_ids.includes(u.id));
            
            return (
              <div key={halaqa.id} style={{ 
                background: colors.surface, 
                borderRadius: '16px', 
                padding: '24px', 
                border: `1px solid ${colors.border}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ color: colors.text, fontSize: '1.3rem', margin: '0 0 8px 0', fontWeight: '600' }}>
                      {halaqa.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ 
                        background: colors.primary + '20', 
                        color: colors.primary, 
                        padding: '4px 12px', 
                        borderRadius: '8px', 
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {halaqa.type === 'memorizing' ? t.memorizing : 
                         halaqa.type === 'explanation' ? t.explanation :
                         halaqa.type === 'memorizing_intensive' ? t.memorizingIntensive :
                         t.explanationIntensive}
                      </span>
                      <span style={{ 
                        background: halaqa.isActive ? colors.success + '20' : colors.error + '20',
                        color: halaqa.isActive ? colors.success : colors.error,
                        padding: '4px 12px', 
                        borderRadius: '8px', 
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {halaqa.isActive ? t.active : t.inactive}
                      </span>
                    </div>
                  </div>
                  {canManageHalaqat && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleEditHalaqa(halaqa.id)}
                        style={{
                          background: colors.border,
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(halaqa.id)}
                        style={{
                          background: colors.error + '20',
                          color: colors.error,
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: colors.textSecondary, fontSize: '0.9rem', margin: '0 0 4px 0' }}>
                    <strong>{t.teacher}:</strong> {teacher?.name || 'غير محدد'}
                  </p>
                  <p style={{ color: colors.textSecondary, fontSize: '0.9rem', margin: 0 }}>
                    <strong>رقم الحلقة:</strong> {halaqa.internal_number}
                  </p>
                </div>
                
                <div>
                  <h4 style={{ color: colors.text, fontSize: '1rem', margin: '0 0 12px 0' }}>
                    {t.students} ({students.length})
                  </h4>
                  {students.length > 0 ? (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {students.map(student => (
                        <div key={student.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          background: colors.background,
                          borderRadius: '8px',
                          border: `1px solid ${colors.border}`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: student.isOnline ? colors.success : colors.textSecondary
                            }} />
                            <span style={{ color: colors.text, fontWeight: '500' }}>{student.name}</span>
                          </div>
                          <span style={{ color: colors.textSecondary, fontSize: '0.8rem' }}>
                            {student.isOnline ? t.online : t.offline}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: colors.textSecondary, fontStyle: 'italic' }}>{t.noStudentsAssigned}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {halaqatData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔵</div>
            <p>{t.noHalaqatAvailable}</p>
          </div>
        )}

        {/* Create/Edit Halaqa Modal */}
        {isCreatingHalaqa && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 10000,
            paddingTop: '20px',
            paddingBottom: '100px'
          }}>
            <div style={{
              background: colors.surface,
              borderRadius: '12px',
              width: '95%',
              maxWidth: '400px',
              maxHeight: 'calc(100vh - 140px)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                                              {/* Modal Header */}
                <div style={{ padding: '16px 16px 0 16px', borderBottom: `1px solid ${colors.border}` }}>
                  <h2 style={{ color: colors.text, marginBottom: '12px', fontSize: '1.2rem', textAlign: 'center' }}>
                    {editingHalaqaId ? 'تعديل الحلقة' : 'إنشاء حلقة جديدة'}
                  </h2>
                </div>

                {/* Scrollable Content */}
                <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                  {/* Halaqa Name */}
                <div style={{ marginBottom: '12px' }}>
                                  <label style={{ display: 'block', marginBottom: '6px', color: colors.text, fontWeight: '600', fontSize: '0.9rem' }}>
                    اسم الحلقة
                  </label>
                  <input
                    type="text"
                    defaultValue={halaqaForm.name}
                    onBlur={(e) => setHalaqaForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: colors.background,
                      color: colors.text,
                      direction: 'rtl',
                      boxSizing: 'border-box'
                    }}
                    placeholder="مثال: حلقة المبتدئين"
                  />
                </div>

                                 {/* Internal Number */}
                 <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: colors.text, fontWeight: '600', fontSize: '0.9rem' }}>
                    رقم الحلقة
                  </label>
                  <input
                    type="number"
                    defaultValue={halaqaForm.internal_number || ''}
                    onBlur={(e) => setHalaqaForm(prev => ({ ...prev, internal_number: parseInt(e.target.value) || 0 }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: colors.background,
                      color: colors.text,
                      direction: 'rtl',
                      boxSizing: 'border-box'
                    }}
                    placeholder="مثال: 101"
                  />
                </div>

              {/* Halaqa Type */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '600' }}>
                  نوع الحلقة
                </label>
                <select
                  defaultValue={halaqaForm.type}
                  onBlur={(e) => setHalaqaForm(prev => ({ ...prev, type: e.target.value as Halaqa['type'] }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: colors.background,
                    color: colors.text,
                    direction: 'rtl'
                  }}
                >
                  <option value="memorizing">حفظ</option>
                  <option value="explanation">تفسير</option>
                  <option value="memorizing_intensive">حفظ مكثف</option>
                  <option value="explanation_intensive">تفسير مكثف</option>
                </select>
              </div>

              {/* Teacher Selection */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '600' }}>
                  المعلم
                </label>
                <select
                  defaultValue={halaqaForm.teacher_id}
                  onBlur={(e) => setHalaqaForm(prev => ({ ...prev, teacher_id: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: colors.background,
                    color: colors.text,
                    direction: 'rtl'
                  }}
                >
                  <option value="">اختر المعلم</option>
                  {availableTeachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>

              {/* Students Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '600' }}>
                  الطلاب ({halaqaForm.student_ids.length})
                </label>
                
                {/* Student Search */}
                <div style={{ marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="البحث عن طالب..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: colors.background,
                      color: colors.text,
                      direction: 'rtl',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ 
                  maxHeight: '150px', 
                  overflow: 'auto',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  padding: '8px'
                }}>
                  {filteredStudents.length > 0 ? filteredStudents.map(student => (
                    <label key={student.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      direction: 'rtl'
                    }}>
                      <input
                        type="checkbox"
                        checked={halaqaForm.student_ids.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHalaqaForm(prev => ({ 
                              ...prev, 
                              student_ids: [...prev.student_ids, student.id] 
                            }));
                          } else {
                            setHalaqaForm(prev => ({ 
                              ...prev, 
                              student_ids: prev.student_ids.filter(id => id !== student.id) 
                            }));
                          }
                        }}
                      />
                      <span style={{ color: colors.text }}>{student.name}</span>
                    </label>
                  )) : (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '20px', 
                      color: colors.textSecondary,
                      fontSize: '0.9rem'
                    }}>
                      {studentSearchQuery ? 'لا توجد نتائج للبحث' : 'لا يوجد طلاب متاحون'}
                    </div>
                  )}
                </div>
              </div>

                              {/* Active Status */}
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: colors.background, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    direction: 'rtl'
                  }}>
                    <input
                      type="checkbox"
                      checked={halaqaForm.isActive}
                      onChange={(e) => setHalaqaForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <div>
                      <span style={{ color: colors.text, fontWeight: '600' }}>الحلقة نشطة ومفتوحة للطلاب</span>
                      <div style={{ fontSize: '0.8rem', color: colors.textSecondary, marginTop: '2px' }}>
                        غير نشط = مخفية من الطلاب، نشط = ظاهرة ومتاحة
                      </div>
                    </div>
                  </label>
                </div>

                </div>

                {/* Sticky Footer with Action Buttons */}
                <div style={{ 
                  padding: '16px', 
                  borderTop: `1px solid ${colors.border}`,
                  background: colors.surface,
                  borderRadius: '0 0 12px 12px'
                }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                                          onClick={() => {
                      setIsCreatingHalaqa(false);
                      setEditingHalaqaId(null);
                      setHalaqaForm({ name: '', type: 'memorizing', teacher_id: '', student_ids: [], internal_number: 0, isActive: true });
                      setStudentSearchQuery('');
                    }}
                      style={{
                        padding: '12px 20px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        background: colors.background,
                        color: colors.text,
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={editingHalaqaId ? handleUpdateHalaqa : handleCreateHalaqa}
                      style={{
                        padding: '12px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        background: colors.primary,
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '16px'
                      }}
                    >
                      {editingHalaqaId ? 'تحديث' : 'إنشاء'}
                    </button>
                  </div>
                </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: colors.surface,
              borderRadius: '16px',
              padding: '24px',
              width: '90%',
              maxWidth: '400px'
            }}>
              <h3 style={{ color: colors.text, marginBottom: '16px', textAlign: 'center' }}>
                تأكيد الحذف
              </h3>
              <p style={{ color: colors.textSecondary, marginBottom: '24px', textAlign: 'center' }}>
                هل أنت متأكد من حذف هذه الحلقة؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  style={{
                    padding: '12px 20px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: colors.background,
                    color: colors.text,
                    cursor: 'pointer'
                  }}
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleDeleteHalaqa(showDeleteConfirm)}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: colors.error,
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Users Page Component
  const UsersPage: React.FC = () => {
    const canManageUsers = currentUser?.role === 'superuser' || currentUser?.role === 'leitung';
    
    // Filter users based on search
    const filteredUsers = usersData.filter(user => 
      user.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    const handleCreateUser = () => {
      if (userForm.username.trim()) {
        const newUser: User = {
          id: `user_${Date.now()}`,
          username: userForm.username,
          name: userForm.username, // username = name
          password: userForm.password || 'test', // default password
          role: userForm.role,
          isActive: true,
          created_at: new Date().toISOString(),
          isOnline: false
        };
        setUsersData(prev => {
          const updated = [...prev, newUser];
          localStorage.setItem('usersData', JSON.stringify(updated));
          return updated;
        });
        setUserForm({ username: '', name: '', password: '', role: 'student' });
        setIsCreatingUser(false);
      }
    };

    const handleEditUser = (userId: string) => {
      const user = usersData.find(u => u.id === userId);
      if (user) {
        setUserForm({ 
          username: user.username, 
          name: user.username, // use username for both
          password: '', 
          role: user.role 
        });
        setEditingUserId(userId);
        setIsCreatingUser(true);
      }
    };

    const handleUpdateUser = () => {
      if (editingUserId && userForm.username.trim()) {
        setUsersData(prev => {
          const updated = prev.map(user => 
            user.id === editingUserId 
              ? { 
                  ...user, 
                  username: userForm.username, 
                  name: userForm.username, // username = name
                  role: userForm.role,
                  ...(userForm.password ? { password: userForm.password } : {})
                }
              : user
          );
          localStorage.setItem('usersData', JSON.stringify(updated));
          return updated;
        });
        setUserForm({ username: '', name: '', password: '', role: 'student' });
        setEditingUserId(null);
        setIsCreatingUser(false);
      }
    };

    const handleDeleteUser = (userId: string) => {
      setUsersData(prev => {
        const updated = prev.filter(user => user.id !== userId);
        localStorage.setItem('usersData', JSON.stringify(updated));
        return updated;
      });
      setShowDeleteConfirm(null);
    };

    return (
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        <h1 style={{ color: colors.primary, fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>👥</span>
          {t.users}
        </h1>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px', maxWidth: '100%', overflow: 'hidden' }}>
          <input
            type="text"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            placeholder={t.searchUsers}
            style={{
              width: 'calc(100% - 32px)',
              maxWidth: '100%',
              padding: '12px 16px',
              border: `2px solid ${colors.border}`,
              borderRadius: '12px',
              fontSize: '1rem',
              backgroundColor: colors.surface,
              color: colors.text,
              direction: language === 'ar' ? 'rtl' : 'ltr',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = colors.primary}
            onBlur={(e) => e.target.style.borderColor = colors.border}
          />
        </div>

        {/* Create/Edit User Form */}
        {isCreatingUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: colors.overlay,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: colors.surface,
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ color: colors.text, marginBottom: '20px', fontSize: '1.3rem' }}>
                {editingUserId ? t.editUser : t.createUser}
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '600' }}>
                  {t.username}
                </label>
                <input
                  type="text"
                  defaultValue={userForm.username}
                  onBlur={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                  style={{
                    width: 'calc(100% - 24px)',
                    maxWidth: '100%',
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: colors.background,
                    color: colors.text,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '600' }}>
                  {editingUserId ? t.newPassword : t.password}
                </label>
                <input
                  type="password"
                  defaultValue={userForm.password}
                  onBlur={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  style={{
                    width: 'calc(100% - 24px)',
                    maxWidth: '100%',
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: colors.background,
                    color: colors.text,
                    boxSizing: 'border-box'
                  }}
                  placeholder={editingUserId ? language === 'ar' ? 'اتركها فارغة إذا لم تريد التغيير' : 'Leave empty to keep current' : 'test'}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '600' }}>
                  {t.role}
                </label>
                <select
                  defaultValue={userForm.role}
                  onBlur={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                  style={{
                    width: 'calc(100% - 24px)',
                    maxWidth: '100%',
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: colors.background,
                    color: colors.text,
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="student">{t.student}</option>
                  <option value="lehrer">{t.lehrer}</option>
                  <option value="leitung">{t.leitung}</option>
                  <option value="superuser">{t.superuser}</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={editingUserId ? handleUpdateUser : handleCreateUser}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    flex: 1
                  }}
                >
                  {t.save}
                </button>
                <button
                  onClick={() => {
                    setIsCreatingUser(false);
                    setEditingUserId(null);
                    setUserForm({ username: '', name: '', password: '', role: 'student' });
                  }}
                  style={{
                    background: colors.border,
                    color: colors.text,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: colors.overlay,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: colors.surface,
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center'
            }}>
              <h3 style={{ color: colors.text, marginBottom: '16px' }}>{t.deleteUser}</h3>
              <p style={{ color: colors.textSecondary, marginBottom: '20px' }}>{t.confirmDelete}</p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  style={{
                    background: `linear-gradient(135deg, ${colors.error}, #dc2626)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    flex: 1
                  }}
                >
                  {t.delete}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  style={{
                    background: colors.border,
                    color: colors.text,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredUsers.map(user => {
            // Role-based colors
            const getRoleColor = (role: string) => {
              switch (role) {
                case 'superuser': return '#dc2626'; // Red
                case 'leitung': return '#ea580c'; // Orange  
                case 'lehrer': return '#2563eb'; // Blue
                case 'student': return '#059669'; // Green
                default: return colors.textSecondary;
              }
            };

            const roleColor = getRoleColor(user.role);

            return (
              <div key={user.id} style={{ 
                background: colors.surface, 
                borderRadius: '12px', 
                padding: '20px', 
                border: `2px solid ${roleColor}20`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                position: 'relative'
              }}>
                {/* Role indicator stripe */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: roleColor,
                  borderRadius: '12px 0 0 12px'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                    <div>
                      <h3 style={{ color: colors.text, fontSize: '1.2rem', margin: '0 0 8px 0', fontWeight: '600' }}>
                        {user.username}
                      </h3>
                      
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Role Badge */}
                        <span style={{ 
                          background: roleColor, 
                          color: 'white', 
                          padding: '4px 12px', 
                          borderRadius: '8px', 
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {user.role === 'superuser' ? t.superuser :
                           user.role === 'leitung' ? t.leitung :
                           user.role === 'lehrer' ? t.lehrer : t.student}
                        </span>
                        
                        {/* Online Status */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: user.isOnline ? colors.success + '20' : colors.textSecondary + '20',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: user.isOnline ? colors.success : colors.textSecondary,
                            boxShadow: user.isOnline ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none'
                          }} />
                          <span style={{ 
                            color: user.isOnline ? colors.success : colors.textSecondary, 
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            {user.isOnline ? t.online : t.offline}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {canManageUsers && user.id !== currentUser?.id && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleEditUser(user.id)}
                        style={{
                          background: colors.border,
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = colors.primary + '20'}
                        onMouseLeave={(e) => e.currentTarget.style.background = colors.border}
                        title={t.editUser}
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(user.id)}
                        style={{
                          background: colors.error + '20',
                          color: colors.error,
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = colors.error + '30'}
                        onMouseLeave={(e) => e.currentTarget.style.background = colors.error + '20'}
                        title={t.deleteUser}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No users found message */}
        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
            <p>{t.noUsersFound}</p>
          </div>
        )}

        {/* Floating Action Button */}
        {canManageUsers && (
          <button
            onClick={() => setIsCreatingUser(true)}
            style={{
              position: 'fixed',
              bottom: '100px',
              [language === 'ar' ? 'left' : 'right']: '20px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              zIndex: 999,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title={t.createUser}
          >
            ➕
          </button>
        )}
      </div>
    );
  };

  // News Page Component
  const NewsPage: React.FC = () => {
    const canManageNews = currentUser?.role === 'superuser' || currentUser?.role === 'leitung';

    const handleCreateNews = () => {
      if (newsForm.title.trim() && newsForm.description.trim()) {
        const newNews: News = {
          id: `news_${Date.now()}`,
          title: newsForm.title,
          description: newsForm.description,
          images: [],
          files: [],
          publication_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          read_by: []
        };
        setNewsData(prev => {
          const updated = [newNews, ...prev];
          localStorage.setItem('newsData', JSON.stringify(updated));
          return updated;
        });
        setNewsForm({ title: '', description: '' });
        setIsCreatingNews(false);
      }
    };

    const handleEditNews = (newsId: string) => {
      const news = newsData.find(n => n.id === newsId);
      if (news) {
        setNewsForm({ title: news.title, description: news.description });
        setEditingNewsId(newsId);
        setIsCreatingNews(true);
      }
    };

    const handleUpdateNews = () => {
      if (editingNewsId && newsForm.title.trim() && newsForm.description.trim()) {
        setNewsData(prev => {
          const updated = prev.map(news => 
            news.id === editingNewsId 
              ? { ...news, title: newsForm.title, description: newsForm.description }
              : news
          );
          localStorage.setItem('newsData', JSON.stringify(updated));
          return updated;
        });
        setNewsForm({ title: '', description: '' });
        setEditingNewsId(null);
        setIsCreatingNews(false);
      }
    };

    const handleDeleteNews = (newsId: string) => {
      setNewsData(prev => {
        const updated = prev.filter(news => news.id !== newsId);
        localStorage.setItem('newsData', JSON.stringify(updated));
        return updated;
      });
    };

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: colors.primary, fontSize: '1.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📢</span>
            {t.news}
          </h1>
          {canManageNews && (
            <button 
              onClick={() => setIsCreatingNews(true)}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600'
              }}
            >
              <span>➕</span>
              {t.createNews}
            </button>
          )}
        </div>

        {/* Create/Edit News Form */}
        {isCreatingNews && (
          <div style={{
            background: colors.surface,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ color: colors.text, marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingNewsId ? t.editNews : t.createNews}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '600' }}>
                {t.newsTitle}
              </label>
              <input
                type="text"
                defaultValue={newsForm.title}
                onBlur={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: colors.background,
                  color: colors.text,
                  direction: language === 'ar' ? 'rtl' : 'ltr'
                }}
                placeholder={language === 'ar' ? 'أدخل عنوان الخبر...' : 'Enter news title...'}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '600' }}>
                {t.newsDescription}
              </label>
              <textarea
                defaultValue={newsForm.description}
                onBlur={(e) => setNewsForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: colors.background,
                  color: colors.text,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  direction: language === 'ar' ? 'rtl' : 'ltr'
                }}
                placeholder={language === 'ar' ? 'أدخل محتوى الخبر...' : 'Enter news content...'}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={editingNewsId ? handleUpdateNews : handleCreateNews}
                style={{
                  background: `linear-gradient(135deg, ${colors.success}, #2ed573)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {editingNewsId ? t.save : t.publish}
              </button>
              <button
                onClick={() => {
                  setIsCreatingNews(false);
                  setEditingNewsId(null);
                  setNewsForm({ title: '', description: '' });
                }}
                style={{
                  background: colors.border,
                  color: colors.text,
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {newsData.map(news => {
            const isRead = news.read_by.includes(currentUser?.id || '');
            
            return (
              <div key={news.id} style={{ 
                background: colors.surface, 
                borderRadius: '15px', 
                padding: '20px', 
                border: `1px solid ${isRead ? colors.border : colors.primary}`, 
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                {!isRead && (
                  <div style={{ position: 'absolute', top: '15px', right: '15px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.primary }} />
                )}
                
                {canManageNews && (
                  <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditNews(news.id)}
                      style={{
                        background: colors.border,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteNews(news.id)}
                      style={{
                        background: colors.error + '20',
                        color: colors.error,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                )}
                
                <h2 style={{ color: colors.text, fontSize: '1.2rem', marginBottom: '10px', marginTop: canManageNews ? '20px' : '0' }}>
                  {news.title}
                </h2>
                <p style={{ color: colors.textSecondary, marginBottom: '15px', lineHeight: '1.6' }}>
                  {news.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: colors.textSecondary }}>
                  <span>📅 {new Date(news.publication_date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                  <span>👁️ {news.read_by.length} {language === 'ar' ? 'قراءة' : 'reads'}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {newsData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📢</div>
            <p>{language === 'ar' ? 'لا توجد أخبار حالياً' : 'No news available'}</p>
          </div>
        )}
      </div>
    );
  };

  // More Page Component - Premium Elegant Design
  const MorePage: React.FC = () => {
    const handleLogout = () => {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setCurrentPage('home');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentPage');
    };

    const getRoleDisplayName = (role: string) => {
      switch (role) {
        case 'superuser': return 'المدير العام';
        case 'leitung': return 'قائد الحلقات';
        case 'lehrer': return 'الشيخ المعلم';
        case 'student': return 'الطالب';
        default: return role;
      }
    };

    return (
      <div style={{ 
        padding: '24px', 
        background: `linear-gradient(135deg, ${colors.background} 0%, ${theme === 'light' ? '#f8f9fa' : '#1a1d29'} 100%)`,
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Simple Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '24px',
          padding: '20px'
        }}>
          <h1 style={{ 
            color: colors.text, 
            fontSize: '1.8rem', 
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>
            {t.more}
          </h1>
          <p style={{ 
            color: colors.textSecondary, 
            fontSize: '0.9rem',
            margin: 0
          }}>
            إعدادات ومعلومات التطبيق
          </p>
        </div>
        
        <div style={{ display: 'grid', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
          {/* Settings Section - Premium */}
          <div style={{ 
            background: `linear-gradient(135deg, ${colors.surface} 0%, ${theme === 'light' ? '#ffffff' : '#2a2d3a'} 100%)`,
            borderRadius: '20px', 
            padding: '28px', 
            border: `1px solid ${colors.primary}20`,
            boxShadow: theme === 'light' ? '0 12px 40px rgba(0,0,0,0.08)' : '0 12px 40px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ 
              color: colors.text, 
              marginBottom: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              <span style={{ 
                fontSize: '1.8rem',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>⚙️</span>
              {t.settings}
            </h3>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Language Setting */}
              <div style={{ 
                background: theme === 'light' ? '#f8f9fa' : '#353849',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ color: colors.text, fontWeight: '600', marginBottom: '4px' }}>{t.language}</div>
                  <div style={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                    {language === 'ar' ? 'العربية - الواجهة الرئيسية' : 'English - Main Interface'}
                  </div>
                </div>
                <button 
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} 
                  style={{ 
                    padding: '12px 20px', 
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    minWidth: '100px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                >
                  {language === 'ar' ? 'English' : 'العربية'}
                </button>
              </div>
              
              {/* Theme Setting */}
              <div style={{ 
                background: theme === 'light' ? '#f8f9fa' : '#353849',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ color: colors.text, fontWeight: '600', marginBottom: '4px' }}>{t.theme}</div>
                  <div style={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                    {theme === 'light' ? 'المظهر الفاتح - سهل على العين' : 'المظهر الداكن - مريح ليلاً'}
                  </div>
                </div>
                <button 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                  style={{ 
                    padding: '12px 20px', 
                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    minWidth: '100px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                >
                  {theme === 'light' ? '🌙 داكن' : '☀️ فاتح'}
                </button>
              </div>
            </div>
          </div>

          {/* User Info - Simple */}
          <div style={{ 
            background: `linear-gradient(135deg, ${colors.surface} 0%, ${theme === 'light' ? '#ffffff' : '#2a2d3a'} 100%)`,
            borderRadius: '20px', 
            padding: '28px', 
            border: `1px solid ${colors.primary}20`,
            boxShadow: theme === 'light' ? '0 12px 40px rgba(0,0,0,0.08)' : '0 12px 40px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ 
              color: colors.text, 
              marginBottom: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              <span style={{ 
                fontSize: '1.8rem',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>👤</span>
              معلومات المستخدم
            </h3>
            
            <div style={{ 
              background: theme === 'light' ? '#f8f9fa' : '#353849',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textSecondary, fontWeight: '500' }}>الاسم</span>
                  <span style={{ color: colors.text, fontWeight: '600' }}>{currentUser?.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textSecondary, fontWeight: '500' }}>الدور</span>
                  <span style={{ color: colors.text, fontWeight: '600' }}>{getRoleDisplayName(currentUser?.role || '')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textSecondary, fontWeight: '500' }}>تاريخ التسجيل</span>
                  <span style={{ color: colors.text, fontWeight: '600' }}>{new Date(currentUser?.created_at || '').toLocaleDateString('ar-SA')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textSecondary, fontWeight: '500' }}>حالة الاتصال</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: currentUser?.isOnline ? '#10b981' : '#6b7280',
                      boxShadow: currentUser?.isOnline ? '0 0 8px #10b98150' : 'none'
                    }} />
                    <span style={{ color: colors.text, fontWeight: '600' }}>
                      {currentUser?.isOnline ? 'متصل' : 'غير متصل'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App Info - Premium */}
          <div style={{ 
            background: `linear-gradient(135deg, ${colors.surface} 0%, ${theme === 'light' ? '#ffffff' : '#2a2d3a'} 100%)`,
            borderRadius: '20px', 
            padding: '28px', 
            border: `1px solid ${colors.primary}20`,
            boxShadow: theme === 'light' ? '0 12px 40px rgba(0,0,0,0.08)' : '0 12px 40px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ 
              color: colors.text, 
              marginBottom: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              <span style={{ 
                fontSize: '1.8rem',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>📱</span>
              معلومات التطبيق
            </h3>
            
            <div style={{ 
              background: theme === 'light' ? '#f8f9fa' : '#353849',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textSecondary, fontWeight: '500' }}>اسم التطبيق</span>
                  <span style={{ color: colors.text, fontWeight: '600' }}>معونة المتعلم</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textSecondary, fontWeight: '500' }}>الإصدار</span>
                  <span style={{ color: colors.text, fontWeight: '600' }}>v2.0.0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textSecondary, fontWeight: '500' }}>المطور</span>
                  <span style={{ color: colors.text, fontWeight: '600' }}>فريق معونة المتعلم</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textSecondary, fontWeight: '500' }}>النوع</span>
                  <span style={{ color: colors.text, fontWeight: '600' }}>نظام إدارة التعلم الإسلامي</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button - Premium */}
          <button 
            onClick={handleLogout} 
            style={{ 
              background: `linear-gradient(135deg, #ef4444, #dc2626)`,
              color: 'white', 
              border: 'none', 
              borderRadius: '16px', 
              padding: '20px', 
              fontSize: '1.1rem', 
              fontWeight: '600',
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
              transition: 'all 0.3s ease',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.25)';
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>🚪</span>
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
      case 'halaqat': return <HalaqatPage />;
      case 'users': return <UsersPage />;
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

              {/* Fixed Overlay Audio Player - Outside all components */}
        {audioPlayer && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            borderRadius: '12px',
            color: 'white',
            zIndex: 10000,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            width: '90%',
            maxWidth: '400px'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>🎧 {audioPlayer.title}</h3>
              <button 
                onClick={() => setAudioPlayer(null)}
                style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  border: 'none', 
                  color: 'white', 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  cursor: 'pointer', 
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Simple Native Audio */}
            {/* Device Detection & Smart Info */}
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
              <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <span>📱 {/iPhone|iPad|iPod/.test(navigator.userAgent) ? 'iOS' : 
                        /Android/.test(navigator.userAgent) ? 'Android' : 
                        'Desktop'}</span>
                <span>📁 {(audioPlayer.url.match(/[\d.-]+\s*MB/) || ['16MB'])[0]}</span>
              </div>
              <div style={{ wordBreak: 'break-all', opacity: 0.6 }}>
                🔗 {audioPlayer.url.split('/').pop()?.substring(0, 30)}...
              </div>
            </div>
            
            {/* Universal Mobile-Compatible Audio Player */}
            <audio 
              controls
              preload="metadata"
              playsInline
              webkit-playsinline="true"
              controlsList="nodownload"
              style={{ 
                width: '100%', 
                marginBottom: '15px',
                height: '44px', // Optimized for all mobile browsers
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
              onLoadStart={() => console.log('🔄 Loading:', audioPlayer.url)}
              onCanPlay={() => console.log('✅ Ready to play')}
              onError={(e) => {
                console.error('❌ Audio error:', e.currentTarget.error?.code);
                // Auto-fallback suggestion
                const fallbackMsg = e.currentTarget.error?.code === 4 ? 
                  'Try download button below' : 'Check network connection';
                console.log('💡 Suggestion:', fallbackMsg);
              }}
            >
              {/* Multiple source formats for maximum compatibility */}
              <source src={audioPlayer.url} type="audio/mpeg" />
              <source src={audioPlayer.url} type="audio/mp3" />
              <source src={audioPlayer.url} type="audio/wav" />
              <source src={audioPlayer.url.replace('.mp3', '.ogg')} type="audio/ogg" />
              Audio playback not supported on this device.
            </audio>
            
            {/* Mobile Compatibility Tips */}
            <div style={{ 
              fontSize: '10px', 
              color: 'rgba(255,255,255,0.6)', 
              textAlign: 'center',
              marginBottom: '10px',
              lineHeight: '1.3'
            }}>
              💡 Tip: If audio doesn't play, try the download button or check your device's media settings
            </div>
            
            {/* Download Link */}
            <div style={{ textAlign: 'center' }}>
              <a 
                href={audioPlayer.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}
              >
                📥 Download MP3
              </a>
            </div>
          </div>
        )}

        {/* Overlay Background */}
        {audioPlayer && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 9999
            }}
            onClick={() => setAudioPlayer(null)}
          />
        )}

        {/* Timer Modal */}
      <TimerModal />



      {/* Threshold Modal */}
      <ThresholdModal />

      {/* Bottom Navigation - Smaller Height */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: colors.surface, borderTop: `1px solid ${colors.border}`, padding: '6px 0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000, direction: 'ltr' }}>
        {getNavigationItems(currentUser?.role || '').map(item => {
          const unreadNews = newsData.filter(n => !n.read_by.includes(currentUser?.id || '')).length;
          
          return (
            <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', color: currentPage === item.id ? colors.primary : colors.textSecondary, fontSize: '11px', position: 'relative', padding: '3px', transition: 'color 0.2s' }}>
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
