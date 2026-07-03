# VectraCompute Production Deployment

VectraCompute is now prepared as a lightweight production commerce app:

- **Frontend / app runtime:** Next.js on Vercel
- **Backend data layer:** PostgreSQL on Railway
- **Admin:** Built into the Vercel app at `/admin`
- **Orders:** Stored in Railway PostgreSQL
- **Product management:** Built-in catalog plus admin-managed price/content/image overrides
- **Bitcoin checkout:** Manual wallet mode through environment variables

You do not need Medusa for the current production deployment.

## 1. Railway

Create a Railway project for the backend database.

Add:

- PostgreSQL

Copy the Railway PostgreSQL connection string:

```txt
DATABASE_URL=postgresql://...
```

Keep this value for Vercel. You do not need to deploy the old `backend/` service unless you decide to return to Medusa later.

## 2. Vercel

Import the GitHub repository:

```txt
kammket/VectraCompute
```

Recommended Vercel settings:

```txt
Framework Preset: Next.js
Root Directory: storefront
Install Command: npm install --legacy-peer-deps
Build Command: npm run build
Output Directory: .next
```

Alternative root import also works:

```txt
Root Directory: leave empty
Install Command: npm install --legacy-peer-deps
Build Command: npm run build
Output Directory: storefront/.next
```

## 3. Vercel Environment Variables

Add these in Vercel Project Settings -> Environment Variables:

```txt
DATABASE_URL=<Railway Postgres DATABASE_URL>
ADMIN_PASSWORD=<strong admin password>
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_DEFAULT_REGION=us
```

Optional Bitcoin settings:

```txt
BITCOIN_WALLET_ADDRESS=<your BTC receiving address>
BITCOIN_QR_CODE_URL=<optional hosted QR code image URL>
BITCOIN_REQUIRED_CONFIRMATIONS=2
BITCOIN_PAYMENT_EXPIRY=30
BITCOIN_PAYMENT_INSTRUCTIONS=Send the exact BTC amount and include your order number when contacting support.
```

Optional product image hosting:

```txt
MEDUSA_CLOUD_S3_HOSTNAME=
MEDUSA_CLOUD_S3_PATHNAME=
```

Those S3 variables are only needed if you use remote S3-style product images.

## 4. Deploy

Redeploy the Vercel project after adding env vars.

Open:

```txt
https://your-vercel-domain.vercel.app/us
```

Admin:

```txt
https://your-vercel-domain.vercel.app/admin
```

Use the `ADMIN_PASSWORD` value to log in.

## 5. Admin Management

Admin can currently:

- View and manage orders at `/admin/orders`
- Update order status
- Update existing product title
- Update existing product description
- Update existing product price
- Change product image by hosted image URL
- Activate/deactivate products

Coming later:

- Create brand-new products from admin
- Upload image files directly from admin
- Manage categories from admin

## 6. Production Smoke Test

After deployment:

1. Open `/us`.
2. Open `/us/store`.
3. Open any product page.
4. Add product to cart.
5. Open `/us/cart`.
6. Continue to checkout.
7. Place an order.
8. Log in to `/admin`.
9. Confirm the order appears in `/admin/orders`.
10. Update a product price in `/admin/products`.
11. Confirm the public product page shows the updated price.

## Common Issues

If admin login fails:

- Confirm `ADMIN_PASSWORD` is set in Vercel.
- Redeploy after setting the env var.

If orders do not save:

- Confirm `DATABASE_URL` is set in Vercel.
- Confirm the Railway PostgreSQL database is running.
- Redeploy Vercel after setting `DATABASE_URL`.

If Bitcoin details do not show:

- Set `BITCOIN_WALLET_ADDRESS`.
- Redeploy Vercel.

If product images do not show:

- Use a public HTTPS image URL in `/admin/products`.
- Make sure the image host allows public browser access.
