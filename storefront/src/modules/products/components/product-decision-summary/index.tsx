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
      className="rounded-md border border-slate-200 bg-white p-5 scroll-mt-28 small:p-6"
    >
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4 medium:grid-cols-[72px_minmax(0,1fr)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-grey-90 text-xl font-semibold text-white">
            01
          </div>
          <div>
            <Text className="text-small-semi uppercase text-slate-700 mb-2">
              Priority one: workload fit
            </Text>
            <Heading level="h2" className="text-xl mb-2">
              Best for {getBestFor(product)}
            </Heading>
            <Text className="text-small-regular text-ui-fg-subtle leading-6">
              Start here before looking at configuration details. This summary
              explains whether the product is the right class of hardware for
              your model, users, deployment environment, and buying risk.
            </Text>
          </div>
        </div>
        <div className="grid grid-cols-1 medium:grid-cols-3 gap-4">
          {profile.summaryCards.map(([title, body], index) => (
            <div
              key={title}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-small-semi text-slate-700">
                  {index + 1}
                </span>
                <Heading level="h3" className="text-base">
                  {title}
                </Heading>
              </div>
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
