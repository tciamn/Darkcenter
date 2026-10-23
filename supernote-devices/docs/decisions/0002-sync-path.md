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

## Open questions

- Is there an existing server or NAS, or is this a new build?
- Personal LAN host, or the TCIA Future Labs server once it exists?

## Decision

_Pending._
