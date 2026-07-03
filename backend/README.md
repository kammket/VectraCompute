# VectraCompute Backend

[Medusa v2](https://medusajs.com) commerce engine for VectraCompute — products,
carts, orders, and the Admin dashboard (`/app`). See the root [README](../README.md)
for full local setup and Railway deploy instructions.

Quick reference:

```bash
cp .env.template .env   # set DATABASE_URL at minimum
npm install
npx medusa db:migrate
npx medusa user -e admin@vectracompute.com -p <your-password>
npm run seed
npm run dev
```

Railway:

- Root directory: `backend`
- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Add Postgres and Redis services
- Run after first deploy:

```bash
npm run db:migrate
npm run admin:create -- -e owner@yourdomain.com -p 'ChangeThisStrongPassword!'
npm run seed
```

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for the full checklist.
