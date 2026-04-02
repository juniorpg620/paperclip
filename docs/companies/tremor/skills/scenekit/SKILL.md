---
name: scenekit
description: Scene graph composition and camera layout for Tremor.
---

# Scenekit

Use when Tremor needs structured 3D scene composition.

## Tremor Focus

- Organize board surfaces, tokens, cameras, and overlays in a clean scene graph.
- Keep scene composition separate from game state logic.
- Make spatial relationships easy to inspect and adjust.

## Workflow

1. Define the scene hierarchy and camera behavior.
2. Bind state changes to explicit node updates.
3. Validate the composition on the device and at the target aspect ratio.

## Guardrails

- Do not let the scene graph become a hidden state store.
- Do not couple scene composition to unrelated game rules.
- Do not add visual layers that make board readability worse.
