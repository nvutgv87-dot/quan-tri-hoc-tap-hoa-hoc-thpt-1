import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { TeachingPlanItem } from '../../types';

interface TeachingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Partial<TeachingPlanItem>) => void;
  initialPlan?: TeachingPlanItem | null;
}

export const TeachingPlanModal: React.FC<TeachingPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlan
}) => {
  if (!isOpen) return null;

  const [week, setWeek] = useState(initialPlan?.week || 1);
  const [period, setPeriod] = useState(initialPlan?.period || 1);
  const [gradeLevel, setGradeLevel] = useState(initialPlan?.gradeLevel || 11);
  const [topic, setTopic] = useState(initialPlan?.topic || 'Cân bằng hóa học');
  const [lessonContent, setLessonContent] = useState(initialPlan?.lessonContent || '');
  const [objectives, setObjectives] = useState(initialPlan?.objectives || '');
  const [activities, setActivities] = useState(initialPlan?.activities || '');
  const [status, setStatus] = useState<TeachingPlanItem['status']>(
    initialPlan?.status || 'Chưa thực hiện'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonContent.trim()) return;

    onSave({
      id: initialPlan?.id || `TP-${Date.now().toString().slice(-4)}`,
      week: Number(week),
      period: Number(period),
      gradeLevel: Number(gradeLevel),
      topic: topic.trim(),
      lessonContent: lessonContent.trim(),
      objectives: objectives.trim(),
      activities: activities.trim(),
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {initialPlan ? 'Chỉnh sửa kế hoạch bài dạy' : '+ Thêm kế hoạch bài dạy mới'}
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
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
              >
                <option value={10}>Hóa học 10</option>
                <option value={11}>Hóa học 11</option>
                <option value={12}>Hóa học 12</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tuần thứ</label>
              <input
                type="number"
                min="1"
                max="35"
                required
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tiết PPCT</label>
              <input
                type="number"
                min="1"
                max="105"
                required
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chủ đề Hóa học
            </label>
            <input
              type="text"
              placeholder="Cân bằng hóa học"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên bài / Nội dung bài học <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Khái niệm phản ứng thuận nghịch và hằng số Kc"
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mục tiêu cần đạt
            </label>
            <textarea
              rows={2}
              placeholder="Kiến thức, năng lực hóa học, phẩm chất..."
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hoạt động dạy học & Thí nghiệm
            </label>
            <textarea
              rows={2}
              placeholder="Thí nghiệm biểu diễn, thảo luận nhóm, bài tập vận dụng..."
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trạng thái thực hiện
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TeachingPlanItem['status'])}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
            >
              <option value="Chưa thực hiện">Chưa thực hiện</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>
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
              Lưu kế hoạch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
