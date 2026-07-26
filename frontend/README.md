# Handmade & Co. — Frontend (React)

A boutique storefront for handmade ceramics and jewelry, built in React. Talks to the [Spring Boot backend](../ecommerce-backend) for products, cart, checkout, and AI features.

## Features

- Product catalog with category filtering
- Product detail pages with add-to-cart
- Cart and checkout flow
- Customer login/registration (JWT-based)
- Order history
- AI-powered support chatbot widget (bottom-right corner on every page)

## Tech Stack

- React 18 (Create React App)
- React Router for navigation
- Axios for API calls
- Context API for auth state (no Redux needed for this scope)

## Project Structure

```
src/
├── api/            # Axios client + API functions
├── components/     # Navbar, ProductCard, ChatWidget
├── context/         # AuthContext (login/register/logout state)
├── pages/           # ShopPage, ProductDetailPage, CartPage, OrdersPage, LoginPage
├── App.js           # Routes
└── index.js         # Entry point
```

## Running Locally

Prerequisites: Node.js 18+.

```bash
npm install
cp .env.example .env
# edit .env if your backend isn't running on localhost:8080
npm start
```

Runs at `http://localhost:3000`.

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `REACT_APP_API_BASE_URL` | Base URL of the backend API | `http://localhost:8080` |

## Deployment (Vercel)

Standard Vercel static deployment (Create React App preset). The GitHub Actions pipeline (`.github/workflows/deploy.yml`) builds, tests, and deploys on every push to `main`.

Required GitHub repo secrets:
- `VERCEL_TOKEN` — from your Vercel account settings
- `REACT_APP_API_BASE_URL` — the deployed backend's URL (set as a secret so it's baked into the production build)

Once deployed, make sure the backend's `FRONTEND_ORIGIN` environment variable is updated to match this frontend's production URL so CORS allows requests through.
