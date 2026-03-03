# Zyoea — Restaurant Management Platform

A full-stack restaurant management platform (FoodApp) for handling restaurants, menus, orders, bookings, employees, reviews, and payments.

## Architecture

```
┌─────────────────────────────────────────────┐
│           Client (Browser / Desktop)         │
│         Astro 5 + React (Islands)            │
│         Apollo Client (GraphQL)              │
│         TailwindCSS v4 + Nano Stores         │
└───────────────────┬─────────────────────────┘
                    │  HTTP / GraphQL
                    ▼
┌─────────────────────────────────────────────┐
│           GraphQL API (Go + gqlgen)          │
│           Gin HTTP Router + JWT Auth         │
│           Stripe Payments                    │
└───────────┬─────────────────┬───────────────┘
            │                 │
            ▼                 ▼
┌───────────────────┐ ┌───────────────────────┐
│    PostgreSQL      │ │        Redis           │
│   (Primary DB)     │ │   (Cache Layer)        │
└───────────────────┘ └───────────────────────┘
```

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Astro 5, React (islands), Apollo Client, TailwindCSS v4, Nano Stores |
| Backend   | Go, gqlgen (GraphQL), Gin HTTP router, JWT, bcrypt |
| Database  | PostgreSQL (pgx/v5), Redis                      |
| Payments  | Stripe                                          |

## Project Structure

```
zyoea-app/
├── api/            # Go + GraphQL backend
│   ├── cmd/api/    # Application entry point
│   ├── database/   # DB connection helpers
│   ├── graph/      # GraphQL schema & resolvers
│   └── services/   # Business logic (auth, products, orders, …)
└── web/            # Astro + React frontend
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── layouts/
        ├── pages/
        └── types/
```

## Prerequisites

- [Go](https://golang.org/) 1.21+
- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/) 15+
- [Redis](https://redis.io/) 7+
- [Stripe](https://stripe.com/) account (for payment processing)

## Quick Start

### Backend

```bash
cd api
cp .env.example .env   # fill in your values
go run ./cmd/api
```

The API will be available at `http://localhost:8080`.  
GraphQL Playground: `http://localhost:8080/playground`

### Frontend

```bash
cd web
cp .env.example .env   # fill in your values
npm install
npm run dev
```

The web app will be available at `http://localhost:4321`.

## Environment Variables

### Backend (`api/.env`)

| Variable              | Description                        |
|-----------------------|------------------------------------|
| `DATABASE_URL`        | PostgreSQL connection string       |
| `PORT`                | HTTP server port (default: `8080`) |
| `JWT_SECRET`          | Secret key for signing JWT tokens  |
| `STRIPE_SECRET_KEY`   | Stripe secret key                  |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key          |
| `ALLOWED_ORIGINS`     | CORS allowed origins               |

### Frontend (`web/.env`)

| Variable          | Description                              |
|-------------------|------------------------------------------|
| `PUBLIC_API_URL`  | GraphQL API URL (default: `http://localhost:8080/query`) |

## Documentation

- [Backend README](api/README.md)
- [Frontend README](web/README.md)
