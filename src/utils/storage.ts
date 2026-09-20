import {
  TeacherInfo,
  ClassItem,
  StudentItem,
  AssignmentItem,
  TeachingPlanItem,
  DailyAttendanceRecord,
  NotificationItem
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TEACHING_PLAN,
  INITIAL_NOTIFICATIONS
} from '../data/demoData';

export const DEFAULT_TEACHER_INFO: TeacherInfo = {
  name: "Nguyễn Văn Út",
  subject: "Hóa học",
  school: "THPT Dương Minh Châu",
  schoolYear: "2026 - 2027",
  semester: "Học kỳ I",
  email: "nguyenvanut.dmc@edu.vn",
  phone: "0912-345-678"
};

const KEYS = {
  TEACHER: 'hoa_hoc_thpt_teacher_v1',
  CLASSES: 'hoa_hoc_thpt_classes_v1',
  STUDENTS: 'hoa_hoc_thpt_students_v1',
  ASSIGNMENTS: 'hoa_hoc_thpt_assignments_v1',
  TEACHING_PLAN: 'hoa_hoc_thpt_teaching_plan_v1',
  ATTENDANCE: 'hoa_hoc_thpt_attendance_v1',
  NOTIFICATIONS: 'hoa_hoc_thpt_notifications_v1',
};

export const StorageService = {
  init(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(KEYS.TEACHER)) {
      this.saveTeacherInfo(DEFAULT_TEACHER_INFO);
    }
    if (!localStorage.getItem(KEYS.CLASSES)) {
      this.saveClasses(INITIAL_CLASSES);
    }
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      this.saveStudents(INITIAL_STUDENTS);
    }
    if (!localStorage.getItem(KEYS.ASSIGNMENTS)) {
      this.saveAssignments(INITIAL_ASSIGNMENTS);
    }
    if (!localStorage.getItem(KEYS.TEACHING_PLAN)) {
      this.saveTeachingPlans(INITIAL_TEACHING_PLAN);
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      this.saveNotifications(INITIAL_NOTIFICATIONS);
    }
  },

  getTeacherInfo(): TeacherInfo {
    if (typeof window === 'undefined') return DEFAULT_TEACHER_INFO;
    try {
      const data = localStorage.getItem(KEYS.TEACHER);
      if (!data) {
        this.saveTeacherInfo(DEFAULT_TEACHER_INFO);
        return DEFAULT_TEACHER_INFO;
      }
      return { ...DEFAULT_TEACHER_INFO, ...JSON.parse(data) };
    } catch {
      return DEFAULT_TEACHER_INFO;
    }
  },

  saveTeacherInfo(teacher: TeacherInfo): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.TEACHER, JSON.stringify(teacher));
  },

  getClasses(): ClassItem[] {
    if (typeof window === 'undefined') return INITIAL_CLASSES;
    try {
      const data = localStorage.getItem(KEYS.CLASSES);
      if (!data) {
        this.saveClasses(INITIAL_CLASSES);
        return INITIAL_CLASSES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CLASSES;
    }
  },

  saveClasses(classes: ClassItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes));
  },

  getStudents(): StudentItem[] {
    if (typeof window === 'undefined') return INITIAL_STUDENTS;
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      if (!data) {
        this.saveStudents(INITIAL_STUDENTS);
        return INITIAL_STUDENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents(students: StudentItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  },

  getAssignments(): AssignmentItem[] {
    if (typeof window === 'undefined') return INITIAL_ASSIGNMENTS;
    try {
      const data = localStorage.getItem(KEYS.ASSIGNMENTS);
      if (!data) {
        this.saveAssignments(INITIAL_ASSIGNMENTS);
        return INITIAL_ASSIGNMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  },

  saveAssignments(assignments: AssignmentItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  getTeachingPlans(): TeachingPlanItem[] {
    if (typeof window === 'undefined') return INITIAL_TEACHING_PLAN;
    try {
      const data = localStorage.getItem(KEYS.TEACHING_PLAN);
      if (!data) {
        this.saveTeachingPlans(INITIAL_TEACHING_PLAN);
        return INITIAL_TEACHING_PLAN;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TEACHING_PLAN;
    }
  },

  saveTeachingPlans(plans: TeachingPlanItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.TEACHING_PLAN, JSON.stringify(plans));
  },

  getDailyAttendance(): DailyAttendanceRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDailyAttendance(records: DailyAttendanceRecord[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
  },

  getNotifications(): NotificationItem[] {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (!data) {
        this.saveNotifications(INITIAL_NOTIFICATIONS);
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: NotificationItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  resetAllToDemo(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.CLASSES);
    localStorage.removeItem(KEYS.STUDENTS);
    localStorage.removeItem(KEYS.ASSIGNMENTS);
    localStorage.removeItem(KEYS.TEACHING_PLAN);
    localStorage.removeItem(KEYS.ATTENDANCE);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    
    this.saveClasses(INITIAL_CLASSES);
    this.saveStudents(INITIAL_STUDENTS);
    this.saveAssignments(INITIAL_ASSIGNMENTS);
    this.saveTeachingPlans(INITIAL_TEACHING_PLAN);
    this.saveNotifications(INITIAL_NOTIFICATIONS);
  },

  clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.CLASSES, JSON.stringify([]));
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify([]));
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify([]));
    localStorage.setItem(KEYS.TEACHING_PLAN, JSON.stringify([]));
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([]));
  },

  exportBackup(): string {
    const backup = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      classes: this.getClasses(),
      students: this.getStudents(),
      assignments: this.getAssignments(),
      teachingPlans: this.getTeachingPlans(),
      dailyAttendance: this.getDailyAttendance()
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.classes)) this.saveClasses(parsed.classes);
      if (Array.isArray(parsed.students)) this.saveStudents(parsed.students);
      if (Array.isArray(parsed.assignments)) this.saveAssignments(parsed.assignments);
      if (Array.isArray(parsed.teachingPlans)) this.saveTeachingPlans(parsed.teachingPlans);
      if (Array.isArray(parsed.dailyAttendance)) this.saveDailyAttendance(parsed.dailyAttendance);
      return true;
    } catch (e) {
      console.error("Restore failed:", e);
      return false;
    }
  },

  resetToDemo(): void {
    this.resetAllToDemo();
  },

  exportAllData(): string {
    return this.exportBackup();
  },

  importData(jsonString: string): boolean {
    return this.importBackup(jsonString);
  }
};
