import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { StudentItem, ClassItem } from '../../types';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Partial<StudentItem>) => void;
  classes: ClassItem[];
  initialStudent?: StudentItem | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classes,
  initialStudent
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(initialStudent?.name || '');
  const [classId, setClassId] = useState(initialStudent?.classId || (classes[0]?.id || '11A1'));
  const [gender, setGender] = useState<'Nam' | 'Nữ'>(initialStudent?.gender || 'Nam');
  const [dob, setDob] = useState(initialStudent?.dob || '2009-01-15');
  const [phone, setPhone] = useState(initialStudent?.phone || '');
  
  // Grade fields
  const [tx1, setTx1] = useState(initialStudent?.grades.semester1?.tx1?.toString() || '');
  const [tx2, setTx2] = useState(initialStudent?.grades.semester1?.tx2?.toString() || '');
  const [tx3, setTx3] = useState(initialStudent?.grades.semester1?.tx3?.toString() || '');
  const [thuchanh, setThuchanh] = useState(initialStudent?.grades.semester1?.thuchanh?.toString() || '');
  const [gk, setGk] = useState(initialStudent?.grades.semester1?.gk?.toString() || '');
  const [ck, setCk] = useState(initialStudent?.grades.semester1?.ck?.toString() || '');
  const [notes, setNotes] = useState(initialStudent?.teacherNotes || '');

  const parseScore = (val: string) => {
    const num = parseFloat(val.trim().replace(',', '.'));
    return isNaN(num) ? null : Math.min(10, Math.max(0, num));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedData: Partial<StudentItem> = {
      ...(initialStudent || {}),
      name: name.trim(),
      classId,
      gender,
      dob,
      phone,
      teacherNotes: notes,
      grades: {
        semester1: {
          tx1: parseScore(tx1),
          tx2: parseScore(tx2),
          tx3: parseScore(tx3),
          thuchanh: parseScore(thuchanh),
          gk: parseScore(gk),
          ck: parseScore(ck)
        }
      }
    };

    onSave(updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {initialStudent ? 'Chỉnh sửa thông tin học sinh' : '+ Thêm học sinh mới'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Nguyễn Văn Hoàng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lớp học <span className="text-rose-500">*</span>
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.academicTrack})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
              />
            </div>
          </div>

          {/* Grades Section */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Điểm số môn Hóa học (Học kỳ I)
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">TX 1 (hs 1)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="8.0"
                  value={tx1}
                  onChange={(e) => setTx1(e.target.value)}
                  className="w-full px-2 py-1.5 text-center text-sm rounded-lg border border-slate-300 focus:border-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">TX 2 (hs 1)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="7.5"
                  value={tx2}
                  onChange={(e) => setTx2(e.target.value)}
                  className="w-full px-2 py-1.5 text-center text-sm rounded-lg border border-slate-300 focus:border-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">TX 3 (hs 1)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="8.5"
                  value={tx3}
                  onChange={(e) => setTx3(e.target.value)}
                  className="w-full px-2 py-1.5 text-center text-sm rounded-lg border border-slate-300 focus:border-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">T.Hành (hs 1)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="9.0"
                  value={thuchanh}
                  onChange={(e) => setThuchanh(e.target.value)}
                  className="w-full px-2 py-1.5 text-center text-sm rounded-lg border border-slate-300 focus:border-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-blue-900 mb-0.5">GK (hs 2)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="7.5"
                  value={gk}
                  onChange={(e) => setGk(e.target.value)}
                  className="w-full px-2 py-1.5 text-center text-sm rounded-lg border border-blue-300 bg-blue-50/40 focus:border-blue-600 outline-hidden font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-blue-900 mb-0.5">CK (hs 3)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="8.0"
                  value={ck}
                  onChange={(e) => setCk(e.target.value)}
                  className="w-full px-2 py-1.5 text-center text-sm rounded-lg border border-blue-300 bg-blue-50/40 focus:border-blue-600 outline-hidden font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú của giáo viên
            </label>
            <textarea
              rows={2}
              placeholder="Nhận xét về học lực Hóa học, năng khiếu, sự chuyên cần..."
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
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
