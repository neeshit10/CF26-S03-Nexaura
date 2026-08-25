export type ServiceStatus = 'healthy' | 'degraded' | 'failed';

export type ServiceCategory =
  | 'power'
  | 'telecom'
  | 'traffic'
  | 'water'
  | 'hospital'
  | 'emergency'
  | 'transport'
  | 'datacenter'
  | 'fire'
  | 'police';

export interface ServiceNode {
  id: string;
  name: string;
  category: ServiceCategory;
  status: ServiceStatus;
  criticality: number;
  capacity: number;
  recoveryTime: number;
  position?: { x: number; y: number };
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  dependencyStrength: number;
  propagationDelay: number;
}

export interface SimulationEvent {
  time: number;
  serviceId: string;
  serviceName: string;
  previousState: ServiceStatus;
  newState: ServiceStatus;
  cause: string;
}

export interface SimulationResult {
  finalStates: Map<string, ServiceStatus>;
  events: SimulationEvent[];
  affectedServiceIds: string[];
  cascadeDepth: number;
}

export interface RecoveryStrategy {
  name: string;
  order: string[];
}

export interface ExperimentResult {
  strategyName: string;
  affectedServiceCount: number;
  cascadeDepth: number;
  estimatedRecoveryTime: number;
}

export interface CityGraph {
  nodes: ServiceNode[];
  edges: DependencyEdge[];
}