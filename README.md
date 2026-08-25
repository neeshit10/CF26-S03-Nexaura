# UrbanPulse

### CodeForge 2026 — Team Nexaura

**Problem Code:** S-03  
**Problem Statement:** Urban Infrastructure Cascade Simulator  
**Team:** Nexaura

---

## Problem Statement

Urban infrastructure services are highly interconnected. A failure in one critical service can propagate into other dependent services, creating cascading failures that are difficult to understand through isolated monitoring.

Traditional monitoring often observes individual systems separately. UrbanPulse focuses on the relationships between services and demonstrates how disruption in one service can affect multiple dependent services over time.

---

## Solution Overview

UrbanPulse is a software-only urban infrastructure cascade simulator that represents city services as a directed dependency graph.

The prototype allows users to inject failures into critical services and observe how disruptions propagate through connected infrastructure.

UrbanPulse supports:

- single failure injection
- simultaneous multiple failures
- deterministic cascade propagation
- healthy, degraded, and failed service states
- dependency visualization
- cascade depth measurement
- affected-service measurement
- estimated recovery time
- event timeline visualization
- node-level service inspection
- recovery actions
- Basic Recovery strategy
- Criticality-Aware Recovery strategy
- controlled recovery experiments
- reproducible simulation scenarios

---

## Core Technical Mechanism

The core of UrbanPulse is a custom deterministic graph-based cascade simulation engine implemented in TypeScript.

Urban infrastructure is modeled as a directed graph.

### Service Nodes

Each node represents an urban service such as:

- Power Plant
- Telecom Hub
- Traffic Control
- Water Treatment
- Main Hospital
- Emergency Dispatch
- Fire Department
- Police HQ
- Data Center
- Public Transport
- Ambulance Fleet

Each service can contain properties such as:

- service ID
- service name
- category
- current health state
- criticality
- capacity
- recovery time

Service state is represented as:

```text
Healthy
Degraded
Failed
```

### Dependency Edges

Directed edges represent operational dependencies between services.

For example:

```text
Power Plant
    ↓
Telecom Hub
    ↓
Ambulance Fleet
```

The direction represents how failure can propagate from an upstream provider to a downstream dependent service.

Dependencies also contain strength values used by the simulation engine to determine the severity of propagation.

### Failure Injection

A user can select a service and inject a failure.

The simulation engine begins from the selected initial failure and traverses its downstream dependencies.

Example:

```text
Power Plant fails
        ↓
Simulation checks dependent services
        ↓
Dependency rules are evaluated
        ↓
Downstream services become degraded or failed
        ↓
Propagation continues
```

### Deterministic Propagation

The simulation is deterministic.

This means that when the same:

- infrastructure graph
- dependency strengths
- initial failures
- parameters

are used, the same result is produced.

This makes experiments reproducible and easier to validate.

### Cycle Safety

Urban infrastructure graphs can contain dependency cycles.

The propagation engine tracks processed nodes and propagation state to avoid uncontrolled infinite traversal.

This keeps the simulation safe when cyclic dependencies exist.

### Multiple Failure Support

UrbanPulse can also simulate multiple simultaneous initial failures.

This allows recovery strategies to be compared under more complex scenarios instead of only a single failure.

### Metrics Engine

After propagation, UrbanPulse calculates key metrics including:

- City Health
- Active Incidents
- Affected Services
- Cascade Depth
- Estimated Recovery Time

### Event Timeline

Simulation events are recorded in a timeline so the user can understand:

- which service changed state
- when the event occurred in the simulation
- which dependency caused the impact
- how the cascade progressed

### Recovery Engine

UrbanPulse contains recovery logic that allows services to be restored after disruption.

Downstream services can automatically clear when their required upstream providers are restored according to the implemented dependency rules.

Two recovery strategies are implemented:

#### Basic Recovery

Basic Recovery prioritizes services primarily using recovery time.

#### Criticality-Aware Recovery

Criticality-Aware Recovery considers factors such as:

- service criticality
- number of downstream dependents
- recovery time
- recovery efficiency

The purpose of this comparison is not to claim that one strategy is always better.

Instead, the experiment demonstrates that recovery prioritization can change depending on:

- topology
- criticality
- dependency structure
- recovery duration
- initial failure set

---

## System Architecture / Workflow

Detailed architecture documentation is available in:

[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

High-level workflow:

```text
Scenario / Failure Input
        ↓
Infrastructure Dependency Graph
        ↓
Failure Injection
        ↓
Deterministic Cascade Engine
        ↓
Service State Updates
        ↓
Metrics Calculation
        ↓
Event Timeline
        ↓
Recovery Strategy
        ↓
Experiment / Comparison
```

### Main Application Layers

```text
User Interface
     ↓
React / Next.js Components
     ↓
UrbanPulse State Hook
     ↓
Simulation Engine
     ↓
Recovery Engine
     ↓
Experiment Logic
     ↓
Infrastructure Graph Data
```

---

## Technology Stack

UrbanPulse was built using:

- **Next.js 16** — application framework
- **React** — user interface
- **TypeScript** — simulation logic and type-safe development
- **Tailwind CSS** — UI styling
- **React Flow / @xyflow/react** — infrastructure dependency graph visualization
- **Lucide Icons** — interface icons
- **Local TypeScript scenario data** — infrastructure graph and simulation data
- **Custom TypeScript simulation engine** — cascade propagation
- **Custom recovery algorithms** — recovery prioritization
- **Git** — version control
- **GitHub** — repository and collaboration

AI-assisted development was performed using tools including OpenCode and OmniRoute.

---

## Project Structure

Main implementation is located inside:

```text
urban-pulse/
```

Important files include:

```text
urban-pulse/
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── CityGraphView.tsx
│   │   ├── ExperimentComparison.tsx
│   │   ├── MetricCard.tsx
│   │   ├── NodeDetailPanel.tsx
│   │   └── Timeline.tsx
│   │
│   ├── data/
│   │   └── city.ts
│   │
│   ├── hooks/
│   │   └── useUrbanPulse.ts
│   │
│   ├── lib/
│   │   ├── simulation.ts
│   │   ├── recovery.ts
│   │   └── experiment.ts
│   │
│   └── types/
│       └── index.ts
│
├── package.json
└── README.md
```

---

## Setup & Installation

### Prerequisites

Install:

- Node.js
- npm
- Git

### Clone Repository

```bash
git clone https://github.com/neeshit10/CF26-S03-Nexaura.git
```

Enter the project:

```bash
cd CF26-S03-Nexaura/urban-pulse
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the local URL displayed by Next.js in the terminal.

Usually:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
```

The final UrbanPulse implementation successfully passes the Next.js production build.

---

## Usage

### 1. Start UrbanPulse

Run:

```bash
npm run dev
```

### 2. Observe Healthy City State

The initial graph represents a healthy infrastructure network.

Typical initial metrics include:

```text
City Health: 100%
Active Incidents: 0
Affected Services: 0
Cascade Depth: 0
Estimated Recovery: 0 min
```

### 3. Select a Service

Click a node such as:

```text
Power Plant
```

The service detail panel shows information including:

- status
- capacity
- criticality
- recovery time

### 4. Inject a Failure

Click:

```text
Fail Service
```

The simulation engine propagates the disruption through dependent services.

### 5. Observe Results

Users can observe:

- healthy/degraded/failed nodes
- affected-service count
- cascade depth
- City Health
- Active Incidents
- recovery estimates
- event timeline

### 6. Recovery

Use the recovery controls to restore services and observe downstream state changes.

### 7. Experiments

Use the experiment functionality to compare recovery strategies under identical starting conditions.

---

## Validation / Experiments / Results

UrbanPulse was validated using controlled scenarios on the same infrastructure graph.

The goal was to verify that:

- failures propagate correctly
- affected services are counted correctly
- cascade depth is measured correctly
- recovery logic uses the correct upstream dependencies
- experiments replay the same initial failures
- strategy comparisons are reproducible

---

## Power Plant Failure Scenario

Initial failure:

```text
Power Plant
```

The Power Plant has multiple direct downstream dependencies.

During the tested scenario, disruption propagated to services including:

- Telecom Hub
- Traffic Control
- Water Treatment
- Main Hospital
- Emergency Dispatch
- Fire Department
- Police HQ
- Data Center
- Public Transport

A secondary propagation occurred through Telecom Hub to Ambulance Fleet.

Example cascade path:

```text
Power Plant
    ↓
Telecom Hub
    ↓
Ambulance Fleet
```

### Observed Result

- Total modeled services: **11**
- Initial failed service: **Power Plant**
- Downstream affected services: **10**
- Total non-healthy services after cascade: **11**
- Cascade depth: **2**
- Dashboard simulated cascade recovery estimate: **840 minutes**
- Recovery time of the initiating Power Plant service: **120 simulated minutes**

The 840-minute value is a simulation estimate produced by the current prototype and is not intended as a real-world emergency prediction.

---

## Recovery Strategy Experiment

UrbanPulse implements:

```text
Basic Recovery
```

and:

```text
Criticality-Aware Recovery
```

### Single Failure Experiment

For a single initial Power Plant failure, both strategies receive only one initiating failed service to prioritize.

Therefore both strategies produce the same initial recovery order:

```text
Power Plant
```

The recovery time for the initiating service is:

```text
120 simulated minutes
```

This result is expected because there is no ordering decision when only one trigger exists.

### Multiple Failure Experiment

A controlled multiple-failure scenario was also used so that recovery ordering could be meaningfully compared.

Both strategies use:

- the same fresh infrastructure graph
- the same initial failures
- the same dependency structure
- the same recovery-time values

The experiment showed that recovery order depends on the strategy's prioritization rules.

The project does **not** claim that Criticality-Aware Recovery always produces a lower recovery time.

Instead, the experiment demonstrates how different restoration priorities can be evaluated under identical conditions.

---

## Validation Fixes

During validation, two important issues were identified and corrected.

### Recovery Upstream Dependency Fix

The recovery engine originally checked outgoing edges of a recovering node instead of checking the dependencies entering that node.

This prevented downstream auto-recovery from working correctly.

The implementation was corrected so that a downstream service checks whether its required upstream providers are healthy before being automatically cleared.

### Experiment Initial-Failure Fix

The experiment originally risked using all currently affected nodes as new initial failures.

This would incorrectly transform a cascade result into a simultaneous multi-node failure scenario.

The implementation was corrected to store the original trigger IDs and replay exactly those same failures on a fresh graph for both strategies.

This ensures a fair and reproducible comparison.

---

## Real-World Sensor and Telemetry Integration

The current UrbanPulse prototype uses simulated infrastructure data.

It does **not** currently use physical sensors or live city systems.

For a real-world deployment, UrbanPulse would be designed to consume telemetry from existing city infrastructure systems rather than relying on a single sensor.

### Real-World Architecture

```text
Physical Infrastructure
        ↓
Sensors / Monitoring Systems
        ↓
IoT Gateway / SCADA / API
        ↓
Event Normalization
        ↓
UrbanPulse
        ↓
Dependency Graph
        ↓
Cascade Analysis
```

### Power Infrastructure

Possible data sources:

- smart meters
- voltage sensors
- current monitoring
- breaker status
- substation telemetry
- frequency monitoring
- SCADA systems

Sensors would typically be placed at critical points such as substations, feeders, generation facilities, and distribution infrastructure.

### Water Infrastructure

Possible data sources:

- pressure sensors
- flow meters
- pump status
- tank-level sensors
- reservoir monitoring

Sensors could be installed at pumps, major pipeline junctions, treatment facilities, and storage systems.

### Traffic Infrastructure

Possible data sources:

- traffic signal controllers
- road cameras
- loop detectors
- vehicle-count sensors
- congestion APIs

Monitoring would focus on major intersections, corridors, and traffic-control infrastructure.

### Telecom Infrastructure

Telecom systems often do not require additional physical sensors.

Possible software telemetry includes:

- router status
- switch status
- packet loss
- latency
- bandwidth
- link-down events
- network-management alerts

### Hospitals

Possible operational data includes:

- backup power status
- system uptime
- emergency capacity
- operational availability
- hospital information-system events

### Emergency Services

Possible sources include:

- dispatch systems
- emergency queues
- responder availability
- response status
- computer-aided dispatch events

### Public Transport

Possible sources include:

- GPS feeds
- vehicle availability
- route status
- station status
- operational APIs

### Sensor-Agnostic Design

UrbanPulse is designed conceptually to be sensor-agnostic.

The simulation layer does not need to understand the specific hardware device.

Instead, real-world data would first be normalized into common events such as:

```text
Service Healthy
Service Degraded
Service Failed
Capacity Reduced
Service Recovered
```

The same cascade engine could then process those standardized events.

---

## Limitations

The current prototype intentionally simplifies real urban infrastructure.

Current limitations include:

- simulated rather than live infrastructure telemetry
- simplified dependency strengths
- prototype-scale infrastructure graph
- no infrastructure redundancy model
- no backup-provider modeling
- worst-case immediate propagation
- failure propagation is simplified compared with physical systems
- recovery is sequential
- real cities may use multiple recovery teams in parallel
- downstream auto-recovery requires upstream providers to become healthy
- recovery estimates are simulated rather than predictive
- results are topology-specific
- no live SCADA integration
- no live IoT integration
- no real traffic API integration
- no hospital-system integration
- no telecom-provider integration
- no real emergency control actions

---

## Future Scope

Future versions of UrbanPulse could include:

- real-time IoT telemetry
- SCADA integration
- city monitoring-system integration
- traffic APIs
- public transport feeds
- hospital operational APIs
- telecom monitoring integration
- infrastructure redundancy
- backup generators
- alternate service providers
- probabilistic propagation
- time-delayed degradation
- parallel recovery teams
- larger city-scale graphs
- automated scenario generation
- historical incident replay
- sensitivity analysis
- uncertainty modeling
- advanced recovery optimization
- live alerts
- control-room dashboards
- geographic infrastructure mapping

---

## Research Question

A key question explored by the prototype is:

> How can dependency-aware simulation help identify the downstream impact of critical infrastructure failures and support evaluation of different recovery priorities?

UrbanPulse does not attempt to predict exact real-world disaster outcomes.

Instead, it provides a reproducible environment for exploring infrastructure dependencies, cascade behavior, and recovery strategies.

---

## Technical Claim

The implemented prototype demonstrates that a directed dependency graph can be used to:

- represent interconnected urban services
- inject controlled disruptions
- propagate downstream impact
- measure cascade depth
- count affected services
- estimate recovery behavior
- compare restoration priorities under reproducible conditions

The prototype does not claim that its recovery strategy is universally optimal.

---

## Demo Flow

Recommended demonstration sequence:

```text
1. Show healthy city graph
        ↓
2. Select Power Plant
        ↓
3. Inject failure
        ↓
4. Observe cascading service states
        ↓
5. Show City Health and affected-service metrics
        ↓
6. Show cascade depth
        ↓
7. Show event timeline
        ↓
8. Demonstrate recovery
        ↓
9. Show recovery strategy experiment
```

---

## Team Members

### Team Nexaura

- **Neeshit Lamsoge** — Technical Lead, Integration, Core Development
- **Tanmay Bisen** — Simulation and Development Support
- **Tanvi Sharma** — Testing, Scenarios, and Research Support
- **Omkar Thakare** — Presentation and Documentation

---

## AI Assistance Disclosure

AI-assisted tools were used during development for:

- code generation
- debugging
- interface development assistance
- simulation review
- test generation
- validation support
- documentation
- research assistance

Tools included AI coding workflows using OpenCode and OmniRoute.

The team reviewed and tested the final implementation.

Team Nexaura remains responsible for understanding and defending:

- system architecture
- dependency modeling
- simulation logic
- cascade propagation
- recovery logic
- validation results
- limitations
- technical claims

---

## Project Status

**Working CodeForge 2026 Prototype**

The final prototype demonstrates the core mechanism required by Problem S-03:

> Dependency-aware simulation of cascading urban infrastructure failures and recovery.

UrbanPulse focuses on system reasoning, reproducible simulation, graph-based failure propagation, measurable cascade impact, and recovery analysis.
