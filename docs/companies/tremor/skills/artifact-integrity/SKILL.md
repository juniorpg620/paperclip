---
name: artifact-integrity
description: Provenance, hashes, and trustworthy artifacts for Tremor.
---

# Artifact Integrity

Use when Tremor needs to trust that an artifact is complete, current, and attributable.

## Purpose

- Preserve provenance for generated outputs.
- Make artifact drift visible.
- Keep imports and exports trustworthy.

## When To Use

- Generated docs or assets.
- Release bundles.
- Any file that should match a known source state.

## When Not To Use

- Exploratory drafts.
- Temporary scratch work.
- Personal notes with no provenance requirement.

## Inputs

- The source artifact.
- The expected identity or version.
- The integrity check that matters.

## Outputs

- A validated artifact.
- A provenance note or hash.
- A mismatch report if something changed.

## Verification

- The artifact matches the source.
- Drift is obvious.
- The owner can reproduce the result.
