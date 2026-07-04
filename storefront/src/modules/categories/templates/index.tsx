import { notFound } from "next/navigation"
import { Suspense } from "react"

import CategoryFaq from "@modules/categories/components/category-faq"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"

const CATEGORY_LINKS: Record<string, { label: string; href: string }[]> = {
  "ai-deep-learning-workstations": [
    {
      label: "AI hardware buying guide",
      href: "/resources/ai-hardware-buying-guide",
    },
    {
      label: "AI & deep learning solution",
      href: "/solutions/ai-deep-learning",
    },
  ],
  "gpu-rack-servers": [
    {
      label: "Enterprise procurement guide",
      href: "/resources/enterprise-ai-procurement",
    },
    {
      label: "Large-scale training solution",
      href: "/solutions/large-scale-training",
    },
  ],
  "workstations-by-cpu-platform": [
    {
      label: "Data science hardware guide",
      href: "/solutions/data-science-engineering",
    },
    {
      label: "AI hardware buying guide",
      href: "/resources/ai-hardware-buying-guide",
    },
  ],
  "components-accessories": [
    {
      label: "GPU server networking guide",
      href: "/resources/enterprise-ai-procurement",
    },
    {
      label: "Warranty and support",
      href: "/resources/warranty-support",
    },
  ],
}

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const relatedLinks = CATEGORY_LINKS[category.handle] ?? [
    {
      label: "AI hardware buying guide",
      href: "/resources/ai-hardware-buying-guide",
    },
    { label: "Warranty and support", href: "/resources/warranty-support" },
  ]

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12" data-testid="category-container">
      <div className="mb-8">
        {parents && parents.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 text-small-regular text-ui-fg-subtle mb-4">
            {parents.map((parent) => (
              <span key={parent.id} className="flex items-center gap-x-2">
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                <span aria-hidden>/</span>
              </span>
            ))}
          </div>
        )}
        <PremiumPageHeader
          eyebrow="Category"
          title={category.name}
          description={
            category.description ||
            "Browse validated AI hardware by configuration, workload fit, support expectations, and deployment requirements."
          }
          actions={[
            { label: "Ask an expert", href: "/contact" },
            { label: "Compare systems", href: "/compare" },
          ]}
          highlights={[
            "Validated systems",
            "Engineer support",
            "Procurement ready",
          ]}
        />
      </div>
      <div className="grid grid-cols-1 large:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
        <aside className="large:sticky large:top-24 grid grid-cols-1 gap-5">
          <div className="rounded-md border border-ui-border-base bg-white p-4 shadow-elevation-card-rest">
            <RefinementList sortBy={sort} data-testid="sort-by-container" />
          </div>
          <div className="rounded-md border border-brand-200 bg-brand-50 p-4">
            <Text className="text-base-semi text-brand-950">
              Buying checklist
            </Text>
            <div className="mt-3 grid grid-cols-1 gap-2 text-small-regular text-brand-800">
              {[
                "GPU memory and model size",
                "Power, cooling, and noise",
                "Storage, network, and users",
                "Warranty and support level",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-brand-200 bg-white px-3 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </aside>
        <div className="w-full min-w-0">
          {category.category_children &&
            category.category_children.length > 0 && (
              <section className="mb-10">
                <Heading level="h2" className="text-xl mb-4">
                  Organized by configuration
                </Heading>
                <ul className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 gap-3">
                  {category.category_children?.map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/categories/${c.handle}`}
                      className="block h-full border border-ui-border-base rounded-md bg-white p-4 shadow-elevation-card-rest hover:border-brand-300 hover:shadow-elevation-card-hover transition-shadow"
                      >
                        <Text className="text-base-semi mb-1">{c.name}</Text>
                        {c.description && (
                          <Text className="text-small-regular text-ui-fg-subtle line-clamp-2">
                            {c.description}
                          </Text>
                        )}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          <section className="mb-10 grid grid-cols-1 medium:grid-cols-[minmax(0,1fr)_280px] gap-5 border border-ui-border-base rounded-md bg-white p-5 shadow-elevation-card-rest small:p-6">
            <div>
              <Heading level="h2" className="text-xl mb-2">
                Buying guidance for {category.name}
              </Heading>
              <Text className="text-small-regular text-ui-fg-subtle leading-6">
                Compare systems by workload fit, GPU memory, CPU platform,
                storage, networking, warranty, and deployment constraints. For
                high-value AI systems, confirm power, cooling, software stack,
                and support expectations before ordering.
              </Text>
            </div>
            <div className="flex flex-wrap gap-3">
              {relatedLinks.map((link) => (
                <LocalizedClientLink
                  key={link.href}
                  href={link.href}
                  className="inline-flex h-9 items-center rounded-md border border-ui-border-base px-3 text-small-regular text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                >
                  {link.label}
                </LocalizedClientLink>
              ))}
            </div>
          </section>
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
          <CategoryFaq handle={category.handle} />
        </div>
      </div>
      </div>
    </div>
  )
}
