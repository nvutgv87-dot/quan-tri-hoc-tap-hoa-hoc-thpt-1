import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Send,
  Download,
  Eye,
  Paperclip,
  UploadCloud
} from 'lucide-react';
import { AssignmentItem, ClassItem, StudentItem } from '../types';
import { AssignmentFileModal } from '../components/assignments/AssignmentFileModal';
import { formatFileSize, downloadAttachment } from '../utils/fileAttachment';

interface AssignmentsProps {
  assignments: AssignmentItem[];
  classes: ClassItem[];
  students: StudentItem[];
  onOpenAddAssignment: () => void;
  onOpenEditAssignment: (asg: AssignmentItem) => void;
  onRequestDeleteAssignment: (asg: AssignmentItem) => void;
  onToggleStudentCompletion: (assignmentId: string, studentId: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const Assignments: React.FC<AssignmentsProps> = ({
  assignments,
  classes,
  students,
  onOpenAddAssignment,
  onOpenEditAssignment,
  onRequestDeleteAssignment,
  onToggleStudentCompletion,
  onShowToast
}) => {
  const [expandedAsgId, setExpandedAsgId] = useState<string | null>(assignments[0]?.id || null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed' | 'has-file'>('all');

  // Preview modal state
  const [selectedAsgForFile, setSelectedAsgForFile] = useState<AssignmentItem | null>(null);

  const filteredAssignments = assignments.filter((a) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'has-file') return Boolean(a.attachment);
    return a.status === filterStatus;
  });

  const countWithFiles = assignments.filter((a) => Boolean(a.attachment)).length;

  const handleDownloadFile = (asg: AssignmentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!asg.attachment) return;
    downloadAttachment(asg.attachment);
    onShowToast('Tải tệp thành công', `Đang tải về "${asg.attachment.name}".`, 'success');
  };

  const handlePreviewFile = (asg: AssignmentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAsgForFile(asg);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Quản lý Bài tập & Đề bài Hóa học
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {assignments.length} bài
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Giao bài tập, đính kèm đề bài dạng Word (.docx, .doc) / PDF và theo dõi tiến độ nộp bài của học sinh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filters */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({assignments.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'active' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đang mở
            </button>
            <button
              onClick={() => setFilterStatus('has-file')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                filterStatus === 'has-file'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Có đề Word/PDF ({countWithFiles})</span>
            </button>
            <button
              onClick={() => setFilterStatus('closed')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'closed' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đã đóng
            </button>
          </div>

          <button
            type="button"
            id="btn-add-assignment"
            onClick={onOpenAddAssignment}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tạo bài tập mới (Kèm Word/PDF)</span>
          </button>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <Paperclip className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm text-slate-700">Không tìm thấy bài tập nào phù hợp với bộ lọc.</p>
            <p className="text-xs text-slate-400 mt-1">
              Thầy có thể bấm "+ Tạo bài tập mới" để giao bài tập kèm file đề bài Word hoặc PDF.
            </p>
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const isExpanded = expandedAsgId === asg.id;

            // Target students for this assignment
            const targetStudents = students.filter((s) => asg.classIds.includes(s.classId));
            const totalExpected = targetStudents.length || 1;
            const completedCount = asg.completedStudentIds.length;
            const completionRate = Math.min(100, Math.round((completedCount / totalExpected) * 100));

            const uncompletedStudents = targetStudents.filter(
              (s) => !asg.completedStudentIds.includes(s.id)
            );

            const isPdf =
              asg.attachment?.type === 'pdf' ||
              asg.attachment?.name.toLowerCase().endsWith('.pdf');

            return (
              <div
                key={asg.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Assignment Main Row */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">
                          {asg.topic}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            asg.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {asg.status === 'active' ? 'Đang mở' : 'Đã đóng hạn'}
                        </span>

                        {asg.attachment && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                              isPdf
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            <Paperclip className="w-3 h-3" />
                            {isPdf ? 'Đề PDF' : 'Đề Word'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1.5">{asg.title}</h3>

                      {asg.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {asg.description}
                        </p>
                      )}

                      {/* Attached File Bar */}
                      {asg.attachment ? (
                        <div className="mt-3.5 flex flex-wrap items-center gap-2 p-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors max-w-xl">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-[10px] ${
                              isPdf
                                ? 'bg-rose-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {isPdf ? 'PDF' : 'DOC'}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {asg.attachment.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {formatFileSize(asg.attachment.size)} • Ngày đăng: {asg.attachment.uploadedAt || asg.assignedDate}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handlePreviewFile(asg, e)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                              title="Xem đề bài"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Xem đề</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDownloadFile(asg, e)}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                              title="Tải về file đề bài"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Tải về</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2.5">
                          <button
                            type="button"
                            onClick={() => onOpenEditAssignment(asg)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>+ Đính kèm file đề bài (.docx, .doc, .pdf)</span>
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                        <span>
                          Lớp áp dụng: <strong className="text-slate-800">{asg.classIds.join(', ')}</strong>
                        </span>
                        <span>•</span>
                        <span>Ngày giao: {asg.assignedDate}</span>
                        <span>•</span>
                        <span className="font-semibold text-rose-600">Hạn nộp: {asg.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Quick Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:w-96 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-600">
                          Đã nộp: <strong className="text-slate-900">{completedCount}</strong>/{totalExpected}
                        </span>
                        <span className="font-bold text-blue-700">{completionRate}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => onOpenEditAssignment(asg)}
                        title="Sửa bài tập hoặc đổi tệp đính kèm"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRequestDeleteAssignment(asg)}
                        title="Xóa bài tập"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedAsgId(isExpanded ? null : asg.id)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                      >
                        <span>{isExpanded ? 'Thu gọn' : 'Xem học sinh'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Student Submission Detail Roster */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Chi tiết nộp bài theo từng học sinh ({targetStudents.length} học sinh)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Tích chọn để cập nhật trạng thái đã hoàn thành bài tập cho học sinh
                        </p>
                      </div>

                      {uncompletedStudents.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast(
                              'Gửi nhắc nhở',
                              `Đã tạo thông báo đôn đốc nộp bài tới ${uncompletedStudents.length} học sinh chưa nộp.`,
                              'info'
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Nhắc nhở {uncompletedStudents.length} em chưa nộp</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-1">
                      {targetStudents.map((student) => {
                        const isDone = asg.completedStudentIds.includes(student.id);

                        return (
                          <div
                            key={student.id}
                            onClick={() => onToggleStudentCompletion(asg.id, student.id)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              isDone
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <span className="font-semibold block truncate">{student.name}</span>
                              <span className="text-[10px] text-slate-400">
                                Lớp {student.classId} • {student.code}
                              </span>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                                isDone
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Document View / Preview Modal */}
      <AssignmentFileModal
        isOpen={Boolean(selectedAsgForFile)}
        onClose={() => setSelectedAsgForFile(null)}
        assignment={selectedAsgForFile}
      />
    </div>
  );
};
