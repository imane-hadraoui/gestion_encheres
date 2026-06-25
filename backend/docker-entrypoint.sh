#!/usr/bin/env bash
set -e

# Create .env if missing
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Sync database connection settings from the container environment into .env so
# values defined in docker-compose are authoritative. We edit a temp copy and
# write it back with a redirect (not a rename), since .env may be a bind mount.
WORK=$(mktemp)
cp .env "$WORK"
set_env() {
    local key="$1" value="$2"
    if grep -qE "^${key}=" "$WORK"; then
        sed -i "s|^${key}=.*|${key}=${value}|" "$WORK"
    else
        echo "${key}=${value}" >> "$WORK"
    fi
}
set_env DB_CONNECTION "${DB_CONNECTION:-mysql}"
set_env DB_HOST "${DB_HOST:-mysql}"
set_env DB_PORT "${DB_PORT:-3306}"
set_env DB_DATABASE "${DB_DATABASE:-gestion_encheres}"
set_env DB_USERNAME "${DB_USERNAME:-laravel}"
set_env DB_PASSWORD "${DB_PASSWORD:-secret}"
cat "$WORK" > .env
rm -f "$WORK"

# Generate app key if not set
if ! grep -q "^APP_KEY=base64:" .env; then
    php artisan key:generate --force
fi

# Wait for the database to be ready
echo "Waiting for database at ${DB_HOST}:${DB_PORT}..."
until php -r "exit(@fsockopen(getenv('DB_HOST'), (int)getenv('DB_PORT')) ? 0 : 1);" 2>/dev/null; do
    sleep 2
done
echo "Database is up."

# Run migrations
php artisan migrate --force

# Cache config/routes for performance (optional, safe to skip on errors)
php artisan config:clear

echo "Starting Laravel server on 0.0.0.0:8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
