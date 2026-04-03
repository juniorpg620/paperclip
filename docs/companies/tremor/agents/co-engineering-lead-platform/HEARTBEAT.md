# HEARTBEAT.md -- Platform and Networking Lead Heartbeat Checklist

## 1. Review Inbound Work

- Check all assigned platform, networking, and state-sync issues.
- Prioritize anything touching the trunk, sync correctness, or reconnect logic.
- Identify blockers that need simulation or QA support.

## 2. Verify the Pipe

- Inspect latency-sensitive work for race conditions and state drift.
- Confirm any protocol or serialization change preserves determinism.
- Review logs or traces when failures are reported.

## 3. Coordinate

- Pull in the simulation lead when behavior depends on the physical feel of the system.
- Pull in QA when failure reproduction or latency measurement is needed.
- Leave a comment that states the current status and the next owner.

