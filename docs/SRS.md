# Software Requirements Specification (SRS)
## UrbanPulse

**Problem Code:** S-03  
**Team:** Nexaura

## 1. Purpose
This document defines the functional and non-functional requirements for the UrbanPulse prototype.

## 2. System Scope
UrbanPulse is a software-only simulation system for modeling cascading failures across interdependent urban services.

The prototype does not claim to predict real-world disasters.

## 3. Functional Requirements

### FR-01 Infrastructure Graph
The system shall represent urban services as nodes and dependencies as directed edges.

### FR-02 Node Attributes
Each service node shall support:
- id
- name
- category
- status
- criticality
- capacity
- recovery time

### FR-03 Edge Attributes
Each dependency edge shall support:
- source node
- target node
- dependency strength
- propagation delay

### FR-04 Service States
Each service shall be in one of:
- healthy
- degraded
- failed

### FR-05 Failure Injection
The user shall be able to fail a healthy or degraded service.

### FR-06 Multiple Failures
The system shall support multiple simultaneous initial disruptions.

### FR-07 Propagation
The system shall evaluate downstream dependencies and update impacted service states.

### FR-08 Cycle Safety
The propagation mechanism shall terminate safely even if the dependency graph contains cycles.

### FR-09 Deterministic Simulation
The same graph, scenario, and parameters shall produce the same output.

### FR-10 Simulation Timeline
The system shall record state changes in chronological simulation order.

Each event should contain:
- simulation time
- affected service
- previous state
- new state
- cause

### FR-11 Recovery
The user shall be able to recover failed or degraded services.

### FR-12 Recalculation After Recovery
The system shall recalculate relevant downstream states after recovery.

### FR-13 Reset
The user shall be able to reset the simulation to its original state.

### FR-14 Affected Services Metric
The system shall calculate the set and count of services impacted by a disruption.

### FR-15 Cascade Depth
The system shall calculate the maximum propagation depth reached by a disruption.

### FR-16 Recovery Time
The system shall calculate a simulated recovery-time estimate based on the configured model.

### FR-17 City Health
The system should calculate an overall city-health indicator from current service states.

### FR-18 Predefined Scenarios
The system shall provide at least three reproducible predefined failure scenarios.

### FR-19 Recovery Strategy A
The system shall support a simple baseline recovery ordering.

### FR-20 Recovery Strategy B
The system shall support a criticality-aware recovery ordering.

### FR-21 Strategy Comparison
The system shall compare recovery strategies using the same scenario and simulation settings.

## 4. Non-Functional Requirements

### NFR-01 Usability
A user should be able to start a simulation without technical knowledge.

### NFR-02 Explainability
The system should show why a service was affected and, where practical, the propagation path.

### NFR-03 Reliability
Invalid user actions should not crash the application.

### NFR-04 Performance
Prototype-scale scenarios should update fast enough for a live demo.

### NFR-05 Responsiveness
The primary dashboard should remain usable on common laptop screen sizes.

### NFR-06 Maintainability
Core simulation logic should be separated from UI components.

### NFR-07 Correctness
Metrics must be generated from the simulation state rather than manually entered.

### NFR-08 Reproducibility
Predefined scenarios should be rerunnable with consistent outcomes.

## 5. Edge Cases
The prototype should safely handle:
- isolated node failure
- circular dependencies
- repeated failure action
- recovery of an already healthy node
- repeated recovery action
- multiple simultaneous failures
- reset after partial simulation
- invalid node reference
- missing dependency target
- duplicate edges/events

## 6. Security / Correctness Considerations
- validate scenario inputs
- reject invalid node references
- prevent infinite traversal
- avoid silent incorrect state
- avoid unsafe execution of user-provided code
- keep simulated data clearly separated from real-world claims

## 7. Acceptance Criteria
The system is accepted as demo-ready when:
- production build succeeds
- at least 3 predefined scenarios work
- simultaneous failures work
- recovery works
- metrics update correctly
- repeated runs are reproducible
- no known critical demo-breaking bug remains
