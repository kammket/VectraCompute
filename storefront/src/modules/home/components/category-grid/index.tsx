import Image from "next/image"
import { ArrowRightMini } from "@medusajs/icons"

import { listCategories } from "@lib/data/categories"
import { fallbackCategoryImage } from "@lib/util/product-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading, Text } from "@modules/common/components/ui"

const CategoryGrid = async () => {
  const categories = await listCategories()

  // Only show top-level categories on the home grid.
  const topLevel = (categories ?? []).filter((c) => !c.parent_category)

  if (!topLevel.length) {
    return null
  }

  return (
    <section className="content-container py-14">
      <div className="flex flex-col medium:flex-row medium:items-end medium:justify-between gap-4 mb-8">
        <div>
          <Text className="text-small-semi uppercase text-brand-600 mb-2">
            Shop the catalog
          </Text>
          <Heading level="h2" className="text-2xl mb-2">
            Start with the right hardware family
          </Heading>
          <Text className="text-ui-fg-subtle max-w-2xl">
            From a compact single-GPU build to an 8-GPU training node, each
            category is organized around how teams actually buy AI hardware.
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-4 gap-4">
        {topLevel.map((c) => (
          <LocalizedClientLink
            key={c.id}
            href={`/categories/${c.handle}`}
            className="group block overflow-hidden rounded-md border border-ui-border-base bg-white transition-shadow hover:shadow-elevation-card-hover"
          >
            <div className="relative aspect-[1200/630] w-full overflow-hidden">
              <Image
                src={fallbackCategoryImage(c.handle)}
                alt={c.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-4 min-h-[128px]">
              <div className="flex items-start justify-between gap-3 mb-1">
                <Heading level="h3" className="text-base">
                  {c.name}
                </Heading>
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-grey-5 text-ui-fg-muted group-hover:bg-brand-50 group-hover:text-brand-700">
                  <ArrowRightMini />
                </span>
              </div>
              {c.description && (
                <Text className="text-small-regular text-ui-fg-subtle line-clamp-2">
                  {c.description}
                </Text>
              )}
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}

export default CategoryGrid
