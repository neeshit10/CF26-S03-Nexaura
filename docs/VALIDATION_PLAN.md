# Validation Plan
## UrbanPulse — CodeForge 2026

**Problem Code:** S-03  
**Team:** Nexaura

## 1. Validation Goal
Validate whether the UrbanPulse prototype correctly simulates cascading failures across an urban infrastructure dependency graph and whether a criticality-aware recovery strategy can improve simulated recovery outcomes compared with a simple baseline strategy.

## 2. Core Research Question
Can dependency-aware recovery reduce cascade impact and simulated recovery time compared with a simple recovery strategy?

## 3. Main Validation Scenario
Primary scenario:

**Central Power Grid Failure**

The same city graph, dependency configuration, and simulation parameters will be used for both recovery strategies.

## 4. Recovery Strategies

### Strategy A — Basic Recovery
A simple deterministic recovery ordering.

### Strategy B — Criticality-Aware Recovery
A recovery ordering based on factors such as:
- service criticality
- downstream dependency count
- recovery time
- estimated downstream recovery benefit

## 5. Metrics
The prototype will compare:

- Affected Services
- Cascade Depth
- Simulated Recovery Time
- City Health
- Recovery Order

## 6. Test Conditions

### Test 1 — Single Failure
Fail one critical service.

Expected:
- dependent services update
- simulation terminates correctly
- metrics are generated

### Test 2 — Multiple Simultaneous Failures
Fail two services in the same scenario.

Expected:
- combined cascade is calculated
- no duplicate state-transition errors
- metrics remain valid

### Test 3 — Circular Dependency
Use a graph containing a cycle.

Expected:
- no infinite loop
- simulation terminates safely

### Test 4 — Isolated Node
Fail a service with no downstream dependents.

Expected:
- no unnecessary cascade
- cascade depth remains limited

### Test 5 — Reproducibility
Run the exact same predefined scenario multiple times.

Expected:
- identical inputs produce identical results

### Test 6 — Recovery
Recover a failed or degraded service.

Expected:
- state updates correctly
- downstream state is recalculated
- recovery event is recorded

### Test 7 — Invalid Action
Examples:
- fail an already failed service
- recover an already healthy service
- use an invalid node ID

Expected:
- application handles the action safely
- no crash
- clear error or safe ignore behavior

## 7. Experiment Procedure

1. Reset the city to its initial state.
2. Load the selected validation scenario.
3. Run the cascade simulation.
4. Apply Basic Recovery.
5. Record all output metrics.
6. Reset the scenario.
7. Run the same cascade again.
8. Apply Criticality-Aware Recovery.
9. Record all output metrics.
10. Compare the two strategies.

## 8. Results Table
Actual values must be filled only after the working prototype generates them.

| Metric | Basic Recovery | Criticality-Aware Recovery |
|---|---:|---:|
| Affected Services | TBD | TBD |
| Cascade Depth | TBD | TBD |
| Recovery Time | TBD | TBD |
| City Health After Recovery | TBD | TBD |

## 9. Evidence to Capture During Hackathon
Save:
- dashboard screenshot before failure
- cascade screenshot after failure
- multiple-failure screenshot
- recovery comparison screenshot
- event timeline screenshot
- production build output
- final experiment result values

## 10. Validation Rules
- Do not manually invent benchmark numbers.
- Do not report expected results as actual results.
- Use the same graph and initial conditions when comparing recovery strategies.
- Keep the experiment reproducible.
- Clearly state that recovery time is a simulated prototype metric.

## 11. Final Validation Summary
To be completed during the hackathon after implementation and testing.
