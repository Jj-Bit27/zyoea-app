# Zyoea API — Go + GraphQL Backend

## Overview

The backend is a GraphQL API built with Go, gqlgen, and Gin. It serves as the single data layer for the Zyoea restaurant management platform.

## Running the API

```bash
cp .env.example .env   # fill in your values
go run ./cmd/api
```

The server starts on the port defined by the `PORT` environment variable (default `8080`).

- **GraphQL endpoint:** `http://localhost:8080/query`
- **GraphQL Playground:** `http://localhost:8080/playground`
- **API docs:** `http://localhost:8080/docs`

## Environment Variables

Create a `.env` file in the `api/` directory (see `.env.example`):

| Variable                 | Required | Description                              |
|--------------------------|----------|------------------------------------------|
| `DATABASE_URL`           | ✅        | PostgreSQL connection string             |
| `PORT`                   |          | HTTP server port (default: `8080`)       |
| `JWT_SECRET`             | ✅        | Secret key for signing JWT tokens        |
| `STRIPE_SECRET_KEY`      | ✅        | Stripe secret key for payment processing |
| `STRIPE_PUBLISHABLE_KEY` |          | Stripe publishable key                   |
| `ALLOWED_ORIGINS`        |          | CORS allowed origins (comma-separated)   |

## Database Setup

SQL schema files are located in `api/database/`. Run them against your PostgreSQL instance to set up the schema:

```bash
psql $DATABASE_URL -f database/schema.sql
```

## Service Architecture

The backend follows a clean architecture pattern where each domain has its own service:

| Service       | Responsibility                          |
|---------------|-----------------------------------------|
| `auth`        | Register, login, JWT, email verification |
| `restaurants` | Restaurant CRUD                         |
| `categories`  | Product category CRUD                   |
| `products`    | Menu product CRUD                       |
| `orders`      | Order creation and management           |
| `bookings`    | Table reservation management            |
| `tables`      | Restaurant table CRUD                   |
| `employees`   | Employee management                     |
| `reviews`     | Customer reviews                        |
| `payments`    | Stripe payment processing               |

## GraphQL Schema

The schema is split into per-domain files under `api/graph/schema/`:

- `user.schema.graphqls` — Auth types and mutations
- `restaurant.schema.graphqls` — Restaurant types
- `category.schema.graphqls` — Category types
- `product.schema.graphqls` — Product types
- `order.schema.graphqls` — Order types
- `booking.schema.graphqls` — Booking types
- `table.schema.graphqls` — Table types
- `employee.schema.graphqls` — Employee types
- `reviews.schema.graphqls` — Review types
- `payment.graphqls` — Payment types
