import { AppConfig, TeacherInfo } from './types';

export const TEACHER_INFO: TeacherInfo = {
  name: "Nguyễn Văn Út",
  subject: "Hóa học",
  school: "THPT Dương Minh Châu"
};

export const APP_CONFIG: AppConfig = {
  appName: "QUẢN TRỊ HỌC TẬP – HÓA HỌC THPT",
  teacher: TEACHER_INFO,
  academicYear: "2026–2027",
  theme: "light"
};

const CONFIG_STORAGE_KEY = 'hoa_hoc_thpt_config_v1';

export function getStoredConfig(): AppConfig {
  if (typeof window === 'undefined') return APP_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return APP_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      appName: parsed.appName || APP_CONFIG.appName,
      teacher: {
        name: parsed.teacher?.name || APP_CONFIG.teacher.name,
        subject: parsed.teacher?.subject || APP_CONFIG.teacher.subject,
        school: parsed.teacher?.school || APP_CONFIG.teacher.school
      },
      academicYear: parsed.academicYear || APP_CONFIG.academicYear,
      theme: parsed.theme || 'light'
    };
  } catch {
    return APP_CONFIG;
  }
}

export function saveStoredConfig(newConfig: AppConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
  } catch (err) {
    console.error("Failed to save config:", err);
  }
}
