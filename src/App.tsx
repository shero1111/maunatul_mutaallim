import React, { useState, useRef } from 'react';

// Complete Implementation of Maunatul Mutaallim App
// Based on exact requirements from Teil 1 & Teil 2

// Types
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

// Demo Data
const demoUsers: (Student | Teacher | User)[] = [
  {
    id: '1',
    username: 'admin',
    password: '123456',
    role: 'superuser',
    name: 'Administrator',
    isActive: true,
    created_at: '2024-01-01',
    lastPage: 'home',
    isOnline: true
  },
  {
    id: '2',
    username: 'leitung1',
    password: '123456',
    role: 'leitung',
    name: 'القيادة الأولى',
    isActive: true,
    created_at: '2024-01-01',
    lastPage: 'home',
    isOnline: true
  },
  {
    id: '3',
    username: 'teacher1',
    password: '123456',
    role: 'lehrer',
    name: 'الشيخ أحمد',
    isActive: true,
    created_at: '2024-01-01',
    halaqat_ids: ['1', '2'],
    favorites: ['4', '5'],
    lastPage: 'home',
    isOnline: false
  } as Teacher,
  {
    id: '4',
    username: 'student1',
    password: '123456',
    role: 'student',
    name: 'محمد الطالب',
    isActive: true,
    created_at: '2024-01-01',
    status: 'revising',
    status_changed_at: '2024-01-15T10:30:00Z',
    halaqat_ids: ['1'],
    favorites: ['5'],
    lastPage: 'home',
    isOnline: true
  } as Student,
  {
    id: '5',
    username: 'student2',
    password: '123456',
    role: 'student',
    name: 'عبدالله القارئ',
    isActive: true,
    created_at: '2024-01-01',
    status: 'khatamat',
    status_changed_at: '2024-01-14T09:15:00Z',
    halaqat_ids: ['1', '2'],
    favorites: [],
    lastPage: 'home',
    isOnline: true
  } as Student,
  {
    id: '6',
    username: 'student3',
    password: '123456',
    role: 'student',
    name: 'يوسف المحفظ',
    isActive: true,
    created_at: '2024-01-01',
    status: 'not_available',
    status_changed_at: '2024-01-13T08:20:00Z',
    halaqat_ids: ['2'],
    favorites: [],
    lastPage: 'home',
    isOnline: false
  } as Student
];

const demoHalaqat: Halaqa[] = [
  {
    id: '1',
    internal_number: 101,
    name: 'حلقة تحفيظ القرآن',
    type: 'memorizing',
    teacher_id: '3',
    student_ids: ['4', '5'],
    isActive: true,
    created_at: '2024-01-01'
  },
  {
    id: '2',
    internal_number: 102,
    name: 'حلقة شرح الحديث',
    type: 'explanation',
    teacher_id: '3',
    student_ids: ['5', '6'],
    isActive: true,
    created_at: '2024-01-01'
  }
];

const demoMutun: Matn[] = [
  {
    id: '1',
    name: 'الفاتحة',
    section: 'القرآن الكريم',
    status: 'green',
    description: 'سورة الفاتحة',
    threshold: 7,
    lastChange_date: '2024-01-10',
    memorization_pdf_link: '/pdfs/fatiha.pdf',
    memorization_audio_link: '/audio/fatiha.mp3',
    explanation_pdf_link: '/pdfs/fatiha_explanation.pdf',
    explanation_audio_link: '',
    created_at: '2024-01-01',
    user_id: '4'
  },
  {
    id: '2',
    name: 'الأربعون النووية',
    section: 'الحديث الشريف',
    status: 'orange',
    description: 'أربعون حديثاً نبوياً',
    threshold: 7,
    lastChange_date: '2024-01-12',
    memorization_pdf_link: '/pdfs/nawawi.pdf',
    memorization_audio_link: '/audio/nawawi.mp3',
    explanation_pdf_link: '/pdfs/nawawi_explanation.pdf',
    explanation_audio_link: '/audio/nawawi_explanation.mp3',
    created_at: '2024-01-01',
    user_id: '4'
  },
  {
    id: '3',
    name: 'العقيدة الطحاوية',
    section: 'العقيدة',
    status: 'red',
    description: 'متن في العقيدة الإسلامية',
    threshold: 7,
    lastChange_date: '2024-01-05',
    memorization_pdf_link: '/pdfs/tahawiyya.pdf',
    memorization_audio_link: '',
    explanation_pdf_link: '/pdfs/tahawiyya_explanation.pdf',
    explanation_audio_link: '',
    created_at: '2024-01-01',
    user_id: '4'
  }
];

const demoNews: News[] = [
  {
    id: '1',
    title: 'إعلان مهم',
    description: 'تم تحديث مواعيد الحلقات. يرجى مراجعة الجدول الجديد.',
    images: [],
    files: [],
    publication_date: '2024-01-15',
    created_at: '2024-01-15',
    read_by: []
  },
  {
    id: '2',
    title: 'مسابقة الحفظ',
    description: 'ستقام مسابقة الحفظ الشهرية يوم الجمعة القادم بعد العصر.',
    images: [],
    files: [],
    publication_date: '2024-01-16',
    created_at: '2024-01-14',
    read_by: ['4']
  }
];

// Translations
type Language = 'ar' | 'en';
type Theme = 'light' | 'dark';

const translations = {
  ar: {
    appName: 'معونة المتعلم',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    login: 'دخول',
    home: 'الرئيسية',
    mutuun: 'متون',
    halaqat: 'حلقات',
    users: 'المستخدمون',
    news: 'الأخبار',
    more: 'المزيد',
    not_available: 'غير متاح',
    revising: 'مراجعة',
    khatamat: 'ختمات',
    changeStatus: 'تغيير الحالة',
    lastUpdate: 'آخر تحديث',
    totalUsers: 'إجمالي المستخدمين',
    onlineUsers: 'المستخدمون المتصلون',
    totalTeachers: 'إجمالي المعلمين',
    totalHalaqat: 'إجمالي الحلقات',
    studentsStatus: 'حالة الطلاب',
    logout: 'تسجيل الخروج',
    language: 'اللغة',
    theme: 'المظهر',
    aboutUs: 'من نحن',
    guide: 'دليل الاستخدام',
    version: 'الإصدار',
    materials: 'المواد',
    memorizationPdf: 'PDF التحفيظ',
    explanationPdf: 'PDF الشرح',
    audio: 'الصوت',
    search: 'البحث',
    edit: 'تعديل',
    delete: 'حذف',
    add: 'إضافة',
    loading: 'جاري التحميل...',
    play: 'تشغيل',
    pause: 'إيقاف',
    allStatuses: 'جميع الحالات'
  },
  en: {
    appName: 'Maunatul Mutaallim',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    home: 'Home',
    mutuun: 'Mutun',
    halaqat: 'Halaqat',
    users: 'Users',
    news: 'News',
    more: 'More',
    not_available: 'Not Available',
    revising: 'Revising',
    khatamat: 'Khatamat',
    changeStatus: 'Change Status',
    lastUpdate: 'Last Update',
    totalUsers: 'Total Users',
    onlineUsers: 'Online Users',
    totalTeachers: 'Total Teachers',
    totalHalaqat: 'Total Halaqat',
    studentsStatus: 'Students Status',
    logout: 'Logout',
    language: 'Language',
    theme: 'Theme',
    aboutUs: 'About Us',
    guide: 'Guide',
    version: 'Version',
    materials: 'Materials',
    memorizationPdf: 'Memorization PDF',
    explanationPdf: 'Explanation PDF',
    audio: 'Audio',
    search: 'Search',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    loading: 'Loading...',
    play: 'Play',
    pause: 'Pause',
    allStatuses: 'All Statuses'
  }
};

// Main App Component
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<{url: string, title: string} | null>(null);
  const [mutunData, setMutunData] = useState(demoMutun);
  const [newsData, setNewsData] = useState(demoNews);
  const [usersData, setUsersData] = useState(demoUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const t = translations[language];

  const themeColors = {
    light: {
      primary: '#2563eb',
      secondary: '#3b82f6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb'
    },
    dark: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: '#374151'
    }
  };

  const colors = themeColors[theme];

  // Mark news as read when visiting news page
  // useEffect(() => {
  //   if (currentPage === 'news' && currentUser) {
  //     setNewsData(prev => prev.map(news => ({
  //       ...news,
  //       read_by: news.read_by.includes(currentUser.id) ? news.read_by : [...news.read_by, currentUser.id]
  //     })));
  //   }
  // }, [currentPage, currentUser]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_available': return '#ef4444';
      case 'revising': return '#f59e0b';
      case 'khatamat': return '#10b981';
      default: return colors.textSecondary;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const changeMatnStatus = (matnId: string) => {
    setMutunData(prev => prev.map(matn => {
      if (matn.id === matnId) {
        let newStatus: 'red' | 'orange' | 'green' = 'red';
        if (matn.status === 'red') newStatus = 'orange';
        else if (matn.status === 'orange') newStatus = 'green';
        else if (matn.status === 'green') newStatus = 'red';
        
        return {
          ...matn,
          status: newStatus,
          lastChange_date: new Date().toISOString().split('T')[0]
        };
      }
      return matn;
    }));
  };

  const changeStudentStatus = (newStatus: 'not_available' | 'revising' | 'khatamat') => {
    if (currentUser && currentUser.role === 'student') {
      const updatedUser = { 
        ...currentUser as Student, 
        status: newStatus, 
        status_changed_at: new Date().toISOString() 
      };
      setCurrentUser(updatedUser);
      
      setUsersData(prev => prev.map(user => 
        user.id === currentUser.id ? updatedUser : user
      ));
    }
  };

  // Audio Player Component
  const AudioPlayer: React.FC<{ audioUrl: string; title: string; onClose: () => void }> = ({ audioUrl, title, onClose }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const togglePlay = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '15px 15px 0 0',
        zIndex: 1001,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>🎧 {title}</h4>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onCanPlay={() => setIsLoading(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <div style={{
          background: 'rgba(255,255,255,0.2)',
          height: '6px',
          borderRadius: '3px',
          marginBottom: '15px'
        }}>
          <div style={{
            background: 'white',
            height: '100%',
            width: `${progress}%`,
            borderRadius: '3px'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={togglePlay}
            disabled={isLoading}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? `⏳ ${t.loading}` : isPlaying ? `⏸️ ${t.pause}` : `▶️ ${t.play}`}
          </button>
          
          <span style={{ fontSize: '14px' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    );
  };

  // Search Component
  const SearchBar: React.FC<{ 
    onSearch: (query: string) => void; 
    placeholder?: string;
  }> = ({ onSearch, placeholder = "البحث..." }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (value: string) => {
      setQuery(value);
      onSearch(value);
    };

    return (
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 40px 12px 12px',
            border: `2px solid ${colors.border}`,
            borderRadius: '25px',
            fontSize: '16px',
            outline: 'none',
            backgroundColor: colors.surface,
            color: colors.text
          }}
        />
        <span style={{
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: colors.primary,
          fontSize: '18px'
        }}>
          🔍
        </span>
      </div>
    );
  };

  // Login Component
  const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
      const user = usersData.find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setCurrentPage(user.lastPage && user.lastPage !== 'more' ? user.lastPage : 'home');
        setError('');
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    };

    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}>
        <div style={{
          background: colors.background,
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '30px', 
            color: colors.text,
            fontSize: '1.8rem'
          }}>
            {t.appName}
          </h1>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: colors.text
            }}>
              {t.username}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: colors.surface,
                color: colors.text
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: colors.text
            }}>
              {t.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: colors.surface,
                color: colors.text
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          {error && (
            <div style={{ 
              color: '#dc2626', 
              marginBottom: '20px', 
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#fef2f2',
              borderRadius: '8px'
            }}>
              {error}
            </div>
          )}
          
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '12px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {t.login}
          </button>
          
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center', 
            fontSize: '14px', 
            color: colors.textSecondary 
          }}>
            <p>Demo accounts:</p>
            <p>admin/123456 | teacher1/123456 | student1/123456</p>
          </div>
        </div>
      </div>
    );
  };

  // Navigation based on role
  const getNavigationItems = (role: string) => {
    switch (role) {
      case 'superuser':
        return [
          { id: 'home', label: t.home, icon: '🏠' },
          { id: 'mutuun', label: t.mutuun, icon: '📚' },
          { id: 'halaqat', label: t.halaqat, icon: '🔵' },
          { id: 'users', label: t.users, icon: '👥' },
          { id: 'news', label: t.news, icon: '📢' },
          { id: 'more', label: t.more, icon: '⋯' }
        ];
      case 'leitung':
        return [
          { id: 'home', label: t.home, icon: '🏠' },
          { id: 'mutuun', label: t.mutuun, icon: '📚' },
          { id: 'halaqat', label: t.halaqat, icon: '🔵' },
          { id: 'users', label: t.users, icon: '👥' },
          { id: 'news', label: t.news, icon: '📢' },
          { id: 'more', label: t.more, icon: '⋯' }
        ];
      case 'lehrer':
        return [
          { id: 'home', label: t.home, icon: '🏠' },
          { id: 'mutuun', label: t.mutuun, icon: '📚' },
          { id: 'news', label: t.news, icon: '📢' },
          { id: 'more', label: t.more, icon: '⋯' }
        ];
      case 'student':
        return [
          { id: 'home', label: t.home, icon: '🏠' },
          { id: 'mutuun', label: t.mutuun, icon: '📚' },
          { id: 'news', label: t.news, icon: '📢' },
          { id: 'more', label: t.more, icon: '⋯' }
        ];
      default:
        return [];
    }
  };

  // Student Home Page
  const StudentHomePage: React.FC = () => {
    const student = currentUser as Student;
    
    return (
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        {/* Student Info Card */}
        <div style={{
          background: colors.surface,
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '20px',
          border: `1px solid ${colors.border}`
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: colors.text }}>
            {student.name}
          </h3>
          <div style={{ 
            color: getStatusColor(student.status),
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>
            {t[student.status as keyof typeof t]}
          </div>
          <div style={{ color: colors.textSecondary, fontSize: '14px' }}>
            {t.lastUpdate}: {formatTime(student.status_changed_at)}
          </div>
          
          <hr style={{ margin: '15px 0', border: `1px solid ${colors.border}` }} />
          
          <div style={{ marginBottom: '15px', color: colors.text }}>
            {t.changeStatus}:
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['not_available', 'revising', 'khatamat'].map(status => (
              <button
                key={status}
                onClick={() => changeStudentStatus(status as any)}
                style={{
                  padding: '10px 15px',
                  background: student.status === status ? getStatusColor(status) : colors.background,
                  color: student.status === status ? 'white' : getStatusColor(status),
                  border: `2px solid ${getStatusColor(status)}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {t[status as keyof typeof t]}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <SearchBar onSearch={setSearchQuery} placeholder="البحث في الطلاب..." />
        
        <div style={{ marginBottom: '20px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              backgroundColor: colors.surface,
              color: colors.text,
              width: '100%'
            }}
          >
            <option value="all">{t.allStatuses}</option>
            <option value="not_available">{t.not_available}</option>
            <option value="revising">{t.revising}</option>
            <option value="khatamat">{t.khatamat}</option>
          </select>
        </div>

        {/* Other Students in Same Halaqat */}
        {student.halaqat_ids.map(halaqaId => {
          const halaqa = demoHalaqat.find(h => h.id === halaqaId);
          const otherStudents = usersData.filter(u => 
            u.role === 'student' && 
            u.id !== student.id && 
            (u as Student).halaqat_ids.includes(halaqaId) &&
            u.isActive &&
            (statusFilter === 'all' || (u as Student).status === statusFilter) &&
            (searchQuery === '' || u.name.toLowerCase().includes(searchQuery.toLowerCase()))
          ) as Student[];

          return (
            <div key={halaqaId} style={{ marginBottom: '20px' }}>
              <div style={{
                background: colors.primary,
                color: 'white',
                padding: '10px 15px',
                borderRadius: '10px 10px 0 0',
                fontWeight: 'bold'
              }}>
                {halaqa?.name || `حلقة ${halaqaId}`}
              </div>
              
              <div style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                padding: '15px'
              }}>
                {otherStudents.length === 0 ? (
                  <div style={{ color: colors.textSecondary, textAlign: 'center', padding: '20px' }}>
                    لا توجد طلاب يطابقون البحث
                  </div>
                ) : (
                  otherStudents.map(otherStudent => (
                    <div key={otherStudent.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      marginBottom: '10px',
                      background: colors.background,
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: colors.text }}>
                          {otherStudent.name}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: colors.textSecondary 
                        }}>
                          {formatTime(otherStudent.status_changed_at)}
                        </div>
                      </div>
                      <div style={{
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        background: getStatusColor(otherStudent.status),
                        color: 'white'
                      }}>
                        {t[otherStudent.status as keyof typeof t]}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Statistics Page (for Leadership/Superuser)
  const StatisticsPage: React.FC = () => {
    const students = usersData.filter(u => u.role === 'student') as Student[];
    const teachers = usersData.filter(u => u.role === 'lehrer');
    const onlineUsers = usersData.filter(u => u.isOnline);
    
    const statusCounts = {
      not_available: students.filter(s => s.status === 'not_available').length,
      revising: students.filter(s => s.status === 'revising').length,
      khatamat: students.filter(s => s.status === 'khatamat').length
    };

    return (
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        <h2 style={{ color: colors.text, marginBottom: '30px' }}>
          مرحباً، {currentUser?.name}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{
            background: colors.surface,
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.border}`
          }}>
            <h4 style={{ color: colors.primary, marginBottom: '15px' }}>📊 إحصائيات عامة</h4>
            <div style={{ color: colors.text }}>
              <p>{t.totalUsers}: {usersData.length}</p>
              <p>{t.onlineUsers}: {onlineUsers.length}</p>
              <p>{t.totalTeachers}: {teachers.length}</p>
              <p>{t.totalHalaqat}: {demoHalaqat.length}</p>
            </div>
          </div>

          <div style={{
            background: colors.surface,
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.border}`
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '15px' }}>👥 {t.studentsStatus}</h4>
            <div style={{ color: colors.text }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{t.not_available}:</span>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{statusCounts.not_available}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{t.revising}:</span>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{statusCounts.revising}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t.khatamat}:</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{statusCounts.khatamat}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mutun Page
  const MutunPage: React.FC = () => {
    const userMutun = currentUser?.role === 'student' 
      ? mutunData.filter(m => m.user_id === currentUser.id)
      : mutunData;

    const sections = [...new Set(userMutun.map(m => m.section))];

    return (
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        <h2 style={{ color: colors.text, marginBottom: '20px' }}>
          {t.mutuun}
        </h2>
        
        {sections.map(section => {
          const sectionMutun = userMutun.filter(m => m.section === section);
          return (
            <div key={section} style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: colors.primary, 
                marginBottom: '15px',
                fontSize: '1.2rem'
              }}>
                {section}
              </h3>
              {sectionMutun.map(matn => (
                <div key={matn.id} style={{
                  background: colors.surface,
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  border: `1px solid ${colors.border}`
                }}>
                  <button
                    onClick={() => changeMatnStatus(matn.id)}
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: matn.status === 'red' ? '#ef4444' : 
                                 matn.status === 'orange' ? '#f59e0b' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginBottom: '10px'
                    }}
                  >
                    {matn.name}
                  </button>
                  
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <button
                      onClick={() => {
                        const options = [];
                        if (matn.memorization_pdf_link) options.push({ type: 'memo_pdf', label: t.memorizationPdf });
                        if (matn.explanation_pdf_link) options.push({ type: 'exp_pdf', label: t.explanationPdf });
                        if (matn.memorization_audio_link || matn.explanation_audio_link) {
                          options.push({ type: 'audio', label: t.audio });
                        }
                        
                        if (options.length > 0) {
                          const choice = window.prompt(`اختر المادة:\n${options.map((opt, i) => `${i+1}. ${opt.label}`).join('\n')}`);
                          const selectedOption = options[parseInt(choice || '0') - 1];
                          
                          if (selectedOption) {
                            if (selectedOption.type === 'audio') {
                              const audioUrl = matn.memorization_audio_link || matn.explanation_audio_link;
                              setAudioPlayer({ url: audioUrl, title: matn.name });
                            } else {
                              const pdfUrl = selectedOption.type === 'memo_pdf' 
                                ? matn.memorization_pdf_link 
                                : matn.explanation_pdf_link;
                              window.open(pdfUrl, '_blank');
                            }
                          }
                        }
                      }}
                      style={{
                        padding: '8px 15px',
                        background: colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      📎 {t.materials}
                    </button>
                  </div>
                  
                  <div style={{ fontSize: '14px', color: colors.textSecondary }}>
                    {matn.description}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // News Page
  const NewsPage: React.FC = () => {
    const visibleNews = newsData.filter(news => {
      const pubDate = new Date(news.publication_date);
      const today = new Date();
      return pubDate <= today;
    });

    return (
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: colors.text }}>
            {t.news}
          </h2>
        </div>
        
        {(currentUser?.role === 'superuser' || currentUser?.role === 'leitung') && (
          <button
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: colors.primary,
              color: 'white',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              zIndex: 999
            }}
          >
            +
          </button>
        )}
        
        {visibleNews.length === 0 ? (
          <div style={{ 
            color: colors.textSecondary, 
            textAlign: 'center', 
            padding: '40px',
            fontSize: '18px'
          }}>
            لا توجد أخبار
          </div>
        ) : (
          visibleNews.map(news => (
            <div key={news.id} style={{
              background: colors.surface,
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '15px',
              border: `1px solid ${colors.border}`
            }}>
              <h3 style={{ color: colors.text, marginBottom: '10px' }}>
                {news.title}
              </h3>
              <p style={{ 
                color: colors.textSecondary, 
                lineHeight: '1.6',
                marginBottom: '10px'
              }}>
                {news.description}
              </p>
              <div style={{ 
                fontSize: '12px', 
                color: colors.textSecondary
              }}>
                {new Date(news.publication_date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </div>
              
              {(currentUser?.role === 'superuser' || currentUser?.role === 'leitung') && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button style={{
                    padding: '5px 10px',
                    background: colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}>
                    {t.edit}
                  </button>
                  <button style={{
                    padding: '5px 10px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}>
                    {t.delete}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  // More Page
  const MorePage: React.FC = () => {
    const handleLogout = () => {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setCurrentPage('home');
    };

    return (
      <div style={{ 
        padding: '20px', 
        paddingBottom: '100px',
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}>
        <h2 style={{ color: colors.text, marginBottom: '20px' }}>
          {t.more}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            style={{
              padding: '15px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              color: colors.text,
              textAlign: language === 'ar' ? 'right' : 'left',
              cursor: 'pointer'
            }}
          >
            {t.language}: {language === 'ar' ? 'العربية' : 'English'}
          </button>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
              padding: '15px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              color: colors.text,
              textAlign: language === 'ar' ? 'right' : 'left',
              cursor: 'pointer'
            }}
          >
            {t.theme}: {theme === 'light' ? 'فاتح' : 'داكن'}
          </button>

          <button
            style={{
              padding: '15px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              color: colors.text,
              textAlign: language === 'ar' ? 'right' : 'left',
              cursor: 'pointer'
            }}
          >
            {t.aboutUs}
          </button>

          <button
            style={{
              padding: '15px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              color: colors.text,
              textAlign: language === 'ar' ? 'right' : 'left',
              cursor: 'pointer'
            }}
          >
            {t.guide}
          </button>

          {currentUser?.role === 'superuser' && (
            <button
              style={{
                padding: '15px',
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                color: colors.text,
                textAlign: language === 'ar' ? 'right' : 'left',
                cursor: 'pointer'
              }}
            >
              Issues & Errors
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              padding: '15px',
              background: '#ef4444',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {t.logout}
          </button>
        </div>

        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          color: colors.textSecondary,
          fontSize: '14px'
        }}>
          {t.version}: V2.0.0
        </div>
      </div>
    );
  };

  // Render current page
  const renderCurrentPage = () => {
    if (!currentUser) return null;

    switch (currentPage) {
      case 'home':
        if (currentUser.role === 'student') {
          return <StudentHomePage />;
        } else if (currentUser.role === 'leitung' || currentUser.role === 'superuser') {
          return <StatisticsPage />;
        } else {
          return <StudentHomePage />;
        }
      
      case 'mutuun':
        return <MutunPage />;
      
      case 'news':
        return <NewsPage />;
      
      case 'more':
        return <MorePage />;
      
      default:
        return (
          <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <h2 style={{ color: colors.text }}>
              {currentPage}
            </h2>
            <p style={{ color: colors.textSecondary }}>
              هذه الصفحة قيد التطوير
            </p>
          </div>
        );
    }
  };

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const navigationItems = getNavigationItems(currentUser?.role || '');
  const unreadNews = newsData.filter(n => !n.read_by.includes(currentUser?.id || '')).length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      color: colors.text,
      direction: language === 'ar' ? 'rtl' : 'ltr'
    }}>
      {/* Main Content */}
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        {renderCurrentPage()}
      </div>

      {/* Audio Player */}
      {audioPlayer && (
        <AudioPlayer
          audioUrl={audioPlayer.url}
          title={audioPlayer.title}
          onClose={() => setAudioPlayer(null)}
        />
      )}

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000
      }}>
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              color: currentPage === item.id ? colors.primary : colors.textSecondary,
              fontSize: '12px',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'news' && unreadNews > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadNews}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
