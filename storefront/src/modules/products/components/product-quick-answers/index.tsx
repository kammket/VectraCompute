import { HttpTypes } from "@medusajs/types"

import { getBuyerFaqItems, getMetadataString } from "@lib/util/product-metadata"
import { getProductProfile } from "@lib/util/product-profile"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

const answerFallback = (value: string, fallback: string) =>
  value && value.trim() ? value : fallback

const ProductQuickAnswers = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const profile = getProductProfile(product)
  const category = product.categories?.[0]?.name ?? "AI hardware"
  const leadTime = answerFallback(
    getMetadataString(product, "lead_time"),
    "Lead time depends on selected configuration"
  )
  const warranty = answerFallback(
    getMetadataString(product, "warranty"),
    "Warranty configured by product and quote"
  )
  const support = answerFallback(
    getMetadataString(product, "support_level"),
    "Engineer support available before and after purchase"
  )
  const power = answerFallback(
    getMetadataString(product, "power_draw"),
    "Power and cooling reviewed by configuration"
  )
  const software = answerFallback(
    getMetadataString(product, "software_stack"),
    "CUDA, ROCm, OpenVINO, Docker, or framework fit reviewed when relevant"
  )
  const networking = answerFallback(
    getMetadataString(product, "networking"),
    "Networking selected around users, storage, and deployment plan"
  )
  const faqs = getBuyerFaqItems(product).slice(0, 3)

  const answers = [
    {
      title: "Best fit",
      body: profile.fit,
      href: "#fit-and-compatibility",
    },
    {
      title: "Model and workload fit",
      body: profile.modelFit,
      href: "#buyer-summary",
    },
    {
      title: "Lead time",
      body: leadTime,
      href: "#purchase-confidence",
    },
    {
      title: "Warranty and support",
      body: `${warranty}. ${support}.`,
      href: "#purchase-confidence",
    },
    {
      title: "Power and deployment",
      body: power,
      href: "#fit-and-compatibility",
    },
    {
      title: "Software stack",
      body: software,
      href: "#fit-and-compatibility",
    },
    {
      title: "Networking",
      body: networking,
      href: "#deployment-details",
    },
    {
      title: "Product class",
      body: category,
      href: "#technical-details",
    },
  ]

  return (
    <section className="rounded-md border border-blue-100 bg-blue-50 p-5 small:p-6">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_280px] gap-6">
          <div>
            <Text className="text-small-semi uppercase text-blue-700 mb-2">
              Quick answers
            </Text>
            <Heading level="h2" className="text-xl mb-2">
              The information buyers usually need before ordering
            </Heading>
            <Text className="text-small-regular text-blue-950/70 leading-6">
              Start here for a plain-language summary. The detailed sections
              below keep every specification, validation note, configuration,
              and buying detail available for deeper review.
            </Text>
          </div>
          <div className="rounded-md border border-blue-200 bg-white p-4">
            <Text className="text-base-semi text-blue-950 mb-2">
              Still unsure?
            </Text>
            <Text className="text-small-regular text-blue-950/70 leading-6 mb-4">
              Send this exact product for review with your model, users, power,
              cooling, storage, and timeline.
            </Text>
            <LocalizedClientLink
              href={`/contact?product=${encodeURIComponent(
                product.title
              )}&constraints=${encodeURIComponent(
                `Pre-purchase review for ${product.title}`
              )}`}
            >
              <Button className="w-full bg-blue-700 hover:bg-blue-800 border-none">
                Request review
              </Button>
            </LocalizedClientLink>
          </div>
        </div>

        <div className="grid grid-cols-1 medium:grid-cols-2 large:grid-cols-4 gap-3">
          {answers.map((answer) => (
            <a
              key={answer.title}
              href={answer.href}
              className="rounded-md border border-blue-100 bg-white p-4 hover:border-blue-300"
            >
              <Text className="text-small-semi text-ui-fg-base mb-1">
                {answer.title}
              </Text>
              <Text className="text-small-regular text-ui-fg-subtle leading-6">
                {answer.body}
              </Text>
            </a>
          ))}
        </div>

        {faqs.length > 0 && (
          <div className="rounded-md border border-blue-100 bg-white p-5">
            <Heading level="h3" className="text-base mb-3">
              Common buyer questions answered on this page
            </Heading>
            <div className="grid grid-cols-1 medium:grid-cols-3 gap-3">
              {faqs.map((faq) => {
                const [question, ...answerParts] = faq.split("?")
                const answer = answerParts.join("?").trim()

                return (
                  <div
                    key={faq}
                    className="rounded-md border border-blue-100 bg-blue-50 p-4"
                  >
                    <Text className="text-small-semi">{question.trim()}?</Text>
                    {answer && (
                      <Text className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
                        {answer}
                      </Text>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductQuickAnswers
