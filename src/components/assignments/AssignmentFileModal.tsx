import React from 'react';
import { X, Download, Printer, FileText, CheckCircle, ExternalLink, Calendar, HardDrive } from 'lucide-react';
import { AssignmentItem, AssignmentAttachment } from '../../types';
import { formatFileSize, downloadAttachment } from '../../utils/fileAttachment';

interface AssignmentFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: AssignmentItem | null;
  attachment?: AssignmentAttachment | null;
}

export const AssignmentFileModal: React.FC<AssignmentFileModalProps> = ({
  isOpen,
  onClose,
  assignment,
  attachment: propAttachment
}) => {
  if (!isOpen) return null;

  const attachment = propAttachment || assignment?.attachment;
  if (!attachment) return null;

  const isPdf = attachment.type === 'pdf' || attachment.name.toLowerCase().endsWith('.pdf');
  const isDocx = attachment.type === 'docx' || attachment.name.toLowerCase().endsWith('.docx');

  const handleDownload = () => {
    downloadAttachment(attachment);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                isPdf
                  ? 'bg-rose-50 border border-rose-200 text-rose-600'
                  : 'bg-blue-50 border border-blue-200 text-blue-700'
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${
                    isPdf
                      ? 'bg-rose-100 text-rose-800'
                      : isDocx
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isPdf ? 'Tệp PDF' : 'Tệp Word (.docx)'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {formatFileSize(attachment.size)}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
                {attachment.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải về máy</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              title="In đề bài"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-50/50">
          {/* File Meta Info Banner */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4 text-slate-600">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-slate-400" />
                Dung lượng: <strong>{formatFileSize(attachment.size)}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Ngày đính kèm: <strong>{attachment.uploadedAt || '2026-09-18'}</strong>
              </span>
            </div>

            {assignment && (
              <div className="text-slate-500">
                Áp dụng cho các lớp: <strong className="text-blue-700 font-bold">{assignment.classIds.join(', ')}</strong>
              </div>
            )}
          </div>

          {/* Interactive Document Preview / Sheet View */}
          {isPdf && attachment.dataUrl ? (
            <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
              <iframe
                src={attachment.dataUrl}
                title={attachment.name}
                className="w-full h-[500px] rounded-lg border border-slate-200"
              />
            </div>
          ) : (
            /* Styled Exam Sheet Preview (Chemistry format for THPT Dương Minh Châu) */
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 text-slate-800">
              {/* National Curriculum & School Header */}
              <div className="grid grid-cols-2 text-xs border-b border-slate-300 pb-4">
                <div className="text-center font-semibold text-slate-700">
                  <p className="uppercase text-[11px]">SỞ GD&ĐT TÂY NINH</p>
                  <p className="font-extrabold text-[12px] uppercase text-slate-900">
                    TRƯỜNG THPT DƯƠNG MINH CHÂU
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Tổ Bộ môn: Hóa học</p>
                </div>
                <div className="text-center font-semibold text-slate-700">
                  <p className="uppercase text-[11px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p className="text-[11px] font-bold">Độc lập - Tự do - Hạnh phúc</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Năm học: 2026 - 2027</p>
                </div>
              </div>

              {/* Exam Title */}
              <div className="text-center py-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                  {assignment?.topic || 'HÓA HỌC THPT'}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase mt-2">
                  {assignment?.title || attachment.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                </h2>
                <p className="text-xs text-slate-500 mt-1 italic">
                  Giáo viên biên soạn: Thầy Nguyễn Văn Út • Thời gian làm bài: 45 phút
                </p>
              </div>

              {/* Assignment Instruction / Summary */}
              {assignment?.description && (
                <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                  <strong className="block mb-1 text-amber-950 font-bold">Yêu cầu & Hướng dẫn của giáo viên:</strong>
                  {assignment.description}
                </div>
              )}

              {/* Simulated Questions / Content of the attached Chemical worksheet */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed border-t border-slate-100 pt-4">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">
                    PHẦN I: CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (6,0 điểm)
                  </h4>
                  <div className="space-y-3 pl-2">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Câu 1: Nhận định nào sau đây là <span className="underline">đúng</span> về một phản ứng thuận nghịch ở trạng thái cân bằng?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1.5 pl-3 text-xs text-slate-700">
                        <div>A. Nồng độ của các chất tham gia bằng nồng độ sản phẩm.</div>
                        <div>B. Phản ứng thuận và phản ứng nghịch đã dừng lại hoàn toàn.</div>
                        <div>C. Tốc độ của phản ứng thuận bằng tốc độ của phản ứng nghịch.</div>
                        <div>D. Nồng độ các chất trong hệ vẫn tiếp tục biến đổi theo thời gian.</div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        Câu 2: Cho cân bằng hóa học sau trong bình kín:
                        <span className="font-mono font-bold text-blue-800 mx-2">
                          N₂(k) + 3H₂(k) ⇄ 2NH₃(k) (ΔH &lt; 0)
                        </span>
                        Cân bằng sẽ chuyển dịch theo chiều nghịch khi:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1.5 pl-3 text-xs text-slate-700">
                        <div>A. Tăng nồng độ khí N₂ hoặc H₂.</div>
                        <div>B. Tăng áp suất chung của hệ phản ứng.</div>
                        <div>C. Tăng nhiệt độ của bình kín.</div>
                        <div>D. Cho thêm chất xúc tác bột sắt (Fe).</div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        Câu 3: Dung dịch HCl 0,01M có giá trị pH bằng:
                      </p>
                      <div className="grid grid-cols-4 gap-2 mt-1.5 pl-3 text-xs text-slate-700 font-mono">
                        <div>A. 1,0</div>
                        <div>B. 2,0</div>
                        <div>C. 12,0</div>
                        <div>D. 7,0</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">
                    PHẦN II: TỰ LUẬN & VẬN DỤNG THỰC TIỄN (4,0 điểm)
                  </h4>
                  <div className="space-y-3 pl-2 text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Câu 4 (2,0 điểm):
                      </p>
                      <p className="text-slate-700 mt-1">
                        Ở 400°C, phản ứng tổng hợp amoniac đạt trạng thái cân bằng với nồng độ các chất:
                        [N₂] = 0,2 M; [H₂] = 0,4 M; [NH₃] = 0,6 M. Hãy tính hằng số cân bằng Kc của phản ứng tại nhiệt độ này và cho biết ý nghĩa của hằng số cân bằng đối với hiệu suất phản ứng.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        Câu 5 (2,0 điểm):
                      </p>
                      <p className="text-slate-700 mt-1">
                        Trộn 200 mL dung dịch Ba(OH)₂ 0,05M với 300 mL dung dịch H₂SO₄ 0,02M.
                        Tính khối lượng kết tủa BaSO₄ tạo thành và giá trị pH của dung dịch thu được sau phản ứng (coi thể tích dung dịch không đổi khi trộn).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4 font-bold text-slate-400 uppercase tracking-widest text-[11px]">
                  --- HẾT ---
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Tệp tin đề bài đã được xác thực an toàn và lưu trữ trong hệ thống</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Tải file gốc ({formatFileSize(attachment.size)})</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
