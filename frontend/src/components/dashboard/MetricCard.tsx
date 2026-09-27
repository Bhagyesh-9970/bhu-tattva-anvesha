import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  colorClass?: string;
  confidence?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  colorClass = 'text-cyan-400',
  confidence,
}) => {
  return (
    <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-4 shadow-sm hover:border-scientific-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-scientific-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 bg-scientific-800 rounded-md border border-scientific-700/50">
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
      </div>
      <div className="flex items-baseline space-x-1.5">
        <span className="text-2xl font-bold font-mono text-white">{value}</span>
        {unit && <span className="text-xs font-semibold text-scientific-400">{unit}</span>}
      </div>
      {(subtitle || confidence !== undefined) && (
        <div className="mt-2 pt-2 border-t border-scientific-800/60 flex items-center justify-between text-[11px] text-scientific-400">
          <span>{subtitle}</span>
          {confidence !== undefined && (
            <span className="font-mono text-emerald-400">Conf: {(confidence * 100).toFixed(0)}%</span>
          )}
        </div>
      )}
    </div>
  );
};
