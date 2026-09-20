import { ClassItem, StudentItem, AssignmentItem, TeachingPlanItem, DailyAttendanceRecord, NotificationItem } from '../types';

export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "11A1",
    name: "Lớp 11A1",
    gradeLevel: 11,
    academicTrack: "KHTN (Hóa - Sinh - Toán)",
    homeroomTeacher: "Thầy Nguyễn Văn Út",
    roomNumber: "Phòng 204",
    notes: "Lớp chọn định hướng khối B & D07, tiếp thu nhanh, nhiệt tình phát biểu thí nghiệm."
  },
  {
    id: "11A2",
    name: "Lớp 11A2",
    gradeLevel: 11,
    academicTrack: "KHTN (Lý - Hóa - Toán)",
    homeroomTeacher: "Cô Lê Thị Hồng",
    roomNumber: "Phòng 205",
    notes: "Lực học tương đối đồng đều, cần chú trọng rèn luyện kỹ năng giải bài tập định lượng."
  },
  {
    id: "11A3",
    name: "Lớp 11A3",
    gradeLevel: 11,
    academicTrack: "KHTN",
    homeroomTeacher: "Thầy Trần Văn Minh",
    roomNumber: "Phòng 206",
    notes: "Một số học sinh chưa nắm chắc phần cân bằng electron và tính toán dung dịch."
  },
  {
    id: "10A1",
    name: "Lớp 10A1",
    gradeLevel: 10,
    academicTrack: "KHTN (Chương trình GDPT mới)",
    homeroomTeacher: "Cô Phạm Thị Nga",
    roomNumber: "Phòng 102",
    notes: "Khối 10 bắt đầu làm quen với cấu tạo nguyên tử, liên kết hóa học và bảng tuần hoàn."
  }
];

const LAST_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương"];
const MIDDLE_NAMES_MALE = ["Văn", "Đức", "Minh", "Thành", "Quốc", "Hải", "Tuấn", "Hoàng", "Xuân"];
const MIDDLE_NAMES_FEMALE = ["Thị", "Ngọc", "Thu", "Mai", "Phương", "Khánh", "Thanh", "Mỹ", "Ánh"];
const FIRST_NAMES_MALE = ["An", "Bình", "Cường", "Dũng", "Đạt", "Hải", "Hiếu", "Huy", "Khoa", "Long", "Minh", "Nam", "Phúc", "Quân", "Sơn", "Tài", "Thắng", "Tùng", "Việt"];
const FIRST_NAMES_FEMALE = ["Anh", "Bích", "Châu", "Dung", "Giang", "Hà", "Hương", "Linh", "Mai", "Ngân", "Nhi", "Oanh", "Phương", "Quỳnh", "Thảo", "Trang", "Uyên", "Vy"];

// Deterministic seed for repeatable demo data
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateDemoStudents(): StudentItem[] {
  const students: StudentItem[] = [];
  const classSizes: { [key: string]: number } = {
    "11A1": 45,
    "11A2": 42,
    "11A3": 41,
    "10A1": 40
  };

  let globalIndex = 1;

  Object.entries(classSizes).forEach(([classId, count]) => {
    for (let i = 1; i <= count; i++) {
      const seed = globalIndex * 137;
      const isMale = pseudoRandom(seed) > 0.48;
      const gender = isMale ? 'Nam' : 'Nữ';
      const lastName = LAST_NAMES[Math.floor(pseudoRandom(seed + 1) * LAST_NAMES.length)];
      const middleName = isMale
        ? MIDDLE_NAMES_MALE[Math.floor(pseudoRandom(seed + 2) * MIDDLE_NAMES_MALE.length)]
        : MIDDLE_NAMES_FEMALE[Math.floor(pseudoRandom(seed + 2) * MIDDLE_NAMES_FEMALE.length)];
      const firstName = isMale
        ? FIRST_NAMES_MALE[Math.floor(pseudoRandom(seed + 3) * FIRST_NAMES_MALE.length)]
        : FIRST_NAMES_FEMALE[Math.floor(pseudoRandom(seed + 3) * FIRST_NAMES_FEMALE.length)];
      
      const fullName = `${lastName} ${middleName} ${firstName}`;
      const code = `2026-${classId}-${i < 10 ? '0' + i : i}`;
      const studentId = `STU${globalIndex < 100 ? (globalIndex < 10 ? '00' + globalIndex : '0' + globalIndex) : globalIndex}`;

      // Custom profiles for specific attention demo students (from Section 7: Nguyễn Văn A, Trần Thị B)
      let tx1: number;
      let tx2: number;
      let tx3: number;
      let thuchanh: number;
      let gk: number;
      let ck: number;
      let present = 30;
      let excused = 1;
      let unexcused = 0;
      let completedAsg = 7;
      let teacherNotes = "";
      let scoreHistory = [
        { period: "Đầu năm", score: 7.0 },
        { period: "Giữa kỳ I", score: 7.2 },
        { period: "Cuối kỳ I", score: 7.5 }
      ];

      if (classId === '11A1' && i === 1) {
        // Nguyễn Văn A from requirement: Điểm TB 4.8, Chuyên cần 82%, Bài tập 3/7, Cần hỗ trợ
        tx1 = 4.5;
        tx2 = 4.0;
        tx3 = 5.0;
        thuchanh = 5.5;
        gk = 4.5;
        ck = 5.0;
        present = 25;
        excused = 2;
        unexcused = 3;
        completedAsg = 3;
        teacherNotes = "Em còn yếu phần cân bằng electron và tính toán nồng độ mol. Thầy đã xếp lịch phụ đạo chiều thứ 5.";
        scoreHistory = [
          { period: "Đầu năm", score: 6.2 },
          { period: "Giữa kỳ I", score: 5.5 },
          { period: "Cuối kỳ I", score: 4.8 }
        ];
      } else if (classId === '11A1' && i === 2) {
        // Trần Thị B from requirement: Điểm TB 5.1, Chuyên cần 88%, Bài tập 4/8, Theo dõi
        tx1 = 5.0;
        tx2 = 5.5;
        tx3 = 4.5;
        thuchanh = 6.0;
        gk = 5.0;
        ck = 5.0;
        present = 27;
        excused = 3;
        unexcused = 1;
        completedAsg = 4;
        teacherNotes = "Chăm ngoan nhưng tiếp thu lý thuyết cân bằng hóa học còn chậm, hay quên hằng số Kc.";
        scoreHistory = [
          { period: "Đầu năm", score: 6.0 },
          { period: "Giữa kỳ I", score: 5.4 },
          { period: "Cuối kỳ I", score: 5.1 }
        ];
      } else if (classId === '11A2' && i === 3) {
        // Đặng Quốc Huy - Cần hỗ trợ
        tx1 = 4.0;
        tx2 = 4.5;
        tx3 = 4.0;
        thuchanh = 5.0;
        gk = 4.5;
        ck = 4.5;
        present = 24;
        excused = 2;
        unexcused = 4;
        completedAsg = 2;
        teacherNotes = "Nghỉ học nhiều buổi không phép. Cần phối hợp với phụ huynh và GVCN.";
        scoreHistory = [
          { period: "Đầu năm", score: 5.5 },
          { period: "Giữa kỳ I", score: 4.8 },
          { period: "Cuối kỳ I", score: 4.3 }
        ];
      } else {
        // General realistic distribution for a strong high school class
        // Overall target average around 7.4, attendance ~96.8%
        const ability = pseudoRandom(seed + 10);
        let baseScore = 6.5;
        if (ability > 0.8) baseScore = 8.5;
        else if (ability > 0.4) baseScore = 7.5;
        else if (ability > 0.1) baseScore = 6.8;
        else baseScore = 5.2;

        const jitter = () => Math.round((pseudoRandom(seed + Math.random() * 50) * 1.6 - 0.8) * 10) / 10;
        const clamp = (val: number) => Math.min(10, Math.max(3.5, Math.round(val * 10) / 10));

        tx1 = clamp(baseScore + jitter());
        tx2 = clamp(baseScore + jitter());
        tx3 = clamp(baseScore + jitter());
        thuchanh = clamp(baseScore + 0.5 + jitter());
        gk = clamp(baseScore + jitter());
        ck = clamp(baseScore + jitter());

        // Attendance
        const attRand = pseudoRandom(seed + 20);
        if (attRand > 0.95) {
          present = 28;
          excused = 2;
          unexcused = 1;
        } else if (attRand > 0.85) {
          present = 29;
          excused = 2;
          unexcused = 0;
        } else {
          present = 30;
          excused = 1;
          unexcused = 0;
        }

        // Assignments (out of 8)
        completedAsg = ability > 0.3 ? 8 : (ability > 0.1 ? 7 : 5);

        const s1 = clamp(baseScore - 0.4);
        const s2 = clamp(baseScore);
        const s3 = clamp((tx1 + tx2 + tx3 + thuchanh + gk * 2 + ck * 3) / 9);

        scoreHistory = [
          { period: "Đầu năm", score: s1 },
          { period: "Giữa kỳ I", score: s2 },
          { period: "Cuối kỳ I", score: s3 }
        ];

        if (ability > 0.8) {
          teacherNotes = "Có năng khiếu Hóa học đặc biệt, tham gia đội tuyển học sinh giỏi môn Hóa.";
        } else if (s3 >= 8.0) {
          teacherNotes = "Tiếp thu bài nhanh, làm bài tập đầy đủ và chuẩn bị bài trước ở nhà rất tốt.";
        }
      }

      students.push({
        id: studentId,
        code,
        name: (classId === '11A1' && i === 1) ? "Nguyễn Văn A" : (classId === '11A1' && i === 2) ? "Trần Thị B" : fullName,
        classId,
        gender,
        dob: `2009-0${Math.floor(pseudoRandom(seed + 4) * 9) + 1}-${Math.floor(pseudoRandom(seed + 5) * 20) + 10}`,
        phone: `09${Math.floor(pseudoRandom(seed + 6) * 89999999 + 10000000)}`,
        status: 'Đang học',
        grades: {
          semester1: {
            tx1,
            tx2,
            tx3,
            thuchanh,
            gk,
            ck
          }
        },
        attendanceSummary: {
          present,
          excused,
          unexcused,
          total: present + excused + unexcused
        },
        assignmentSummary: {
          completed: completedAsg,
          total: 8
        },
        scoreHistory,
        teacherNotes,
        lastUpdated: "2026-09-18"
      });

      globalIndex++;
    }
  });

  return students;
}

export const INITIAL_STUDENTS: StudentItem[] = generateDemoStudents();

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: "ASG-01",
    title: "Cân bằng phương trình oxi hóa – khử bằng phương pháp thăng bằng electron",
    topic: "Phản ứng Oxi hóa - Khử",
    classIds: ["11A1", "11A2", "11A3"],
    assignedDate: "2026-09-05",
    dueDate: "2026-09-12",
    description: "Cân bằng 15 phương trình oxi hóa khử phức tạp có môi trường axit nitric HNO3 và H2SO4 đặc nóng.",
    maxScore: 10,
    status: "closed",
    completedStudentIds: INITIAL_STUDENTS.slice(0, 118).map(s => s.id),
    attachment: {
      name: "Phieu_On_Tap_Phan_Ung_Oxi_Hoa_Khu_11.docx",
      size: 204800,
      type: "docx",
      uploadedAt: "2026-09-05",
      extractedSummary: "Phiếu học tập 20 phương trình oxi hóa khử nâng cao."
    }
  },
  {
    id: "ASG-02",
    title: "Tính hằng số cân bằng hóa học Kc và dự đoán chuyển dịch cân bằng",
    topic: "Cân bằng hóa học",
    classIds: ["11A1", "11A2"],
    assignedDate: "2026-09-12",
    dueDate: "2026-09-20",
    description: "Áp dụng định luật tác dụng khối lượng và nguyên lý Le Chatelier cho phản ứng tổng hợp NH3 và SO3.",
    maxScore: 10,
    status: "active",
    completedStudentIds: INITIAL_STUDENTS.slice(0, 75).map(s => s.id),
    attachment: {
      name: "De_Kiem_Tra_Can_Bang_Hoa_Hoc_11.docx",
      size: 148520,
      type: "docx",
      uploadedAt: "2026-09-12",
      extractedSummary: "Đề kiểm tra 15 phút: Hằng số cân bằng Kc và nguyên lý chuyển dịch cân bằng."
    }
  },
  {
    id: "ASG-03",
    title: "Xác định pH của dung dịch axit, bazơ và dung dịch muối",
    topic: "Cân bằng trong dung dịch nước",
    classIds: ["11A1", "11A2", "11A3"],
    assignedDate: "2026-09-15",
    dueDate: "2026-09-24",
    description: "Tính nồng độ ion H+, OH- và độ pH của hỗn hợp dung dịch; phân loại môi trường axit, kiềm hay trung tính.",
    maxScore: 10,
    status: "active",
    completedStudentIds: INITIAL_STUDENTS.slice(0, 92).map(s => s.id),
    attachment: {
      name: "Chuyen_De_Can_Bang_Dung_Dich_Nuoc_pH.pdf",
      size: 324100,
      type: "pdf",
      uploadedAt: "2026-09-15",
      extractedSummary: "Tài liệu & Bài tập chuyên đề Cân bằng dung dịch nước và độ pH."
    }
  },
  {
    id: "ASG-04",
    title: "Báo cáo thực hành: Đo pH mẫu nước thải sinh hoạt và nước mưa",
    topic: "Thực hành Hóa học",
    classIds: ["11A1"],
    assignedDate: "2026-09-18",
    dueDate: "2026-09-26",
    description: "Nhóm 4 học sinh sử dụng giấy chỉ thị vạn năng và máy đo pH cầm tay để đo pH của 5 mẫu nước tại địa phương.",
    maxScore: 10,
    status: "upcoming",
    completedStudentIds: []
  },
  {
    id: "ASG-05",
    title: "Cấu tạo nguyên tử và bảng tuần hoàn các nguyên tố hóa học",
    topic: "Cấu tạo nguyên tử (Lớp 10)",
    classIds: ["10A1"],
    assignedDate: "2026-09-10",
    dueDate: "2026-09-22",
    description: "Viết cấu hình electron của 20 nguyên tố đầu bảng tuần hoàn, xác định vị trí chu kỳ, nhóm và tính kim loại/phi kim.",
    maxScore: 10,
    status: "active",
    completedStudentIds: INITIAL_STUDENTS.filter(s => s.classId === '10A1').slice(0, 32).map(s => s.id)
  }
];

export const INITIAL_TEACHING_PLAN: TeachingPlanItem[] = [
  {
    id: "TP-01",
    week: 1,
    period: 1,
    topic: "Cân bằng hóa học",
    lessonContent: "Khái niệm phản ứng một chiều, phản ứng thuận nghịch và trạng thái cân bằng",
    objectives: "Học sinh nêu được khái niệm phản ứng thuận nghịch, đặc điểm của trạng thái cân bằng động.",
    activities: "Xem video thí nghiệm N2O4 <-> 2NO2 biến đổi màu sắc theo nhiệt độ. Thảo luận nhóm.",
    status: "Hoàn thành",
    gradeLevel: 11,
    attachment: {
      name: "Giao_An_Bai_1_Can_Bang_Hoa_Hoc_11_CV5512.docx",
      size: 285400,
      type: "docx",
      uploadedAt: "2026-09-02",
      extractedSummary: "Giáo án Hóa học 11 chuẩn Công văn 5512: Khái niệm phản ứng thuận nghịch, cân bằng động và phiếu học tập."
    }
  },
  {
    id: "TP-02",
    week: 1,
    period: 2,
    topic: "Cân bằng hóa học",
    lessonContent: "Hằng số cân bằng Kc và các yếu tố ảnh hưởng đến chuyển dịch cân bằng",
    objectives: "Viết được biểu thức tính Kc. Phát biểu nguyên lý Le Chatelier (nhiệt độ, nồng độ, áp suất).",
    activities: "Phân tích bảng số liệu thực nghiệm, tính toán Kc trong phản ứng H2 + I2 <-> 2HI.",
    status: "Hoàn thành",
    gradeLevel: 11,
    attachment: {
      name: "Ke_Hoach_Bai_Day_Hang_So_Kc_Nguyen_Ly_Le_Chatelier.docx",
      size: 312000,
      type: "docx",
      uploadedAt: "2026-09-08",
      extractedSummary: "Kế hoạch bài dạy: Hằng số cân bằng Kc, nguyên lý Le Chatelier và bài tập vận dụng."
    }
  },
  {
    id: "TP-03",
    week: 2,
    period: 3,
    topic: "Cân bằng hóa học",
    lessonContent: "Luyện tập bài toán hằng số cân bằng và hiệu suất phản ứng",
    objectives: "Vận dụng công thức tính nồng độ cân bằng, hằng số Kc và độ chuyển hóa.",
    activities: "Giải bài tập trắc nghiệm và tự luận trên bảng tương tác. Sửa lỗi sai thường gặp.",
    status: "Đang thực hiện",
    gradeLevel: 11
  },
  {
    id: "TP-04",
    week: 2,
    period: 4,
    topic: "Cân bằng trong dung dịch nước",
    lessonContent: "Sự điện li, chất điện li mạnh, chất điện li yếu và thuyết Bronsted - Lowry",
    objectives: "Phân biệt chất điện li mạnh và yếu. Khái niệm axit/bazơ theo thuyết trao đổi proton.",
    activities: "Thí nghiệm kiểm tra độ dẫn điện của dung dịch NaCl, axit axetic CH3COOH và đường saccarozơ.",
    status: "Đang thực hiện",
    gradeLevel: 11,
    attachment: {
      name: "Giao_An_Chuyen_De_Can_Bang_Dung_Dich_Nuoc_pH.pdf",
      size: 428900,
      type: "pdf",
      uploadedAt: "2026-09-15",
      extractedSummary: "Giáo án chuyên đề: Cân bằng trong dung dịch nước, thuyết Axit - Bazơ Bronsted - Lowry và thang pH."
    }
  },
  {
    id: "TP-05",
    week: 3,
    period: 5,
    topic: "Cân bằng trong dung dịch nước",
    lessonContent: "Khái niệm pH và ý nghĩa của pH trong thực tiễn đời sống",
    objectives: "Biết công thức tính pH = -log[H+]. Đánh giá ý nghĩa pH trong nông nghiệp, y học, môi trường.",
    activities: "Sử dụng thang màu chỉ thị pH thử mẫu nước chanh, xà phòng, nước ngọt, giấm ăn.",
    status: "Chưa thực hiện",
    gradeLevel: 11
  },
  {
    id: "TP-06",
    week: 3,
    period: 6,
    topic: "Thực hành Hóa học",
    lessonContent: "Thực hành chuẩn độ axit – bazơ sử dụng chỉ thị phenolphtalein",
    objectives: "Rèn luyện thao tác dùng buret, pipet chuẩn độ dung dịch HCl bằng dung dịch chuẩn NaOH.",
    activities: "Học sinh thực hành theo nhóm 4 em tại phòng thí nghiệm Hóa học số 1.",
    status: "Chưa thực hiện",
    gradeLevel: 11
  },
  {
    id: "TP-07",
    week: 4,
    period: 7,
    topic: "Nitơ và Hợp chất",
    lessonContent: "Đơn chất Nitơ - Tính trơ ở nhiệt độ thường và tính oxi hóa/khử ở nhiệt độ cao",
    objectives: "Giải thích độ bền liên kết 3 trong phân tử N2, ứng dụng bảo quản thực phẩm và tổng hợp amoniac.",
    activities: "Trình bày sơ đồ tư duy ứng dụng của Nitơ lỏng và khí Nitơ trong công nghiệp.",
    status: "Chưa thực hiện",
    gradeLevel: 11
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-01",
    type: "warning",
    title: "Học sinh cần chú ý",
    message: "Hệ thống phát hiện 3 học sinh (11A1, 11A2) có dấu hiệu điểm giảm và chuyên cần dưới 85%.",
    time: "Hôm nay, 08:30",
    read: false,
    linkToPage: "attention"
  },
  {
    id: "NOTIF-02",
    type: "info",
    title: "Bài tập sắp đến hạn",
    message: "Bài tập 'Tính hằng số cân bằng Kc' lớp 11A1, 11A2 sẽ hết hạn nộp vào ngày 20/09.",
    time: "Hôm nay, 07:15",
    read: false,
    linkToPage: "assignments"
  },
  {
    id: "NOTIF-03",
    type: "warning",
    title: "Chuyên cần hôm nay",
    message: "Lớp 11A1 chưa lưu điểm danh tiết 2 sáng nay.",
    time: "Hôm qua, 16:45",
    read: false,
    linkToPage: "attendance",
    linkParam: "11A1"
  },
  {
    id: "NOTIF-04",
    type: "success",
    title: "Cập nhật kế hoạch",
    message: "Tiết 1, Tiết 2 tuần 1 môn Hóa 11 đã hoàn thành đúng tiến độ chương trình.",
    time: "3 ngày trước",
    read: true,
    linkToPage: "teachingPlan"
  }
];
