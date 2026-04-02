# Tremor

> Local-first Apple ecosystem game studio for tactile board-game experiences.

## What's Inside

| Content | Count |
|---------|-------|
| Agents | 15 |
| Projects | 2 |
| Starter tasks | 15 |
| Routines | 5 |
| Goals | 17 |
| Skills | 55 |

## Work Graph

- Division chart: Leadership Cell, Nervous System Division, Sensory Engine Division, Fidelity and Quality Division
- Company goal: `Ship Tremor alpha`
- Branch goals: `Platform foundation`, `Sensory engine`, `Launch readiness`, `Studio operations`
- Delivery project: `Tremor Flight Plan`
- Studio operations project: `Tremor Studio Ops`
- Goals are seeded at runtime because the portable package does not carry them yet.
- The live tree includes four branch goals plus twelve leaf goals beneath them.
- Issues and routines live under `tasks/` and round-trip through the package importer.

## Agents

| Agent | Division | Role | Reports To |
|-------|----------|------|------------|
| Founder | Leadership Cell | CEO | — |
| Co-Engineering Lead A | Leadership Cell | Platform and Networking Lead | founder |
| Co-Engineering Lead B | Leadership Cell | Simulation and Sensory Lead | founder |
| Systems Network Engineer | Nervous System Division | Senior Systems and Network Engineer | co-engineering-lead-platform |
| DevSecOps Engineer | Nervous System Division | Platform and DevSecOps Engineer | founder |
| DSP Audio Engineer | Sensory Engine Division | DSP and Audio Engineer | co-engineering-lead-simulation |
| Computer Vision and AR Engineer | Sensory Engine Division | Computer Vision and AR Engineer | co-engineering-lead-simulation |
| Technical Artist | Sensory Engine Division | Technical Artist | co-engineering-lead-simulation |
| GenAI Architect | Sensory Engine Division | Generative AI and Search Architect | co-engineering-lead-simulation |
| Simulation Engineer | Sensory Engine Division | Physics and Simulation Specialist | co-engineering-lead-simulation |
| Lead Product Designer | Fidelity and Quality Division | Lead Product Designer | founder |
| Tools QA Engineer | Fidelity and Quality Division | Tools and QA Engineer | program-manager |
| SDET Engineer | Fidelity and Quality Division | Software Engineer in Test | program-manager |
| Program Manager | Leadership Cell | Technical Program Manager | founder |
| Admin and Ops | Leadership Cell / Studio Ops | Admin and Operations | founder |

## Getting Started

```bash
pnpm paperclipai company import ./docs/companies/tremor
```

## Artifacts

See [artifacts/README.md](./artifacts/README.md) for the discrete breakdown of the source conversation into reusable documents.

## Projects

See [projects/README.md](./projects/README.md) for the delivery and operations projects.

## Tasks

See [tasks/README.md](./tasks/README.md) for the starter issue graph and recurring routines.

## Skills

See [skills/README.md](./skills/README.md) for the Tremor skill packages used by the company import.