import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Users,
  Eye,
  MessageSquare,
  Phone,
  CheckCircle,
  HelpCircle,
  Clock,
  Send,
  Search
} from 'lucide-react';
import { StudentItem, ClassItem, AttentionStudentView } from '../types';
import { analyzeAttentionStatus } from '../utils/calculations';

interface AttentionStudentsProps {
  students: StudentItem[];
  classes: ClassItem[];
  onSelectStudent: (student: StudentItem) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const AttentionStudents: React.FC<AttentionStudentsProps> = ({
  students,
  classes,
  onSelectStudent,
  onShowToast
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Collect all students needing attention
  const attentionList = useMemo(() => {
    const list: AttentionStudentView[] = [];
    students.forEach((s) => {
      const c = classes.find((item) => item.id === s.classId);
      const res = analyzeAttentionStatus(s, c?.name || s.classId);
      if (res) list.push(res);
    });
    return list;
  }, [students, classes]);

  const filteredList = useMemo(() => {
    return attentionList.filter((item) => {
      if (selectedTier !== 'ALL' && item.tier !== selectedTier) return false;
      if (selectedClass !== 'ALL' && item.student.classId !== selectedClass) return false;
      if (
        search &&
        !item.student.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.student.code.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [attentionList, selectedTier, selectedClass, search]);

  // Counts by tier
  const tier3Count = attentionList.filter((i) => i.tier === 'Mức 3 – Ưu tiên hỗ trợ').length;
  const tier2Count = attentionList.filter((i) => i.tier === 'Mức 2 – Cần hỗ trợ').length;
  const tier1Count = attentionList.filter((i) => i.tier === 'Mức 1 – Theo dõi').length;

  const handleContactParent = (student: StudentItem) => {
    onShowToast(
      'Liên hệ phụ huynh',
      `Đã mở giao diện liên hệ phụ huynh em ${student.name} (SĐT: ${student.phone || '0987-xxx-xxx'}).`,
      'info'
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Danh sách Học sinh Cần Quan tâm & Hỗ trợ
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống tự động phát hiện học sinh điểm thấp, điểm giảm, vắng nhiều hoặc chậm nộp bài tập Hóa
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onShowToast(
                'Lập kế hoạch phụ đạo',
                `Đã tạo danh sách ${attentionList.length} học sinh để gửi phiếu kèm cặp & phụ đạo môn Hóa.`,
                'success'
              );
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Lập kế hoạch phụ đạo
          </button>
        </div>
      </div>

      {/* 3 Tier Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tier 3 */}
        <div
          onClick={() => setSelectedTier(selectedTier === 'Mức 3 – Ưu tiên hỗ trợ' ? 'ALL' : 'Mức 3 – Ưu tiên hỗ trợ')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedTier === 'Mức 3 – Ưu tiên hỗ trợ'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-300 shadow-xs'
              : 'bg-white border-slate-200 hover:border-rose-200 hover:bg-rose-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Mức 3: Ưu tiên hỗ trợ
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800">
              {tier3Count} học sinh
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Điểm TB &lt; 5.0 hoặc vắng nhiều không phép; nguy cơ không đạt chuẩn môn Hóa
          </p>
        </div>

        {/* Tier 2 */}
        <div
          onClick={() => setSelectedTier(selectedTier === 'Mức 2 – Cần hỗ trợ' ? 'ALL' : 'Mức 2 – Cần hỗ trợ')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedTier === 'Mức 2 – Cần hỗ trợ'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-300 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-200 hover:bg-amber-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Mức 2: Cần hỗ trợ
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
              {tier2Count} học sinh
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Kết quả kiểm tra giảm liên tục hoặc nộp thiếu &gt; 3 bài tập
          </p>
        </div>

        {/* Tier 1 */}
        <div
          onClick={() => setSelectedTier(selectedTier === 'Mức 1 – Theo dõi' ? 'ALL' : 'Mức 1 – Theo dõi')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedTier === 'Mức 1 – Theo dõi'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-300 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-blue-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Mức 1: Theo dõi
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
              {tier1Count} học sinh
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Chuyên cần mấp mé 90% hoặc có dấu hiệu chững lại trong kết quả học tập
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh, mã HS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
          >
            <option value="ALL">Tất cả các lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
          >
            <option value="ALL">Tất cả các mức hỗ trợ</option>
            <option value="Mức 3 – Ưu tiên hỗ trợ">Mức 3: Ưu tiên hỗ trợ</option>
            <option value="Mức 2 – Cần hỗ trợ">Mức 2: Cần hỗ trợ</option>
            <option value="Mức 1 – Theo dõi">Mức 1: Theo dõi</option>
          </select>
        </div>
      </div>

      {/* Main Attention List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Học sinh</th>
                <th className="p-3.5">Lớp</th>
                <th className="p-3.5 text-center">Điểm TB</th>
                <th className="p-3.5 text-center">Chuyên cần</th>
                <th className="p-3.5 text-center">Bài tập</th>
                <th className="p-3.5">Lý do cụ thể</th>
                <th className="p-3.5">Biện pháp đề xuất</th>
                <th className="p-3.5 text-center">Mức độ</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    Không có học sinh nào thuộc danh sách cần quan tâm theo điều kiện chọn.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isTier3 = item.tier === 'Mức 3 – Ưu tiên hỗ trợ';
                  const isTier2 = item.tier === 'Mức 2 – Cần hỗ trợ';

                  return (
                    <tr
                      key={item.student.id}
                      onClick={() => onSelectStudent(item.student)}
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                            {item.student.name.charAt(0)}
                          </div>
                          <div>
                            <span>{item.student.name}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">
                              {item.student.code}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-700">{item.className}</td>
                      <td className="p-3.5 text-center font-bold text-slate-900">
                        {item.averageScore > 0 ? item.averageScore.toFixed(1).replace('.', ',') : '--'}
                      </td>
                      <td className="p-3.5 text-center font-medium text-slate-700">
                        {item.attendanceRate}%
                      </td>
                      <td className="p-3.5 text-center text-slate-600">
                        {item.student.assignmentSummary.completed}/{item.student.assignmentSummary.total}
                      </td>
                      <td className="p-3.5 text-slate-700">
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {item.reasons.map((r, i) => (
                            <li key={i} className="leading-snug">{r}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-3.5 text-blue-800 text-[11px] font-medium leading-relaxed max-w-xs">
                        {item.suggestedIntervention}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block whitespace-nowrap ${
                            isTier3
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : isTier2
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {item.tier}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            title="Liên hệ phụ huynh"
                            onClick={() => handleContactParent(item.student)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Xem hồ sơ & nhận xét"
                            onClick={() => onSelectStudent(item.student)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
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
    </div>
  );
};
