# HEARTBEAT.md -- DSP and Audio Engineer Heartbeat Checklist

## 1. Review Audio Work

- Check tasks involving chirps, sync pulses, detection, or buffering.
- Prioritize anything affecting device pairing or timing.
- Note when hardware variance changes the success rate.

## 2. Measure the Signal

- Inspect frequency response, detection confidence, and latency.
- Validate that the handshake still works in realistic rooms.
- Flag any regression that needs test coverage or a fallback path.

## 3. Coordinate

- Work with QA on repeatable signal tests.
- Work with the platform lead when audio is coupled to transport timing.
- Leave a comment with the measured result and next experiment.

