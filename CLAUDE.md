# TCIA / Future Labs — Project Context

**Owner:** aasim@tciamn.org — Twin Cities Innovation Alliance  
**Repo:** tciamn/Darkcenter  
**Last updated:** 2026-09-07 (git hosting decision added)

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
| Supernote Private Cloud | Not yet deployed — pending VPS decision | cloud.tciamn.org (proposed) | GoDaddy |

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
- `public/opensource_creators_timeline.html` — Open Source Founders Tree + Resource Guide (4,012 lines, QA'd)
- `public/opensource_timeline.html` — The Open Source Tree (dark terminal aesthetic)
- `public/futurelabs_opensource_v1.2.html` — Future Labs LSW brand variant
- `data/fallback.json` — 30 states of impact data
- Two-layer data strategy: Google Sheets (live) → fallback.json

**Data sources:** FracTracker Alliance · Oil & Gas Watch · IM3 · EPA eGRID · EIA · EDGAR · COBRA

**Branch status:**
- `claude/what-broke-this-should-be-uh7vcn` — complete app, not merged to main
- `claude/squarespace-page-config-yydjup` — current working branch; has fixed creators timeline HTML
- `main` — behind; Friday branch work not yet merged

**When validation is done:**
- Deploy to Netlify (supports React + env vars)
- Create subdomain at GoDaddy pointing to Netlify deployment
- Subdomain name: TBD (recommendation: `data.tciamn.org` or `impact.tciamn.org`)

---

### 2. Supernote Private Cloud

Self-hosted Docker sync server for Supernote devices (Manta, iPad, iPhone OG Max).  
Official Ratta software. Identical user experience to Supernote's cloud — data stays on TCIA infrastructure.

**Status: Blocked — pending VPS decision and subdomain confirmation**

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

**Pending decisions:**
- [ ] Which VPS provider?
- [ ] Confirm subdomain: `cloud.tciamn.org`?

**Once decided:** Docker Compose + `.env` + Nginx config template is documented in `.claude/projects/hdl-technical-reference.md`

**Non-functional requirements:**
- Uptime target: 99.5%
- RTO critical services: < 4 hours
- RPO: < 24 hours (daily backups)
- Admin bus factor: 2 (two people with independent full access)
- Primary data jurisdiction: EU or Switzerland — no US primary storage

**Backup strategy:** Two-destination minimum — Backblaze B2 EU (Restic) + May First Nextcloud (Rclone).  
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
- May First is a backup/fallback layer, not the hosting solution

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

## Branch Map

| Branch | Contents | Status |
|---|---|---|
| `main` | Base repo — behind on React app | Needs Friday branch merged |
| `claude/what-broke-this-should-be-uh7vcn` | Complete React app + all HTML pages | Not merged |
| `claude/squarespace-page-config-yydjup` | Fixed creators timeline HTML | Active working branch |
| `claude/siteground-wordpress-setup-al3hdi` | Future Labs project docs in `.claude/projects/` | Reference only |

---

## Key Decisions Made

| Decision | Status |
|---|---|
| DNS managed at GoDaddy | Confirmed |
| WordPress on SiteGround stays for WordPress hosting | Confirmed |
| Data Center Tool: not deployed until validated | Confirmed |
| Future Labs Phase 1: Hetzner/Infomaniak VPS + Coop Cloud | Confirmed |
| Holochain: Phase 4 only | Confirmed |
| Two-destination backup minimum | Confirmed |
| Primary data jurisdiction: EU or Switzerland | Confirmed |
| Git source hosting: migrate from GitHub → self-hosted Forgejo | Pending — timing tied to Phase 1 VPS decision; direct migration, skip Codeberg |

## Key Decisions Pending

| Decision | Where it blocks |
|---|---|
| VPS provider for Supernote/Future Labs | Supernote Private Cloud setup |
| Subdomain for Supernote Private Cloud | DNS config + SSL |
| Subdomain for Data Center Tool | Deployment (after validation) |
| Future Labs governance structure | Onboarding allied orgs |
| First allied orgs to onboard | Phase 2 planning |
| TCIA org membership in May First | Backup strategy |

---

---

## Architecture Decision Log

### ADR-001 — Git Source Hosting: GitHub → Self-Hosted Forgejo (Phase 1)
**Date:** 2026-09-07  
**Status:** Under consideration — not yet decided  
**Decider:** aasim@tciamn.org

#### Decision Under Review
The question is whether and when to migrate git hosting away from GitHub. Two options were considered: Codeberg (EU nonprofit, immediate) and self-hosted Forgejo on the Phase 1 VPS (deferred, once VPS is live). **Current recommendation: stay on GitHub until Phase 1 VPS is live, then migrate once directly to self-hosted Forgejo — skip Codeberg as an intermediate step.**

#### Why Not Codeberg Now
The code in this repository is open source by intent — designed to be freely distributed. There is no PII, no credentials, and no sensitive data in the repo. The GitHub / US jurisdiction risk (CLOUD Act) is real but low severity for this specific use case. Migrating to Codeberg would introduce disruption mid-sprint (VPS undecided, tool unvalidated, Squarespace migration in progress) for a marginal short-term benefit. The better path is one migration, directly to infrastructure TCIA controls.

#### NFR Drivers

| NFR | Requirement | GitHub | Codeberg |
|---|---|---|---|
| Data jurisdiction | EU or CH — no US primary storage | Fails — Microsoft US servers, CLOUD Act exposure | Passes — Germany, EU jurisdiction |
| Vendor lock-in | Must be self-hostable or portable | Fails — proprietary platform, account suspension risk | Passes — Forgejo is open source, self-hostable on Phase 1 VPS |
| Open source | Infrastructure should use open source tooling where viable | Fails — GitHub is proprietary (Actions, Issues, API) | Passes — Forgejo is fully open source |
| Admin bus factor | ≥ 2 named individuals with independent full access | Passes — org admins supported | Passes — org admins supported |
| Backup / RPO | RPO < 24 hours; two-destination minimum | Passes — git is distributed; every clone is a full backup | Passes — same; two remotes maintained during transition |
| Digital sovereignty | TCIA controls its own infrastructure path | Fails — dependent on Microsoft policy decisions | Passes — roadmap leads to self-hosted on TCIA VPS |

#### Logic
Git (the protocol) is portable by design — every clone is a full copy of the repository history. Switching the remote platform does not touch a single line of code. The decision is purely about where the canonical remote lives and who controls it. GitHub fails the primary data jurisdiction NFR (US servers, CLOUD Act) and the digital sovereignty NFR (Microsoft controls account access). Codeberg satisfies both and is a direct drop-in replacement with no code changes required.

#### Risks and Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Codeberg has no formal SLA (nonprofit) | Medium | Keep GitHub as a live mirror during transition; every local clone is also a full backup; RTO < 4h is achievable because git is distributed |
| Loss of GitHub MCP integration (Claude Code issue/PR tooling) | Low–Medium | Git CLI operations (push, pull, branch) are unaffected — Claude uses these natively. Issue/PR creation requires Forgejo REST API calls rather than MCP tools. Acceptable tradeoff for sovereignty. |
| Netlify requires webhook reconfiguration | Low | One-time setup — Netlify supports any git remote via webhook. Estimated 30 minutes of work. |
| Team unfamiliarity with Codeberg UI | Low | Interface is nearly identical to GitHub. No training required beyond one orientation session. |
| GitHub Actions → Forgejo Actions | Low | Forgejo Actions uses the same YAML syntax as GitHub Actions. Existing workflows are compatible. |
| Dependency on Codeberg's continued operation | Low | Self-hosted Forgejo on Phase 1 VPS eliminates this risk within 6 months. |

#### Migration Steps (when ready to execute)

1. **Create TCIA org on Codeberg** — codeberg.org → register → create org `tciamn`
2. **Create repo** — `tciamn/Darkcenter` on Codeberg (empty, no README)
3. **Mirror push** — `git push --mirror https://codeberg.org/tciamn/Darkcenter` — copies all branches, tags, and full history
4. **Verify** — confirm all branches and history are present on Codeberg
5. **Update local remotes** — `git remote set-url origin https://codeberg.org/tciamn/Darkcenter`
6. **Add GitHub as mirror remote** — `git remote add github https://github.com/tciamn/Darkcenter` — keep for read-only public visibility
7. **Update Netlify** — Site Settings → Build → change repo to Codeberg URL; add deploy webhook
8. **Update CLAUDE.md** — change repo reference from `tciamn/Darkcenter` (GitHub) to Codeberg URL
9. **Archive GitHub repo** — set to read-only / archived with a notice pointing to Codeberg
10. **Phase 1 VPS (0–6 months)** — install Forgejo on VPS; migrate Codeberg → self-hosted

**Prerequisite:** User must create Codeberg account and org before steps 2–9 can execute. Steps 3–9 can be done in a single Claude Code session once credentials are available.

---

## Working Conventions

- Version control: git, BDD alignment
- Data sovereignty: EU/CH jurisdiction preferred for primary storage
- Never commit `.env` files
- Always QA before checkout or deploy
- Review first, reduce tech debt later
- Do not act before direction is confirmed — wait for guidance
- Subdomains: created at GoDaddy, not SiteGround
