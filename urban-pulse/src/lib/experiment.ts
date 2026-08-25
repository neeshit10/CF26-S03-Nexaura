import { CityGraph, ExperimentResult, SimulationResult } from '@/types';
import { runSimulation, runRecovery, calculateRecoveryTime } from './simulation';
import { basicRecoveryStrategy, criticalityAwareRecoveryStrategy } from './recovery';

export interface ExperimentConfig {
  graph: CityGraph;
  initialFailures: string[];
}

export function runExperiment(config: ExperimentConfig): {
  basic: ExperimentResult;
  criticalityAware: ExperimentResult;
  basicDetails: SimulationResult;
  criticalityAwareDetails: SimulationResult;
} {
  const failureResult = runSimulation(config.graph, config.initialFailures);

  const basicStrategy = basicRecoveryStrategy(config.graph, config.initialFailures);
  const basicRecoveryResult = runRecovery(
    config.graph,
    basicStrategy.order,
    failureResult.finalStates
  );
  const basicRecoveryTime = calculateRecoveryTime(
    config.graph,
    basicStrategy.order,
    failureResult.finalStates
  );

  const criticalityStrategy = criticalityAwareRecoveryStrategy(config.graph, config.initialFailures);
  const criticalityRecoveryResult = runRecovery(
    config.graph,
    criticalityStrategy.order,
    failureResult.finalStates
  );
  const criticalityRecoveryTime = calculateRecoveryTime(
    config.graph,
    criticalityStrategy.order,
    failureResult.finalStates
  );

  return {
    basic: {
      strategyName: basicStrategy.name,
      affectedServiceCount: basicRecoveryResult.affectedServiceIds.length,
      cascadeDepth: basicRecoveryResult.cascadeDepth,
      estimatedRecoveryTime: basicRecoveryTime,
    },
    criticalityAware: {
      strategyName: criticalityStrategy.name,
      affectedServiceCount: criticalityRecoveryResult.affectedServiceIds.length,
      cascadeDepth: criticalityRecoveryResult.cascadeDepth,
      estimatedRecoveryTime: criticalityRecoveryTime,
    },
    basicDetails: basicRecoveryResult,
    criticalityAwareDetails: criticalityRecoveryResult,
  };
}

export function formatExperimentConclusion(results: {
  basic: ExperimentResult;
  criticalityAware: ExperimentResult;
}): string {
  const { basic, criticalityAware } = results;

  const affectedDiff = basic.affectedServiceCount - criticalityAware.affectedServiceCount;
  const depthDiff = basic.cascadeDepth - criticalityAware.cascadeDepth;
  const timeDiff = basic.estimatedRecoveryTime - criticalityAware.estimatedRecoveryTime;

  let conclusion = 'Experiment Results:\n\n';

  if (affectedDiff > 0) {
    conclusion += `✓ Criticality-aware recovery reduced affected services by ${affectedDiff}.\n`;
  } else if (affectedDiff < 0) {
    conclusion += `✗ Basic recovery affected ${Math.abs(affectedDiff)} fewer services.\n`;
  } else {
    conclusion += `→ Both strategies affected the same number of services.\n`;
  }

  if (depthDiff > 0) {
    conclusion += `✓ Criticality-aware recovery reduced cascade depth by ${depthDiff}.\n`;
  } else if (depthDiff < 0) {
    conclusion += `✗ Basic recovery had ${Math.abs(depthDiff)} less cascade depth.\n`;
  } else {
    conclusion += `→ Both strategies had the same cascade depth.\n`;
  }

  if (timeDiff > 0) {
    conclusion += `✓ Criticality-aware recovery saved ${timeDiff} minutes estimated recovery time.\n`;
  } else if (timeDiff < 0) {
    conclusion += `✗ Basic recovery was ${Math.abs(timeDiff)} minutes faster.\n`;
  } else {
    conclusion += `→ Both strategies had the same estimated recovery time.\n`;
  }

  conclusion += '\nLimitations:\n';
  conclusion += '- This is a deterministic simulation with simplified propagation rules.\n';
  conclusion += '- Real-world systems have stochastic elements, partial failures, and human factors.\n';
  conclusion += '- The model assumes instantaneous recovery actions and perfect coordination.\n';
  conclusion += '- Results are specific to this graph topology and failure scenario.\n';

  return conclusion;
}