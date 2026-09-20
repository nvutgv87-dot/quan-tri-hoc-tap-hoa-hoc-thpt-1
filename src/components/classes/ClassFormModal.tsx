import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { ClassItem } from '../../types';

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classItem: Partial<ClassItem>) => void;
  initialClass?: ClassItem | null;
}

export const ClassFormModal: React.FC<ClassFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialClass
}) => {
  if (!isOpen) return null;

  const [id, setId] = useState(initialClass?.id || '');
  const [name, setName] = useState(initialClass?.name || '');
  const [gradeLevel, setGradeLevel] = useState(initialClass?.gradeLevel || 11);
  const [academicTrack, setAcademicTrack] = useState(initialClass?.academicTrack || 'KHTN (Hóa - Sinh - Toán)');
  const [homeroomTeacher, setHomeroomTeacher] = useState(initialClass?.homeroomTeacher || 'Thầy Nguyễn Văn Út');
  const [roomNumber, setRoomNumber] = useState(initialClass?.roomNumber || 'Phòng 204');
  const [notes, setNotes] = useState(initialClass?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const classId = id.trim() || name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    onSave({
      id: classId,
      name: name.trim(),
      gradeLevel: Number(gradeLevel),
      academicTrack: academicTrack.trim(),
      homeroomTeacher: homeroomTeacher.trim(),
      roomNumber: roomNumber.trim(),
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {initialClass ? 'Chỉnh sửa thông tin lớp học' : '+ Thêm lớp học mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã lớp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!!initialClass}
                placeholder="Ví dụ: 11A4"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden uppercase disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên hiển thị <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Lớp 11A4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
              >
                <option value={10}>Khối 10</option>
                <option value={11}>Khối 11</option>
                <option value={12}>Khối 12</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phòng học</label>
              <input
                type="text"
                placeholder="Phòng 207"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ban / Định hướng</label>
            <input
              type="text"
              placeholder="KHTN (Hóa - Sinh - Toán)"
              value={academicTrack}
              onChange={(e) => setAcademicTrack(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Giáo viên chủ nhiệm</label>
            <input
              type="text"
              placeholder="Thầy Nguyễn Văn Út"
              value={homeroomTeacher}
              onChange={(e) => setHomeroomTeacher(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú đặc điểm lớp</label>
            <textarea
              rows={2}
              placeholder="Đặc điểm học tập, học lực, nề nếp..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu lớp học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
