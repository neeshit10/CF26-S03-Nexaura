import { ServiceNode, DependencyEdge, SimulationEvent, SimulationResult, ServiceStatus, CityGraph } from '@/types';

function cloneGraph(graph: CityGraph): CityGraph {
  return {
    nodes: graph.nodes.map(n => ({ ...n })),
    edges: graph.edges.map(e => ({ ...e })),
  };
}

function getNode(graph: CityGraph, id: string): ServiceNode | undefined {
  return graph.nodes.find(n => n.id === id);
}

function getDownstreamEdges(graph: CityGraph, sourceId: string): DependencyEdge[] {
  return graph.edges.filter(e => e.source === sourceId);
}

function calculateNewState(
  sourceState: ServiceStatus,
  edge: DependencyEdge,
  targetNode: ServiceNode
): ServiceStatus {
  if (sourceState === 'healthy') return 'healthy';

  const impactFactor = edge.dependencyStrength;

  if (sourceState === 'failed') {
    if (impactFactor >= 0.9) return 'failed';
    if (impactFactor >= 0.6) return 'degraded';
    return 'healthy';
  }

  if (sourceState === 'degraded') {
    if (impactFactor >= 0.8) return 'degraded';
    return 'healthy';
  }

  return 'healthy';
}

function statePriority(state: ServiceStatus): number {
  switch (state) {
    case 'failed': return 3;
    case 'degraded': return 2;
    case 'healthy': return 1;
  }
}

export function runSimulation(
  graph: CityGraph,
  initialFailures: string[],
  maxSteps: number = 50
): SimulationResult {
  const workingGraph = cloneGraph(graph);
  const events: SimulationEvent[] = [];
  let simulationTime = 0;
  let cascadeDepth = 0;
  const affectedServiceIds = new Set<string>();

  for (const failureId of initialFailures) {
    const node = getNode(workingGraph, failureId);
    if (node && node.status === 'healthy') {
      node.status = 'failed';
      affectedServiceIds.add(failureId);
      events.push({
        time: simulationTime,
        serviceId: failureId,
        serviceName: node.name,
        previousState: 'healthy',
        newState: 'failed',
        cause: 'Initial failure',
      });
    }
  }

  let step = 0;
  let hasChanges = true;
  const visited = new Map<string, number>();

  while (hasChanges && step < maxSteps) {
    hasChanges = false;
    step++;
    simulationTime++;

    const nodesToCheck = workingGraph.nodes.filter(
      n => n.status === 'failed' || n.status === 'degraded'
    );

    for (const sourceNode of nodesToCheck) {
      const depth = visited.get(sourceNode.id) ?? 0;
      const downstreamEdges = getDownstreamEdges(workingGraph, sourceNode.id);

      for (const edge of downstreamEdges) {
        const targetNode = getNode(workingGraph, edge.target);
        if (!targetNode) continue;

        const newState = calculateNewState(sourceNode.status, edge, targetNode);
        const currentPriority = statePriority(targetNode.status);
        const newPriority = statePriority(newState);

        if (newPriority > currentPriority) {
          const previousState = targetNode.status;
          targetNode.status = newState;

          if (!affectedServiceIds.has(targetNode.id)) {
            affectedServiceIds.add(targetNode.id);
          }

          const newDepth = depth + 1;
          visited.set(targetNode.id, newDepth);
          cascadeDepth = Math.max(cascadeDepth, newDepth);

          events.push({
            time: simulationTime + edge.propagationDelay,
            serviceId: targetNode.id,
            serviceName: targetNode.name,
            previousState,
            newState,
            cause: `${sourceNode.name} ${sourceNode.status}`,
          });

          hasChanges = true;
        }
      }
    }
  }

  const finalStates = new Map<string, ServiceStatus>();
  for (const node of workingGraph.nodes) {
    finalStates.set(node.id, node.status);
  }

  events.sort((a, b) => a.time - b.time);

  return {
    finalStates,
    events,
    affectedServiceIds: Array.from(affectedServiceIds),
    cascadeDepth,
  };
}

export function runRecovery(
  graph: CityGraph,
  recoveryOrder: string[],
  currentStates: Map<string, ServiceStatus>
): SimulationResult {
  const workingGraph = cloneGraph(graph);
  const events: SimulationEvent[] = [];
  let simulationTime = 0;
  let cascadeDepth = 0;
  const affectedServiceIds = new Set<string>();

  for (const [nodeId, state] of currentStates) {
    const node = getNode(workingGraph, nodeId);
    if (node) {
      node.status = state;
      if (state !== 'healthy') affectedServiceIds.add(nodeId);
    }
  }

  for (const serviceId of recoveryOrder) {
    const node = getNode(workingGraph, serviceId);
    if (!node) continue;

    if (node.status === 'healthy') {
      events.push({
        time: simulationTime,
        serviceId: node.id,
        serviceName: node.name,
        previousState: 'healthy',
        newState: 'healthy',
        cause: 'Already healthy - no action needed',
      });
      continue;
    }

    const previousState = node.status;
    node.status = 'healthy';
    affectedServiceIds.delete(serviceId);

    events.push({
      time: simulationTime,
      serviceId: node.id,
      serviceName: node.name,
      previousState,
      newState: 'healthy',
      cause: 'Manual recovery action',
    });

    simulationTime += node.recoveryTime;

    let hasChanges = true;
    let step = 0;
    while (hasChanges && step < 20) {
      hasChanges = false;
      step++;

      const recoveredNodes = workingGraph.nodes.filter(n => n.status === 'healthy');
      for (const recoveredNode of recoveredNodes) {
        const downstreamEdges = getDownstreamEdges(workingGraph, recoveredNode.id);
        for (const edge of downstreamEdges) {
          const targetNode = getNode(workingGraph, edge.target);
          if (!targetNode || targetNode.status === 'healthy') continue;

          const allUpstreamHealthy = getDownstreamEdges(workingGraph, targetNode.id)
            .reverse()
            .every(e => {
              const src = getNode(workingGraph, e.source);
              return src && src.status === 'healthy';
            });

          if (allUpstreamHealthy) {
            const prevState = targetNode.status;
            targetNode.status = 'healthy';
            affectedServiceIds.delete(targetNode.id);
            events.push({
              time: simulationTime,
              serviceId: targetNode.id,
              serviceName: targetNode.name,
              previousState: prevState,
              newState: 'healthy',
              cause: `Upstream ${recoveredNode.name} recovered`,
            });
            hasChanges = true;
          }
        }
      }
    }
  }

  const finalStates = new Map<string, ServiceStatus>();
  for (const node of workingGraph.nodes) {
    finalStates.set(node.id, node.status);
  }

  events.sort((a, b) => a.time - b.time);

  return {
    finalStates,
    events,
    affectedServiceIds: Array.from(affectedServiceIds),
    cascadeDepth,
  };
}

export function calculateRecoveryTime(
  graph: CityGraph,
  recoveryOrder: string[],
  currentStates: Map<string, ServiceStatus>
): number {
  let totalTime = 0;
  for (const serviceId of recoveryOrder) {
    const node = graph.nodes.find(n => n.id === serviceId);
    if (node && currentStates.get(serviceId) !== 'healthy') {
      totalTime += node.recoveryTime;
    }
  }
  return totalTime;
}