import { GradeItem, StudentItem, AttentionTier, AttentionStudentView } from '../types';

/**
 * Calculates student Chemistry GPA according to Vietnam MoET Circular 22:
 * Regular assessments (TX1, TX2, TX3, Thực hành) weight 1
 * Midterm (GK) weight 2
 * Final term (CK) weight 3
 */
export function calculateSemesterGPA(grade: GradeItem | undefined): number {
  if (!grade) return 0;

  let totalWeightedScore = 0;
  let totalWeights = 0;

  const regularScores = [grade.tx1, grade.tx2, grade.tx3, grade.thuchanh].filter(
    (s): s is number => typeof s === 'number' && !isNaN(s)
  );

  for (const s of regularScores) {
    totalWeightedScore += s * 1;
    totalWeights += 1;
  }

  if (typeof grade.gk === 'number' && !isNaN(grade.gk)) {
    totalWeightedScore += grade.gk * 2;
    totalWeights += 2;
  }

  if (typeof grade.ck === 'number' && !isNaN(grade.ck)) {
    totalWeightedScore += grade.ck * 3;
    totalWeights += 3;
  }

  if (totalWeights === 0) return 0;
  return Math.round((totalWeightedScore / totalWeights) * 10) / 10;
}

/**
 * Evaluates performance rank according to TT 22
 */
export function getPerformanceRank(gpa: number, grade?: GradeItem): 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt' {
  if (gpa === 0) return 'Đạt';
  
  const allScores = [grade?.tx1, grade?.tx2, grade?.tx3, grade?.thuchanh, grade?.gk, grade?.ck].filter(
    (s): s is number => typeof s === 'number' && !isNaN(s)
  );
  const minScore = allScores.length > 0 ? Math.min(...allScores) : gpa;

  if (gpa >= 8.0 && minScore >= 6.5) return 'Tốt';
  if (gpa >= 6.5 && minScore >= 5.0) return 'Khá';
  if (gpa >= 5.0 && minScore >= 3.5) return 'Đạt';
  return 'Chưa đạt';
}

/**
 * Calculate attendance rate percentage
 */
export function calculateAttendanceRate(present: number, total: number): number {
  if (!total || total === 0) return 100;
  return Math.round((present / total) * 1000) / 10;
}

/**
 * Calculate assignment completion rate
 */
export function calculateAssignmentRate(completed: number, total: number): number {
  if (!total || total === 0) return 100;
  return Math.round((completed / total) * 1000) / 10;
}

/**
 * Detect score trend
 */
export function getScoreTrend(history: { period: string; score: number }[]): 'up' | 'down' | 'stable' {
  if (!history || history.length < 2) return 'stable';
  const lastScore = history[history.length - 1].score;
  const prevScore = history[history.length - 2].score;
  const diff = lastScore - prevScore;
  if (diff > 0.3) return 'up';
  if (diff < -0.3) return 'down';
  return 'stable';
}

/**
 * Internal early intervention analysis
 * Mức 1 – Theo dõi: Điểm giảm hoặc bài tập chưa hoàn thành
 * Mức 2 – Cần hỗ trợ: Điểm thấp, chuyên cần thấp, hoặc nhiều bài chưa nộp
 * Mức 3 – Ưu tiên hỗ trợ: Nhiều chỉ số cùng ở mức cảnh báo
 */
export function analyzeAttentionStatus(student: StudentItem, className: string): AttentionStudentView | null {
  const gpa = calculateSemesterGPA(student.grades.semester1);
  const attRate = calculateAttendanceRate(
    student.attendanceSummary.present,
    student.attendanceSummary.total
  );
  const asgRate = calculateAssignmentRate(
    student.assignmentSummary.completed,
    student.assignmentSummary.total
  );
  const trend = getScoreTrend(student.scoreHistory);

  const reasons: string[] = [];
  let warningCount = 0;

  if (gpa > 0 && gpa < 5.0) {
    reasons.push(`Điểm trung bình hiện tại thấp (${gpa.toFixed(1)} điểm)`);
    warningCount += 2;
  } else if (gpa > 0 && gpa < 6.0) {
    reasons.push(`Điểm môn Hóa ở mức sát điểm đạt (${gpa.toFixed(1)} điểm)`);
    warningCount += 1;
  }

  if (attRate < 85) {
    reasons.push(`Tỷ lệ chuyên cần thấp (${attRate}%, vắng ${student.attendanceSummary.unexcused} buổi không phép)`);
    warningCount += 2;
  } else if (attRate < 92) {
    reasons.push(`Chuyên cần chưa đều (${attRate}%)`);
    warningCount += 1;
  }

  if (asgRate < 60) {
    const missing = student.assignmentSummary.total - student.assignmentSummary.completed;
    reasons.push(`Chưa nộp ${missing}/${student.assignmentSummary.total} bài tập Hóa học`);
    warningCount += 2;
  } else if (asgRate < 80) {
    reasons.push(`Chậm tiến độ bài tập (${student.assignmentSummary.completed}/${student.assignmentSummary.total} bài)`);
    warningCount += 1;
  }

  if (trend === 'down') {
    reasons.push('Kết quả kiểm tra gần đây có xu hướng giảm liên tục');
    warningCount += 1;
  }

  if (reasons.length === 0 && warningCount === 0) {
    return null;
  }

  let tier: AttentionTier = 'Mức 1 – Theo dõi';
  if (warningCount >= 4) {
    tier = 'Mức 3 – Ưu tiên hỗ trợ';
  } else if (warningCount >= 2) {
    tier = 'Mức 2 – Cần hỗ trợ';
  }

  let suggestedIntervention = 'Nhắc nhở nộp bài tập đúng hạn, động viên tham gia phát biểu trên lớp.';
  if (tier === 'Mức 3 – Ưu tiên hỗ trợ') {
    suggestedIntervention = 'Xếp lịch phụ đạo chuyên đề, liên hệ phụ huynh và phân công bạn khá giỏi kèm cặp.';
  } else if (tier === 'Mức 2 – Cần hỗ trợ') {
    suggestedIntervention = 'Giao bài tập bổ trợ có lời giải chi tiết, kiểm tra vở bài tập đầu giờ.';
  }

  return {
    student,
    className,
    averageScore: gpa,
    attendanceRate: attRate,
    assignmentRate: asgRate,
    tier,
    reasons,
    trend,
    actionTaken: student.teacherNotes || '',
    suggestedIntervention
  };
}
