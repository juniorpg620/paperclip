# Role Skills Research Appendix

This appendix turns the Tremor skill discussion into a role-by-role operating map.

## Scope Note

The original conversation explored a much larger skill ecosystem than the current package needs. This appendix keeps the useful part: how each Tremor role should use skills to plan, execute, verify, and report without blurring ownership.

## Core Interpretation

- Skills are leverage only when they match a real owner and a real work graph node.
- Lead roles should own strategy, critique, and escalation.
- Specialist roles should own one deep domain plus one verification loop.
- Support roles should keep the company graph honest, visible, and repeatable.

## Boundary Decisions

- `strategy` decides direction.
- `company-ops` runs cadence and operating hygiene.
- `roadmap-management` sequences work and dependencies.
- `risk-management` keeps the risk model current.
- `raid` is the living log of risks, assumptions, issues, and dependencies.
- `git-governance` governs code-change quality, review discipline, and release safety.
- `deterministic-systems` handles replayable state, invariants, and reproducibility.
- `network-framework` covers transport, concurrency boundaries, and sync safety.
- `multipeer-connectivity` stays focused on local discovery and session lifecycle.
- `core-audio` and `core-haptics` own sensory timing and physical feel.
- `qa-automation`, `hardware-testing`, `stress-testing`, `simulation`, and `chaos-testing` form the verification stack.

## Role-by-Role Map

| Role | Primary | Verification | Reporting / Coordination |
|------|---------|--------------|--------------------------|
| Founder | `strategy` | `company-ops` | `raid` |
| Co-Engineering Lead A | `network-framework` | `deterministic-systems` | `roadmap-management` |
| Co-Engineering Lead B | `core-haptics` | `simulation` | `raid` |
| Systems Network Engineer | `network-framework` | `multipeer-connectivity` | `git-governance` |
| DSP Audio Engineer | `core-audio` | `latency-benchmarking` | `qa-automation` |
| Computer Vision and AR Engineer | `coreml` | `vision` | `simulation` |
| Technical Artist | `metal` | `scenekit` | `git-governance` |
| GenAI Architect | `generative-ai` | `retrieval` | `roadmap-management` |
| DevSecOps Engineer | `ci-cd` | `artifact-integrity` | `git-governance` |
| Simulation Engineer | `simulation` | `chaos-testing` | `qa-automation` |
| Lead Product Designer | `ux-design` | `motion-design` | `company-ops` |
| Program Manager | `roadmap-management` | `raid` | `risk-management` |
| Tools QA Engineer | `qa-automation` | `hardware-testing` | `test-analysis` |
| SDET Engineer | `automation` | `playwright` | `test-architecture` |
| Admin and Ops | `company-ops` | `hardware-testing` | `risk-management` |

## Operating Pattern

Every role should have:

- one primary skill that describes the core domain
- one verification skill that proves the work is correct
- one coordination skill that keeps the graph visible to others

## Minimal Core Toolkit

The source discussion also implied a small base toolkit for every hire:

- skills discovery and installation
- document parsing and structured note capture
- Git and doc-writing support
- systematic debugging and planning

## Practical Reading Order

1. Read the role line in this appendix.
2. Open the primary skill and the verification skill.
3. Use the coordination skill only when the issue needs to move across roles.
4. Keep shared `paperclipai/...` catalog skills unchanged unless a concrete mismatch appears.
