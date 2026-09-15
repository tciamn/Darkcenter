# Future Labs Mastodon — Deployment Guide

**Instance:** futurelabs.social  
**VPS:** Hetzner CX32 (Falkenstein, EU)  
**Stack:** Docker Compose, PostgreSQL 17, Redis 7, Mastodon v4.3.x, Nginx, Let's Encrypt  
**Admin:** aasim@tciamn.org

---

## Prerequisites (complete before running anything)

- [ ] `futurelabs.social` registered at GoDaddy
- [ ] Hetzner CX32 provisioned in Falkenstein (EU), Ubuntu 24.04, SSH key added
- [ ] DNS A record added at GoDaddy: `futurelabs.social` → `<VPS IPv4>`
- [ ] DNS A record for www (optional): `www.futurelabs.social` → same IP
- [ ] Email service set up (Mailgun EU account, domain `futurelabs.social` added + verified)
- [ ] Hetzner Object Storage bucket `futurelabs-mastodon` created in Falkenstein
- [ ] Hetzner Object Storage credentials (Access Key ID + Secret) generated

---

## Step 1 — VPS initial setup

```bash
# From your local machine, copy deploy files to VPS
scp -r deploy/mastodon root@<VPS_IP>:/opt/mastodon/

# SSH into VPS
ssh root@<VPS_IP>

# Run setup script (installs Docker, Nginx, certbot, ufw, fail2ban)
cd /opt/mastodon
bash setup.sh
```

---

## Step 2 — SSL certificate (run BEFORE enabling Nginx Mastodon config)

```bash
# Temporary Nginx config just for certbot
cat > /etc/nginx/sites-available/certbot-temp << 'EOF'
server {
    listen 80;
    server_name futurelabs.social;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 200 'ok'; }
}
EOF

ln -s /etc/nginx/sites-available/certbot-temp /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Get certificate
certbot certonly --nginx -d futurelabs.social -m aasim@tciamn.org --agree-tos

# Remove temp config, install Mastodon Nginx config
rm /etc/nginx/sites-enabled/certbot-temp
cp /opt/mastodon/nginx.conf /etc/nginx/sites-available/futurelabs.social
ln -s /etc/nginx/sites-available/futurelabs.social /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## Step 3 — Generate secrets

Run each command once and paste the output into `.env.production`:

```bash
cd /opt/mastodon

# SECRET_KEY_BASE
docker compose run --rm web bundle exec rails secret

# OTP_SECRET
docker compose run --rm web bundle exec rails secret

# VAPID keys (generates both VAPID_PRIVATE_KEY and VAPID_PUBLIC_KEY)
docker compose run --rm web bundle exec rake mastodon:webpush:generate_vapid_key
```

---

## Step 4 — Configure .env.production

```bash
cp .env.production.template .env.production
nano .env.production
# Fill in all CHANGEME values using the secrets from Step 3
# and your Mailgun + Object Storage credentials
```

---

## Step 5 — Database setup

```bash
cd /opt/mastodon

# Run DB migrations (creates schema)
docker compose run --rm web bundle exec rails db:setup

# Pre-compile assets (only needed if you see missing asset errors)
# docker compose run --rm web bundle exec rails assets:precompile
```

---

## Step 6 — Create admin account

```bash
docker compose run --rm web bin/tootctl accounts create \
  aasim \
  --email=aasim@tciamn.org \
  --confirmed \
  --role Owner
```

Save the generated password. Change it immediately after first login.

---

## Step 7 — Start services

```bash
cd /opt/mastodon
docker compose up -d

# Verify all containers are healthy
docker compose ps

# Tail logs to confirm no errors
docker compose logs -f --tail=50
```

Visit `https://futurelabs.social` — you should see the Mastodon login page.

---

## Step 8 — Instance configuration (Admin UI)

Log in as admin → Preferences → Administration → Server Settings:

| Setting | Value |
|---|---|
| Site title | Future Labs |
| Contact username | @aasim |
| Contact email | aasim@tciamn.org |
| Short description | Cooperative digital infrastructure for the Twin Cities and allied organizations. |
| Registrations | Invite-only |
| Approval required | Yes (if not invite-only) |

---

## Step 9 — Backups

```bash
# Install restic
apt-get install -y restic

# Configure backup secrets (keep this file off-repo, encrypted)
cat > /root/.mastodon-backup-env << 'EOF'
export RESTIC_REPOSITORY="b2:futurelabs-mastodon-backup"
export B2_ACCOUNT_ID=CHANGEME
export B2_ACCOUNT_KEY=CHANGEME
export RESTIC_PASSWORD=CHANGEME
EOF
chmod 600 /root/.mastodon-backup-env

# Init Restic repository
source /root/.mastodon-backup-env
restic -r "$RESTIC_REPOSITORY" init

# Test backup manually
bash /opt/mastodon/backup.sh

# Add to cron (runs daily at 3am UTC)
echo "0 3 * * * root source /root/.mastodon-backup-env && bash /opt/mastodon/backup.sh >> /var/log/mastodon-backup.log 2>&1" \
  > /etc/cron.d/mastodon-backup
```

---

## Maintenance

### Update Mastodon
```bash
cd /opt/mastodon
# Edit docker-compose.yml: update image tag to new version
# Then:
docker compose pull
docker compose run --rm web bundle exec rails db:migrate
docker compose up -d
```

### Check service health
```bash
docker compose ps
docker compose logs web --tail=20
docker compose logs sidekiq --tail=20
```

### Rebuild search index (if Elasticsearch added later)
```bash
docker compose run --rm web bin/tootctl search deploy --concurrency 2
```

---

## Second Admin Setup

Per Future Labs bus factor requirement (≥ 2 admins):

```bash
docker compose run --rm web bin/tootctl accounts create \
  <second_admin_username> \
  --email=<second_admin_email> \
  --confirmed \
  --role Owner
```

The second admin must have independent SSH access to the VPS and know the `.env.production` secrets location.

---

## DNS Records (GoDaddy)

| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | `<VPS IPv4>` | 600 |
| A | www | `<VPS IPv4>` | 600 |
| MX | @ | Mailgun MX records | 3600 |
| TXT | @ | Mailgun SPF record | 3600 |
| TXT | `k1._domainkey` | Mailgun DKIM record | 3600 |

---

## File Structure on VPS

```
/opt/mastodon/
├── docker-compose.yml
├── .env.production          # NEVER commit this
├── nginx.conf               # reference copy (live copy in /etc/nginx/)
├── setup.sh
├── backup.sh
└── public/
    └── system/              # local media (if not using object storage)
```
