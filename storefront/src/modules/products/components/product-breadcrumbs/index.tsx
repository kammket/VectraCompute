import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  product: HttpTypes.StoreProduct
}

const ProductBreadcrumbs = ({ product }: Props) => {
  const category = product.categories?.[0]

  return (
    <nav aria-label="Breadcrumb" className="content-container pt-4">
      <ol className="flex flex-wrap items-center gap-x-2 text-small-regular text-ui-fg-subtle">
        <li>
          <LocalizedClientLink href="/" className="hover:text-ui-fg-base">
            Home
          </LocalizedClientLink>
        </li>
        <li aria-hidden>/</li>
        <li>
          <LocalizedClientLink href="/store" className="hover:text-ui-fg-base">
            Store
          </LocalizedClientLink>
        </li>
        {category && (
          <>
            <li aria-hidden>/</li>
            <li>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="hover:text-ui-fg-base"
              >
                {category.name}
              </LocalizedClientLink>
            </li>
          </>
        )}
        <li aria-hidden>/</li>
        <li className="text-ui-fg-base" aria-current="page">
          {product.title}
        </li>
      </ol>
    </nav>
  )
}

export default ProductBreadcrumbs
