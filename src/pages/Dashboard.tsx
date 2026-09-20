import React, { useMemo } from 'react';
import {
  School,
  Users,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  TeacherInfo,
  ClassItem,
  StudentItem,
  AssignmentItem,
  TeachingPlanItem,
  AttentionStudentView
} from '../types';
import { StatCard } from '../components/common/StatCard';
import { PerformanceDonutChart } from '../components/charts/PerformanceDonutChart';
import { ScoreTrendLineChart } from '../components/charts/ScoreTrendLineChart';
import { AttendanceBarChart } from '../components/charts/AttendanceBarChart';
import {
  calculateSemesterGPA,
  getPerformanceRank,
  calculateAttendanceRate,
  analyzeAttentionStatus
} from '../utils/calculations';

interface DashboardProps {
  teacher: TeacherInfo;
  classes: ClassItem[];
  students: StudentItem[];
  assignments: AssignmentItem[];
  teachingPlans: TeachingPlanItem[];
  onSelectStudent: (student: StudentItem) => void;
  onSelectClass: (cls: ClassItem) => void;
  onNavigateToPage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  teacher,
  classes,
  students,
  assignments,
  teachingPlans,
  onSelectStudent,
  onSelectClass,
  onNavigateToPage
}) => {
  // Aggregate Metrics
  const totalClasses = classes.length;
  const totalStudents = students.length;

  const { overallGpa, gpaTrendData, performanceData, classAttendanceBreakdown } = useMemo(() => {
    // 1. Calculate GPA
    const validGpas = students
      .map((s) => calculateSemesterGPA(s.grades.semester1))
      .filter((g) => g > 0);
    const avgGpa =
      validGpas.length > 0
        ? Math.round((validGpas.reduce((a, b) => a + b, 0) / validGpas.length) * 10) / 10
        : 7.4;

    // 2. Score trend across milestones
    const periods = ['Đầu năm', 'Giữa kỳ I', 'Cuối kỳ I', 'Giữa kỳ II', 'Cuối kỳ II'];
    const trendMap: { [key: string]: { total: number; count: number } } = {
      'Đầu năm': { total: 0, count: 0 },
      'Giữa kỳ I': { total: 0, count: 0 },
      'Cuối kỳ I': { total: 0, count: 0 }
    };

    students.forEach((s) => {
      s.scoreHistory.forEach((h) => {
        if (trendMap[h.period]) {
          trendMap[h.period].total += h.score;
          trendMap[h.period].count += 1;
        }
      });
    });

    const gpaTrend = [
      {
        period: 'Đầu năm',
        score: trendMap['Đầu năm'].count > 0 ? Math.round((trendMap['Đầu năm'].total / trendMap['Đầu năm'].count) * 10) / 10 : 7.1
      },
      {
        period: 'Giữa kỳ I',
        score: trendMap['Giữa kỳ I'].count > 0 ? Math.round((trendMap['Giữa kỳ I'].total / trendMap['Giữa kỳ I'].count) * 10) / 10 : 7.3
      },
      {
        period: 'Cuối kỳ I',
        score: avgGpa
      },
      {
        period: 'Giữa kỳ II',
        score: 7.6 // target projection
      },
      {
        period: 'Cuối kỳ II',
        score: 7.8 // target benchmark
      }
    ];

    // 3. Performance Distribution (Tốt, Khá, Đạt, Chưa đạt)
    let tot = 0;
    let kha = 0;
    let dat = 0;
    let chuaDat = 0;

    students.forEach((s) => {
      const g = calculateSemesterGPA(s.grades.semester1);
      const rank = getPerformanceRank(g, s.grades.semester1);
      if (rank === 'Tốt') tot++;
      else if (rank === 'Khá') kha++;
      else if (rank === 'Đạt') dat++;
      else chuaDat++;
    });

    const perf = [
      {
        name: 'Tốt (Giỏi)',
        count: tot,
        percentage: totalStudents > 0 ? Math.round((tot / totalStudents) * 100) : 38,
        color: '#10b981', // emerald-500
        bgLight: 'bg-emerald-50'
      },
      {
        name: 'Khá',
        count: kha,
        percentage: totalStudents > 0 ? Math.round((kha / totalStudents) * 100) : 44,
        color: '#2563eb', // blue-600
        bgLight: 'bg-blue-50'
      },
      {
        name: 'Đạt (TB)',
        count: dat,
        percentage: totalStudents > 0 ? Math.round((dat / totalStudents) * 100) : 15,
        color: '#f59e0b', // amber-500
        bgLight: 'bg-amber-50'
      },
      {
        name: 'Chưa đạt',
        count: chuaDat,
        percentage: totalStudents > 0 ? Math.round((chuaDat / totalStudents) * 100) : 3,
        color: '#f43f5e', // rose-500
        bgLight: 'bg-rose-50'
      }
    ];

    // 4. Class Attendance breakdown
    const attList = classes.map((c) => {
      const cStudents = students.filter((s) => s.classId === c.id);
      const p = cStudents.reduce((acc, s) => acc + s.attendanceSummary.present, 0);
      const e = cStudents.reduce((acc, s) => acc + s.attendanceSummary.excused, 0);
      const u = cStudents.reduce((acc, s) => acc + s.attendanceSummary.unexcused, 0);
      const t = p + e + u || 1;

      return {
        label: c.name,
        presentRate: Math.round((p / t) * 1000) / 10,
        excusedRate: Math.round((e / t) * 1000) / 10,
        unexcusedRate: Math.round((u / t) * 1000) / 10,
        presentCount: p,
        excusedCount: e,
        unexcusedCount: u,
        totalSessions: t
      };
    });

    return {
      overallGpa: avgGpa,
      gpaTrendData: gpaTrend,
      performanceData: perf,
      classAttendanceBreakdown: attList
    };
  }, [students, classes, totalStudents]);

  // Overall attendance rate across whole school
  const totalPresent = students.reduce((acc, s) => acc + s.attendanceSummary.present, 0);
  const totalAtt = students.reduce((acc, s) => acc + s.attendanceSummary.total, 0);
  const overallAttendanceRate = calculateAttendanceRate(totalPresent, totalAtt);

  // Attention students list
  const attentionList = useMemo(() => {
    const list: AttentionStudentView[] = [];
    students.forEach((s) => {
      const c = classes.find((item) => item.id === s.classId);
      const res = analyzeAttentionStatus(s, c?.name || s.classId);
      if (res) list.push(res);
    });
    // Sort highest tier first
    return list.sort((a, b) => {
      const tierRank = {
        'Mức 3 – Ưu tiên hỗ trợ': 3,
        'Mức 2 – Cần hỗ trợ': 2,
        'Mức 1 – Theo dõi': 1
      };
      return tierRank[b.tier] - tierRank[a.tier];
    });
  }, [students, classes]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Welcome & Greeting Banner (Section 5 & 35) */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background chemistry shapes */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Sparkles className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-3 backdrop-blur-xs">
            <span>Môn Hóa học THPT</span>
            <span>•</span>
            <span>{teacher.school}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Xin chào, thầy {teacher.name}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
            Chào mừng thầy đến với hệ thống quản trị học tập môn Hóa học. Toàn bộ thông số lớp học, điểm số, chuyên cần và học sinh cần chú ý đã được cập nhật sẵn sàng.
          </p>
        </div>
      </div>

      {/* 2. Four Key Stat Cards (Section 5 & 35) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Thẻ 1 - LỚP ĐANG DẠY */}
        <StatCard
          id="stat-card-classes"
          title="Lớp đang dạy"
          value={totalClasses < 10 ? `0${totalClasses}` : totalClasses}
          subtitle="Lớp đang giảng dạy"
          icon={School}
          accentColor="blue"
          onClick={() => onNavigateToPage('classes')}
        />

        {/* Thẻ 2 - HỌC SINH */}
        <StatCard
          id="stat-card-students"
          title="Học sinh"
          value={totalStudents}
          subtitle="Tổng số học sinh"
          icon={Users}
          accentColor="indigo"
          onClick={() => onNavigateToPage('students')}
        />

        {/* Thẻ 3 - CHUYÊN CẦN */}
        <StatCard
          id="stat-card-attendance"
          title="Chuyên cần"
          value={`${overallAttendanceRate.toFixed(1).replace('.', ',')}%`}
          subtitle="Tỷ lệ chuyên cần"
          icon={ClipboardCheck}
          trend={{ value: '0.4% so với tuần trước', isPositive: true }}
          accentColor="emerald"
          onClick={() => onNavigateToPage('attendance')}
        />

        {/* Thẻ 4 - ĐIỂM TRUNG BÌNH */}
        <StatCard
          id="stat-card-gpa"
          title="Điểm trung bình"
          value={overallGpa.toFixed(1).replace('.', ',')}
          subtitle="Điểm trung bình hiện tại"
          icon={TrendingUp}
          trend={{ value: '0.3 điểm HK1', isPositive: true }}
          accentColor="amber"
          onClick={() => onNavigateToPage('grades')}
        />
      </div>

      {/* 3. Three Dashboard Charts (Section 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ 1: Phân bố kết quả học tập */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Phân bố kết quả học tập</h3>
              <p className="text-xs text-slate-500 mt-0.5">Xếp loại học lực theo Thông tư 22</p>
            </div>
            <button
              onClick={() => onNavigateToPage('grades')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Chi tiết
            </button>
          </div>
          <div className="py-2 flex-1 flex items-center justify-center">
            <PerformanceDonutChart data={performanceData} totalStudents={totalStudents} />
          </div>
        </div>

        {/* Biểu đồ 2: Xu hướng điểm trung bình */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Xu hướng điểm trung bình</h3>
              <p className="text-xs text-slate-500 mt-0.5">Diễn biến qua các kỳ đánh giá trong năm</p>
            </div>
            <button
              onClick={() => onNavigateToPage('reports')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Xem báo cáo
            </button>
          </div>
          <div className="py-2 flex-1 flex items-center justify-center">
            <ScoreTrendLineChart data={gpaTrendData} targetScore={7.5} />
          </div>
        </div>

        {/* Biểu đồ 3: Chuyên cần các lớp */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chuyên cần theo lớp</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ có mặt, nghỉ phép & không phép</p>
            </div>
            <button
              onClick={() => onNavigateToPage('attendance')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Điểm danh
            </button>
          </div>
          <div className="py-2 flex-1 flex items-center justify-center">
            <AttendanceBarChart data={classAttendanceBreakdown} />
          </div>
        </div>
      </div>

      {/* 4. Section 7: KHU VỰC "HỌC SINH CẦN QUAN TÂM" */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Học sinh cần quan tâm</h3>
              <p className="text-xs text-slate-500">
                Tự động nhận diện học sinh có điểm thấp, vắng nhiều hoặc chậm tiến độ bài tập
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToPage('attention')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Xem tất cả ({attentionList.length} em)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Học sinh</th>
                <th className="p-3.5">Lớp</th>
                <th className="p-3.5 text-center">Điểm TB</th>
                <th className="p-3.5 text-center">Chuyên cần</th>
                <th className="p-3.5 text-center">Bài tập</th>
                <th className="p-3.5">Dấu hiệu cần chú ý</th>
                <th className="p-3.5 text-center">Trạng thái</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attentionList.slice(0, 5).map((item) => {
                const isUrgent = item.tier === 'Mức 3 – Ưu tiên hỗ trợ';
                const isSupport = item.tier === 'Mức 2 – Cần hỗ trợ';

                return (
                  <tr
                    key={item.student.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => onSelectStudent(item.student)}
                  >
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {item.student.name.charAt(0)}
                        </div>
                        <span>{item.student.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">{item.className}</td>
                    <td className="p-3.5 text-center font-bold text-slate-900">
                      {item.averageScore > 0 ? item.averageScore.toFixed(1).replace('.', ',') : '--'}
                    </td>
                    <td className="p-3.5 text-center text-slate-700 font-medium">
                      {item.attendanceRate}%
                    </td>
                    <td className="p-3.5 text-center text-slate-700">
                      {item.student.assignmentSummary.completed}/{item.student.assignmentSummary.total}
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate">
                      {item.reasons[0] || 'Cần theo dõi thêm'}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                          isUrgent
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isSupport
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {item.tier.split(' – ')[1] || item.tier}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <span className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                        Hồ sơ
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Bottom Dual Widgets: Assignments Due & Teaching Plan Week */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bài tập môn Hóa gần đến hạn */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Bài tập Hóa học gần đến hạn</h3>
            </div>
            <button
              onClick={() => onNavigateToPage('assignments')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Quản lý bài tập
            </button>
          </div>

          <div className="space-y-4">
            {assignments.slice(0, 3).map((asg) => {
              const totalExpected = asg.classIds.reduce((sum, cid) => {
                const cCount = students.filter((s) => s.classId === cid).length;
                return sum + cCount;
              }, 0) || 45;
              const completedCount = asg.completedStudentIds.length;
              const percent = Math.min(100, Math.round((completedCount / totalExpected) * 100));

              return (
                <div key={asg.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{asg.title}</h4>
                        {asg.attachment && (
                          <span className={`px-1.5 py-0.2 text-[9px] font-extrabold rounded-md uppercase tracking-wide ${
                            asg.attachment.type === 'pdf' || asg.attachment.name.toLowerCase().endsWith('.pdf')
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {asg.attachment.type === 'pdf' || asg.attachment.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Áp dụng: {asg.classIds.join(', ')} • Hạn nộp: <span className="font-semibold text-slate-700">{asg.dueDate}</span>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 shrink-0">
                      {asg.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                      <span className="font-medium">
                        {completedCount}/{totalExpected} học sinh đã hoàn thành
                      </span>
                      <span className="font-bold text-blue-700">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kế hoạch giảng dạy tuần này */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Kế hoạch giảng dạy tuần này</h3>
            </div>
            <button
              onClick={() => onNavigateToPage('teachingPlan')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Xem toàn bộ
            </button>
          </div>

          <div className="space-y-3">
            {teachingPlans.slice(0, 3).map((plan) => (
              <div
                key={plan.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 font-mono font-bold text-xs shrink-0">
                    T{plan.week} - Tiết {plan.period}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{plan.lessonContent}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Chủ đề: {plan.topic} • Khối {plan.gradeLevel}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    plan.status === 'Hoàn thành'
                      ? 'bg-emerald-100 text-emerald-800'
                      : plan.status === 'Đang thực hiện'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {plan.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
