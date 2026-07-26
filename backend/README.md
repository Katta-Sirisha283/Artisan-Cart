# Handmade & Co. — Backend (Spring Boot)

AI-enhanced e-commerce API for a boutique handmade goods store (ceramics & jewelry). Built with Java, Spring Boot, Spring Security (JWT), and an embedded H2 database.

## Features

- **Product catalog** — browse, filter by category, search by name
- **Cart & checkout** — add/remove items, place orders, automatic stock decrement
- **Customer accounts** — JWT-based registration/login, order history
- **AI features** (powered by the Claude API):
  - Auto-generated product descriptions from name/category/material
  - AI customer support chatbot (shipping, returns, sizing questions)
  - Recommendation explanation generator

## Tech Stack

| Layer | Choice |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.3 |
| Security | Spring Security + JWT (jjwt) |
| Database | H2 (embedded, in-memory) |
| Build tool | Maven |
| AI | Anthropic Claude API |
| Deployment | Vercel (Docker container) |

## Project Structure

```
src/main/java/com/boutique/ecommerce/
├── model/          # JPA entities: Product, Customer, CartItem, Order, OrderItem
├── repository/      # Spring Data JPA repositories
├── service/         # Business logic: AuthService, CartService, AiService
├── controller/      # REST controllers
├── security/        # JWT filter + util
└── config/          # Security configuration
```

## Running Locally

Prerequisites: Java 17, Maven.

```bash
# Set your Claude API key (optional — AI endpoints degrade gracefully without it)
export ANTHROPIC_API_KEY=your-key-here

mvn spring-boot:run
```

The API will be available at `http://localhost:8080`. The H2 console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:boutiquedb`, user `sa`, no password).

Seed data (6 sample products) loads automatically on startup via `data.sql`.

## API Endpoints

| Method | Path | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Log in, returns JWT |
| GET | `/api/products` | No | List products (supports `?category=` and `?search=`) |
| GET | `/api/products/featured` | No | Featured products |
| GET | `/api/products/{id}` | No | Product detail |
| POST | `/api/products/generate-description` | No | AI-generate a product description |
| GET | `/api/cart` | Yes | View cart |
| POST | `/api/cart` | Yes | Add item to cart |
| DELETE | `/api/cart/{id}` | Yes | Remove cart item |
| POST | `/api/cart/checkout` | Yes | Place order from cart |
| GET | `/api/orders` | Yes | Order history |
| POST | `/api/chat` | No | AI support chatbot |

For authenticated endpoints, send `Authorization: Bearer <token>` using the token returned by login/register.

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | Server port | `8080` |
| `ANTHROPIC_API_KEY` | Claude API key for AI features | none (AI endpoints return a fallback message) |
| `JWT_SECRET` | Secret for signing JWTs | dev placeholder — **set a real value in production** |
| `FRONTEND_ORIGIN` | Allowed CORS origin (your deployed frontend URL) | `http://localhost:3000` |

## Deployment (Vercel)

This backend deploys to Vercel as a Docker container using `Dockerfile.vercel` (Vercel's newer any-Dockerfile deploy support). Vercel builds the image, runs it, and routes traffic to the port specified by the `PORT` environment variable it injects.

Required GitHub repo secrets for the CI/CD pipeline (`.github/workflows/deploy.yml`):
- `VERCEL_TOKEN` — from your Vercel account settings
- Project must be linked with `vercel link` once locally, or configured with `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` if you prefer the non-interactive setup

On every push to `main`: the pipeline builds and tests the Maven project, then deploys via the Vercel CLI.

**Note:** Vercel's Docker/any-language support is a newer capability. If your Vercel account or CLI version doesn't yet support `Dockerfile.vercel`, check Vercel's current documentation — Render or Railway remain solid fallback hosts for a Spring Boot container if needed.
