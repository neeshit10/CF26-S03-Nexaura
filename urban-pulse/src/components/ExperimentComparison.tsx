'use client';

import { ExperimentResult } from '@/types';

interface ExperimentComparisonProps {
  basic: ExperimentResult | null;
  criticalityAware: ExperimentResult | null;
  onRunExperiment: () => void;
  isRunning: boolean;
}

export function ExperimentComparison({
  basic,
  criticalityAware,
  onRunExperiment,
  isRunning,
}: ExperimentComparisonProps) {
  if (!basic && !criticalityAware) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recovery Strategy Comparison</h3>
        <p className="text-gray-500 mb-4">
          Run a simulation with failures, then click "Run Experiment" to compare
          basic vs criticality-aware recovery strategies.
        </p>
        <button
          onClick={onRunExperiment}
          disabled={isRunning}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isRunning ? 'Running...' : 'Run Experiment'}
        </button>
      </div>
    );
  }

  const b = basic!;
  const c = criticalityAware!;

  const affectedDiff = b.affectedServiceCount - c.affectedServiceCount;
  const depthDiff = b.cascadeDepth - c.cascadeDepth;
  const timeDiff = b.estimatedRecoveryTime - c.estimatedRecoveryTime;

  const getDiffBadge = (diff: number, label: string) => {
    if (diff > 0) return <span className="text-green-600 font-medium">↓ {diff} {label}</span>;
    if (diff < 0) return <span className="text-red-600 font-medium">↑ {Math.abs(diff)} {label}</span>;
    return <span className="text-gray-500">No change</span>;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recovery Strategy Comparison</h3>
        <button
          onClick={onRunExperiment}
          disabled={isRunning}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isRunning ? 'Running...' : 'Re-run Experiment'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Metric</h4>
          <div className="space-y-3 text-sm">
            <div className="font-medium text-gray-900">Affected Services</div>
            <div className="font-medium text-gray-900">Cascade Depth</div>
            <div className="font-medium text-gray-900">Est. Recovery Time</div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">{b.strategyName}</h4>
          <div className="space-y-3 text-sm">
            <div className="text-blue-900 font-semibold">{b.affectedServiceCount}</div>
            <div className="text-blue-900 font-semibold">{b.cascadeDepth}</div>
            <div className="text-blue-900 font-semibold">{b.estimatedRecoveryTime} min</div>
          </div>
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h4 className="text-sm font-medium text-purple-800 mb-2">{c.strategyName}</h4>
          <div className="space-y-3 text-sm">
            <div className="text-purple-900 font-semibold">{c.affectedServiceCount}</div>
            <div className="text-purple-900 font-semibold">{c.cascadeDepth}</div>
            <div className="text-purple-900 font-semibold">{c.estimatedRecoveryTime} min</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Difference (Criticality-Aware vs Basic)</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 rounded-lg bg-white">
            <p className="text-gray-500">Affected Services</p>
            <p className="font-semibold">{getDiffBadge(affectedDiff, 'services')}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white">
            <p className="text-gray-500">Cascade Depth</p>
            <p className="font-semibold">{getDiffBadge(depthDiff, 'levels')}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white">
            <p className="text-gray-500">Recovery Time</p>
            <p className="font-semibold">{getDiffBadge(timeDiff, 'min')}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
        <h4 className="text-sm font-medium text-amber-800 mb-2">Limitations</h4>
        <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
          <li>Deterministic model with simplified propagation rules</li>
          <li>Assumes instantaneous coordination and perfect information</li>
          <li>Results specific to this graph topology and failure scenario</li>
          <li>No stochastic elements, partial failures, or human factors</li>
        </ul>
      </div>
    </div>
  );
}