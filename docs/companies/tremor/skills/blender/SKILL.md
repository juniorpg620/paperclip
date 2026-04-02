---
name: blender
description: 3D asset authoring, cleanup, and export prep for Tremor.
---

# Blender

Use when Tremor needs a 3D asset prepared for the scene or render pipeline.

## Tremor Focus

- Model, clean, and organize assets before they enter the app.
- Keep geometry, scale, and naming discipline explicit.
- Export assets so the downstream pipeline can validate them reliably.

## Workflow

1. Define the asset purpose and target constraints.
2. Prepare the model or scene for export with clean structure.
3. Verify the exported artifact matches the intended scale and material intent.

## Guardrails

- Do not let asset cleanup become hidden design work.
- Do not ship ambiguous scale or broken hierarchy.
- Do not hand off an asset without export verification.
