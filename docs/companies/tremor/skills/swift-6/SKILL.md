---
name: swift-6
description: Swift 6 language features and strictness for Tremor.
---

# Swift 6

Use when Tremor code needs stricter Swift safety or modern language features.

## Purpose

- Use the language mode that makes concurrency safer.
- Keep compile-time strictness working for the team.
- Prefer language-level clarity over cleverness.

## When To Use

- Migration work.
- Strict concurrency fixes.
- Language feature adoption.

## When Not To Use

- Non-Swift work.
- Product planning.
- UI copy changes.

## Inputs

- The code path to update.
- Compiler or migration constraints.
- Strictness goals.

## Outputs

- A safer Swift implementation.
- A migration note or follow-up.
- A verified compile path.

## Verification

- The code compiles in the intended mode.
- Concurrency warnings are addressed.
- Behavior remains stable.
