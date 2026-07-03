import { HttpTypes } from "@medusajs/types"

import { getProductProfile } from "@lib/util/product-profile"
import { getProductSeo } from "@lib/util/product-seo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

type Props = {
  product: HttpTypes.StoreProduct
}

const AiBuyerGuide = ({ product }: Props) => {
  const profile = getProductProfile(product)
  const seo = getProductSeo(product)

  return (
    <section className="rounded-md border border-ui-border-base bg-white p-5 small:p-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Text className="text-small-semi uppercase text-brand-600 mb-2">
            AI hardware fit
          </Text>
          <Heading level="h2" className="text-xl mb-3">
            {profile.fit}
          </Heading>
          <Text className="text-ui-fg-subtle max-w-3xl mb-6 leading-7">
            {profile.modelFit}
          </Text>
          <div className="mb-6 rounded-md border border-brand-200 bg-brand-50 p-4">
            <Text className="text-base-semi mb-1">Why buyers trust it</Text>
            <Text className="text-small-regular text-ui-fg-subtle leading-6">
              {seo.trustNote}
            </Text>
          </div>

          <div className="grid grid-cols-1 medium:grid-cols-3 gap-4">
            <div className="rounded-md border border-ui-border-base bg-grey-5 p-4">
              <Heading level="h3" className="text-base mb-3">
                Best for
              </Heading>
              <ul className="flex flex-col gap-2 text-small-regular text-ui-fg-subtle">
                {profile.workloads.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-ui-border-base bg-grey-5 p-4">
              <Heading level="h3" className="text-base mb-3">
                Platform notes
              </Heading>
              <ul className="flex flex-col gap-2 text-small-regular text-ui-fg-subtle">
                {profile.platform.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-ui-border-base bg-grey-5 p-4">
              <Heading level="h3" className="text-base mb-3">
                Delivery planning
              </Heading>
              <ul className="flex flex-col gap-2 text-small-regular text-ui-fg-subtle">
                {profile.operations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="border border-ui-border-base rounded-md bg-grey-5 p-5">
          <Heading level="h3" className="text-base mb-4">
            Validation checklist
          </Heading>
          <div className="flex flex-col gap-4 mb-6">
            {profile.validation.map(([name, detail]) => (
              <div key={name}>
                <Text className="text-base-semi">{name}</Text>
                <Text className="text-small-regular text-ui-fg-subtle">
                  {detail}
                </Text>
              </div>
            ))}
          </div>
          <LocalizedClientLink href="/contact">
            <Button
              variant="primary"
              className="bg-brand-600 hover:bg-brand-700 border-none w-full"
            >
              Request sizing help
            </Button>
          </LocalizedClientLink>
        </aside>
      </div>
    </section>
  )
}

export default AiBuyerGuide
