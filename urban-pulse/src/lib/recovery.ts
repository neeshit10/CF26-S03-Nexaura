import { ServiceNode, CityGraph, RecoveryStrategy } from '@/types';

export function basicRecoveryStrategy(
  graph: CityGraph,
  failedServices: string[]
): RecoveryStrategy {
  const failedNodes = graph.nodes.filter(n => failedServices.includes(n.id));
  const order = failedNodes
    .sort((a, b) => a.recoveryTime - b.recoveryTime)
    .map(n => n.id);

  return {
    name: 'Basic Recovery (Fastest First)',
    order,
  };
}

export function criticalityAwareRecoveryStrategy(
  graph: CityGraph,
  failedServices: string[]
): RecoveryStrategy {
  const failedNodes = graph.nodes.filter(n => failedServices.includes(n.id));

  const scoredNodes = failedNodes.map(node => {
    const downstreamCount = countDownstreamDependents(graph, node.id);
    const criticalityScore = node.criticality;
    const dependencyScore = downstreamCount * 2;
    const recoveryCost = node.recoveryTime;
    const benefitScore = criticalityScore + dependencyScore;
    const efficiencyScore = benefitScore / Math.max(1, recoveryCost / 30);

    return {
      node,
      score: efficiencyScore,
      criticality: criticalityScore,
      downstreamCount,
      recoveryTime: recoveryCost,
    };
  });

  scoredNodes.sort((a, b) => b.score - a.score);

  return {
    name: 'Criticality-Aware Recovery',
    order: scoredNodes.map(s => s.node.id),
  };
}

function countDownstreamDependents(graph: CityGraph, nodeId: string, visited = new Set<string>()): number {
  if (visited.has(nodeId)) return 0;
  visited.add(nodeId);

  const edges = graph.edges.filter(e => e.source === nodeId);
  let count = edges.length;

  for (const edge of edges) {
    count += countDownstreamDependents(graph, edge.target, visited);
  }

  return count;
}

export function explainStrategyScores(
  graph: CityGraph,
  failedServices: string[]
): Array<{
  serviceId: string;
  serviceName: string;
  criticality: number;
  downstreamCount: number;
  recoveryTime: number;
  benefitScore: number;
  efficiencyScore: number;
}> {
  const failedNodes = graph.nodes.filter(n => failedServices.includes(n.id));

  return failedNodes.map(node => {
    const downstreamCount = countDownstreamDependents(graph, node.id);
    const criticalityScore = node.criticality;
    const dependencyScore = downstreamCount * 2;
    const recoveryCost = node.recoveryTime;
    const benefitScore = criticalityScore + dependencyScore;
    const efficiencyScore = benefitScore / Math.max(1, recoveryCost / 30);

    return {
      serviceId: node.id,
      serviceName: node.name,
      criticality: criticalityScore,
      downstreamCount,
      recoveryTime: recoveryCost,
      benefitScore,
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
    };
  }).sort((a, b) => b.efficiencyScore - a.efficiencyScore);
}