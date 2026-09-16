#!/bin/bash
# Future Labs Mastodon — daily backup script
# Runs via cron as root on the Hetzner VPS
# Two-destination backup: Backblaze B2 EU (primary) + Hetzner Storage Box EU (secondary)
# Both destinations use Restic with owner-controlled encryption.
#
# Setup:
#   1. Install restic: apt-get install restic
#   2. Source secrets file before running (see README Step 9)
#   3. Init both repos:
#      restic -r "$RESTIC_REPOSITORY" init
#      restic -r "$RESTIC_REPOSITORY_SECONDARY" init
#   4. Add to cron: 0 3 * * * source /root/.mastodon-backup-env && /opt/mastodon/backup.sh >> /var/log/mastodon-backup.log 2>&1
#   5. Test restore periodically from each destination independently

set -euo pipefail

MASTODON_DIR="/opt/mastodon"
BACKUP_DIR="/tmp/mastodon-backup-$(date +%Y%m%d-%H%M%S)"
RETENTION_DAYS=30
RETENTION_WEEKS=8

# Primary: Backblaze B2 EU — set in /root/.mastodon-backup-env
# export RESTIC_REPOSITORY="b2:futurelabs-mastodon-backup"
# export B2_ACCOUNT_ID="CHANGEME"
# export B2_ACCOUNT_KEY="CHANGEME"
# export RESTIC_PASSWORD="CHANGEME"
#
# Secondary: Hetzner Storage Box EU (SFTP)
# export RESTIC_REPOSITORY_SECONDARY="sftp:u000000@u000000.your-storagebox.de:/mastodon-backup"
# SSH key for Storage Box must be added at: robot.hetzner.com → Storage Box → SSH Keys

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

echo "[$(date -Iseconds)] Sending to primary (Backblaze B2 EU)"
restic backup "$BACKUP_DIR" \
  --tag mastodon \
  --tag "$(hostname)" \
  --compression max

echo "[$(date -Iseconds)] Pruning primary (keep: daily ${RETENTION_DAYS}d, weekly ${RETENTION_WEEKS}w)"
restic forget \
  --keep-daily "$RETENTION_DAYS" \
  --keep-weekly "$RETENTION_WEEKS" \
  --prune \
  --tag mastodon

echo "[$(date -Iseconds)] Verifying primary snapshot"
restic check --read-data-subset=5%

if [[ -n "${RESTIC_REPOSITORY_SECONDARY:-}" ]]; then
  echo "[$(date -Iseconds)] Sending to secondary (Hetzner Storage Box EU)"
  RESTIC_REPOSITORY="$RESTIC_REPOSITORY_SECONDARY" restic backup "$BACKUP_DIR" \
    --tag mastodon \
    --tag "$(hostname)" \
    --compression max

  echo "[$(date -Iseconds)] Pruning secondary"
  RESTIC_REPOSITORY="$RESTIC_REPOSITORY_SECONDARY" restic forget \
    --keep-daily "$RETENTION_DAYS" \
    --keep-weekly "$RETENTION_WEEKS" \
    --prune \
    --tag mastodon
else
  echo "[$(date -Iseconds)] WARN: RESTIC_REPOSITORY_SECONDARY not set — secondary backup skipped"
fi

rm -rf "$BACKUP_DIR"
echo "[$(date -Iseconds)] Backup complete"
