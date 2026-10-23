# TCIA / Future Labs — Project Context

**Owner:** aasim@tciamn.org — Twin Cities Innovation Alliance  
**Repo:** tciamn/Darkcenter  
**Last updated:** 2026-10-23

Read this file at the start of every session. It is the authoritative context for all active work.

---

## Infrastructure Map

| Layer | Platform | URL | DNS |
|---|---|---|---|
| Main site | Squarespace | www.tciamn.org | GoDaddy |
| App / D4PG content | WordPress on SiteGround | app.tciamn.org | GoDaddy |
| Open source pages | Squarespace code blocks | www.tciamn.org/open-source | GoDaddy |
| Static assets | GitHub Pages (tcia-admin/tcia-website) | tcia-admin.github.io/tcia-website/main/open-source/ | — |
| Data Center Tool | Not yet deployed — pending validation | TBD subdomain | GoDaddy |
| Future Labs server | Hetzner, Helsinki (EU) — `futurelabs-ma-1`, provisioned (DEVBOX.md, 2026-10-19) | — | — |
| Future Labs Mastodon | Docker Compose on `futurelabs-ma-1` — deployment state unconfirmed | futurelabs.social | GoDaddy |
| Supernote Private Cloud | Not yet deployed — planned for `futurelabs-ma-1` | cloud.tciamn.org (proposed) | GoDaddy |
| Supernote Manta (A5 X2) + Nomad (A6 X2) | End-user devices on Supernote **beta** firmware; sideload setup scaffolded, nothing installed | Sync today: **Supernote Cloud (hosted by Supernote)**. Target: Private Cloud and/or WebDAV (ADR pending) | — |

**DNS is managed at GoDaddy — not SiteGround.** Subdomains are created there as CNAME or A records.

**Migration direction:** Content is moving FROM Squarespace TO WordPress. Squarespace is transitional, not the destination.

---

## Active Projects

### 1. Data Center Impact Tool (Darkcenter)

A React app showing energy demand, emissions, and health impacts of 2,820 US data centers.

**Status: Development complete — NOT YET VALIDATED**  
Do not deploy. Do not create a subdomain. Validation must happen before any of that.

**What exists:**
- Complete React app on branch `claude/what-broke-this-should-be-uh7vcn` (Friday branch, Sept 4–5)
- `public/embed.html` — fully self-contained standalone tool (30 states inline, no build step)
- `public/ipad_terminal.html` — self-contained terminal iPad app (offline, home-screen capable, WCAG 2.1 AA) — merged to main 2026-09-14
- `public/opensource_creators_timeline.html` — Open Source Founders Tree + Resource Guide (4,012 lines, QA'd)
- `public/opensource_timeline.html` — The Open Source Tree (dark terminal aesthetic)
- `public/futurelabs_opensource_v1.2.html` — Future Labs LSW brand variant
- `data/fallback.json` — 30 states of impact data
- Two-layer data strategy: Google Sheets (live) → fallback.json
- `.claude/skills/` — `/define`, `/build`, `/qa` slash commands (BDD workflow) — merged to main 2026-09-14

**Data sources:** FracTracker Alliance · Oil & Gas Watch · IM3 · EPA eGRID · EIA · EDGAR · COBRA

**Branch status:**
- `claude/what-broke-this-should-be-uh7vcn` — complete app, not merged to main
- `claude/squarespace-page-config-yydjup` — current working branch; has fixed creators timeline HTML
- `claude/ios-27-ipad-terminal-app-pcpdua` — iPad terminal app + Define/Build/QA workflow skills — **merged to main 2026-09-14**
- `main` — behind on React app (Friday branch); iPad terminal + workflow skills now included

**When validation is done:**
- Deploy to Netlify (supports React + env vars)
- Create subdomain at GoDaddy pointing to Netlify deployment
- Subdomain name: TBD (recommendation: `data.tciamn.org` or `impact.tciamn.org`)

---

### 2. Supernote Private Cloud

Self-hosted Docker sync server for Supernote devices (Manta, Nomad, iPad).  
Official Ratta software. Identical user experience to Supernote's cloud — data stays on TCIA infrastructure.

**Status: Blocked — pending server resize and subdomain confirmation**

**Architecture:**
```
Supernote Device (HTTPS)
        ↓
Nginx Reverse Proxy (SSL via Let's Encrypt)
        ↓
Supernote Private Cloud Service (HTTP, port 19072)
        ↓
MariaDB + Redis (Docker containers)
```

**Requirements:** Linux, Docker, 50 GB disk min, 2 GB RAM, domain pointing to server  
**SiteGround cannot host this** — shared hosting does not support Docker.

**VPS options (assessed):**

| Provider | Cost | Notes |
|---|---|---|
| Hetzner CX32 | ~€6.80/mo | Recommended. Best tooling, widest region choice, lowest cost. |
| Infomaniak | ~€5+/mo | Values-aligned, Swiss jurisdiction, 99.99% SLA. |
| Greenhost | ~€5–22/mo | Mission-aligned Amsterdam, Rapid Response Team for activist clients. |
| IO Cooperative | ~$7.19/mo | CA coop, solidarity value, single US location, no SLA — non-critical only. |

**Server (decided 2026-09-15, branch `claude/mastodon-setup-nwc3vh`):** Hetzner, shared with Mastodon on
`futurelabs-ma-1` (Helsinki, EU). Starts as CPX22 (4 GB RAM, 40 GB disk); **resize to CPX32 (8 GB) before
adding Supernote** — 40 GB is below Supernote's 50 GB minimum. Mastodon media lives in Hetzner Object
Storage, not on the server disk.
**Location conflict — confirm:** records say Falkenstein (early CLAUDE.md), Helsinki (Mastodon branch, DEVBOX.md 2026-10-19)
and Berlin (`docs/handoff-2026-10-02-instruction-validation.md`). Helsinki is the newest and most specific; treated as current until confirmed.

**Pending decisions:**
- [x] VPS provider — Hetzner, `futurelabs-ma-1` (see above)
- [ ] Resize `futurelabs-ma-1` to CPX32
- [ ] Confirm subdomain: `cloud.tciamn.org`?

**Once decided:** Docker Compose + `.env` + Nginx config template is documented in `.claude/projects/hdl-technical-reference.md`

**Non-functional requirements:**
- Uptime target: 99.5%
- RTO critical services: < 4 hours
- RPO: < 24 hours (daily backups)
- Admin bus factor: 2 (two people with independent full access)
- Primary data jurisdiction: EU or Switzerland — no US primary storage

**Backup strategy:** Two-destination minimum — Backblaze B2 EU (Restic, primary) + Hetzner Storage Box EU (Restic, SFTP, secondary).
(Replaced May First Nextcloud as secondary — branch `claude/mastodon-setup-nwc3vh`.)  
Full backup architecture in `.claude/projects/hdl-technical-reference.md`.

---

### 3. Future Labs Infrastructure

Cooperatively governed digital infrastructure for TCIA and allied organizations.  
The Supernote Private Cloud is Phase 1's anchor service.

**Status: Direction decided — planning underway**

**Roadmap:**

| Phase | Window | Milestone |
|---|---|---|
| Phase 1 | Now → 6 months | VPS + Coop Cloud; Supernote Private Cloud + Matrix running; backups tested |
| Phase 2 | 6–18 months | Second server, first allied orgs onboarded, cost-sharing model defined |
| Phase 3 | 18 months+ | Owned hardware, formal cooperative entity |
| Phase 4 | Long term | Holochain distributed infrastructure |

**Decided:**
- Phase 1 stack: Hetzner (or values-aligned VPS) + Coop Cloud
- Holochain is Phase 4 only — cannot run standard Docker apps, not near-term
- May First is a fallback layer, not the hosting solution
- Hetzner Storage Box (EU) is the secondary backup destination — no Nextcloud dependency

**Open questions:**
- Legal/governance structure for Future Labs within TCIA
- First 2–3 allied orgs to onboard
- Should TCIA join May First as an org while building own infra?
- Who holds admin credentials (must be ≥ 2 named individuals)

**Detailed docs:**
- Executive summary (non-technical): `.claude/projects/ldl-executive-summary.md`
- Technical reference: `.claude/projects/hdl-technical-reference.md`
- Key decisions log: `.claude/projects/key-decisions.md`
- Shareable briefing: https://claude.ai/code/artifact/89beb9f3-c4b0-4a50-a5e9-42d8b674baaa

---

### 4. Squarespace → WordPress Migration

Moving content from Squarespace (`www.tciamn.org`) to WordPress on SiteGround (`app.tciamn.org`).

**Status: In progress — using subdomain pattern**

**Pattern:** New content goes on WordPress. Subdomains at GoDaddy route to each content area.  
Squarespace stays in place during transition; pages migrate one by one.

**What's live on Squarespace now:**
- `/open-source` — Open Source Founders Tree (creators timeline + resource guide). Recently fixed: was displaying raw HTML due to "Display Source" toggle. Now rendering correctly.

**WordPress (app.tciamn.org):** D4PG 2026 content. Work done in other sessions.

**Sprint 1 scope (current):**
1. Confirm subdomain name for Data Center Impact Tool (parked until validation)
2. Merge Friday branch (`claude/what-broke-this-should-be-uh7vcn`) to `main`
3. Identify first Squarespace content block to migrate to WordPress
4. Define governance/decision ownership for Future Labs

---

### 5. Supernote Manta + Nomad — Sideload and Sync

Prepare the Manta (A5 X2) and Nomad (A6 X2) for daily use: sideloading, F-Droid, a file manager, KOReader,
Kobo Books, and a self-hosted sync path. The Kindle app is out of scope.
Both devices carry the same apps and settings (confirmed 2026-10-23); every step runs on each device.

**Status: Scaffolded 2026-10-23 — nothing run against the devices. Foundation update pending.**

**Current state (confirmed by owner 2026-10-23):**
- Devices: Manta (A5 X2) and Nomad (A6 X2), both on the Supernote **beta** firmware channel
- Sync: Supernote Cloud, hosted by Supernote — a third party, outside TCIA control and the EU/CH jurisdiction target
- **Notes are only in Supernote Cloud — no backup we control.** A verified export is step 0, before the firmware update, sideloading or any sync change
- Moving to Private Cloud is a migration: export and verify a full copy of notes before any sync target changes

**What exists** (`supernote-devices/`, branch `claude/new-session-3rslbm`):
- `CLAUDE.md` — device rules: confirm before any device-changing command, manifest entry before any download, no credentials/serials/server addresses in git, LAN/VPN only until TLS + auth verified, Docker images pinned by tag + digest
- `manifest/apps.yaml` — app list; source, version, sha256 and signer all blank until recorded
- `scripts/` — `device_check.sh` (read-only), `verify_apk.sh` (sha256 + signer), `install_apk.sh` (`--confirm` + typed yes, no retries)
- `features/` — 6 Gherkin features, each with a failure scenario
- `docs/decisions/` — ADR 0001 Kobo Books source, ADR 0002 sync path (both Proposed)

**Depends on:** Project 2. Syncing to `cloud.tciamn.org` waits on the `futurelabs-ma-1` resize.
Step 0 (export) can go to the NAS on OGMax now — no server needed. Private Cloud needs recent device firmware and image
tag 26.02.23 or newer — both unverified.

---

## Devices

Source: `handoffs/unXPs-infrastructure-handoff-brief_2026-08-10_v1.4.md` (branch `claude/macwhisper-terms-privacy-or2cwa`),
ported from branch `claude/moss-fork-transition-plan`.

| Name | Device | Role |
|---|---|---|
| OGMax | M1 MacBook Max, 64 GB | Primary co-working station, Ollama host, KORE training |
| Onyx / Dark Matter | M3 MacBook Pro Max, 36 GB, 14" | Mobile co-working unit, travel machine |
| Pluto | Mac Mini | Always-on home server — partially configured |
| M4 iPad | iPad M4 | Replaced 2026-10-16, restored from backup — reconfirmation pending |
| NAS | Connected to OGMax — model not recorded | Not configured (owner, 2026-10-23) |
| Supernote Manta / Nomad | A5 X2 / A6 X2 | E-ink notes — see Project 5 |

All Macs and the iPad are on the Tailscale mesh. Downloads for the Macs: Apple Silicon (`arm64`) builds.
**OGMax is a MacBook, not an iPhone** — earlier entries that said "iPhone OG Max" were wrong.

---

## Branch Map

| Branch | Contents | Status |
|---|---|---|
| `main` | All branches merged — fully up to date as of 2026-09-14 | Active |
| `claude/what-broke-this-should-be-uh7vcn` | Complete React app + all HTML pages | Already in main (confirmed 2026-09-14) |
| `claude/squarespace-page-config-yydjup` | React components, doc generators, docs/*.docx | Merged to main 2026-09-14 (PR #7) |
| `claude/ios-27-ipad-terminal-app-pcpdua` | iPad terminal app + Define/Build/QA skills | Merged to main 2026-09-14 (PR #5) |
| `claude/siteground-wordpress-setup-al3hdi` | Future Labs project docs in `.claude/projects/` | Reference only |
| `claude/new-session-3rslbm` | `supernote-devices/` scaffold + this CLAUDE.md update | Not merged |
| `claude/mastodon-setup-nwc3vh` | Mastodon deploy config (`deploy/mastodon/`), DEVBOX.md, Hetzner decision | Not merged |
| `claude/moss-fork-transition-plan` | Moss fork plan; device inventory (ported here) | Not merged |
| `claude/macwhisper-terms-privacy-or2cwa` | `handoffs/` — infrastructure brief v1.4, KORE | Reference |

---

## Key Decisions Made

| Decision | Status |
|---|---|
| DNS managed at GoDaddy | Confirmed |
| WordPress on SiteGround stays for WordPress hosting | Confirmed |
| Data Center Tool: not deployed until validated | Confirmed |
| Future Labs Phase 1: Hetzner/Infomaniak VPS + Coop Cloud | Confirmed |
| Hetzner `futurelabs-ma-1` (Helsinki) hosts Mastodon + Supernote Private Cloud | Confirmed 2026-09-15 |
| Holochain: Phase 4 only | Confirmed |
| Two-destination backup minimum | Confirmed |
| Primary data jurisdiction: EU or Switzerland | Confirmed |

## Key Decisions Pending

| Decision | Where it blocks |
|---|---|
| Subdomain for Supernote Private Cloud | DNS config + SSL |
| Subdomain for Data Center Tool | Deployment (after validation) |
| Future Labs governance structure | Onboarding allied orgs |
| First allied orgs to onboard | Phase 2 planning |
| TCIA org membership in May First | Backup strategy |
| Manta/Nomad sync target: `futurelabs-ma-1` or NAS | Device sync scenarios (ADR 0002) |
| Does the EU/CH rule cover owner-held hardware (NAS in the US)? | NAS as primary store |
| Kobo Books source: Aurora Store or verified APK | Kobo install (ADR 0001) |
| Where `supernote-devices/` lives: this repo or its own | Long-term repo layout |

---

## Working Conventions

- Version control: git, BDD alignment
- Data sovereignty: EU/CH jurisdiction preferred for primary storage
- Never commit `.env` files
- Always QA before checkout or deploy
- Review first, reduce tech debt later
- Do not act before direction is confirmed — wait for guidance
- **Look first, ask second.** Before asking for context, search all remote branches (`git grep <term> $(git branch -r)`), `handoffs/` and `.claude/projects/`. Ask only for what isn't recorded, and cite where you found what is.
- Subdomains: created at GoDaddy, not SiteGround
- Workflow: `/define` → `/build` → `/qa`. **Known broken (handoff 2026-10-02, branch `ccr-a35270a1-8ifduu`):** the skills are flat
  `.claude/skills/*.md` files and don't load (need `<name>/SKILL.md`), and the push hook reads an env var that isn't set.
  The fix and the proposed instruction-validation protocol are waiting on Operator review.
- A SessionStart hook (`.claude/hooks/look-first.sh`) lists every remote branch at session start so recorded context is checked first.
