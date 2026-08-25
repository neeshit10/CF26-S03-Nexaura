# UrbanPulse

### CodeForge 2026 — Team Nexaura

**Problem Code:** S-03  
**Problem Statement:** Urban Infrastructure Cascade Simulator  
**Team:** Nexaura

---

## Problem Statement

Urban infrastructure services are highly interconnected. A failure in one critical service can propagate into other dependent services, creating cascading failures that are difficult to understand through isolated monitoring.

---

## Solution Overview

UrbanPulse is a software-only urban infrastructure cascade simulator that represents city services as a directed dependency graph.

The prototype allows users to inject failures into critical services and observe how those disruptions propagate through connected infrastructure.

UrbanPulse supports:

- single and simultaneous failure injection
- deterministic cascade propagation
- healthy, degraded, and failed service states
- cascade depth measurement
- affected-service measurement
- estimated recovery time
- event timeline visualization
- service-level dependency inspection
- recovery actions
- Basic Recovery strategy
- Criticality-Aware Recovery strategy
- controlled recovery experiments

---

## System Architecture / Workflow

Detailed architecture is available in:

[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

High-level workflow:

```text
Scenario / Failure Input
        ↓
Infrastructure Dependency Graph
        ↓
Failure Injection
        ↓
Deterministic Propagation Engine
        ↓
Service State Updates
        ↓
Metrics + Event Timeline
        ↓
Recovery Strategy
        ↓
Experiment / Comparison
