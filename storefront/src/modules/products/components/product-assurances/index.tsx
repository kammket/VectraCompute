import { HttpTypes } from "@medusajs/types"
import { getProductProfile } from "@lib/util/product-profile"
import { Heading, Text } from "@modules/common/components/ui"

const ProductAssurances = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const profile = getProductProfile(product)
  const assurances = [...profile.validation, ...profile.summaryCards].slice(
    0,
    4
  )

  return (
    <section className="rounded-md border border-ui-border-base bg-white p-5 small:p-6">
      <div className="grid grid-cols-1 gap-5">
        <div>
          <Text className="text-small-semi uppercase text-brand-600 mb-2">
            Trust
          </Text>
          <Heading level="h2" className="text-xl mb-2">
            Backed by VectraCompute
          </Heading>
          <Text className="text-small-regular text-ui-fg-subtle leading-6">
            These trust signals are matched to this product&apos;s role, so
            buyers can see the relevant validation, compatibility, support, or
            deployment checks before committing budget.
          </Text>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {assurances.map(([title, body]) => (
            <div
              key={title}
              className="rounded-md border border-ui-border-base bg-grey-5 p-4"
            >
              <Heading level="h3" className="text-base mb-1">
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

export default ProductAssurances
