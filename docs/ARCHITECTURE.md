# System Architecture
## UrbanPulse

## 1. Architecture Goal
Keep the prototype technically credible but simple enough to build, test, and explain during a hackathon.

## 2. High-Level Architecture

```text
                    ┌───────────────────────────┐
                    │       Next.js UI          │
                    │ Dashboard / Graph /       │
                    │ Controls / Timeline       │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │     Application State     │
                    │ current scenario + nodes  │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │    Simulation Engine      │
                    └───────┬─────────┬─────────┘
                            │         │
              ┌─────────────▼──┐   ┌──▼────────────────┐
              │ Propagation    │   │ Recovery Engine   │
              │ Engine         │   │ / Optimizer       │
              └──────────┬─────┘   └──────┬────────────┘
                         │                │
                         └───────┬────────┘
                                 ▼
                    ┌───────────────────────────┐
                    │      Metrics Engine       │
                    │ affected / depth / time   │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ Scenario / Event Data     │
                    │ TypeScript or JSON        │
                    └───────────────────────────┘
```

## 3. Main Modules

### A. UI Layer
Responsibilities:
- render dashboard
- render dependency graph
- show service states
- expose fail/recover/reset controls
- display timeline
- display strategy comparison

Suggested location:
```text
components/
```

### B. Scenario/Data Layer
Responsibilities:
- define city services
- define dependency edges
- store predefined scenarios

Suggested location:
```text
data/
```

### C. Simulation Engine
Responsibilities:
- receive graph + initial failures
- perform deterministic state transitions
- propagate impact
- emit simulation events

Suggested location:
```text
lib/simulation/engine.ts
```

### D. Propagation Engine
Responsibilities:
- traverse dependencies
- calculate downstream impact
- avoid infinite cycles
- track cascade depth

Suggested location:
```text
lib/simulation/propagation.ts
```

### E. Recovery Engine
Responsibilities:
- apply recovery actions
- calculate recovery ordering
- support baseline and criticality-aware strategies

Suggested location:
```text
lib/simulation/recovery.ts
```

### F. Metrics Engine
Responsibilities:
- affected services
- cascade depth
- recovery time
- city health

Suggested location:
```text
lib/simulation/metrics.ts
```

## 4. Core Data Model

### Service Node
```ts
type ServiceStatus = "healthy" | "degraded" | "failed";

interface ServiceNode {
  id: string;
  name: string;
  category: string;
  status: ServiceStatus;
  criticality: number;
  capacity: number;
  recoveryTime: number;
}
```

### Dependency Edge
```ts
interface DependencyEdge {
  source: string;
  target: string;
  dependencyStrength: number;
  propagationDelay: number;
}
```

### Simulation Event
```ts
interface SimulationEvent {
  time: number;
  serviceId: string;
  previousState: ServiceStatus;
  nextState: ServiceStatus;
  causeServiceId?: string;
}
```

## 5. Data Flow

```text
Load Scenario
    ↓
Create Initial Graph State
    ↓
Inject Failure(s)
    ↓
Propagation Engine
    ↓
Generate Events
    ↓
Update Node States
    ↓
Metrics Engine
    ↓
Render UI
    ↓
Recovery Action
    ↓
Recalculate State + Metrics
```

## 6. Recovery Strategy Design

### Baseline
Use a simple deterministic order, such as:
- failure order
or
- configured recovery order

### Criticality-Aware
Use an explainable score based on factors such as:
- service criticality
- downstream dependency count
- recovery time

Example conceptual score:
```text
priority =
criticality_weight
+ downstream_impact_weight
- recovery_time_penalty
```

The exact formula should remain simple and documented.

## 7. Why This Architecture
- separates technical mechanism from presentation
- minimizes merge conflicts
- easy to test
- easy for AI coding tools to work on isolated modules
- no unnecessary infrastructure
- suitable for prototype-scale demo
- supports deterministic validation

## 8. Failure Handling
The system should:
- ignore/reject invalid node IDs
- prevent repeated traversal loops
- avoid duplicate state transitions
- show user-facing error states instead of crashing

## 9. Deployment Model
Preferred:
- single Next.js application
- deploy to Vercel if stable
- keep local `npm run dev` / production build as demo backup

## 10. Architecture Boundaries
Do not add the following unless the implemented prototype genuinely requires them:
- distributed microservices
- Kafka
- Docker
- Kubernetes
- separate database server
- ML model serving
