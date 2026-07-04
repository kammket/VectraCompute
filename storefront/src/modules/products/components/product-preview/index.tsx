import Image from "next/image"

import { getProductPrice } from "@lib/util/get-product-price"
import { fallbackProductImage } from "@lib/util/product-image"
import { getProductSeo } from "@lib/util/product-seo"
import { getMetadataString } from "@lib/util/product-metadata"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"
import PreviewPrice from "./price"

// Badges are reserved for real differentiators (e.g. refurbished stock). Every
// product here is "AI-ready", so saying it on each card is noise.
const badgeFor = (condition: string): string | null => {
  const normalized = condition.trim().toLowerCase()
  if (!normalized || ["new", "validated"].includes(normalized)) {
    return null
  }
  return condition
}

export default async function ProductPreview({
  product,
  isFeatured: _isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })
  const seo = getProductSeo(product)
  const badge = badgeFor(getMetadataString(product, "condition", ""))

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1
  const image =
    product.thumbnail ??
    product.images?.[0]?.url ??
    fallbackProductImage(product.handle)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
    >
      <div
        data-testid="product-wrapper"
        className="flex h-full flex-col overflow-hidden rounded-md border border-ui-border-base bg-white shadow-elevation-card-rest transition duration-200 hover:border-brand-300 hover:shadow-elevation-card-hover"
      >
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-grey-90">
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized={image.startsWith("data:")}
          />
          {badge && (
            <span className="absolute left-3 top-3 rounded-md bg-brand-600 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white shadow-sm">
              {badge}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 gap-1.5 p-4">
          {product.categories?.[0]?.name && (
            <Text className="text-xs uppercase tracking-wide text-brand-700">
              {product.categories[0].name}
            </Text>
          )}
          <Text
            className="text-base-semi text-ui-fg-base line-clamp-2 leading-6"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <Text className="text-small-regular text-ui-fg-subtle line-clamp-1">
            {seo.description}
          </Text>
          <div className="mt-auto flex items-baseline gap-x-1.5 border-t border-ui-border-base pt-3">
            {cheapestPrice ? (
              <>
                {hasMultipleVariants && (
                  <span className="text-xs text-ui-fg-muted">From</span>
                )}
                <PreviewPrice price={cheapestPrice} />
              </>
            ) : (
              <Text className="text-small-regular text-ui-fg-muted">
                Contact for pricing
              </Text>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
