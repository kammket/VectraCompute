import { MetadataRoute } from "next"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { BLOG_POSTS } from "@lib/data/blog-posts"
import { SEO_PAGES } from "@lib/data/seo-pages"
import { SOLUTIONS } from "@lib/data/solutions"
import { getBaseURL } from "@lib/util/env"

const DEFAULT_COUNTRY = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()
  const prefix = `${baseUrl}/${DEFAULT_COUNTRY}`

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${prefix}`, changeFrequency: "weekly", priority: 1 },
    { url: `${prefix}/store`, changeFrequency: "daily", priority: 0.9 },
    { url: `${prefix}/configure`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${prefix}/trust`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${prefix}/compare`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${prefix}/solutions`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${prefix}/resources`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${prefix}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${prefix}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${prefix}/financing`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${prefix}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ]

  const solutionRoutes: MetadataRoute.Sitemap = SOLUTIONS.map((s) => ({
    url: `${prefix}/solutions/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const resourceRoutes: MetadataRoute.Sitemap = SEO_PAGES.map((p) => ({
    url: `${prefix}/resources/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.75,
  }))

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${prefix}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  let categoryRoutes: MetadataRoute.Sitemap = []
  let productRoutes: MetadataRoute.Sitemap = []

  try {
    const categories = await listCategories()
    categoryRoutes = (categories ?? []).map((c) => ({
      url: `${prefix}/categories/${c.handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch {
    // Backend unreachable at build time — sitemap will still include static routes.
  }

  try {
    const { response } = await listProducts({
      countryCode: DEFAULT_COUNTRY,
      queryParams: { limit: 100 },
    })
    productRoutes = response.products.map((p) => ({
      url: `${prefix}/products/${p.handle}`,
      lastModified: p.updated_at ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  } catch {
    // Backend unreachable at build time — sitemap will still include static routes.
  }

  return [
    ...staticRoutes,
    ...solutionRoutes,
    ...resourceRoutes,
    ...blogRoutes,
    ...categoryRoutes,
    ...productRoutes,
  ]
}
