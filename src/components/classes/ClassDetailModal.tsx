import React, { useState } from 'react';
import {
  X,
  Users,
  GraduationCap,
  ClipboardCheck,
  AlertTriangle,
  Search,
  ArrowRight,
  Plus
} from 'lucide-react';
import { ClassItem, StudentItem } from '../../types';
import {
  calculateSemesterGPA,
  getPerformanceRank,
  calculateAttendanceRate,
  analyzeAttentionStatus
} from '../../utils/calculations';

interface ClassDetailModalProps {
  classItem: ClassItem | null;
  students: StudentItem[];
  onClose: () => void;
  onSelectStudent: (student: StudentItem) => void;
  onNavigateToAttendance: (classId: string) => void;
  onNavigateToGrades: (classId: string) => void;
  onAddStudent: (classId: string) => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  classItem,
  students,
  onClose,
  onSelectStudent,
  onNavigateToAttendance,
  onNavigateToGrades,
  onAddStudent
}) => {
  const [search, setSearch] = useState('');

  if (!classItem) return null;

  const classStudents = students.filter((s) => s.classId === classItem.id);

  // Calculations for this specific class
  const totalStudents = classStudents.length;
  const gpas = classStudents
    .map((s) => calculateSemesterGPA(s.grades.semester1))
    .filter((g) => g > 0);
  const avgClassGpa =
    gpas.length > 0
      ? (gpas.reduce((acc, v) => acc + v, 0) / gpas.length).toFixed(1)
      : '7.3';

  const totalPresent = classStudents.reduce((acc, s) => acc + s.attendanceSummary.present, 0);
  const totalAtt = classStudents.reduce((acc, s) => acc + s.attendanceSummary.total, 0);
  const classAttRate = calculateAttendanceRate(totalPresent, totalAtt);

  const attentionStudents = classStudents.filter(
    (s) => analyzeAttentionStatus(s, classItem.name) !== null
  );

  const filteredStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-extrabold text-slate-900">{classItem.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {classItem.academicTrack}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {classItem.roomNumber} • GVCN: {classItem.homeroomTeacher || 'Thầy Nguyễn Văn Út'}
              </span>
            </div>
            {classItem.notes && (
              <p className="text-xs text-slate-600 mt-1">{classItem.notes}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Class Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 pb-2">
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
            <span className="text-xs text-blue-800 font-semibold uppercase">Sĩ số</span>
            <div className="text-2xl font-black text-blue-950 mt-1">{totalStudents}</div>
            <span className="text-[11px] text-blue-700">học sinh</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-xs text-emerald-800 font-semibold uppercase">Điểm TB môn Hóa</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{avgClassGpa}</div>
            <span className="text-[11px] text-emerald-700">Thang điểm 10</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
            <span className="text-xs text-indigo-800 font-semibold uppercase">Chuyên cần</span>
            <div className="text-2xl font-black text-indigo-950 mt-1">{classAttRate}%</div>
            <span className="text-[11px] text-indigo-700">Tỷ lệ có mặt</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <span className="text-xs text-amber-800 font-semibold uppercase">Cần quan tâm</span>
            <div className="text-2xl font-black text-amber-950 mt-1">{attentionStudents.length}</div>
            <span className="text-[11px] text-amber-700">em cần hỗ trợ</span>
          </div>
        </div>

        {/* Quick action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm học sinh trong lớp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToAttendance(classItem.id);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-blue-600" />
              Điểm danh lớp
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToGrades(classItem.id);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              Bảng điểm môn Hóa
            </button>
            <button
              onClick={() => onAddStudent(classItem.id)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm học sinh
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center">STT</th>
                  <th className="p-3">Họ và tên</th>
                  <th className="p-3">Giới tính</th>
                  <th className="p-3 text-center">Điểm TB</th>
                  <th className="p-3 text-center">Xếp loại</th>
                  <th className="p-3 text-center">Chuyên cần</th>
                  <th className="p-3 text-center">Bài tập</th>
                  <th className="p-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s, idx) => {
                  const gpa = calculateSemesterGPA(s.grades.semester1);
                  const rank = getPerformanceRank(gpa, s.grades.semester1);
                  const att = calculateAttendanceRate(
                    s.attendanceSummary.present,
                    s.attendanceSummary.total
                  );
                  const isAttention = analyzeAttentionStatus(s, classItem.name) !== null;

                  return (
                    <tr
                      key={s.id}
                      onClick={() => {
                        onClose();
                        onSelectStudent(s);
                      }}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="p-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{s.name}</span>
                          {isAttention && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Cần chú ý
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">{s.gender}</td>
                      <td className="p-3 text-center font-bold text-slate-900">
                        {gpa > 0 ? gpa.toFixed(1) : '--'}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            rank === 'Tốt'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rank === 'Khá'
                              ? 'bg-blue-100 text-blue-800'
                              : rank === 'Đạt'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {rank}
                        </span>
                      </td>
                      <td className="p-3 text-center text-slate-700 font-medium">{att}%</td>
                      <td className="p-3 text-center text-slate-600">
                        {s.assignmentSummary.completed}/{s.assignmentSummary.total}
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-blue-600 font-semibold flex items-center justify-end gap-1 hover:underline">
                          Xem hồ sơ
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-500">
            Hiển thị {filteredStudents.length}/{classStudents.length} học sinh
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
