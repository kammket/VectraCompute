# VectraCompute

VectraCompute is an ecommerce platform for AI workstations, GPU rack servers, and
related components. It's two independent apps in one repo:

- **`backend/`** — [Medusa v2](https://medusajs.com) commerce engine (products, carts,
  orders, the Admin dashboard). Deploys to **Railway**.
- **`storefront/`** — Next.js (App Router) storefront. Deploys to **Vercel**.

Orders can be taken with the built-in **Bitcoin/manual payment flow**. Customers
complete checkout, see an awaiting-Bitcoin payment page, and the order appears in
Medusa Admin for payment verification and fulfillment management. Stripe or another
gateway can still be added later as a config change in `backend/medusa-config.ts`.

For the simplest production deployment checklist, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Local development

### 1. Database

You need a reachable Postgres instance. Redis is optional locally (Medusa falls back
to an in-memory event bus/workflow engine when `REDIS_URL` is unset) but required in
production.

Either use a Postgres already installed on your machine:

```bash
createdb vectracompute
```

Or use the provided `docker-compose.yml` for a disposable Postgres + Redis:

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.template .env
# edit .env: set DATABASE_URL to your local Postgres (and REDIS_URL if using docker-compose)
npm install
npx medusa db:migrate
npx medusa user -e admin@vectracompute.com -p <your-password>
npm run seed       # seeds the VectraCompute catalog — categories, products, shipping
npm run dev        # medusa develop, http://localhost:9000, Admin at /app
```

### 3. Storefront

```bash
cd storefront
cp .env.template .env
# edit .env: set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY to the key the seed script printed
# (or fetch it from Admin → Settings → Publishable API Keys)
npm install
npm run dev         # http://localhost:8000
```

Note the publishable key's actual value is the `token` field on the API key record —
the seed script logs it at the end of its run.

## Deploying

Use [DEPLOYMENT.md](./DEPLOYMENT.md) for the production checklist.

Short version:

1. Deploy `backend/` to Railway with Postgres and Redis.
2. Run backend migrations, create an admin user, and seed the catalog.
3. Copy the Medusa publishable API key.
4. Deploy `storefront/` to Vercel with the Railway backend URL and publishable key.
5. Update Railway `STORE_CORS` and `AUTH_CORS` with the final Vercel URL.

## What's seeded

The seed script (`backend/src/scripts/seed.ts`) creates an original product catalog —
not copied from any other site — across four categories: AI & Deep Learning
Workstations, GPU Rack Servers, Workstations by CPU Platform, and Components &
Accessories (18 products total, USD pricing, a US shipping region with Standard
Freight / White-Glove Express options). Products ship with **no images** —
`Thumbnail`/`PlaceholderImage` in the storefront render a clean placeholder until you
add real product photography via the Admin dashboard.

## Managing products in the Admin dashboard

The Medusa Admin (`/app` on the backend) is where you add and manage products,
categories, inventory, and orders — no code required.

**To add a product:** Products → Create. Set a title, handle, status = **Published**,
add variants with prices, upload product images, and assign one or more **Categories**.

**To add a category:** Categories → Create. New categories appear automatically on the
storefront — in the footer, in the home "Shop by category" grid (with a generic branded
placeholder image), and as their own `/categories/<handle>` page with FAQ + SEO metadata.

For the full workflow for product photos, category organization, product SEO metadata,
and trust content, see [ADMIN_PRODUCT_GUIDE.md](./ADMIN_PRODUCT_GUIDE.md).
For order visibility, admin review, fulfillment, and buyer handoff, see
[ADMIN_ORDER_GUIDE.md](./ADMIN_ORDER_GUIDE.md).

**Two things to know (both are Medusa defaults, not bugs):**

1. **Sales channel.** The storefront only shows products in the sales channel tied to its
   publishable API key. When creating a product, make sure it's assigned to the same sales
   channel the storefront uses (the one the seed created and linked the publishable key to).
   If a product is published but not showing on the storefront, this is almost always why.
2. **Images.** If you don't upload an image, the storefront shows a generated branded
   placeholder so nothing looks broken. Upload real photos in Admin and they take
   precedence automatically. (To regenerate the built-in brand visuals after editing the
   seed catalog, run `node scripts/generate-product-images.mjs` in `storefront/`.)

## SEO

The storefront generates `/sitemap.xml` and `/robots.txt` from live category/product
data (`src/app/sitemap.ts`, `src/app/robots.ts`), and includes JSON-LD structured data
(`Product`, `BlogPosting`, `Organization`, `CollectionPage`) plus per-page metadata
across product, category, blog, and solutions pages.

## Still a TODO before a real launch

- Real product photography where you want product-specific photos instead of generated visuals
- BTCPay/Stripe automation if you want automatic payment detection/capture instead of admin-reviewed Bitcoin/manual confirmation
- Outbound email (order confirmations currently use Medusa's local/log notification
  provider — fine for dev, not for customers)
- Real legal pages (terms, privacy, returns policy)
