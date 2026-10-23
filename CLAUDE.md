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
| Git hosting (Future Labs) | Codeberg (Phase 1) → self-hosted Gitea (Phase 2) | codeberg.org/futurelabs | — |
| Data Center Tool | Not yet deployed — pending validation | TBD subdomain | GoDaddy |
| Future Labs server | Hetzner CPX22, Helsinki (EU) — `futurelabs-ma-1`, Ubuntu 26.04, provisioned 2026-09-19 | — | — |
| Future Labs Mastodon | **LIVE** since 2026-09-19 — all containers healthy (2026-10-19); email, backups, second admin pending | futurelabs.social | GoDaddy |
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

**Status: Blocked — server shared with Mastodon; waits on Mastodon backups + email, server resize, subdomain**

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
adding Supernote**. Mastodon is live on it, so the resize
needs a short planned shutdown and a backup first (none exists yet) — 40 GB is below Supernote's 50 GB minimum. Mastodon media lives in Hetzner Object
Storage, not on the server disk.
Location: **Helsinki** — confirmed by `docs/HANDOFF-2026-10-23.md`. Older mentions of Falkenstein or Berlin are superseded.

**Pending decisions:**
- [x] VPS provider: **Hetzner CPX22, Helsinki (EU)** — shared with Mastodon, provisioned 2026-09-19
- [ ] Resize `futurelabs-ma-1` to CPX32 — after backups exist; needs a planned shutdown of live Mastodon
- [ ] Confirm subdomain: `cloud.tciamn.org`?
- [ ] Begin setup after Mastodon email + backups are resolved

**Once decided:** Docker Compose + `.env` + Nginx config template is documented in `.claude/projects/hdl-technical-reference.md`

**Non-functional requirements:**
- Uptime target: 99.5%
- RTO critical services: < 4 hours
- RPO: < 24 hours (daily backups)
- Admin bus factor: 2 (two people with independent full access)
- Primary data jurisdiction: EU or Switzerland — no US primary storage

**Backup strategy:** Two-destination minimum — Backblaze B2 EU (Restic, primary) + Hetzner Storage Box EU (Restic secondary, SFTP).
Replaced May First Nextcloud as secondary.  
Full backup architecture in `.claude/projects/hdl-technical-reference.md`.

---

### 3. Future Labs Mastodon

Fediverse presence for Future Labs at `futurelabs.social`.

**Status: LIVE — partial configuration pending**

**Deployed 2026-09-19:**
- Domain: `futurelabs.social` — registered at GoDaddy, A record → `2.29.7.30`
- VPS: Hetzner CPX22, Helsinki (EU) — hostname `futurelabs-ma-1`, Ubuntu 26.04 LTS
- Stack: Docker Compose, Mastodon v4.3.2, PostgreSQL 17, Redis 7, Nginx, Let's Encrypt
- Object storage: Hetzner Object Storage Helsinki, bucket `futurelabs-mastodon`
- Admin account: `aasim` (Owner role)
- SSH key: `~/.ssh/hetzner_futurelabs` on owner's Mac

**Pending (blocks full operation):**
- [ ] Email setup — Mailgun account disabled by fraud detection; switch to Brevo (brevo.com, EU, free tier)
- [ ] Admin UI configuration — branding, registration mode (invite-only), contact info
- [ ] Second admin — bus factor requirement unmet (≥ 2 admins required)
- [ ] Backups — database unprotected; Restic setup not started (see README.md Step 9)
- [ ] Ops credentials document — both admins must hold independently

**Operations:** `deploy/mastodon/OPERATIONS.md` — recovery, service management, troubleshooting  
**Deployment config:** `deploy/mastodon/` — docker-compose.yml, .env.production.template, nginx.conf, setup.sh, backup.sh, README.md

---

### 4. Future Labs Infrastructure

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
- Should TCIA join May First as an org? (solidarity value, but not infrastructure dependency)
- Who holds admin credentials (must be ≥ 2 named individuals)

**Detailed docs:**
- Executive summary (non-technical): `.claude/projects/ldl-executive-summary.md`
- Technical reference: `.claude/projects/hdl-technical-reference.md`
- Key decisions log: `.claude/projects/key-decisions.md`
- Shareable briefing: https://claude.ai/code/artifact/89beb9f3-c4b0-4a50-a5e9-42d8b674baaa

---

### 5. Git Hosting — GitHub → Codeberg Migration

**Status: Decided — not yet started**

**Decision:** Codeberg (EU, nonprofit, Forgejo-based) as primary git host for Future Labs. GitHub kept as public mirror for discoverability during transition.

**Phase 1: Codeberg**
- Create organization at codeberg.org/futurelabs
- Mirror `tciamn/Darkcenter` and other active repos
- New Future Labs repos start on Codeberg
- GitHub remains as read-only public mirror

**Phase 2: Self-hosted Gitea on Hetzner VPS**
- After Mastodon has been stable for 30 days and VPS headroom confirmed
- `git.futurelabs.social` — DNS A record at GoDaddy
- Migrate from Codeberg → self-hosted (same Forgejo/Gitea data format)

**Migration steps (Phase 1):**
```
1. Create Codeberg account + futurelabs org
2. Mirror Darkcenter: Codeberg → New repo → Migration → from GitHub URL
3. Set default branch to main on Codeberg
4. Update CLAUDE.md repo reference
5. Keep GitHub repo — set description to "Mirror — primary at codeberg.org/futurelabs"
```

**Jurisdiction:** Codeberg e.V. — registered nonprofit, Germany (EU). Data stored in EU. No US primary storage.

---

### 6. Squarespace → WordPress Migration

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

### 7. Supernote Manta + Nomad — Sideload and Sync

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
| Supernote Manta / Nomad | A5 X2 / A6 X2 | E-ink notes — see Project 7 |

All Macs and the iPad are on the Tailscale mesh. Downloads for the Macs: Apple Silicon (`arm64`) builds.
**OGMax is a MacBook, not an iPhone** — earlier entries that said "iPhone OG Max" were wrong.

---

## Branch Map

| Branch | Contents | Status |
|---|---|---|
| `main` | All branches merged — fully up to date as of 2026-09-14 | Active |
| `claude/mastodon-setup-nwc3vh` | Mastodon deploy config, operations playbook, DEVBOX.md, HANDOFF-2026-10-23 | Merged into `claude/new-session-3rslbm` (PR #10) 2026-10-23; still active |
| `claude/what-broke-this-should-be-uh7vcn` | Complete React app + all HTML pages | Already in main (confirmed 2026-09-14) |
| `claude/squarespace-page-config-yydjup` | React components, doc generators, docs/*.docx | Merged to main 2026-09-14 (PR #7) |
| `claude/ios-27-ipad-terminal-app-pcpdua` | iPad terminal app + Define/Build/QA skills | Merged to main 2026-09-14 (PR #5) |
| `claude/siteground-wordpress-setup-al3hdi` | Future Labs project docs in `.claude/projects/` | Reference only |
| `claude/new-session-3rslbm` | `supernote-devices/`, look-first hook, reconciled CLAUDE.md, includes the Mastodon branch | PR #10 — open |
| `claude/moss-fork-transition-plan` | Moss fork plan; device inventory (ported here) | Not merged |
| `claude/macwhisper-terms-privacy-or2cwa` | `handoffs/` — infrastructure brief v1.4, KORE | Reference |

---

## Key Decisions Made

| Decision | Status |
|---|---|
| DNS managed at GoDaddy | Confirmed |
| WordPress on SiteGround stays for WordPress hosting | Confirmed |
| Data Center Tool: not deployed until validated | Confirmed |
| Future Labs Phase 1: Hetzner CPX22 (Helsinki, EU) + Docker Compose | Confirmed 2026-09-16 |
| `futurelabs-ma-1` hosts Mastodon + Supernote Private Cloud | Confirmed 2026-09-15 |
| Future Labs Mastodon domain: futurelabs.social | Confirmed 2026-09-15 |
| futurelabs.social registered at GoDaddy | Done 2026-09-19 |
| Hetzner CPX22 provisioned (Helsinki, Ubuntu 26.04) | Done 2026-09-19 — IP 2.29.7.30 |
| Mastodon v4.3.2 deployed and live | Done 2026-09-19 |
| Object storage: Hetzner Helsinki, bucket futurelabs-mastodon | Done 2026-09-19 |
| Holochain: Phase 4 only | Confirmed |
| Two-destination backup minimum | Confirmed |
| Primary data jurisdiction: EU or Switzerland | Confirmed |
| Git hosting Phase 1: Codeberg (EU nonprofit, Forgejo-based) | Confirmed 2026-09-16 |
| Git hosting Phase 2: self-hosted Gitea on Hetzner VPS | Planned — after Mastodon stable 30 days |
| Email provider: switch from Mailgun to Brevo (EU) | Decided 2026-10-18 — not yet implemented |

## Key Decisions Pending

| Decision | Where it blocks |
|---|---|
| **Backup setup (Restic) — Mastodon database has no backup** | Data protection; blocks resize + Supernote |
| Email setup (Brevo) | Mastodon signups + password reset |
| Second admin named | Bus factor requirement |
| Admin UI configured | Instance branding + registration mode |
| Subdomain for Supernote Private Cloud | DNS config + SSL |
| Subdomain for Data Center Tool | Deployment (after validation) |
| Future Labs governance structure | Onboarding allied orgs |
| First allied orgs to onboard | Phase 2 planning |
| TCIA org membership in May First | Solidarity decision — separate from backup strategy |
| Codeberg org created + Darkcenter mirrored | Git sovereignty Phase 1 |
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

---

## Digital Sovereignty — Full Stack Principle

Sovereignty is not only about where data is stored. It applies to every layer of the stack.

| Layer | Sovereign practice |
|---|---|
| DNS | Owner controls the registrar directly |
| Server jurisdiction | EU or CH — no US primary |
| SSH keys | Generated on owner's hardware only — never in a cloud session |
| Secrets and credentials | Generated and stored on owner's hardware — never in a cloud AI session |
| Setup execution | Infrastructure operations run from owner's machine, not a third-party cloud session |
| Config templates | Safe to create in any environment; filled values stay with the owner |
| Backups | Two destinations, owner-controlled encryption keys |

### When the steward must flag an environment shift

A cloud Claude Code session (remote) is the right place for: planning, writing config files, documentation, git commits, research.

It is the **wrong place** for: SSH key generation, running secrets commands, SSHing into servers, handling `.env` values, or any operation where the output must persist beyond the session or must not pass through a third party.

**The steward must proactively flag a shift to the owner's local machine when:**
- The next step involves generating a cryptographic key or secret
- The next step requires a direct network connection (SSH, database, VPN)
- The next step produces output that must outlive the session
- The next step touches infrastructure the owner must retain sole access to

Do not wait for the owner to ask. Surface the boundary before reaching it.

### Co-powering principle

The owner does not know all technical patterns. The steward's role is to recognize when a decision or workflow is approaching a sovereignty compromise — even when the owner cannot see it — and name it clearly before proceeding. This is not gatekeeping. It is the steward actively closing the gap between intent (sovereignty) and execution (the actual path taken).

When a pattern conflict is spotted: name it, explain why it conflicts, and state the correct path. This applies to infrastructure decisions, tool choices, data flows, and execution environments alike.
