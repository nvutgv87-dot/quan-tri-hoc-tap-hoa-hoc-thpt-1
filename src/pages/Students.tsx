import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { StudentItem, ClassItem } from '../types';
import {
  calculateSemesterGPA,
  getPerformanceRank,
  calculateAttendanceRate,
  analyzeAttentionStatus
} from '../utils/calculations';
import { exportStudentsToCSV, parseCSVToStudents } from '../utils/exportUtils';

interface StudentsProps {
  students: StudentItem[];
  classes: ClassItem[];
  onSelectStudent: (student: StudentItem) => void;
  onOpenAddStudent: () => void;
  onOpenEditStudent: (student: StudentItem) => void;
  onRequestDeleteStudent: (student: StudentItem) => void;
  onImportStudents: (imported: Partial<StudentItem>[]) => void;
}

export const Students: React.FC<StudentsProps> = ({
  students,
  classes,
  onSelectStudent,
  onOpenAddStudent,
  onOpenEditStudent,
  onRequestDeleteStudent,
  onImportStudents
}) => {
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedRank, setSelectedRank] = useState('ALL');
  const [selectedGpaRange, setSelectedGpaRange] = useState('ALL');
  const [selectedAttRange, setSelectedAttRange] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 1. Search name, code, class
      const q = searchTerm.trim().toLowerCase();
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.code.toLowerCase().includes(q) &&
        !s.classId.toLowerCase().includes(q)
      ) {
        return false;
      }

      // 2. Class filter
      if (selectedClass !== 'ALL' && s.classId !== selectedClass) {
        return false;
      }

      const gpa = calculateSemesterGPA(s.grades.semester1);
      const rank = getPerformanceRank(gpa, s.grades.semester1);
      const attRate = calculateAttendanceRate(
        s.attendanceSummary.present,
        s.attendanceSummary.total
      );
      const isAttention = analyzeAttentionStatus(s, s.classId) !== null;

      // 3. Performance rank / status filter
      if (selectedRank !== 'ALL') {
        if (selectedRank === 'ATTENTION') {
          if (!isAttention) return false;
        } else if (rank !== selectedRank) {
          return false;
        }
      }

      // 4. GPA range filter
      if (selectedGpaRange === 'BELOW_5' && gpa >= 5.0) return false;
      if (selectedGpaRange === '5_TO_6.4' && (gpa < 5.0 || gpa >= 6.5)) return false;
      if (selectedGpaRange === '6.5_TO_7.9' && (gpa < 6.5 || gpa >= 8.0)) return false;
      if (selectedGpaRange === 'ABOVE_8' && gpa < 8.0) return false;

      // 5. Attendance filter
      if (selectedAttRange === 'BELOW_90' && attRate >= 90) return false;
      if (selectedAttRange === 'ABOVE_90' && attRate < 90) return false;

      return true;
    });
  }, [students, searchTerm, selectedClass, selectedRank, selectedGpaRange, selectedAttRange]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedClass('ALL');
    setSelectedRank('ALL');
    setSelectedGpaRange('ALL');
    setSelectedAttRange('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedClass !== 'ALL' ||
    selectedRank !== 'ALL' ||
    selectedGpaRange !== 'ALL' ||
    selectedAttRange !== 'ALL';

  // Handle CSV Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const imported = parseCSVToStudents(text, classes[0]?.id || '11A1');
        if (imported.length > 0) {
          onImportStudents(imported);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Quản lý Danh sách Học sinh môn Hóa học
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng số <span className="font-bold text-slate-800">{students.length}</span> học sinh thuộc{' '}
            <span className="font-bold text-slate-800">{classes.length}</span> lớp đang giảng dạy
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden file input for CSV */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.txt"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            title="Nhập danh sách học sinh từ file CSV/Excel"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Nhập CSV</span>
          </button>

          <button
            type="button"
            onClick={() => exportStudentsToCSV(filteredStudents)}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            title="Xuất bảng dữ liệu hiện tại ra file Excel/CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            id="btn-add-student-main"
            onClick={onOpenAddStudent}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, mã định danh..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-medium"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white text-slate-800"
            >
              <option value="ALL">Tất cả các lớp ({classes.length} lớp)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.academicTrack})
                </option>
              ))}
            </select>
          </div>

          {/* Academic Rank & Attention Filter */}
          <div>
            <select
              value={selectedRank}
              onChange={(e) => {
                setSelectedRank(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white text-slate-800"
            >
              <option value="ALL">Tất cả mức học lực</option>
              <option value="Tốt">Tốt (Giỏi)</option>
              <option value="Khá">Khá</option>
              <option value="Đạt">Đạt (Trung bình)</option>
              <option value="Chưa đạt">Chưa đạt</option>
              <option value="ATTENTION">⚠️ Cần hỗ trợ / Theo dõi</option>
            </select>
          </div>

          {/* GPA Range Filter */}
          <div>
            <select
              value={selectedGpaRange}
              onChange={(e) => {
                setSelectedGpaRange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white text-slate-800"
            >
              <option value="ALL">Mọi khoảng điểm TB</option>
              <option value="BELOW_5">Dưới 5.0 (Cần phụ đạo)</option>
              <option value="5_TO_6.4">5.0 – 6.4 điểm</option>
              <option value="6.5_TO_7.9">6.5 – 7.9 điểm</option>
              <option value="ABOVE_8">8.0 – 10 điểm (Khá Giỏi)</option>
            </select>
          </div>

          {/* Attendance Filter */}
          <div>
            <select
              value={selectedAttRange}
              onChange={(e) => {
                setSelectedAttRange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white text-slate-800"
            >
              <option value="ALL">Mọi mức chuyên cần</option>
              <option value="BELOW_90">Dưới 90% (Vắng nhiều)</option>
              <option value="ABOVE_90">Từ 90% trở lên (Đạt chuẩn)</option>
            </select>
          </div>
        </div>

        {/* Filter status & Reset button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-medium">
              Tìm thấy <strong className="text-blue-700">{filteredStudents.length}</strong> kết quả
              phù hợp với bộ lọc
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Main Students Table (Section 9) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 text-center w-12">STT</th>
                <th className="p-3.5">Họ và tên</th>
                <th className="p-3.5">Mã HS</th>
                <th className="p-3.5">Lớp</th>
                <th className="p-3.5">Giới tính</th>
                <th className="p-3.5 text-center">Điểm TB</th>
                <th className="p-3.5 text-center">Chuyên cần</th>
                <th className="p-3.5 text-center">Bài tập</th>
                <th className="p-3.5 text-center">Trạng thái</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    Không tìm thấy học sinh nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, index) => {
                  const globalIdx = (currentPage - 1) * pageSize + index + 1;
                  const gpa = calculateSemesterGPA(student.grades.semester1);
                  const rank = getPerformanceRank(gpa, student.grades.semester1);
                  const attRate = calculateAttendanceRate(
                    student.attendanceSummary.present,
                    student.attendanceSummary.total
                  );
                  const attention = analyzeAttentionStatus(student, student.classId);

                  return (
                    <tr
                      key={student.id}
                      onClick={() => onSelectStudent(student)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5 text-center text-slate-400 font-mono font-medium">
                        {globalIdx}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                            {student.name.charAt(0)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                        {student.code}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        {student.classId}
                      </td>
                      <td className="p-3.5 text-slate-600">{student.gender}</td>
                      <td className="p-3.5 text-center font-bold text-slate-900 text-sm">
                        {gpa > 0 ? gpa.toFixed(1).replace('.', ',') : '--'}
                      </td>
                      <td className="p-3.5 text-center font-medium text-slate-700">
                        {attRate}%
                      </td>
                      <td className="p-3.5 text-center text-slate-600">
                        {student.assignmentSummary.completed}/{student.assignmentSummary.total}
                      </td>
                      <td className="p-3.5 text-center">
                        {attention ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              attention.tier === 'Mức 3 – Ưu tiên hỗ trợ'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {attention.tier.split(' – ')[1] || 'Cần chú ý'}
                          </span>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              rank === 'Tốt'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rank === 'Khá'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {rank}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            title="Xem chi tiết hồ sơ"
                            onClick={() => onSelectStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Sửa thông tin / điểm"
                            onClick={() => onOpenEditStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Xóa học sinh"
                            onClick={() => onRequestDeleteStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50 text-xs">
          <span className="text-slate-500">
            Hiển thị{' '}
            <strong className="text-slate-800">
              {filteredStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </strong>{' '}
            –{' '}
            <strong className="text-slate-800">
              {Math.min(currentPage * pageSize, filteredStudents.length)}
            </strong>{' '}
            trong tổng số <strong className="text-slate-800">{filteredStudents.length}</strong> học sinh
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-700 font-medium"
            >
              Trang trước
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-700 font-medium"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
