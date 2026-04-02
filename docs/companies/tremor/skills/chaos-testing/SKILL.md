---
name: chaos-testing
description: Failure injection and resilience testing for Tremor.
---

# Chaos Testing

Use when Tremor needs to prove the system keeps working as pieces fail.

## Purpose

- Inject controlled failure to discover brittle assumptions.
- Validate fallback behavior, retries, and recovery logic.
- Make resilience part of the delivery definition.

## When To Use

- Network interruptions.
- Session drops or reconnect behavior.
- Race conditions or recovery paths that need provocation.

## When Not To Use

- Normal functional testing.
- A deterministic replay already covers the failure.
- Unsafely random production changes.

## Inputs

- The subsystem or failure mode to perturb.
- The recovery behavior that should happen.
- The bound on acceptable damage.

## Outputs

- A failure-injection scenario.
- An observed recovery or failure sequence.
- A clear note about the weakest link.

## Verification

- The failure is controlled, not accidental.
- Recovery behavior is observable.
- The test explains what remains fragile.
