import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  School,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Award
} from 'lucide-react';
import { TeacherInfo, ClassItem, StudentItem } from '../types';
import {
  calculateSemesterGPA,
  getPerformanceRank,
  calculateAttendanceRate,
  calculateAssignmentRate,
  analyzeAttentionStatus
} from '../utils/calculations';
import { exportStudentsToCSV } from '../utils/exportUtils';

interface ReportsProps {
  teacher: TeacherInfo;
  classes: ClassItem[];
  students: StudentItem[];
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const Reports: React.FC<ReportsProps> = ({
  teacher,
  classes,
  students,
  onShowToast
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [reportType, setReportType] = useState<'grades' | 'attendance' | 'attention' | 'general'>('general');

  const filteredStudents = selectedClassId === 'ALL'
    ? students
    : students.filter((s) => s.classId === selectedClassId);

  const selectedClassName = selectedClassId === 'ALL'
    ? 'Tất cả các lớp giảng dạy'
    : classes.find((c) => c.id === selectedClassId)?.name || selectedClassId;

  // Aggregate stats
  const totalStudents = filteredStudents.length;
  const gpas = filteredStudents
    .map((s) => calculateSemesterGPA(s.grades.semester1))
    .filter((g) => g > 0);
  const avgGpa =
    gpas.length > 0
      ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(1).replace('.', ',')
      : '7,4';

  let totCount = 0;
  let khaCount = 0;
  let datCount = 0;
  let chuaDatCount = 0;

  filteredStudents.forEach((s) => {
    const g = calculateSemesterGPA(s.grades.semester1);
    const r = getPerformanceRank(g, s.grades.semester1);
    if (r === 'Tốt') totCount++;
    else if (r === 'Khá') khaCount++;
    else if (r === 'Đạt') datCount++;
    else chuaDatCount++;
  });

  const totalPresent = filteredStudents.reduce((acc, s) => acc + s.attendanceSummary.present, 0);
  const totalAtt = filteredStudents.reduce((acc, s) => acc + s.attendanceSummary.total, 0);
  const attRate = calculateAttendanceRate(totalPresent, totalAtt);

  const attentionCount = filteredStudents.filter(
    (s) => analyzeAttentionStatus(s, s.classId) !== null
  ).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Non-printable Screen Header & Controls */}
      <div className="print:hidden bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Báo cáo & Xuất Thống kê Môn Hóa học
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp kết quả học tập, chuyên cần, học sinh cần hỗ trợ để báo cáo tổ bộ môn và BGH
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => exportStudentsToCSV(filteredStudents)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất file Excel</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu PDF</span>
          </button>
        </div>
      </div>

      {/* Non-printable Filter Toolbar */}
      <div className="print:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600">Phạm vi báo cáo:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white font-bold text-slate-800"
          >
            <option value="ALL">Toàn bộ 4 lớp đang dạy</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.academicTrack})
              </option>
            ))}
          </select>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold w-full sm:w-auto justify-center">
          <button
            onClick={() => setReportType('general')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              reportType === 'general' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Tổng hợp chung
          </button>
          <button
            onClick={() => setReportType('grades')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              reportType === 'grades' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Điểm số & Học lực
          </button>
          <button
            onClick={() => setReportType('attendance')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              reportType === 'attendance' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Chuyên cần
          </button>
          <button
            onClick={() => setReportType('attention')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              reportType === 'attention' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Cần quan tâm
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xs text-slate-800 font-sans print:border-none print:shadow-none print:p-0">
        {/* Formal School Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold block text-slate-600">
              SỞ GIÁO DỤC VÀ ĐÀO TẠO
            </span>
            <h3 className="text-sm font-extrabold uppercase text-slate-900 tracking-tight">
              {teacher.school}
            </h3>
            <span className="text-xs text-slate-500">Tổ chuyên môn: Hóa học</span>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
            <span className="font-medium text-slate-700 block italic text-[11px]">
              Độc lập – Tự do – Hạnh phúc
            </span>
            <span className="text-slate-500 mt-1 block">Năm học: {teacher.schoolYear}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-6">
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
            BÁO CÁO KẾT QUẢ DẠY HỌC MÔN HÓA HỌC
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Phạm vi: <strong>{selectedClassName}</strong> • Giáo viên bộ môn:{' '}
            <strong>{teacher.name}</strong>
          </p>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 print:bg-transparent">
          <div className="text-center p-2">
            <span className="text-xs text-slate-500 block">Tổng số học sinh</span>
            <span className="text-xl font-black text-slate-900">{totalStudents}</span>
          </div>
          <div className="text-center p-2">
            <span className="text-xs text-slate-500 block">Điểm trung bình</span>
            <span className="text-xl font-black text-blue-700">{avgGpa}</span>
          </div>
          <div className="text-center p-2">
            <span className="text-xs text-slate-500 block">Tỷ lệ chuyên cần</span>
            <span className="text-xl font-black text-emerald-700">{attRate}%</span>
          </div>
          <div className="text-center p-2">
            <span className="text-xs text-slate-500 block">Số em cần hỗ trợ</span>
            <span className="text-xl font-black text-amber-700">{attentionCount}</span>
          </div>
        </div>

        {/* Breakdown table */}
        <div className="my-6">
          <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-2">
            1. Thống kê xếp loại học lực môn Hóa học (Thông tư 22)
          </h4>
          <table className="w-full text-xs text-center border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800">
              <tr>
                <th className="p-2 border border-slate-300">Mức đánh giá</th>
                <th className="p-2 border border-slate-300">Số lượng (học sinh)</th>
                <th className="p-2 border border-slate-300">Tỷ lệ (%)</th>
                <th className="p-2 border border-slate-300">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-slate-300 font-semibold text-emerald-700">
                  Tốt (Giỏi)
                </td>
                <td className="p-2 border border-slate-300 font-bold">{totCount}</td>
                <td className="p-2 border border-slate-300">
                  {totalStudents > 0 ? ((totCount / totalStudents) * 100).toFixed(1) : 0}%
                </td>
                <td className="p-2 border border-slate-300 text-slate-500">
                  Nắm chắc lý thuyết & bài tập vận dụng cao
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-slate-300 font-semibold text-blue-700">Khá</td>
                <td className="p-2 border border-slate-300 font-bold">{khaCount}</td>
                <td className="p-2 border border-slate-300">
                  {totalStudents > 0 ? ((khaCount / totalStudents) * 100).toFixed(1) : 0}%
                </td>
                <td className="p-2 border border-slate-300 text-slate-500">
                  Giải tốt bài toán dung dịch, cân bằng hóa học
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-slate-300 font-semibold text-amber-700">
                  Đạt (Trung bình)
                </td>
                <td className="p-2 border border-slate-300 font-bold">{datCount}</td>
                <td className="p-2 border border-slate-300">
                  {totalStudents > 0 ? ((datCount / totalStudents) * 100).toFixed(1) : 0}%
                </td>
                <td className="p-2 border border-slate-300 text-slate-500">
                  Cần rèn luyện thêm kỹ năng viết PTHH
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-slate-300 font-semibold text-rose-700">
                  Chưa đạt
                </td>
                <td className="p-2 border border-slate-300 font-bold text-rose-700">
                  {chuaDatCount}
                </td>
                <td className="p-2 border border-slate-300 text-rose-700">
                  {totalStudents > 0 ? ((chuaDatCount / totalStudents) * 100).toFixed(1) : 0}%
                </td>
                <td className="p-2 border border-slate-300 text-rose-600">
                  Lập danh sách phụ đạo và phân công bạn học kèm
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Student Roster in Report */}
        <div className="my-6">
          <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-2">
            2. Danh sách chi tiết học sinh
          </h4>
          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800">
              <tr>
                <th className="p-2 border border-slate-300 text-center w-10">STT</th>
                <th className="p-2 border border-slate-300">Họ và tên</th>
                <th className="p-2 border border-slate-300">Lớp</th>
                <th className="p-2 border border-slate-300 text-center">TX1</th>
                <th className="p-2 border border-slate-300 text-center">TX2</th>
                <th className="p-2 border border-slate-300 text-center">GK</th>
                <th className="p-2 border border-slate-300 text-center">CK</th>
                <th className="p-2 border border-slate-300 text-center">ĐTB</th>
                <th className="p-2 border border-slate-300 text-center">Xếp loại</th>
                <th className="p-2 border border-slate-300 text-center">Chuyên cần</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.slice(0, 30).map((s, idx) => {
                const gpa = calculateSemesterGPA(s.grades.semester1);
                const rank = getPerformanceRank(gpa, s.grades.semester1);
                const att = calculateAttendanceRate(
                  s.attendanceSummary.present,
                  s.attendanceSummary.total
                );

                return (
                  <tr key={s.id}>
                    <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-semibold">{s.name}</td>
                    <td className="p-2 border border-slate-300">{s.classId}</td>
                    <td className="p-2 border border-slate-300 text-center">
                      {s.grades.semester1?.tx1 ?? '--'}
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      {s.grades.semester1?.tx2 ?? '--'}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold">
                      {s.grades.semester1?.gk ?? '--'}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold">
                      {s.grades.semester1?.ck ?? '--'}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-black">
                      {gpa > 0 ? gpa.toFixed(1).replace('.', ',') : '--'}
                    </td>
                    <td className="p-2 border border-slate-300 text-center">{rank}</td>
                    <td className="p-2 border border-slate-300 text-center">{att}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredStudents.length > 30 && (
            <p className="text-[11px] text-slate-500 italic mt-1">
              (Hiển thị trích dẫn 30 học sinh đầu tiên trong bản in. Bản file Excel chứa toàn bộ {filteredStudents.length} học sinh).
            </p>
          )}
        </div>

        {/* Signature Area */}
        <div className="grid grid-cols-2 gap-8 mt-12 pt-6 border-t border-slate-300 text-xs">
          <div className="text-center">
            <span className="font-bold text-slate-900 block uppercase">XÁC NHẬN CỦA TỔ TRƯỞNG CHUYÊN MÔN</span>
            <span className="text-slate-400 block italic mt-1">(Ký và ghi rõ họ tên)</span>
          </div>
          <div className="text-center">
            <span className="text-slate-500 block">Tây Ninh, ngày 19 tháng 09 năm 2026</span>
            <span className="font-bold text-slate-900 block uppercase mt-1">GIÁO VIÊN BỘ MÔN</span>
            <div className="h-16 flex items-center justify-center italic text-blue-900 font-bold text-base">
              Nguyễn Văn Út
            </div>
            <span className="font-bold text-slate-900">{teacher.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
