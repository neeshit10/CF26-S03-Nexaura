# UI/UX Specification
## UrbanPulse

## 1. Design Goal
The interface should make a technically complex cascade simulation understandable within seconds during a live hackathon demo.

Primary principles:
- clear hierarchy
- visible system state
- low interaction complexity
- explainable results
- demo-friendly visuals
- no decorative feature that hides the technical mechanism

## 2. Primary Screen — Command Center

### Header
Show:
- UrbanPulse
- scenario selector
- simulation status
- reset action

### Metrics Row
Five key cards:
1. City Health
2. Active Incidents
3. Affected Services
4. Cascade Depth
5. Estimated Recovery Time

### Main Content
Desktop layout:
```text
┌────────────────────────────────────────────────────┐
│ Header                                             │
├─────────┬─────────┬─────────┬─────────┬────────────┤
│ Health  │Incident │Affected │ Depth   │ Recovery   │
├──────────────────────────────┬─────────────────────┤
│                              │ Node Detail Panel   │
│      Interactive Graph       │                     │
│                              │ Fail / Recover      │
├──────────────────────────────┴─────────────────────┤
│ Simulation Timeline                                │
├────────────────────────────────────────────────────┤
│ Recovery Strategy Comparison                       │
└────────────────────────────────────────────────────┘
```

## 3. Graph UX
Each node should display:
- short service name
- status indicator
- optional category icon

State mapping:
- Healthy → visually calm / positive
- Degraded → warning
- Failed → critical

Do not rely only on color; include status text/icon/badge.

Edges should clearly show dependency direction.

Selected node should be visually distinct.

## 4. Node Detail Panel
When a node is selected, show:
- service name
- category
- status
- criticality
- capacity
- recovery time
- upstream dependencies
- downstream dependencies
- current cause, if affected

Actions:
- Fail Service
- Recover Service

Disable or explain impossible actions.

## 5. Simulation Controls
Minimum controls:
- scenario selector
- fail selected service
- recover selected service
- run predefined scenario
- reset simulation

For multi-failure scenario:
- allow predefined multi-failure scenarios first
- custom multi-select is optional

## 6. Timeline
Each event should show:
- time
- service
- transition
- cause

Example:
```text
00:04 — Emergency Dispatch
Healthy → Degraded
Cause: Telecom Network
```

Newest event may be highlighted, but full history must remain readable.

## 7. Recovery Comparison
Show side-by-side or stacked cards:

### Basic Recovery
- affected services
- cascade depth
- recovery time
- recovery order

### Criticality-Aware Recovery
- affected services
- cascade depth
- recovery time
- recovery order

If one strategy improves a metric, clearly show the difference.

Do not show improvement percentages unless calculated from actual results.

## 8. Empty / Error States
Examples:
- no node selected
- no simulation running
- invalid scenario
- failed action
- no affected services

Errors should be clear and non-technical where possible.

## 9. Responsive Behavior
Primary target: laptop/desktop demo.

On smaller screens:
- metrics may wrap
- graph remains primary
- node details may move below graph
- timeline and comparison may stack

## 10. Accessibility
- do not communicate state through color only
- buttons need descriptive labels
- maintain readable contrast
- keyboard focus should remain visible where practical

## 11. Animation
Use animation only to improve understanding:
- state transition
- cascade progression
- metric update

Avoid:
- long intro animations
- excessive particle effects
- animations that delay user interaction

## 12. Visual Tone
Preferred:
- technical command-center feel
- modern but restrained
- strong information hierarchy
- clean typography
- minimal clutter

## 13. UI MVP
Must-have:
- header
- metrics cards
- interactive graph
- node detail panel
- fail/recover/reset
- scenario selector
- timeline
- recovery comparison

Nice-to-have:
- risk heatmap
- animated propagation
- scenario builder
- export report
