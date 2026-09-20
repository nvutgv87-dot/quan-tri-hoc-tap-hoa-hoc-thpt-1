import React from 'react';
import {
  LayoutDashboard,
  School,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  FileText,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  FlaskRound
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'classes'
  | 'students'
  | 'attendance'
  | 'grades'
  | 'assignments'
  | 'teachingPlan'
  | 'attention'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  attentionCount: number;
  classesCount: number;
  totalStudents: number;
  activeAssignmentsCount: number;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'warning' | 'neutral' | 'primary';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpen,
  onCloseMobile,
  attentionCount,
  classesCount,
  totalStudents,
  activeAssignmentsCount
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard
    },
    {
      id: 'classes',
      label: 'Lớp học',
      icon: School,
      badge: classesCount > 0 ? `${classesCount}` : undefined,
      badgeVariant: 'neutral'
    },
    {
      id: 'students',
      label: 'Học sinh',
      icon: GraduationCap,
      badge: totalStudents > 0 ? `${totalStudents}` : undefined,
      badgeVariant: 'neutral'
    },
    {
      id: 'attendance',
      label: 'Chuyên cần',
      icon: ClipboardCheck
    },
    {
      id: 'grades',
      label: 'Điểm số',
      icon: BarChart3
    },
    {
      id: 'assignments',
      label: 'Bài tập',
      icon: FileText,
      badge: activeAssignmentsCount > 0 ? `${activeAssignmentsCount}` : undefined,
      badgeVariant: 'primary'
    },
    {
      id: 'teachingPlan',
      label: 'Kế hoạch giảng dạy',
      icon: BookOpen
    },
    {
      id: 'attention',
      label: 'Học sinh cần chú ý',
      icon: AlertTriangle,
      badge: attentionCount > 0 ? `${attentionCount}` : undefined,
      badgeVariant: 'warning'
    },
    {
      id: 'reports',
      label: 'Báo cáo',
      icon: TrendingUp
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } pt-16 lg:pt-0`}
      >
        {/* Brand header on desktop sidebar */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
            <FlaskRound className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs font-black tracking-wider text-slate-200 uppercase truncate">
              HÓA HỌC THPT
            </h1>
            <p className="text-[10px] text-slate-400 truncate">Hệ thống quản trị học tập</p>
          </div>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeVariant === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.badgeVariant === 'primary'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom helper info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 text-xs text-slate-400">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Phiên bản v2.6.0</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Sẵn sàng
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Lưu trữ offline an toàn trên trình duyệt (localStorage).
          </p>
        </div>
      </aside>
    </>
  );
};
