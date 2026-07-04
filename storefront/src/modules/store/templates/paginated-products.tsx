import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { ProductFilterValue } from "@modules/store/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  searchQuery,
  filters,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  searchQuery?: string
  filters?: ProductFilterValue
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    searchQuery,
    filters,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  const normalizedQuery = searchQuery?.trim()
  const activeFilters = Object.values(filters ?? {}).filter(Boolean).length

  return (
    <>
      <div className="mb-5 flex flex-col gap-2 small:flex-row small:items-center small:justify-between">
        <Text className="text-small-regular text-ui-fg-subtle">
          {normalizedQuery
            ? `${count} result${
                count === 1 ? "" : "s"
              } for "${normalizedQuery}"`
            : activeFilters
            ? `${count} matching product${count === 1 ? "" : "s"}`
            : `${count} product${count === 1 ? "" : "s"} available`}
        </Text>
        {(normalizedQuery || activeFilters > 0) && (
          <LocalizedClientLink
            href="/store"
            className="text-small-semi text-brand-700 hover:text-brand-800"
          >
            Clear search and filters
          </LocalizedClientLink>
        )}
      </div>
      {!products.length && (
        <div className="rounded-md border border-ui-border-base bg-white p-8 text-center shadow-elevation-card-rest">
          <Text className="text-large-semi text-ui-fg-base">
            No products matched that selection.
          </Text>
          <Text className="mt-2 text-small-regular text-ui-fg-subtle">
            Try searching by GPU model, workload, category, or common terms like
            RTX 5090, A100, L40S, NVMe, RAG, or 800GbE.
          </Text>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <LocalizedClientLink
              href="/store?query=RTX%205090"
              className="rounded-md border border-ui-border-base px-3 py-2 text-small-semi hover:border-brand-300 hover:text-brand-700"
            >
              RTX 5090
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store?query=A100"
              className="rounded-md border border-ui-border-base px-3 py-2 text-small-semi hover:border-brand-300 hover:text-brand-700"
            >
              A100 servers
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/contact"
              className="rounded-md bg-brand-600 px-3 py-2 text-small-semi text-white hover:bg-brand-700"
            >
              Ask an expert
            </LocalizedClientLink>
          </div>
        </div>
      )}
      <ul
        className="grid grid-cols-1 w-full small:grid-cols-2 medium:grid-cols-3 gap-6"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
