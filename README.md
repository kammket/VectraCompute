# VectraCompute

Premium ecommerce website for AI workstations, refurbished GPU servers, and AI
hardware infrastructure.

The current production architecture is intentionally simple:

- **Next.js storefront and admin** in `storefront/`, deployed to Vercel
- **Lightweight Node/TypeScript backend** in `backend/`, deployed to Railway
- **Railway PostgreSQL** for order/admin data storage
- **Built-in admin** at `/admin`
- **AI hardware engineer chat** powered through the Railway backend

Read [CLAUDE.md](./CLAUDE.md) before making agent-driven changes. It contains the
current Vercel/Railway deployment split, env vars, key files, and known pitfalls.

## Local Development

```bash
cd storefront
cp .env.template .env
npm install --legacy-peer-deps
npm run dev
```

Open:

```txt
http://localhost:8000/us
```

Admin:

```txt
http://localhost:8000/admin
```

Set `ADMIN_PASSWORD` in `storefront/.env` before using admin locally.

## Deployment

Use [DEPLOYMENT.md](./DEPLOYMENT.md).

Short version:

1. Deploy `backend/` to Railway.
2. Create/connect Railway PostgreSQL.
3. Deploy `storefront/` to Vercel.
4. Set Vercel env vars:

```txt
DATABASE_URL=<Railway Postgres URL>
ADMIN_PASSWORD=<strong password>
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_AI_BACKEND_URL=https://your-railway-backend.up.railway.app
AI_BACKEND_URL=https://your-railway-backend.up.railway.app
BITCOIN_WALLET_ADDRESS=<optional BTC wallet>
```

5. Set Railway backend env vars from [CLAUDE.md](./CLAUDE.md).
6. Redeploy Railway, then redeploy Vercel.
7. Log in at `/admin`.

## Current Admin Capabilities

Admin can:

- Manage orders
- Update order status
- Update product prices
- Update product titles and descriptions
- Change product image by hosted image URL
- Activate/deactivate existing products

Planned later:

- Add brand-new products from admin
- Direct photo upload from admin
- Full category management from admin

## SEO

The app includes:

- Product SEO metadata
- Category SEO metadata
- Blog/resource/solution pages
- JSON-LD structured data
- `/sitemap.xml`
- `/robots.txt`

## Bitcoin Checkout

Set:

```txt
BITCOIN_WALLET_ADDRESS=
BITCOIN_QR_CODE_URL=
```

The checkout can show manual Bitcoin payment instructions and admin can confirm
orders manually from `/admin/orders`.
