---
name: test-architecture
description: Test harness design and coverage structure for Tremor.
---

# Test Architecture

Use when Tremor needs to decide how verification should be organized.

## Tremor Focus

- Decide what belongs in unit, integration, hardware, or stress coverage.
- Keep the verification stack understandable to the team.
- Build harnesses that fit the work graph, not just the code tree.

## Workflow

1. Map the failure modes and the confidence you need from each layer.
2. Choose the cheapest harness that can still catch the class of failure.
3. Define the ownership and rerun cadence for the harness.

## Guardrails

- Do not put every check into one monolithic test system.
- Do not create harnesses no one can interpret or maintain.
- Do not confuse coverage breadth with actual confidence.
