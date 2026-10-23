# 0002 — Sync path: Private Cloud, WebDAV, or both

- Status: **Proposed — awaiting user decision**
- Scenarios: features/private_cloud.feature, features/webdav.feature

## Context

Both devices (Manta, Nomad) currently sync to Supernote Cloud, hosted by Supernote,
and run beta firmware. Notes and ebooks should move to hardware we control, with
no recurring cloud fees, in line with the EU/CH primary-jurisdiction target.
Whatever is chosen, the move starts with a verified export (features/migration.feature).

## Options

1. **Supernote Private Cloud** — official Docker service; native note sync.
   Needs recent firmware; pin image tag + digest (26.02.23 or newer — VERIFY).
   Could run on the planned TCIA server (repo-root CLAUDE.md, `cloud.tciamn.org`,
   blocked on VPS choice) or on a LAN host.
2. **WebDAV via NetVirtualDisk** — any WebDAV server (e.g. Nextcloud) over HTTPS
   with an app password. Good for the ebook library; not native note sync.
3. **Both** — Private Cloud for notes, WebDAV for the library.

## Hosts (from the repo record, 2026-10-23)

| Host | Fit | Notes |
|---|---|---|
| `futurelabs-ma-1` (Hetzner Helsinki, EU) | Planned home | Already decided as the shared Mastodon + Supernote server. Needs resize CPX22 → CPX32: 40 GB disk is below the 50 GB minimum, 4 GB RAM is tight beside Mastodon. Backups to B2 EU + Storage Box. |
| NAS on OGMax | Step 0 now; second copy later | Not configured, model unrecorded. Holds the export immediately as plain storage. Not always-on while attached to a laptop. |
| SiteGround | No | Shared hosting, no Docker. |

## Open questions

- Does the EU/CH primary-storage rule apply to owner-held hardware (NAS in the US)?
- NAS make/model — does it run Docker, or is it storage only?

## Decision

_Pending._
