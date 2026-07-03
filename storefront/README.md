# VectraCompute Storefront

Next.js (App Router) storefront for VectraCompute, built on Medusa v2's Store API.
See the root [README](../README.md) for full local setup and Vercel deploy
instructions.

Quick reference:

```bash
cp .env.template .env   # set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY and backend URL
npm install
npm run dev              # http://localhost:8000
```

Vercel:

- Root directory: `storefront`
- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Required env vars:

```txt
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<publishable key token>
NEXT_PUBLIC_BASE_URL=https://your-storefront.vercel.app
NEXT_PUBLIC_DEFAULT_REGION=us
```

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for the full checklist.
