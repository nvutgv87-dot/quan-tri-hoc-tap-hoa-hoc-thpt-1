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
export function downloadAttachment(
  attachment: AssignmentAttachment,
  category: 'assignment' | 'lesson_plan' = 'assignment'
): void {
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
    let sampleContent = '';
    if (category === 'lesson_plan' || attachment.name.toLowerCase().includes('giao_an') || attachment.name.toLowerCase().includes('ke_hoach')) {
      sampleContent = `SỞ GIÁO DỤC VÀ ĐÀO TẠO TÂY NINH
TRƯỜNG THPT DƯƠNG MINH CHÂU
TỔ BỘ MÔN: HÓA HỌC
Giáo viên giảng dạy: Nguyễn Văn Út

KẾ HOẠCH BÀI DẠY (THEO CÔNG VĂN 5512/BGDĐT-GDTrH)
MÔN: HÓA HỌC THPT
TÊN BÀI: ${attachment.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
Thời lượng: 02 tiết

I. MỤC TIÊU
1. Năng lực hóa học:
   - Nhận thức hóa học: Trình bày được khái niệm, phương trình hóa học và bản chất biến đổi.
   - Tìm hiểu thế giới tự nhiên dưới góc độ hóa học: Quan sát hiện tượng thí nghiệm, rút ra kết luận.
   - Vận dụng kiến thức, kĩ năng đã học: Giải thích các hiện tượng thực tế và giải quyết bài tập liên hệ.
2. Năng lực chung: Tự chủ và tự học, giao tiếp và hợp tác nhóm, giải quyết vấn đề sáng tạo.
3. Phẩm chất: Trung thực, trách nhiệm và chăm chỉ trong học tập bộ môn Hóa học.

II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
1. Giáo viên: Giáo án, phiếu học tập số 1, 2, 3; dụng cụ thí nghiệm, hóa chất thí nghiệm và bài trình chiếu PowerPoint.
2. Học sinh: Sách giáo khoa Hóa học 11, vở ghi chép, bảng nhóm và bút dạ.

III. TIẾN TRÌNH DẠY HỌC
- Hoạt động 1: Xác định vấn đề/nhiệm vụ học tập (Khởi động - 7 phút)
- Hoạt động 2: Hình thành kiến thức mới (25 phút)
- Hoạt động 3: Luyện tập và củng cố (8 phút)
- Hoạt động 4: Vận dụng và mở rộng (5 phút)

IV. HỒ SƠ DẠY HỌC (CÁC PHIẾU HỌC TẬP & BÀI TẬP VẬN DỤNG)
[Đính kèm phiếu học tập chi tiết và ma trận câu hỏi kiểm tra đánh giá định kỳ]

Ký duyệt của Tổ chuyên môn                 Giáo viên biên soạn
                                           Nguyễn Văn Út`;
    } else {
      sampleContent = `TRƯỜNG THPT DƯƠNG MINH CHÂU\nTỔ BỘ MÔN HÓA HỌC\nGiáo viên phụ trách: Nguyễn Văn Út\n\nTÊN ĐỀ BÀI: ${attachment.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}\nThời gian: 45 phút\n\nI. PHẦN TRẮC NGHIỆM (7,0 điểm)\nCâu 1: Phản ứng thuận nghịch là phản ứng:\nA. Xảy ra theo một chiều xác định.\nB. Trong cùng điều kiện, phản ứng xảy ra đồng thời theo hai chiều trái ngược nhau.\nC. Chỉ xảy ra ở nhiệt độ cao.\nD. Có hiệu suất luôn đạt 100%.\n\nCâu 2: Hằng số cân bằng Kc của phản ứng phụ thuộc vào yếu tố nào sau đây?\nA. Nồng độ chất phản ứng.\nB. Áp suất chung.\nC. Nhiệt độ.\nD. Chất xúc tác.\n\nII. PHẦN TỰ LUẬN (3,0 điểm)\nCho phản ứng sau trong bình kín: N2(k) + 3H2(k) <=> 2NH3(k); Delta H < 0.\nNêu các biện pháp để làm chuyển dịch cân bằng theo chiều thuận tăng hiệu suất tạo thành khí amoniac.\n\n--- HẾT ---`;
    }
    
    let mime = 'text/plain;charset=utf-8';
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

/**
 * Pre-defined sample chemical teaching plan documents (Giáo án / Kế hoạch bài dạy theo CV 5512)
 */
export const SAMPLE_TEACHING_PLAN_ATTACHMENTS: AssignmentAttachment[] = [
  {
    name: 'Giao_An_Bai_1_Can_Bang_Hoa_Hoc_11_CV5512.docx',
    size: 285400, // ~278 KB
    type: 'docx',
    uploadedAt: '2026-09-02',
    extractedSummary: 'Giáo án Hóa học 11 chuẩn Công văn 5512: Khái niệm phản ứng một chiều, phản ứng thuận nghịch, trạng thái cân bằng động và phiếu học tập số 1.'
  },
  {
    name: 'Ke_Hoach_Bai_Day_Hang_So_Kc_Nguyen_Ly_Le_Chatelier.docx',
    size: 312000, // ~304 KB
    type: 'docx',
    uploadedAt: '2026-09-08',
    extractedSummary: 'Kế hoạch bài dạy: Hằng số cân bằng Kc, các yếu tố ảnh hưởng đến chuyển dịch cân bằng (nhiệt độ, nồng độ, áp suất) và bài tập vận dụng.'
  },
  {
    name: 'Giao_An_Chuyen_De_Can_Bang_Dung_Dich_Nuoc_pH.pdf',
    size: 428900, // ~418 KB
    type: 'pdf',
    uploadedAt: '2026-09-15',
    extractedSummary: 'Giáo án chuyên đề: Cân bằng trong dung dịch nước, thuyết Axit - Bazơ của Bronsted - Lowry, thang pH và chuẩn độ dung dịch.'
  },
  {
    name: 'Ke_Hoach_Tiet_Thuc_Hanh_Hoa_Hoc_11.docx',
    size: 198200, // ~193 KB
    type: 'docx',
    uploadedAt: '2026-09-20',
    extractedSummary: 'Kế hoạch tổ chức tiết thực hành: Thí nghiệm chuyển dịch cân bằng NO2/N2O4, đo pH một số dung dịch quen thuộc trong đời sống.'
  }
];
