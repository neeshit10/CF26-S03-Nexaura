# Product Requirements Document (PRD)
## UrbanPulse — Urban Infrastructure Cascade Simulator

**Hackathon:** CodeForge 2026  
**Problem Code:** S-03  
**Team:** Nexaura

## 1. Product Vision
UrbanPulse is a software-based simulator that models interconnected city services as a dynamic graph and shows how failures can cascade through dependent infrastructure.

## 2. Goal
Build a focused, measurable prototype that can:
- represent city services and dependencies
- simulate failures and recovery
- support multiple simultaneous disruptions
- maintain time-dependent state
- calculate affected services, cascade depth, and recovery time
- replay reproducible scenarios
- compare recovery strategies

## 3. Target Users
- city infrastructure planners
- emergency-response planners
- infrastructure analysts
- researchers and educators

## 4. Core Services
Initial prototype should model approximately 10–12 services such as:
- power grid
- telecom network
- traffic control
- water supply
- hospitals
- emergency dispatch
- ambulance service
- fire department
- police network
- public transport
- data center

## 5. Core Features
### Dynamic Graph
Show services as nodes and dependencies as directed edges.

### Service States
- Healthy
- Degraded
- Failed

### Failure Simulation
Allow one or more services to fail.

### Cascade Propagation
Propagate impact through dependent services until no further state changes occur.

### Time-Dependent State
Record ordered simulation events and state transitions.

### Recovery
Allow failed/degraded services to recover and recalculate downstream state.

### Metrics
Calculate:
- affected service count
- cascade depth
- recovery time
- city health

### Scenario Replay
Predefined scenarios must be reproducible.

### Recovery Comparison
Compare:
- basic recovery
- criticality-aware recovery

## 6. Research Question
Can dependency-aware recovery reduce cascade impact and recovery time compared with a simple recovery strategy?

## 7. Technical Claim
A recovery strategy that prioritizes highly critical and highly connected infrastructure services can reduce simulated cascade impact and recovery time compared with naive recovery ordering.

## 8. Validation Experiment
Use the same city graph, initial failures, and simulation parameters for both recovery strategies.

Compare:
- affected services
- cascade depth
- recovery time

Do not hard-code results.

## 9. MVP
The MVP is complete only when the following work:
- interactive graph
- 8+ services
- directed dependencies
- fail action
- recover action
- healthy/degraded/failed states
- single failure
- multiple simultaneous failures
- cascade propagation
- affected service metric
- cascade depth metric
- recovery-time metric
- reset
- 3+ predefined scenarios
- one recovery comparison
- one controlled validation experiment

## 10. Stretch Features
Only after MVP stability:
- animated propagation
- risk heatmap
- scenario builder
- critical-node detection
- downloadable report
- configurable dependency weights

## 11. Out of Scope
- real IoT hardware
- production-scale infrastructure
- Kubernetes
- Kafka
- complex microservices
- ML model training
- live emergency-control actions
- unnecessary authentication

## 12. Success Criteria
A judge should be able to:
1. load a scenario
2. fail one or more services
3. observe the cascade
4. inspect metrics
5. recover services
6. compare recovery strategies
7. rerun the scenario and obtain the same result
