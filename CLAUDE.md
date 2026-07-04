# VectraCompute Agent Handoff

This project is a premium AI hardware ecommerce site for AI workstations,
refurbished GPU servers, GPUs, storage, networking, cooling, and related
infrastructure.

## Current Architecture

- Main repository: `kammket/VectraCompute`
- Vercel storefront repository: `kammket/vectracompute-storefront`
- Frontend: Next.js app in `storefront/`, deployed to Vercel.
- Backend: lightweight Node/TypeScript API in `backend/`, deployed to Railway.
- Database: Railway Postgres.
- Old Medusa backend is no longer the active backend. Do not reintroduce Medusa
  deployment commands unless the owner explicitly requests a migration back.

## Live URLs

- Storefront: `https://vectracompute-storefront.vercel.app`
- Railway backend: `https://vectracompute-ai-backend-production.up.railway.app`
- Admin login: `https://vectracompute-storefront.vercel.app/admin/login`
- Admin products: `https://vectracompute-storefront.vercel.app/admin/products`
- Admin orders: `https://vectracompute-storefront.vercel.app/admin/orders`

## Important Deployment Rule

There are two GitHub repos that must often be kept in sync:

1. `kammket/VectraCompute`
   - Contains the full source, including `backend/` and `storefront/`.
   - Railway backend deploys from `backend/` here.
2. `kammket/vectracompute-storefront`
   - Vercel deploys the storefront from this repo.
   - When changing frontend/storefront files, copy the same changes into this
     repo/clone and push it too.

In the current workspace, the Vercel storefront clone has been used at:

```text
/private/tmp/vectracompute-storefront-fix
```

Verify it still exists before relying on it.

## Required Vercel Environment Variables

Set these on the Vercel storefront project:

```env
NEXT_PUBLIC_BASE_URL=https://vectracompute-storefront.vercel.app
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_AI_BACKEND_URL=https://vectracompute-ai-backend-production.up.railway.app
AI_BACKEND_URL=https://vectracompute-ai-backend-production.up.railway.app
DATABASE_URL=railway_postgres_connection_string
ADMIN_PASSWORD=strong_admin_password
BITCOIN_WALLET_ADDRESS=bitcoin_wallet_address
BITCOIN_QR_CODE_URL=optional_qr_image_url
BITCOIN_REQUIRED_CONFIRMATIONS=2
BITCOIN_PAYMENT_EXPIRY=30
BITCOIN_PAYMENT_INSTRUCTIONS=Send the exact BTC amount and keep your transaction ID. Our team will confirm the payment before dispatch.
```

Do not put `XAI_API_KEY` in Vercel.

## Required Railway Backend Environment Variables

Set these on the Railway backend service:

```env
NODE_ENV=production
DATABASE_URL=railway_postgres_connection_string
STORE_CORS=https://vectracompute-storefront.vercel.app
XAI_API_KEY=grok_or_xai_api_key
XAI_MODEL=grok-3-mini
BITCOIN_WALLET_ADDRESS=bitcoin_wallet_address
BITCOIN_QR_CODE_URL=optional_qr_image_url
BITCOIN_PAYMENT_INSTRUCTIONS=Send the exact BTC amount and keep your transaction ID. Our team will confirm the payment before dispatch.
BITCOIN_REQUIRED_CONFIRMATIONS=2
BITCOIN_PAYMENT_EXPIRY=30
```

If a custom domain is added, append it to `STORE_CORS`.

## Backend Notes

The backend is intentionally small and Railway-friendly.

Key files:

- `backend/src/server.ts`
- `backend/src/catalog.ts`
- `backend/Dockerfile`
- `backend/package.json`
- `backend/README.md`

Backend endpoints:

- `GET /health`
- `GET /api/products?query=ai%20workstation&limit=2`
- `GET /api/payment-settings`
- `POST /api/ai/chat`
- `POST /api/ai/order`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/status`

The backend Dockerfile uses a multi-stage build. Keep it that way so TypeScript
is available during build but omitted from the runtime image.

## Storefront Notes

Key storefront files:

- Product seed catalog: `storefront/src/lib/catalog/seed-catalog.ts`
- Local product mapping: `storefront/src/lib/catalog/local-catalog.ts`
- Product listing/filter logic: `storefront/src/lib/data/products.ts`
- Product override/admin product logic:
  `storefront/src/lib/data/product-overrides.ts`
- Checkout/order storage: `storefront/src/lib/data/simple-orders.ts`
- AI chat widget:
  `storefront/src/modules/ai-chat/components/ai-sales-chat.tsx`
- Main public layout where AI chat is mounted:
  `storefront/src/app/[countryCode]/(main)/layout.tsx`
- Admin products page: `storefront/src/app/admin/products/page.tsx`
- Admin orders page: `storefront/src/app/admin/orders/page.tsx`

Normal checkout first attempts direct Vercel Postgres storage via `DATABASE_URL`.
If that fails, it falls back to Railway backend order endpoints using
`AI_BACKEND_URL` or `NEXT_PUBLIC_AI_BACKEND_URL`.

## Product Catalog State

The catalog currently has 84 products.

- 79 products have three configuration variants.
- 5 simple accessories have two variants.
- Prices were adjusted to follow the requested 35% below-market positioning.
- Product pages and filters rely heavily on metadata in `seed-catalog.ts`, so
  keep SEO/product text technical and product-specific.

## Testing Commands

From repo root:

```bash
npm run build
```

Backend only:

```bash
cd backend
npm run build
```

Storefront only:

```bash
cd storefront
npm run build
```

Backend health check:

```bash
curl -sS https://vectracompute-ai-backend-production.up.railway.app/health
```

Backend order endpoint check:

```bash
curl -sS https://vectracompute-ai-backend-production.up.railway.app/api/orders
```

## Known Operational Pitfalls

- If checkout says order storage is not connected, check Vercel env vars and
  redeploy. The fallback also requires `AI_BACKEND_URL` or
  `NEXT_PUBLIC_AI_BACKEND_URL`.
- If admin orders are empty but AI orders exist, Vercel and Railway may be using
  different Postgres databases.
- If AI chat answers with fallback text, Railway may not have a valid/credited
  `XAI_API_KEY`.
- The admin login currently uses `ADMIN_PASSWORD`; there is no email login in
  the current custom admin.
- Vercel deploys from `kammket/vectracompute-storefront`, not only from the
  main repo. Frontend changes must be pushed there too.

## Suggested Next Improvements

- Add auth/API token protection between Vercel and Railway backend order
  endpoints.
- Add dedicated admin controls for AI settings, payment settings, and prompt
  tuning.
- Add richer AI order metadata and conversation transcript storage.
- Add upload storage for product images using a durable image host or object
  storage.
- Add stronger observability: backend request logs, order creation alerts, and
  failed checkout logging.
