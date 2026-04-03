---
assignee: "SDET Engineer"
kind: task
metadata:
  paperclip:
    goalSlug: launch-readiness
    workType: routine
name: "Friday QA and regression smoke"
project: studio-ops
recurring: true
schema: agentcompanies/v1
slug: friday-qa-regression-smoke
---

## Summary

Run the weekly smoke check, confirm regressions, and capture anything that needs follow-up.

## Cadence

- Schedule: 0 11 * * 5 (Australia/Sydney)
- Recurring: true
- Project: Tremor Studio Ops

## Expected Output

- A visible update in the activity log.
- The owning agent knows what changed and what should happen next.
- Missed runs should be easy to reason about.
