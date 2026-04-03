---
name: retrieval
description: Source search, citation handling, and retrieval workflows for Tremor.
---

# Retrieval

Use when Tremor needs to find, package, or cite source material.

## Tremor Focus

- Keep the source path attached to the extracted context.
- Return compact context that a downstream agent can use directly.
- Prefer retrieval over re-deriving known facts.

## Workflow

1. Identify the source corpus and the query.
2. Pull the smallest context set that answers the question.
3. Confirm the answer still matches the source before reusing it.

## Guardrails

- Do not overwrite provenance with a paraphrase.
- Do not pad the answer with unrelated context.
- Do not claim retrieval output as original analysis.
