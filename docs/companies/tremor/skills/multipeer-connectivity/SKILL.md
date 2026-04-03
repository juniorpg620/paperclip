---
name: multipeer-connectivity
description: Local peer discovery, session lifecycle, and fallback transport for Tremor.
---

# Multipeer Connectivity

Use when Tremor needs nearby-device discovery, session formation, or a fallback local transport path.

## Purpose

- Keep nearby devices talking without a central server.
- Make discovery and connection state explicit.
- Provide a practical fallback when the primary path is unavailable.

## When To Use

- iPhone/iPad pairing.
- Device discovery on the local network.
- Session fallback where Apple-native peer discovery is the right tool.

## When Not To Use

- Internet-scale transport.
- Pure state-model work.
- UI-only changes.

## Inputs

- Peer discovery requirements.
- Session ownership and reconnect policy.
- Expected device roles.

## Outputs

- A discoverable peer set.
- A stable session lifecycle.
- A clear reconnect and teardown path.

## Verification

- Discovery works on real nearby devices.
- Disconnect and reconnect behavior is observable.
- Fallback behavior is documented and testable.
