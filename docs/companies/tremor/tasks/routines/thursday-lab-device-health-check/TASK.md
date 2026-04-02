---
assignee: "Admin and Ops"
kind: task
metadata:
  paperclip:
    goalSlug: studio-operations
    workType: routine
name: "Thursday lab and device health check"
project: studio-ops
recurring: true
schema: agentcompanies/v1
slug: thursday-lab-device-health-check
---

## Summary

Verify the lab, device farm, and procurement picture for the next test window.

## Cadence

- Schedule: 30 10 * * 4 (Australia/Sydney)
- Recurring: true
- Project: Tremor Studio Ops

## Expected Output

- A visible update in the activity log.
- The owning agent knows what changed and what should happen next.
- Missed runs should be easy to reason about.
