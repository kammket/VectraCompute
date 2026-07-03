import { HttpTypes } from "@medusajs/types"
import { getMetadataList } from "@lib/util/product-metadata"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CompareButton from "@modules/products/components/compare-button"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const category = product.categories?.[0]
  const trustChips = getMetadataList(product, "certifications", [
    "Burn-in tested",
    "AI-ready",
    "Quote support",
  ]).slice(0, 3)

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <LocalizedClientLink
              href={`/categories/${category.handle}`}
              className="rounded-md bg-grey-5 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-ui-fg-subtle hover:text-brand-700"
            >
              {category.name}
            </LocalizedClientLink>
          )}
          <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-brand-700">
            Validated AI hardware
          </span>
        </div>
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-small-semi uppercase text-brand-600 hover:text-brand-700"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-tight text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
        <div className="grid grid-cols-1 small:grid-cols-3 gap-2 pt-1">
          {trustChips.map((item) => (
            <span
              key={item}
              className="rounded-md border border-ui-border-base bg-white px-3 py-2 text-center text-xs font-medium text-ui-fg-base"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="pt-1">
          <CompareButton product={product} />
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
