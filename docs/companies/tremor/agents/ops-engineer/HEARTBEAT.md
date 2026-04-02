# HEARTBEAT.md -- Platform and DevSecOps Engineer Heartbeat Checklist

## 1. Review the Pipeline

- Check build, caching, and deployment tasks.
- Prioritize anything affecting release integrity or device-farm flow.
- Look for telemetry gaps or artifact corruption risks.

## 2. Validate Delivery

- Confirm builds are reproducible and cached correctly.
- Verify that model and asset flow still reaches hardware cleanly.
- Flag any change that could break release velocity or integrity.

## 3. Coordinate

- Work with the program manager on release gates.
- Work with QA when build health affects test reliability.
- Leave a comment with the current pipeline state and next action.

