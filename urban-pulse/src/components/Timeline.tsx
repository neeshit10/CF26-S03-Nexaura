'use client';

import { SimulationEvent } from '@/types';

interface TimelineProps {
  events: SimulationEvent[];
  currentTime?: number;
}

export function Timeline({ events, currentTime = 0 }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-center py-8 text-gray-500">
          <p className="font-medium">No simulation events yet</p>
          <p className="text-sm mt-1">Trigger a failure to see cascade events</p>
        </div>
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => a.time - b.time);

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
      {sortedEvents.map((event, index) => {
        const isInitial = event.cause === 'Initial failure';
        const isRecovery = event.newState === 'healthy' && event.previousState !== 'healthy';
        const isDegradation = event.newState === 'degraded';

        let statusColor = 'text-gray-600';
        let bgColor = 'bg-gray-50';
        let borderColor = 'border-gray-200';
        let icon = '●';

        if (isInitial) {
          statusColor = 'text-red-700';
          bgColor = 'bg-red-50';
          borderColor = 'border-red-200';
          icon = '✗';
        } else if (isRecovery) {
          statusColor = 'text-green-700';
          bgColor = 'bg-green-50';
          borderColor = 'border-green-200';
          icon = '✓';
        } else if (isDegradation) {
          statusColor = 'text-yellow-700';
          bgColor = 'bg-yellow-50';
          borderColor = 'border-yellow-200';
          icon = '⚠';
        } else {
          statusColor = 'text-red-700';
          bgColor = 'bg-red-50';
          borderColor = 'border-red-200';
          icon = '✗';
        }

        const minutes = Math.floor(event.time / 60);
        const seconds = event.time % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return (
          <div
            key={`${event.serviceId}-${event.time}-${index}`}
            className={`flex gap-3 p-3 rounded-lg border ${bgColor} ${borderColor} transition-all hover:shadow-sm`}
          >
            <div className="flex-shrink-0 w-10 text-right text-xs text-gray-400 font-mono">
              {timeStr}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-lg ${statusColor}`}>{icon}</span>
                <span className="font-medium text-gray-900">{event.serviceName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                  {event.previousState} → {event.newState}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 ml-6">
                Cause: {event.cause}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}