import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import ProductFilters from "@modules/store/components/product-filters"
import ProductSearch from "@modules/store/components/product-search"
import StoreBuyingPaths from "@modules/store/components/buying-paths"
import RefinementList from "@modules/store/components/refinement-list"
import MobileFilterDrawer from "@modules/store/components/mobile-filter-drawer"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { ProductFilterValue } from "@modules/store/types"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  query,
  filters,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  query?: string
  filters?: ProductFilterValue
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const activeFilterCount = Object.values(filters ?? {}).filter(Boolean).length

  return (
    <div className="bg-grey-5">
      <div
        className="content-container py-8 small:py-10"
        data-testid="category-container"
      >
        {/* Compact header: title + search on one band so products stay above the fold */}
        <div className="grid grid-cols-1 gap-4 border-b border-ui-border-base pb-6 medium:grid-cols-[minmax(0,1fr)_380px] medium:items-end">
          <div>
            <h1 className="text-2xl font-semibold text-ui-fg-base">
              AI workstations, GPU servers &amp; components
            </h1>
            <p className="mt-1 max-w-2xl text-small-regular leading-6 text-ui-fg-subtle">
              Every system is built to order, burn-in tested, and CUDA-validated
              before shipment. Search by GPU, workload, SKU, or system type —
              e.g. RTX 5090, H200, inference node, NVMe storage.
            </p>
          </div>
          <ProductSearch initialQuery={query} />
        </div>

        {/* Mobile/tablet: filters live in a dismissible bottom sheet */}
        <div className="mt-6 large:hidden">
          <MobileFilterDrawer activeCount={activeFilterCount}>
            <ProductFilters filters={filters ?? {}} />
            <RefinementList sortBy={sort} />
          </MobileFilterDrawer>
        </div>

        <div className="mt-6 grid grid-cols-1 large:mt-8 large:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
          <aside className="hidden large:sticky large:top-24 large:grid grid-cols-1 gap-5">
            <div className="rounded-md border border-ui-border-base bg-white p-4 shadow-elevation-card-rest">
              <ProductFilters filters={filters ?? {}} />
            </div>
            <div className="rounded-md border border-ui-border-base bg-white p-4 shadow-elevation-card-rest">
              <RefinementList sortBy={sort} />
            </div>
            <div className="rounded-md border border-grey-80 bg-grey-90 p-4 text-white">
              <p className="text-base-semi text-white">
                Need engineering review?
              </p>
              <p className="mt-2 text-small-regular leading-6 text-grey-20">
                Share your GPU, power, rack, workload, and budget requirements.
                An engineer can recommend the right system before you buy.
              </p>
              <a
                href={`/${countryCode}/contact${
                  query
                    ? `?constraints=${encodeURIComponent(
                        `Store search: ${query}`
                      )}`
                    : ""
                }`}
                className="mt-4 inline-flex h-9 items-center rounded-md bg-brand-500 px-3 text-small-semi text-white hover:bg-brand-600"
              >
                Request review
              </a>
            </div>
          </aside>
          <div className="w-full min-w-0">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                searchQuery={query}
                filters={filters}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>

        {/* Guided entry points sit after the catalog so products load first */}
        <StoreBuyingPaths />
      </div>
    </div>
  )
}

export default StoreTemplate
