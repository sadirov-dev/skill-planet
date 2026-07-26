// Comprehensive TypeScript types for SkillPlanet (Student, Teacher, Admin portals)

export type Theme = 'dark' | 'light';

export type Page =
  | 'auth'
  | 'landing'
  | 'catalog'
  | 'student-dashboard'
  | 'student-leaderboard'
  | 'teacher-dashboard'
  | 'teacher-editor'
  | 'teacher-community'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-teachers'
  | 'admin-activity'
  | 'lesson';

export type UserRole = 'student' | 'teacher' | 'admin';

export type CourseLevel =
  | 'Beginner'
  | 'Elementary'
  | 'Pre-Intermediate'
  | 'Intermediate'
  | 'Upper-Intermediate'
  | 'Advanced'
  | 'Pro';

export type SkillType =
  | 'Grammar'
  | 'Reading'
  | 'Listening'
  | 'Speaking'
  | 'Writing'
  | 'Vocabulary'
  | 'Homework'
  | 'Theory'
  | 'Practice'
  | 'Quiz';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
  banned?: boolean;
  joinedAt: string;
  subject?: string;
  studentsCount?: number;
  rating?: number;
  xp?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  rating: number;
  reviewCount: number;
  teacherName: string;
  teacherAvatar?: string;
  price: number;
  priceType: 'free' | 'paid';
  thumbnail: string;
  duration: string;
  studentsCount: number;
  tags: string[];
  levelsSupported?: CourseLevel[];
  curriculum: Module[];
  prerequisites: string[];
  approved: boolean;
}

export interface Module {
  id: string;
  title: string;
  level?: CourseLevel;
  skillType?: SkillType;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
  type: 'video' | 'text' | 'quiz' | 'audio' | 'speaking' | 'writing';
  skillType?: SkillType;
  level?: CourseLevel;
  videoUrl?: string;
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Homework {
  id: string;
  title: string;
  courseName: string;
  skillType?: SkillType;
  studentName?: string;
  studentAvatar?: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
  feedback?: string;
}

export interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

export interface EnrolledCourse {
  courseId: string;
  title: string;
  teacherName: string;
  progress: number;
  thumbnail: string;
  category: string;
  lastLesson: string;
  nextLesson: string;
  totalLessons: number;
  completedLessons: number;
  level?: CourseLevel;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  coursesCompleted: number;
  badge: string;
}

export interface TeacherDirectory {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  category: 'IT & AI' | 'Языки' | 'Шахматы';
  rating: number;
  studentsCount: number;
  coursesCount: number;
  verified: boolean;
}

export interface ActivityLog {
  id: string;
  userName: string;
  userRole: UserRole;
  avatar: string;
  action: string;
  target: string;
  timestamp: string;
}
