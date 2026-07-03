import { HttpTypes } from "@medusajs/types"

export const getProductMetadata = (product: HttpTypes.StoreProduct) =>
  (product.metadata as Record<string, unknown> | null | undefined) ?? {}

export const getMetadataString = (
  product: HttpTypes.StoreProduct,
  key: string,
  fallback = ""
) => {
  const value = getProductMetadata(product)[key]
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

export const getMetadataList = (
  product: HttpTypes.StoreProduct,
  key: string,
  fallback: string[] = []
) => {
  const value = getProductMetadata(product)[key]

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string")
  }

  if (typeof value === "string" && value.trim()) {
    const separator = value.includes("|") ? "|" : ","

    return value
      .split(separator)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return fallback
}

export const getBuyerFaqItems = (
  product: HttpTypes.StoreProduct,
  fallback: string[] = []
) => {
  const value = getProductMetadata(product).buyer_faq

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string")
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|\s+\|\s+/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return fallback
}
