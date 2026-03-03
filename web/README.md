# Zyoea Web — Astro + React Frontend

## Overview

The frontend is an Astro 5 application using React islands for interactive components. It communicates with the backend via Apollo Client (GraphQL).

## Running the Web App

```bash
cp .env.example .env   # fill in your values
npm install
npm run dev
```

The app will be available at `http://localhost:4321`.

## Environment Variables

Create a `.env` file in the `web/` directory (see `.env.example`):

| Variable         | Description                                                      |
|------------------|------------------------------------------------------------------|
| `PUBLIC_API_URL` | GraphQL API URL (default: `http://localhost:8080/query`)         |

## Project Structure

```
web/src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components (Astro + React)
│   └── custom/     # Custom components (Toast, etc.)
├── context/        # Global state via Nano Stores
│   ├── AuthContext.tsx    # User authentication state
│   ├── OrderContext.tsx   # Shopping cart state
│   └── ThemeContext.tsx   # UI theme state
├── hooks/          # Apollo GraphQL hooks per domain
│   ├── useRestaurants.tsx
│   ├── useCategories.tsx
│   ├── useProducts.tsx
│   ├── useOrders.tsx
│   ├── useBookings.tsx
│   ├── useEmployees.tsx
│   ├── useTables.tsx
│   ├── useReviews.tsx
│   └── usePayments.tsx
├── layouts/        # Astro layout components
├── libs/           # Shared utilities (Apollo client setup)
├── pages/          # Astro page routes
├── styles/         # Global styles (TailwindCSS)
└── types/          # TypeScript interfaces
```

## Component Architecture

### Astro Islands

Astro renders pages as static HTML by default. React components are used as interactive "islands" with `client:load`, `client:visible`, or `client:idle` directives, minimizing JavaScript sent to the browser.

### State Management

Global state is managed with [Nano Stores](https://github.com/nanostores/nanostores):
- **AuthContext** — current user session (persisted in `localStorage`)
- **OrderContext** — shopping cart (persisted in `localStorage`)

### Data Fetching

Each domain has a dedicated React hook in `src/hooks/` that wraps Apollo Client queries and mutations, exposing a simple CRUD interface to components.

## Commands

| Command             | Action                                 |
|---------------------|----------------------------------------|
| `npm run dev`       | Start dev server at `localhost:4321`   |
| `npm run build`     | Build production site to `./dist/`     |
| `npm run preview`   | Preview production build locally       |
| `npm run astro ...` | Run Astro CLI commands                 |
