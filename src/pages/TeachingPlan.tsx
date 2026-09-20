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
  Check,
  Paperclip,
  Download,
  Eye,
  UploadCloud,
  FileText
} from 'lucide-react';
import { TeachingPlanItem } from '../types';
import { TeachingPlanFileModal } from '../components/teachingPlan/TeachingPlanFileModal';
import { formatFileSize, downloadAttachment } from '../utils/fileAttachment';

interface TeachingPlanProps {
  teachingPlans: TeachingPlanItem[];
  onOpenAddPlan: () => void;
  onOpenEditPlan: (plan: TeachingPlanItem) => void;
  onRequestDeletePlan: (plan: TeachingPlanItem) => void;
  onUpdateStatus: (planId: string, status: TeachingPlanItem['status']) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const TeachingPlan: React.FC<TeachingPlanProps> = ({
  teachingPlans,
  onOpenAddPlan,
  onOpenEditPlan,
  onRequestDeletePlan,
  onUpdateStatus,
  onShowToast
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedWeek, setSelectedWeek] = useState<number | 'ALL'>('ALL');
  const [filterFileOnly, setFilterFileOnly] = useState<boolean>(false);

  // Preview file modal state
  const [selectedPlanForFile, setSelectedPlanForFile] = useState<TeachingPlanItem | null>(null);

  const filteredPlans = useMemo(() => {
    return teachingPlans.filter((p) => {
      if (selectedGrade !== 'ALL' && p.gradeLevel !== selectedGrade) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (selectedWeek !== 'ALL' && p.week !== selectedWeek) return false;
      if (filterFileOnly && !p.attachment) return false;
      return true;
    });
  }, [teachingPlans, selectedGrade, selectedStatus, selectedWeek, filterFileOnly]);

  const countWithFiles = teachingPlans.filter((p) => Boolean(p.attachment)).length;

  // Weeks present
  const availableWeeks = Array.from(new Set(teachingPlans.map((p) => p.week))).sort(
    (a, b) => a - b
  );

  const handleDownload = (plan: TeachingPlanItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!plan.attachment) return;
    downloadAttachment(plan.attachment, 'lesson_plan');
    if (onShowToast) {
      onShowToast(
        'Tải tệp thành công',
        `Đang tải về giáo án "${plan.attachment.name}".`,
        'success'
      );
    }
  };

  const handlePreview = (plan: TeachingPlanItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlanForFile(plan);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Kế hoạch Giảng dạy Môn Hóa học
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {teachingPlans.length} bài
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Phân phối chương trình chi tiết theo tuần, tiết, chủ đề và đính kèm tệp giáo án Word (.docx, .doc) / PDF
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-add-plan"
            onClick={onOpenAddPlan}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm bài dạy mới (Kèm Word/PDF)</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Tệp đính kèm Word/PDF</label>
          <button
            type="button"
            onClick={() => setFilterFileOnly(!filterFileOnly)}
            className={`w-full px-3 py-2 text-xs font-semibold rounded-xl border flex items-center justify-between transition-colors ${
              filterFileOnly
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Chỉ bài có tệp đính kèm</span>
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                filterFileOnly ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {countWithFiles}
            </span>
          </button>
        </div>
      </div>

      {/* Teaching Plan Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 text-center w-16">Tuần</th>
                <th className="p-3.5 text-center w-16">Tiết</th>
                <th className="p-3.5 w-36">Chủ đề</th>
                <th className="p-3.5 min-w-[240px]">Nội dung bài học & Giáo án</th>
                <th className="p-3.5 min-w-[160px]">Mục tiêu cần đạt</th>
                <th className="p-3.5 min-w-[160px]">Hoạt động & Thí nghiệm</th>
                <th className="p-3.5 text-center w-36">Trạng thái</th>
                <th className="p-3.5 text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    <Paperclip className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">Không có kế hoạch bài dạy nào phù hợp với bộ lọc.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Thầy có thể bấm "+ Thêm bài dạy mới" để bổ sung kế hoạch bài dạy kèm tệp Word hoặc PDF.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => {
                  const isPdf =
                    plan.attachment?.type === 'pdf' ||
                    plan.attachment?.name.toLowerCase().endsWith('.pdf');

                  return (
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{plan.lessonContent}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            (Hóa {plan.gradeLevel})
                          </span>
                        </div>

                        {/* Attached File Row */}
                        {plan.attachment ? (
                          <div className="mt-2 flex items-center justify-between gap-2 p-1.5 px-2.5 rounded-lg bg-slate-100/80 border border-slate-200/80 max-w-sm">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase shrink-0 ${
                                  isPdf
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}
                              >
                                {isPdf ? 'PDF' : 'DOCX'}
                              </span>
                              <span className="text-[11px] font-medium text-slate-700 truncate max-w-[140px]">
                                {plan.attachment.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal shrink-0">
                                ({formatFileSize(plan.attachment.size)})
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => handlePreview(plan, e)}
                                title="Xem kế hoạch bài dạy chi tiết"
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDownload(plan, e)}
                                title="Tải tệp giáo án về máy"
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenEditPlan(plan)}
                            className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>+ Đính kèm file Word/PDF</span>
                          </button>
                        )}
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
                          {plan.attachment && (
                            <button
                              type="button"
                              onClick={(e) => handlePreview(plan, e)}
                              title="Xem chi tiết giáo án"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onOpenEditPlan(plan)}
                            title="Sửa kế hoạch hoặc đổi tệp giáo án"
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Lesson Plan Viewer Modal */}
      <TeachingPlanFileModal
        isOpen={Boolean(selectedPlanForFile)}
        onClose={() => setSelectedPlanForFile(null)}
        plan={selectedPlanForFile}
      />
    </div>
  );
};
