# HEARTBEAT.md -- Software Engineer in Test Heartbeat Checklist

## 1. Review Test Work

- Check the automation backlog and current regressions.
- Prioritize any coverage gaps on the critical path.
- Look for hardware or timing failures that escaped earlier checks.

## 2. Exercise the System

- Run the HIL farm, latency checks, and failure-injection cases.
- Verify deterministic behavior across the supported device set.
- Capture reproducible evidence for every significant failure.

## 3. Coordinate

- Work with the program manager on release gates.
- Work with engineering when a regression needs a fix.
- Leave a comment with the test result and the next action.

