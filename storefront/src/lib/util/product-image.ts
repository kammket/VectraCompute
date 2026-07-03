import { HttpTypes } from "@medusajs/types"

import manifest from "@lib/data/generated-image-handles.json"

const GENERATED_PRODUCTS = new Set(manifest.products)
const GENERATED_CATEGORIES = new Set(manifest.categories)

// Products/categories may have no uploaded image (seeded catalog, or added later in
// Medusa Admin without a photo). We ship original generated brand visuals in
// /public/products and /public/categories (see scripts/generate-product-images.mjs).
// Real photography uploaded via Medusa Admin always takes precedence — these helpers
// only fill the gap, and fall back to a generic placeholder for handles we have no
// dedicated art for (e.g. a brand-new product), so nothing ever renders broken.
export const fallbackProductImage = (handle?: string | null): string =>
  handle && GENERATED_PRODUCTS.has(handle)
    ? `/products/${handle}.svg`
    : "/products/_placeholder.svg"

export const fallbackCategoryImage = (handle?: string | null): string =>
  handle && GENERATED_CATEGORIES.has(handle)
    ? `/categories/${handle}.svg`
    : "/categories/_placeholder.svg"

export const withProductImages = (
  product: HttpTypes.StoreProduct
): HttpTypes.StoreProduct => {
  const hasThumbnail = !!product.thumbnail
  const hasImages = !!product.images?.length
  if (hasThumbnail && hasImages) {
    return product
  }

  const fallback = fallbackProductImage(product.handle)

  return {
    ...product,
    thumbnail: product.thumbnail ?? fallback,
    images: product.images?.length
      ? product.images
      : [
          {
            id: `${product.id}-fallback`,
            url: fallback,
          } as HttpTypes.StoreProductImage,
        ],
  }
}
