import React, { useState } from 'react';

interface TrendPoint {
  period: string;
  score: number;
  label?: string;
}

interface ScoreTrendLineChartProps {
  data: TrendPoint[];
  targetScore?: number;
}

export const ScoreTrendLineChart: React.FC<ScoreTrendLineChartProps> = ({
  data,
  targetScore = 7.5
}) => {
  const [activePoint, setActivePoint] = useState<TrendPoint | null>(null);

  const width = 540;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minScore = 5.0;
  const maxScore = 9.0;

  const getY = (val: number) => {
    const clamped = Math.max(minScore, Math.min(maxScore, val));
    return paddingTop + chartHeight - ((clamped - minScore) / (maxScore - minScore)) * chartHeight;
  };

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  // Generate SVG path for line and area fill
  const points = data.map((d, i) => `${getX(i)},${getY(d.score)}`);
  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const areaD = points.length > 0
    ? `M ${getX(0)},${paddingTop + chartHeight} L ${points.join(' L ')} L ${getX(data.length - 1)},${paddingTop + chartHeight} Z`
    : '';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 select-none"
          style={{ minWidth: '380px' }}
        >
          <defs>
            <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[5.0, 6.0, 7.0, 8.0, 9.0].map((scoreLevel) => {
            const y = getY(scoreLevel);
            return (
              <g key={scoreLevel}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  {scoreLevel.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Target benchmark reference line */}
          <line
            x1={paddingLeft}
            y1={getY(targetScore)}
            x2={width - paddingRight}
            y2={getY(targetScore)}
            stroke="#10b981"
            strokeDasharray="2 2"
            strokeWidth="1.5"
          />
          <text
            x={width - paddingRight}
            y={getY(targetScore) - 6}
            textAnchor="end"
            className="text-[10px] fill-emerald-600 font-semibold"
          >
            Mục tiêu: {targetScore}
          </text>

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#scoreAreaGradient)" />}

          {/* Main trend line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data nodes */}
          {data.map((item, index) => {
            const cx = getX(index);
            const cy = getY(item.score);
            const isHovered = activePoint?.period === item.period;

            return (
              <g
                key={item.period}
                className="cursor-pointer group"
                onMouseEnter={() => setActivePoint(item)}
                onMouseLeave={() => setActivePoint(null)}
              >
                {/* Invisible hover target */}
                <circle cx={cx} cy={cy} r="16" fill="transparent" />

                {/* Visible dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? "7" : "5"}
                  fill="#ffffff"
                  stroke="#1d4ed8"
                  strokeWidth={isHovered ? "3.5" : "2.5"}
                  className="transition-all duration-150"
                />

                {/* Score value floating pill */}
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  className={`text-[12px] font-bold fill-blue-900 ${isHovered ? 'opacity-100 font-extrabold text-[13px]' : 'opacity-90'}`}
                >
                  {item.score.toFixed(1)}
                </text>

                {/* X Axis label */}
                <text
                  x={cx}
                  y={height - 15}
                  textAnchor="middle"
                  className={`text-[11px] ${
                    isHovered ? 'fill-blue-700 font-bold' : 'fill-slate-600 font-medium'
                  }`}
                >
                  {item.period}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between w-full px-4 pt-2 text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-blue-600 rounded-full" />
          <span>Điểm trung bình thực tế toàn khối</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 border-b-2 border-emerald-500 border-dashed" />
          <span>Chỉ tiêu nhà trường ({targetScore} điểm)</span>
        </div>
      </div>
    </div>
  );
};
