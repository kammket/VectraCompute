import Image from "next/image"

import { getProductPrice } from "@lib/util/get-product-price"
import { fallbackProductImage } from "@lib/util/product-image"
import { getProductSeo } from "@lib/util/product-seo"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"
import PreviewPrice from "./price"

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
        className="flex flex-col h-full rounded-md border border-ui-border-base overflow-hidden bg-white transition-shadow duration-200 hover:shadow-elevation-card-hover"
      >
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-ui-bg-subtle">
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-col flex-1 gap-3 p-4">
          {product.categories?.[0]?.name && (
            <Text className="text-xs uppercase tracking-wide text-ui-fg-muted min-h-4">
              {product.categories[0].name}
            </Text>
          )}
          <Text
            className="text-base-semi text-ui-fg-base line-clamp-2 min-h-[2.75rem] leading-6"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <Text className="text-small-regular text-ui-fg-subtle line-clamp-2 min-h-[2.75rem]">
            {seo.description}
          </Text>
          <div className="mt-auto pt-2 flex items-baseline gap-x-1.5 border-t border-ui-border-base">
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
          <div className="flex flex-wrap gap-1.5">
            {(seo.bestFor.length ? seo.bestFor : ["Burn-in tested", "AI-ready"])
              .slice(0, 2)
              .map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-grey-10 px-2 py-1 text-[11px] text-grey-70"
                >
                  {item}
                </span>
              ))}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
