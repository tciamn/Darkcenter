#!/bin/bash
# Future Labs Mastodon — daily backup script
# Runs via cron as root on the Hetzner VPS
# Backs up PostgreSQL DB to Backblaze B2 EU using Restic
#
# Setup:
#   1. Install restic: apt-get install restic
#   2. Set environment variables below (or export from a secrets file)
#   3. Init repository: restic -r "$RESTIC_REPOSITORY" init
#   4. Add to cron: 0 3 * * * /opt/mastodon/backup.sh >> /var/log/mastodon-backup.log 2>&1
#   5. Test restore periodically

set -euo pipefail

MASTODON_DIR="/opt/mastodon"
BACKUP_DIR="/tmp/mastodon-backup-$(date +%Y%m%d-%H%M%S)"
RETENTION_DAYS=30
RETENTION_WEEKS=8

# Restic / Backblaze B2 EU — set these in environment or source a secrets file
# export RESTIC_REPOSITORY="b2:futurelabs-mastodon-backup"
# export B2_ACCOUNT_ID="CHANGEME"
# export B2_ACCOUNT_KEY="CHANGEME"
# export RESTIC_PASSWORD="CHANGEME"

if [[ -z "${RESTIC_REPOSITORY:-}" ]]; then
  echo "ERROR: RESTIC_REPOSITORY not set. Source your secrets file first."
  exit 1
fi

echo "[$(date -Iseconds)] Starting Mastodon backup"

mkdir -p "$BACKUP_DIR"

echo "[$(date -Iseconds)] Dumping PostgreSQL"
cd "$MASTODON_DIR"
docker compose exec -T db pg_dump -U mastodon -d mastodon_production \
  | gzip > "$BACKUP_DIR/mastodon_production.sql.gz"

echo "[$(date -Iseconds)] Backing up .env.production"
cp "$MASTODON_DIR/.env.production" "$BACKUP_DIR/env.production.encrypted" || true

echo "[$(date -Iseconds)] Sending to Restic/B2"
restic backup "$BACKUP_DIR" \
  --tag mastodon \
  --tag "$(hostname)" \
  --compression max

echo "[$(date -Iseconds)] Pruning old backups (keep: daily ${RETENTION_DAYS}d, weekly ${RETENTION_WEEKS}w)"
restic forget \
  --keep-daily "$RETENTION_DAYS" \
  --keep-weekly "$RETENTION_WEEKS" \
  --prune \
  --tag mastodon

echo "[$(date -Iseconds)] Verifying latest snapshot"
restic check --read-data-subset=5%

rm -rf "$BACKUP_DIR"
echo "[$(date -Iseconds)] Backup complete"
