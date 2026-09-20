import React from 'react';
import {
  School,
  Users,
  TrendingUp,
  ClipboardCheck,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ClassItem, StudentItem } from '../types';
import {
  calculateSemesterGPA,
  calculateAttendanceRate,
  analyzeAttentionStatus
} from '../utils/calculations';

interface ClassesProps {
  classes: ClassItem[];
  students: StudentItem[];
  onOpenAddClass: () => void;
  onOpenEditClass: (cls: ClassItem) => void;
  onRequestDeleteClass: (cls: ClassItem) => void;
  onSelectClass: (cls: ClassItem) => void;
  onNavigateToAttendance: (classId: string) => void;
  onNavigateToGrades: (classId: string) => void;
}

export const Classes: React.FC<ClassesProps> = ({
  classes,
  students,
  onOpenAddClass,
  onOpenEditClass,
  onRequestDeleteClass,
  onSelectClass,
  onNavigateToAttendance,
  onNavigateToGrades
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Quản lý Lớp học đang giảng dạy
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi sĩ số, kết quả môn Hóa học, chuyên cần và học sinh cần hỗ trợ theo từng lớp
          </p>
        </div>
        <button
          type="button"
          id="btn-add-class"
          onClick={onOpenAddClass}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm lớp mới</span>
        </button>
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => {
          const classStudents = students.filter((s) => s.classId === cls.id);
          const studentCount = classStudents.length;

          // Average GPA
          const gpas = classStudents
            .map((s) => calculateSemesterGPA(s.grades.semester1))
            .filter((g) => g > 0);
          const avgGpa =
            gpas.length > 0
              ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(1).replace('.', ',')
              : '7,3';

          // Attendance
          const presentCount = classStudents.reduce(
            (acc, s) => acc + s.attendanceSummary.present,
            0
          );
          const totalAttCount = classStudents.reduce(
            (acc, s) => acc + s.attendanceSummary.total,
            0
          );
          const attRate = calculateAttendanceRate(presentCount, totalAttCount);

          // Attention count
          const attentionCount = classStudents.filter(
            (s) => analyzeAttentionStatus(s, cls.name) !== null
          ).length;

          return (
            <div
              key={cls.id}
              id={`class-card-${cls.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Card top banner */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {cls.id}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {cls.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-blue-800">{cls.academicTrack}</span>
                        <span>•</span>
                        <span>{cls.roomNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Chỉnh sửa lớp"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditClass(cls);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Xóa lớp"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestDeleteClass(cls);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {cls.notes && (
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {cls.notes}
                  </p>
                )}
              </div>

              {/* 4 Stats in Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-slate-50/50 p-3 text-center text-xs">
                <div className="p-2">
                  <span className="text-slate-500 font-medium block">Sĩ số</span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                    {studentCount}
                  </span>
                  <span className="text-[10px] text-slate-400">học sinh</span>
                </div>

                <div className="p-2">
                  <span className="text-slate-500 font-medium block">Điểm TB Hóa</span>
                  <span className="text-lg font-bold text-blue-700 mt-0.5 block">
                    {avgGpa}
                  </span>
                  <span className="text-[10px] text-slate-400">thang điểm 10</span>
                </div>

                <div className="p-2">
                  <span className="text-slate-500 font-medium block">Chuyên cần</span>
                  <span className="text-lg font-bold text-emerald-700 mt-0.5 block">
                    {attRate}%
                  </span>
                  <span className="text-[10px] text-slate-400">tỷ lệ đi học</span>
                </div>

                <div className="p-2">
                  <span className="text-slate-500 font-medium block">Cần chú ý</span>
                  <span
                    className={`text-lg font-bold mt-0.5 block ${
                      attentionCount > 0 ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  >
                    {attentionCount}
                  </span>
                  <span className="text-[10px] text-slate-400">học sinh</span>
                </div>
              </div>

              {/* Footer action */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToAttendance(cls.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Điểm danh
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToGrades(cls.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Nhập điểm
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectClass(cls)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Xem chi tiết lớp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
