import { createServer, type IncomingMessage, type ServerResponse } from "node:http"
import { URL } from "node:url"
import { randomUUID } from "node:crypto"
import { Pool } from "pg"

import { PRODUCT_CATALOG, type BackendCatalogProduct } from "./catalog.js"

type ChatRole = "user" | "assistant" | "system"

type ChatMessage = {
  role: ChatRole
  content: string
}

type AiOrderRequest = {
  productHandle: string
  variantSku?: string
  customerName: string
  email: string
  phone: string
  company?: string
  address1: string
  address2?: string
  city: string
  province?: string
  postalCode?: string
  countryCode?: string
  notes?: string
}

type CommerceOrderRequest = {
  id?: string
  email: string
  customerName: string
  phone: string
  company?: string | null
  address: Record<string, string>
  paymentMethod?: string
  bitcoinTxid?: string | null
  notes?: string | null
  status?: string
  currencyCode?: string
  subtotal?: number
  total: number
  items: unknown[]
}

const PORT = Number(process.env.PORT || 9000)
const XAI_API_URL = "https://api.x.ai/v1/chat/completions"
const DEFAULT_MODEL = "grok-3-mini"

let pool: Pool | null = null

const getAllowedOrigins = () =>
  (process.env.STORE_CORS || "http://localhost:8000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

const getPool = () => {
  if (!process.env.DATABASE_URL) {
    return null
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost")
        ? undefined
        : { rejectUnauthorized: false },
    })
  }

  return pool
}

const setCors = (req: IncomingMessage, res: ServerResponse) => {
  const origin = req.headers.origin
  const allowedOrigins = getAllowedOrigins()
  const allowOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || "*"

  res.setHeader("Access-Control-Allow-Origin", allowOrigin)
  res.setHeader("Vary", "Origin")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
}

const sendJson = (
  req: IncomingMessage,
  res: ServerResponse,
  status: number,
  payload: unknown
) => {
  setCors(req, res)
  res.statusCode = status
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.end(JSON.stringify(payload))
}

const readJson = async <T>(req: IncomingMessage): Promise<T> =>
  new Promise((resolve, reject) => {
    let body = ""

    req.on("data", (chunk) => {
      body += chunk
      if (body.length > 1_000_000) {
        req.destroy()
        reject(new Error("Request body is too large."))
      }
    })

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : ({} as T))
      } catch {
        reject(new Error("Invalid JSON body."))
      }
    })

    req.on("error", reject)
  })

const ensureCommerceTables = async () => {
  const db = getPool()

  if (!db) {
    throw new Error("DATABASE_URL is required.")
  }

  await db.query(`
    create table if not exists vectra_orders (
      id text primary key,
      display_id serial unique,
      email text not null,
      customer_name text not null,
      phone text not null,
      company text,
      address jsonb not null,
      payment_method text not null,
      bitcoin_txid text,
      notes text,
      status text not null default 'awaiting_payment',
      currency_code text not null default 'usd',
      subtotal numeric not null default 0,
      total numeric not null default 0,
      items jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `)
}

const createStoredOrder = async (order: CommerceOrderRequest) => {
  await ensureCommerceTables()

  const db = getPool()
  if (!db) {
    throw new Error("DATABASE_URL is required.")
  }

  const id =
    order.id || `ord_${randomUUID().replace(/-/g, "").slice(0, 18)}`

  await db.query(
    `
      insert into vectra_orders (
        id, email, customer_name, phone, company, address, payment_method,
        bitcoin_txid, notes, status, currency_code, subtotal, total, items
      )
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    `,
    [
      id,
      order.email.trim(),
      order.customerName.trim(),
      order.phone.trim(),
      order.company?.trim() || null,
      order.address,
      order.paymentMethod || "bitcoin",
      order.bitcoinTxid?.trim() || null,
      order.notes?.trim() || null,
      order.status || "awaiting_payment",
      order.currencyCode || "usd",
      Number(order.subtotal || order.total || 0),
      Number(order.total || 0),
      order.items,
    ]
  )

  const result = await db.query(
    "select * from vectra_orders where id = $1 limit 1",
    [id]
  )

  return result.rows[0]
}

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ")

const productText = (product: BackendCatalogProduct) =>
  normalize(
    [
      product.title,
      product.handle,
      product.category,
      product.description,
      product.bestFor,
      product.condition,
      product.specs.join(" "),
      product.variants.map((variant) => `${variant.title} ${variant.sku}`).join(" "),
    ].join(" ")
  )

const scoreProduct = (product: BackendCatalogProduct, query: string) => {
  const terms = normalize(query)
    .split(" ")
    .map((term) => term.trim())
    .filter((term) => term.length > 1)

  if (!terms.length) {
    return product.category.includes("Workstation") ? 2 : 1
  }

  const text = productText(product)
  return terms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0)
}

const findProducts = (query: string, limit = 6) =>
  PRODUCT_CATALOG.map((product) => ({ product, score: scoreProduct(product, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.title.localeCompare(b.product.title))
    .slice(0, limit)
    .map((item) => item.product)

const summarizeProduct = (product: BackendCatalogProduct) => ({
  handle: product.handle,
  title: product.title,
  category: product.category,
  bestFor: product.bestFor,
  condition: product.condition,
  warranty: product.warranty,
  leadTime: product.leadTime,
  url: `/us/products/${product.handle}`,
  variants: product.variants.map((variant) => ({
    title: variant.title,
    sku: variant.sku,
    priceUsd: variant.priceUsd,
    formattedPrice: money(variant.priceUsd),
  })),
})

const getPaymentSettings = () => ({
  enabled: Boolean(process.env.BITCOIN_WALLET_ADDRESS),
  walletAddress: process.env.BITCOIN_WALLET_ADDRESS || "",
  qrCodeImageUrl: process.env.BITCOIN_QR_CODE_URL || "",
  instructions:
    process.env.BITCOIN_PAYMENT_INSTRUCTIONS ||
    "Send the exact BTC amount and keep your transaction ID. Our team will confirm the payment before dispatch.",
  requiredConfirmations: Number(process.env.BITCOIN_REQUIRED_CONFIRMATIONS || 2),
  paymentExpiryMinutes: Number(process.env.BITCOIN_PAYMENT_EXPIRY || 30),
})

const getBtcEstimate = async (usdTotal: number) => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { headers: { accept: "application/json" } }
    )

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as { bitcoin?: { usd?: number } }
    const rate = payload.bitcoin?.usd

    if (!rate || rate <= 0) {
      return null
    }

    return {
      rateUsd: rate,
      btcAmount: Number((usdTotal / rate).toFixed(8)),
    }
  } catch {
    return null
  }
}

const wantsCheckout = (text: string) =>
  /\b(buy|purchase|checkout|order|pay|invoice|deliver|delivery|ship)\b/i.test(text)

const fallbackAnswer = (message: string, products: BackendCatalogProduct[]) => {
  const lead = wantsCheckout(message)
    ? "I can help you place this order step by step. Choose the product/configuration below, then share name, email, phone, and delivery address so I can save the order and show Bitcoin payment details."
    : "I can help you choose the right AI hardware. Based on your question, these are the strongest fits from the VectraCompute catalog:"

  const recommendations = products
    .slice(0, 3)
    .map((product, index) => {
      const entry = product.variants[0]
      return `${index + 1}. ${product.title} - best for ${product.bestFor || product.category}. Starts at ${money(entry.priceUsd)}.`
    })
    .join("\n")

  return `${lead}\n\n${recommendations}\n\nTell me your workload, model size, number of users, preferred budget, and delivery country, and I will narrow this down.`
}

const callGrok = async (messages: ChatMessage[], products: BackendCatalogProduct[]) => {
  const apiKey = process.env.XAI_API_KEY

  if (!apiKey) {
    return fallbackAnswer(messages.at(-1)?.content || "", products)
  }

  const productContext = products
    .map((product) => {
      const variants = product.variants
        .map((variant) => `${variant.title} (${variant.sku}) ${money(variant.priceUsd)}`)
        .join("; ")
      return `${product.title}: ${product.category}. Best for: ${product.bestFor}. ${product.condition}. ${product.warranty}. Variants: ${variants}. URL: /us/products/${product.handle}`
    })
    .join("\n")

  const systemPrompt = `
You are VectraCompute's senior AI hardware sales engineer.
Answer engineering questions clearly and commercially, recommend only products from the provided catalog context, and never invent availability, discounts, payment addresses, or hidden policies.
Ask practical qualification questions: workload, model size, VRAM need, number of users, data size, deployment location, power/cooling, budget, and timeline.
If the user wants to buy, explain that you can collect delivery details in chat, save the order, then show Bitcoin payment details. Payment is manually confirmed by the VectraCompute team before dispatch.
Keep responses concise, confident, and trustworthy.

Relevant catalog:
${productContext}
`.trim()

  const response = await fetch(XAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL || DEFAULT_MODEL,
      temperature: 0.35,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-8).map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error("xAI request failed", response.status, detail.slice(0, 500))
    return fallbackAnswer(messages.at(-1)?.content || "", products)
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  return (
    payload.choices?.[0]?.message?.content ||
    fallbackAnswer(messages.at(-1)?.content || "", products)
  )
}

const handleAiChat = async (req: IncomingMessage, res: ServerResponse) => {
  const body = await readJson<{ messages?: ChatMessage[] }>(req)
  const messages = Array.isArray(body.messages) ? body.messages : []
  const latestMessage = messages.at(-1)?.content || ""
  const matchedProducts = findProducts(latestMessage || "AI workstation GPU server", 6)
  const assistant = await callGrok(messages, matchedProducts)

  sendJson(req, res, 200, {
    assistant,
    suggestedProducts: matchedProducts.slice(0, 4).map(summarizeProduct),
    checkout: wantsCheckout(latestMessage)
      ? {
          enabled: true,
          stage: "collect_details",
          requiredFields: [
            "product",
            "configuration",
            "customerName",
            "email",
            "phone",
            "deliveryAddress",
          ],
        }
      : { enabled: false },
  })
}

const validateOrder = (order: AiOrderRequest) => {
  const required: [keyof AiOrderRequest, string][] = [
    ["productHandle", "Choose a product."],
    ["customerName", "Enter your full name."],
    ["email", "Enter your email."],
    ["phone", "Enter your phone number."],
    ["address1", "Enter the delivery address."],
    ["city", "Enter the delivery city."],
  ]

  for (const [field, message] of required) {
    if (!String(order[field] || "").trim()) {
      return message
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) {
    return "Enter a valid email address."
  }

  return null
}

const validateCommerceOrder = (order: CommerceOrderRequest) => {
  if (!order.email?.trim()) return "Enter your email."
  if (!order.customerName?.trim()) return "Enter your full name."
  if (!order.phone?.trim()) return "Enter your phone number."
  if (!order.address?.address_1?.trim()) return "Enter the delivery address."
  if (!order.address?.city?.trim()) return "Enter the delivery city."
  if (!Array.isArray(order.items) || !order.items.length) {
    return "Order must include at least one item."
  }
  if (!Number.isFinite(Number(order.total)) || Number(order.total) <= 0) {
    return "Order total is invalid."
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) {
    return "Enter a valid email address."
  }

  return null
}

const handleAiOrder = async (req: IncomingMessage, res: ServerResponse) => {
  const body = await readJson<AiOrderRequest>(req)
  const validationError = validateOrder(body)

  if (validationError) {
    sendJson(req, res, 400, { error: validationError })
    return
  }

  const product = PRODUCT_CATALOG.find((item) => item.handle === body.productHandle)

  if (!product) {
    sendJson(req, res, 404, { error: "Selected product was not found." })
    return
  }

  const variant =
    product.variants.find((item) => item.sku === body.variantSku) ||
    product.variants[0]
  const orderId = `ord_ai_${randomUUID().replace(/-/g, "").slice(0, 18)}`
  const total = variant.priceUsd
  const address = {
    address_1: body.address1.trim(),
    address_2: body.address2?.trim() || "",
    city: body.city.trim(),
    province: body.province?.trim() || "",
    postal_code: body.postalCode?.trim() || "",
    country_code: body.countryCode?.trim().toLowerCase() || "us",
  }
  const item = {
    id: `item_${orderId}`,
    title: product.title,
    subtitle: variant.title,
    quantity: 1,
    unit_price: total,
    total,
    variant_id: variant.sku,
    variant_sku: variant.sku,
    product_handle: product.handle,
    thumbnail: "",
    metadata: {
      source: "ai_chat",
      category: product.category,
      best_for: product.bestFor,
    },
  }

  try {
    await createStoredOrder({
      id: orderId,
      email: body.email,
      customerName: body.customerName,
      phone: body.phone,
      company: body.company || null,
      address,
      paymentMethod: "bitcoin",
      bitcoinTxid: null,
      notes: [
        "Created by VectraCompute AI sales engineer.",
        body.notes?.trim() ? `Customer notes: ${body.notes.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      status: "awaiting_payment",
      currencyCode: "usd",
      subtotal: total,
      total,
      items: [item],
    })
  } catch (error) {
    console.error("AI order creation failed", error)
    sendJson(req, res, 500, {
      error:
        "Order storage is not connected. Add DATABASE_URL to the Railway backend and retry.",
    })
    return
  }

  const btcEstimate = await getBtcEstimate(total)
  const payment = getPaymentSettings()

  sendJson(req, res, 201, {
    order: {
      id: orderId,
      status: "awaiting_payment",
      product: summarizeProduct(product),
      selectedVariant: {
        title: variant.title,
        sku: variant.sku,
        priceUsd: total,
        formattedPrice: money(total),
      },
      customer: {
        name: body.customerName.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
      },
      address,
      totalUsd: total,
      formattedTotal: money(total),
      createdBy: "ai_chat",
    },
    payment: {
      ...payment,
      btcEstimate,
      message:
        "Your order has been saved. Send the Bitcoin payment to the wallet shown. Our team will contact you after payment is confirmed.",
    },
  })
}

const handleCreateCommerceOrder = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const body = await readJson<CommerceOrderRequest>(req)
  const validationError = validateCommerceOrder(body)

  if (validationError) {
    sendJson(req, res, 400, { error: validationError })
    return
  }

  try {
    const order = await createStoredOrder(body)
    sendJson(req, res, 201, { order })
  } catch (error) {
    console.error("Commerce order creation failed", error)
    sendJson(req, res, 500, {
      error:
        "Order storage is not connected. Add DATABASE_URL to the Railway backend and retry.",
    })
  }
}

const handleListCommerceOrders = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    await ensureCommerceTables()
    const db = getPool()
    if (!db) throw new Error("DATABASE_URL is required.")

    const result = await db.query(
      "select * from vectra_orders order by created_at desc limit 100"
    )
    sendJson(req, res, 200, { orders: result.rows })
  } catch (error) {
    console.error("Commerce order list failed", error)
    sendJson(req, res, 500, { error: "Unable to list orders." })
  }
}

const handleRetrieveCommerceOrder = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
    await ensureCommerceTables()
    const db = getPool()
    if (!db) throw new Error("DATABASE_URL is required.")

    const result = await db.query(
      "select * from vectra_orders where id = $1 limit 1",
      [id]
    )

    if (!result.rows[0]) {
      sendJson(req, res, 404, { error: "Order not found." })
      return
    }

    sendJson(req, res, 200, { order: result.rows[0] })
  } catch (error) {
    console.error("Commerce order retrieval failed", error)
    sendJson(req, res, 500, { error: "Unable to retrieve order." })
  }
}

const handleUpdateCommerceOrderStatus = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const body = await readJson<{ id?: string; status?: string }>(req)

  if (!body.id || !body.status) {
    sendJson(req, res, 400, { error: "Order ID and status are required." })
    return
  }

  try {
    await ensureCommerceTables()
    const db = getPool()
    if (!db) throw new Error("DATABASE_URL is required.")

    const result = await db.query(
      "update vectra_orders set status = $1, updated_at = now() where id = $2 returning *",
      [body.status, body.id]
    )

    if (!result.rows[0]) {
      sendJson(req, res, 404, { error: "Order not found." })
      return
    }

    sendJson(req, res, 200, { order: result.rows[0] })
  } catch (error) {
    console.error("Commerce order status update failed", error)
    sendJson(req, res, 500, { error: "Unable to update order." })
  }
}

const handleProducts = (req: IncomingMessage, res: ServerResponse, url: URL) => {
  const query = url.searchParams.get("query") || ""
  const limit = Number(url.searchParams.get("limit") || 12)
  const products = findProducts(query || "AI GPU workstation server", limit)

  sendJson(req, res, 200, {
    products: products.map(summarizeProduct),
    count: products.length,
  })
}

const server = createServer(async (req, res) => {
  setCors(req, res)

  if (req.method === "OPTIONS") {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`)

  try {
    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(req, res, 200, {
        ok: true,
        service: "vectracompute-backend",
        database: Boolean(process.env.DATABASE_URL),
        ai: Boolean(process.env.XAI_API_KEY),
        bitcoin: Boolean(process.env.BITCOIN_WALLET_ADDRESS),
      })
      return
    }

    if (req.method === "GET" && url.pathname === "/api/products") {
      handleProducts(req, res, url)
      return
    }

    if (req.method === "GET" && url.pathname === "/api/payment-settings") {
      sendJson(req, res, 200, getPaymentSettings())
      return
    }

    if (req.method === "GET" && url.pathname === "/api/orders") {
      await handleListCommerceOrders(req, res)
      return
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/orders/")) {
      await handleRetrieveCommerceOrder(
        req,
        res,
        decodeURIComponent(url.pathname.replace("/api/orders/", ""))
      )
      return
    }

    if (req.method === "POST" && url.pathname === "/api/orders") {
      await handleCreateCommerceOrder(req, res)
      return
    }

    if (req.method === "POST" && url.pathname === "/api/orders/status") {
      await handleUpdateCommerceOrderStatus(req, res)
      return
    }

    if (req.method === "POST" && url.pathname === "/api/ai/chat") {
      await handleAiChat(req, res)
      return
    }

    if (req.method === "POST" && url.pathname === "/api/ai/order") {
      await handleAiOrder(req, res)
      return
    }

    sendJson(req, res, 404, { error: "Route not found." })
  } catch (error) {
    console.error("Unhandled backend error", error)
    sendJson(req, res, 500, { error: "Unexpected backend error." })
  }
})

server.listen(PORT, () => {
  console.log(`VectraCompute backend listening on port ${PORT}`)
})
