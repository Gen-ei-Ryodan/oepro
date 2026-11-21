#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SSH_USER="alurelab"
SSH_HOST="emerald.hidden-server.net"
SSH_PORT="31988"
REMOTE_ROOT="/home/alurelab/oepro.id"
REMOTE_BACKEND="${REMOTE_ROOT}/backend"

echo "==> Building frontend..."
npm --prefix "$PROJECT_DIR" run build

echo "==> Deploying frontend (dist/)..."
rsync -avz --delete -e "ssh -p ${SSH_PORT}" "$PROJECT_DIR/dist/" "${SSH_USER}@${SSH_HOST}:${REMOTE_ROOT}/"

echo "==> Deploying backend..."
rsync -avz --delete \
  -e "ssh -p ${SSH_PORT}" \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude 'storage/logs/*' \
  "$PROJECT_DIR/backend/" "${SSH_USER}@${SSH_HOST}:${REMOTE_BACKEND}/"

echo "==> Deploying backend public storage..."
rsync -avz -e "ssh -p ${SSH_PORT}" \
  "$PROJECT_DIR/backend/storage/app/public/" "${SSH_USER}@${SSH_HOST}:${REMOTE_BACKEND}/storage/app/public/"

echo "==> Configuring backend on server..."
ssh -p "${SSH_PORT}" "${SSH_USER}@${SSH_HOST}" << 'ENDSSH'
set -euo pipefail
cd /home/alurelab/oepro.id/backend

# Setup .env for production
cat > .env << 'ENVEOF'
APP_NAME=Laravel
APP_ENV=production
APP_DEBUG=false
APP_URL=https://oepro.id
APP_KEY=base64:huTUD5WF2YzIzRUhWITPB5iMaOnZxG876RZ184CDUfQ=

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=alurelab_oepro
DB_USERNAME=alurelab_oepro
DB_PASSWORD=OePro2026Password123

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"
ENVEOF

# Ensure database.sqlite exists and is writable
touch database/database.sqlite
chmod 664 database/database.sqlite

# Ensure storage writable
chmod -R 775 storage bootstrap/cache

# Create storage symlink
php artisan storage:link
# Also create symlink at root web level
ln -sfn /home/alurelab/oepro.id/backend/storage/app/public /home/alurelab/oepro.id/storage 2>/dev/null || true

# Copy banner fallback ke storage public
mkdir -p /home/alurelab/oepro.id/backend/storage/app/public/banners
cp -f /home/alurelab/oepro.id/assets/banners/hero-banner-new.jpg /home/alurelab/oepro.id/backend/storage/app/public/banners/banner1.jpg 2>/dev/null || true
cp -f /home/alurelab/oepro.id/assets/banners/hero-banner-new.jpg /home/alurelab/oepro.id/backend/storage/app/public/banners/hero-banner-new.jpg 2>/dev/null || true
# Run migrations first
php artisan migrate --force

# Ensure banner record uses the fallback and seed catalog
php artisan db:seed --force

# Cache config & routes
php artisan config:cache
php artisan route:cache

echo "Backend setup complete."
ENDSSH

echo "==> Deployment complete."