'use client';

import { useState, useCallback } from 'react';
import { ServiceNode } from '@/types';
import { CityGraphView } from '@/components/CityGraphView';
import { MetricCard } from '@/components/MetricCard';
import { Timeline } from '@/components/Timeline';
import { NodeDetailPanel } from '@/components/NodeDetailPanel';
import { ExperimentComparison } from '@/components/ExperimentComparison';
import { useUrbanPulse } from '@/hooks/useUrbanPulse';
import { basicRecoveryStrategy, criticalityAwareRecoveryStrategy } from '@/lib/recovery';

export default function Dashboard() {
  const {
    graph,
    simulationResult,
    recoveryResult,
    experimentResults,
    selectedNode,
    setSelectedNode,
    simulationTime,
    isSimulating,
    failService,
    failMultipleServices,
    recoverService,
    runRecoveryStrategy,
    runExperimentComparison,
    reset,
    metrics,
    getStrategyExplanations,
  } = useUrbanPulse();

  const [activeTab, setActiveTab] = useState<'timeline' | 'experiment' | 'strategies'>('timeline');
  const [multiSelect, setMultiSelect] = useState<string[]>([]);

  const handleNodeClick = useCallback(
    (node: ServiceNode) => {
      setSelectedNode(node);
      setMultiSelect([]);
    },
    [setSelectedNode]
  );

  const handleFailSelected = useCallback(() => {
    if (multiSelect.length > 0) {
      failMultipleServices(multiSelect);
      setMultiSelect([]);
    } else if (selectedNode) {
      failService(selectedNode.id);
    }
  }, [multiSelect, selectedNode, failService, failMultipleServices]);

  const handleRecoverSelected = useCallback(() => {
    if (selectedNode) {
      recoverService(selectedNode.id);
    }
  }, [selectedNode, recoverService]);

  const handleBasicRecovery = useCallback(() => {
    if (!simulationResult) return;
    const affected = Array.from(simulationResult.finalStates.entries())
      .filter(([, state]) => state !== 'healthy')
      .map(([id]) => id);
    if (affected.length === 0) return;
    const strategy = basicRecoveryStrategy(graph, affected);
    runRecoveryStrategy(strategy);
  }, [simulationResult, graph, runRecoveryStrategy]);

  const handleCriticalityRecovery = useCallback(() => {
    if (!simulationResult) return;
    const affected = Array.from(simulationResult.finalStates.entries())
      .filter(([, state]) => state !== 'healthy')
      .map(([id]) => id);
    if (affected.length === 0) return;
    const strategy = criticalityAwareRecoveryStrategy(graph, affected);
    runRecoveryStrategy(strategy);
  }, [simulationResult, graph, runRecoveryStrategy]);

  const events = simulationResult?.events ?? [];
  const allEvents = recoveryResult ? [...events, ...recoveryResult.events] : events;

  const liveNode = selectedNode
    ? graph.nodes.find((n) => n.id === selectedNode.id) ?? selectedNode
    : null;

  const totalServices = graph.nodes.length;
  const healthyCount = graph.nodes.filter((n) => n.status === 'healthy').length;
  const degradedCount = graph.nodes.filter((n) => n.status === 'degraded').length;
  const failedCount = graph.nodes.filter((n) => n.status === 'failed').length;
  const healthPercentage = Math.round((healthyCount / totalServices) * 100);

  const displayMetrics = metrics ?? {
    totalServices,
    healthyCount,
    degradedCount,
    failedCount,
    affectedCount: 0,
    cascadeDepth: 0,
    activeIncidents: 0,
    recoveryTime: 0,
    healthPercentage,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600">
                <span className="text-2xl">🌆</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">UrbanPulse</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                CodeForge 2026 — S-03
              </span>
            </div>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              Reset Simulation
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard
            title="City Health"
            value={`${displayMetrics.healthPercentage}%`}
            subtitle={`${displayMetrics.healthyCount}/${displayMetrics.totalServices} healthy`}
            color={displayMetrics.healthPercentage > 70 ? 'green' : displayMetrics.healthPercentage > 40 ? 'yellow' : 'red'}
            icon="🏙️"
          />
          <MetricCard
            title="Active Incidents"
            value={displayMetrics.activeIncidents}
            subtitle={`${displayMetrics.degradedCount} degraded, ${displayMetrics.failedCount} failed`}
            color={displayMetrics.activeIncidents > 0 ? 'red' : 'green'}
            icon="🚨"
          />
          <MetricCard
            title="Affected Services"
            value={displayMetrics.affectedCount}
            subtitle="Impacted by cascade"
            color={displayMetrics.affectedCount > 3 ? 'red' : displayMetrics.affectedCount > 0 ? 'yellow' : 'green'}
            icon="📊"
          />
          <MetricCard
            title="Cascade Depth"
            value={displayMetrics.cascadeDepth}
            subtitle="Propagation levels"
            color={displayMetrics.cascadeDepth > 3 ? 'red' : displayMetrics.cascadeDepth > 1 ? 'yellow' : 'green'}
            icon="🔗"
          />
          <MetricCard
            title="Recovery Time"
            value={`${displayMetrics.recoveryTime} min`}
            subtitle="Estimated total"
            color={displayMetrics.recoveryTime > 180 ? 'red' : displayMetrics.recoveryTime > 0 ? 'yellow' : 'green'}
            icon="⏱️"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Infrastructure Graph</h2>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>Healthy
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500"></span>Degraded
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500"></span>Failed
                  </span>
                </div>
              </div>
              <CityGraphView
                nodes={graph.nodes}
                edges={graph.edges}
                onNodeClick={handleNodeClick}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Service Details</h2>
              <NodeDetailPanel
                node={liveNode}
                onFail={failService}
                onRecover={recoverService}
                currentStatus={liveNode?.status ?? 'healthy'}
              />
            </div>

            {multiSelect.length > 0 && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  {multiSelect.length} selected
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleFailSelected}
                    className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Fail All
                  </button>
                  <button
                    onClick={() => setMultiSelect([])}
                    className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">Simulation Controls</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Selected Service
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleFailSelected}
                      disabled={!liveNode || liveNode.status === 'failed'}
                      className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Fail Service
                    </button>
                    <button
                      onClick={handleRecoverSelected}
                      disabled={!liveNode || liveNode.status === 'healthy'}
                      className="flex-1 px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm font-medium hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Recover Service
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Recovery Strategies
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleBasicRecovery}
                      disabled={!simulationResult}
                      className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-left"
                    >
                      Basic Recovery (Fastest First)
                    </button>
                    <button
                      onClick={handleCriticalityRecovery}
                      disabled={!simulationResult}
                      className="px-3 py-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-sm font-medium hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-left"
                    >
                      Criticality-Aware Recovery
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Events & Analysis</h2>
            <div className="flex gap-1">
              {(['timeline', 'experiment', 'strategies'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'strategies' ? 'Strategy Details' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            {activeTab === 'timeline' && (
              <Timeline events={allEvents} currentTime={simulationTime} />
            )}
            {activeTab === 'experiment' && (
              <ExperimentComparison
                basic={experimentResults?.basic ?? null}
                criticalityAware={experimentResults?.criticalityAware ?? null}
                onRunExperiment={runExperimentComparison}
                isRunning={isSimulating}
              />
            )}
            {activeTab === 'strategies' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Criticality-Aware score:{' '}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    (Criticality + 2 × Downstream) ÷ (RecoveryTime / 30)
                  </code>
                </p>
                {getStrategyExplanations().length === 0 ? (
                  <p className="text-sm text-gray-400">Trigger a failure to see scores.</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {getStrategyExplanations().map((s) => (
                      <div key={s.serviceId} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm text-gray-900">{s.serviceName}</span>
                          <span className="text-sm font-bold text-purple-600">
                            {s.efficiencyScore}
                          </span>
                        </div>
                        <div className="flex gap-3 text-xs text-gray-500">
                          <span>Criticality: {s.criticality}</span>
                          <span>Downstream: {s.downstreamCount}</span>
                          <span>Recovery: {s.recoveryTime} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
