---
name: coreml
description: On-device model inference and evaluation for Tremor.
---

# Coreml

Use when Tremor needs a model to run locally on device.

## Tremor Focus

- Package, run, and measure on-device classifiers or regressors.
- Keep inference bounded by the device budget and privacy requirements.
- Prefer local execution when the model is part of gameplay, calibration, or validation.

## Workflow

1. Define the model task, input shape, and success threshold.
2. Measure accuracy, latency, and memory on target hardware.
3. Compare the packaged model against a known baseline before shipping.

## Guardrails

- Do not use Core ML when a simpler deterministic rule is enough.
- Do not ship a model without device-level validation.
- Do not let model packaging obscure the source and version of the weights.
