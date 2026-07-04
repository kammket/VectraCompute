import { HttpTypes } from "@medusajs/types"

import { getProductPrice } from "@lib/util/get-product-price"
import { Heading, Text } from "@modules/common/components/ui"

type Props = {
  product: HttpTypes.StoreProduct
}

// Variant titles encode the configuration, e.g.
//   "RTX 4090 24GB / 64GB RAM / 1TB NVMe"
//   "8x H200 141GB / 1TB RAM / 100GbE"
// We split on " / " to present each configuration's specs as chips, alongside its
// SKU and price. This gives the page substantive, crawlable spec content.
const ProductSpecs = ({ product }: Props) => {
  const variants = product.variants ?? []

  if (!variants.length) {
    return null
  }

  const configTitle =
    product.options?.[0]?.title?.toLowerCase() ?? "configuration"
  const isSystem = ["configuration", "config"].includes(configTitle)

  return (
    <section
      id="technical-details"
      className="rounded-md border border-blue-100 bg-white p-5 small:p-6 scroll-mt-28"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Text className="text-small-semi uppercase text-blue-700 mb-2">
            Configure
          </Text>
          <Heading level="h2" className="text-xl mb-2">
            {isSystem ? "Available configurations" : "Available options"}
          </Heading>
          <Text className="text-ui-fg-subtle text-small-regular leading-6">
            {isSystem
              ? "Every configuration is built to order and stress-tested before it ships. Select your configuration in the product panel to add it to cart."
              : "Choose the option that fits your build."}
          </Text>
        </div>

        <div className="overflow-x-auto rounded-md border border-blue-100 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-blue-100 bg-blue-50 text-small-regular text-blue-900">
                <th className="py-3 pl-4 pr-4 font-medium">
                  {isSystem ? "Configuration" : "Option"}
                </th>
                <th className="py-3 pr-4 font-medium hidden small:table-cell">
                  SKU
                </th>
                <th className="py-3 pr-4 font-medium text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => {
                const { variantPrice } = getProductPrice({
                  product,
                  variantId: variant.id,
                })
                const segments = (variant.title ?? "")
                  .split("/")
                  .map((s) => s.trim())
                  .filter(Boolean)

                return (
                  <tr
                    key={variant.id}
                    className="border-b border-blue-100 align-top"
                  >
                    <td className="py-4 pl-4 pr-4">
                      {segments.length > 1 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {segments.map((seg) => (
                            <span
                              key={seg}
                              className="px-2 py-1 rounded-md bg-blue-50 text-blue-800 text-xs"
                            >
                              {seg}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <Text className="text-base-regular">
                          {variant.title}
                        </Text>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-small-regular text-ui-fg-subtle hidden small:table-cell">
                      {variant.sku ?? "—"}
                    </td>
                    <td className="py-4 pr-4 text-right text-base-semi whitespace-nowrap">
                      {variantPrice?.calculated_price ?? "—"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ProductSpecs
