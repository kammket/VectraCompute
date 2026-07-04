"use server"

import {
  localCategories,
  localProducts,
} from "@lib/catalog/local-catalog"
import { HttpTypes } from "@medusajs/types"
import { revalidatePath } from "next/cache"
import { Client } from "pg"

export type ProductOverrideRow = {
  handle: string
  title: string | null
  subtitle: string | null
  description: string | null
  category: string | null
  image_url: string | null
  price_usd: string | null
  sku: string | null
  option_title: string | null
  option_value: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  best_for: string | null
  specs: string | null
  warranty: string | null
  condition: string | null
  lead_time: string | null
  support_level: string | null
  is_active: boolean
  is_custom: boolean
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
  } catch (error) {
    console.error("VectraCompute product database query failed", error)
    return { rows: [] as T[] }
  } finally {
    await client.end()
  }
}

export const isProductStorageConfigured = async () => Boolean(getDatabaseUrl())

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const readText = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim()

const readNullableText = (formData: FormData, key: string) =>
  readText(formData, key) || null

const readImageUpload = async (formData: FormData) => {
  const file = formData.get("image_file")
  if (!(file instanceof File) || file.size === 0) {
    return null
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Uploaded product photo must be an image.")
  }

  const maxBytes = 1024 * 1024 * 1.5
  if (file.size > maxBytes) {
    throw new Error("Product photo must be smaller than 1.5MB.")
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  return `data:${file.type};base64,${buffer.toString("base64")}`
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

  await query(`
    alter table vectra_product_overrides
      add column if not exists subtitle text,
      add column if not exists sku text,
      add column if not exists option_title text,
      add column if not exists option_value text,
      add column if not exists seo_title text,
      add column if not exists seo_description text,
      add column if not exists seo_keywords text,
      add column if not exists best_for text,
      add column if not exists specs text,
      add column if not exists warranty text,
      add column if not exists condition text,
      add column if not exists lead_time text,
      add column if not exists support_level text,
      add column if not exists is_custom boolean not null default false
  `)
}

export async function listProductOverrides() {
  try {
    await ensureProductOverrideTable()
    const result = await query<ProductOverrideRow>(
      "select * from vectra_product_overrides order by is_custom desc, updated_at desc"
    )
    return result.rows
  } catch (error) {
    console.error("Failed to list VectraCompute product overrides", error)
    return []
  }
}

const resolveCategory = (value?: string | null) => {
  const normalized = value?.trim().toLowerCase()
  return (
    localCategories.find(
      (category) =>
        category.handle === normalized ||
        category.id === value ||
        category.name.toLowerCase() === normalized
    ) ?? localCategories[0]
  )
}

const buildVariant = (row: ProductOverrideRow, handle: string) => {
  const price = row.price_usd ? Number(row.price_usd) : 0
  const optionTitle = row.option_title || "Configuration"
  const optionValue = row.option_value || "Standard reviewed build"

  return {
    id: `variant_${handle}_admin_1`,
    title: optionValue,
    sku: row.sku || `VC-${handle.toUpperCase().slice(0, 24)}`,
    manage_inventory: false,
    allow_backorder: true,
    inventory_quantity: 25,
    options: [
      {
        id: `varopt_${handle}_admin_1`,
        option_id: `opt_${handle}_admin`,
        value: optionValue,
      },
    ],
    calculated_price: {
      calculated_amount: price,
      original_amount: price,
      currency_code: "usd",
      calculated_price: { price_list_type: "default" },
    },
  } as HttpTypes.StoreProductVariant
}

const rowToProduct = (row: ProductOverrideRow): HttpTypes.StoreProduct | null => {
  const handle = slugify(row.handle)
  const title = row.title?.trim()
  if (!handle || !title || row.is_active === false) {
    return null
  }

  const category = resolveCategory(row.category)
  const image = row.image_url?.trim() || null
  const variant = buildVariant(row, handle)
  const optionTitle = row.option_title || "Configuration"
  const optionValue = row.option_value || "Standard reviewed build"

  return {
    id: `prod_${handle}`,
    title,
    handle,
    subtitle: row.subtitle || row.best_for || null,
    description:
      row.description ||
      `${title} from VectraCompute is configured for AI workloads, reviewed before fulfillment, and supported after delivery.`,
    status: "published",
    thumbnail: image,
    images: image ? [{ id: `img_${handle}_admin_1`, url: image }] : [],
    metadata: {
      seo_title: row.seo_title || undefined,
      seo_description: row.seo_description || undefined,
      seo_keywords: row.seo_keywords || undefined,
      best_for: row.best_for || undefined,
      specs: row.specs || undefined,
      warranty: row.warranty || "Admin-managed warranty terms",
      condition: row.condition || "Admin-managed product",
      lead_time: row.lead_time || "Confirmed after admin review",
      support_level:
        row.support_level || "Admin review and technical guidance included",
      trust_note:
        "Admin-managed product with reviewed pricing, product details, and fulfillment confirmation.",
      admin_managed: "true",
      admin_override_updated_at: row.updated_at,
    },
    categories: category ? [category] : [],
    category_ids: category ? [category.id] : [],
    options: [
      {
        id: `opt_${handle}_admin`,
        title: optionTitle,
        values: [
          {
            id: `optval_${handle}_admin_1`,
            value: optionValue,
            option_id: `opt_${handle}_admin`,
          },
        ],
      },
    ],
    variants: [variant],
    tags: [
      { id: `tag_${handle}_ai`, value: "AI hardware" },
      { id: `tag_${handle}_category`, value: category?.name || "AI hardware" },
    ],
    created_at: row.updated_at,
    updated_at: row.updated_at,
  } as HttpTypes.StoreProduct
}

const applyOverrideToProduct = (
  product: HttpTypes.StoreProduct,
  override: ProductOverrideRow
) => {
  if (!override.is_active) {
    return null
  }

  const price =
    override.price_usd !== null && override.price_usd !== undefined
      ? Number(override.price_usd)
      : null
  const image = override.image_url || product.thumbnail
  const category = resolveCategory(override.category)

  return {
    ...product,
    title: override.title || product.title,
    subtitle: override.subtitle || product.subtitle,
    description: override.description || product.description,
    thumbnail: image,
    images: image ? [{ id: `override_${product.handle}`, url: image }] : product.images,
    categories: override.category && category ? [category] : product.categories,
    category_ids:
      override.category && category ? [category.id] : product.category_ids,
    variants:
      price === null
        ? product.variants
        : product.variants?.map((variant) => ({
            ...variant,
            sku: override.sku || variant.sku,
            calculated_price: {
              calculated_amount: price,
              original_amount: price,
              currency_code: "usd",
              calculated_price: { price_list_type: "default" },
            },
          })),
    metadata: {
      ...product.metadata,
      seo_title: override.seo_title || product.metadata?.seo_title,
      seo_description:
        override.seo_description || product.metadata?.seo_description,
      seo_keywords: override.seo_keywords || product.metadata?.seo_keywords,
      best_for: override.best_for || product.metadata?.best_for,
      specs: override.specs || product.metadata?.specs,
      warranty: override.warranty || product.metadata?.warranty,
      condition: override.condition || product.metadata?.condition,
      lead_time: override.lead_time || product.metadata?.lead_time,
      support_level: override.support_level || product.metadata?.support_level,
      admin_override_updated_at: override.updated_at,
    },
  } as HttpTypes.StoreProduct
}

export async function applyProductOverrides(products: HttpTypes.StoreProduct[]) {
  const overrides = await listProductOverrides()
  if (!overrides.length) {
    return products
  }

  const byHandle = new Map(overrides.map((override) => [slugify(override.handle), override]))
  const seen = new Set<string>()
  const updated = products.flatMap((product) => {
    const override = byHandle.get(product.handle)
    seen.add(product.handle)
    if (!override) {
      return [product]
    }

    const nextProduct = applyOverrideToProduct(product, override)
    return nextProduct ? [nextProduct] : []
  })

  const customProducts = overrides
    .filter((override) => override.is_custom && !seen.has(slugify(override.handle)))
    .map(rowToProduct)
    .filter((product): product is HttpTypes.StoreProduct => Boolean(product))

  return [...customProducts, ...updated]
}

export async function listAdminCatalogProducts() {
  return applyProductOverrides([...localProducts])
}

export async function findCatalogProductByVariantId(variantId: string) {
  const products = await listAdminCatalogProducts()
  for (const product of products) {
    const variant = product.variants?.find((item) => item.id === variantId)
    if (variant) {
      return { product, variant }
    }
  }

  return null
}

export async function saveProductOverride(formData: FormData) {
  try {
    await ensureProductOverrideTable()
  } catch (error) {
    console.error("Failed to prepare VectraCompute product storage", error)
    return
  }

  const title = readText(formData, "title")
  const requestedHandle = readText(formData, "handle")
  const handle = slugify(requestedHandle || title)
  if (!handle || !title) {
    return
  }

  const priceValue = readText(formData, "price_usd")
  const isActive = formData.get("is_active") === "on"
  let imageUpload: string | null = null
  try {
    imageUpload = await readImageUpload(formData)
  } catch (error) {
    console.error("Failed to read uploaded product photo", error)
    return
  }
  const imageUrl = imageUpload || readNullableText(formData, "image_url")
  const isCustom =
    formData.get("is_custom") === "true" ||
    !localProducts.some((product) => product.handle === handle)

  try {
    await query(
      `
        insert into vectra_product_overrides
          (
            handle, title, subtitle, description, category, image_url, price_usd,
            sku, option_title, option_value, seo_title, seo_description,
            seo_keywords, best_for, specs, warranty, condition, lead_time,
            support_level, is_active, is_custom, updated_at
          )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,now())
        on conflict (handle) do update set
          title = excluded.title,
          subtitle = excluded.subtitle,
          description = excluded.description,
          category = excluded.category,
          image_url = coalesce(excluded.image_url, vectra_product_overrides.image_url),
          price_usd = excluded.price_usd,
          sku = excluded.sku,
          option_title = excluded.option_title,
          option_value = excluded.option_value,
          seo_title = excluded.seo_title,
          seo_description = excluded.seo_description,
          seo_keywords = excluded.seo_keywords,
          best_for = excluded.best_for,
          specs = excluded.specs,
          warranty = excluded.warranty,
          condition = excluded.condition,
          lead_time = excluded.lead_time,
          support_level = excluded.support_level,
          is_active = excluded.is_active,
          is_custom = excluded.is_custom,
          updated_at = now()
      `,
      [
        handle,
        title,
        readNullableText(formData, "subtitle"),
        readNullableText(formData, "description"),
        readNullableText(formData, "category"),
        imageUrl,
        priceValue ? Number(priceValue) : null,
        readNullableText(formData, "sku"),
        readNullableText(formData, "option_title"),
        readNullableText(formData, "option_value"),
        readNullableText(formData, "seo_title"),
        readNullableText(formData, "seo_description"),
        readNullableText(formData, "seo_keywords"),
        readNullableText(formData, "best_for"),
        readNullableText(formData, "specs"),
        readNullableText(formData, "warranty"),
        readNullableText(formData, "condition"),
        readNullableText(formData, "lead_time"),
        readNullableText(formData, "support_level"),
        isActive,
        isCustom,
      ]
    )
  } catch (error) {
    console.error("Failed to save VectraCompute product override", error)
    return
  }

  revalidatePath("/", "layout")
  revalidatePath("/admin/products")
}
