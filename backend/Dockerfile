# syntax=docker/dockerfile:1

FROM php:8.4-cli

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    curl \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions required by Laravel + MySQL
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    bcmath \
    zip \
    gd \
    exif \
    pcntl

# Node.js (for building Vite assets)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP dependencies first (better layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts --prefer-dist

# Install Node dependencies
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

# Copy the rest of the application
COPY . .

# Finish composer setup and build front-end assets
RUN composer dump-autoload --optimize \
    && npm run build

# Permissions for Laravel writable directories
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
