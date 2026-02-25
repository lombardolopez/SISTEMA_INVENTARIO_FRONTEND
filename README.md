# Sistema de Inventario — Frontend

> Angular 20 frontend for a carpentry inventory management SaaS. Handles product stock, movements, categories, alerts, and user administration through a modern, responsive interface.

![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?logo=chartdotjs&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.8-F7B93E?logo=prettier&logoColor=black)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
  - [Bootstrap & Configuration](#bootstrap--configuration)
  - [Layout System](#layout-system)
  - [Feature Modules](#feature-modules)
  - [Core Layer](#core-layer)
  - [Shared Layer](#shared-layer)
- [Routing](#routing)
- [Data Models](#data-models)
- [Roles & Authorization](#roles--authorization)
- [Code Quality](#code-quality)
- [Configuration](#configuration)
- [Backend Integration](#backend-integration)

---

## Overview

This application provides a complete inventory management interface for carpentry businesses. It currently uses an in-memory mock data layer that simulates real API latency, making it fully functional without a running backend. When the Spring Boot backend is ready, only the service implementations need to change — all components remain untouched.

**Key capabilities:**

- Dashboard with KPI stats, stock distribution chart, and movement trends
- Full product CRUD with search, category filter, and pagination
- Stock movement tracking (entries and exits) with reason codes
- Automatic low-stock alerts with severity levels (critical / warning)
- Category management with color coding
- User and role administration (admin only)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 20 (standalone components) |
| Language | TypeScript 5.8 (strict mode) |
| Styling | Tailwind CSS v4 (PostCSS plugin) |
| Charts | Chart.js 4 + ng2-charts 8 |
| Forms | Angular Reactive Forms |
| State | Angular Signals (`signal`, `computed`) |
| Testing | Karma + Jasmine |
| Linting | ESLint 9 + angular-eslint + typescript-eslint |
| Formatting | Prettier 3 |
| Build | `@angular/build:application` (esbuild) |

---

## Prerequisites

- **Node.js** v22 or higher
- **npm** v11 or higher

```bash
node --version  # v22+
npm --version   # v11+
```

---

## Getting Started

```bash
# 1. Navigate to the frontend directory
cd "Sistema de Inventario/frontend"

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start the development server
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The app hot-reloads on file changes.

**Default credentials (mock):**

| Email | Password | Role |
|---|---|---|
| `admin@inventario.com` | `admin123` | Admin |
| `almacen@inventario.com` | `almacen123` | Warehouse Manager |
| `viewer@inventario.com` | `viewer123` | Viewer |

---

## Available Scripts

Run all commands from the `frontend/` directory.

| Command | Description |
|---|---|
| `npm start` | Dev server on `localhost:4200` with hot reload |
| `npm run build` | Production build — output in `dist/` |
| `npm run watch` | Dev build in watch mode |
| `npm test` | Unit tests with Karma + Jasmine |
| `npm run lint` | Lint TypeScript and HTML templates |
| `npm run lint:fix` | Lint and auto-fix violations |
| `npm run format` | Format all `src/**/*.{ts,html,css}` with Prettier |
| `npm run format:check` | Verify formatting without modifying files |
| `npm run typecheck` | TypeScript type check without emitting files |
| `npm run check` | Full quality check: typecheck + lint + format:check |

> **Tip:** Run `npm run format && npm run lint:fix` before committing, then `npm run check` to confirm everything is clean.

> **Note:** Always install new packages with `--legacy-peer-deps` due to Angular 20 peer dependency resolution.

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.config.ts          # Application providers & router config
│   │   ├── app.routes.ts          # Top-level route definitions
│   │   ├── app.ts                 # Root component
│   │   │
│   │   ├── core/                  # Singleton services, models, guards
│   │   │   ├── data/              # In-memory mock datasets
│   │   │   │   ├── mock-products.ts
│   │   │   │   ├── mock-categories.ts
│   │   │   │   ├── mock-movements.ts
│   │   │   │   └── mock-users.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts        # Redirect to /auth/login if unauthenticated
│   │   │   │   └── role.guard.ts        # Redirect to /dashboard if unauthorized role
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts  # Attaches Bearer token to requests
│   │   │   │   └── error.interceptor.ts # Handles 401/403/0 responses
│   │   │   ├── models/
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── category.model.ts
│   │   │   │   ├── movement.model.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── alert.model.ts
│   │   │   │   ├── dashboard.model.ts
│   │   │   │   ├── api.model.ts         # ApiResponse, PagedResponse
│   │   │   │   └── auth.model.ts        # LoginRequest, AuthResponse
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── product.service.ts
│   │   │       ├── category.service.ts
│   │   │       ├── movement.service.ts
│   │   │       ├── user.service.ts
│   │   │       ├── alert.service.ts
│   │   │       └── dashboard.service.ts
│   │   │
│   │   ├── features/              # Lazy-loaded feature modules
│   │   │   ├── dashboard/
│   │   │   │   ├── components/    # StatsCard, StockChart, MovementsChart, etc.
│   │   │   │   ├── dashboard.ts
│   │   │   │   └── dashboard.routes.ts
│   │   │   ├── products/
│   │   │   │   ├── product-list/
│   │   │   │   ├── product-form/
│   │   │   │   ├── product-detail/
│   │   │   │   └── products.routes.ts
│   │   │   ├── categories/
│   │   │   │   ├── category-list/
│   │   │   │   ├── category-form/
│   │   │   │   └── categories.routes.ts
│   │   │   ├── movements/
│   │   │   │   ├── movement-list/
│   │   │   │   ├── movement-form/
│   │   │   │   └── movements.routes.ts
│   │   │   ├── alerts/
│   │   │   │   ├── alert-list/
│   │   │   │   └── alerts.routes.ts
│   │   │   ├── users/             # Admin-only
│   │   │   │   ├── user-list/
│   │   │   │   ├── user-form/
│   │   │   │   └── users.routes.ts
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       └── auth.routes.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── main-layout/       # Sidebar + Navbar + router-outlet
│   │   │   └── auth-layout/       # Centered container for login
│   │   │
│   │   └── shared/
│   │       ├── components/        # Reusable UI components
│   │       │   ├── sidebar/
│   │       │   ├── navbar/
│   │       │   ├── page-header/
│   │       │   ├── stock-badge/
│   │       │   ├── search-bar/
│   │       │   ├── confirm-dialog/
│   │       │   └── empty-state/
│   │       └── pipes/
│   │           └── stock-status.pipe.ts
│   │
│   ├── environments/
│   │   ├── environment.ts         # Development: API on localhost:8080
│   │   └── environment.prod.ts    # Production environment
│   │
│   ├── index.html                 # Inter font, app-root host
│   ├── main.ts                    # bootstrapApplication entry point
│   └── styles.css                 # Tailwind v4 import + @theme custom palette
│
├── eslint.config.js               # ESLint 9 flat config (Angular + TypeScript rules)
├── .prettierrc.json               # Prettier formatting rules
├── .editorconfig                  # Editor whitespace/encoding settings
├── postcss.config.json            # Tailwind v4 PostCSS plugin (JSON — required by esbuild)
├── angular.json                   # Angular CLI workspace config
├── tsconfig.json                  # Base TypeScript config (strict mode)
├── tsconfig.app.json              # App build TypeScript config
└── tsconfig.spec.json             # Test TypeScript config
```

---

## Architecture

### Bootstrap & Configuration

```
src/main.ts
  └── bootstrapApplication(App, appConfig)
        └── appConfig (app.config.ts)
              ├── provideRouter(routes, withComponentInputBinding())
              └── provideZoneChangeDetection({ eventCoalescing: true })
```

### Layout System

The app uses two layout shells, selected at the route level:

| Layout | Path | Description |
|---|---|---|
| `MainLayout` | Protected routes | Dark sidebar + top navbar + `<router-outlet>`. Manages sidebar collapse and mobile menu state via signals. |
| `AuthLayout` | `/auth/*` | Centered container for the login page. |

### Feature Modules

All features are lazy-loaded via `loadChildren()`. Each feature has its own `*.routes.ts` file.

#### Dashboard (`/dashboard`)

Executive overview with:

- **StatsCard** — KPI metrics: total products, categories, users, active alerts, monthly movements
- **StockChart** — Doughnut chart (Chart.js) — stock distribution by category
- **MovementsChart** — Bar chart (Chart.js) — daily entries vs. exits over 7 days
- **RecentMovements** — Chronological list of the latest inventory events
- **LowStockList** — Products where `currentStock <= minimumStock`

#### Products (`/products`)

Full CRUD with:
- **ProductList** — Searchable, filterable table with pagination. Search by name or SKU; filter by category.
- **ProductForm** — Reactive form: name, SKU, description, category, unit, stock levels (current/minimum), unit price, storage location.
- **ProductDetail** — Read-only view with movement history for that product. Edit and delete actions.

#### Categories (`/categories`)

- **CategoryList** — Card grid showing category name, description, color badge, and product count.
- **CategoryForm** — Create/edit: name, description, color picker.

#### Movements (`/movements`)

- **MovementList** — Filter by type (entry/exit) and date range.
- **MovementForm** — Select product, movement type, quantity, reason (`purchase` | `production` | `sale` | `adjustment` | `return`), optional notes.

#### Alerts (`/alerts`)

- **AlertList** — Shows auto-generated low-stock alerts. Filter by severity or acknowledgement status. One-click acknowledge.

#### Users (`/users`) — Admin only

- **UserList** — User table with role badge and active/inactive toggle.
- **UserForm** — Create/edit: name, email, password, role.

#### Auth (`/auth/login`)

- **Login** — Two-panel layout (branded left panel + form right panel). Redirects to `/dashboard` on success.

### Core Layer

#### Services

All services are `providedIn: 'root'` and return `Observable<T>` with simulated API latency (`delay()`).

| Service | Key Methods |
|---|---|
| `AuthService` | `login()`, `logout()`, `getCurrentUser()`, `isAuthenticated()`, `hasRole()`, `getToken()` |
| `ProductService` | `getAll()`, `getById()`, `getLowStock()`, `search()`, `create()`, `update()`, `delete()` |
| `CategoryService` | `getAll()`, `getById()`, `create()`, `update()`, `delete()` |
| `MovementService` | `getAll()`, `getById()`, `getByProductId()`, `getRecent()`, `create()` |
| `UserService` | `getAll()`, `getById()`, `create()`, `update()`, `toggleActive()`, `delete()` |
| `AlertService` | `getAll()`, `getActive()`, `getActiveCount()`, `acknowledge()`, `generateAlerts()` |
| `DashboardService` | `getStats()`, `getStockByCategory()`, `getMovementsByDay()` |

#### HTTP Interceptors

| Interceptor | Behavior |
|---|---|
| `AuthInterceptor` | Reads token from `localStorage` and adds `Authorization: Bearer <token>` to all outgoing requests. |
| `ErrorInterceptor` | Handles `401` (auto-logout + redirect to login), `403` (log warning), `0` (network error log). |

#### Guards

| Guard | Type | Behavior |
|---|---|---|
| `authGuard` | `CanActivateFn` | Reads `localStorage.token`. Redirects to `/auth/login` if absent. |
| `roleGuard(...roles)` | Factory → `CanActivateFn` | Reads `localStorage.user`. Redirects to `/dashboard` if role not in `allowedRoles`. |

### Shared Layer

#### Components

| Component | Inputs | Outputs | Description |
|---|---|---|---|
| `Sidebar` | `collapsed`, `mobileOpen` | `closeMobile` | Role-aware nav with 6 items. Hides "Users" for non-admins. |
| `Navbar` | `sidebarCollapsed` | `menuToggle` | Top bar with unread alerts badge and user dropdown. |
| `PageHeader` | `title` *(required)*, `subtitle` | — | Section heading component. |
| `StockBadge` | `currentStock`, `minimumStock` | — | Color-coded badge: in-stock / low-stock / out-of-stock. |
| `SearchBar` | `placeholder`, `value` | `searchChange` | Debounced search input (300 ms). |
| `ConfirmDialog` | `open`, `title`, `message` | `confirmed`, `cancelled` | Modal confirmation dialog. |
| `EmptyState` | `message` *(required)*, `icon` | — | Placeholder for empty lists. |

#### Pipes

| Pipe | Input | Output |
|---|---|---|
| `StockStatusPipe` | `currentStock`, `minimumStock` | `'in-stock'` \| `'low-stock'` \| `'out-of-stock'` |

---

## Routing

```
/ ──┬── (MainLayout + authGuard)
    ├── /dashboard
    ├── /products
    │     ├── /                  ProductList
    │     ├── /new               ProductForm (create)
    │     ├── /:id               ProductDetail
    │     └── /:id/edit          ProductForm (edit)
    ├── /categories
    │     ├── /                  CategoryList
    │     ├── /new               CategoryForm (create)
    │     └── /:id/edit          CategoryForm (edit)
    ├── /movements
    │     ├── /                  MovementList
    │     └── /new               MovementForm
    ├── /alerts
    │     └── /                  AlertList
    └── /users ── (roleGuard: admin)
          ├── /                  UserList
          ├── /new               UserForm (create)
          └── /:id/edit          UserForm (edit)

/auth ── (AuthLayout)
    └── /login                   Login

** ── redirect to /dashboard
```

---

## Data Models

```typescript
// Key union types
type Role            = 'admin' | 'warehouse_manager' | 'viewer';
type MovementType    = 'entry' | 'exit';
type MovementReason  = 'purchase' | 'production' | 'sale' | 'adjustment' | 'return';
type AlertSeverity   = 'critical' | 'warning';
type ProductUnit     = 'piece' | 'board' | 'kg' | 'liter' | 'meter' | 'box' | 'sheet';
```

| Model | Key Fields |
|---|---|
| `Product` | `id`, `name`, `sku`, `categoryId`, `unit`, `currentStock`, `minimumStock`, `unitPrice`, `location` |
| `Category` | `id`, `name`, `description`, `color`, `productCount` |
| `Movement` | `id`, `productId`, `type`, `quantity`, `reason`, `notes?`, `performedBy`, `createdAt` |
| `User` | `id`, `name`, `email`, `role`, `isActive` |
| `StockAlert` | `id`, `productId`, `severity`, `acknowledged`, `acknowledgedBy?`, `acknowledgedAt?` |

**API Response wrappers** (ready for backend integration):

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
```

---

## Roles & Authorization

| Role | Access |
|---|---|
| `admin` | Full access — all features including user management |
| `warehouse_manager` | Products, categories, movements, alerts |
| `viewer` | Read-only — dashboard and product/movement views |

- **Route-level**: `roleGuard('admin')` applied to `/users`.
- **UI-level**: `Sidebar` hides "Users" for non-admins. Components check `authService.hasRole()` for action buttons.

---

## Code Quality

Three tools enforce consistent, clean code across the project.

### ESLint — static analysis

```bash
npm run lint          # Check for violations
npm run lint:fix      # Auto-fix what's possible
```

Configured in `eslint.config.js` (ESLint 9 flat config):
- **TypeScript rules** via `typescript-eslint` (recommended + stylistic)
- **Angular rules** via `angular-eslint` (component selectors, template best practices)
- **Prettier integration** via `eslint-config-prettier` (disables conflicting rules)

### Prettier — code formatting

```bash
npm run format        # Format all src/ files
npm run format:check  # Verify formatting (CI-safe)
```

Configured in `.prettierrc.json`:

| Option | Value |
|---|---|
| Print width | 100 (120 for HTML) |
| Tab width | 2 spaces |
| Quotes | Single (TypeScript), Double (CSS) |
| Trailing commas | All |
| End of line | LF |

### TypeScript — type checking

```bash
npm run typecheck     # Full type check, no emit
```

Uses `tsconfig.app.json` in strict mode: `strict`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `strictTemplates`, `strictInjectionParameters`.

### Full quality check

```bash
npm run check         # typecheck → lint → format:check
```

Run this before every pull request or merge.

---

## Configuration

### Tailwind CSS v4

Tailwind v4 is configured via a PostCSS plugin — no `tailwind.config.js` needed.

```json
// postcss.config.json  ← must be JSON (esbuild ignores .js config)
{ "plugins": { "@tailwindcss/postcss": {} } }
```

```css
/* src/styles.css */
@import "tailwindcss";

@source "./src/index.html";
@source "./src/app/**/*.html";
@source "./src/app/**/*.ts";

@theme {
  --color-primary-50:  #eef2ff;
  /* ... indigo palette (50→900) */
  --color-primary-600: #4f46e5;
  --color-primary-900: #312e81;
}
```

> **Important:** The builder (`@angular/build:application`) only reads JSON PostCSS configs. Using `postcss.config.js` will silently break Tailwind — all utilities will be missing from the output bundle.

### Environment files

```typescript
// src/environments/environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};
```

```typescript
// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080/api', // Update for production deploy
};
```

### Angular coding conventions

```typescript
// ✅ Standalone components — no NgModules
@Component({ standalone: true, ... })

// ✅ inject() function — no constructor injection
private productService = inject(ProductService);

// ✅ Signal-based inputs
title = input.required<string>();
subtitle = input<string>('');

// ✅ Modern control flow
@if (isLoading()) { ... }
@for (item of items(); track item.id) { ... }

// ✅ Signals for state
protected products = signal<Product[]>([]);
protected isLoading = signal(false);
protected filtered = computed(() => this.products().filter(...));
```

---

## Backend Integration

The frontend is fully decoupled from the backend. All data access goes through services in `src/app/core/services/`. When the Spring Boot API is ready:

1. **Add `HttpClient`** — update `app.config.ts`:
   ```typescript
   provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
   ```

2. **Replace service implementations** — swap in-memory arrays for `HttpClient` calls:
   ```typescript
   // Before (mock)
   getAll(): Observable<Product[]> {
     return of(MOCK_PRODUCTS).pipe(delay(300));
   }

   // After (real API)
   getAll(): Observable<PagedResponse<Product>> {
     return this.http.get<PagedResponse<Product>>(`${this.apiUrl}/products`);
   }
   ```

3. **Components stay unchanged** — they depend only on the `Observable<T>` contract.

**Backend spec:**
- Spring Boot 3.4.3 — REST API on `http://localhost:8080`
- Base path: `/api`
- MongoDB: `inventario` database on `localhost:27017`
- Auth: JWT Bearer tokens

---

*Built with [Angular CLI](https://github.com/angular/angular-cli) v20.0.4.*
