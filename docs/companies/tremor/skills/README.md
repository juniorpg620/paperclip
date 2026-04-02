# Tremor Skills

Local skill packages used by the Tremor company template.

## How To Read This Library

1. Start with the skill family that matches the work graph node you are touching.
2. Use the role appendix to decide whether the skill is primary, verification, or coordination support.
3. Prefer the smallest skill that answers the question without crossing into another owner's lane.

## Coverage

- Governance and planning: `strategy`, `company-ops`, `roadmap-management`, `risk-management`, `raid`, `git-governance`
- Platform and transport: `swift-concurrency`, `swift-6`, `network-framework`, `multipeer-connectivity`, `serialization`, `deterministic-systems`
- Sensory and rendering: `cplusplus`, `core-audio`, `core-haptics`, `metal`, `arkit`, `coreml`, `vision`, `vision-search`, `pbr-texturing`, `blender`, `scenekit`, `synthetic-data`
- Product and experience: `ux-design`, `swiftui`, `motion-design`, `haptics`
- Verification and QA: `hardware-testing`, `automation`, `playwright`, `latency-benchmarking`, `qa-automation`, `stress-testing`, `test-architecture`, `test-analysis`, `simulation`, `chaos-testing`
- Research and synthesis: `retrieval`, `generative-ai`, `python`, `dsp`, `signal-processing`
- Release hygiene and infrastructure: `ci-cd`, `xcode-cloud`, `security`, `artifact-integrity`

## Notes

- These skills are local to the Tremor package and tuned for the current company graph.
- The shared `paperclipai/...` catalog skills remain the base layer; the Tremor-local skills tighten ownership and operating clarity on top of them.
- If a role needs a skill outside this library, add it intentionally rather than spreading generic docs across unrelated domains.
