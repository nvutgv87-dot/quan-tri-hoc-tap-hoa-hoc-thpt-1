import React from 'react';

interface AttendanceBreakdown {
  label: string; // e.g., "11A1", "11A2", etc.
  presentRate: number; // percentage
  excusedRate: number;
  unexcusedRate: number;
  presentCount: number;
  excusedCount: number;
  unexcusedCount: number;
  totalSessions: number;
}

interface AttendanceBarChartProps {
  data: AttendanceBreakdown[];
}

export const AttendanceBarChart: React.FC<AttendanceBarChartProps> = ({ data }) => {
  return (
    <div className="w-full space-y-4 p-2">
      {data.map((item) => (
        <div key={item.label} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 text-sm">{item.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-700 font-semibold">
                Có mặt: {item.presentRate.toFixed(1)}%
              </span>
              {(item.excusedCount > 0 || item.unexcusedCount > 0) && (
                <span className="text-slate-500">
                  (Vắng: {item.excusedCount} phép, {item.unexcusedCount} không phép)
                </span>
              )}
            </div>
          </div>

          {/* Stacked bar */}
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {/* Present bar */}
            <div
              className="h-full bg-emerald-500 transition-all duration-300 hover:opacity-90"
              style={{ width: `${item.presentRate}%` }}
              title={`Có mặt: ${item.presentCount} lượt (${item.presentRate.toFixed(1)}%)`}
            />
            {/* Excused bar */}
            <div
              className="h-full bg-amber-400 transition-all duration-300 hover:opacity-90"
              style={{ width: `${item.excusedRate}%` }}
              title={`Vắng có phép: ${item.excusedCount} lượt (${item.excusedRate.toFixed(1)}%)`}
            />
            {/* Unexcused bar */}
            <div
              className="h-full bg-rose-500 transition-all duration-300 hover:opacity-90"
              style={{ width: `${item.unexcusedRate}%` }}
              title={`Vắng không phép: ${item.unexcusedCount} lượt (${item.unexcusedRate.toFixed(1)}%)`}
            />
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-3 mt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-emerald-500" />
          <span className="text-slate-700 font-medium">Có mặt (Đạt chuẩn)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-amber-400" />
          <span className="text-slate-700 font-medium">Vắng có phép</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-rose-500" />
          <span className="text-slate-700 font-medium">Vắng không phép (Cảnh báo)</span>
        </div>
      </div>
    </div>
  );
};
