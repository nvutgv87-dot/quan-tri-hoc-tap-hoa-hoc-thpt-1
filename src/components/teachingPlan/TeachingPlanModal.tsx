import React, { useState, useRef } from 'react';
import {
  X,
  Save,
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
  Paperclip
} from 'lucide-react';
import { TeachingPlanItem, AssignmentAttachment } from '../../types';
import {
  formatFileSize,
  readUploadedFile,
  downloadAttachment,
  SAMPLE_TEACHING_PLAN_ATTACHMENTS,
  isSupportedAssignmentFile
} from '../../utils/fileAttachment';

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

  // Attachment state for Word (.docx, .doc) or PDF (.pdf)
  const [attachment, setAttachment] = useState<AssignmentAttachment | null>(
    initialPlan?.attachment || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setFileError(null);
    if (!isSupportedAssignmentFile(file)) {
      setFileError('Chỉ hỗ trợ tệp kế hoạch bài dạy định dạng Word (.docx, .doc) hoặc PDF (.pdf).');
      return;
    }

    try {
      setIsReadingFile(true);
      const parsed = await readUploadedFile(file);
      setAttachment(parsed);

      // Auto-fill lesson content if teacher hasn't entered one yet
      if (!lessonContent.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/_/g, ' ')
          .replace(/^(giao an|ke hoach bai day)/i, '')
          .trim();
        setLessonContent(cleanName || file.name);
      }
    } catch (err: any) {
      setFileError(err.message || 'Lỗi khi tải tệp lên. Vui lòng thử lại.');
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleSelectSampleAttachment = (sample: AssignmentAttachment) => {
    setAttachment(sample);
    if (!lessonContent.trim()) {
      const clean = sample.name
        .replace(/\.[^/.]+$/, '')
        .replace(/_/g, ' ')
        .replace(/^(giao an|ke hoach bai day)/i, '')
        .trim();
      setLessonContent(clean || sample.name);
    }
    setFileError(null);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      status,
      attachment: attachment || null
    });
    onClose();
  };

  const chemistryTopics = [
    'Cân bằng hóa học',
    'Cân bằng trong dung dịch nước & pH',
    'Phản ứng Oxi hóa - Khử',
    'Nitơ và Photpho',
    'Đại cương hóa học hữu cơ',
    'Hiđrocacbon và dẫn xuất',
    'Thực hành Hóa học'
  ];

  const isPdf =
    attachment?.type === 'pdf' || attachment?.name.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {initialPlan ? 'Chỉnh sửa kế hoạch bài dạy' : '+ Thêm kế hoạch bài dạy mới'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ đính kèm tệp kế hoạch bài dạy / giáo án định dạng Word (.docx, .doc) hoặc PDF
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* 1. File Upload Dropzone (Word / PDF) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800">
                Tệp giáo án / Kế hoạch bài dạy đính kèm (Word .docx, .doc hoặc PDF .pdf)
              </label>
              {attachment && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã đính kèm tệp
                </span>
              )}
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".docx,.doc,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
              className="hidden"
              id="teaching-plan-file-input"
            />

            {!attachment ? (
              /* Dropzone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-white bg-slate-100/60'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                      Kéo thả tệp giáo án vào đây hoặc <span className="text-blue-600 underline">chọn tệp từ máy tính</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Hỗ trợ Microsoft Word (<strong>.docx</strong>, <strong>.doc</strong>) hoặc <strong>.pdf</strong> (tối đa 25MB)
                    </p>
                  </div>
                </div>

                {isReadingFile && (
                  <div className="mt-3 text-blue-600 flex items-center justify-center gap-1 text-xs">
                    <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Đang đọc và xử lý tệp tin...</span>
                  </div>
                )}
              </div>
            ) : (
              /* Attached File Card */
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs ${
                      isPdf
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isPdf ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isPdf ? 'PDF' : 'WORD'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formatFileSize(attachment.size)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                      {attachment.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => downloadAttachment(attachment, 'lesson_plan')}
                    title="Tải thử tệp"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Đổi tệp khác"
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Đổi tệp
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    title="Xóa tệp đính kèm"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {fileError && (
              <div className="mt-2.5 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Quick Sample Teaching Plans Picker */}
            {!attachment && (
              <div className="mt-3 pt-3 border-t border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                  ⚡ Nạp nhanh giáo án mẫu có sẵn để thử nghiệm:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_TEACHING_PLAN_ATTACHMENTS.map((sample) => (
                    <button
                      type="button"
                      key={sample.name}
                      onClick={() => handleSelectSampleAttachment(sample)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <FileText className="w-3 h-3 text-blue-600" />
                      <span className="truncate max-w-[200px]">{sample.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Grade, Week, Period */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
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
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
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
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* 3. Topic */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chủ đề Hóa học</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden"
            />
            {/* Quick tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {chemistryTopics.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`px-2 py-0.5 text-[11px] rounded-lg transition-colors ${
                    topic === t
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Lesson Content */}
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
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden font-medium"
            />
          </div>

          {/* 5. Objectives */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mục tiêu cần đạt (Chuẩn CV 5512)
            </label>
            <textarea
              rows={2}
              placeholder="Năng lực hóa học, năng lực chung và phẩm chất cần hình thành..."
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* 6. Activities */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hoạt động dạy học & Thí nghiệm thực hành
            </label>
            <textarea
              rows={2}
              placeholder="Thí nghiệm biểu diễn, hoạt động nhóm, phiếu học tập, luyện tập..."
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* 7. Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trạng thái thực hiện
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TeachingPlanItem['status'])}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 outline-hidden bg-white"
            >
              <option value="Chưa thực hiện">Chưa thực hiện</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-colors"
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
