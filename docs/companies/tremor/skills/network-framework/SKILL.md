---
name: network-framework
description: Apple-native transport, sync boundaries, and concurrency safety for Tremor.
---

# Network Framework

Use when building the local-first transport, sync discipline, or any concurrency boundary that can destabilize play.

## Purpose

- Build the transport spine that keeps devices in sync.
- Make concurrency boundaries explicit and reviewable.
- Keep fallback behavior and error handling visible.

## When To Use

- Local device sync.
- Session lifecycle and reconnect logic.
- Any code path that bridges shared state across devices or tasks.

## When Not To Use

- Pure UI polish.
- Deep simulation or sensory tuning.
- General project management.

## Inputs

- Transport requirements.
- Concurrency and state ownership boundaries.
- Latency, fallback, and security constraints.

## Outputs

- A bounded implementation plan.
- Tests or instrumentation for the transport path.
- A clear fallback story if the primary path fails.

## Verification

- Shared state is not implicit.
- Reconnect and failure modes are testable.
- The implementation is deterministic enough to replay.
