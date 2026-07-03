# VectraCompute

Premium ecommerce website for AI workstations, refurbished GPU servers, and AI
hardware infrastructure.

The current production architecture is intentionally simple:

- **Next.js storefront and admin** in `storefront/`
- **Vercel** for frontend/app deployment
- **Railway PostgreSQL** for backend data storage
- **Built-in admin** at `/admin`

The old Medusa backend remains in `backend/` as a reference, but it is not required
for the current production deployment.

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

1. Create Railway PostgreSQL.
2. Copy Railway `DATABASE_URL`.
3. Deploy `storefront/` to Vercel.
4. Set Vercel env vars:

```txt
DATABASE_URL=<Railway Postgres URL>
ADMIN_PASSWORD=<strong password>
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_DEFAULT_REGION=us
BITCOIN_WALLET_ADDRESS=<optional BTC wallet>
```

5. Redeploy Vercel.
6. Log in at `/admin`.

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
