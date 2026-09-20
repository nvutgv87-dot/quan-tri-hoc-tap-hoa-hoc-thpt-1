import React, { useState } from 'react';

interface PerformanceData {
  name: string;
  count: number;
  percentage: number;
  color: string;
  bgLight: string;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  totalStudents: number;
}

export const PerformanceDonutChart: React.FC<PerformanceChartProps> = ({ data, totalStudents }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4">
      {/* Donut graphic */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += item.percentage;

            const isHovered = hoveredIndex === idx;

            return (
              <circle
                key={item.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {hoveredIndex !== null ? (
            <>
              <span className="text-2xl font-bold text-slate-900">
                {data[hoveredIndex].count}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {data[hoveredIndex].name} ({data[hoveredIndex].percentage}%)
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalStudents}
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Học sinh
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-2.5">
        {data.map((item, idx) => (
          <div
            key={item.name}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
              hoveredIndex === idx ? 'bg-slate-100/80 font-semibold' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-700">{item.name}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-900">{item.count} em</span>
              <span className="text-xs text-slate-500">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
