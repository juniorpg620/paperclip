# Interview Rubrics

## Leadership Interviews

### Founder / Engineering Lead

- Ask for a systems architecture whiteboard that covers authority, state sync, and failure modes.
- Require a concrete explanation of how Swift 6 concurrency prevents races.
- Red flag: hand-wavy opinions without a precise ownership model.

### Co-Engineering Lead A / Platform and Networking Lead

- Ask for a platform architecture whiteboard that covers ownership, sync, and failure modes.
- Require a concrete explanation of transport tradeoffs and reliability.
- Red flag: abstraction without operational detail.

### Co-Engineering Lead B / Simulation and Sensory Lead

- Ask for a design exercise that translates physics events into tactile and audio feedback.
- Require a deterministic simulation strategy across devices and refresh rates.
- Red flag: good taste without hard simulation reasoning.

### Technical Program Manager

- Ask for a mock RAID scenario with a critical red metric and shifting dependencies.
- Require a recovery plan that protects burn and schedule at the same time.
- Red flag: project-management language without technical specificity.

### Studio Operations and Logistics

- Ask how they would keep a device farm, lab inventory, and hardware checkout process sane.
- Require evidence of operational rigor and traceability.
- Red flag: treating operations as informal admin work.

## Specialist Interviews

### Systems and Network Engineer

- Test AWDL, Multipeer, fallback design, and encryption judgment.
- Look for latency awareness, packet discipline, and platform-specific knowledge.

### Platform and DevSecOps Engineer

- Test CI/CD, secrets, deployment hygiene, and release-safety judgment.
- Look for disciplined automation and careful infrastructure reasoning.

### DSP and Audio Engineer

- Test FFT intuition, ultrasonic signal design, and audio-clock reasoning.
- Look for low-latency performance instincts and clear math.

### Computer Vision and AR Engineer

- Test board detection, calibration, AR mapping, and model deployment.
- Look for practical vision-system tradeoffs, not just model familiarity.

### GenAI Architect

- Test RAG design, rule extraction, and search-augmented synthesis.
- Look for reliable pipeline design and prompt/agent discipline.

### Technical Artist

- Test Metal shader literacy, procedural generation, and rendering performance.
- Look for the ability to make things feel materially grounded.

### Lead Product Designer

- Test haptic UX thinking, motion, and dual-screen interaction patterns.
- Look for precision around feel, pacing, and interface hierarchy.

### SDET Engineer

- Test automation architecture, test generation, and HIL system design.
- Look for a bias toward making tests cheaper and more representative.

### Simulation Engineer

- Test simulation design, chaos modeling, and failure discovery strategy.
- Look for comfort with large-scale randomized validation.

### Tools QA Engineer

- Test latency measurement, thermal testing, and stress harnesses.
- Look for disciplined instrumentation and repeatability.

## Scoring Lens

- Required: can operate independently in the stated domain.
- Preferred: brings adjacent depth that shortens the path to production.
- Bloom level 3 matters most for the lead-heavy roles.
