import { AssignmentAttachment } from '../types';

/**
 * Format bytes to human readable string (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Extract normalized file extension
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  return parts.pop()?.toLowerCase() || '';
}

/**
 * Determine file category: 'docx' | 'doc' | 'pdf'
 */
export function getFileCategory(filename: string, mimeType = ''): 'docx' | 'doc' | 'pdf' | 'other' {
  const ext = getFileExtension(filename);
  if (ext === 'docx') return 'docx';
  if (ext === 'doc') return 'doc';
  if (ext === 'pdf' || mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('wordprocessingml') || mimeType.includes('officedocument')) return 'docx';
  if (mimeType.includes('msword')) return 'doc';
  return 'other';
}

/**
 * Check if the file is supported Word or PDF
 */
export function isSupportedAssignmentFile(file: File): boolean {
  const ext = getFileExtension(file.name);
  const validExts = ['docx', 'doc', 'pdf'];
  if (validExts.includes(ext)) return true;
  if (
    file.type.includes('pdf') ||
    file.type.includes('msword') ||
    file.type.includes('wordprocessingml')
  ) {
    return true;
  }
  return false;
}

/**
 * Read browser File into an AssignmentAttachment object with base64 dataUrl
 */
export function readUploadedFile(file: File): Promise<AssignmentAttachment> {
  return new Promise((resolve, reject) => {
    if (!isSupportedAssignmentFile(file)) {
      reject(new Error('Chỉ hỗ trợ tệp định dạng Word (.docx, .doc) hoặc PDF (.pdf).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const category = getFileCategory(file.name, file.type);
      
      resolve({
        name: file.name,
        size: file.size,
        type: category,
        dataUrl,
        uploadedAt: new Date().toISOString().slice(0, 10),
        extractedSummary: `Đề bài môn Hóa học THPT • Dung lượng: ${formatFileSize(file.size)}`
      });
    };

    reader.onerror = () => {
      reject(new Error('Đã xảy ra lỗi khi đọc tệp tin. Vui lòng thử lại.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Trigger client-side browser download of the attached file
 */
export function downloadAttachment(attachment: AssignmentAttachment): void {
  if (!attachment) return;

  // If we have a dataUrl, trigger standard anchor download
  if (attachment.dataUrl) {
    const link = document.createElement('a');
    link.href = attachment.dataUrl;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // If no real dataUrl (e.g. from generated seed), create a mock binary/text blob
    const sampleContent = `TRƯỜNG THPT DƯƠNG MINH CHÂU\nTỔ BỘ MÔN HÓA HỌC\nGiáo viên phụ trách: Nguyễn Văn Út\n\nTÊN ĐỀ BÀI: ${attachment.name.replace(/\.[^/.]+$/, '')}\nThời gian: 45 phút\n\nI. PHẦN TRẮC NGHIỆM (7,0 điểm)\nCâu 1: Phản ứng thuận nghịch là phản ứng:\nA. Xảy ra theo một chiều xác định.\nB. Trong cùng điều kiện, phản ứng xảy ra đồng thời theo hai chiều trái ngược nhau.\nC. Chỉ xảy ra ở nhiệt độ cao.\nD. Có hiệu suất luôn đạt 100%.\n\nCâu 2: Hằng số cân bằng Kc của phản ứng phụ thuộc vào yếu tố nào sau đây?\nA. Nồng độ chất phản ứng.\nB. Áp suất chung.\nC. Nhiệt độ.\nD. Chất xúc tác.\n\nII. PHẦN TỰ LUẬN (3,0 điểm)\nCho phản ứng sau trong bình kín: N2(k) + 3H2(k) <=> 2NH3(k); Delta H < 0.\nNêu các biện pháp để làm chuyển dịch cân bằng theo chiều thuận tăng hiệu suất tạo thành khí amoniac.\n\n--- HẾT ---`;
    
    let mime = 'application/octet-stream';
    if (attachment.type === 'pdf') mime = 'application/pdf';
    else if (attachment.type === 'docx') mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (attachment.type === 'doc') mime = 'application/msword';

    const blob = new Blob([sampleContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Pre-defined sample chemical assignment documents ready to attach with 1-click
 */
export const SAMPLE_ATTACHMENTS: AssignmentAttachment[] = [
  {
    name: 'De_Kiem_Tra_Can_Bang_Hoa_Hoc_11.docx',
    size: 148520, // ~145 KB
    type: 'docx',
    uploadedAt: '2026-09-15',
    extractedSummary: 'Đề kiểm tra 15 phút: Hằng số cân bằng Kc và nguyên lý chuyển dịch cân bằng Le Chatelier (Gồm 10 câu trắc nghiệm + 2 bài tự luận tính nồng độ).'
  },
  {
    name: 'Chuyen_De_Can_Bang_Dung_Dich_Nuoc_pH.pdf',
    size: 324100, // ~316 KB
    type: 'pdf',
    uploadedAt: '2026-09-18',
    extractedSummary: 'Tài liệu & Phiếu bài tập: Thuyết Bronsted - Lowry, tính pH dung dịch axit mạnh, bazơ mạnh và hỗn hợp đệm.'
  },
  {
    name: 'Phieu_On_Tap_Phan_Ung_Oxi_Hoa_Khu_11.docx',
    size: 204800, // ~200 KB
    type: 'docx',
    uploadedAt: '2026-09-10',
    extractedSummary: 'Phiếu học tập: 20 phương trình oxi hóa - khử nâng cao có môi trường axit nitric và axit sunfuric đặc nóng.'
  }
];
