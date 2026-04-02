# Org Chart

## How To Use

- Use this to route ownership, escalation, and review.
- If work crosses cells, the cell leads and PM should align before execution.
- Keep the chart stable unless the company structure itself changes.

## Final Division Map

```mermaid
graph TD
    Founder["Founder / Engineering Lead<br/>Strategy, IP, budget"]
    LeadA["Co-Engineering Lead A<br/>Nervous System architecture"]
    LeadB["Co-Engineering Lead B<br/>Sensory engine architecture"]
    TPM["Technical Program Manager<br/>RAID, Git, delivery hygiene"]
    StudioOps["Studio Operations & Logistics<br/>Hardware, lab, procurement"]

    subgraph Leadership["Leadership Cell"]
        Founder
        LeadA
        LeadB
        TPM
    end

    subgraph Nervous["Nervous System Division"]
        NET["Systems Network Engineer<br/>Mesh transport and state sync"]
        OPS["DevSecOps Engineer<br/>CI/CD and release safety"]
    end

    subgraph Sensory["Sensory Engine Division"]
        DSP["DSP Audio Engineer<br/>Timing and pairing"]
        CVR["Computer Vision and AR Engineer<br/>Board ingestion and tracking"]
        GEN["GenAI Architect<br/>Rules and synthesis"]
        MET["Technical Artist<br/>Shaders and materials"]
        SIM["Simulation Engineer<br/>Deterministic chaos and replay"]
    end

    subgraph Fidelity["Fidelity and Quality Division"]
        DZN["Lead Product Designer<br/>Dual-screen flow and haptics"]
        QA["Tools QA Engineer<br/>Regression and HIL"]
        SDET["SDET Engineer<br/>Automation and coverage"]
    end

    Founder --> LeadA
    Founder --> LeadB
    Founder --> TPM
    Founder -.-> StudioOps

    LeadA --> NET
    LeadA --> OPS
    LeadB --> DSP
    LeadB --> CVR
    LeadB --> GEN
    LeadB --> MET
    LeadB --> SIM
    TPM --> DZN
    TPM --> QA
    TPM --> SDET
```

## Design Principle

- Teams own divisions, not just tasks.
- Leadership owns strategy and escalation.
- The PM owns horizontal risk, Git discipline, and delivery hygiene.

## Decision Owner

- Founder / Engineering Lead
