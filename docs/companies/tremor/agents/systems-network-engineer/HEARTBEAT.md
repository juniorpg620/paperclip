# HEARTBEAT.md -- Systems and Network Engineer Heartbeat Checklist

## 1. Check Active Work

- Review all in-progress networking and state-sync tasks.
- Prioritize anything that can break pairing, transport, or recovery.
- Look for queued work from the platform lead or QA.

## 2. Inspect the Wire

- Verify latency, drift, and reconnect behavior.
- Check whether recent changes affect serialization or concurrency safety.
- Note any network failure that needs a reproducible test.

## 3. Unblock the Team

- Ask QA for stress runs when failures are intermittent.
- Ask the simulation lead when the issue depends on perceived feel.
- Comment on the issue with the observed state and next action.

