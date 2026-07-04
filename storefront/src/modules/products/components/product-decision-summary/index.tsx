import { HttpTypes } from "@medusajs/types"
import { getProductProfile } from "@lib/util/product-profile"
import { Heading, Text } from "@modules/common/components/ui"

const getBestFor = (product: HttpTypes.StoreProduct) => {
  const metadata = product.metadata as
    | Record<string, unknown>
    | null
    | undefined
  const bestFor = metadata?.best_for

  if (typeof bestFor === "string" && bestFor.trim()) {
    return bestFor.trim()
  }

  return (
    product.categories?.[0]?.name ?? "AI training, inference, and data work"
  )
}

const ProductDecisionSummary = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const profile = getProductProfile(product)

  return (
    <section
      id="buyer-summary"
      className="rounded-md border border-slate-200 bg-white p-5 small:p-6 scroll-mt-28"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Text className="text-small-semi uppercase text-slate-700 mb-2">
            Buyer summary
          </Text>
          <Heading level="h2" className="text-xl mb-2">
            Best for {getBestFor(product)}
          </Heading>
          <Text className="text-small-regular text-ui-fg-subtle leading-6">
            Use this page to confirm the exact workload fit, technical
            requirements, validation checks, and support path for this product
            before ordering or quote approval.
          </Text>
        </div>
        <div className="grid grid-cols-1 medium:grid-cols-3 gap-4">
          {profile.summaryCards.map(([title, body]) => (
            <div
              key={title}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <Heading level="h3" className="text-base mb-2">
                {title}
              </Heading>
              <Text className="text-small-regular text-ui-fg-subtle leading-6">
                {body}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductDecisionSummary
