# Handmade & Co. — AI-Enhanced E-Commerce Storefront

A boutique storefront for handmade ceramics and jewelry, built as a monorepo with a React frontend and a Java/Spring Boot backend, enhanced with AI features powered by the Claude API.

## Structure

```
ecommerce-project/
├── backend/     # Spring Boot REST API (Java 17, H2 database, JWT auth)
├── frontend/    # React storefront (catalog, cart, checkout, AI chat widget)
└── .github/workflows/
    ├── backend-deploy.yml   # Runs only when backend/** changes
    └── frontend-deploy.yml  # Runs only when frontend/** changes
```

See `backend/README.md` and `frontend/README.md` for setup, environment variables, and API details specific to each part.

## AI Features

- **Product descriptions** — generated from name/category/material via the Claude API
- **Customer support chatbot** — answers shipping/returns/sizing questions, embedded as a widget on every page
- **Recommendation explanations** — short natural-language reasoning for why a product is suggested

## Quick Start (local development)

```bash
# Backend
cd backend
export ANTHROPIC_API_KEY=your-key-here   # optional, AI endpoints degrade gracefully without it
mvn spring-boot:run                       # runs on :8080

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm start                                 # runs on :3000
```

## Deployment

Both halves deploy independently to Vercel:
- **Backend** deploys as a Docker container (`backend/Dockerfile.vercel`) since Spring Boot needs a long-running JVM process
- **Frontend** deploys as a standard static build

Even though the code lives in one repo, each side has its own GitHub Actions workflow (path-filtered so a backend change doesn't trigger a frontend redeploy and vice versa) and its own Vercel project. When setting up Vercel, point one project's root directory at `backend/` and the other at `frontend/`.

### Required GitHub Secrets

| Secret | Used by | Purpose |
|---|---|---|
| `VERCEL_TOKEN_BACKEND` | backend-deploy.yml | Vercel auth token for backend project |
| `VERCEL_TOKEN_FRONTEND` | frontend-deploy.yml | Vercel auth token for frontend project |
| `REACT_APP_API_BASE_URL` | frontend-deploy.yml | Live backend URL, baked into the frontend build |

### Deploy order

1. Deploy backend first, note its live URL
2. Set that URL as `REACT_APP_API_BASE_URL` (frontend secret) and redeploy frontend
3. Set the frontend's live URL as `FRONTEND_ORIGIN` in the backend's Vercel environment variables (for CORS)
