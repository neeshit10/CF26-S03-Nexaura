'use client';

import React, { useEffect, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  NodeProps,
  EdgeProps,
  BaseEdge,
  getBezierPath,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ServiceNode, ServiceStatus, DependencyEdge } from '@/types';

const statusColors: Record<ServiceStatus, string> = {
  healthy: '#22c55e',
  degraded: '#f59e0b',
  failed: '#ef4444',
};

const categoryColors: Record<string, string> = {
  power: '#f97316',
  telecom: '#3b82f6',
  traffic: '#8b5cf6',
  water: '#06b6d4',
  hospital: '#ec4899',
  emergency: '#f43f5e',
  fire: '#ef4444',
  police: '#1e40af',
  transport: '#84cc16',
  datacenter: '#6366f1',
};

interface CityNodeData {
  label: string;
  category: string;
  status: ServiceStatus;
  criticality: number;
}

const CityNode = ({ data }: NodeProps<CityNodeData>) => {
  const statusColor = statusColors[data.status] ?? '#22c55e';
  const categoryColor = categoryColors[data.category] ?? '#64748b';
  const bg =
    data.status === 'failed'
      ? '#fef2f2'
      : data.status === 'degraded'
      ? '#fffbeb'
      : '#f0fdf4';

  return (
    <div
      style={{
        background: bg,
        border: `2px solid ${statusColor}`,
        borderRadius: 12,
        padding: '10px 14px',
        minWidth: 150,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#94a3b8', width: 8, height: 8 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: statusColor,
            boxShadow: `0 0 6px ${statusColor}`,
            flexShrink: 0,
          }}
        />
        <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>
          {data.label}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span
          style={{
            background: `${categoryColor}22`,
            color: categoryColor,
            padding: '1px 7px',
            borderRadius: 999,
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {data.category}
        </span>
        <span style={{ color: '#64748b', fontWeight: 500 }}>
          C:{data.criticality}
        </span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#94a3b8', width: 8, height: 8 }} />
    </div>
  );
};

interface CityEdgeData {
  dependencyStrength: number;
}

const CityEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps<CityEdgeData>) => {
  const strength = data?.dependencyStrength ?? 0.5;
  const color =
    strength >= 0.9 ? '#ef4444' : strength >= 0.7 ? '#f59e0b' : '#3b82f6';
  const strokeWidth = 1 + strength * 2.5;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: color,
        strokeWidth,
        strokeDasharray: strength < 0.7 ? '6 3' : undefined,
      }}
    />
  );
};

const nodeTypes = { city: CityNode };
const edgeTypes = { city: CityEdge };

function buildRFNodes(serviceNodes: ServiceNode[]): Node<CityNodeData>[] {
  return serviceNodes.map((n) => ({
    id: n.id,
    type: 'city',
    position: n.position ?? { x: 0, y: 0 },
    data: {
      label: n.name,
      category: n.category,
      status: n.status,
      criticality: n.criticality,
    },
  }));
}

function buildRFEdges(depEdges: DependencyEdge[]): Edge<CityEdgeData>[] {
  return depEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'city',
    data: { dependencyStrength: e.dependencyStrength },
    animated: e.dependencyStrength >= 0.8,
    markerEnd: { type: MarkerType.ArrowClosed },
  }));
}

interface InnerGraphProps {
  serviceNodes: ServiceNode[];
  depEdges: DependencyEdge[];
  onNodeClick: (node: ServiceNode) => void;
}

function InnerGraph({ serviceNodes, depEdges, onNodeClick }: InnerGraphProps) {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<CityNodeData>(
    buildRFNodes(serviceNodes)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<CityEdgeData>(
    buildRFEdges(depEdges)
  );

  useEffect(() => {
    setNodes(buildRFNodes(serviceNodes));
  }, [serviceNodes, setNodes]);

  useEffect(() => {
    setEdges(buildRFEdges(depEdges));
  }, [depEdges, setEdges]);

  useEffect(() => {
    const id = setTimeout(() => fitView({ padding: 0.15 }), 50);
    return () => clearTimeout(id);
  }, [fitView]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<CityNodeData>) => {
      const svc = serviceNodes.find((n) => n.id === node.id);
      if (svc) onNodeClick(svc);
    },
    [serviceNodes, onNodeClick]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      attributionPosition="bottom-left"
      minZoom={0.3}
      maxZoom={2}
    >
      <Background color="#e2e8f0" gap={20} />
      <Controls position="top-right" />
      <MiniMap
        position="bottom-right"
        nodeColor={(n) =>
          statusColors[(n.data as CityNodeData)?.status] ?? '#64748b'
        }
        nodeStrokeWidth={0}
        maskColor="rgba(255,255,255,0.6)"
      />
    </ReactFlow>
  );
}

interface CityGraphViewProps {
  nodes: ServiceNode[];
  edges: DependencyEdge[];
  onNodeClick: (node: ServiceNode) => void;
}

export function CityGraphView({ nodes, edges, onNodeClick }: CityGraphViewProps) {
  return (
    <div style={{ width: '100%', height: 520 }}>
      <ReactFlowProvider>
        <InnerGraph serviceNodes={nodes} depEdges={edges} onNodeClick={onNodeClick} />
      </ReactFlowProvider>
    </div>
  );
}
