---
name: swiftui
description: Declarative Apple UI composition for Tremor.
---

# SwiftUI

Use when Tremor needs user interface code that stays stable and readable.

## Purpose

- Compose screens without losing view-tree clarity.
- Keep UI state and model ownership obvious.
- Make UI changes easy to review.

## When To Use

- Screen composition.
- Navigation and state-driven UI.
- SwiftUI refactors.

## When Not To Use

- Pure design research.
- Backend or transport code.
- Non-UI scripting.

## Inputs

- The screen or component.
- State and binding needs.
- Layout constraints.

## Outputs

- A readable SwiftUI view.
- Clear state ownership.
- A UI path that can be tested.

## Verification

- The view is easy to reason about.
- State updates stay predictable.
- The layout matches the intended flow.
