#!/bin/bash
# Future Labs Mastodon — VPS setup script
# Run as root on a fresh Hetzner CX32 (Ubuntu 24.04)
# Usage: bash setup.sh
# After this script: follow the steps in README.md to complete Mastodon config

set -euo pipefail

DOMAIN="futurelabs.social"
ADMIN_EMAIL="aasim@tciamn.org"
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

echo "==> Creating mastodon deploy directory"
mkdir -p "$MASTODON_DIR"
cd "$MASTODON_DIR"

echo "==> Copying docker-compose.yml"
# Copy from repo — run this from /path/to/Darkcenter/deploy/mastodon/
cp docker-compose.yml "$MASTODON_DIR/docker-compose.yml"

echo ""
echo "=== Setup script complete ==="
echo ""
echo "Next steps (manual — see README.md):"
echo "  1. Copy .env.production.template to $MASTODON_DIR/.env.production and fill in all CHANGEME values"
echo "  2. Set up SSL: certbot --nginx -d $DOMAIN -m $ADMIN_EMAIL --agree-tos"
echo "  3. Copy nginx.conf to /etc/nginx/sites-available/$DOMAIN and enable it"
echo "  4. Generate secrets: see README.md secrets section"
echo "  5. Run DB setup: docker compose run --rm web bundle exec rails db:setup"
echo "  6. Create admin: docker compose run --rm web bin/tootctl accounts create admin --email=$ADMIN_EMAIL --confirmed --role Owner"
echo "  7. Start services: docker compose up -d"
echo ""
echo "DNS reminder: Add A record at GoDaddy:"
echo "  Type: A | Name: @ | Value: $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_VPS_IP') | TTL: 600"
