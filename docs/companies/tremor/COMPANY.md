---
authors:
  - "Embr Labs"
description: "Local-first Apple ecosystem game studio for tactile board-game experiences."
goals:
  - "Ship Tremor alpha"
  - "Platform foundation"
  - "Sensory engine"
  - "Launch readiness"
  - "Studio operations"
  - "Authoritative state model"
  - "Local mesh transport"
  - "Rule ingestion and synthesis"
  - "Board ingestion and calibration"
  - "Timing, haptics, and audio"
  - "Render and simulation fidelity"
  - "Milestone control and RAID"
  - "Regression harness and QA automation"
  - "Release safety and dual-screen readiness"
  - "Lab readiness and device health"
  - "Budget and runway discipline"
  - "Approvals and onboarding hygiene"
includes:
  - ./teams/leadership/TEAM.md
  - ./teams/nervous-system/TEAM.md
  - ./teams/sensory-engine/TEAM.md
  - ./teams/fidelity-quality/TEAM.md
  - ./projects/flight-plan/PROJECT.md
  - ./projects/studio-ops/PROJECT.md
  - ./tasks/README.md
kind: company
name: Tremor
requirements:
  secrets:
    - APPLE_DEVELOPER_ACCOUNT
    - OPENAI_API_KEY
    - ANTHROPIC_API_KEY
schema: agentcompanies/v1
slug: tremor
tags:
  - game-studio
  - apple
  - local-first
  - r-and-d
---

# Tremor

Tremor is a $4.5M R&D studio building local-first, Apple-native board-game systems that combine deterministic networking, shared-screen presentation, and tactile feedback.

## Operating Thesis

- Wired-first, AirPlay-fallback later.
- Authoritative state lives on the hub.
- iPhone and iPad act as tactile clients.
- TV is the shared board and spectator surface.
- The product should feel physically grounded before it feels expansive.

## Company Shape

- Leadership Cell: founder, program manager, and both co-engineering leads set company direction and coordinate the delivery spine.
- Nervous System Division: platform networking and DevSecOps own deterministic transport, release integrity, and the authoritative runtime.
- Sensory Engine Division: simulation, audio, vision, technical art, and GenAI own the tactile and perceptual layer of the product.
- Fidelity and Quality Division: product design, QA, and SDET own the player-facing quality bar, release readiness, and verification feedback loop.
- Studio operations is support work led from Leadership Cell through the `Tremor Studio Ops` project rather than a separate division tree.

## Work Graph

- The company goal is seeded at runtime: `Ship Tremor alpha`.
- Branch goals are `Platform foundation`, `Sensory engine`, `Launch readiness`, and `Studio operations`.
- `Tremor Flight Plan` carries the first three branches: platform foundation, sensory engine, and launch readiness.
- `Tremor Studio Ops` carries the studio operations branch and the recurring operating cadence that supports the delivery work.
- Each branch is decomposed into three leaf goals so the roadmap, projects, and issues all point at the same execution spine.
- The live company should have 17 goals, 15 issues, and 5 recurring routines after bootstrap.

## What Good Looks Like

- A first playable slice with deterministic state sync.
- Stable local mesh connectivity across multiple devices.
- A clear skills matrix for every hire.
- A working onboarding guide for every agent.
- Metrics for latency, haptic jitter, and board fidelity.
