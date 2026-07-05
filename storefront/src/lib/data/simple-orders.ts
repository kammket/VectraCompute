"use server"

import { clearCart, retrieveCart } from "@lib/data/cart"
import { requireAdmin } from "@lib/data/admin-auth"
import { sendOrderConfirmationEmail } from "@lib/util/order-email"
import { HttpTypes } from "@medusajs/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Client } from "pg"

export type SimpleOrderStatus =
  | "awaiting_payment"
  | "payment_review"
  | "confirmed"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"

type StoredOrder = {
  id: string
  display_id: number
  email: string
  customer_name: string
  phone: string
  company: string | null
  address: Record<string, string>
  payment_method: string
  bitcoin_txid: string | null
  notes: string | null
  status: SimpleOrderStatus
  currency_code: string
  subtotal: number
  total: number
  items: HttpTypes.StoreCartLineItem[]
  created_at: string
  updated_at: string
}

const getDatabaseUrl = () => process.env.DATABASE_URL
const getOrderBackendUrl = () =>
  (process.env.AI_BACKEND_URL || process.env.NEXT_PUBLIC_AI_BACKEND_URL || "")
    .trim()
    .replace(/\/$/, "")

const getClient = () => {
  const connectionString = getDatabaseUrl()
  if (!connectionString) {
    return null
  }

  return new Client({
    connectionString,
    ssl: connectionString.includes("localhost")
      ? undefined
      : { rejectUnauthorized: false },
  })
}

export const isCommerceStorageConfigured = async () =>
  Boolean(getDatabaseUrl() || getOrderBackendUrl())

async function query<T>(sql: string, params: unknown[] = []) {
  const client = getClient()
  if (!client) {
    throw new Error("DATABASE_URL is required for order storage.")
  }

  await client.connect()
  try {
    const result = await client.query<T>(sql, params)
    return result
  } finally {
    await client.end()
  }
}

export async function ensureCommerceTables() {
  await query(`
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

const rowToOrder = (row: StoredOrder): HttpTypes.StoreOrder => {
  const shippingAddress = {
    first_name: row.customer_name.split(" ")[0] ?? row.customer_name,
    last_name: row.customer_name.split(" ").slice(1).join(" "),
    phone: row.phone,
    address_1: row.address.address_1,
    address_2: row.address.address_2,
    city: row.address.city,
    province: row.address.province,
    postal_code: row.address.postal_code,
    country_code: row.address.country_code || "us",
  }

  return {
    id: row.id,
    display_id: row.display_id,
    email: row.email,
    currency_code: row.currency_code,
    items: row.items,
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    tax_total: 0,
    shipping_total: 0,
    discount_total: 0,
    gift_card_total: 0,
    fulfillment_status: row.status,
    payment_status:
      row.status === "awaiting_payment" || row.status === "payment_review"
        ? "awaiting"
        : "captured",
    shipping_address: shippingAddress,
    shipping_methods: [
      {
        name: "Admin-reviewed freight / insured delivery",
        amount: 0,
      },
    ],
    payment_collections: [
      {
        payments: [
          {
            provider_id:
              row.payment_method === "bitcoin"
                ? "pp_system_default"
                : "manual_invoice",
            amount: Number(row.total),
            created_at: row.created_at,
            data: row.bitcoin_txid ? { bitcoin_txid: row.bitcoin_txid } : {},
          },
        ],
      },
    ],
    created_at: row.created_at,
    updated_at: row.updated_at,
    metadata: {
      company: row.company,
      notes: row.notes,
      internal_status: row.status,
    },
  } as HttpTypes.StoreOrder
}

const fetchBackendJson = async <T>(
  path: string,
  init?: RequestInit
): Promise<T | null> => {
  const backendUrl = getOrderBackendUrl()

  if (!backendUrl) {
    return null
  }

  const response = await fetch(`${backendUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(
      `Backend order request failed (${response.status}): ${detail.slice(0, 300)}`
    )
  }

  return (await response.json()) as T
}

const createOrderViaBackend = async ({
  id,
  cart,
  formData,
  email,
  customerName,
  phone,
  address1,
  city,
  countryCode,
}: {
  id: string
  cart: NonNullable<Awaited<ReturnType<typeof retrieveCart>>>
  formData: FormData
  email: string
  customerName: string
  phone: string
  address1: string
  city: string
  countryCode: string
}) => {
  const payload = await fetchBackendJson<{ order: StoredOrder }>("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      id,
      email,
      customerName,
      phone,
      company: String(formData.get("company") ?? "").trim() || null,
      address: {
        address_1: address1,
        address_2: String(formData.get("address_2") ?? "").trim(),
        city,
        province: String(formData.get("province") ?? "").trim(),
        postal_code: String(formData.get("postal_code") ?? "").trim(),
        country_code: countryCode,
      },
      paymentMethod: String(formData.get("payment_method") ?? "bitcoin"),
      bitcoinTxid: String(formData.get("bitcoin_txid") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      status: "awaiting_payment",
      currencyCode: cart.currency_code,
      subtotal: cart.item_subtotal ?? cart.subtotal ?? 0,
      total: cart.total ?? 0,
      items: cart.items,
    }),
  })

  return payload?.order ?? null
}

export async function createSimpleOrder(
  _currentState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const cart = await retrieveCart()
  if (!cart?.items?.length) {
    return { error: "Your cart is empty." }
  }

  const email = String(formData.get("email") ?? "").trim()
  const customerName = String(formData.get("customer_name") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const address1 = String(formData.get("address_1") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()
  const countryCode = String(formData.get("country_code") ?? "us").trim() || "us"

  if (!email || !customerName || !phone || !address1 || !city) {
    return { error: "Please complete your contact and delivery details." }
  }

  const id = `ord_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`
  let createdOrderId = id
  let createdDisplayId: number | string | null = null

  try {
    await ensureCommerceTables()

    const inserted = await query<{ display_id: number }>(
      `
        insert into vectra_orders (
          id, email, customer_name, phone, company, address, payment_method,
          bitcoin_txid, notes, status, currency_code, subtotal, total, items
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        returning display_id
      `,
      [
        id,
        email,
        customerName,
        phone,
        String(formData.get("company") ?? "").trim() || null,
        {
          address_1: address1,
          address_2: String(formData.get("address_2") ?? "").trim(),
          city,
          province: String(formData.get("province") ?? "").trim(),
          postal_code: String(formData.get("postal_code") ?? "").trim(),
          country_code: countryCode,
        },
        String(formData.get("payment_method") ?? "bitcoin"),
        String(formData.get("bitcoin_txid") ?? "").trim() || null,
        String(formData.get("notes") ?? "").trim() || null,
        "awaiting_payment",
        cart.currency_code,
        cart.item_subtotal ?? cart.subtotal ?? 0,
        cart.total ?? 0,
        // node-postgres serializes JS arrays as Postgres array literals, which
        // are invalid jsonb — stringify explicitly or every insert fails.
        JSON.stringify(cart.items ?? []),
      ]
    )
    createdDisplayId = inserted.rows[0]?.display_id ?? null
  } catch (error) {
    console.error(
      "Direct Vercel order storage failed, trying Railway backend fallback",
      error
    )

    try {
      const remoteOrder = await createOrderViaBackend({
        id,
        cart,
        formData,
        email,
        customerName,
        phone,
        address1,
        city,
        countryCode,
      })

      if (!remoteOrder?.id) {
        throw new Error("Railway backend did not return an order.")
      }

      createdOrderId = remoteOrder.id
      createdDisplayId = remoteOrder.display_id ?? null
    } catch (backendError) {
      console.error("Failed to create VectraCompute order", backendError)
      return {
        error:
          "Order storage is not connected. Check DATABASE_URL in Vercel or Railway backend order storage, then redeploy and try again.",
      }
    }
  }

  // Best-effort confirmation email; a mail failure must never fail checkout.
  try {
    await sendOrderConfirmationEmail({
      to: email,
      customerName,
      displayId: createdDisplayId,
      totalText: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: (cart.currency_code || "usd").toUpperCase(),
        maximumFractionDigits: 0,
      }).format(Number(cart.total ?? 0)),
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    })
  } catch (emailError) {
    console.error("Order confirmation email failed", emailError)
  }

  await clearCart()
  revalidatePath("/", "layout")
  redirect(`/us/order/${createdOrderId}/confirmed`)
}

export async function retrieveOrder(id: string) {
  try {
    await ensureCommerceTables()
    const result = await query<StoredOrder>(
      "select * from vectra_orders where id = $1 limit 1",
      [id]
    )
    return result.rows[0] ? rowToOrder(result.rows[0]) : null
  } catch (error) {
    console.error("Direct Vercel order retrieval failed", error)

    try {
      const payload = await fetchBackendJson<{ order: StoredOrder }>(
        `/api/orders/${encodeURIComponent(id)}`
      )
      return payload?.order ? rowToOrder(payload.order) : null
    } catch (backendError) {
      console.error("Failed to retrieve VectraCompute order", backendError)
      return null
    }
  }
}

// Customer-facing lookup: both values must match so an order number alone
// can't expose someone else's order details.
export async function findOrderByDisplayIdAndEmail(
  displayId: number,
  email: string
) {
  const normalizedEmail = email.trim().toLowerCase()
  if (!displayId || !normalizedEmail) {
    return null
  }

  try {
    await ensureCommerceTables()
    const result = await query<StoredOrder>(
      "select * from vectra_orders where display_id = $1 and lower(email) = $2 limit 1",
      [displayId, normalizedEmail]
    )
    return result.rows[0] ? rowToOrder(result.rows[0]) : null
  } catch (error) {
    console.error("Direct Vercel order lookup failed", error)

    try {
      const payload = await fetchBackendJson<{ orders: StoredOrder[] }>(
        "/api/orders"
      )
      const match = payload?.orders?.find(
        (row) =>
          Number(row.display_id) === displayId &&
          row.email?.trim().toLowerCase() === normalizedEmail
      )
      return match ? rowToOrder(match) : null
    } catch (backendError) {
      console.error("Failed to look up VectraCompute order", backendError)
      return null
    }
  }
}

export async function listSimpleOrders() {
  try {
    await ensureCommerceTables()
    const result = await query<StoredOrder>(
      "select * from vectra_orders order by created_at desc limit 100"
    )
    return result.rows.map(rowToOrder)
  } catch (error) {
    console.error("Direct Vercel order listing failed", error)

    try {
      const payload = await fetchBackendJson<{ orders: StoredOrder[] }>(
        "/api/orders"
      )
      return payload?.orders?.map(rowToOrder) ?? []
    } catch (backendError) {
      console.error("Failed to list VectraCompute orders", backendError)
      return []
    }
  }
}

export async function updateSimpleOrderStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status") ?? "") as SimpleOrderStatus

  if (!id || !status) {
    return
  }

  try {
    await ensureCommerceTables()
    await query(
      "update vectra_orders set status = $1, updated_at = now() where id = $2",
      [status, id]
    )
    revalidatePath("/admin/orders")
  } catch (error) {
    console.error("Direct Vercel order status update failed", error)

    try {
      await fetchBackendJson("/api/orders/status", {
        method: "POST",
        body: JSON.stringify({ id, status }),
      })
      revalidatePath("/admin/orders")
    } catch (backendError) {
      console.error("Failed to update VectraCompute order status", backendError)
    }
  }
}
