# Development Plan
## UrbanPulse — Team Nexaura

## 1. Development Strategy
Build the smallest technically valid version first.

Do not start with visual polish.

Priority:
```text
Core Mechanism
→ Correctness
→ Metrics
→ Validation
→ UI Polish
→ Deployment
```

## 2. Team Roles

### Member 1 — Tech Lead / Main Developer
Owns:
- project setup
- main repository
- basic simulation fallback
- dashboard
- integration
- deployment
- final debugging

The project must remain finishable even if other technical contributions are delayed.

### Member 2 — Simulation Helper
Owns small isolated tasks such as:
- cascade depth
- affected-service metric
- recovery-priority function
- simulation tests
- edge-case fixes

Avoid unrelated frontend changes.

### Member 3 — Scenario / QA / Research
Owns:
- predefined scenarios
- manual QA
- bug reports
- assumptions
- research notes
- validation support

### Member 4 — PPT / Presentation
Owns:
- organizer PPT
- architecture visuals
- screenshots
- experiment-results slide
- presentation flow

## 3. Suggested Branches
```text
main
feature/integration
feature/simulation-helper
docs/scenarios-qa
```

Only the Tech Lead merges to `main`.

## 4. Milestones

### Milestone 1 — Project Runs
- Next.js initialized
- dependencies installed
- page loads
- first commit pushed

Suggested commit:
```text
chore: initialize UrbanPulse project
```

### Milestone 2 — Graph/Data Model
- service-node model
- dependency-edge model
- 8+ services
- graph renders

Suggested commits:
```text
feat: add infrastructure data model
feat: render city dependency graph
```

### Milestone 3 — Basic Simulation
- fail action
- downstream propagation
- service states
- cycle safety

Suggested commit:
```text
feat: implement deterministic cascade simulation
```

### Milestone 4 — Metrics
- affected services
- cascade depth
- recovery time
- city health

Suggested commit:
```text
feat: add cascade metrics
```

### Milestone 5 — Recovery
- recover action
- recalculation
- baseline recovery

Suggested commit:
```text
feat: add infrastructure recovery flow
```

### Milestone 6 — Recovery Optimizer
- criticality-aware ordering
- explainable scoring
- comparison view

Suggested commit:
```text
feat: add criticality-aware recovery strategy
```

### Milestone 7 — Scenarios / Timeline
- 3+ predefined scenarios
- event timeline
- reproducible runs

Suggested commits:
```text
feat: add reproducible failure scenarios
feat: add simulation event timeline
```

### Milestone 8 — Validation
- baseline vs optimized experiment
- results generated from engine
- results recorded in docs

Suggested commit:
```text
test: validate recovery strategies on controlled scenario
```

### Milestone 9 — Resilience
Test:
- simultaneous failures
- cycles
- repeated actions
- reset
- invalid IDs
- isolated nodes

Suggested commit:
```text
fix: harden simulator against edge cases
```

### Milestone 10 — UI Polish
Only now:
- spacing
- typography
- responsive layout
- readable statuses
- restrained animation

Suggested commit:
```text
style: polish command center dashboard
```

### Milestone 11 — Documentation / Deployment
- README updated
- setup instructions
- usage instructions
- results
- limitations
- AI disclosure
- deployment

Suggested commits:
```text
docs: add setup usage and validation results
chore: prepare final deployment
```

## 5. Stop Rules
If time is short:
1. keep graph
2. keep propagation
3. keep metrics
4. keep recovery
5. keep validation

Cut first:
- fancy animation
- scenario builder
- extra pages
- export feature
- complex filters

## 6. Testing Gate
Before every major merge:
```bash
npm run build
```

Also manually verify:
- app loads
- scenario runs
- reset works
- repeated run is consistent
- no critical console errors

## 7. Documentation During Hackathon
Do not wait until the end.

Update README after major milestones.

Record:
- architecture decisions
- experiment setup
- real measured results
- known limitations
- screenshots

## 8. Final Demo Order
```text
Open Dashboard
→ Explain Graph
→ Run Power Failure
→ Show Cascade
→ Show Metrics
→ Trigger Multi-Failure Scenario
→ Recover Critical Node
→ Compare Recovery Strategies
→ Show Validation Result
→ State Limitations
```

## 9. Definition of Done
The project is demo-ready when:
- production build succeeds
- core mechanism works
- multiple failures work
- recovery works
- metrics are generated correctly
- at least one validation experiment exists
- repo documentation is current
- PPT screenshots/results match the actual implementation
