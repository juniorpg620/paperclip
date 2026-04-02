---
name: automation
description: Repetitive workflow automation for Tremor.
---

# Automation

Use when Tremor needs to remove repetitive manual work from a stable workflow.

## Purpose

- Turn a repeatable human task into a reliable workflow.
- Keep repetitive studio work from living in chat.
- Make the automation's output legible to operators.

## When To Use

- Routine status generation.
- Data shaping or report assembly.
- Repeated workflow steps that should not require manual re-entry.

## When Not To Use

- A one-off exploratory task.
- Deep debugging.
- Work that changes too often to automate safely.

## Inputs

- The repeated task.
- The trigger or schedule.
- The expected output format.

## Outputs

- A repeatable workflow.
- A visible artifact or inbox item.
- A note on failure or skip behavior.

## Verification

- The task runs the same way twice.
- The output is easy to inspect.
- The automation does not hide important decisions.
