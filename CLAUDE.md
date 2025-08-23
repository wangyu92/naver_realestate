# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Rails 8.0.2+ application named "main" that appears to be related to Naver real estate functionality. The project uses PostgreSQL as its database, with Solid Cache, Solid Queue, and Solid Cable for caching, job processing, and websockets respectively.

## Key Technologies

- **Rails**: 8.0.2+
- **Database**: PostgreSQL with multiple databases (main, cache, queue, cable)
- **Asset Pipeline**: Propshaft with Importmap for JavaScript
- **Frontend**: Hotwire (Turbo + Stimulus)
- **Web Server**: Puma with Thruster for production
- **Deployment**: Kamal (Docker-based deployment)
- **Background Jobs**: Solid Queue (database-backed)
- **Caching**: Solid Cache (database-backed)
- **WebSockets**: Solid Cable (database-backed)

## Development Commands

### Setup and Installation
```bash
# Initial setup (installs dependencies, prepares database, starts server)
bin/setup

# Install dependencies only
bundle install

# Start development server
bin/dev
# or
bin/rails server
```

### Database Management
```bash
# Create and migrate all databases (main, cache, queue, cable)
bin/rails db:prepare

# Run migrations
bin/rails db:migrate

# Access database console
bin/rails dbconsole
# or via Kamal
bin/kamal dbc
```

### Code Quality and Security
```bash
# Run RuboCop for code style checking
bin/rubocop

# Run Brakeman for security analysis
bin/brakeman

# Access Rails console
bin/rails console
# or via Kamal
bin/kamal console
```

### Deployment
```bash
# Deploy with Kamal
bin/kamal deploy

# View deployment logs
bin/kamal logs

# Access production shell
bin/kamal shell
```

### Background Jobs
```bash
# Start Solid Queue supervisor (in development, runs inside Puma)
# In production, controlled by SOLID_QUEUE_IN_PUMA env var
bin/jobs
```

## Architecture and Structure

### Database Architecture
The application uses a multi-database setup with PostgreSQL:
- **Primary database**: `main_[environment]` - Core application data
- **Cache database**: `main_[environment]_cache` - Solid Cache storage (migrations in `db/cache_migrate`)
- **Queue database**: `main_[environment]_queue` - Solid Queue job storage (migrations in `db/queue_migrate`)
- **Cable database**: `main_[environment]_cable` - Solid Cable websocket storage (migrations in `db/cable_migrate`)

### Deployment Configuration
- Uses Kamal for Docker-based deployment
- Configuration in `config/deploy.yml`
- SSL auto-certification via Let's Encrypt
- Persistent storage volumes for database and Active Storage files
- Asset bridging between deployments to avoid 404s

### Application Module
The main application module is `Main` (defined in `config/application.rb`), which affects:
- Model namespacing
- Database table prefixes
- Environment variable naming (e.g., `MAIN_DATABASE_PASSWORD`)

### Development vs Production
- **Development**: Solid Queue runs inside Puma process
- **Production**: Can be split to dedicated job processing machines
- **Environment Variables**: 
  - `SOLID_QUEUE_IN_PUMA`: Controls job processing location
  - `JOB_CONCURRENCY`: Number of Solid Queue processes
  - `WEB_CONCURRENCY`: Number of Puma workers

## Important Notes

- No test framework is currently configured (Rails test_unit is disabled, no RSpec/Minitest setup found)
- The project uses Hotwire (Turbo + Stimulus) for frontend interactivity without a separate frontend framework
- All background job processing, caching, and websockets are database-backed using the Solid* gems
- Kamal deployment expects Docker images pushed to a registry (configure in `config/deploy.yml`)