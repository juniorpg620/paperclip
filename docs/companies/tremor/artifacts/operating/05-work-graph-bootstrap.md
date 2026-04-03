# Work Graph Bootstrap

The Tremor work graph is split into runtime goals plus portable projects, issues, and routines.

## Graph

- Root company goal: `Ship Tremor alpha`
- Branch goals: platform foundation, sensory engine, launch readiness, studio operations
- Leaf goals: authoritative state model, local mesh transport, rule ingestion and synthesis, board ingestion and calibration, timing, haptics, and audio, render and simulation fidelity, milestone control and RAID, regression harness and QA automation, release safety and dual-screen readiness, lab readiness and device health, budget and runway discipline, approvals and onboarding hygiene
- Delivery project: `Tremor Flight Plan`
- Operations project: `Tremor Studio Ops`
- Starter issues: 15
- Recurring routines: 5

## Verification

- The bootstrap should leave the company with 17 goals, 2 projects, 15 seeded issues, and 5 routines.
- `Tremor Flight Plan` should own the first three branch goals.
- `Tremor Studio Ops` should own the studio operations branch.
- No legacy suffix artifacts such as `Tremor Flight Plan 2` or `Tremor Studio Ops 2` should remain if they are safe to remove.

## Bootstrap Rule

- Re-run the bootstrap script to keep docs and runtime state synchronized.
- Goals are runtime-seeded because the portable company format does not carry them.
- Issues and routines are seeded from portable `TASK.md` files and `.paperclip.yaml` triggers.