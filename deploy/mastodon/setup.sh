#!/bin/bash
# Future Labs Mastodon — VPS setup script
# Run as root on a fresh Hetzner CPX22 (Ubuntu 24.04, Helsinki)
# Usage: bash setup.sh
# After this script: follow the steps in README.md to complete Mastodon config

set -euo pipefail

DOMAIN="futurelabs.social"
MASTODON_DIR="/opt/mastodon"

echo "==> Updating system packages"
apt-get update -qq && apt-get upgrade -y -qq

echo "==> Installing dependencies"
apt-get install -y -qq \
  curl \
  git \
  nginx \
  certbot \
  python3-certbot-nginx \
  ufw \
  fail2ban \
  unattended-upgrades

echo "==> Installing Docker"
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

echo "==> Configuring firewall (ufw)"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

echo "==> Configuring fail2ban"
systemctl enable fail2ban
systemctl start fail2ban

echo "==> Enabling unattended security upgrades"
dpkg-reconfigure --priority=low unattended-upgrades

echo "==> Creating mastodon deploy directories"
mkdir -p "$MASTODON_DIR/public/system"
cd "$MASTODON_DIR"

echo ""
echo "=== Setup script complete ==="
echo ""
echo "Next steps (manual — see README.md):"
echo "  1. cp .env.production.template .env.production — fill in all CHANGEME values"
echo "  2. See README Step 2: get SSL cert with certbot"
echo "  3. cp nginx.conf /etc/nginx/sites-available/$DOMAIN and enable it"
echo "  4. See README Step 3: generate secrets (rails secret, VAPID keys)"
echo "  5. docker compose run --rm web bundle exec rails db:setup"
echo "  6. See README Step 6: create admin account with tootctl"
echo "  7. docker compose up -d"
echo ""
echo "DNS reminder: Add A record at GoDaddy:"
echo "  Type: A | Name: @ | Value: $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_VPS_IP') | TTL: 600"
