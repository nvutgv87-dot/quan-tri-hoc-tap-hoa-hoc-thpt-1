import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'blue' | 'indigo' | 'emerald' | 'amber';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'blue',
  onClick
}) => {
  const colorMap = {
    blue: {
      bgIcon: 'bg-blue-50 text-blue-700 border-blue-200',
      border: 'border-slate-200 hover:border-blue-300'
    },
    indigo: {
      bgIcon: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      border: 'border-slate-200 hover:border-indigo-300'
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      border: 'border-slate-200 hover:border-emerald-300'
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-700 border-amber-200',
      border: 'border-slate-200 hover:border-amber-300'
    }
  };

  const styling = colorMap[accentColor];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 transition-all duration-150 ${styling.border} ${
        onClick ? 'cursor-pointer shadow-xs hover:shadow-md' : 'shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg border ${styling.bgIcon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      <p className="mt-1 text-sm text-slate-600 font-medium">
        {subtitle}
      </p>
    </div>
  );
};
