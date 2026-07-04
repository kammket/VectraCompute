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

type GrokToolCall = {
  id: string
  type: "function"
  function: { name: string; arguments: string }
}

type GrokMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: GrokToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string }

type AgentSideEffects = {
  suggestedProducts: BackendCatalogProduct[]
  createdOrder: Record<string, unknown> | null
  capturedLead: boolean
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
      // node-postgres serializes JS arrays as Postgres array literals, which
      // are invalid jsonb — stringify explicitly or every insert fails.
      JSON.stringify(order.items ?? []),
    ]
  )

  const result = await db.query(
    "select * from vectra_orders where id = $1 limit 1",
    [id]
  )

  return result.rows[0]
}

const ensureLeadsTable = async () => {
  const db = getPool()
  if (!db) {
    throw new Error("DATABASE_URL is required.")
  }

  await db.query(`
    create table if not exists vectra_leads (
      id text primary key,
      name text,
      email text not null,
      topic text,
      message text not null,
      created_at timestamptz not null default now()
    )
  `)
}

const storeLead = async (lead: {
  name?: string
  email: string
  topic?: string
  message: string
}) => {
  await ensureLeadsTable()
  const db = getPool()
  if (!db) {
    throw new Error("DATABASE_URL is required.")
  }

  const id = `lead_${randomUUID().replace(/-/g, "").slice(0, 18)}`
  await db.query(
    "insert into vectra_leads (id, name, email, topic, message) values ($1,$2,$3,$4,$5)",
    [id, lead.name?.trim() || null, lead.email.trim(), lead.topic?.trim() || null, lead.message.trim()]
  )
  return id
}

const findOrderStatus = async (displayId: number, email: string) => {
  await ensureCommerceTables()
  const db = getPool()
  if (!db) {
    throw new Error("DATABASE_URL is required.")
  }

  const result = await db.query(
    "select display_id, status, total, currency_code, created_at, updated_at from vectra_orders where display_id = $1 and lower(email) = $2 limit 1",
    [displayId, email.trim().toLowerCase()]
  )
  return result.rows[0] ?? null
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

const AGENT_TOOLS = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Search the live VectraCompute catalog. Use for any product recommendation so prices and availability are real, never from memory.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Search terms: GPU model, workload, category, budget hints, e.g. 'RTX 5090 local LLM' or 'H200 rack server'",
          },
          max_price_usd: {
            type: "number",
            description: "Optional budget ceiling in USD; filters out configurations above it",
          },
          limit: { type: "number", description: "Max results, default 5" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product_details",
      description:
        "Fetch full details for one product by handle: description, specs, every configuration with SKU and exact price, warranty, lead time.",
      parameters: {
        type: "object",
        properties: {
          handle: { type: "string", description: "Product handle, e.g. 'vectraforge-x1'" },
        },
        required: ["handle"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_status",
      description:
        "Look up the status of an existing order. Requires the order number AND the checkout email; both must match.",
      parameters: {
        type: "object",
        properties: {
          display_id: { type: "number", description: "Order number, e.g. 12" },
          email: { type: "string", description: "Email used at checkout" },
        },
        required: ["display_id", "email"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_payment_instructions",
      description:
        "Get the current Bitcoin payment instructions: wallet address, required confirmations, expiry window, and a live BTC estimate for a USD total.",
      parameters: {
        type: "object",
        properties: {
          total_usd: { type: "number", description: "Order total in USD for the BTC estimate" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_order",
      description:
        "Place an order for one product configuration. ONLY call after you have shown the customer a full summary (product, configuration, exact price, delivery address) and they explicitly confirmed with words like 'yes, place the order'. Set confirmed=true only in that case.",
      parameters: {
        type: "object",
        properties: {
          product_handle: { type: "string" },
          variant_sku: { type: "string", description: "SKU of the chosen configuration" },
          customer_name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          company: { type: "string" },
          address1: { type: "string" },
          address2: { type: "string" },
          city: { type: "string" },
          province: { type: "string" },
          postal_code: { type: "string" },
          country_code: { type: "string", description: "2-letter country code, default us" },
          notes: { type: "string" },
          confirmed: {
            type: "boolean",
            description:
              "true ONLY if the customer explicitly confirmed the exact summary you showed them",
          },
        },
        required: [
          "product_handle",
          "customer_name",
          "email",
          "phone",
          "address1",
          "city",
          "confirmed",
        ],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "capture_lead",
      description:
        "Save a follow-up request for the human team when the customer needs something you cannot do (custom quote, financing, bulk order, unsupported question). Always collect an email first.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          topic: { type: "string", description: "Short topic, e.g. 'bulk quote 4x H200 server'" },
          message: { type: "string", description: "What the customer needs, in their words" },
        },
        required: ["email", "message"],
      },
    },
  },
] as const

const transcriptFromMessages = (messages: ChatMessage[], limit = 4000) => {
  const text = messages
    .slice(-12)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n")
  return text.length > limit ? `${text.slice(0, limit)}…` : text
}

const executeTool = async (
  name: string,
  rawArgs: string,
  conversation: ChatMessage[],
  effects: AgentSideEffects
): Promise<Record<string, unknown>> => {
  let args: Record<string, unknown> = {}
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {}
  } catch {
    return { error: "Tool arguments were not valid JSON." }
  }

  switch (name) {
    case "search_products": {
      const query = String(args.query ?? "")
      const maxPrice = Number(args.max_price_usd) || null
      const limit = Math.min(Number(args.limit) || 5, 8)
      let products = findProducts(query, limit * 2)
      if (maxPrice) {
        products = products.filter((product) =>
          product.variants.some((variant) => variant.priceUsd <= maxPrice)
        )
      }
      products = products.slice(0, limit)
      effects.suggestedProducts = products
      return { results: products.map(summarizeProduct), count: products.length }
    }

    case "get_product_details": {
      const product = PRODUCT_CATALOG.find((item) => item.handle === args.handle)
      if (!product) {
        return { error: `No product with handle '${String(args.handle)}'.` }
      }
      return {
        ...summarizeProduct(product),
        description: product.description,
        specs: product.specs,
      }
    }

    case "get_order_status": {
      const displayId = Number(args.display_id)
      const email = String(args.email ?? "")
      if (!Number.isFinite(displayId) || !email) {
        return { error: "Both display_id and email are required." }
      }
      try {
        const row = await findOrderStatus(displayId, email)
        if (!row) {
          return {
            found: false,
            note: "No order matches that number and email. Ask the customer to double-check both.",
          }
        }
        return {
          found: true,
          order_number: row.display_id,
          status: row.status,
          total: money(Number(row.total)),
          placed_at: row.created_at,
          last_update: row.updated_at,
          tracking_page: "/us/order/status",
        }
      } catch {
        return { error: "Order storage is unavailable right now." }
      }
    }

    case "get_payment_instructions": {
      const settings = getPaymentSettings()
      const totalUsd = Number(args.total_usd) || 0
      const btcEstimate = totalUsd > 0 ? await getBtcEstimate(totalUsd) : null
      return {
        enabled: settings.enabled,
        walletAddress: settings.walletAddress || "Not configured yet",
        requiredConfirmations: settings.requiredConfirmations,
        paymentExpiryMinutes: settings.paymentExpiryMinutes,
        instructions: settings.instructions,
        btcEstimate,
      }
    }

    case "create_order": {
      if (args.confirmed !== true) {
        return {
          error:
            "Order NOT created. Show the customer a full summary (product, configuration, exact price, delivery address) and get an explicit 'yes' first, then call again with confirmed=true.",
        }
      }

      const orderRequest: AiOrderRequest = {
        productHandle: String(args.product_handle ?? ""),
        variantSku: args.variant_sku ? String(args.variant_sku) : undefined,
        customerName: String(args.customer_name ?? ""),
        email: String(args.email ?? ""),
        phone: String(args.phone ?? ""),
        company: args.company ? String(args.company) : undefined,
        address1: String(args.address1 ?? ""),
        address2: args.address2 ? String(args.address2) : undefined,
        city: String(args.city ?? ""),
        province: args.province ? String(args.province) : undefined,
        postalCode: args.postal_code ? String(args.postal_code) : undefined,
        countryCode: args.country_code ? String(args.country_code) : undefined,
        notes: args.notes ? String(args.notes) : undefined,
      }

      const validationError = validateOrder(orderRequest)
      if (validationError) {
        return { error: `Order not created: ${validationError}` }
      }

      const product = PRODUCT_CATALOG.find(
        (item) => item.handle === orderRequest.productHandle
      )
      if (!product) {
        return { error: "Order not created: product handle not found. Search the catalog first." }
      }

      const variant =
        product.variants.find((item) => item.sku === orderRequest.variantSku) ||
        product.variants[0]

      try {
        const created = await persistAiOrder(orderRequest, product, variant, [
          "Created by VectraCompute AI sales engineer (chat).",
          `Conversation transcript:\n${transcriptFromMessages(conversation)}`,
        ])
        effects.createdOrder = created
        return created
      } catch (error) {
        console.error("AI tool order creation failed", error)
        return { error: "Order storage is not connected; the order was not saved." }
      }
    }

    case "capture_lead": {
      const email = String(args.email ?? "")
      const message = String(args.message ?? "")
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message.trim()) {
        return { error: "A valid email and a message are required." }
      }
      try {
        const id = await storeLead({
          name: args.name ? String(args.name) : undefined,
          email,
          topic: args.topic ? String(args.topic) : undefined,
          message,
        })
        effects.capturedLead = true
        return { saved: true, lead_id: id, note: "The team will follow up by email." }
      } catch (error) {
        console.error("Lead capture failed", error)
        return { error: "Could not save the lead right now. Apologize and share the contact page /us/contact." }
      }
    }

    default:
      return { error: `Unknown tool '${name}'.` }
  }
}

const AGENT_SYSTEM_PROMPT = `
You are VectraCompute's senior AI hardware sales engineer. Your job is to guide every conversation toward a confident purchase — by being the most competent, most honest advisor the buyer has talked to, never by pressure.

SELL METHOD (follow in order):
1. Qualify fast: workload (training / fine-tuning / local LLM / inference / rendering), model sizes, users, budget, power/space limits, timeline. Two or three sharp questions maximum before you recommend — do not interrogate.
2. Recommend with conviction: use search_products, then present 2-3 options with exact prices and a one-line reason each ("fits because..."). Name the one you would pick and say why. Undecided lists lose sales; a clear recommendation with reasoning wins them.
3. Right-size honestly: if the cheaper option truly fits their workload, say so and recommend it. A buyer who trusts you on a $3k box returns for the $80k rack. Never upsell past their stated need; do suggest a genuinely relevant add-on (UPS, memory, spares) when it protects their purchase.
4. Handle hesitation with facts, not pressure: every system is burn-in tested for 24h under CUDA load before shipping, carries up to 5-year warranty with lifetime engineer support, ships in the stated lead time, and every order is trackable live at /us/order/status. For payment concern, walk through the process: exact BTC quote locked for the payment window, on-chain verification they can watch, full guide at /us/resources/how-bitcoin-payment-works.
5. Always end with one concrete next step: "Want me to place the order for the 128GB configuration?" / "Shall I check what fits under $10k?" / "Want the full spec link?" Never end a message with a dead end.
6. Close in chat: you can take the complete order — configuration, name, email, phone, delivery address — and place it yourself. Offer this actively when interest is clear.

HARD RULES (these outrank everything above):
- Only state products, prices, specs, and stock that your tools returned. Never invent discounts, scarcity, deadlines, reviews, or claims. One fabricated fact costs more trust than ten lost sales.
- Before create_order: show the full order summary (product, configuration, exact price, delivery address) and wait for an explicit yes. Never set confirmed=true without it.
- Payment is Bitcoin, manually verified before dispatch. Use get_payment_instructions for wallet details; never type an address from memory. If the wallet is not configured, say the team will email payment details and continue confidently.
- After create_order succeeds, lead with the order number (e.g. "Order #12") — never the internal id — and give the tracking page /us/order/status.
- If you cannot help (custom builds, financing, bulk quotes, complaints), collect an email, use capture_lead, and confirm the team will follow up within one business day.
- Concise, technical, warm. Off-topic questions get one friendly sentence and a steer back to hardware.
`.trim()

const callGrokAgent = async (
  messages: ChatMessage[],
  effects: AgentSideEffects
): Promise<string> => {
  const apiKey = process.env.XAI_API_KEY

  if (!apiKey) {
    return fallbackAnswer(messages.at(-1)?.content || "", effects.suggestedProducts)
  }

  const conversation: GrokMessage[] = [
    { role: "system", content: AGENT_SYSTEM_PROMPT },
    ...messages.slice(-10).map((message) => ({
      role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: message.content,
    })),
  ]

  for (let iteration = 0; iteration < 6; iteration++) {
    const response = await fetch(XAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || DEFAULT_MODEL,
        temperature: 0.3,
        messages: conversation,
        tools: AGENT_TOOLS,
        tool_choice: "auto",
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("xAI request failed", response.status, detail.slice(0, 500))
      return fallbackAnswer(messages.at(-1)?.content || "", effects.suggestedProducts)
    }

    const payload = (await response.json()) as {
      choices?: {
        message?: { content?: string | null; tool_calls?: GrokToolCall[] }
      }[]
    }

    const message = payload.choices?.[0]?.message
    const toolCalls = message?.tool_calls

    if (!toolCalls?.length) {
      return (
        message?.content ||
        fallbackAnswer(messages.at(-1)?.content || "", effects.suggestedProducts)
      )
    }

    conversation.push({
      role: "assistant",
      content: message?.content ?? null,
      tool_calls: toolCalls,
    })

    for (const toolCall of toolCalls) {
      const result = await executeTool(
        toolCall.function.name,
        toolCall.function.arguments,
        messages,
        effects
      )
      conversation.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      })
    }
  }

  return "I gathered the details but hit my step limit — please rephrase or ask me to continue."
}

const handleAiChat = async (req: IncomingMessage, res: ServerResponse) => {
  const body = await readJson<{ messages?: ChatMessage[] }>(req)
  const messages = Array.isArray(body.messages) ? body.messages : []
  const latestMessage = messages.at(-1)?.content || ""

  // Seed suggestions from the raw query; the agent's own search_products calls
  // overwrite these with whatever it actually recommended.
  const effects: AgentSideEffects = {
    suggestedProducts: findProducts(latestMessage || "AI workstation GPU server", 6),
    createdOrder: null,
    capturedLead: false,
  }

  const assistant = await callGrokAgent(messages, effects)

  sendJson(req, res, 200, {
    assistant,
    suggestedProducts: effects.suggestedProducts.slice(0, 4).map(summarizeProduct),
    order: effects.createdOrder,
    leadCaptured: effects.capturedLead,
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

const persistAiOrder = async (
  body: AiOrderRequest,
  product: BackendCatalogProduct,
  variant: BackendCatalogProduct["variants"][number],
  noteLines: string[]
) => {
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

  const stored = await createStoredOrder({
    id: orderId,
    email: body.email,
    customerName: body.customerName,
    phone: body.phone,
    company: body.company || null,
    address,
    paymentMethod: "bitcoin",
    bitcoinTxid: null,
    notes: [
      ...noteLines,
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

  const btcEstimate = await getBtcEstimate(total)
  const payment = getPaymentSettings()

  return {
    order: {
      id: orderId,
      display_id: stored?.display_id,
      orderNumber: stored?.display_id ? `#${stored.display_id}` : orderId,
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
      trackingPage: "/us/order/status",
      createdBy: "ai_chat",
    },
    payment: {
      ...payment,
      btcEstimate,
      message:
        "Your order has been saved. Send the Bitcoin payment to the wallet shown. Our team will contact you after payment is confirmed.",
    },
  }
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

  try {
    const payload = await persistAiOrder(body, product, variant, [
      "Created by VectraCompute AI sales engineer.",
    ])
    sendJson(req, res, 201, payload)
  } catch (error) {
    console.error("AI order creation failed", error)
    sendJson(req, res, 500, {
      error:
        "Order storage is not connected. Add DATABASE_URL to the Railway backend and retry.",
    })
  }
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

    if (req.method === "GET" && url.pathname === "/api/leads") {
      try {
        await ensureLeadsTable()
        const db = getPool()
        if (!db) throw new Error("DATABASE_URL is required.")
        const result = await db.query(
          "select * from vectra_leads order by created_at desc limit 100"
        )
        sendJson(req, res, 200, { leads: result.rows })
      } catch (error) {
        console.error("Lead list failed", error)
        sendJson(req, res, 500, { error: "Unable to list leads." })
      }
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
