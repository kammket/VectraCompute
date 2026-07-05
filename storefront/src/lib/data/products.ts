"use server"

import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import type { ProductFilterValue } from "@modules/store/types"
import { localProducts } from "@lib/catalog/local-catalog"
import { getMergedCatalog } from "@lib/data/product-overrides"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  let products = await getMergedCatalog()

  if (queryParams?.handle) {
    const handles = Array.isArray(queryParams.handle)
      ? queryParams.handle
      : [queryParams.handle]
    products = products.filter((product) => handles.includes(product.handle))
  }

  if (queryParams?.id) {
    const ids = Array.isArray(queryParams.id) ? queryParams.id : [queryParams.id]
    products = products.filter((product) => ids.includes(product.id))
  }

  if (queryParams?.category_id) {
    const categoryIds = Array.isArray(queryParams.category_id)
      ? queryParams.category_id
      : [queryParams.category_id]
    products = products.filter((product) =>
      product.categories?.some((category) => categoryIds.includes(category.id))
    )
  }

  if (queryParams?.collection_id) {
    products = []
  }

  if (queryParams?.order === "created_at") {
    products = products.reverse()
  }

  const count = products.length
  const paginatedProducts = products.slice(offset, offset + limit)
  const nextPage = count > offset + limit ? pageParam + 1 : null

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  searchQuery,
  filters,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  searchQuery?: string
  filters?: ProductFilterValue
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      // Search/filters run over the full catalog in memory; keep this above
      // the catalog size (85 products as of mid-2026) or filters silently miss
      // whatever falls past the limit.
      limit: 300,
    },
    countryCode,
  })

  const normalizedQuery = searchQuery?.trim().toLowerCase()
  const filteredProducts = normalizedQuery
    ? products.filter((product) =>
        getSearchableProductText(product).includes(normalizedQuery)
      )
    : products
  const matchedProducts = filters
    ? filteredProducts.filter((product) =>
        productMatchesFilters(product, filters)
      )
    : filteredProducts

  const activeFilters = filters
    ? (Object.entries(filters) as [keyof ProductFilterValue, string][])
        .filter(([, value]) => Boolean(value))
    : []
  const displayProducts =
    activeFilters.length > 0 && matchedProducts.length < 2
      ? getProductsWithClosestFilterMatches(
          filteredProducts,
          matchedProducts,
          filters ?? {}
        )
      : matchedProducts

  const sortedProducts = sortProducts(displayProducts, sortBy)

  const pageParam = (page - 1) * limit

  const filteredCount = sortedProducts.length
  const nextPage = filteredCount > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count: filteredCount,
    },
    nextPage,
    queryParams,
  }
}

const getSearchableProductText = (product: HttpTypes.StoreProduct) => {
  const metadata = product.metadata ? JSON.stringify(product.metadata) : ""
  const categories = product.categories
    ?.map((category) => category.name)
    .join(" ")
  const tags = product.tags?.map((tag) => tag.value).join(" ")
  const variants = product.variants
    ?.map((variant) => [variant.title, variant.sku].filter(Boolean).join(" "))
    .join(" ")

  return [
    product.title,
    product.handle,
    product.subtitle,
    product.description,
    product.collection?.title,
    categories,
    tags,
    variants,
    metadata,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

// GPU and condition match the full product text (GPU names live in variant
// titles). Workload, infrastructure, and form factor match a NARROW text
// (title, handle, subtitle, category, best-for) — matching those against full
// descriptions made e.g. "power / cooling" hit 65 of 85 products because
// nearly every description mentions cooling.
const NARROW_MATCH_KEYS = new Set<keyof ProductFilterValue>([
  "workload",
  "infrastructure",
  "formFactor",
])

const FILTER_TERMS: Record<
  keyof ProductFilterValue,
  Record<string, string[]>
> = {
  gpu: {
    "rtx-5090": ["rtx 5090", "rtx-5090", "5090"],
    "rtx-pro-6000": ["rtx pro 6000", "rtx-pro-6000", "6000"],
    a100: ["a100"],
    "h100-h200": ["h100", "h200"],
    "b200-gb300": ["b200", "gb300", "nvl72", "blackwell ultra"],
    "amd-mi": ["mi300", "mi300x", "mi350", "mi350x", "mi350p", "rocm"],
    "edge-npu": ["jetson", "thor", "hailo", "npu", "edge ai"],
    "l40s-l4": ["l40s", "l4"],
  },
  workload: {
    "local-llm": ["local llm", "llm", "vram lab", "model serving", "vllm"],
    training: ["training", "fine-tuning", "fine tuning", "fine-tune"],
    inference: ["inference", "serving", "endpoint"],
    rag: ["rag", "document ai", "vector search", "embeddings", "knowledge"],
    vision: ["vision", "camera", "video analytics", "inspection"],
    storage: [
      "storage",
      "data node",
      "dataset",
      "vector database",
      "vector db",
      "nvme expansion",
    ],
    "robotics-edge": [
      "robotics",
      "physical ai",
      "edge",
      "jetson",
      "hailo",
      "sensor fusion",
    ],
    "power-cooling": [
      "pdu",
      "cdu",
      "ups",
      "battery backup",
      "power distribution",
      "liquid cooling",
      "cooling kit",
      "direct-to-chip",
      "vectrapower",
      "vectracool",
    ],
    monitoring: ["monitoring", "observability", "ai ops", "uptime"],
  },
  infrastructure: {
    "memory-storage": [
      "memory",
      "ddr5",
      "storage",
      "data node",
      "dataset",
      "nvme expansion",
      "vector database",
    ],
    "power-cooling": [
      "pdu",
      "cdu",
      "ups",
      "battery backup",
      "power distribution",
      "liquid cooling",
      "cooling kit",
      "direct-to-chip",
      "vectrapower",
      "vectracool",
    ],
    "edge-robotics": [
      "jetson",
      "thor",
      "hailo",
      "npu",
      "robotics",
      "physical ai",
      "edge",
      "video analytics",
    ],
    "inference-ops": [
      "inference",
      "h200 nvl",
      "vllm",
      "triton",
      "monitoring",
      "serving",
      "endpoint",
    ],
    "next-gen-rack": [
      "gb300",
      "gb200",
      "nvl72",
      "b200",
      "blackwell ultra",
      "rubin",
      "800gbe",
      "ai factory",
    ],
  },
  condition: {
    // "new" is handled as NOT refurbished in the matcher, so the two options
    // partition the catalog instead of overlapping.
    new: [],
    refurbished: ["refurbished", "refurb"],
  },
  formFactor: {
    // Category names carry the reliable signal here — they all appear in the
    // narrow text. Refurb/storage rack systems moved to their own categories,
    // so title cues ("vectrarack", "storage server") keep them findable as
    // rack servers too.
    workstation: ["workstation"],
    "rack-server": ["rack server", "vectrarack", "storage server", "data node"],
    appliance: ["appliance", "ai mini", "supercomputer", "micro server"],
    component: [
      "components & accessories",
      "networking & interconnect",
      "storage & memory",
      "power & cooling",
      "kit",
      "expansion card",
      "gateway",
    ],
  },
  budget: {},
}

const REFURB_TERMS = ["refurb"]

const getNarrowProductText = (product: HttpTypes.StoreProduct) => {
  const metadata = product.metadata as Record<string, unknown> | null | undefined
  const bestFor = typeof metadata?.best_for === "string" ? metadata.best_for : ""
  const categories = product.categories
    ?.map((category) => category.name)
    .join(" ")

  return [product.title, product.handle, product.subtitle, categories, bestFor]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

const matchesFilterTerm = (
  product: HttpTypes.StoreProduct,
  key: keyof ProductFilterValue,
  value: string
): boolean => {
  if (key === "budget") {
    return productMatchesBudget(product, value)
  }

  const fullText = getSearchableProductText(product)

  if (key === "condition") {
    const isRefurb = REFURB_TERMS.some((term) => fullText.includes(term))
    return value === "refurbished" ? isRefurb : !isRefurb
  }

  const terms = FILTER_TERMS[key]?.[value] ?? []
  if (!terms.length) {
    return true
  }

  const text = NARROW_MATCH_KEYS.has(key)
    ? getNarrowProductText(product)
    : fullText

  return terms.some((term) => text.includes(term))
}

const productMatchesFilters = (
  product: HttpTypes.StoreProduct,
  filters: ProductFilterValue
) =>
  (Object.entries(filters) as [keyof ProductFilterValue, string][])
    .filter(([, value]) => Boolean(value))
    .every(([key, value]) => matchesFilterTerm(product, key, value))

const getProductsWithClosestFilterMatches = (
  products: HttpTypes.StoreProduct[],
  exactMatches: HttpTypes.StoreProduct[],
  filters: ProductFilterValue
) => {
  const seen = new Set(exactMatches.map((product) => product.id))
  const closestMatches = products
    .filter((product) => !seen.has(product.id))
    .map((product) => ({
      product,
      score: getFilterMatchScore(product, filters),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product)

  return [...exactMatches, ...closestMatches].slice(0, Math.max(2, exactMatches.length))
}

const getFilterMatchScore = (
  product: HttpTypes.StoreProduct,
  filters: ProductFilterValue
) =>
  (Object.entries(filters) as [keyof ProductFilterValue, string][])
    .filter(([, value]) => Boolean(value))
    .reduce(
      (score, [key, value]) =>
        matchesFilterTerm(product, key, value) ? score + 1 : score,
      0
    )

const productMatchesBudget = (
  product: HttpTypes.StoreProduct,
  budget: string
) => {
  const prices =
    product.variants
      ?.map((variant) => variant.calculated_price?.calculated_amount)
      .filter((amount): amount is number => typeof amount === "number") ?? []

  if (!prices.length) {
    return true
  }

  const minPrice = Math.min(...prices)

  if (budget === "under-10k") {
    return minPrice < 10000
  }

  if (budget === "10k-25k") {
    return minPrice >= 10000 && minPrice < 25000
  }

  if (budget === "25k-50k") {
    return minPrice >= 25000 && minPrice < 50000
  }

  if (budget === "50k-plus") {
    return minPrice >= 50000
  }

  return true
}
