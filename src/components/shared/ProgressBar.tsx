import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'blue' | 'violet' | 'green' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const colorMap = {
  blue: 'from-blue-500 to-blue-400',
  violet: 'from-violet-500 to-violet-400',
  green: 'from-emerald-500 to-emerald-400',
  amber: 'from-amber-500 to-amber-400',
};

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'blue',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-zinc-400">Прогресс</span>
          <span className="text-xs font-semibold text-zinc-300">{value}%</span>
        </div>
      )}
      <div className={`w-full ${sizeMap[size]} rounded-full bg-zinc-800 overflow-hidden`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} progress-bar-fill transition-all duration-700`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
