import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <Text className="text-small-semi uppercase text-brand-600 mb-2">
            Featured systems
          </Text>
          <Heading level="h2" className="text-2xl">
            {collection.title}
          </Heading>
        </div>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 gap-x-5 gap-y-10">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
