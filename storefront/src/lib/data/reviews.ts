"use server"

import { requireAdmin } from "@lib/data/admin-auth"
import { revalidatePath } from "next/cache"
import { Client, type QueryResultRow } from "pg"

// Real product reviews only. A review is marked "verified" when the submitted
// order number + email match a stored order — those publish immediately.
// Unverified submissions sit in "pending" until the admin approves them, so no
// invented rating can ever reach the storefront or structured data.

export type ProductReview = {
  id: string
  product_handle: string
  reviewer_name: string
  email: string
  rating: number
  title: string | null
  body: string
  verified_buyer: boolean
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export type ReviewSummary = {
  average: number
  count: number
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

async function query<T extends QueryResultRow>(
  sql: string,
  params: unknown[] = []
) {
  const client = getClient()
  if (!client) {
    return { rows: [] as T[] }
  }

  // connect() must be inside the try: an unreachable DATABASE_URL otherwise
  // throws unhandled and takes down every page that renders reviews.
  try {
    await client.connect()
    const result = await client.query<T>(sql, params)
    return { rows: result.rows as T[] }
  } catch (error) {
    console.error("VectraCompute review query failed", error)
    return { rows: [] as T[] }
  } finally {
    await client.end().catch(() => {})
  }
}

async function ensureReviewsTable() {
  await query(`
    create table if not exists vectra_reviews (
      id text primary key,
      product_handle text not null,
      reviewer_name text not null,
      email text not null,
      rating integer not null check (rating between 1 and 5),
      title text,
      body text not null,
      verified_buyer boolean not null default false,
      status text not null default 'pending',
      created_at timestamptz not null default now()
    )
  `)
}

export async function listApprovedReviews(productHandle: string) {
  await ensureReviewsTable()
  const result = await query<ProductReview>(
    `select * from vectra_reviews
     where product_handle = $1 and status = 'approved'
     order by verified_buyer desc, created_at desc
     limit 50`,
    [productHandle]
  )
  return result.rows
}

export async function getReviewSummary(
  productHandle: string
): Promise<ReviewSummary> {
  await ensureReviewsTable()
  const result = await query<{ average: string | null; count: string }>(
    `select avg(rating)::numeric(3,2) as average, count(*) as count
     from vectra_reviews
     where product_handle = $1 and status = 'approved'`,
    [productHandle]
  )
  const row = result.rows[0]
  return {
    average: row?.average ? Number(row.average) : 0,
    count: row?.count ? Number(row.count) : 0,
  }
}

export async function listAllReviews() {
  await ensureReviewsTable()
  const result = await query<ProductReview>(
    "select * from vectra_reviews order by (status = 'pending') desc, created_at desc limit 200"
  )
  return result.rows
}

const matchesOrder = async (displayId: number, email: string) => {
  if (!Number.isFinite(displayId) || displayId <= 0) {
    return false
  }
  const result = await query<{ id: string }>(
    "select id from vectra_orders where display_id = $1 and lower(email) = $2 limit 1",
    [displayId, email.trim().toLowerCase()]
  )
  return result.rows.length > 0
}

export async function submitProductReview(
  _state: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const productHandle = String(formData.get("product_handle") ?? "").trim()
  const reviewerName = String(formData.get("reviewer_name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const rating = Number(formData.get("rating"))
  const title = String(formData.get("title") ?? "").trim()
  const body = String(formData.get("body") ?? "").trim()
  const orderNumber = Number(formData.get("order_number"))

  if (!productHandle || !reviewerName || !body) {
    return { error: "Please add your name and a few words about the product." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." }
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Please choose a star rating between 1 and 5." }
  }
  if (body.length > 3000) {
    return { error: "Please keep the review under 3000 characters." }
  }

  if (!getDatabaseUrl()) {
    return {
      error:
        "Reviews are not available right now. Please try again later or contact support.",
    }
  }

  try {
    await ensureReviewsTable()

    // One review per email per product; a resubmission updates nothing and is
    // rejected so ratings can't be stacked from a single buyer.
    const existing = await query<{ id: string }>(
      "select id from vectra_reviews where product_handle = $1 and lower(email) = $2 limit 1",
      [productHandle, email.toLowerCase()]
    )
    if (existing.rows.length) {
      return { error: "A review from this email already exists for this product." }
    }

    const verified = await matchesOrder(orderNumber, email)
    const id = `rev_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`

    await query(
      `insert into vectra_reviews
        (id, product_handle, reviewer_name, email, rating, title, body, verified_buyer, status)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        id,
        productHandle,
        reviewerName.slice(0, 120),
        email,
        rating,
        title.slice(0, 160) || null,
        body,
        verified,
        verified ? "approved" : "pending",
      ]
    )

    revalidatePath(`/us/products/${productHandle}`)
    revalidatePath("/admin/reviews")

    return {
      success: verified
        ? "Thank you! Your verified review is now live."
        : "Thank you! Your review was submitted and will appear after a quick moderation check.",
    }
  } catch (error) {
    console.error("Review submission failed", error)
    return { error: "Could not save the review right now. Please try again." }
  }
}

export async function moderateReview(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  const action = String(formData.get("action") ?? "")

  if (!id || !["approve", "reject", "delete"].includes(action)) {
    return
  }

  await ensureReviewsTable()

  if (action === "delete") {
    await query("delete from vectra_reviews where id = $1", [id])
  } else {
    await query("update vectra_reviews set status = $1 where id = $2", [
      action === "approve" ? "approved" : "rejected",
      id,
    ])
  }

  revalidatePath("/admin/reviews")
  revalidatePath("/", "layout")
}
