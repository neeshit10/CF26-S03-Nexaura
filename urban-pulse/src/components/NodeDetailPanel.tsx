'use client';

import { ServiceNode, ServiceStatus } from '@/types';

interface NodeDetailPanelProps {
  node: ServiceNode | null;
  onFail: (id: string) => void;
  onRecover: (id: string) => void;
  currentStatus: ServiceStatus;
}

const statusColors: Record<ServiceStatus, { bg: string; text: string; border: string }> = {
  healthy: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  degraded: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  failed: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
};

const categoryIcons: Record<string, string> = {
  power: '⚡',
  telecom: '📡',
  traffic: '🚦',
  water: '💧',
  hospital: '🏥',
  emergency: '🚨',
  fire: '🔥',
  police: '👮',
  transport: '🚌',
  datacenter: '💾',
};

export function NodeDetailPanel({
  node,
  onFail,
  onRecover,
  currentStatus,
}: NodeDetailPanelProps) {
  if (!node) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>Click a service node to view details</p>
      </div>
    );
  }

  const colors = statusColors[currentStatus];
  const icon = categoryIcons[node.category] || '🏢';

  return (
    <div className="flex-1 flex flex-col space-y-4">
      <div className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{node.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{node.category}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${colors.text} ${colors.bg.replace('50', '100')}`}
          >
            {currentStatus.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500">
            Criticality: <span className="font-medium text-gray-900">{node.criticality}/10</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-gray-50">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Capacity</p>
          <p className="text-xl font-bold text-gray-900">{node.capacity}%</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Recovery Time</p>
          <p className="text-xl font-bold text-gray-900">{node.recoveryTime} min</p>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Actions</h4>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onFail(node.id)}
            disabled={currentStatus === 'failed'}
            className="px-4 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 font-medium hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Fail Service
          </button>
          <button
            onClick={() => onRecover(node.id)}
            disabled={currentStatus === 'healthy'}
            className="px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 font-medium hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Recover Service
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Dependencies</h4>
        <p className="text-sm text-gray-500">
          This service depends on upstream providers and provides critical
          infrastructure to downstream consumers. Failure will propagate
          based on dependency strength and propagation delay.
        </p>
      </div>
    </div>
  );
}