# Key Decisions — TCIA / Future Labs

**Owner:** aasim@tciamn.org  
**Last updated:** 2026-09-07 (rev: TCIA is a May First org member)

---

## 1. Supernote Private Cloud — Hosting Decision

**Status: Pending**

Ratta's official Docker-based private cloud requires Linux + Docker. SiteGround (current WordPress host) cannot run Docker.

**Options under consideration:**

| Option | Cost | Movement alignment | VPS/Docker |
|---|---|---|---|
| Hetzner (raw VPS) | ~€4–6/mo | Corporate (Germany) | ✅ |
| Greenhost | ~€5.75+/mo | Activist/EU | ✅ |
| Infomaniak | ~$28+/mo | Employee-owned (CH) | ✅ |
| May First | ~$45–70/mo (hosting plan) | Coop/movement (US) — TCIA is an org member but **not using for hosting** | ✅ |
| IO Cooperative | $86.25/yr/slice | Coop (US) | ✅ |

**Decisions needed:**
- [ ] Which server/VPS to use?
- [ ] Subdomain for private cloud (e.g. `cloud.tciamn.org`)? DNS currently managed at SiteGround.

**Once decided:** Generate Docker Compose + `.env` + configure Nginx reverse proxy.

---

## 2. Future Labs — Infrastructure Path

**Status: Decided (direction), planning underway**

Future Labs will build cooperative digital infrastructure for TCIA and its network — a self-hosted alternative to corporate cloud.

**Phase 1 decision: Start with VPS + Coop Cloud**

- Use Hetzner (~€4–6/mo) or movement-aligned VPS as the host
- Deploy apps via [Coop Cloud](https://coopcloud.tech) (FOSS self-hosting toolkit)
- First service: Supernote Private Cloud

**Deferred to later phases:**
- Servers.coop governance framework (Phase 2–3)
- Owned/colo hardware (Phase 3)
- Holochain distributed apps (Phase 4)

---

## 3. Holochain — Long-Term, Not Near-Term

**Status: Decided — Phase 4 only**

Holochain cannot run standard Docker apps (Supernote, WordPress, etc.). Web Conductor browser support only just landed in 2026. Not a drop-in replacement for anything in the near-term stack.

**Decision:** Track Holochain for Phase 4 (distributed app infrastructure). Do not evaluate it for Phases 1–3.

---

## 4. May First — TCIA Org Membership

**Status: Confirmed — TCIA is already a May First org member**

- **TCIA** holds an org membership (separate from any personal steward membership).
- May First is **not** the chosen path for Supernote Private Cloud or Future Labs hosting. TCIA will build its own infrastructure via Future Labs rather than rely on May First for VPS/hosting.
- The relationship with May First is valued for other reasons (comms, solidarity, etc.) but is not part of the infrastructure decision.

---

## 5. WordPress/SiteGround — Keep As-Is

**Status: Decided**

SiteGround hosts the current TCIA WordPress site and manages DNS for `tciamn.org`. It will remain in place for WordPress hosting. A subdomain (e.g. `cloud.tciamn.org`) pointing to the Future Labs VPS is the planned split.

---

## Reference

- Supernote Private Cloud project: `.claude/projects/supernote-private-cloud.md`
- Future Labs Infrastructure: `.claude/projects/future-labs-infrastructure.md`
- Shareable briefing: https://claude.ai/code/artifact/89beb9f3-c4b0-4a50-a5e9-42d8b674baaa
