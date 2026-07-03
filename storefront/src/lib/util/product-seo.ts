import { HttpTypes } from "@medusajs/types"

const readMeta = (
  metadata: Record<string, unknown> | null | undefined,
  key: string
) => {
  const value = metadata?.[key]
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

const readListMeta = (
  metadata: Record<string, unknown> | null | undefined,
  key: string
) => {
  const value = readMeta(metadata, key)
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export const getProductSeo = (product: HttpTypes.StoreProduct) => {
  const metadata = product.metadata as
    | Record<string, unknown>
    | null
    | undefined
  const category = product.categories?.[0]
  const categoryName = category?.name
  const fallbackDescription =
    product.description ??
    `${product.title} is a built-to-order ${
      categoryName?.toLowerCase() ?? "AI hardware system"
    } from VectraCompute, stress-tested and shipped ready for AI workloads.`

  return {
    title:
      readMeta(metadata, "seo_title") ??
      `${product.title} | ${categoryName ?? "AI Hardware"} | VectraCompute`,
    description:
      readMeta(metadata, "seo_description") ??
      fallbackDescription.slice(0, 155),
    keywords:
      readListMeta(metadata, "seo_keywords") ??
      [
        product.title,
        categoryName,
        "AI workstation",
        "GPU server",
        "deep learning hardware",
        "CUDA workstation",
      ].filter((item): item is string => Boolean(item)),
    canonicalPath:
      readMeta(metadata, "canonical_path") ?? `/products/${product.handle}`,
    ogImage: readMeta(metadata, "og_image") ?? product.thumbnail ?? undefined,
    trustNote:
      readMeta(metadata, "trust_note") ??
      "Built to order, burn-in tested, and supported by engineers who understand AI workloads.",
    bestFor:
      readListMeta(metadata, "best_for") ??
      product.tags
        ?.map((tag) => tag.value)
        .filter(Boolean)
        .slice(0, 4) ??
      [],
  }
}
