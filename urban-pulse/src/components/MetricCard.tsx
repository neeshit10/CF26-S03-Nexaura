'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: 'green' | 'yellow' | 'red' | 'blue';
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend = 'neutral',
  icon,
  color = 'blue',
}: MetricCardProps) {
  const colorStyles = {
    green: 'bg-green-50 border-green-200 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500',
  };

  return (
    <div className={`rounded-xl border p-5 transition-all hover:shadow-md ${colorStyles[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`flex items-center gap-2 ${iconColors[color]}`}>
          {icon && <span className="text-2xl">{icon}</span>}
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {trendIcons[trend]}
          </span>
        </div>
      </div>
    </div>
  );
}