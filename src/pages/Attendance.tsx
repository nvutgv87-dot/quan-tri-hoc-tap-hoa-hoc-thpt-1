import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  Check,
  Calendar,
  Clock,
  School,
  Download
} from 'lucide-react';
import { StudentItem, ClassItem, DailyAttendanceRecord, AttendanceStatus } from '../types';
import { StorageService } from '../utils/storage';

interface AttendanceProps {
  students: StudentItem[];
  classes: ClassItem[];
  selectedClassId?: string;
  onUpdateStudents: (updated: StudentItem[]) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const Attendance: React.FC<AttendanceProps> = ({
  students,
  classes,
  selectedClassId,
  onUpdateStudents,
  onShowToast
}) => {
  const [currentClassId, setCurrentClassId] = useState<string>(
    selectedClassId || classes[0]?.id || '11A1'
  );
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [period, setPeriod] = useState<number>(2); // Tiết 2

  // Current session attendance map: { [studentId]: 'present' | 'excused' | 'unexcused' }
  const [statusMap, setStatusMap] = useState<{ [id: string]: AttendanceStatus }>({});
  const [noteMap, setNoteMap] = useState<{ [id: string]: string }>({});
  const [isSaved, setIsSaved] = useState(false);

  // Filter students for the current selected class
  const classStudents = students.filter((s) => s.classId === currentClassId);

  // Initialize or load daily attendance records for this session
  useEffect(() => {
    const savedRecords = StorageService.getDailyAttendance();
    const recordId = `${currentClassId}_${date}_p${period}`;
    const found = savedRecords.find((r) => r.id === recordId);

    const initialStatus: { [id: string]: AttendanceStatus } = {};
    const initialNotes: { [id: string]: string } = {};

    classStudents.forEach((s) => {
      if (found) {
        const studentRec = found.records.find((r) => r.studentId === s.id);
        initialStatus[s.id] = studentRec?.status || 'present';
        initialNotes[s.id] = studentRec?.note || '';
      } else {
        // Default to present
        initialStatus[s.id] = 'present';
        initialNotes[s.id] = '';
      }
    });

    setStatusMap(initialStatus);
    setNoteMap(initialNotes);
    setIsSaved(!!found);
  }, [currentClassId, date, period, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
    setIsSaved(false);
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setNoteMap((prev) => ({ ...prev, [studentId]: note }));
    setIsSaved(false);
  };

  const markAllPresent = () => {
    const nextStatus: { [id: string]: AttendanceStatus } = {};
    classStudents.forEach((s) => {
      nextStatus[s.id] = 'present';
    });
    setStatusMap(nextStatus);
    setIsSaved(false);
    onShowToast('Điểm danh', 'Đã đánh dấu tất cả học sinh có mặt.', 'info');
  };

  // Save session attendance & update aggregate attendance counters for each student
  const saveAttendance = () => {
    const recordId = `${currentClassId}_${date}_p${period}`;
    const newRecord: DailyAttendanceRecord = {
      id: recordId,
      classId: currentClassId,
      date,
      period,
      records: classStudents.map((s) => ({
        studentId: s.id,
        status: statusMap[s.id] || 'present',
        note: noteMap[s.id] || ''
      })),
      createdAt: new Date().toISOString()
    };

    const allRecords = StorageService.getDailyAttendance();
    const updatedRecords = allRecords.filter((r) => r.id !== recordId);
    updatedRecords.push(newRecord);
    StorageService.saveDailyAttendance(updatedRecords);

    // Update students cumulative totals
    const updatedStudents = students.map((s) => {
      if (s.classId !== currentClassId) return s;
      const status = statusMap[s.id] || 'present';
      return {
        ...s,
        attendanceSummary: {
          present: s.attendanceSummary.present + (status === 'present' ? 1 : 0),
          excused: s.attendanceSummary.excused + (status === 'excused' ? 1 : 0),
          unexcused: s.attendanceSummary.unexcused + (status === 'unexcused' ? 1 : 0),
          total: s.attendanceSummary.total + 1
        }
      };
    });

    onUpdateStudents(updatedStudents);
    setIsSaved(true);
    onShowToast(
      'Lưu thành công',
      `Đã lưu bảng điểm danh lớp ${currentClassId} ngày ${date} tiết ${period}.`,
      'success'
    );
  };

  // Quick stats for current screen
  const presentCount = classStudents.filter((s) => (statusMap[s.id] || 'present') === 'present').length;
  const excusedCount = classStudents.filter((s) => statusMap[s.id] === 'excused').length;
  const unexcusedCount = classStudents.filter((s) => statusMap[s.id] === 'unexcused').length;
  const sessionAttRate =
    classStudents.length > 0
      ? Math.round((presentCount / classStudents.length) * 1000) / 10
      : 100;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Quản lý Chuyên cần môn Hóa học
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Điểm danh từng tiết học, theo dõi học sinh vắng có phép và không phép
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={markAllPresent}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Đánh dấu tất cả có mặt</span>
          </button>

          <button
            type="button"
            id="btn-save-attendance"
            onClick={saveAttendance}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Đã lưu điểm danh' : 'Lưu điểm danh'}</span>
          </button>
        </div>
      </div>

      {/* Session Filter Bar (Lớp, Ngày, Tiết học) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Lớp */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-blue-600" />
            <span>Chọn lớp học</span>
          </label>
          <select
            value={currentClassId}
            onChange={(e) => setCurrentClassId(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white font-semibold text-slate-800"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.academicTrack})
              </option>
            ))}
          </select>
        </div>

        {/* Ngày */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Ngày điểm danh</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-medium text-slate-800"
          />
        </div>

        {/* Tiết học */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Tiết học theo TKB</span>
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white font-semibold text-slate-800"
          >
            <option value={1}>Tiết 1 (07:00 - 07:45)</option>
            <option value={2}>Tiết 2 (07:50 - 08:35)</option>
            <option value={3}>Tiết 3 (08:50 - 09:35)</option>
            <option value={4}>Tiết 4 (09:40 - 10:25)</option>
            <option value={5}>Tiết 5 (10:30 - 11:15)</option>
          </select>
        </div>
      </div>

      {/* Session Live Statistics (Section 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Sĩ số lớp</span>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{classStudents.length} học sinh</div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs text-emerald-800 font-semibold">Có mặt</span>
          <div className="text-xl font-bold text-emerald-950 mt-0.5">{presentCount} em</div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-xs text-amber-800 font-semibold">Vắng có phép</span>
          <div className="text-xl font-bold text-amber-950 mt-0.5">{excusedCount} em</div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
          <span className="text-xs text-rose-800 font-semibold">Vắng không phép</span>
          <div className="text-xl font-bold text-rose-950 mt-0.5">{unexcusedCount} em</div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 col-span-2 sm:col-span-1">
          <span className="text-xs text-blue-800 font-semibold">Tỷ lệ chuyên cần</span>
          <div className="text-xl font-black text-blue-950 mt-0.5">{sessionAttRate}%</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 text-center w-12">STT</th>
                <th className="p-3.5">Mã HS</th>
                <th className="p-3.5">Họ và tên học sinh</th>
                <th className="p-3.5 text-center w-32">Có mặt</th>
                <th className="p-3.5 text-center w-32">Vắng có phép</th>
                <th className="p-3.5 text-center w-32">Vắng không phép</th>
                <th className="p-3.5">Ghi chú lý do / Biểu hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((s, index) => {
                const currentStatus = statusMap[s.id] || 'present';
                const currentNote = noteMap[s.id] || '';

                return (
                  <tr
                    key={s.id}
                    className={`transition-colors ${
                      currentStatus === 'unexcused'
                        ? 'bg-rose-50/50'
                        : currentStatus === 'excused'
                        ? 'bg-amber-50/40'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="p-3.5 text-center text-slate-400 font-mono font-medium">
                      {index + 1}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">{s.code}</td>
                    <td className="p-3.5 font-bold text-slate-900">{s.name}</td>

                    {/* Radio: Có mặt */}
                    <td className="p-3.5 text-center">
                      <label className="inline-flex items-center justify-center cursor-pointer p-1">
                        <input
                          type="radio"
                          name={`att_${s.id}`}
                          checked={currentStatus === 'present'}
                          onChange={() => handleStatusChange(s.id, 'present')}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                    </td>

                    {/* Radio: Có phép */}
                    <td className="p-3.5 text-center">
                      <label className="inline-flex items-center justify-center cursor-pointer p-1">
                        <input
                          type="radio"
                          name={`att_${s.id}`}
                          checked={currentStatus === 'excused'}
                          onChange={() => handleStatusChange(s.id, 'excused')}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                      </label>
                    </td>

                    {/* Radio: Không phép */}
                    <td className="p-3.5 text-center">
                      <label className="inline-flex items-center justify-center cursor-pointer p-1">
                        <input
                          type="radio"
                          name={`att_${s.id}`}
                          checked={currentStatus === 'unexcused'}
                          onChange={() => handleStatusChange(s.id, 'unexcused')}
                          className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                        />
                      </label>
                    </td>

                    {/* Note input */}
                    <td className="p-3.5">
                      <input
                        type="text"
                        placeholder="Ví dụ: Phụ huynh gọi xin phép ốm, đi trễ 15p..."
                        value={currentNote}
                        onChange={(e) => handleNoteChange(s.id, e.target.value)}
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-hidden bg-white"
                      />
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
