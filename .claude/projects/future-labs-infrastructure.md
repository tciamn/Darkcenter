# Future Labs — Cooperative Digital Infrastructure

**Owner:** aasim@tciamn.org (TCIA)  
**Status:** Concept / Early Planning  
**Last updated:** 2026-09-07

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

## Non-Functional Requirements

These are the conditions the infrastructure must meet beyond just "running the apps." They shape every provider and architecture decision.

### Availability — How much downtime can we tolerate?

**Requirement:** Critical services (Supernote sync, internal comms) should be available at least 99.5% of the time — roughly 44 hours of downtime per year, or less than 4 hours per month.

Why this number: 99.9% (the Hetzner standard) is about 9 hours/year — acceptable for a small coop. We set 99.5% as our floor because we are managing our own failover, not relying on a managed HA product.

Related terms:
- **Uptime / SLA** — a provider's contractual promise about availability. "99.9% SLA" means they guarantee the server is reachable 99.9% of the time. If they miss it, you typically get billing credits, not cash.
- **RTO (Recovery Time Objective)** — how fast we must be back online after a failure. Our target: **under 4 hours** for critical services (Supernote sync, Matrix); **under 24 hours** for everything else.
- **RPO (Recovery Point Objective)** — how much data we can afford to lose. If the server dies at 11pm and our last backup ran at midnight the night before, we lose up to 23 hours of data. Our target: **under 24 hours** (daily backups); ideally under 4 hours for the Supernote database.

---

### Data Sovereignty — Where does the data live?

**Requirement:** All member data must be stored on servers in the EU or Switzerland. US-based storage is acceptable only for backup copies, not primary storage.

Why it matters: US cloud providers (AWS, Google, Azure) are subject to the US Cloud Act, which allows the US government to compel disclosure of data stored anywhere in the world, even if the data belongs to a foreign organization. EU and Swiss law provides stronger protections for activist and community organizations.

Preferred jurisdictions in order:
1. Switzerland (strongest privacy law; not EU but stricter than EU in practice)
2. Netherlands, Germany, Finland (EU, GDPR-protected)
3. United States (acceptable for backup/archival only; not primary storage)

---

### Data Privacy — Who can see member data?

**Requirement:** No member data should be readable by the hosting provider or any third party without explicit consent. Encryption at rest and in transit is required.

In plain terms:
- **Encryption in transit** — data is scrambled while moving between devices and servers (HTTPS/TLS). This is table stakes — any modern server does this.
- **Encryption at rest** — data is scrambled while sitting on disk, so a provider employee or attacker who gets physical access to the drive can't read it. This requires intentional setup.
- Backup files must also be encrypted before they leave the primary server (client-side encryption). Restic and BorgBackup both do this by default.

---

### Operability — Who can run this, and how much effort does it take?

**Requirement:** The infrastructure must be manageable by 1–2 people with intermediate Linux comfort, without requiring full-time sysadmin work. Routine maintenance should take no more than a few hours per month.

This shapes tool choices significantly. It is why we use:
- **Docker Compose** rather than bare installation — services are defined in a single file, easy to restart, upgrade, or move
- **Coop Cloud** rather than hand-crafting everything — pre-built recipes for common FOSS apps
- **Automated backups** rather than manual — humans forget; cron jobs don't
- **Monitoring alerts** (e.g. UptimeRobot free tier) — so failures are caught without someone checking manually

**Bus factor requirement:** At least 2 people must have full admin access (SSH keys, provider account access, backup decryption keys). If one person is unreachable, the other can respond.

---

### Cost — What can we spend?

**Requirement:** Phase 1 infrastructure should cost no more than $30–40/month total, including VPS, backups, and any monitoring tools. Phase 2 (secondary provider) may add $15–30/month.

Cost breakdown target (Phase 1):
| Item | Estimated cost |
|---|---|
| Primary VPS (Hetzner CX32 or equivalent) | ~€7/mo |
| Backup storage — Hetzner Storage Box BX11 | ~€3.20/mo |
| Backup storage — Backblaze B2 EU (archival) | ~$1–3/mo (depends on volume) |
| DNS / monitoring (Cloudflare free + UptimeRobot free) | $0 |
| **Total Phase 1** | **~$15–20/mo** |

---

### Scalability — Can it grow?

**Requirement:** The infrastructure must be able to serve 3–5 member organizations by Phase 2 without a full rebuild. Adding a new org's services should be a configuration change, not a new project.

This is why Coop Cloud (recipe-based deployment) and Docker Compose matter — adding a new Matrix homeserver or Nextcloud instance for a new member org is adding a new service definition, not reinstalling a server.

---

### Movement Values — The non-technical requirement

**Requirement:** Provider choices must reflect TCIA's values. This means prioritizing cooperative, employee-owned, or mission-aligned providers over corporate cloud, even at a small cost premium.

This is not just symbolic. It means:
- Vendor lock-in is a political risk, not just a technical one — data held by a corporate provider can be leveraged against the community
- Transparency in governance and costs is required — member orgs should be able to see what they're paying for and why
- Exit rights — the cooperative must always be able to move to a different provider without losing data or paying extraction fees (egress costs)

**Egress** — in plain language, this is the fee a provider charges you to *take your own data back*. When you upload files to a cloud provider, storing them is cheap. But if you want to download them — to restore a backup, or to move to a different provider — many corporate providers charge per gigabyte of data that leaves their servers. This is called egress. It creates lock-in: leaving becomes expensive. Providers like Backblaze B2 have moved to free or near-free egress as a deliberate choice. AWS and Google charge $0.08–0.09/GB, which adds up to hundreds of dollars for a large dataset. When evaluating providers, always check egress costs — they reveal whether the provider is designed to let you leave freely.

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

## Failover & Resilience Strategy

### Failure modes to plan for

| Scenario | Risk | Mitigation |
|---|---|---|
| Primary VPS goes down | Supernote sync unavailable, comms down | Secondary VPS at different provider |
| Provider-wide outage | All services on that provider fail together | Cross-provider redundancy |
| DNS misconfiguration | Domain unreachable | Low TTL + secondary DNS (Cloudflare free tier, DNS-only) |
| Data loss (disk failure, ransomware) | Permanent data loss | Offsite backups — separate provider, separate geography |
| Operator unavailable | No one can respond | At least 2 admins with access; documented runbook |

---

### Provider Assessment (with failover lens)

Research date: 2026-09-07

#### Hetzner Cloud
- **Regions:** Nuremberg, Falkenstein (DE), Helsinki (FI), Ashburn + Hillsboro (US), Singapore
- **SLA:** 99.9% (cloud credits for missed targets)
- **HA tools:** Floating IPs (per-datacenter failover in seconds via Keepalived), managed Load Balancers from €6.49/mo, private VXLAN networking
- **Snapshots/backups:** Automated daily backups (opt-in, 20% of instance cost); manual snapshots ~€0.01/GB/mo; persistent block Volumes
- **Cross-region failover:** DIY only — Floating IPs don't cross datacenters; requires DNS-level failover
- **Pricing:** CX22 (2 vCPU / 4 GB / 40 GB) €3.79/mo; CX32 (4 vCPU / 8 GB) €6.80/mo
- **Role: Primary or technical secondary.** Best tooling, lowest cost, widest region choice. Cross-DC failover requires DNS or load balancer; not turnkey but well-documented.

#### Infomaniak
- **Regions:** Geneva (CH) + Zurich (CH) — two cities, owned infrastructure
- **SLA:** 99.99% contractual on VPS Cloud; **99.999% on HA Cloud Server** product
- **HA tools:** Dedicated HA Cloud Server cluster product; 99.999% SLA implies hardware-level redundancy. No Floating IP equivalent — failover via HA product tier or DNS.
- **Snapshots/backups:** One free snapshot on VPS Cloud; Swiss Backup add-on (paid) for automated offsite; not automatic by default — must enable
- **Jurisdiction:** Swiss law — strong privacy, not subject to EU enforcement complications or US Cloud Act
- **Pricing:** VPS Cloud from ~€5/mo; HA Cloud Server priced higher (quoted on request)
- **Role: Values-aligned primary or strong secondary.** Best contractual SLA of any listed provider. Swiss jurisdiction is an asset for sensitive data. Geographic diversity from Hetzner (DE/FI vs. CH) makes Hetzner + Infomaniak a solid cross-provider pair.

#### Greenhost
- **Regions:** Amsterdam only (IronMountain DC, 100% Dutch wind energy)
- **SLA:** Negotiated per contract (no public uptime figure)
- **HA tools:** Ceph-based VM storage (storage-level redundancy); no documented HA or Floating IP product; **Rapid Response Team** for activist clients under attack (DDoS, political targeting)
- **Snapshots/backups:** Unclear for bare VPS tier; managed tiers include backups
- **Jurisdiction:** Netherlands / EU
- **Pricing:** ~€5–22/mo estimated (custom pricing, no public tier table)
- **Role: Mission-aligned NL secondary for activist-critical services.** Single location limits technical redundancy. The Rapid Response Team is unique value for orgs facing political threat. Not suitable as sole production provider but meaningful for services where NL jurisdiction and activist support matter.

#### IO Cooperative
- **Regions:** Fremont, CA (US) only — single datacenter (Hurricane Electric FMT2)
- **SLA:** None published
- **HA tools:** None documented. Uses Ganeti VM management. No Floating IP, no load balancer product.
- **Snapshots/backups:** Not publicly documented; likely self-managed
- **Model:** California consumer cooperative — member voting rights, transparent finances
- **Pricing:** 1-slice (1 GB RAM / 25 GB / 10 Mbps) $86.25/yr (~$7.19/mo); max 8 slices ~$57.50/mo
- **Role: Community/values anchor, not production infrastructure.** IO Coop is the most structurally similar entity to Future Labs — genuinely member-owned. However: single US location, no SLA, no failover tools, small scale. Use for non-critical community services or as a cooperative governance reference. Consider membership for solidarity, not for uptime.

#### Servers.coop
- **Type:** NOT a provider — a governance + technical framework for communities to run their own hosting
- **Status:** Active but early-stage. Built on Capsul (AGPL VMaaS platform); affiliated with UK CoTech cooperative network
- **Current availability:** No public VPS signup. Must connect with a CoTech member running a live Capsul instance
- **Role: Future community node.** Monitor for when live instances are available through allied cooperatives. Not deployable today as a production provider.

---

### Recommended Provider Stack

| Role | Provider | Why |
|---|---|---|
| **Primary VPS** | Hetzner | Cost, tooling, multiple EU regions, Floating IPs |
| **Secondary / failover** | Infomaniak | Swiss jurisdiction, 99.99% SLA, no geographic overlap with Hetzner |
| **Activist-tier services** | Greenhost | NL jurisdiction, Rapid Response Team |
| **Backup storage (fast restore)** | Hetzner Storage Box (BX21 5TB €10.90/mo) | Same-account, native BorgBackup/rsync, unlimited traffic |
| **Backup storage (offsite archival)** | Backblaze B2 EU ($6.95/TB/mo) | S3-compatible, EU region, provider-diverse from Hetzner, free egress up to 3× monthly storage |
| **Community values node** | IO Cooperative | Membership for governance solidarity; non-critical services only |

**Hetzner + Infomaniak as the primary pair** gives EU geographic diversity (DE/FI vs. CH), provider diversity, and strong-but-different SLAs, at a combined cost that's still reasonable. Both support Docker. Cross-provider failover uses DNS cutover (low TTL, Cloudflare DNS-only as secondary resolver).

---

### Failover Architecture by Phase

**Phase 1 (single primary VPS):**
- Primary: Hetzner CX32 (~€6.80/mo)
- Backups: Hetzner Storage Box BX11 (1TB, €3.20/mo) + Backblaze B2 EU for provider-diverse copy
- DNS: Low TTL (300s or less) on `cloud.tciamn.org` so failover cutover is fast
- Secondary DNS resolver: Cloudflare free tier (DNS-only, no proxying)
- Manual failover runbook: document restore-from-backup steps; assume 2am scenario
- Comms fallback: May First email/XMPP if Matrix is down

**Phase 2 (active secondary):**
- Add Infomaniak VPS as secondary; mirror critical services (Supernote sync, Matrix)
- Services tiered by criticality — sync/comms on primary; static/low-criticality on secondary
- Floating IP on Hetzner for fast intra-DC failover; DNS-level for cross-provider
- Automated health checks (e.g. UptimeRobot free tier) trigger alert on primary failure

**Phase 3+ (owned hardware):**
- Colocation with geographic split; Hetzner or Infomaniak as warm standby
- Evaluate whether Greenhost fits as a third node for activist-sensitive services

---

### Backup Strategy (minimum viable)

- **What:** Supernote Private Cloud (MariaDB dump + uploaded files), Matrix database, Docker Compose configs + `.env` files
- **Where:** Two destinations — Hetzner Storage Box (fast restore) + Backblaze B2 EU (cold archival)
- **Tool:** Restic or BorgBackup (both well-documented with Hetzner Storage Box; Restic supports B2 natively)
- **Schedule:** Daily automated; weekly test restore of a random backup
- **Retention:** 30-day rolling

### May First as continuity layer

TCIA holds a May First org membership. May First's role in this stack is resilience, not hosting:
- **Nextcloud:** Offsite backup destination (third copy, US-based)
- **Email:** Fallback if self-hosted Matrix is down
- **XMPP:** Secondary comms channel

May First is not part of the primary or secondary VPS decisions.

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
