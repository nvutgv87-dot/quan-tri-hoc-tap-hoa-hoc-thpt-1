import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  User,
  School,
  BookOpen,
  Save,
  RotateCcw,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TeacherInfo } from '../types';
import { StorageService } from '../utils/storage';

interface SettingsProps {
  teacher: TeacherInfo;
  onUpdateTeacher: (info: TeacherInfo) => void;
  onResetDemoData: () => void;
  onRestoreData: (jsonString: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const Settings: React.FC<SettingsProps> = ({
  teacher,
  onUpdateTeacher,
  onResetDemoData,
  onRestoreData,
  onShowToast
}) => {
  const [name, setName] = useState(teacher.name);
  const [subject, setSubject] = useState(teacher.subject);
  const [school, setSchool] = useState(teacher.school);
  const [schoolYear, setSchoolYear] = useState(teacher.schoolYear || '2026 - 2027');
  const [semester, setSemester] = useState(teacher.semester || 'Học kỳ I');
  const [email, setEmail] = useState(teacher.email || 'nguyenvanut.dmc@edu.vn');
  const [phone, setPhone] = useState(teacher.phone || '0912-345-678');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveTeacherInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacher({
      name: name.trim(),
      subject: subject.trim(),
      school: school.trim(),
      schoolYear: schoolYear.trim(),
      semester,
      email: email.trim(),
      phone: phone.trim()
    });
    onShowToast('Cập nhật thành công', 'Thông tin giáo viên đã được lưu lại.', 'success');
  };

  // Backup full database as JSON file
  const handleExportBackup = () => {
    const data = StorageService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_quan_tri_hoa_hoc_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Sao lưu dữ liệu', 'Đã tải về tệp tin sao lưu hệ thống dạng JSON.', 'success');
  };

  // Restore database from JSON file
  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onRestoreData(content);
        onShowToast('Khôi phục thành công', 'Đã khôi phục toàn bộ cơ sở dữ liệu từ tệp sao lưu.', 'success');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          <span>Cấu hình Hệ thống & Thông tin Giáo viên</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Tùy chỉnh thông tin hồ sơ giáo viên, năm học, thang điểm và quản lý dữ liệu lưu trữ
        </p>
      </div>

      {/* Teacher Profile Configuration Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
          <User className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Thông tin Giáo viên & Trường học
          </h3>
        </div>

        <form onSubmit={handleSaveTeacherInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên giáo viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Môn giảng dạy <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trường học <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Năm học
              </label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Học kỳ áp dụng
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as 'Học kỳ I' | 'Học kỳ II' | 'Cả năm')}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white font-medium"
              >
                <option value="Học kỳ I">Học kỳ I</option>
                <option value="Học kỳ II">Học kỳ II</option>
                <option value="Cả năm">Cả năm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email liên hệ</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              id="btn-save-teacher-profile"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thông tin giáo viên</span>
            </button>
          </div>
        </form>
      </div>

      {/* Regulation & Formula Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Quy định Đánh giá & Tiêu chuẩn Học tập
          </h3>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900">Quy định tính điểm trung bình (Thông tư 22/2021/TT-BGDĐT)</h4>
            <p className="mt-1 leading-relaxed">
              Điểm ĐTB môn Hóa học = <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono font-bold text-blue-900">
                (Tổng điểm TX + 2 × Giữa Kỳ + 3 × Cuối Kỳ) / (Số cột TX + 5)
              </code>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900">Tiêu chí tự động cảnh báo học sinh cần quan tâm</h4>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Mức 3 (Ưu tiên hỗ trợ): Điểm TB &lt; 5.0 hoặc có điểm dưới 3.5 hoặc vắng không phép &gt; 2 buổi.</li>
              <li>Mức 2 (Cần hỗ trợ): Điểm có xu hướng giảm liên tục qua 3 kỳ hoặc nộp thiếu &gt; 2 bài tập.</li>
              <li>Mức 1 (Theo dõi): Tỷ lệ chuyên cần &lt; 90% hoặc điểm TB mấp mé 5.0 - 5.5.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* LocalStorage Data Management */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
          <Database className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Quản lý Dữ liệu LocalStorage
          </h3>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Toàn bộ dữ liệu lớp học, học sinh, điểm số, bài tập và chuyên cần được lưu trữ bảo mật ngay trên trình duyệt của giáo viên (localStorage). Thầy có thể sao lưu ra tệp JSON để lưu trữ hoặc chuyển sang máy tính khác.
        </p>

        {/* Hidden restore input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileRestore}
          accept=".json"
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Sao lưu dữ liệu (Tải JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Khôi phục từ tệp JSON</span>
          </button>

          <button
            type="button"
            onClick={onResetDemoData}
            className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Khôi phục dữ liệu mẫu gốc</span>
          </button>
        </div>
      </div>
    </div>
  );
};
