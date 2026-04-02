---
assignee: "Systems Network Engineer"
kind: task
metadata:
  paperclip:
    epicSlug: platform-foundation
    goalSlug: platform-local-mesh-transport
    parentSlug: platform-authoritative-state
    workType: issue
name: "Systems network transport"
project: flight-plan
schema: agentcompanies/v1
slug: systems-network-transport
---

## Summary

Implement the Apple-native mesh and networking behavior for the board and clients.

## Acceptance Criteria

- The transport strategy is documented and mapped to the actual Apple APIs in use.
- Connectivity fallback behavior is explicit for wired, local, and fallback paths.
- The solution is ready for measurement and regression testing.
