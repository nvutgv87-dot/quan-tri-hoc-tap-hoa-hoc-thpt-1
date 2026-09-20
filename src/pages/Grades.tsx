import React, { useState } from 'react';
import {
  GraduationCap,
  Save,
  Download,
  School,
  AlertTriangle,
  Award,
  CheckCircle2
} from 'lucide-react';
import { StudentItem, ClassItem, SemesterGrades } from '../types';
import {
  calculateSemesterGPA,
  getPerformanceRank
} from '../utils/calculations';
import { exportGradesToCSV } from '../utils/exportUtils';

interface GradesProps {
  students: StudentItem[];
  classes: ClassItem[];
  selectedClassId?: string;
  onUpdateStudents: (updated: StudentItem[]) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const Grades: React.FC<GradesProps> = ({
  students,
  classes,
  selectedClassId,
  onUpdateStudents,
  onShowToast
}) => {
  const [currentClassId, setCurrentClassId] = useState<string>(
    selectedClassId || classes[0]?.id || '11A1'
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Local copy of students for editing
  const classStudents = students.filter((s) => s.classId === currentClassId);

  const handleScoreChange = (
    studentId: string,
    field: keyof SemesterGrades,
    rawValue: string
  ) => {
    const val = rawValue.trim() === '' ? null : parseFloat(rawValue.replace(',', '.'));
    const cleanVal = val !== null && !isNaN(val) ? Math.min(10, Math.max(0, val)) : null;

    const updated = students.map((s) => {
      if (s.id !== studentId) return s;
      const currentSemester = s.grades.semester1 || {
        tx1: null,
        tx2: null,
        tx3: null,
        thuchanh: null,
        gk: null,
        ck: null
      };

      return {
        ...s,
        grades: {
          ...s.grades,
          semester1: {
            ...currentSemester,
            [field]: cleanVal
          }
        }
      };
    });

    onUpdateStudents(updated);
    setHasUnsavedChanges(true);
  };

  const handleSaveGrades = () => {
    setHasUnsavedChanges(false);
    onShowToast(
      'Lưu bảng điểm thành công',
      `Đã cập nhật toàn bộ cột điểm Hóa học của lớp ${currentClassId}.`,
      'success'
    );
  };

  // Class grade statistics
  const gpaList = classStudents
    .map((s) => calculateSemesterGPA(s.grades.semester1))
    .filter((g) => g > 0);
  const maxScore = gpaList.length > 0 ? Math.max(...gpaList) : 0;
  const minScore = gpaList.length > 0 ? Math.min(...gpaList) : 0;
  const avgClassGpa =
    gpaList.length > 0
      ? (gpaList.reduce((a, b) => a + b, 0) / gpaList.length).toFixed(1).replace('.', ',')
      : '0,0';

  const belowFiveCount = gpaList.filter((g) => g < 5.0).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sổ Điểm Môn Hóa học (Học kỳ I)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tính điểm trung bình tự động theo Thông tư 22 (TX: hs 1, GK: hs 2, CK: hs 3)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => exportGradesToCSV(classStudents, currentClassId)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất bảng điểm Excel</span>
          </button>

          <button
            type="button"
            id="btn-save-grades"
            onClick={handleSaveGrades}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all ${
              hasUnsavedChanges
                ? 'bg-amber-600 hover:bg-amber-700 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{hasUnsavedChanges ? 'Lưu thay đổi điểm' : 'Đã lưu điểm'}</span>
          </button>
        </div>
      </div>

      {/* Class Selector & Class Stats */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
            <School className="w-4 h-4 text-blue-600" />
            <span>Chọn lớp học:</span>
          </label>
          <select
            value={currentClassId}
            onChange={(e) => setCurrentClassId(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white font-bold text-slate-900 min-w-[180px]"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.academicTrack})
              </option>
            ))}
          </select>
        </div>

        {/* Quick grade metrics */}
        <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto justify-end">
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-medium">
            Điểm TB lớp: <strong className="font-bold">{avgClassGpa}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
            Cao nhất: <strong className="font-bold">{maxScore > 0 ? maxScore.toFixed(1).replace('.', ',') : '--'}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-medium">
            Thấp nhất: <strong className="font-bold">{minScore > 0 ? minScore.toFixed(1).replace('.', ',') : '--'}</strong>
          </div>
          {belowFiveCount > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{belowFiveCount} em &lt; 5.0</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Gradebook Spreadsheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 text-center w-12 border-r border-slate-200">STT</th>
                <th className="p-3 border-r border-slate-200">Mã HS</th>
                <th className="p-3 border-r border-slate-200 min-w-[160px]">Họ và tên học sinh</th>
                <th className="p-2.5 text-center border-r border-slate-200 w-16">
                  TX 1 <span className="block text-[10px] text-slate-400 font-normal">hs 1</span>
                </th>
                <th className="p-2.5 text-center border-r border-slate-200 w-16">
                  TX 2 <span className="block text-[10px] text-slate-400 font-normal">hs 1</span>
                </th>
                <th className="p-2.5 text-center border-r border-slate-200 w-16">
                  TX 3 <span className="block text-[10px] text-slate-400 font-normal">hs 1</span>
                </th>
                <th className="p-2.5 text-center border-r border-slate-200 w-16">
                  T.Hành <span className="block text-[10px] text-slate-400 font-normal">hs 1</span>
                </th>
                <th className="p-2.5 text-center border-r border-slate-200 w-18 bg-blue-50/70 text-blue-900">
                  Giữa kỳ <span className="block text-[10px] text-blue-600 font-bold">hs 2</span>
                </th>
                <th className="p-2.5 text-center border-r border-slate-200 w-18 bg-blue-50/70 text-blue-900">
                  Cuối kỳ <span className="block text-[10px] text-blue-600 font-bold">hs 3</span>
                </th>
                <th className="p-2.5 text-center border-r border-slate-200 w-20 bg-slate-100 font-black text-slate-900">
                  Điểm TB
                </th>
                <th className="p-2.5 text-center w-24">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((s, index) => {
                const gpa = calculateSemesterGPA(s.grades.semester1);
                const rank = getPerformanceRank(gpa, s.grades.semester1);
                const isUnder5 = gpa > 0 && gpa < 5.0;

                return (
                  <tr
                    key={s.id}
                    className={`transition-colors ${
                      isUnder5 ? 'bg-rose-50/40 hover:bg-rose-50/60' : 'hover:bg-blue-50/30'
                    }`}
                  >
                    <td className="p-2.5 text-center text-slate-400 font-mono border-r border-slate-100">
                      {index + 1}
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-500 border-r border-slate-100">
                      {s.code}
                    </td>
                    <td className="p-2.5 font-bold text-slate-900 border-r border-slate-100">
                      {s.name}
                    </td>

                    {/* TX1 */}
                    <td className="p-1 border-r border-slate-100">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={s.grades.semester1?.tx1 ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'tx1', e.target.value)}
                        className="w-full text-center py-1 text-xs font-semibold rounded hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </td>

                    {/* TX2 */}
                    <td className="p-1 border-r border-slate-100">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={s.grades.semester1?.tx2 ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'tx2', e.target.value)}
                        className="w-full text-center py-1 text-xs font-semibold rounded hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </td>

                    {/* TX3 */}
                    <td className="p-1 border-r border-slate-100">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={s.grades.semester1?.tx3 ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'tx3', e.target.value)}
                        className="w-full text-center py-1 text-xs font-semibold rounded hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </td>

                    {/* Thực hành */}
                    <td className="p-1 border-r border-slate-100">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={s.grades.semester1?.thuchanh ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'thuchanh', e.target.value)}
                        className="w-full text-center py-1 text-xs font-semibold rounded hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </td>

                    {/* Giữa kỳ (GK) */}
                    <td className="p-1 border-r border-slate-100 bg-blue-50/20">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={s.grades.semester1?.gk ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'gk', e.target.value)}
                        className="w-full text-center py-1 text-xs font-bold text-blue-900 rounded hover:bg-blue-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </td>

                    {/* Cuối kỳ (CK) */}
                    <td className="p-1 border-r border-slate-100 bg-blue-50/20">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={s.grades.semester1?.ck ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'ck', e.target.value)}
                        className="w-full text-center py-1 text-xs font-bold text-blue-900 rounded hover:bg-blue-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </td>

                    {/* Điểm TB môn */}
                    <td className="p-2.5 text-center font-black text-sm border-r border-slate-100 bg-slate-50/70">
                      <span className={isUnder5 ? 'text-rose-600' : 'text-slate-900'}>
                        {gpa > 0 ? gpa.toFixed(1).replace('.', ',') : '--'}
                      </span>
                    </td>

                    {/* Xếp loại */}
                    <td className="p-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
