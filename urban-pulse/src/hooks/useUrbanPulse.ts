'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  CityGraph,
  ServiceNode,
  ServiceStatus,
  SimulationResult,
  RecoveryStrategy,
  ExperimentResult,
} from '@/types';
import { getInitialGraph } from '@/data/city';
import { runSimulation, runRecovery, calculateRecoveryTime } from '@/lib/simulation';
import { basicRecoveryStrategy, criticalityAwareRecoveryStrategy, explainStrategyScores } from '@/lib/recovery';
import { runExperiment } from '@/lib/experiment';

function applyStatesToGraph(graph: CityGraph, states: Map<string, ServiceStatus>): CityGraph {
  return {
    ...graph,
    nodes: graph.nodes.map((n) => {
      const s = states.get(n.id);
      return s !== undefined ? { ...n, status: s } : n;
    }),
  };
}

export function useUrbanPulse() {
  const [graph, setGraph] = useState<CityGraph>(() => getInitialGraph());
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [recoveryResult, setRecoveryResult] = useState<SimulationResult | null>(null);
  const [initialFailures, setInitialFailures] = useState<string[]>([]);
  const [experimentResults, setExperimentResults] = useState<{
    basic: ExperimentResult;
    criticalityAware: ExperimentResult;
  } | null>(null);
  const [selectedNode, setSelectedNode] = useState<ServiceNode | null>(null);
  const [simulationTime, setSimulationTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const failService = useCallback((serviceId: string) => {
    setGraph((prev) => {
      const baseGraph = {
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.id === serviceId ? { ...n, status: 'failed' as ServiceStatus } : n
        ),
      };
      const result = runSimulation(baseGraph, [serviceId]);
      setSimulationResult(result);
      setRecoveryResult(null);
      setExperimentResults(null);
      setInitialFailures([serviceId]);
      return applyStatesToGraph(baseGraph, result.finalStates);
    });
  }, []);

  const failMultipleServices = useCallback((serviceIds: string[]) => {
    setGraph((prev) => {
      const baseGraph = {
        ...prev,
        nodes: prev.nodes.map((n) =>
          serviceIds.includes(n.id) ? { ...n, status: 'failed' as ServiceStatus } : n
        ),
      };
      const result = runSimulation(baseGraph, serviceIds);
      setSimulationResult(result);
      setRecoveryResult(null);
      setExperimentResults(null);
      setInitialFailures(serviceIds);
      return applyStatesToGraph(baseGraph, result.finalStates);
    });
  }, []);

  const recoverService = useCallback(
    (serviceId: string) => {
      setGraph((prev) => {
        const currentStates: Map<string, ServiceStatus> = new Map(
          prev.nodes.map((n) => [n.id, n.status])
        );
        const result = runRecovery(prev, [serviceId], currentStates);
        setRecoveryResult(result);
        setSimulationResult((prevSim) =>
          prevSim
            ? {
                ...prevSim,
                finalStates: result.finalStates,
                events: [...prevSim.events, ...result.events],
                affectedServiceIds: result.affectedServiceIds,
                cascadeDepth: result.cascadeDepth,
              }
            : result
        );
        return applyStatesToGraph(prev, result.finalStates);
      });
    },
    []
  );

  const runRecoveryStrategy = useCallback((strategy: RecoveryStrategy) => {
    setGraph((prev) => {
      const currentStates: Map<string, ServiceStatus> = new Map(
        prev.nodes.map((n) => [n.id, n.status])
      );
      const result = runRecovery(prev, strategy.order, currentStates);
      setRecoveryResult(result);
      setSimulationResult((prevSim) =>
        prevSim
          ? {
              ...prevSim,
              finalStates: result.finalStates,
              events: [...prevSim.events, ...result.events],
              affectedServiceIds: result.affectedServiceIds,
              cascadeDepth: result.cascadeDepth,
            }
          : result
      );
      return applyStatesToGraph(prev, result.finalStates);
    });
  }, []);

  const runExperimentComparison = useCallback(() => {
    if (initialFailures.length === 0) return;

    const results = runExperiment({
      graph: getInitialGraph(),
      initialFailures,
    });

    setExperimentResults({
      basic: results.basic,
      criticalityAware: results.criticalityAware,
    });
  }, [initialFailures]);

  const reset = useCallback(() => {
    setGraph(getInitialGraph());
    setSimulationResult(null);
    setRecoveryResult(null);
    setExperimentResults(null);
    setInitialFailures([]);
    setSelectedNode(null);
    setSimulationTime(0);
    setIsSimulating(false);
  }, []);

  const metrics = useMemo(() => {
    const totalServices = graph.nodes.length;
    const healthyCount = graph.nodes.filter((n) => n.status === 'healthy').length;
    const degradedCount = graph.nodes.filter((n) => n.status === 'degraded').length;
    const failedCount = graph.nodes.filter((n) => n.status === 'failed').length;
    const affectedCount = simulationResult?.affectedServiceIds.length ?? 0;
    const cascadeDepth = simulationResult?.cascadeDepth ?? 0;
    const activeIncidents = degradedCount + failedCount;

    let recoveryTime = 0;
    if (simulationResult) {
      const stillAffected = Array.from(simulationResult.finalStates.entries())
        .filter(([, state]) => state !== 'healthy')
        .map(([id]) => id);
      recoveryTime = calculateRecoveryTime(graph, stillAffected, simulationResult.finalStates);
    }

    return {
      totalServices,
      healthyCount,
      degradedCount,
      failedCount,
      affectedCount,
      cascadeDepth,
      activeIncidents,
      recoveryTime,
      healthPercentage: Math.round((healthyCount / totalServices) * 100),
    };
  }, [graph, simulationResult, recoveryResult]);

  const getStrategyExplanations = useCallback(() => {
    const failedServices = graph.nodes
      .filter((n) => n.status !== 'healthy')
      .map((n) => n.id);
    if (failedServices.length === 0) return [];
    return explainStrategyScores(graph, failedServices);
  }, [graph]);

  return {
    graph,
    simulationResult,
    recoveryResult,
    experimentResults,
    selectedNode,
    setSelectedNode,
    simulationTime,
    setSimulationTime,
    isSimulating,
    setIsSimulating,
    failService,
    failMultipleServices,
    recoverService,
    runRecoveryStrategy,
    runExperimentComparison,
    reset,
    metrics,
    getStrategyExplanations,
  };
}
