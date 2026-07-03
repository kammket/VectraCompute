import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import ProductFilters from "@modules/store/components/product-filters"
import ProductSearch from "@modules/store/components/product-search"
import StoreBuyingPaths from "@modules/store/components/buying-paths"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { ProductFilterValue } from "@modules/store/types"
import { PremiumPageHeader } from "@modules/common/components/premium-page"

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

  return (
    <div className="bg-grey-5">
      <div
        className="content-container py-10 small:py-12"
        data-testid="category-container"
      >
        <PremiumPageHeader
          eyebrow="All products"
          title="AI workstations, GPU rack servers, and upgrade hardware"
          description="Browse validated AI systems and components organized for serious buyers: local development workstations, refurbished GPU servers, inference nodes, and infrastructure upgrades."
          actions={[
            { label: "Ask an expert", href: "/contact" },
            { label: "Compare systems", href: "/compare" },
          ]}
          highlights={[
            "Built to order",
            "Burn-in and CUDA validation",
            "Warranty and quote support",
          ]}
        />
        <div className="mt-8 rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest">
          <ProductSearch initialQuery={query} />
        </div>
        <StoreBuyingPaths />
        <div className="mt-8 grid grid-cols-1 large:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
          <aside className="large:sticky large:top-24 grid grid-cols-1 gap-5">
            <div className="rounded-md border border-ui-border-base bg-white p-4 shadow-elevation-card-rest">
              <ProductFilters filters={filters ?? {}} />
            </div>
            <div className="rounded-md border border-ui-border-base bg-white p-4 shadow-elevation-card-rest">
              <RefinementList sortBy={sort} />
            </div>
            <div className="rounded-md border border-brand-200 bg-brand-50 p-4">
              <p className="text-base-semi text-brand-900">
                Need a validated quote?
              </p>
              <p className="mt-2 text-small-regular leading-6 text-brand-800">
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
                className="mt-4 inline-flex h-9 items-center rounded-md bg-brand-600 px-3 text-small-semi text-white hover:bg-brand-700"
              >
                Request quote
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
      </div>
    </div>
  )
}

export default StoreTemplate
