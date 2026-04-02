# Tremor Tasks

Seed tasks and recurring routines for the Tremor company graph.

| Seed | Type | Branch Goal | Project | Assignee | Purpose |
|------|------|-------------|---------|----------|---------|
| [founder-strategy-approval](./issues/founder-strategy-approval/TASK.md) | epic | Ship Tremor alpha | Tremor Flight Plan | Founder | Founder strategy and approval backlog |
| [pm-raid-milestones](./issues/pm-raid-milestones/TASK.md) | epic | Launch readiness | Tremor Studio Ops | Program Manager | PM RAID and milestone control |
| [platform-authoritative-state](./issues/platform-authoritative-state/TASK.md) | epic | Platform foundation | Tremor Flight Plan | Co-Engineering Lead A | Platform authoritative state and local networking |
| [sensory-simulation-fidelity](./issues/sensory-simulation-fidelity/TASK.md) | epic | Sensory engine | Tremor Flight Plan | Co-Engineering Lead B | Sensory simulation and fidelity validation |
| [systems-network-transport](./issues/systems-network-transport/TASK.md) | issue | Platform foundation | Tremor Flight Plan | Systems Network Engineer | Systems network transport |
| [genai-rule-ingestion](./issues/genai-rule-ingestion/TASK.md) | issue | Platform foundation | Tremor Flight Plan | GenAI Architect | GenAI rule ingestion and synthesis |
| [devsecops-release-safety](./issues/devsecops-release-safety/TASK.md) | issue | Launch readiness | Tremor Studio Ops | DevSecOps Engineer | DevSecOps release safety |
| [lead-product-designer-dual-screen](./issues/lead-product-designer-dual-screen/TASK.md) | issue | Launch readiness | Tremor Flight Plan | Lead Product Designer | Lead product designer dual-screen flow |
| [tools-qa-regression-hil](./issues/tools-qa-regression-hil/TASK.md) | issue | Launch readiness | Tremor Studio Ops | Tools QA Engineer | Tools QA regression and HIL coverage |
| [sdet-automation-coverage](./issues/sdet-automation-coverage/TASK.md) | issue | Launch readiness | Tremor Studio Ops | SDET Engineer | SDET automation and coverage |
| [admin-ops-lab-readiness](./issues/admin-ops-lab-readiness/TASK.md) | issue | Studio operations | Tremor Studio Ops | Admin and Ops | Admin and Ops lab readiness |
| [dsp-audio-timing](./issues/dsp-audio-timing/TASK.md) | issue | Sensory engine | Tremor Flight Plan | DSP Audio Engineer | DSP audio pairing and timing |
| [computer-vision-board-ingestion](./issues/computer-vision-board-ingestion/TASK.md) | issue | Sensory engine | Tremor Flight Plan | Computer Vision and AR Engineer | Computer vision board ingestion and calibration |
| [technical-artist-render-pipeline](./issues/technical-artist-render-pipeline/TASK.md) | issue | Sensory engine | Tremor Flight Plan | Technical Artist | Technical artist render and material pipeline |
| [simulation-engine-chaos-harness](./issues/simulation-engine-chaos-harness/TASK.md) | issue | Sensory engine | Tremor Flight Plan | Simulation Engineer | Simulation engine chaos and stress harness |

| Routine | Branch Goal | Project | Assignee | Schedule |
|---------|-------------|---------|----------|----------|
| [monday-strategy-review](./routines/monday-strategy-review/TASK.md) | Studio operations | Tremor Studio Ops | Founder | 0 9 * * 1 (Australia/Sydney) |
| [tuesday-roadmap-raid-review](./routines/tuesday-roadmap-raid-review/TASK.md) | Launch readiness | Tremor Studio Ops | Program Manager | 30 9 * * 2 (Australia/Sydney) |
| [wednesday-budget-runway-review](./routines/wednesday-budget-runway-review/TASK.md) | Studio operations | Tremor Studio Ops | Founder | 0 10 * * 3 (Australia/Sydney) |
| [thursday-lab-device-health-check](./routines/thursday-lab-device-health-check/TASK.md) | Studio operations | Tremor Studio Ops | Admin and Ops | 30 10 * * 4 (Australia/Sydney) |
| [friday-qa-regression-smoke](./routines/friday-qa-regression-smoke/TASK.md) | Launch readiness | Tremor Studio Ops | SDET Engineer | 0 11 * * 5 (Australia/Sydney) |

Goals are seeded separately at runtime by the bootstrap script, including the milestone sub-goals that sit under the four roadmap branches.

Each starter issue is attached to one of those leaf goals so the issue graph mirrors the roadmap tree.