# Moss Fork + Git Transition — Session Handoff

**Saved:** 2026-10-17 · **Owner:** Future Labs (standalone entity — not TCIA; TCIA may be a user)
**Resume point:** back on Dark Matter with the full error and folder listing.

---

## 1. Where we are

**Goal:** a working Moss build so Future Labs can begin beta UX/UI and usability testing.

**Symptoms (past week, Dark Matter):**
- Tools (assets) intermittently fail to load.
- Moss drops to "searching for peers"; two peers online at the same time never see each other.
- VPNs and Tailscale disabled — no change.
- Full error as shown by Moss (confirmed by the operator): `no such table: DhtOp`
  - Moss shows no further context. It means Holochain opened a database file that lacks its `DhtOp` table — typically an empty or partially created database, or one from a different schema. Check database file sizes (§3).

**Versions (verified 2026-10-17 from git tags):**

| Line | Version | Date | Holochain |
|---|---|---|---|
| Stable (installed) | v0.15.8 | 5 June | 0.6.1 (`0.6.1-rc.7` pinned in repo — unconfirmed for the 0.15.8 build) |
| Pre-release | v0.16.0-rc.1 (test.24) | 16 Oct | 0.7.1 — own profile folder, groups/tools do not carry over, network-partitioned from stock Moss |

GitHub's "Latest" badge points at `group-happ-v0.16.0-dev.3` — a backend package, not the app. Ignore it.

### Hardware change — 2026-10-16

iPad M4 replaced with the same model; restored from backup; **not yet fully reconfirmed.**
Moss is a desktop (Electron) app, so the iPad is not a Moss peer — but it may hold credentials this plan depends on.

- [ ] 2FA / authenticator codes work for: GitHub, Codeberg, VPS provider, GoDaddy, Mastodon admin, password manager
- [ ] Password manager unlocked and synced (restores of unencrypted backups omit saved passwords)
- [ ] SSH access to the VPS still works from the iPad (if used); remove the old device's key from `authorized_keys`
- [ ] Tailscale: new iPad re-authenticated; old node removed from the tailnet
- [ ] Old iPad removed from Find My / Apple ID devices and erased
- [ ] Supernote app signed in and syncing
- [ ] Home-screen web apps (e.g. iPad terminal app) re-added if missing — their local data may not restore

## 2. What the Moss source shows

- **Data folder:** all 0.15.x releases share `<userData>/0.15.x/<profile>/` (`src/main/filesystem.ts`, `breakingVersion()` in `src/main/utils.ts`). A patch update does not create a new folder.
- **Auto-update** never crosses 0.15 → 0.16. A `0.16…` folder on Dark Matter means a manual install.
- **`--profile <name>`** runs Moss with its own fresh data store — safe, reversible isolation test.
- **`--holochain-path`** carries an upstream warning that a mismatched binary "may potentially corrupt your databases".
- **Peer path** (`src/main/cli/cli.ts`):

  | Role | Default | Operator |
  |---|---|---|
  | Bootstrap (peer discovery) | `https://bootstrap.moss.social` | Lightning Rod Labs |
  | Signaling | `wss://bootstrap.moss.social` | Lightning Rod Labs |
  | Relay | `iroh-relay.moss.social`, fallback n0 canary relay | Lightning Rod Labs / n0 |
  | STUN | Cloudflare, Google | Third parties (US) |

- Tool files come from peers, so "no peers" and "tools won't load" likely share one cause.
- **Hypothesis:** the 0.16.0-dev.5 (test 15) notes add a fix "so peers on different relays can connect". In 0.15.8 two peers on different relays may never meet — consistent with intermittent failure. The fix lives in Holochain 0.7 networking; not realistic to backport.
- Stock Moss accepts `--bootstrap-url`, `--signaling-url`, `--relay-url` (not persisted across restarts) and ships the `kitsune2-bootstrap-srv` binary → **we can test self-hosted infrastructure without forking.**

## 3. To do on Dark Matter (read-only first)

- [ ] **Back up the entire Moss data directory** to a second location before anything else.
- [x] Full error text: `no such table: DhtOp` (first line of the repro brief).
- [ ] Note where it appears (which screen / which tool) and whether the Moss logs show more lines around it.
- [ ] List the Moss data directory: is there a `0.15.x` folder only, or also `0.16…`?
- [ ] Note `.sqlite` file sizes and modified dates under it.
- [ ] Read the first `[HOLOCHAIN …]` lines in `<userData>/0.15.x/default/logs`.
- [ ] Try `--profile beta-test`. Do tools load? Do peers appear?

## 4. Experiment: self-hosted peer infrastructure

```gherkin
Feature: Reliable peer discovery for Future Labs beta testers

  Scenario: Two testers find each other through Future Labs servers
    Given two testers run Moss 0.15.8 with a fresh profile
      And both point at the Future Labs bootstrap, signaling and relay servers
    When both are online in the same group
    Then each sees the other as a connected peer within 60 seconds
      And a tool installed by one loads for the other
```

Needs: bootstrap + relay on the Future Labs VPS (VPS is now up), DNS records at GoDaddy, TLS.

## 5. What makes a fork easy to maintain

1. **Configuration over code.** Change defaults (`moss.config.json`, URL constants in `src/main/cli/cli.ts`), not logic. The smaller the diff, the cheaper every upstream merge.
2. **Never fork the protocol.** Keep the same Holochain version and group DNA as the upstream release you track. Forking the network layer means owning Rust networking forever.
3. **Track release tags, not upstream `main`.** Rebase or merge the Future Labs patch set onto each upstream tag (`v0.15.8` → next), on purpose and on our schedule.
4. **Clear branch model.**
   - `upstream/*` — untouched mirror of Lightning Rod Labs tags/branches
   - `fl/main` — upstream tag + Future Labs patches
   - `fl/feature-*` — one change per branch, BDD scenario first
5. **Patch inventory (`PATCHES.md`).** Every change: what, why, file(s), upstream status (proposed / accepted / Future-Labs-only). Reviewed at each upstream bump.
6. **Upstream everything generic.** Better "searching for peers" diagnostics help every Moss user; each accepted contribution is one fewer patch to carry. Fits cooperative values.
7. **Isolate what must stay ours.** New files (branding, Future Labs config, extra UI panels) rather than edits scattered through upstream files.
8. **Reproducible builds.** Upstream already uses a Nix flake — keep it; pin toolchains; build in CI.
9. **Automated acceptance on every bump.** Build → launch → run the BDD scenarios (peer discovery, tool load) before any tester sees a build.
10. **Bus factor ≥ 2.** Two named maintainers with independent access to the repo, signing keys and servers.
11. **License hygiene.** Moss is CAL-1.0 (libs MIT): publish source, do not withhold users' data or keys. Keep upstream notices intact.

## 6. Transition plan: GitHub → non-Microsoft, non-US hosting

### Options

| Option | Jurisdiction | Operator | Ops burden | Notes |
|---|---|---|---|---|
| **Codeberg** (`codeberg.org/futurelabs`) | Germany (EU) | Codeberg e.V., nonprofit | None | Forgejo; Woodpecker / Forgejo Actions CI. Prior decision (branch `claude/mastodon-setup-nwc3vh`, 16 Sep). Account creation currently blocked — "too many attempts". |
| **Self-hosted Forgejo** on Future Labs VPS (e.g. `git.<fl-domain>`) | Wherever the VPS is (Hetzner: DE/FI) | Future Labs | Medium — updates, backups, security | Full sovereignty; was the Phase 2 plan. |
| Both: Codeberg primary + self-hosted mirror (or reverse) | EU | — | Medium | Matches the two-destination principle used for backups. |

**Recommendation:** Codeberg as primary for now (zero ops, EU nonprofit), self-hosted Forgejo mirror on the VPS once backups are tested. Revisit primary/mirror roles at Phase 2.

### Phases

**Phase 0 — Unblock (this week)**
- [ ] Codeberg lockout: wait out the rate limit (typically time-based), then retry once; if still blocked, contact Codeberg support. Use a password manager entry from the start.
- [ ] Recover Mastodon admin password on the VPS (shell access required):
      `docker compose run --rm web bin/tootctl accounts modify <username> --reset-password`
      (or `RAILS_ENV=production bin/tootctl …` for a non-Docker install). Store the new password in the shared password manager.
- [ ] Decide the two named admins (bus factor 2) for the git org.
- [ ] Decide the Future Labs domain (`futurelabs.social` was used for Mastodon).

**Phase 1 — Stand up (week 1–2)**
- [ ] Create `futurelabs` org on Codeberg; add both admins; enforce 2FA.
- [ ] Create `futurelabs/moss` by **pull mirror** of `github.com/lightningrodlabs/moss` (read-only upstream tracking — no GitHub account needed).
- [ ] Create `futurelabs/moss-fl` (the fork) from the `v0.15.8` tag; add `PATCHES.md`.
- [ ] Set up CI (Woodpecker or Forgejo Actions) for build + BDD smoke tests.

**Phase 2 — Move Future Labs repos (week 2–4)**
- [ ] Inventory which repos are Future Labs vs TCIA. TCIA repos (`tciamn/*`, `tcia-admin/*`) are TCIA's decision, not part of this plan.
- [ ] Migrate Future Labs repos with Codeberg's migration tool (code, issues, PRs, releases, wiki).
- [ ] Replace GitHub Actions with Woodpecker/Forgejo Actions; move secrets.
- [ ] Turn the GitHub copies into read-only push mirrors (description: "Mirror — primary at codeberg.org/futurelabs"), or archive.

**Phase 3 — Sovereign mirror (after VPS backups are tested)**
- [ ] Self-hosted Forgejo on the VPS; push-mirror from Codeberg.
- [ ] Include it in Restic → Backblaze B2 EU + Rclone → May First backups.

### Trade-offs to accept consciously

- **Claude Code cloud sessions only connect to GitHub.** Once the primary is on Codeberg, agent work happens either in Claude Code running locally (Dark Matter) against Codeberg, or in cloud sessions against a GitHub mirror whose changes are pulled back. Decide which before migrating.
- **Upstream Moss stays on GitHub.** Reading it (fetch/mirror) is fine; contributing fixes upstream still needs a GitHub account.
- **Discoverability** is lower off GitHub; keep a pointer repo or mirror there.
- **CI minutes:** Codeberg CI is community-funded and limited; heavy Electron/Rust builds may need a runner on Future Labs hardware.

## 7. Open decisions

| Decision | Blocks |
|---|---|
| Primary git host: Codeberg vs self-hosted Forgejo | Fork creation |
| Where agent (Claude Code) work happens after migration | Migration timing |
| Two named git/server admins | Org creation |
| Future Labs domain | Server DNS, git subdomain |
| Fork scope: config-only vs UI changes for beta tests | Patch set |
| Fresh-profile result on Dark Matter | Whether a fork is needed at all |

**Note:** `CLAUDE.md` on `main` still describes Future Labs as "for TCIA" / "within TCIA" and lacks the Codeberg decision. Correct both when confirmed.
