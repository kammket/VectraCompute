# VectraCompute Deployment

This repo has two separate apps:

- `backend/` -> Medusa v2 backend and Admin, deploy to Railway.
- `storefront/` -> Next.js storefront, deploy to Vercel.

Deploy in this order: Railway backend first, then Vercel storefront, then update backend CORS with the final Vercel URL.

## 1. Backend On Railway

Create a Railway project from this Git repo and set:

- Root directory: `backend`
- Build command: `npm ci && npm run build`
- Start command: `npm run start`

The included [backend/railway.json](backend/railway.json) sets these defaults when Railway reads it.

Add Railway services:

- Postgres
- Redis

Railway should inject:

- `DATABASE_URL`
- `REDIS_URL`

Set these backend variables manually:

```txt
NODE_ENV=production
PORT=9000
JWT_SECRET=<generate a long random value>
COOKIE_SECRET=<generate a long random value>
STORE_CORS=https://your-storefront.vercel.app
ADMIN_CORS=https://your-backend.up.railway.app
AUTH_CORS=https://your-backend.up.railway.app,https://your-storefront.vercel.app
```

Generate secrets locally with:

```bash
openssl rand -base64 32
```

After the first successful backend deploy, run these one-off Railway commands from the `backend` service:

```bash
npm run db:migrate
npm run admin:create -- -e owner@yourdomain.com -p 'ChangeThisStrongPassword!'
npm run seed
```

Open Admin:

```txt
https://your-backend.up.railway.app/app
```

Then create/copy a publishable API key for the storefront.

## 2. Storefront On Vercel

Create a Vercel project from this Git repo and set:

- Root directory: `storefront`
- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`

The included [storefront/vercel.json](storefront/vercel.json) sets the install/build defaults.

Set these Vercel environment variables:

```txt
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<publishable key token from Medusa Admin>
NEXT_PUBLIC_BASE_URL=https://your-storefront.vercel.app
NEXT_PUBLIC_DEFAULT_REGION=us
```

Optional, only if you later enable Stripe/Medusa Payments:

```txt
NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY=
NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID=
```

Deploy the storefront.

## 3. Update Backend CORS

After Vercel gives you the final storefront URL, update Railway backend env vars:

```txt
STORE_CORS=https://your-storefront.vercel.app,https://www.yourdomain.com
AUTH_CORS=https://your-backend.up.railway.app,https://your-storefront.vercel.app,https://www.yourdomain.com
ADMIN_CORS=https://your-backend.up.railway.app
```

Redeploy the backend after changing these.

## 4. Bitcoin Checkout Setup

Bitcoin checkout settings are stored in Postgres in production.

In Admin:

```txt
https://your-backend.up.railway.app/app/bitcoin-payments
```

Set:

- Bitcoin checkout enabled
- Stage 1: Manual wallet
- BTC wallet receiving address
- QR code image URL, optional but recommended
- Payment window
- Required confirmations
- Customer instructions

The BTC/USD conversion is automatic through the backend endpoint:

```txt
/store/bitcoin-exchange-rate
```

It uses CoinGecko first and Coinbase as fallback.

## 5. Product And Price Management

Admin pages:

```txt
/app/products
/app/categories
/app/orders
/app/price-manager
/app/hardware-ops
/app/bitcoin-payments
```

Use `Price Manager` when you want a simple table where the current price is already inside the input and can be replaced quickly.

## 6. Final Smoke Test

After both services are deployed:

1. Open the storefront.
2. Confirm products and categories load.
3. Add a product to cart.
4. Checkout with Bitcoin/manual payment.
5. Confirm the order page says `Awaiting Bitcoin payment`, not paid.
6. Open Railway Admin and confirm the order appears.
7. Update a product price in `Price Manager` and confirm the storefront price changes.

## Common Issues

If products do not show:

- Check `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
- Make sure products are published.
- Make sure products are assigned to the sales channel linked to the publishable key.

If Admin login says unauthorized:

- Confirm you created the admin user on the Railway database, not only locally.
- Clear browser site data for the Railway backend domain.
- Use the backend Admin URL, not the Vercel storefront URL.

If checkout cannot reach backend:

- Check `NEXT_PUBLIC_MEDUSA_BACKEND_URL` in Vercel.
- Check `STORE_CORS` and `AUTH_CORS` in Railway.

If Bitcoin amount does not show:

- Make sure Railway backend can make outbound HTTPS requests.
- Make sure the backend is deployed with the `/store/bitcoin-exchange-rate` route.
