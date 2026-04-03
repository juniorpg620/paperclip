---
name: xcode-cloud
description: Apple build automation and release checks for Tremor.
---

# Xcode Cloud

Use when Tremor needs Apple-native build or test automation for iOS, iPadOS, or tvOS.

## Purpose

- Keep Apple builds reproducible.
- Surface integration issues before release.
- Support device- and simulator-based validation.

## When To Use

- Apple platform builds.
- Cloud-based test runs.
- Release automation for the Apple stack.

## When Not To Use

- Cross-platform app release logic.
- Product planning.
- Non-Apple infrastructure.

## Inputs

- Xcode project and scheme.
- Test targets and device matrix.
- Release expectations.

## Outputs

- A build or test result.
- A failure signal if something regressed.
- A release-ready checkpoint.

## Verification

- The workflow is reproducible.
- Test coverage is visible.
- The output maps to the release plan.
