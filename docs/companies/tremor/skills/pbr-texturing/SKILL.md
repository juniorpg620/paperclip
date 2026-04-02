---
name: pbr-texturing
description: Materials, textures, and surface readability for Tremor.
---

# Pbr Texturing

Use when Tremor needs surfaces that read correctly under the target lighting.

## Tremor Focus

- Keep textures, roughness, and color response aligned with the scene.
- Make materials readable on the board and on a TV display.
- Preserve source provenance for texture generation and baking.

## Workflow

1. Define the material intent and the viewing conditions.
2. Tune texture maps and PBR parameters against the target asset.
3. Validate readability in the actual lighting and camera setup.

## Guardrails

- Do not use texture detail to hide bad asset structure.
- Do not assume one lighting setup generalizes to every scene.
- Do not lose the source of a baked or generated texture.
