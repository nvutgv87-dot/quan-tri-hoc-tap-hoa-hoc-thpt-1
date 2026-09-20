import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, User, School, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { StudentItem, ClassItem, AssignmentItem, TeachingPlanItem } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentItem[];
  classes: ClassItem[];
  assignments: AssignmentItem[];
  teachingPlans: TeachingPlanItem[];
  onSelectStudent: (student: StudentItem) => void;
  onSelectClass: (classItem: ClassItem) => void;
  onSelectAssignment: () => void;
  onSelectTeachingPlan: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  students,
  classes,
  assignments,
  teachingPlans,
  onSelectStudent,
  onSelectClass,
  onSelectAssignment,
  onSelectTeachingPlan
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { students: [], classes: [], assignments: [], teachingPlans: [] };

    const matchedStudents = students
      .filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.classId.toLowerCase().includes(q))
      .slice(0, 6);

    const matchedClasses = classes.filter(
      (c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.academicTrack.toLowerCase().includes(q)
    );

    const matchedAssignments = assignments
      .filter((a) => a.title.toLowerCase().includes(q) || a.topic.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedPlans = teachingPlans
      .filter((p) => p.lessonContent.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q))
      .slice(0, 3);

    return {
      students: matchedStudents,
      classes: matchedClasses,
      assignments: matchedAssignments,
      teachingPlans: matchedPlans
    };
  }, [query, students, classes, assignments, teachingPlans]);

  const totalMatches =
    results.students.length +
    results.classes.length +
    results.assignments.length +
    results.teachingPlans.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            id="global-search-input"
            autoFocus
            placeholder="Tìm theo tên học sinh (vd: Nguyễn Văn A), lớp (vd: 11A1), bài tập, chủ đề Hóa học..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 outline-hidden font-medium"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 rounded border border-slate-200 font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm font-medium">Gợi ý tìm kiếm nhanh:</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {['Nguyễn Văn A', '11A1', '11A2', 'Cân bằng hóa học', 'pH', 'Kc'].map((hint) => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() => setQuery(hint)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    "{hint}"
                  </button>
                ))}
              </div>
            </div>
          ) : totalMatches === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm">Không tìm thấy kết quả phù hợp cho "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Hãy thử tìm theo tên không dấu hoặc mã lớp (11A1, 11A2...)</p>
            </div>
          ) : (
            <>
              {/* Students Section */}
              {results.students.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" />
                    <span>Học sinh ({results.students.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {results.students.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => {
                          onSelectStudent(student);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                              {student.name}
                            </span>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <span>Lớp {student.classId}</span>
                              <span>•</span>
                              <span>Mã: {student.code}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes Section */}
              {results.classes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <School className="w-3.5 h-3.5" />
                    <span>Lớp học ({results.classes.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {results.classes.map((cls) => (
                      <div
                        key={cls.id}
                        onClick={() => {
                          onSelectClass(cls);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                            {cls.id}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                              {cls.name}
                            </span>
                            <div className="text-xs text-slate-500">
                              {cls.roomNumber} • {cls.academicTrack}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments Section */}
              {results.assignments.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Bài tập Hóa học ({results.assignments.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {results.assignments.map((asg) => (
                      <div
                        key={asg.id}
                        onClick={() => {
                          onSelectAssignment();
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                      >
                        <div>
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                            {asg.title}
                          </span>
                          <div className="text-xs text-slate-500">
                            Chủ đề: {asg.topic} • Hạn nộp: {asg.dueDate}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teaching Plans Section */}
              {results.teachingPlans.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Kế hoạch giảng dạy ({results.teachingPlans.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {results.teachingPlans.map((tp) => (
                      <div
                        key={tp.id}
                        onClick={() => {
                          onSelectTeachingPlan();
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
                      >
                        <div>
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                            Tuần {tp.week} - Tiết {tp.period}: {tp.lessonContent}
                          </span>
                          <div className="text-xs text-slate-500">Chủ đề: {tp.topic}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
