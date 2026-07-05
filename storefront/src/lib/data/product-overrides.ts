"use server"

import {
  localCategories,
  localProducts,
} from "@lib/catalog/local-catalog"
import { requireAdmin } from "@lib/data/admin-auth"
import { HttpTypes } from "@medusajs/types"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { redirect } from "next/navigation"
import { Client } from "pg"

// Cache key/tag for the merged (seed + admin overrides) catalog.
const CATALOG_TAG = "vectra-catalog"

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
  gallery_images: string[] | null
  is_active: boolean
  is_custom: boolean
  updated_at: string
}

const MAX_GALLERY_IMAGES = 8

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

// Read path: swallows errors so an unreachable DATABASE_URL never crashes a
// page render — pages just fall back to the seeded catalog.
async function query<T>(sql: string, params: unknown[] = []) {
  const client = getClient()
  if (!client) {
    return { rows: [] as T[] }
  }

  try {
    await client.connect()
    const result = await client.query<T>(sql, params)
    return result
  } catch (error) {
    console.error("VectraCompute product database query failed", error)
    return { rows: [] as T[] }
  } finally {
    await client.end().catch(() => {})
  }
}

// Write path: THROWS on any failure. Admin saves must never pretend to
// succeed — a swallowed error here once showed a green "Saved" banner while
// nothing was persisted.
async function strictQuery<T>(sql: string, params: unknown[] = []) {
  const client = getClient()
  if (!client) {
    throw new Error("DATABASE_URL is not configured on this deployment.")
  }

  try {
    await client.connect()
    return await client.query<T>(sql, params)
  } finally {
    await client.end().catch(() => {})
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

// With BLOB_READ_WRITE_TOKEN set (Vercel Blob), photos land in durable object
// storage and only a URL is stored in Postgres. Without it, we fall back to
// inline data URLs so uploads still work on a bare setup.
const storeImage = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Uploaded product photo must be an image.")
  }

  const maxBytes = 1024 * 1024 * (process.env.BLOB_READ_WRITE_TOKEN ? 8 : 1.5)
  if (file.size > maxBytes) {
    throw new Error("Product photo is too large.")
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob")
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]+/g, "-").slice(-60)
      const blob = await put(`products/${Date.now()}-${safeName}`, file, {
        access: "public",
      })
      return blob.url
    } catch (error) {
      console.error("Vercel Blob upload failed, falling back to data URL", error)
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  return `data:${file.type};base64,${buffer.toString("base64")}`
}

const readImageUpload = async (formData: FormData) => {
  const file = formData.get("image_file")
  if (!(file instanceof File) || file.size === 0) {
    return null
  }

  return storeImage(file)
}

// Additional gallery photos: multiple files per submit, appended to whatever the
// product already has (minus any the admin ticked for removal), capped at
// MAX_GALLERY_IMAGES so a product page stays fast.
const readGalleryUploads = async (formData: FormData) => {
  const files = formData
    .getAll("gallery_files")
    .filter((file): file is File => file instanceof File && file.size > 0)

  const urls: string[] = []
  for (const file of files) {
    urls.push(await storeImage(file))
  }
  return urls
}

const OVERRIDE_TABLE_SQL = `
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
  `

const OVERRIDE_ALTER_SQL = `
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
      add column if not exists is_custom boolean not null default false,
      add column if not exists gallery_images jsonb
  `

export async function ensureProductOverrideTable() {
  await query(OVERRIDE_TABLE_SQL)
  await query(OVERRIDE_ALTER_SQL)
}

// Strict variant for the save path: any failure throws instead of being
// silently absorbed.
async function ensureProductOverrideTableStrict() {
  await strictQuery(OVERRIDE_TABLE_SQL)
  await strictQuery(OVERRIDE_ALTER_SQL)
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
  const gallery = Array.isArray(row.gallery_images) ? row.gallery_images : []
  const allImages = [image, ...gallery].filter((url): url is string =>
    Boolean(url)
  )
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
    thumbnail: allImages[0] ?? null,
    images: allImages.map((url, index) => ({
      id: `img_${handle}_admin_${index + 1}`,
      url,
    })),
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
  const gallery = Array.isArray(override.gallery_images)
    ? override.gallery_images
    : []
  const overrideImages = [override.image_url, ...gallery].filter(
    (url): url is string => Boolean(url)
  )
  const category = resolveCategory(override.category)

  return {
    ...product,
    title: override.title || product.title,
    subtitle: override.subtitle || product.subtitle,
    description: override.description || product.description,
    thumbnail: image,
    images: overrideImages.length
      ? overrideImages.map((url, index) => ({
          id: `override_${product.handle}_${index + 1}`,
          url,
        }))
      : product.images,
    categories: override.category && category ? [category] : product.categories,
    category_ids:
      override.category && category ? [category.id] : product.category_ids,
    // The admin has a single price field, which only makes sense for a
    // single-config product. Applying it to every variant of a multi-config
    // product would flatten all configurations to one price (so switching a
    // config wouldn't change the price). So only override variant prices when
    // there's exactly one variant; multi-config products keep per-variant
    // seed prices. The SKU override still applies to the first variant.
    variants:
      price === null || (product.variants?.length ?? 0) !== 1
        ? product.variants?.map((variant, index) =>
            index === 0 && override.sku
              ? { ...variant, sku: override.sku }
              : variant
          )
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

// Public storefront path: cache the merged catalog so the full-catalog map and
// the overrides DB read happen once per window and are shared across all
// requests, instead of on every product/category/store/home render. Admin
// saves call revalidateTag(CATALOG_TAG) to refresh immediately.
const getMergedCatalogCached = unstable_cache(
  async () => applyProductOverrides([...localProducts]),
  ["vectra-merged-catalog"],
  { revalidate: 300, tags: [CATALOG_TAG] }
)

export async function getMergedCatalog() {
  return getMergedCatalogCached()
}

// Admin path stays uncached so edits are visible immediately after save.
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

// Save always ends in a redirect carrying the outcome, so the admin sees an
// explicit success or error banner instead of a silent page refresh.
export async function saveProductOverride(formData: FormData) {
  await requireAdmin()

  const title = readText(formData, "title")
  const requestedHandle = readText(formData, "handle")
  const handle = slugify(requestedHandle || title)

  const fail = (code: string): never =>
    redirect(
      `/admin/products?error=${code}${handle ? `&product=${handle}` : ""}`
    )

  if (!handle || !title) {
    fail("missing-title")
  }

  // Strict path: a broken or unreachable DATABASE_URL must surface as the
  // red storage banner, never a false green "Saved".
  let storageReady = true
  try {
    await ensureProductOverrideTableStrict()
  } catch (error) {
    console.error("Failed to prepare VectraCompute product storage", error)
    storageReady = false
  }
  if (!storageReady) {
    fail("storage")
  }

  const priceValue = readText(formData, "price_usd")
  const isActive = formData.get("is_active") === "on"
  let imageUpload: string | null = null
  let galleryUploads: string[] = []
  let imageError = false
  try {
    imageUpload = await readImageUpload(formData)
    galleryUploads = await readGalleryUploads(formData)
  } catch (error) {
    console.error("Failed to read uploaded product photo", error)
    imageError = true
  }
  if (imageError) {
    fail("image")
  }
  const imageUrl = imageUpload || readNullableText(formData, "image_url")

  // Gallery = current stored photos, minus any the admin ticked for removal,
  // plus newly uploaded ones. Indexes refer to the currently stored array.
  const removedIndexes = new Set(
    formData
      .getAll("remove_gallery")
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value))
  )
  let existing: { rows: { gallery_images: string[] | null }[] } = { rows: [] }
  try {
    existing = await strictQuery<{ gallery_images: string[] | null }>(
      "select gallery_images from vectra_product_overrides where handle = $1 limit 1",
      [handle]
    )
  } catch (error) {
    console.error("Failed to read existing gallery", error)
    fail("storage")
  }
  const currentGallery = Array.isArray(existing.rows[0]?.gallery_images)
    ? (existing.rows[0]!.gallery_images as string[])
    : []
  const nextGallery = [
    ...currentGallery.filter((_, index) => !removedIndexes.has(index)),
    ...galleryUploads,
  ].slice(0, MAX_GALLERY_IMAGES)
  const isCustom =
    formData.get("is_custom") === "true" ||
    !localProducts.some((product) => product.handle === handle)

  try {
    await strictQuery(
      `
        insert into vectra_product_overrides
          (
            handle, title, subtitle, description, category, image_url, price_usd,
            sku, option_title, option_value, seo_title, seo_description,
            seo_keywords, best_for, specs, warranty, condition, lead_time,
            support_level, is_active, is_custom, gallery_images, updated_at
          )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,now())
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
          gallery_images = excluded.gallery_images,
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
        JSON.stringify(nextGallery),
      ]
    )
  } catch (error) {
    console.error("Failed to save VectraCompute product override", error)
    fail("save")
  }

  revalidateTag(CATALOG_TAG)
  revalidatePath("/", "layout")
  revalidatePath("/admin/products")
  redirect(`/admin/products?saved=${handle}`)
}
