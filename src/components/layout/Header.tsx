import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Settings as SettingsIcon,
  FlaskConical,
  Menu,
  X,
  ExternalLink,
  CheckCheck
} from 'lucide-react';
import { TeacherInfo, NotificationItem } from '../../types';

interface HeaderProps {
  teacher: TeacherInfo;
  academicYear: string;
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenSearch: () => void;
  onNavigateToSettings: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  teacher,
  academicYear,
  notifications,
  onNotificationClick,
  onMarkAllNotificationsRead,
  onOpenSearch,
  onNavigateToSettings,
  onToggleSidebar,
  isSidebarOpen
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="app-global-header"
      className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs px-4 lg:px-6 py-3 transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            id="btn-toggle-sidebar"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm md:text-base whitespace-nowrap">
                  QUẢN TRỊ HỌC TẬP
                </span>
                <span className="text-slate-300 font-light">|</span>
                <span className="font-bold text-blue-700 text-sm md:text-base whitespace-nowrap">
                  HÓA HỌC THPT
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span>{teacher.school}</span>
                <span>•</span>
                <span>Năm học {academicYear}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar trigger */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <button
            type="button"
            id="global-search-trigger-btn"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-sm text-slate-500 transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
              <span className="truncate">Tìm kiếm học sinh, lớp, bài tập...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Badges & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Demo Data indicator */}
          <div
            id="badge-demo-data"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80"
            title="Hệ thống đang hiển thị bộ dữ liệu mô phỏng giảng dạy thực tế. Giáo viên có thể tự do thêm, sửa, xóa hoặc khôi phục bất cứ lúc nào."
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Dữ liệu mẫu</span>
          </div>

          {/* Notifications dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="header-btn-notifications"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifMenu && (
              <div
                id="header-notification-dropdown"
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Thông báo hệ thống</h4>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                        {unreadCount} mới
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Đã đọc tất cả
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Không có thông báo nào mới.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onNotificationClick(n);
                          setShowNotifMenu(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs font-bold ${
                              n.type === 'warning'
                                ? 'text-amber-700'
                                : n.type === 'success'
                                ? 'text-emerald-700'
                                : 'text-blue-700'
                            }`}
                          >
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                        {n.linkToPage && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
                            <span>Mở nhanh</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Settings Icon */}
          <button
            type="button"
            id="header-btn-settings"
            onClick={onNavigateToSettings}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Cài đặt hệ thống"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          {/* Teacher Profile Info */}
          <div
            id="header-teacher-profile"
            onClick={onNavigateToSettings}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {teacher.name.split(' ').slice(-1)[0]?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                {teacher.name}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                GV {teacher.subject}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
