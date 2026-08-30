# Future Labs — Cooperative Digital Infrastructure

**Owner:** aasim@tciamn.org (TCIA)  
**Status:** Concept / Early Planning  
**Last updated:** 2026-08-30

---

## Vision

Build a cooperatively governed digital infrastructure layer for TCIA and its network — a community tech provider rooted in movement values, similar to May First but owned and operated by Future Labs / TCIA.

---

## What This Could Become

A self-sustaining cooperative tech infrastructure that:
- Hosts services for TCIA member organizations
- Gives communities control over their own digital tools
- Reduces dependence on corporate cloud providers (Google, AWS, Microsoft)
- Operates transparently with member governance over costs and decisions

---

## Stack (Layer by Layer)

| Layer | Tool / Option | Notes |
|---|---|---|
| **Hardware / VPS** | Hetzner (start) → owned servers (scale) | Hetzner ~€4–6/mo to start |
| **Deployment** | Coop Cloud (coopcloud.tech) | FOSS toolkit for deploying apps cooperatively |
| **Governance** | Servers.coop framework | Cost-sharing, decision-making model for coop hosting |
| **File sync** | Nextcloud or Supernote Private Cloud | For members + devices |
| **Communication** | Matrix (chat), Jitsi (video), Postfix (email) | All self-hostable via Coop Cloud |
| **Web hosting** | WordPress, static sites | Via Coop Cloud |
| **Supernote sync** | Supernote Private Cloud (Docker) | Manta + other devices |

---

## Realistic Roadmap

### Phase 1 — Start small (now → 6 months)
- [ ] Spin up a single Hetzner VPS (~€6/mo)
- [ ] Install Coop Cloud on it
- [ ] Deploy Supernote Private Cloud (primary use case)
- [ ] Deploy Matrix for TCIA internal comms
- [ ] Establish basic governance doc (who has access, how costs are shared)

### Phase 2 — Grow the coop (6–18 months)
- [ ] Onboard 2–3 aligned orgs in TCIA's network as members
- [ ] Add Jitsi (video conferencing)
- [ ] Add shared file storage (Nextcloud or alternative)
- [ ] Formalize cost-sharing model using Servers.coop framework
- [ ] Register as a formal cooperative entity if needed

### Phase 3 — Own the hardware (18 months+)
- [ ] Evaluate colocation or owned server hardware
- [ ] Migrate from Hetzner to owned/colo infrastructure
- [ ] Offer services to broader movement organizations
- [ ] Become a node in the federated cooperative hosting network

### Phase 4 — Distributed infrastructure (long term)
- [ ] Explore Holochain-native apps for cooperative data stewardship
- [ ] Run Edge Nodes for the Holo hosting network
- [ ] Build or adopt apps designed for truly distributed infrastructure
- [ ] Move from cooperative governance of servers → cooperative governance without servers

---

## Key Organizations / Resources

| Resource | Link | Notes |
|---|---|---|
| Coop Cloud | https://coopcloud.tech | Deployment toolkit (beta) |
| Servers.coop | https://servers.coop | Governance/cost-sharing framework |
| May First | https://mayfirst.coop | Model to learn from / support |
| Greenhost | https://greenhost.net | EU activist VPS option |
| Infomaniak | https://infomaniak.com | Swiss, employee-owned, reliable |
| IO Cooperative | https://iocoop.org | US coop VPS ($86.25/yr/slice) |
| Hetzner | https://hetzner.com | Cheapest raw VPS (~€4–6/mo) |
| Disroot | https://disroot.org | Free comms layer (NL, donation) |
| Systemli | https://systemli.org | Free activist comms (DE, donation) |
| Framasoft | https://framasoft.org | Digital freedom non-profit (FR) |
| Holochain | https://holochain.org | Distributed app framework (Phase 4) |
| Holo hosting | https://holo.host | Sovereign infrastructure for Holochain apps |

---

## Holochain — Long-Term Infrastructure Vision

Holochain is a fundamentally different infrastructure paradigm — not cooperative governance of servers, but **eliminating the server model entirely**.

### How it works
- **Agent-centric** — each user/org maintains their own cryptographically signed data chain on their own device
- **DHT (Distributed Hash Table)** — shared data lives across peer nodes, not a central database
- **Local-first** — data stays on your device by default, selectively shared with peers
- **Peers validate** data against app rules before storing — no single point of trust or failure
- **Edge Nodes** — community-run containerized nodes that stay always-on when users are offline
- **HTTP gateways** — make DHT data readable by any browser without custom integration
- **Web Conductor** (new 2026) — Holochain apps now accessible in a standard browser

### Why it matters for Future Labs
| Strength | Relevance to TCIA |
|---|---|
| Data commoning | Built for cooperative data stewardship — reduces risk of extraction |
| No central server | True infrastructure sovereignty — nothing to seize or shut down |
| Community Edge Nodes | Future Labs members run nodes, not just consume hosting |
| Agent-centric | Each member org owns its own data chain — no landlord |
| Anti-extraction by design | Aligns with movement values at the protocol level |

### Honest limitations today
- Apps must be **built for Holochain** — cannot run Supernote Private Cloud, WordPress, etc.
- Still maturing — Web Conductor browser support only just landed in 2026
- Small developer pool — fewer ready-made apps vs. traditional stack
- Not a drop-in replacement for anything on the near-term stack

### Positioning in the roadmap
| Phase | Path |
|---|---|
| Phase 1–2 | VPS + Coop Cloud — practical, runs Supernote Private Cloud today |
| Phase 3 | Owned servers + federated coop hosting network |
| Phase 4 | Holochain — distributed apps, Edge Nodes, cooperative data commons |

**Sources:** [Holochain](https://holochain.org) · [Holo hosting](https://holo.host) · [Data Commoning blog](https://blog.holochain.org/data-commoning-with-holochain-pt-1/) · [Holo roadmap](https://holo.host/roadmap/)

---

## Relationship to Supernote Private Cloud Project

The Supernote Private Cloud (`.claude/projects/supernote-private-cloud.md`) is the **first service** that would run on this infrastructure. Starting there gives Future Labs a concrete use case to build around before expanding to serve other orgs.

---

## Open Questions

- What is the legal/governance structure for Future Labs within TCIA?
- Who are the first 2–3 member orgs to onboard?
- Is there existing hardware (server, NAS) available, or start with VPS?
- What's the budget for Phase 1?
- Does TCIA want to join May First as an org while building its own infra in parallel?
