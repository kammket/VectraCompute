import Image from "next/image"

import { getProductPrice } from "@lib/util/get-product-price"
import { fallbackProductImage } from "@lib/util/product-image"
import { getProductSeo } from "@lib/util/product-seo"
import { getProductProfile } from "@lib/util/product-profile"
import { getMetadataString } from "@lib/util/product-metadata"
import { HttpTypes } from "@medusajs/types"
import { ArrowRightMini, CheckCircleMiniSolid } from "@medusajs/icons"
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
  const profile = getProductProfile(product)
  const condition = getMetadataString(product, "condition", "Validated")
  const leadTime = getMetadataString(product, "lead_time", "Lead time reviewed")

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
        className="flex h-full flex-col overflow-hidden rounded-md border border-ui-border-base bg-white shadow-elevation-card-rest transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-elevation-card-hover"
      >
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-grey-90">
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3">
            <span className="rounded-md border border-white/15 bg-grey-90/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur">
              {condition}
            </span>
            <span className="rounded-md bg-brand-500 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm">
              AI-ready
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-3 p-4">
          {product.categories?.[0]?.name && (
            <div className="flex items-center justify-between gap-3">
              <Text className="text-xs uppercase tracking-wide text-brand-700 min-h-4">
                {product.categories[0].name}
              </Text>
              <span className="hidden text-[11px] text-ui-fg-muted small:inline">
                {leadTime}
              </span>
            </div>
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
          <div className="grid grid-cols-2 gap-2 text-[11px] text-ui-fg-subtle">
            {profile.validation.slice(0, 2).map(([title]) => (
              <span
                key={title}
                className="inline-flex items-center gap-1 rounded-md border border-ui-border-base bg-grey-5 px-2 py-1"
              >
                <CheckCircleMiniSolid className="text-brand-600" />
                {title}
              </span>
            ))}
          </div>
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
          <span className="inline-flex items-center gap-1 text-small-semi text-brand-700 group-hover:text-brand-800">
            View technical fit
            <ArrowRightMini />
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
