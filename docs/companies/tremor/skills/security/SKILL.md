---
name: security
description: Access control, release safety, and threat-aware engineering for Tremor.
---

# Security

Use when a change could affect trust, access, secrets, or release safety.

## Purpose

- Keep secrets and access under control.
- Make release risk visible before merge.
- Prevent avoidable exposure or privilege drift.

## When To Use

- Secrets handling.
- Auth, permissions, or data exposure.
- Release or dependency risk review.

## When Not To Use

- Pure UI work.
- Roadmap sequencing.
- Non-sensitive local debugging.

## Inputs

- The system surface.
- Access or secret requirements.
- The release or threat context.

## Outputs

- A risk note or mitigation.
- A safer implementation plan.
- Verification steps for the change.

## Verification

- The sensitive path is explicit.
- The mitigation is testable.
- The remaining risk is stated plainly.
