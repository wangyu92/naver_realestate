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

## UI Component System

### Overview
The application includes a comprehensive UI component system designed specifically for real estate applications. All components are built with Rails partials, Stimulus controllers, and modern CSS.

### Component Showcase
View all components at: `http://localhost:3000/components`

### Available Components

#### 1. Buttons
- **Location**: `app/assets/stylesheets/components/_buttons.css`
- **Controller**: `app/javascript/controllers/button_controller.js`
- **Variants**: Primary, Secondary, Success, Danger, Warning, Info, Light, Dark, Outline variants
- **Sizes**: `btn-sm`, `btn-md` (default), `btn-lg`, `btn-xl`
- **Features**: Loading states, ripple effects, confirmation dialogs
- **Usage Example**:
```erb
<button class="btn btn-primary" data-controller="button" data-action="click->button#click">
  매물 보기
</button>
```

#### 2. Forms
- **Location**: `app/assets/stylesheets/components/_forms.css`
- **Controller**: `app/javascript/controllers/form_controller.js`
- **Components**: Text inputs, textareas, selects, checkboxes, radios, switches, file uploads
- **Real Estate Specific**: Price formatting, area input, room/bath selectors
- **Features**: Real-time validation, auto-save, drag-and-drop file upload
- **Usage Example**:
```erb
<div class="form-group" data-controller="form">
  <label for="price">매매가</label>
  <input type="text" class="form-control" id="price" data-form-target="price">
  <div class="invalid-feedback" data-form-target="error"></div>
</div>
```

#### 3. Cards
- **Location**: `app/assets/stylesheets/components/_cards.css`
- **Controller**: `app/javascript/controllers/card_controller.js`
- **Types**: Property cards, agent cards, info cards
- **Features**: Favorite toggle, share functionality, image galleries
- **Usage Example**:
```erb
<div class="property-card" data-controller="card">
  <div class="property-card-image">
    <img src="property.jpg" alt="Property">
    <button class="btn-favorite" data-action="click->card#toggleFavorite">
      <i class="icon-heart"></i>
    </button>
  </div>
  <div class="property-card-content">
    <h3>강남구 아파트</h3>
    <div class="property-price">₩ 15억</div>
  </div>
</div>
```

#### 4. Navigation
- **Location**: `app/assets/stylesheets/components/_navigation.css`
- **Controller**: `app/javascript/controllers/navigation_controller.js`
- **Components**: Navbar, tabs, breadcrumbs, pagination, sidebar
- **Features**: Mobile responsive menu, dropdown menus, active state management
- **Usage Example**:
```erb
<nav class="navbar" data-controller="navigation">
  <button class="navbar-toggle" data-action="click->navigation#toggleMobile">
    <span class="navbar-toggle-icon"></span>
  </button>
  <div class="navbar-menu" data-navigation-target="menu">
    <!-- Menu items -->
  </div>
</nav>
```

#### 5. Badges & Alerts
- **Location**: `app/assets/stylesheets/components/_badges.css`
- **Controllers**: `modal_controller.js`, `alert_controller.js`
- **Types**: Status badges, alerts, toast notifications, modals
- **Real Estate Specific**: Property status (판매중, 계약중, 거래완료)
- **Usage Example**:
```erb
<span class="badge badge-success">판매중</span>
<span class="badge badge-warning">계약중</span>
<span class="badge badge-secondary">거래완료</span>
```

#### 6. Tables & Lists
- **Location**: `app/assets/stylesheets/components/_tables.css`
- **Controller**: `app/javascript/controllers/table_controller.js`
- **Features**: Sortable columns, filtering, searching, row selection
- **Responsive**: Mobile-friendly horizontal scrolling
- **Usage Example**:
```erb
<div class="table-responsive" data-controller="table">
  <table class="table">
    <thead>
      <tr>
        <th data-action="click->table#sort" data-column="price">가격</th>
        <th data-action="click->table#sort" data-column="area">면적</th>
      </tr>
    </thead>
    <tbody data-table-target="body">
      <!-- Table rows -->
    </tbody>
  </table>
</div>
```

#### 7. Loading States
- **Location**: `app/assets/stylesheets/components/_loading.css`
- **Types**: Spinners, skeleton screens, progress bars
- **Usage Example**:
```erb
<div class="spinner spinner-border"></div>
<div class="skeleton skeleton-text"></div>
<div class="progress">
  <div class="progress-bar" style="width: 60%"></div>
</div>
```

### Design System

#### CSS Variables
All design tokens are defined in `app/assets/stylesheets/components/_variables.css`:
- **Colors**: Primary, secondary, success, danger, warning, info, light, dark
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale (4px base unit)
- **Shadows**: Elevation levels for depth
- **Transitions**: Consistent animation timings

#### Customization
To customize the design system:
1. Edit CSS variables in `_variables.css`
2. Override specific component styles in respective CSS files
3. Add custom Stimulus behaviors by extending controllers

### Best Practices

1. **Consistency**: Always use existing components before creating new ones
2. **Accessibility**: Components include ARIA labels and keyboard navigation
3. **Mobile First**: Components are responsive by default
4. **Performance**: Use Stimulus controllers for interactivity (no jQuery)
5. **Reusability**: Use Rails partials for component templates

### Component Development Workflow

1. **Creating New Components**:
   - Add styles to `app/assets/stylesheets/components/`
   - Create Stimulus controller in `app/javascript/controllers/`
   - Import CSS in `application.css`
   - Add to showcase page for documentation

2. **Using Components**:
   - Copy HTML structure from showcase page
   - Add appropriate Stimulus data attributes
   - Customize with CSS classes and data attributes

3. **Testing Components**:
   - Visit showcase page at `/components`
   - Test responsive behavior
   - Verify keyboard navigation
   - Check screen reader compatibility

## Important Notes

- No test framework is currently configured (Rails test_unit is disabled, no RSpec/Minitest setup found)
- The project uses Hotwire (Turbo + Stimulus) for frontend interactivity without a separate frontend framework
- All background job processing, caching, and websockets are database-backed using the Solid* gems
- Kamal deployment expects Docker images pushed to a registry (configure in `config/deploy.yml`)
- UI components are designed specifically for real estate applications with Korean market considerations