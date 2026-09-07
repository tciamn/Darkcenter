# Future Labs — Executive Summary (Low Detail Level)

**For:** Board members, member org leaders, and anyone involved in the decision — no technical background assumed.  
**Owner:** aasim@tciamn.org  
**Last updated:** 2026-09-07

---

## What is Future Labs?

Future Labs is TCIA's plan to build its own digital infrastructure — servers, apps, and file storage — that TCIA and its allied organizations control, rather than renting those services from Google, Amazon, or Microsoft.

Think of it like owning your building instead of renting office space. The monthly cost is similar, but you're not at your landlord's mercy, you set the rules, and your data doesn't belong to a corporation.

---

## What problem does it solve?

Right now, TCIA's digital tools depend on corporate platforms:
- Files live on Google Drive or Dropbox — companies that profit from your data and can shut off access
- Syncing, communication, and backups flow through services TCIA doesn't control
- If a platform changes its terms, raises prices, or gets pressured by hostile actors, TCIA has no alternative ready

Future Labs builds the alternative *before* it's needed.

---

## What is the first project?

**Supernote Private Cloud** — a self-hosted sync server for Supernote devices (the Manta and others).

Right now, Supernote devices sync through Supernote's own cloud servers. We want to run our own instead, on hardware TCIA controls. The result looks identical to the user — same sync, same experience — but the data never leaves TCIA's infrastructure.

This is also the anchor use case for Future Labs. Getting this working proves the infrastructure, establishes the process, and gives us something concrete to govern and maintain before scaling.

---

## What will it cost?

**Phase 1 (now → 6 months): ~$15–20/month**

| What | Why | Cost |
|---|---|---|
| Primary server (VPS in Europe) | Runs the Supernote sync service and Matrix chat | ~€7/mo |
| Backup storage (two destinations) | Daily backups in case the server fails | ~€3–6/mo |
| Monitoring + DNS (free tier tools) | Alerts when something goes down | $0 |

**Phase 2 (6–18 months): add ~$15–30/month** for a second server in a different location, so a single outage doesn't take everything down.

These costs can be shared across member organizations as Future Labs grows.

---

## What decisions are still needed?

1. **Which server do we use for Phase 1?** Options are a rented server in Europe (recommended: Hetzner ~€7/mo or Infomaniak in Switzerland ~€5+/mo) or repurposing existing hardware. See the technical reference for the full comparison.

2. **What subdomain do we use?** For example, `cloud.tciamn.org`. DNS is currently managed through SiteGround and would stay there — we just add a record pointing to the new server.

3. **What is the governance structure for Future Labs within TCIA?** Who makes decisions, who has admin access, how are costs shared with member orgs?

4. **Who are the first 2–3 allied orgs to bring onto the infrastructure?**

---

## What is the relationship with May First?

TCIA is already an org member of May First Movement Technology. **May First is not the hosting solution for this project** — TCIA is building its own infrastructure. But May First's services (Nextcloud storage, email, XMPP chat) serve as a backup and fallback layer: if Future Labs services go down, May First's tools provide continuity.

---

## What is the long-term vision?

**Phase 1–2:** VPS servers running cooperative apps — Supernote sync, Matrix, Nextcloud, Jitsi, WordPress  
**Phase 3:** Owned hardware; other movement organizations pay into the cooperative to use the infrastructure  
**Phase 4:** Eventually, distributed infrastructure that doesn't depend on servers at all (Holochain) — data lives across peer devices, with no single point of failure or control

---

## What's the timeline?

| Phase | Window | Key milestone |
|---|---|---|
| Phase 1 | Now → 6 months | Supernote Private Cloud running; Matrix deployed; backups tested |
| Phase 2 | 6–18 months | Second server, first allied orgs onboarded, cost-sharing model defined |
| Phase 3 | 18 months+ | Owned hardware; formal cooperative entity if appropriate |
| Phase 4 | Long term | Holochain and distributed infrastructure |

---

## Related documents

- **Full technical reference:** `.claude/projects/hdl-technical-reference.md`
- **Key decisions log:** `.claude/projects/key-decisions.md`
- **Supernote setup details:** `.claude/projects/supernote-private-cloud.md`
- **Shareable briefing (link to share in conversations):** https://claude.ai/code/artifact/89beb9f3-c4b0-4a50-a5e9-42d8b674baaa
