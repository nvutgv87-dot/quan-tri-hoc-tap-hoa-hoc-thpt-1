import { StudentItem } from '../types';
import { calculateSemesterGPA, getPerformanceRank, calculateAttendanceRate } from './calculations';

export function downloadCSV(filename: string, csvContent: string): void {
  // UTF-8 BOM prefix ensures Vietnamese accents render perfectly in Excel
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportStudentsToCSV(students: StudentItem[]): void {
  const headers = [
    "STT",
    "Mã học sinh",
    "Họ và tên",
    "Lớp",
    "Giới tính",
    "Ngày sinh",
    "Số điện thoại",
    "Điểm TX1",
    "Điểm TX2",
    "Điểm TX3",
    "Điểm Thực hành",
    "Điểm Giữa kỳ",
    "Điểm Cuối kỳ",
    "Điểm TB Hóa",
    "Xếp loại",
    "Chuyên cần (%)",
    "Bài tập hoàn thành",
    "Ghi chú giáo viên"
  ];

  const rows = students.map((s, index) => {
    const gpa = calculateSemesterGPA(s.grades.semester1);
    const rank = getPerformanceRank(gpa, s.grades.semester1);
    const attRate = calculateAttendanceRate(s.attendanceSummary.present, s.attendanceSummary.total);
    const asgRate = `${s.assignmentSummary.completed}/${s.assignmentSummary.total}`;

    return [
      index + 1,
      `"${s.code}"`,
      `"${s.name}"`,
      `"${s.classId}"`,
      `"${s.gender}"`,
      `"${s.dob || ''}"`,
      `"${s.phone || ''}"`,
      s.grades.semester1?.tx1 ?? "",
      s.grades.semester1?.tx2 ?? "",
      s.grades.semester1?.tx3 ?? "",
      s.grades.semester1?.thuchanh ?? "",
      s.grades.semester1?.gk ?? "",
      s.grades.semester1?.ck ?? "",
      gpa > 0 ? gpa.toFixed(1) : "",
      `"${rank}"`,
      `${attRate}%`,
      `"${asgRate}"`,
      `"${(s.teacherNotes || '').replace(/"/g, '""')}"`
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  downloadCSV(`danh_sach_hoc_sinh_hoa_hoc_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

export function parseCSVToStudents(csvText: string, defaultClassId: string = '11A1'): Partial<StudentItem>[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const results: Partial<StudentItem>[] = [];
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length >= 2) {
      const name = cols[1] || cols[0];
      const classId = cols[2] || defaultClassId;
      const gender = (cols[3] === 'Nữ' || cols[3] === 'Nu') ? 'Nữ' : 'Nam';
      results.push({
        name,
        classId,
        gender,
        code: `2026-${classId}-${Math.floor(Math.random() * 89 + 10)}`,
        status: 'Đang học',
        grades: {
          semester1: {
            tx1: parseFloat(cols[4]) || 7.0,
            tx2: parseFloat(cols[5]) || 7.5,
            tx3: parseFloat(cols[6]) || 7.0,
            thuchanh: 8.0,
            gk: parseFloat(cols[7]) || 7.0,
            ck: parseFloat(cols[8]) || 7.5
          }
        },
        attendanceSummary: {
          present: 30,
          excused: 1,
          unexcused: 0,
          total: 31
        },
        assignmentSummary: {
          completed: 7,
          total: 8
        },
        scoreHistory: [
          { period: "Đầu năm", score: 7.0 },
          { period: "Giữa kỳ I", score: 7.2 },
          { period: "Cuối kỳ I", score: 7.4 }
        ],
        teacherNotes: cols[9] || "Nhập từ file CSV"
      });
    }
  }
  return results;
}

export function exportGradesToCSV(students: StudentItem[], classId: string): void {
  const headers = [
    "STT",
    "Mã học sinh",
    "Họ và tên",
    "Lớp",
    "TX 1 (hs 1)",
    "TX 2 (hs 1)",
    "TX 3 (hs 1)",
    "Thực hành (hs 1)",
    "Giữa kỳ (hs 2)",
    "Cuối kỳ (hs 3)",
    "Điểm TB Hóa",
    "Xếp loại"
  ];

  const rows = students.map((s, index) => {
    const gpa = calculateSemesterGPA(s.grades.semester1);
    const rank = getPerformanceRank(gpa, s.grades.semester1);

    return [
      index + 1,
      `"${s.code}"`,
      `"${s.name}"`,
      `"${s.classId}"`,
      s.grades.semester1?.tx1 ?? "",
      s.grades.semester1?.tx2 ?? "",
      s.grades.semester1?.tx3 ?? "",
      s.grades.semester1?.thuchanh ?? "",
      s.grades.semester1?.gk ?? "",
      s.grades.semester1?.ck ?? "",
      gpa > 0 ? gpa.toFixed(1) : "",
      `"${rank}"`
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  downloadCSV(`bang_diem_hoa_hoc_${classId}_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
