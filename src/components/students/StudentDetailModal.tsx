import React, { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Calendar,
  Phone,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  Clock,
  Save,
  FileCheck
} from 'lucide-react';
import { StudentItem } from '../../types';
import {
  calculateSemesterGPA,
  getPerformanceRank,
  calculateAttendanceRate,
  calculateAssignmentRate,
  getScoreTrend
} from '../../utils/calculations';

interface StudentDetailModalProps {
  student: StudentItem | null;
  onClose: () => void;
  onSaveTeacherNotes: (studentId: string, notes: string) => void;
  onEditGrades?: (student: StudentItem) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onSaveTeacherNotes,
  onEditGrades
}) => {
  if (!student) return null;

  const [notes, setNotes] = useState(student.teacherNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  const gpa = calculateSemesterGPA(student.grades.semester1);
  const rank = getPerformanceRank(gpa, student.grades.semester1);
  const attRate = calculateAttendanceRate(
    student.attendanceSummary.present,
    student.attendanceSummary.total
  );
  const asgRate = calculateAssignmentRate(
    student.assignmentSummary.completed,
    student.assignmentSummary.total
  );
  const trend = getScoreTrend(student.scoreHistory);

  const handleSaveNotes = () => {
    onSaveTeacherNotes(student.id, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Lớp {student.classId}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {student.gender}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mã định danh: <span className="font-mono font-medium">{student.code}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Declining performance warning banner */}
          {trend === 'down' && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Cần theo dõi học tập</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Kết quả kiểm tra môn Hóa học của học sinh đang có xu hướng giảm liên tục qua các đợt đánh giá. Giáo viên nên trao đổi động viên hoặc phân công bạn khá giỏi kèm cặp.
                </p>
              </div>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Điểm TB Hóa học</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {gpa > 0 ? gpa.toFixed(1) : '--'}
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                  rank === 'Tốt'
                    ? 'bg-emerald-100 text-emerald-800'
                    : rank === 'Khá'
                    ? 'bg-blue-100 text-blue-800'
                    : rank === 'Đạt'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                Học lực: {rank}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Tỷ lệ chuyên cần</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{attRate}%</div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Có mặt {student.attendanceSummary.present}/{student.attendanceSummary.total} buổi
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Bài tập hoàn thành</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {student.assignmentSummary.completed}/{student.assignmentSummary.total}
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Đạt {asgRate}% tiến độ giao
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Xu hướng học tập</span>
              <div className="flex items-center gap-1.5 mt-2">
                {trend === 'up' ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">Đang tiến bộ</span>
                  </>
                ) : trend === 'down' ? (
                  <>
                    <TrendingDown className="w-5 h-5 text-rose-600" />
                    <span className="text-sm font-bold text-rose-700">Có dấu hiệu giảm</span>
                  </>
                ) : (
                  <>
                    <Minus className="w-5 h-5 text-slate-500" />
                    <span className="text-sm font-bold text-slate-700">Ổn định</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Chemistry Grade Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/70 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Chi tiết các cột điểm Hóa học (Học kỳ I)
              </span>
              {onEditGrades && (
                <button
                  type="button"
                  onClick={() => onEditGrades(student)}
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  Chỉnh sửa điểm
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-2.5">TX1 (hs 1)</th>
                    <th className="p-2.5">TX2 (hs 1)</th>
                    <th className="p-2.5">TX3 (hs 1)</th>
                    <th className="p-2.5">Thực hành (hs 1)</th>
                    <th className="p-2.5 bg-blue-50/50 text-blue-900">Giữa kỳ (hs 2)</th>
                    <th className="p-2.5 bg-blue-50/50 text-blue-900">Cuối kỳ (hs 3)</th>
                    <th className="p-2.5 bg-slate-100 font-bold text-slate-900">Điểm TB HK</th>
                  </tr>
                </thead>
                <tbody className="divide-x divide-slate-200 font-medium">
                  <tr>
                    <td className="p-3 text-slate-800">{student.grades.semester1?.tx1 ?? '--'}</td>
                    <td className="p-3 text-slate-800">{student.grades.semester1?.tx2 ?? '--'}</td>
                    <td className="p-3 text-slate-800">{student.grades.semester1?.tx3 ?? '--'}</td>
                    <td className="p-3 text-slate-800">{student.grades.semester1?.thuchanh ?? '--'}</td>
                    <td className="p-3 text-blue-900 font-bold bg-blue-50/30">
                      {student.grades.semester1?.gk ?? '--'}
                    </td>
                    <td className="p-3 text-blue-900 font-bold bg-blue-50/30">
                      {student.grades.semester1?.ck ?? '--'}
                    </td>
                    <td className="p-3 bg-slate-100 font-black text-sm text-slate-900">
                      {gpa > 0 ? gpa.toFixed(1) : '--'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Timeline: 5.5 -> 6.2 -> 6.8 -> 7.3 */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Tiến trình điểm số qua các kỳ đánh giá
            </span>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
              {student.scoreHistory.map((item, idx) => {
                const isLast = idx === student.scoreHistory.length - 1;
                return (
                  <React.Fragment key={item.period}>
                    <div className="flex flex-col items-center shrink-0 min-w-[90px]">
                      <span className="text-[11px] text-slate-500 font-medium">{item.period}</span>
                      <div
                        className={`mt-1.5 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs ${
                          isLast
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-white text-slate-800 border border-slate-300'
                        }`}
                      >
                        {item.score.toFixed(1)}
                      </div>
                    </div>
                    {!isLast && (
                      <div className="h-0.5 w-8 bg-slate-300 shrink-0 self-center -mt-2" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Attendance Breakdown details */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Lịch sử chuyên cần
            </span>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <span className="font-semibold block">Có mặt</span>
                <span className="text-lg font-bold">{student.attendanceSummary.present} buổi</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                <span className="font-semibold block">Vắng có phép</span>
                <span className="text-lg font-bold">{student.attendanceSummary.excused} buổi</span>
              </div>
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                <span className="font-semibold block">Vắng không phép</span>
                <span className="text-lg font-bold">{student.attendanceSummary.unexcused} buổi</span>
              </div>
            </div>
          </div>

          {/* Teacher Notes & Guidance Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nhận xét & Biện pháp hỗ trợ của giáo viên
              </label>
              {isSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Đã lưu thành công
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập nhận xét về thái độ học tập môn Hóa, mức độ nắm lý thuyết/bài tập, kế hoạch phụ đạo..."
              className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all text-slate-800"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                id="btn-save-teacher-notes"
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Lưu nhận xét
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500">
            Cập nhật lần cuối: {student.lastUpdated || '2026-09-18'}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
