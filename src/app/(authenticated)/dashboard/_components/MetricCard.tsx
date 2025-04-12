import { Eye, EyeOff } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  isBlurred?: boolean;
  showEyeIcon?: boolean;
  onToggleBlur?: () => void;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, subValue, isBlurred, showEyeIcon, onToggleBlur, trend }: MetricCardProps) {
  return (
    <div className="flex flex-1 flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {showEyeIcon && (
          <div className="cursor-pointer text-gray-400" onClick={onToggleBlur}>
            {isBlurred ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        )}
      </div>
      <div className={`mt-2 ${isBlurred ? 'blur-md' : ''}`}>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {subValue && (
          <p className="text-sm text-gray-600">{subValue}</p>
        )}
      </div>
      {trend && (
        <div className="mt-2">
          <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
        </div>
      )}
    </div>
  );
} 