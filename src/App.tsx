import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { Toast, ToastMessage } from './components/common/Toast';
import { ConfirmModal } from './components/common/ConfirmModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Classes } from './pages/Classes';
import { Students } from './pages/Students';
import { Attendance } from './pages/Attendance';
import { Grades } from './pages/Grades';
import { Assignments } from './pages/Assignments';
import { TeachingPlan } from './pages/TeachingPlan';
import { AttentionStudents } from './pages/AttentionStudents';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

// Modals
import { StudentDetailModal } from './components/students/StudentDetailModal';
import { StudentFormModal } from './components/students/StudentFormModal';
import { ClassFormModal } from './components/classes/ClassFormModal';
import { ClassDetailModal } from './components/classes/ClassDetailModal';
import { AssignmentFormModal } from './components/assignments/AssignmentFormModal';
import { TeachingPlanModal } from './components/teachingPlan/TeachingPlanModal';

// Types & Storage
import {
  TeacherInfo,
  ClassItem,
  StudentItem,
  AssignmentItem,
  TeachingPlanItem,
  NotificationItem
} from './types';
import { StorageService } from './utils/storage';
import { analyzeAttentionStatus } from './utils/calculations';

export default function App() {
  // 1. Core State loaded from localStorage
  const [teacher, setTeacher] = useState<TeacherInfo>(StorageService.getTeacherInfo());
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [teachingPlans, setTeachingPlans] = useState<TeachingPlanItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 2. Navigation State
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');

  // 3. Modals & Dialog State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentItem | null>(null);
  const [selectedClassForDetail, setSelectedClassForDetail] = useState<ClassItem | null>(null);

  // Form modals state
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentItem | null>(null);

  const [isClassFormOpen, setIsClassFormOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<ClassItem | null>(null);

  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState<AssignmentItem | null>(null);

  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<TeachingPlanItem | null>(null);

  // Confirm delete modal state
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    StorageService.init();
    setTeacher(StorageService.getTeacherInfo());
    setClasses(StorageService.getClasses());
    setStudents(StorageService.getStudents());
    setAssignments(StorageService.getAssignments());
    setTeachingPlans(StorageService.getTeachingPlans());
    setNotifications(StorageService.getNotifications());
    setIsLoaded(true);
  }, []);

  // Calculate badge for Attention Students
  const attentionCount = useMemo(() => {
    return students.filter((s) => analyzeAttentionStatus(s, s.classId) !== null).length;
  }, [students]);

  // Handlers for updating models and persisting to storage
  const handleUpdateStudents = (updated: StudentItem[]) => {
    setStudents(updated);
    StorageService.saveStudents(updated);
  };

  const handleSaveStudent = (studentData: Partial<StudentItem>) => {
    if (studentToEdit) {
      // Edit existing
      const updated = students.map((s) =>
        s.id === studentToEdit.id ? ({ ...s, ...studentData } as StudentItem) : s
      );
      handleUpdateStudents(updated);
      addToast('Cập nhật học sinh', `Đã lưu thông tin học sinh ${studentData.name}.`, 'success');
      // Update opened detail modal if currently viewing this student
      if (selectedStudentForDetail?.id === studentToEdit.id) {
        setSelectedStudentForDetail({ ...selectedStudentForDetail, ...studentData } as StudentItem);
      }
    } else {
      // Add new
      const newStudent: StudentItem = {
        id: `STU-${Date.now().toString().slice(-5)}`,
        code: studentData.code || `2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: studentData.name || 'Học sinh mới',
        classId: studentData.classId || (classes[0]?.id || '11A1'),
        gender: studentData.gender || 'Nam',
        dob: studentData.dob || '2009-01-01',
        phone: studentData.phone || '',
        grades: studentData.grades || {
          semester1: { tx1: null, tx2: null, tx3: null, thuchanh: null, gk: null, ck: null }
        },
        scoreHistory: [
          { period: 'Đầu năm', score: 6.5 },
          { period: 'Giữa kỳ I', score: 7.0 }
        ],
        attendanceSummary: { present: 18, excused: 0, unexcused: 0, total: 18 },
        assignmentSummary: { completed: 4, total: 4 },
        teacherNotes: studentData.teacherNotes || '',
        status: 'Đang học',
        lastUpdated: new Date().toISOString().slice(0, 10)
      };

      const updated = [newStudent, ...students];
      handleUpdateStudents(updated);
      addToast('Thêm học sinh', `Đã thêm học sinh ${newStudent.name} vào lớp ${newStudent.classId}.`, 'success');
    }
  };

  const handleDeleteStudent = (student: StudentItem) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Xác nhận xóa học sinh',
      message: `Thầy có chắc chắn muốn xóa học sinh ${student.name} (${student.code}) khỏi danh sách? Thao tác này không thể hoàn tác.`,
      onConfirm: () => {
        const updated = students.filter((s) => s.id !== student.id);
        handleUpdateStudents(updated);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('Đã xóa', `Đã xóa học sinh ${student.name}.`, 'info');
      }
    });
  };

  const handleImportStudents = (imported: Partial<StudentItem>[]) => {
    const newStudents: StudentItem[] = imported.map((item, index) => ({
      id: `STU-${Date.now()}-${index}`,
      code: item.code || `2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: item.name || 'Học sinh',
      classId: item.classId || (classes[0]?.id || '11A1'),
      gender: item.gender || 'Nam',
      dob: item.dob || '2009-01-01',
      phone: item.phone || '',
      grades: item.grades || {
        semester1: { tx1: 7, tx2: 8, tx3: 7.5, thuchanh: 8, gk: 7.5, ck: 8 }
      },
      scoreHistory: [
        { period: 'Đầu năm', score: 7.0 },
        { period: 'Giữa kỳ I', score: 7.5 }
      ],
      attendanceSummary: { present: 18, excused: 0, unexcused: 0, total: 18 },
      assignmentSummary: { completed: 4, total: 4 },
      teacherNotes: '',
      status: 'Đang học',
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));

    const updated = [...students, ...newStudents];
    handleUpdateStudents(updated);
    addToast('Nhập thành công', `Đã thêm ${newStudents.length} học sinh từ tệp CSV vào hệ thống.`, 'success');
  };

  const handleSaveClass = (classData: Partial<ClassItem>) => {
    if (classToEdit) {
      const updated = classes.map((c) =>
        c.id === classToEdit.id ? ({ ...c, ...classData } as ClassItem) : c
      );
      setClasses(updated);
      StorageService.saveClasses(updated);
      addToast('Cập nhật lớp', `Đã lưu thông tin lớp ${classData.name}.`, 'success');
    } else {
      const newClass: ClassItem = {
        id: classData.id || `11A${classes.length + 1}`,
        name: classData.name || `Lớp 11A${classes.length + 1}`,
        gradeLevel: classData.gradeLevel || 11,
        academicTrack: classData.academicTrack || 'KHTN (Hóa - Sinh - Toán)',
        homeroomTeacher: classData.homeroomTeacher || teacher.name,
        roomNumber: classData.roomNumber || 'Phòng 204',
        notes: classData.notes || ''
      };
      const updated = [...classes, newClass];
      setClasses(updated);
      StorageService.saveClasses(updated);
      addToast('Thêm lớp học', `Đã thêm lớp ${newClass.name}.`, 'success');
    }
  };

  const handleDeleteClass = (cls: ClassItem) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Xác nhận xóa lớp học',
      message: `Thầy có chắc chắn muốn xóa lớp ${cls.name}? Toàn bộ dữ liệu điểm danh và thông tin lớp sẽ bị xóa khỏi hệ thống.`,
      onConfirm: () => {
        const updated = classes.filter((c) => c.id !== cls.id);
        setClasses(updated);
        StorageService.saveClasses(updated);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('Đã xóa', `Đã xóa lớp ${cls.name}.`, 'info');
      }
    });
  };

  const handleSaveAssignment = (asgData: Partial<AssignmentItem>) => {
    if (assignmentToEdit) {
      const updated = assignments.map((a) =>
        a.id === assignmentToEdit.id ? ({ ...a, ...asgData } as AssignmentItem) : a
      );
      setAssignments(updated);
      StorageService.saveAssignments(updated);
      addToast(
        'Cập nhật bài tập',
        asgData.attachment
          ? `Đã lưu bài tập và tệp đề bài "${asgData.attachment.name}".`
          : `Đã lưu bài tập "${asgData.title}".`,
        'success'
      );
    } else {
      const newAsg: AssignmentItem = {
        id: asgData.id || `ASG-${Date.now().toString().slice(-4)}`,
        title: asgData.title || 'Bài tập Hóa học',
        topic: asgData.topic || 'Cân bằng hóa học',
        classIds: asgData.classIds || [classes[0]?.id || '11A1'],
        assignedDate: asgData.assignedDate || new Date().toISOString().slice(0, 10),
        dueDate: asgData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        description: asgData.description || '',
        maxScore: asgData.maxScore || 10,
        status: asgData.status || 'active',
        completedStudentIds: [],
        attachment: asgData.attachment || null
      };
      const updated = [newAsg, ...assignments];
      setAssignments(updated);
      StorageService.saveAssignments(updated);
      addToast(
        'Tạo bài tập',
        newAsg.attachment
          ? `Đã giao bài tập cho lớp ${newAsg.classIds.join(', ')} kèm tệp đề "${newAsg.attachment.name}".`
          : `Đã giao bài tập mới cho các lớp ${newAsg.classIds.join(', ')}.`,
        'success'
      );
    }
  };

  const handleDeleteAssignment = (asg: AssignmentItem) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Xác nhận xóa bài tập',
      message: `Thầy có chắc muốn xóa bài tập "${asg.title}"?`,
      onConfirm: () => {
        const updated = assignments.filter((a) => a.id !== asg.id);
        setAssignments(updated);
        StorageService.saveAssignments(updated);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('Đã xóa', `Đã xóa bài tập "${asg.title}".`, 'info');
      }
    });
  };

  const handleToggleStudentCompletion = (assignmentId: string, studentId: string) => {
    const updated = assignments.map((a) => {
      if (a.id !== assignmentId) return a;
      const isCompleted = a.completedStudentIds.includes(studentId);
      const newCompleted = isCompleted
        ? a.completedStudentIds.filter((id) => id !== studentId)
        : [...a.completedStudentIds, studentId];
      return { ...a, completedStudentIds: newCompleted };
    });
    setAssignments(updated);
    StorageService.saveAssignments(updated);
  };

  const handleSavePlan = (planData: Partial<TeachingPlanItem>) => {
    if (planToEdit) {
      const updated = teachingPlans.map((p) =>
        p.id === planToEdit.id ? ({ ...p, ...planData } as TeachingPlanItem) : p
      );
      setTeachingPlans(updated);
      StorageService.saveTeachingPlans(updated);
      addToast('Cập nhật kế hoạch', 'Đã lưu thay đổi kế hoạch bài dạy.', 'success');
    } else {
      const newPlan: TeachingPlanItem = {
        id: planData.id || `TP-${Date.now().toString().slice(-4)}`,
        week: planData.week || 1,
        period: planData.period || 1,
        gradeLevel: planData.gradeLevel || 11,
        topic: planData.topic || 'Cân bằng hóa học',
        lessonContent: planData.lessonContent || 'Bài dạy mới',
        objectives: planData.objectives || '',
        activities: planData.activities || '',
        status: planData.status || 'Chưa thực hiện'
      };
      const updated = [...teachingPlans, newPlan];
      setTeachingPlans(updated);
      StorageService.saveTeachingPlans(updated);
      addToast('Thêm kế hoạch', 'Đã thêm bài dạy mới vào phân phối chương trình.', 'success');
    }
  };

  const handleDeletePlan = (plan: TeachingPlanItem) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Xác nhận xóa bài dạy',
      message: `Thầy có chắc muốn xóa bài dạy "${plan.lessonContent}"?`,
      onConfirm: () => {
        const updated = teachingPlans.filter((p) => p.id !== plan.id);
        setTeachingPlans(updated);
        StorageService.saveTeachingPlans(updated);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('Đã xóa', 'Đã xóa bài dạy khỏi kế hoạch giảng dạy.', 'info');
      }
    });
  };

  const handleUpdatePlanStatus = (planId: string, status: TeachingPlanItem['status']) => {
    const updated = teachingPlans.map((p) => (p.id === planId ? { ...p, status } : p));
    setTeachingPlans(updated);
    StorageService.saveTeachingPlans(updated);
    addToast('Cập nhật tiến độ', `Đã chuyển bài dạy sang trạng thái: "${status}".`, 'info');
  };

  const handleSaveTeacherNotes = (studentId: string, notes: string) => {
    const updated = students.map((s) =>
      s.id === studentId ? { ...s, teacherNotes: notes, lastUpdated: new Date().toISOString().slice(0, 10) } : s
    );
    handleUpdateStudents(updated);
    if (selectedStudentForDetail?.id === studentId) {
      setSelectedStudentForDetail({ ...selectedStudentForDetail, teacherNotes: notes });
    }
    addToast('Lưu nhận xét', 'Đã lưu nhận xét học sinh vào hồ sơ.', 'success');
  };

  const handleUpdateTeacherInfo = (info: TeacherInfo) => {
    setTeacher(info);
    StorageService.saveTeacherInfo(info);
  };

  const handleResetDemoData = () => {
    setConfirmModalState({
      isOpen: true,
      title: 'Khôi phục dữ liệu mẫu gốc',
      message:
        'Hành động này sẽ xóa các chỉnh sửa tạm thời và nạp lại dữ liệu mẫu đầy đủ gồm 4 lớp và 168 học sinh cùng bảng điểm chuẩn của trường THPT Dương Minh Châu. Thầy có muốn tiếp tục?',
      onConfirm: () => {
        StorageService.resetToDemo();
        setTeacher(StorageService.getTeacherInfo());
        setClasses(StorageService.getClasses());
        setStudents(StorageService.getStudents());
        setAssignments(StorageService.getAssignments());
        setTeachingPlans(StorageService.getTeachingPlans());
        setNotifications(StorageService.getNotifications());
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        addToast('Khôi phục thành công', 'Đã nạp lại cơ sở dữ liệu mẫu chuẩn.', 'success');
      }
    });
  };

  const handleRestoreData = (jsonString: string) => {
    const ok = StorageService.importData(jsonString);
    if (ok) {
      setTeacher(StorageService.getTeacherInfo());
      setClasses(StorageService.getClasses());
      setStudents(StorageService.getStudents());
      setAssignments(StorageService.getAssignments());
      setTeachingPlans(StorageService.getTeachingPlans());
      setNotifications(StorageService.getNotifications());
      addToast('Khôi phục thành công', 'Đã nạp lại dữ liệu từ tệp tin sao lưu.', 'success');
    } else {
      addToast('Lỗi nhập dữ liệu', 'Tệp tin không đúng định dạng sao lưu hợp lệ.', 'error');
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    const updated = notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
    if (notif.linkToPage) {
      setCurrentPage(notif.linkToPage as PageId);
    }
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Đang khởi tạo hệ thống quản trị học tập Hóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page: PageId) => {
          setCurrentPage(page);
          setIsMobileSidebarOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        attentionCount={attentionCount}
        classesCount={classes.length}
        totalStudents={students.length}
        activeAssignmentsCount={assignments.filter((a) => a.status === 'active').length}
      />

      {/* 2. Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          teacher={teacher}
          academicYear={teacher.schoolYear || '2026 - 2027'}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigateToSettings={() => setCurrentPage('settings')}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isSidebarOpen={isMobileSidebarOpen}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <Dashboard
              teacher={teacher}
              classes={classes}
              students={students}
              assignments={assignments}
              teachingPlans={teachingPlans}
              onSelectStudent={(s) => setSelectedStudentForDetail(s)}
              onSelectClass={(cls) => setSelectedClassForDetail(cls)}
              onNavigateToPage={(page) => setCurrentPage(page as PageId)}
            />
          )}

          {currentPage === 'classes' && (
            <Classes
              classes={classes}
              students={students}
              onOpenAddClass={() => {
                setClassToEdit(null);
                setIsClassFormOpen(true);
              }}
              onOpenEditClass={(cls) => {
                setClassToEdit(cls);
                setIsClassFormOpen(true);
              }}
              onRequestDeleteClass={handleDeleteClass}
              onSelectClass={(cls) => setSelectedClassForDetail(cls)}
              onNavigateToAttendance={(classId) => {
                setSelectedClassFilter(classId);
                setCurrentPage('attendance');
              }}
              onNavigateToGrades={(classId) => {
                setSelectedClassFilter(classId);
                setCurrentPage('grades');
              }}
            />
          )}

          {currentPage === 'students' && (
            <Students
              students={students}
              classes={classes}
              onSelectStudent={(s) => setSelectedStudentForDetail(s)}
              onOpenAddStudent={() => {
                setStudentToEdit(null);
                setIsStudentFormOpen(true);
              }}
              onOpenEditStudent={(s) => {
                setStudentToEdit(s);
                setIsStudentFormOpen(true);
              }}
              onRequestDeleteStudent={handleDeleteStudent}
              onImportStudents={handleImportStudents}
            />
          )}

          {currentPage === 'attendance' && (
            <Attendance
              students={students}
              classes={classes}
              selectedClassId={selectedClassFilter !== 'ALL' ? selectedClassFilter : undefined}
              onUpdateStudents={handleUpdateStudents}
              onShowToast={addToast}
            />
          )}

          {currentPage === 'grades' && (
            <Grades
              students={students}
              classes={classes}
              selectedClassId={selectedClassFilter !== 'ALL' ? selectedClassFilter : undefined}
              onUpdateStudents={handleUpdateStudents}
              onShowToast={addToast}
            />
          )}

          {currentPage === 'assignments' && (
            <Assignments
              assignments={assignments}
              classes={classes}
              students={students}
              onOpenAddAssignment={() => {
                setAssignmentToEdit(null);
                setIsAssignmentFormOpen(true);
              }}
              onOpenEditAssignment={(asg) => {
                setAssignmentToEdit(asg);
                setIsAssignmentFormOpen(true);
              }}
              onRequestDeleteAssignment={handleDeleteAssignment}
              onToggleStudentCompletion={handleToggleStudentCompletion}
              onShowToast={addToast}
            />
          )}

          {currentPage === 'teachingPlan' && (
            <TeachingPlan
              teachingPlans={teachingPlans}
              onOpenAddPlan={() => {
                setPlanToEdit(null);
                setIsPlanFormOpen(true);
              }}
              onOpenEditPlan={(p) => {
                setPlanToEdit(p);
                setIsPlanFormOpen(true);
              }}
              onRequestDeletePlan={handleDeletePlan}
              onUpdateStatus={handleUpdatePlanStatus}
            />
          )}

          {currentPage === 'attention' && (
            <AttentionStudents
              students={students}
              classes={classes}
              onSelectStudent={(s) => setSelectedStudentForDetail(s)}
              onShowToast={addToast}
            />
          )}

          {currentPage === 'reports' && (
            <Reports
              teacher={teacher}
              classes={classes}
              students={students}
              onShowToast={addToast}
            />
          )}

          {currentPage === 'settings' && (
            <Settings
              teacher={teacher}
              onUpdateTeacher={handleUpdateTeacherInfo}
              onResetDemoData={handleResetDemoData}
              onRestoreData={handleRestoreData}
              onShowToast={addToast}
            />
          )}
        </main>
      </div>

      {/* 3. Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        students={students}
        classes={classes}
        assignments={assignments}
        teachingPlans={teachingPlans}
        onSelectStudent={(s) => {
          setSelectedStudentForDetail(s);
          setIsSearchOpen(false);
        }}
        onSelectClass={(c) => {
          setSelectedClassForDetail(c);
          setIsSearchOpen(false);
        }}
        onSelectAssignment={() => {
          setCurrentPage('assignments');
          setIsSearchOpen(false);
        }}
        onSelectTeachingPlan={() => {
          setCurrentPage('teachingPlan');
          setIsSearchOpen(false);
        }}
      />

      {/* 4. Student Detail / Profile Modal (Section 10) */}
      <StudentDetailModal
        student={selectedStudentForDetail}
        onClose={() => setSelectedStudentForDetail(null)}
        onSaveTeacherNotes={handleSaveTeacherNotes}
        onEditGrades={(student) => {
          setSelectedStudentForDetail(null);
          setStudentToEdit(student);
          setIsStudentFormOpen(true);
        }}
      />

      {/* 5. Class Detail Modal (Section 8) */}
      <ClassDetailModal
        classItem={selectedClassForDetail}
        students={students}
        onClose={() => setSelectedClassForDetail(null)}
        onSelectStudent={(s) => {
          setSelectedClassForDetail(null);
          setSelectedStudentForDetail(s);
        }}
        onNavigateToAttendance={(classId) => {
          setSelectedClassFilter(classId);
          setCurrentPage('attendance');
        }}
        onNavigateToGrades={(classId) => {
          setSelectedClassFilter(classId);
          setCurrentPage('grades');
        }}
        onAddStudent={() => {
          setStudentToEdit(null);
          setIsStudentFormOpen(true);
        }}
      />

      {/* 6. Form Modals */}
      <StudentFormModal
        isOpen={isStudentFormOpen}
        onClose={() => {
          setIsStudentFormOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        classes={classes}
        initialStudent={studentToEdit}
      />

      <ClassFormModal
        isOpen={isClassFormOpen}
        onClose={() => {
          setIsClassFormOpen(false);
          setClassToEdit(null);
        }}
        onSave={handleSaveClass}
        initialClass={classToEdit}
      />

      <AssignmentFormModal
        isOpen={isAssignmentFormOpen}
        onClose={() => {
          setIsAssignmentFormOpen(false);
          setAssignmentToEdit(null);
        }}
        onSave={handleSaveAssignment}
        classes={classes}
        initialAssignment={assignmentToEdit}
      />

      <TeachingPlanModal
        isOpen={isPlanFormOpen}
        onClose={() => {
          setIsPlanFormOpen(false);
          setPlanToEdit(null);
        }}
        onSave={handleSavePlan}
        initialPlan={planToEdit}
      />

      {/* 7. Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 8. Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
