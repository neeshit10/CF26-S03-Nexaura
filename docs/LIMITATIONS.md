# Limitations & Future Scope
## UrbanPulse — CodeForge 2026

**Problem Code:** S-03  
**Team:** Nexaura

## 1. Prototype Scope
UrbanPulse is a hackathon-scale software prototype for exploring cascading failures in interconnected urban services.

It is not intended to predict real-world disasters or control real infrastructure.

## 2. Current / Planned Limitations

### Simulated Data
The prototype uses self-generated or simulated infrastructure graphs rather than live city infrastructure data.

### Simplified Dependencies
Real infrastructure relationships can be much more complex than the dependency rules used in the prototype.

### Simplified Service States
Services are represented using a small number of operational states such as:
- Healthy
- Degraded
- Failed

Real systems may have significantly more complex operational conditions.

### Prototype Recovery Time
Recovery time is a simulated metric based on the prototype model and should not be interpreted as a real-world restoration forecast.

### Deterministic Rules
The initial prototype prioritizes deterministic and explainable simulation behavior rather than probabilistic real-world prediction.

### Limited Scale
The hackathon prototype is designed for a small demonstration graph rather than a city-scale production network.

### No Live Infrastructure Integration
The system does not connect to:
- live power-grid systems
- traffic-control systems
- hospital systems
- IoT devices
- emergency-service platforms

### No Real Emergency Actions
UrbanPulse only simulates disruptions and recovery strategies. It does not trigger actions on real infrastructure.

### Simplified Recovery Strategy
The criticality-aware recovery algorithm uses an explainable heuristic rather than a production-grade optimization engine.

## 3. Validation Limitations
Validation is based on controlled simulation scenarios.

Results therefore demonstrate prototype behavior, not guaranteed real-world performance.

The final presentation should distinguish:
- simulated results
from
- real-world claims

## 4. Future Scope

Potential improvements include:

### Real Data Integration
Integrate public or authorized infrastructure datasets.

### Larger Dependency Graphs
Support much larger urban-service networks.

### Probabilistic Failure Models
Add uncertainty and probability-based failure propagation.

### Sensitivity Analysis
Measure how changes in dependency strength or recovery times affect outcomes.

### Advanced Recovery Optimization
Explore optimization methods for recovery sequencing.

### Historical Scenario Validation
Compare simulations against documented infrastructure disruption events where suitable data is available.

### Scenario Builder
Allow planners to create custom infrastructure graphs and disruption scenarios.

### Risk Heatmaps
Visualize highly critical or highly vulnerable services.

### Multi-City Modeling
Support different urban configurations and compare resilience patterns.

### Exportable Reports
Generate simulation and validation reports for analysis.

## 5. Responsible Positioning
UrbanPulse should be presented as:

**A prototype simulation and decision-support environment for exploring cascading failures in interconnected urban services.**

It should not be presented as:
- a real-world disaster predictor
- a certified emergency-management system
- a production infrastructure-control platform
