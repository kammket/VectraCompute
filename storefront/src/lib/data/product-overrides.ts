"use server"

import { HttpTypes } from "@medusajs/types"
import { revalidatePath } from "next/cache"
import { Client } from "pg"

type ProductOverrideRow = {
  handle: string
  title: string | null
  description: string | null
  category: string | null
  image_url: string | null
  price_usd: string | null
  is_active: boolean
  updated_at: string
}

const getDatabaseUrl = () => process.env.DATABASE_URL

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

async function query<T>(sql: string, params: unknown[] = []) {
  const client = getClient()
  if (!client) {
    return { rows: [] as T[] }
  }

  await client.connect()
  try {
    const result = await client.query<T>(sql, params)
    return result
  } finally {
    await client.end()
  }
}

export async function ensureProductOverrideTable() {
  await query(`
    create table if not exists vectra_product_overrides (
      handle text primary key,
      title text,
      description text,
      category text,
      image_url text,
      price_usd numeric,
      is_active boolean not null default true,
      updated_at timestamptz not null default now()
    )
  `)
}

export async function listProductOverrides() {
  await ensureProductOverrideTable()
  const result = await query<ProductOverrideRow>(
    "select * from vectra_product_overrides"
  )
  return result.rows
}

export async function applyProductOverrides(products: HttpTypes.StoreProduct[]) {
  const overrides = await listProductOverrides()
  if (!overrides.length) {
    return products
  }

  const byHandle = new Map(overrides.map((override) => [override.handle, override]))

  return products.flatMap((product) => {
    const override = byHandle.get(product.handle)
    if (!override) {
      return [product]
    }

    if (!override.is_active) {
      return []
    }

    const price =
      override.price_usd !== null && override.price_usd !== undefined
        ? Number(override.price_usd)
        : null
    const image = override.image_url || product.thumbnail

    return [
      {
        ...product,
        title: override.title || product.title,
        description: override.description || product.description,
        thumbnail: image,
        images: image ? [{ id: `override_${product.handle}`, url: image }] : product.images,
        variants:
          price === null
            ? product.variants
            : product.variants?.map((variant) => ({
                ...variant,
                calculated_price: {
                  calculated_amount: price,
                  original_amount: price,
                  currency_code: "usd",
                  calculated_price: { price_list_type: "default" },
                },
              })),
        metadata: {
          ...product.metadata,
          admin_override_updated_at: override.updated_at,
        },
      },
    ]
  })
}

export async function saveProductOverride(formData: FormData) {
  await ensureProductOverrideTable()

  const handle = String(formData.get("handle") ?? "").trim()
  if (!handle) {
    return
  }

  const priceValue = String(formData.get("price_usd") ?? "").trim()
  const isActive = formData.get("is_active") === "on"

  await query(
    `
      insert into vectra_product_overrides
        (handle, title, description, category, image_url, price_usd, is_active, updated_at)
      values ($1,$2,$3,$4,$5,$6,$7,now())
      on conflict (handle) do update set
        title = excluded.title,
        description = excluded.description,
        category = excluded.category,
        image_url = excluded.image_url,
        price_usd = excluded.price_usd,
        is_active = excluded.is_active,
        updated_at = now()
    `,
    [
      handle,
      String(formData.get("title") ?? "").trim() || null,
      String(formData.get("description") ?? "").trim() || null,
      String(formData.get("category") ?? "").trim() || null,
      String(formData.get("image_url") ?? "").trim() || null,
      priceValue ? Number(priceValue) : null,
      isActive,
    ]
  )

  revalidatePath("/", "layout")
  revalidatePath("/admin/products")
}
