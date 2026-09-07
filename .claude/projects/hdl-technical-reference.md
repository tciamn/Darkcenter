# Future Labs — Technical Reference (High Detail Level)

**For:** Implementers, sysadmins, and anyone setting up or maintaining the infrastructure.  
**Owner:** aasim@tciamn.org  
**Last updated:** 2026-09-07

---

## Non-Functional Requirements

| Requirement | Target | Notes |
|---|---|---|
| Uptime | 99.5% (≈ 44 hrs downtime/yr) | We manage our own failover; not relying on managed HA |
| RTO (critical services) | < 4 hours | Supernote sync, Matrix |
| RTO (other services) | < 24 hours | Static sites, lower-criticality apps |
| RPO (data loss) | < 24 hours | Daily backups satisfy this; Supernote DB target < 4 hrs |
| Phase 1 cost ceiling | ~$20/mo | VPS + two backup destinations + monitoring |
| Primary data jurisdiction | EU or Switzerland | No US-based primary storage |
| Admin bus factor | 2 | Two people with independent full admin access at all times |

---

## Supernote Private Cloud — Setup

### Architecture

```
Supernote Device (HTTPS)
        ↓
Nginx Reverse Proxy  (SSL termination via Let's Encrypt)
        ↓
Supernote Private Cloud Service (HTTP, port 19072)
        ↓
MariaDB + Redis (Docker containers)
```

### Prerequisites

- Linux server (Debian/Ubuntu recommended; Synology DSM also supported)
- Docker + Docker Compose installed
- Domain/subdomain (e.g. `cloud.tciamn.org`) pointing to server IP — DNS currently via SiteGround
- Port 443 open in server firewall
- Minimum 50 GB disk; 2 GB RAM recommended

### Nginx Config Template

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 80;
    listen 443 ssl;
    server_name YOUR_DOMAIN;
    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem;
    ssl_session_timeout 60m;
    ssl_protocols TLSv1.2;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers on;
    client_max_body_size 20480m;

    location / {
        proxy_pass http://YOUR_SERVER_IP:19072;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Scheme $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_connect_timeout 6000;
        proxy_send_timeout 6000;
        proxy_read_timeout 6000;
    }

    location ~ ^/socket.io/(.*) {
        proxy_ignore_client_abort on;
        proxy_http_version 1.1;
        proxy_connect_timeout 60s;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "$connection_upgrade";
        proxy_pass http://YOUR_SERVER_IP:19072;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Setup Checklist

- [ ] Provision VPS (see provider section below)
- [ ] Point DNS subdomain to server IP (TTL: 300s)
- [ ] SSH in; install Docker + Docker Compose
- [ ] Install Nginx
- [ ] Run Certbot: `certbot --nginx -d cloud.tciamn.org`
- [ ] Place Nginx config; reload: `nginx -s reload`
- [ ] Pull Supernote Private Cloud Docker Compose from Ratta's official docs
- [ ] Create `.env` file with secrets (never commit this to git)
- [ ] Run `docker compose up -d`
- [ ] Open `https://cloud.tciamn.org` — verify landing page appears
- [ ] Register an account; point Manta at the new URL
- [ ] Verify sync works end-to-end
- [ ] Set up backup jobs (see Backup section)
- [ ] Set up monitoring alert (UptimeRobot free tier)
- [ ] Document runbook: how to restore from backup if this server dies

---

## Provider Assessment

Research date: 2026-09-07

### Hetzner Cloud

| Attribute | Detail |
|---|---|
| Type | Commercial cloud (Germany) |
| Regions | Nuremberg (DE), Falkenstein (DE), Helsinki (FI), Ashburn VA (US), Hillsboro OR (US), Singapore |
| SLA | 99.9% (cloud credits for missed targets) |
| HA tools | Floating IPs (per-DC reassignment via Keepalived); managed Load Balancers from €6.49/mo; private VXLAN networking |
| Cross-region failover | DIY only — Floating IPs are per-datacenter; cross-provider requires DNS-level failover |
| Backups | Automated daily (opt-in, 20% of instance price); manual snapshots ~€0.01/GB/mo |
| Entry VPS | CX22: 2 vCPU / 4 GB RAM / 40 GB SSD — €3.79/mo |
| Recommended VPS | CX32: 4 vCPU / 8 GB RAM / 80 GB SSD — €6.80/mo |
| Role | **Primary VPS or technical secondary.** Best tooling and community, lowest cost, widest region choice. |

### Infomaniak

| Attribute | Detail |
|---|---|
| Type | Employee-owned (Switzerland, since 1996) |
| Regions | Geneva (CH) + Zurich (CH) — two cities, owned infrastructure |
| SLA | 99.99% contractual (VPS Cloud); 99.999% on HA Cloud Server product |
| HA tools | HA Cloud Server cluster product; Geneva + Zurich diversity on HA tier |
| Cross-region failover | DNS-level or HA product; no Floating IP equivalent |
| Backups | One free snapshot on VPS Cloud; Swiss Backup add-on (paid); **not automatic by default — must enable** |
| Jurisdiction | Swiss law — stronger privacy than EU; not subject to US Cloud Act |
| Entry VPS | VPS Cloud from ~€5/mo |
| Role | **Values-aligned primary or strong secondary.** Best contractual SLA. Swiss jurisdiction is an asset. No geographic overlap with Hetzner (CH vs. DE/FI). |

### Greenhost

| Attribute | Detail |
|---|---|
| Type | Independent hosting (Amsterdam) |
| Regions | Amsterdam only (IronMountain DC, 100% Dutch wind energy) |
| SLA | Negotiated per contract; no public uptime figure |
| HA tools | Ceph-based VM storage (storage-level redundancy); **Rapid Response Team** for activist clients under DDoS or political attack |
| Backups | Included in managed tiers; unclear for bare VPS |
| Jurisdiction | Netherlands / EU (GDPR) |
| Price | ~€5–22/mo estimated (custom pricing) |
| Role | **Mission-aligned NL secondary for activist-critical services.** Single location limits technical redundancy. Rapid Response Team is unique. |

### IO Cooperative

| Attribute | Detail |
|---|---|
| Type | California consumer cooperative — member-owned, member-run |
| Regions | Fremont CA only (Hurricane Electric FMT2) |
| SLA | None published |
| HA tools | None documented. Uses Ganeti VM management. |
| Backups | Not publicly documented; likely self-managed |
| Price | 1 slice: 1 GB RAM / 25 GB / 10 Mbps — $86.25/yr (~$7.19/mo) |
| Role | **Community/values anchor; non-critical services only.** No SLA, single US location, no failover tools. Solidarity membership is worthwhile; production workloads are not. |

### Servers.coop

| Attribute | Detail |
|---|---|
| Type | NOT a provider — governance + technical framework (Capsul VMaaS platform) |
| Status | Active but early-stage; affiliated with CoTech (UK coop tech network) |
| Availability | No public VPS signup; must connect with a CoTech member running a live Capsul instance |
| Role | **Future community node.** Monitor for live instances. Not deployable today. |

---

## Backup Architecture

### Two-destination minimum

Never keep backups on the same provider as the primary. Aim for three destinations:

| Destination | Tool | Cost | Why |
|---|---|---|---|
| Hetzner Storage Box BX21 (5 TB) | BorgBackup or rsync | €10.90/mo | Fast restore; natively documented; unlimited traffic. Use when primary is NOT Hetzner. |
| Backblaze B2 EU | Restic | $6.95/TB/mo | S3-compatible; provider-diverse; EU region; free egress up to 3× monthly storage |
| May First Nextcloud | Rclone | $0 (org membership) | Third copy; US-based (acceptable for backup, not primary) |

### What to back up

```
/opt/supernote/          # Docker Compose files + .env (exclude secrets from git)
/var/lib/supernote/      # Uploaded files
/var/lib/mysql/          # MariaDB data directory (or use mysqldump for portable backups)
/var/lib/matrix/         # Matrix homeserver database + media
/etc/nginx/              # Nginx config
/etc/letsencrypt/        # SSL certificates
```

### Restic + Backblaze B2 example

```bash
# Initialize repo (run once)
restic -r b2:BUCKET_NAME:/backups init

# Daily backup (add to cron)
restic -r b2:BUCKET_NAME:/backups backup \
  /opt/supernote /var/lib/supernote \
  --password-file /root/.restic-password

# Retain 30 days, 12 weeks, 12 months
restic -r b2:BUCKET_NAME:/backups forget \
  --keep-daily 30 --keep-weekly 12 --keep-monthly 12 --prune

# Test restore (run weekly; restore to /tmp/restore-test, check file count)
restic -r b2:BUCKET_NAME:/backups restore latest \
  --target /tmp/restore-test --include /opt/supernote
```

### MariaDB backup

```bash
# Dump all databases (run before file backup)
mysqldump --all-databases --single-transaction \
  -u root -p > /tmp/supernote-db-$(date +%Y%m%d).sql
```

---

## Failover Architecture

### Phase 1 — Manual failover

1. **Health check:** UptimeRobot (free tier) monitors `https://cloud.tciamn.org` every 5 minutes; sends email/SMS alert on failure.
2. **Assess:** Is the server down, or just the service? `ssh user@server` + `docker ps` to check.
3. **Service restart:** `docker compose restart` often resolves transient failures.
4. **If server is unreachable:** Restore from latest backup to a new VPS (same or different provider). Update DNS record to new server IP. Wait for TTL (300s) to propagate.
5. **Comms failback:** If Matrix is down, switch team to May First email/XMPP.

Estimated time for full restore from backup: 1–3 hours depending on data size.

### Phase 2 — Semi-automated failover

- Primary: Hetzner CX32 (DE/FI region)
- Secondary: Infomaniak VPS (Geneva or Zurich)
- Services mirrored: Supernote sync, Matrix homeserver
- Floating IP on Hetzner primary for fast intra-DC failover (Keepalived)
- DNS-level failover for cross-provider: Cloudflare free tier as secondary resolver; low TTL (300s) on critical subdomains
- Automated: health check script on secondary polls primary; if primary down for >2 checks, alerts operator to manually confirm and flip DNS

### DNS setup (SiteGround)

```
cloud.tciamn.org    A    <primary VPS IP>    TTL 300
```

In emergency: update A record to secondary VPS IP. With TTL=300, propagation completes in ~5 minutes.

---

## Security Checklist

- [ ] SSH key auth only — disable password auth (`PasswordAuthentication no` in sshd_config)
- [ ] Firewall: allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS) only; block everything else
- [ ] Automatic security updates: `unattended-upgrades` package on Debian/Ubuntu
- [ ] Fail2ban: block repeated failed SSH attempts
- [ ] SSL/TLS: Let's Encrypt via Certbot; auto-renew enabled (`certbot renew --dry-run` to verify)
- [ ] .env files never committed to git; use `.gitignore`
- [ ] Backup encryption: Restic/BorgBackup encrypt client-side by default; verify password is stored securely (not on the same server)
- [ ] Rotate SSH keys and provider account credentials annually
- [ ] Two admin accounts with independent access (bus factor ≥ 2)

---

## Coop Cloud Integration

[Coop Cloud](https://coopcloud.tech) provides recipes for deploying FOSS apps on any Docker server. Use it to deploy services beyond Supernote Private Cloud.

```bash
# Install abra (Coop Cloud CLI)
curl https://install.abra.coopcloud.tech | bash

# List available recipes
abra recipe ls

# Deploy Matrix (Synapse)
abra app create matrix-synapse mymatrix --server YOUR_SERVER
abra app deploy mymatrix
```

Recipes available for: Matrix (Synapse), Jitsi Meet, Nextcloud, WordPress, Gitea, Mastodon, and more.

---

## Governance Requirements (to define)

These are not technical decisions but must be made before onboarding other orgs:

- [ ] Who holds admin credentials? (require ≥ 2 named individuals)
- [ ] Who approves new member orgs joining the infrastructure?
- [ ] How are monthly costs divided among member orgs?
- [ ] What is the process when an org wants to leave?
- [ ] Where is the runbook stored? (git repo, shared doc, printed copy — assume internet is down during disaster)
- [ ] Who is the escalation contact for 3am failures?

---

## Key Decisions Log

See `.claude/projects/key-decisions.md` for decisions made and pending.

---

## Related Documents

- **Executive summary (non-technical):** `.claude/projects/ldl-executive-summary.md`
- **Supernote project notes:** `.claude/projects/supernote-private-cloud.md`
- **Future Labs full project:** `.claude/projects/future-labs-infrastructure.md`
- **Key decisions:** `.claude/projects/key-decisions.md`
- **Shareable briefing:** https://claude.ai/code/artifact/89beb9f3-c4b0-4a50-a5e9-42d8b674baaa

---

## External References

| Resource | URL |
|---|---|
| Supernote Private Cloud setup | https://support.supernote.com/Whats-New/setting-up-your-own-supernote-private-cloud-beta |
| Coop Cloud docs | https://docs.coopcloud.tech |
| Hetzner Storage Box BorgBackup | https://docs.hetzner.com/storage/storage-box/access/access-ssh-rsync-borg/ |
| Restic docs | https://restic.readthedocs.io |
| Certbot docs | https://certbot.eff.org |
| Servers.coop | https://servers.coop |
| Holochain | https://holochain.org |
