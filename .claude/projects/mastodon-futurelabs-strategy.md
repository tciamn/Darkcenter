# Future Labs — Mastodon Strategy & Deployment Roadmap

**Owner:** aasim@tciamn.org — Twin Cities Innovation Alliance  
**Last updated:** 2026-09-14  
**Branch:** `claude/mastodon-setup-nwc3vh`  
**Status:** Strategy defined — pending domain and VPS decisions

---

## Why Mastodon

Mastodon is the leading ActivityPub-compliant federated social platform. It aligns directly with Future Labs' values:

- **Open source** — MIT-licensed, self-hostable, no vendor dependency
- **Digital sovereignty** — your data, your infrastructure, your moderation decisions
- **Fediverse / interoperability** — connects to Pixelfed, PeerTube, Lemmy, Pleroma, and millions of other ActivityPub instances by default
- **Decentralization** — no single point of control; you are the platform
- **Community norms** — Mastodon's culture skews toward tech-adjacent, activist, civic, and cooperative communities — the exact networks TCIA and Future Labs work with

The market context: open-source and civic tech communities have broadly migrated to Mastodon. A Future Labs presence there signals credibility and enables discovery by allied organizations.

---

## Pending Decisions (block deployment)

| Decision | Notes |
|---|---|
| **Domain for instance** | Check availability of `futurelabs.org`, `futurelabs.coop`, `futurelabs.social`, `futurelabs.network` at your registrar. If none are available, fallback is `social.tciamn.org`. |
| **VPS provider** | Recommendation below. Same server that will host Supernote Private Cloud — decide together. |
| **Instance scope** | Staff-only vs. invite-based community (recommendation: start staff-only, expand to invite-based in Phase 2) |
| **Two admins** | Bus factor: who is the second named admin with independent access? |

**Domain check:** Visit namecheap.com or check at GoDaddy for `futurelabs.org / .coop / .social / .network`. The `.coop` TLD requires proof of cooperative status — skip it for now. `.social` is on-brand and usually available for new orgs.

---

## VPS Recommendation for Mastodon

Mastodon requires: Ruby on Rails, PostgreSQL, Redis, Node.js, Sidekiq workers, and object storage for media files. **SiteGround shared hosting cannot run this.**

### Minimum specs for a small instance (< 50 active users)
- 2 vCPU, 4 GB RAM, 40 GB SSD
- S3-compatible object storage for media (separate — don't store media on the VPS disk)

### Recommended specs for Future Labs (room to grow, Supernote + Mastodon on same server)
- 4 vCPU, 8 GB RAM, 80 GB SSD
- Separate object storage (Hetzner Object Storage or Backblaze B2 EU)

### VPS Comparison (values-aligned options you've already assessed)

| Provider | Plan | Cost/mo | RAM | Notes |
|---|---|---|---|---|
| **Hetzner CPX22** ★ Selected | CPX22 | ~$22.99 | 4 GB | AMD shared, Helsinki (EU/Finland), Intel limited in region — CPX22 is Phase 1 start; resize to CPX32 ($41.99, 8 GB) when adding Supernote |
| **Infomaniak** | VPS-4 | ~€10 | 4 GB | Swiss jurisdiction (strongest data sovereignty), values-aligned, EU GDPR |
| **Greenhost** | Medium | ~€12 | 4 GB | Amsterdam, 100% renewable, Rapid Response Team for activist clients |
| **IO Cooperative** | Standard | ~$7.19 | 4 GB | CA cooperative, single US location, no SLA — not recommended for primary |

**Recommendation: Hetzner CX32 in Helsinki or Falkenstein (EU jurisdiction, GDPR applies).**  
If data sovereignty at Swiss level is a priority, Infomaniak VPS-4. Both support Docker and Coop Cloud.

**Object storage:** Hetzner Object Storage (EU, ~€5/mo for 1TB) or Backblaze B2 EU (~$6/TB/mo). Either is S3-compatible and works with Mastodon out of the box.

---

## Architecture

```
Internet (HTTPS)
      ↓
Nginx Reverse Proxy (SSL via Let's Encrypt / certbot)
      ↓
┌─────────────────────────────────────┐
│  Docker Compose (Coop Cloud recipe) │
│                                     │
│  mastodon-web    (port 3000)        │
│  mastodon-sidekiq (background jobs) │
│  mastodon-streaming (port 4000)     │
│  PostgreSQL 14+                     │
│  Redis 7+                           │
└─────────────────────────────────────┘
      ↓
Object Storage (media files — Hetzner or B2 EU)
```

**Deployment method: Coop Cloud** — aligns with Future Labs Phase 1 plan. Coop Cloud has an official Mastodon recipe (`apps/mastodon`). This means:
- Consistent ops model across all Future Labs services
- Coop Cloud handles service orchestration, updates, and secrets management
- Easier to hand off to a second admin

**Fallback: standard Docker Compose** — if Coop Cloud onboarding is delayed, the official `docker-compose.yml` from Mastodon's repo deploys in ~2 hours.

---

## Setup Timeline

This assumes the VPS and domain decisions are made first.

| Phase | Duration | What happens |
|---|---|---|
| **Phase 0: Decisions** | 1–3 days | Confirm domain, VPS provider, instance scope, second admin |
| **Phase 1: Infrastructure** | 1 day | Provision VPS, point DNS, install Docker + Coop Cloud or Compose, configure Nginx + SSL |
| **Phase 2: Mastodon install** | 4–8 hours | Run Mastodon recipe/Compose, run `tootctl` setup, create admin account, set site name/description |
| **Phase 3: Configuration** | 1 day | SMTP for email, object storage, registration settings, moderation defaults, instance rules |
| **Phase 4: Content launch** | 1 week | Write intro post, follow key accounts in your networks, announce to allies |
| **Phase 5: Onboarding** | Ongoing | Invite allied orgs, document user guide, set moderation norms |

**Realistic elapsed time:** 2–3 weeks from "VPS decided" to publicly active instance.  
**Hands-on time:** ~12–16 hours total across phases 1–3.

---

## Domain Strategy

### Option A — Dedicated Future Labs domain (preferred)
`futurelabs.social` or `futurelabs.org`

Handles: `@aasim@futurelabs.social`

Advantages:
- Instance identity is Future Labs, not TCIA subdomain
- Positions Future Labs as a standalone entity from day one
- Easier to onboard allied orgs under a neutral org name
- Handles persist if TCIA DNS/infrastructure changes

Cost: ~$12–25/year depending on TLD. Register at GoDaddy (already your registrar) or Namecheap.

### Option B — TCIA subdomain (fallback)
`social.tciamn.org` → DNS CNAME at GoDaddy → VPS IP

Handles: `@aasim@social.tciamn.org`

Advantages: no new domain cost, already controlled infrastructure
Disadvantage: ties the instance identity to TCIA, not Future Labs

**Recommendation: Option A, futurelabs.social if available.** Check availability before committing.

> **Important:** Mastodon handles (e.g. `@user@domain`) are permanent. If you later want to move from `social.tciamn.org` to `futurelabs.social`, followers can be migrated but the old handle stays as an alias. Start on the domain you intend to keep.

---

## Instance Scope & Moderation

### Start: Staff-only (closed registration)
- TCIA staff and close collaborators only
- Invite-based or admin-approved registration
- Low moderation overhead at launch

### Phase 2: Invite-based community
- Open invites to allied orgs and partners
- Formalize moderation policy before opening
- Consider a Code of Conduct page at `futurelabs.social/about`

### Never: Open registration
Small instances with open registration attract spam and bad actors. Mastodon's moderation tooling handles it, but it costs time. Don't open registration without a moderation plan and team.

---

## Non-Functional Requirements (aligned with Future Labs NFRs)

| Requirement | Target |
|---|---|
| Uptime | 99.5% |
| RTO | < 4 hours |
| RPO | < 24 hours |
| Admin bus factor | ≥ 2 named individuals |
| Data jurisdiction | EU (Hetzner) or CH (Infomaniak) |
| Media storage jurisdiction | EU (Hetzner Object Storage or B2 EU) |

---

## Backup Strategy

Mastodon data to back up:
- **PostgreSQL database** — `pg_dump` daily, compressed, encrypted
- **Redis** — optional (ephemeral queues, reconstructible)
- **`.env.production`** secrets file — encrypted, stored offline
- **Media files** — if self-hosted (if using object storage, provider handles durability)
- **Elasticsearch index** — reconstructible from DB, lower priority

Two-destination minimum (aligns with Future Labs backup policy):
1. Backblaze B2 EU — Restic encrypted backup via cron (primary)
2. Hetzner Storage Box (EU, SFTP) — Restic secondary repo (~€3.39/mo, 100GB)

---

## Alignment with Future Labs Roadmap

| Future Labs Phase | Mastodon role |
|---|---|
| Phase 1 (now–6mo) | Anchor service on VPS alongside Supernote Private Cloud. Establishes presence. |
| Phase 2 (6–18mo) | Allied orgs get accounts on Future Labs Mastodon instance. Social proof of infrastructure. |
| Phase 3 (18mo+) | Consider dedicated Mastodon server as load grows, or federate with allied org instances. |
| Phase 4 (long-term) | ActivityPub and Holochain have complementary decentralization models — explore bridge. |

---

## Immediate Next Steps

```
[ ] 1. Check domain availability: futurelabs.social, futurelabs.org, futurelabs.network
[ ] 2. Decide VPS provider (recommend Hetzner CX32 — same server for Mastodon + Supernote)
[ ] 3. Name the second admin (bus factor requirement)
[ ] 4. Confirm instance scope (staff-only to start)
[ ] 5. Once 1-4 decided: provision VPS, point DNS, begin Phase 1 setup
```

Once these four decisions are confirmed, the technical setup can be scripted and documented in full (`docker-compose.yml`, `.env.production` template, Nginx config, backup scripts).

---

## Related Docs

- Future Labs technical reference: `.claude/projects/hdl-technical-reference.md`
- Future Labs executive summary: `.claude/projects/ldl-executive-summary.md`
- Key decisions log: `.claude/projects/key-decisions.md`
- Supernote Private Cloud: same VPS, same Docker environment
