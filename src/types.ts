export interface TeacherInfo {
  name: string;
  subject: string;
  school: string;
  schoolYear?: string;
  semester?: 'Học kỳ I' | 'Học kỳ II' | 'Cả năm';
  email?: string;
  phone?: string;
}

export type SemesterGrades = GradeItem;

export interface AppConfig {
  appName: string;
  teacher: TeacherInfo;
  academicYear: string;
  theme?: 'light' | 'dark';
}

export interface ClassItem {
  id: string; // e.g. "11A1"
  name: string;
  gradeLevel: number; // 10, 11, 12
  academicTrack: string; // "KHTN" (Khoa học tự nhiên)
  homeroomTeacher?: string;
  roomNumber: string;
  notes?: string;
}

export interface GradeItem {
  tx1?: number | null; // Điểm kiểm tra thường xuyên 1 (hệ số 1)
  tx2?: number | null; // TX 2
  tx3?: number | null; // TX 3
  thuchanh?: number | null; // Điểm thực hành thí nghiệm hóa học (hệ số 1)
  gk?: number | null; // Giữa kỳ (hệ số 2)
  ck?: number | null; // Cuối kỳ (hệ số 3)
}

export interface StudentItem {
  id: string; // STU001
  code: string; // 2026-11A1-01
  name: string;
  classId: string;
  gender: 'Nam' | 'Nữ';
  dob?: string;
  phone?: string;
  status: 'Đang học' | 'Chuyển trường' | 'Nghỉ học';
  grades: {
    semester1: GradeItem;
    semester2?: GradeItem;
  };
  attendanceSummary: {
    present: number;
    excused: number; // Vắng có phép
    unexcused: number; // Vắng không phép
    total: number;
  };
  assignmentSummary: {
    completed: number;
    total: number;
  };
  scoreHistory: {
    period: string; // "Đầu năm", "Giữa kỳ I", "Cuối kỳ I", "Giữa kỳ II", "Cuối kỳ II"
    score: number;
  }[];
  teacherNotes: string;
  lastUpdated?: string;
}

export type AttendanceStatus = 'present' | 'excused' | 'unexcused';

export interface DailyAttendanceRecord {
  id: string; // classId_date_period
  classId: string;
  date: string; // YYYY-MM-DD
  period: number; // Tiết học 1..5
  topic?: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
    note?: string;
  }[];
  createdAt: string;
}

export interface AssignmentAttachment {
  name: string;
  size: number; // Kích thước tính bằng byte
  type: 'docx' | 'doc' | 'pdf' | string; // Định dạng tệp
  dataUrl?: string; // Dữ liệu base64 để tải về hoặc xem trước
  uploadedAt: string; // Thời gian tải lên
  extractedSummary?: string; // Tóm tắt nội dung đề bài
}

export interface AssignmentItem {
  id: string;
  title: string;
  topic: string; // Chủ đề hóa học
  classIds: string[]; // Các lớp được giao
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  description: string;
  totalSubmissions?: number;
  maxScore?: number;
  status: 'active' | 'upcoming' | 'closed';
  completedStudentIds: string[]; // Danh sách ID học sinh đã hoàn thành
  attachment?: AssignmentAttachment | null; // Tệp đính kèm đề bài Word (.docx, .doc) hoặc PDF
}

export interface TeachingPlanItem {
  id: string;
  week: number;
  period: number;
  topic: string; // Chủ đề
  lessonContent: string; // Nội dung bài học
  objectives: string; // Mục tiêu cần đạt
  activities: string; // Hoạt động & thí nghiệm
  status: 'Hoàn thành' | 'Đang thực hiện' | 'Chưa thực hiện';
  gradeLevel: number;
  notes?: string;
  attachment?: AssignmentAttachment | null; // Tệp kế hoạch bài dạy Word (.docx, .doc) hoặc PDF
}

export type AttentionTier = 'Mức 1 – Theo dõi' | 'Mức 2 – Cần hỗ trợ' | 'Mức 3 – Ưu tiên hỗ trợ';

export interface AttentionStudentView {
  student: StudentItem;
  className: string;
  averageScore: number;
  attendanceRate: number;
  assignmentRate: number;
  tier: AttentionTier;
  reasons: string[];
  trend: 'up' | 'down' | 'stable';
  actionTaken?: string;
  suggestedIntervention?: string;
}

export interface NotificationItem {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
  linkToPage?: string;
  linkParam?: string;
}
