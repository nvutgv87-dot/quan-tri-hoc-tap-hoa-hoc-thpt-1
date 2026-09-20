import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  CircleAlert,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';
import { TeachingPlanItem } from '../types';

interface TeachingPlanProps {
  teachingPlans: TeachingPlanItem[];
  onOpenAddPlan: () => void;
  onOpenEditPlan: (plan: TeachingPlanItem) => void;
  onRequestDeletePlan: (plan: TeachingPlanItem) => void;
  onUpdateStatus: (planId: string, status: TeachingPlanItem['status']) => void;
}

export const TeachingPlan: React.FC<TeachingPlanProps> = ({
  teachingPlans,
  onOpenAddPlan,
  onOpenEditPlan,
  onRequestDeletePlan,
  onUpdateStatus
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedWeek, setSelectedWeek] = useState<number | 'ALL'>('ALL');

  const filteredPlans = useMemo(() => {
    return teachingPlans.filter((p) => {
      if (selectedGrade !== 'ALL' && p.gradeLevel !== selectedGrade) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (selectedWeek !== 'ALL' && p.week !== selectedWeek) return false;
      return true;
    });
  }, [teachingPlans, selectedGrade, selectedStatus, selectedWeek]);

  // Weeks present
  const availableWeeks = Array.from(new Set(teachingPlans.map((p) => p.week))).sort(
    (a, b) => a - b
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Kế hoạch Giảng dạy Môn Hóa học
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phân phối chương trình chi tiết theo tuần, tiết, chủ đề và tiến độ thực hiện
          </p>
        </div>

        <button
          type="button"
          id="btn-add-plan"
          onClick={onOpenAddPlan}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm bài dạy mới</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Khối lớp</label>
          <select
            value={selectedGrade}
            onChange={(e) =>
              setSelectedGrade(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
          >
            <option value="ALL">Tất cả khối lớp</option>
            <option value={10}>Hóa học 10</option>
            <option value={11}>Hóa học 11</option>
            <option value={12}>Hóa học 12</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Tuần học</label>
          <select
            value={selectedWeek}
            onChange={(e) =>
              setSelectedWeek(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
          >
            <option value="ALL">Tất cả các tuần ({availableWeeks.length} tuần)</option>
            {availableWeeks.map((w) => (
              <option key={w} value={w}>
                Tuần {w}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Trạng thái bài dạy</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Chưa thực hiện">Chưa thực hiện</option>
          </select>
        </div>
      </div>

      {/* Teaching Plan Table (Section 14) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 text-center w-16">Tuần</th>
                <th className="p-3.5 text-center w-16">Tiết</th>
                <th className="p-3.5 w-36">Chủ đề</th>
                <th className="p-3.5 min-w-[200px]">Nội dung bài học</th>
                <th className="p-3.5 min-w-[160px]">Mục tiêu cần đạt</th>
                <th className="p-3.5 min-w-[160px]">Hoạt động & Thí nghiệm</th>
                <th className="p-3.5 text-center w-36">Trạng thái</th>
                <th className="p-3.5 text-right w-20">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Không có kế hoạch bài dạy nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-center font-bold text-slate-900 bg-slate-50/50">
                      T{plan.week}
                    </td>
                    <td className="p-3.5 text-center font-mono font-medium text-slate-600">
                      {plan.period}
                    </td>
                    <td className="p-3.5 font-semibold text-blue-900">
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 block text-[11px] truncate">
                        {plan.topic}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 leading-snug">
                      <div>{plan.lessonContent}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Hóa học {plan.gradeLevel}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 leading-relaxed">{plan.objectives || '--'}</td>
                    <td className="p-3.5 text-slate-600 leading-relaxed">{plan.activities || '--'}</td>

                    {/* Quick status dropdown */}
                    <td className="p-3.5 text-center">
                      <select
                        value={plan.status}
                        onChange={(e) =>
                          onUpdateStatus(plan.id, e.target.value as TeachingPlanItem['status'])
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-hidden transition-all ${
                          plan.status === 'Hoàn thành'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : plan.status === 'Đang thực hiện'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Chưa thực hiện">Chưa thực hiện</option>
                        <option value="Đang thực hiện">Đang thực hiện</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEditPlan(plan)}
                          title="Sửa kế hoạch"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRequestDeletePlan(plan)}
                          title="Xóa kế hoạch"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
