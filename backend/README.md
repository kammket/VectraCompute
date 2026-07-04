# VectraCompute Backend

Small Railway-ready backend for VectraCompute AI commerce.

It provides:

- Grok/xAI powered AI sales engineer chat.
- Product-aware recommendations from the VectraCompute catalog.
- AI-assisted order creation.
- Postgres order storage in `vectra_orders`.
- Manual Bitcoin payment details after an AI order is saved.
- Health, product search, and payment settings endpoints.

## Railway Setup

Use `backend` as the Railway root directory.

Build command:

```bash
npm ci && npm run build
```

Start command:

```bash
npm run start
```

Required Railway variables:

```bash
DATABASE_URL=postgresql://...
STORE_CORS=https://your-vercel-storefront.vercel.app,https://www.yourdomain.com
XAI_API_KEY=your_xai_or_grok_api_key
XAI_MODEL=grok-3-mini
BITCOIN_WALLET_ADDRESS=your_btc_wallet_address
BITCOIN_QR_CODE_URL=https://...
BITCOIN_PAYMENT_INSTRUCTIONS=Send the exact BTC amount and keep your transaction ID. Our team will confirm the payment before dispatch.
BITCOIN_REQUIRED_CONFIRMATIONS=2
BITCOIN_PAYMENT_EXPIRY=30
```

## Vercel Setup

Add this to the storefront project on Vercel:

```bash
NEXT_PUBLIC_AI_BACKEND_URL=https://your-railway-backend.up.railway.app
```

Keep `XAI_API_KEY` only on Railway. Do not add it to Vercel public variables.

## Endpoints

- `GET /health`
- `GET /api/products?query=local%20llm&limit=6`
- `GET /api/payment-settings`
- `POST /api/ai/chat`
- `POST /api/ai/order`

The order endpoint creates rows in the same `vectra_orders` table used by the
storefront admin order area, so AI-created orders can be reviewed by admin.
