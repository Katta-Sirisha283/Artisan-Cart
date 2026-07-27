# Artisan-Cart — AI-Enhanced E-Commerce Storefront

A boutique storefront for handmade ceramics and jewelry, built as a monorepo with a React frontend and a Java/Spring Boot backend, enhanced with AI features powered by the Claude API.

**Live site:** https://artisan-cart-ashen.vercel.app
**Backend API:** https://artisan-cart.onrender.com

## Structure

Artisan-Cart/
├── backend/ # Spring Boot REST API (Java 17, H2 database, JWT auth)
├── frontend/ # React storefront (catalog, cart, checkout, AI chat widget)
└── .github/workflows/
├── backend-deploy.yml # Runs only when backend/** changes
└── frontend-deploy.yml # Runs only when frontend/** changes

See `backend/README.md` and `frontend/README.md` for setup, environment variables, and API details specific to each part.

## AI Features

- **Product descriptions** — generated from name/category/material via the Claude API
- **Customer support chatbot** — answers shipping/returns/sizing questions, embedded as a widget on every page
- **Recommendation explanations** — short natural-language reasoning for why a product is suggested

## Quick Start (local development)

Open two terminals — one for the backend, one for the frontend.

**Terminal 1 — Backend**

```powershell
cd backend

# Optional: enables real AI responses (chatbot, description generator).
# Without it, AI endpoints return a graceful fallback message instead.
$env:ANTHROPIC_API_KEY="your-key-here"

mvn spring-boot:run   # runs on :8080
# if port 8080 is already in use locally:
# mvn spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"
```

**Terminal 2 — Frontend**

```powershell
cd frontend
npm install
copy .env.example .env    # macOS/Linux: cp .env.example .env
```

Edit `frontend/.env` so `REACT_APP_API_BASE_URL` matches the backend port above, e.g. `http://localhost:8080`. Then:

```powershell
npm start   # runs on :3000
```

> **Note on data persistence:** the database is H2 running in-memory, so all data (accounts, orders, cart items) resets every time the backend restarts. You'll need to register a new account again after any backend restart during local testing.

## Deployment

- **Frontend** deploys to **Vercel** as a standard static build (root directory: `frontend/`)
- **Backend** deploys to **Render** as a Docker container (`backend/Dockerfile.vercel`), since Spring Boot needs a long-running JVM process

Both platforms build automatically from this repo. Each side also has its own GitHub Actions workflow (path-filtered, so a backend change doesn't trigger a frontend redeploy and vice versa) for build/test verification on every push.

> **Why two different hosts?** The backend was originally deployed on Vercel too, using its newer Docker/container support. That path hit a platform-level failure (every request returned `INTERNAL_FUNCTION_INVOCATION_FAILED` with no recoverable logs), most likely because Spring Boot's cold-start time is much longer than the lightweight runtimes that feature was built around. The exact same Docker image deployed and ran successfully on Render on the first attempt, so the backend now lives there while the frontend stays on Vercel.

### Required GitHub Secrets

| Secret | Used by | Purpose |
|---|---|---|
| `VERCEL_TOKEN` | frontend-deploy.yml | Vercel auth token for the frontend project |
| `REACT_APP_API_BASE_URL` | frontend-deploy.yml | Live Render backend URL, baked into the frontend build |

(Render deploys automatically from GitHub pushes via its own dashboard integration — no GitHub secret needed for that side.)

### Deploy order

1. Deploy backend to Render first, note its live URL (e.g. `https://artisan-cart.onrender.com`)
2. Set that URL as `REACT_APP_API_BASE_URL` in Vercel's environment variables and redeploy the frontend
3. Set the frontend's live Vercel URL as `FRONTEND_ORIGIN` in Render's environment variables (for CORS)

### A note on free-tier hosting

Render's free tier spins the backend down after 15 minutes of inactivity. The next request after that triggers a cold start (~60–95 seconds) while the JVM and database reinitialize. This is expected behavior, not a bug — subsequent requests are fast until it goes idle again.
