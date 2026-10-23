# Future Labs Mastodon — Operations Playbook

**Instance:** futurelabs.social  
**VPS:** Hetzner CPX22, Helsinki (EU) — IP `2.29.7.30`, hostname `futurelabs-ma-1`  
**OS:** Ubuntu 26.04 LTS  
**Stack:** Docker Compose, Mastodon v4.3.2, PostgreSQL 17, Redis 7, Nginx

**Status as of 2026-10-18:** Live. All containers healthy. Email pending.

---

## SSH Access

From your Mac:
```bash
ssh -i ~/.ssh/hetzner_futurelabs root@2.29.7.30
```

The SSH key `~/.ssh/hetzner_futurelabs` was generated on your Mac. Never regenerate it in a cloud session.

---

## Admin Account Recovery

If you cannot log in to `https://futurelabs.social`:

```bash
# SSH into VPS
ssh -i ~/.ssh/hetzner_futurelabs root@2.29.7.30

# Reset the admin password
cd /opt/mastodon
docker compose run --rm web bin/tootctl accounts modify aasim --reset-password
```

The command prints a new temporary password. Log in at `https://futurelabs.social`, then immediately go to **Preferences → Account → Change password** and set a permanent one. Save it in your password manager before closing the tab.

---

## Service Management

All commands run from `/opt/mastodon` on the VPS.

```bash
cd /opt/mastodon

# Check status of all containers
docker compose ps

# Start all services
docker compose up -d

# Stop all services (graceful)
docker compose down

# Restart a single service
docker compose restart web
docker compose restart sidekiq
docker compose restart streaming

# View live logs
docker compose logs -f web
docker compose logs -f sidekiq
docker compose logs -f --tail=50
```

**Expected healthy state:**
```
mastodon-db-1         Up (healthy)
mastodon-redis-1      Up (healthy)
mastodon-sidekiq-1    Up (healthy)
mastodon-streaming-1  Up (healthy)
mastodon-web-1        Up (healthy)
```

If any container shows `Restarting`, check its logs: `docker compose logs <service> --tail=30`

---

## Nginx

```bash
# Test config
nginx -t

# Reload (picks up config changes without dropping connections)
systemctl reload nginx

# Restart (drops connections briefly)
systemctl restart nginx

# Check status
systemctl status nginx

# Live config location
/etc/nginx/sites-available/futurelabs.social
```

---

## SSL Certificate

Let's Encrypt certificate auto-renews via certbot. Manual renewal if needed:
```bash
certbot renew --nginx
```

Check expiry:
```bash
certbot certificates
```

---

## Email Setup (Pending)

Email is not yet configured. This blocks:
- Account confirmation emails (new signups)
- Password reset emails
- Notification emails

**To set up Brevo (recommended — EU, free tier, no fraud issues):**
1. Create account at `brevo.com`
2. Go to **SMTP & API → SMTP** → generate SMTP credentials
3. On the VPS, edit `.env.production`:
   ```bash
   nano /opt/mastodon/.env.production
   ```
   Set these values:
   ```
   SMTP_SERVER=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_LOGIN=<your-brevo-login-email>
   SMTP_PASSWORD=<your-brevo-smtp-key>
   SMTP_FROM_ADDRESS=notifications@futurelabs.social
   ```
4. Restart web and sidekiq:
   ```bash
   docker compose restart web sidekiq
   ```
5. Test email from Mastodon admin panel: **Admin → Sidekiq → Send test email**

---

## Admin UI Configuration (Pending)

Not yet completed. Log in at `https://futurelabs.social` as `aasim`:

**Preferences → Administration → Server Settings:**

| Setting | Value |
|---|---|
| Site title | Future Labs |
| Contact username | @aasim |
| Contact email | aasim@tciamn.org |
| Short description | Cooperative digital infrastructure for the Twin Cities and allied organizations. |
| Registrations | Invite-only |

---

## Second Admin Setup (Pending — Bus Factor Requirement)

≥ 2 admins required. The second admin must:
- Have their own SSH key (generated on their own hardware)
- Have independent access to the VPS
- Hold a copy of the ops credentials document

To create the second admin account:
```bash
cd /opt/mastodon
docker compose run --rm web bin/tootctl accounts create \
  <username> \
  --email=<email> \
  --confirmed \
  --role Owner
```

Then send them the temporary password via a secure channel (Signal, not email).

---

## Backups (Pending)

Not yet configured. See `README.md` Step 9 for full setup.

Until backups are running, the database and media are unprotected against VPS failure.

**Media** is stored in Hetzner Object Storage (Helsinki) — bucket `futurelabs-mastodon`. This is independent of the VPS; media survives a VPS failure.

**Database** (PostgreSQL) is on the VPS disk only. This is the critical gap.

---

## Environment File

The `.env.production` file lives at `/opt/mastodon/.env.production` on the VPS only. It is never committed to git. It contains all secrets.

```bash
# View current config (do not share this output)
cat /opt/mastodon/.env.production
```

If the VPS is lost without a backup, you will need to regenerate all secrets and reconfigure from the template in this repo. The Hetzner Object Storage credentials and domain can be reused; the database would be lost.

---

## Troubleshooting

### Site shows "Something went wrong on our end"
```bash
docker compose logs web --tail=30
```
Look for the error type in the output.

### 502 Bad Gateway
Nginx is running but the web container isn't. Check:
```bash
docker compose ps
docker compose logs web --tail=20
```

### Container in restart loop
```bash
docker compose logs <service> --tail=50
```
Most common causes: missing or malformed `.env.production` value, database not ready.

### Out of disk space
```bash
df -h
docker system prune  # removes unused images and stopped containers
```

---

## Pending Items Summary

| Item | Blocks | Priority |
|---|---|---|
| Email setup (Brevo) | Signups, password reset | High |
| Admin UI configuration | Instance branding | High |
| Second admin | Bus factor requirement | High |
| Backup setup | Data protection | High |
| Codeberg mirror | Git sovereignty | Medium |

---

## Ops Credentials Location

Admin email addresses and credentials are not stored in this repository.  
Both admins must hold a copy of the encrypted ops credentials document independently.
