import React from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  Calendar,
  Layers,
  Award,
  BookOpen,
  FlaskConical,
  Paperclip,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { TeachingPlanItem } from '../../types';
import { formatFileSize, downloadAttachment } from '../../utils/fileAttachment';

interface TeachingPlanFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TeachingPlanItem | null;
}

export const TeachingPlanFileModal: React.FC<TeachingPlanFileModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  if (!isOpen || !plan) return null;

  const attachment = plan.attachment;
  const isPdf =
    attachment?.type === 'pdf' || attachment?.name.toLowerCase().endsWith('.pdf');

  const handleDownload = () => {
    if (attachment) {
      downloadAttachment(attachment, 'lesson_plan');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                isPdf ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  {isPdf ? 'KẾ HOẠCH BÀI DẠY (PDF)' : 'KẾ HOẠCH BÀI DẠY (WORD)'}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Tuần {plan.week} • Tiết {plan.period} • Hóa {plan.gradeLevel}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-md">
                {plan.lessonContent}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {attachment && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Tải tệp giáo án về máy"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tải tệp giáo án</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="In kế hoạch bài dạy"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 bg-white">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center sm:text-left flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                SỞ GD&ĐT TÂY NINH
              </p>
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-900">
                TRƯỜNG THPT DƯƠNG MINH CHÂU
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Tổ chuyên môn: Hóa học — Thầy Nguyễn Văn Út
              </p>
            </div>

            <div className="text-right sm:text-right w-full sm:w-auto">
              <p className="text-xs font-bold uppercase text-slate-700">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p className="text-[11px] font-semibold text-slate-600 italic">
                Độc lập – Tự do – Hạnh phúc
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Kế hoạch bài dạy theo Công văn 5512/BGDĐT-GDTrH
              </p>
            </div>
          </div>

          {/* Title Banner */}
          <div className="text-center py-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              MÔN HÓA HỌC {plan.gradeLevel} • CHỦ ĐỀ: {plan.topic}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              KẾ HOẠCH BÀI DẠY: {plan.lessonContent}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Thời lượng: Tiết {plan.period} (Tuần thứ {plan.week}) • Trạng thái:{' '}
              <strong className="text-slate-800">{plan.status}</strong>
            </p>
          </div>

          {/* Attachment File Box */}
          {attachment ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    isPdf
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                        isPdf ? 'bg-rose-200 text-rose-900' : 'bg-blue-200 text-blue-900'
                      }`}
                    >
                      {isPdf ? 'PDF' : 'WORD'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {attachment.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Dung lượng: {formatFileSize(attachment.size)} • Ngày nạp:{' '}
                    {attachment.uploadedAt || '2026-09-20'}
                  </p>
                  {attachment.extractedSummary && (
                    <p className="text-[11px] text-slate-600 mt-1 italic">
                      "{attachment.extractedSummary}"
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp {isPdf ? 'PDF' : 'Word'}</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Chưa đính kèm tệp giáo án gốc. Thầy có thể bấm "Sửa" để tải lên tệp Word hoặc PDF.</span>
            </div>
          )}

          {/* Section I: Mục tiêu bài dạy */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span>I. Mục tiêu cần đạt (Chuẩn năng lực & phẩm chất)</span>
            </h4>
            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line">
              {plan.objectives ||
                '1. Về kiến thức: Học sinh nêu được khái niệm trọng tâm, giải thích hiện tượng và viết chính xác phương trình phản ứng hóa học.\n2. Về năng lực: Rèn luyện năng lực tự học, hợp tác nhóm, tính toán hóa học và giải quyết vấn đề thực tiễn.\n3. Về phẩm chất: Phát triển tính trung thực, cẩn trọng trong thí nghiệm và niềm say mê khoa học.'}
            </div>
          </div>

          {/* Section II: Thiết bị dạy học và học liệu */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              <span>II. Thiết bị dạy học & Học liệu</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">1. Dành cho Giáo viên:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Giáo án Word/PDF chi tiết, bài giảng điện tử PowerPoint</li>
                  <li>Dụng cụ & hóa chất thí nghiệm biểu diễn (nếu có)</li>
                  <li>Phiếu học tập giao nhiệm vụ theo nhóm</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">2. Dành cho Học sinh:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>SGK Hóa học {plan.gradeLevel}, vở ghi chép bài học</li>
                  <li>Chuẩn bị bài trước tại nhà theo hướng dẫn</li>
                  <li>Bút viết, bảng phụ ghi kết quả thảo luận nhóm</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section III: Tiến trình tổ chức hoạt động */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>III. Tiến trình dạy học & Hoạt động thực nghiệm</span>
            </h4>
            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line">
              {plan.activities ||
                '• Hoạt động 1 (Khởi động): Tạo tình huống có vấn đề khơi gợi hứng thú.\n• Hoạt động 2 (Hình thành kiến thức mới): Học sinh quan sát hiện tượng, đọc SGK, thảo luận nhóm và chốt kiến thức.\n• Hoạt động 3 (Luyện tập): Giải quyết câu hỏi trắc nghiệm nhanh và bài tập định lượng.\n• Hoạt động 4 (Vận dụng): Tìm hiểu ứng dụng trong đời sống sản xuất và môi trường.'}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="font-bold text-slate-700 uppercase">Duyệt của Tổ chuyên môn</p>
              <p className="text-[11px] text-slate-400 italic mt-0.5">(Ký và ghi rõ họ tên)</p>
              <div className="h-16" />
            </div>
            <div>
              <p className="font-bold text-slate-700 uppercase">Giáo viên biên soạn</p>
              <p className="text-[11px] text-slate-400 italic mt-0.5">Tây Ninh, ngày 20 tháng 09 năm 2026</p>
              <div className="h-16 flex items-end justify-center">
                <p className="font-bold text-slate-900 text-sm">Thầy Nguyễn Văn Út</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Hệ thống Quản trị Học tập – Môn Hóa học THPT
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
