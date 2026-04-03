---
name: swift-concurrency
description: Structured concurrency, actor safety, and async flow for Tremor.
---

# Swift Concurrency

Use when Tremor code needs async work that stays understandable and safe.

## Purpose

- Keep async behavior structured.
- Make actor boundaries explicit.
- Prevent race conditions from leaking into the play loop.

## When To Use

- Async transport and sync work.
- Actor design.
- Task orchestration and cancellation.

## When Not To Use

- Pure UI styling.
- Small synchronous helpers.
- Non-Swift implementation work.

## Inputs

- The async boundary.
- Ownership and cancellation needs.
- Timing or ordering constraints.

## Outputs

- A safe async pattern.
- A cancellation or retry policy.
- Tests for the concurrency boundary.

## Verification

- Shared state is controlled.
- Cancellation behavior is clear.
- The code is easy to reason about under load.
