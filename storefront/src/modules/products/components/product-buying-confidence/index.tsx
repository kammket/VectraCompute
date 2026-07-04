import { HttpTypes } from "@medusajs/types"
import {
  getBuyerFaqItems,
  getMetadataList,
  getMetadataString,
} from "@lib/util/product-metadata"
import { getProductProfile } from "@lib/util/product-profile"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

const ProductBuyingConfidence = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const profile = getProductProfile(product)
  const rating = getMetadataString(product, "rating", "Engineering reviewed")
  const reviewCount = getMetadataString(
    product,
    "review_count",
    "configuration QA"
  )
  const leadTime = getMetadataString(
    product,
    "lead_time",
    "Ships in 3-7 business days"
  )
  const warranty = getMetadataString(
    product,
    "warranty",
    "Up to 5-year warranty"
  )
  const returns = getMetadataString(
    product,
    "returns",
    "30-day return review on eligible systems"
  )
  const install = getMetadataString(
    product,
    "install_support",
    "Remote setup and driver handoff available"
  )
  const certifications = getMetadataList(product, "certifications", [
    "Burn-in tested",
    "CUDA validated",
    "Ubuntu LTS ready",
    "Engineer supported",
  ])
  const faqs = getBuyerFaqItems(product, [
    "Can I request a custom configuration? Yes, use Request quote and include GPU, memory, storage, rack, power, or software requirements.",
    "Is this ready for AI workloads? Yes, systems are validated with NVIDIA drivers, CUDA, and common AI frameworks.",
    "Can I request a custom configuration? Yes, include GPU, memory, storage, rack, power, or software requirements for review.",
  ])

  return (
    <section
      id="purchase-confidence"
      className="rounded-md border border-emerald-100 bg-emerald-50 p-5 small:p-6 scroll-mt-28"
    >
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4 medium:grid-cols-[72px_minmax(0,1fr)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-emerald-700 text-xl font-semibold text-white">
            04
          </div>
          <div>
            <Text className="text-small-semi uppercase text-emerald-700 mb-2">
              Priority four: trust proof
            </Text>
            <Heading level="h2" className="text-xl mb-2">
              Confirm validation, support, and buyer confidence
            </Heading>
            <Text className="text-small-regular text-emerald-950/75 leading-6 mb-5">
              The details below are product-specific, so technical buyers can
              check deployment fit, risk, support, warranty, and operational
              readiness before they commit.
            </Text>
            <LocalizedClientLink
              href={`/contact?product=${encodeURIComponent(
                product.title
              )}&constraints=${encodeURIComponent(
                `Review quote for ${product.title}`
              )}`}
            >
              <Button variant="secondary" className="w-full small:w-auto">
                Request reviewed quote
              </Button>
            </LocalizedClientLink>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
            {[
              ["Buyer proof", `${rating} / ${reviewCount}`],
              ["Lead time", leadTime],
              ["Warranty", warranty],
              ["Returns", returns],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-md border border-emerald-100 bg-white p-4"
              >
                <Text className="text-small-regular text-ui-fg-muted mb-1">
                  {label}
                </Text>
                <Text className="text-base-semi">{value}</Text>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-md border border-emerald-100 bg-white p-5">
              <Heading level="h3" className="text-base mb-3">
                Buyer requirements to confirm
              </Heading>
              <ul className="grid grid-cols-1 gap-2 text-small-regular text-ui-fg-subtle mb-5">
                {profile.requirements.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Heading level="h3" className="text-base mb-3">
                Validation and support proof
              </Heading>
              <div className="flex flex-wrap gap-2 mb-5">
                {certifications.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs text-emerald-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 text-small-regular text-ui-fg-subtle">
                <p>{install}</p>
              </div>
            </div>

            <div className="rounded-md border border-emerald-100 bg-white p-5">
              <Heading level="h3" className="text-base mb-3">
                Buyer questions
              </Heading>
              <div className="grid grid-cols-1 gap-4">
                {faqs.map((faq) => {
                  const [question, ...answerParts] = faq.split("?")
                  const answer = answerParts.join("?").trim()

                  return (
                    <div key={faq}>
                      <Text className="text-base-semi">{question.trim()}?</Text>
                      {answer && (
                        <Text className="text-small-regular text-ui-fg-subtle leading-6 mt-1">
                          {answer}
                        </Text>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductBuyingConfidence
