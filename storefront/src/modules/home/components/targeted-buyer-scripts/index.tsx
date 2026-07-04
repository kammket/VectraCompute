import {
  ArrowRightMini,
  Server,
  ShieldCheck,
  SparklesMini,
} from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading, Text } from "@modules/common/components/ui"

const BUYER_SCRIPTS = [
  {
    audience: "ML engineers",
    title: "Validate the stack before it lands",
    script:
      "Confirm GPU memory, CUDA, driver branch, framework versions, NVMe scratch space, and thermal behavior before ordering.",
    href: "/resources/best-ai-workstation-for-llm-fine-tuning",
    cta: "LLM workstation guide",
  },
  {
    audience: "Procurement teams",
    title: "Approve with clear technical evidence",
    script:
      "Use SKUs, warranty terms, lead time, approval support, configuration notes, and validation details to move reviews faster.",
    href: "/resources/enterprise-ai-procurement",
    cta: "Procurement guide",
  },
  {
    audience: "IT and infrastructure",
    title: "Plan power, rack, network, and support",
    script:
      "Check rack depth, power draw, airflow, OS image, remote access, networking, and fulfillment notes before deployment.",
    href: "/resources/refurbished-gpu-servers-for-ai",
    cta: "Server guide",
  },
  {
    audience: "Founders and lab leads",
    title: "Control compute cost without guessing",
    script:
      "Compare workstations, refurbished GPU servers, financing, and quote-reviewed configurations before committing budget.",
    href: "/resources/ai-hardware-for-startups",
    cta: "Startup guide",
  },
]

const TargetedBuyerScripts = () => {
  return (
    <section className="bg-grey-5 border-y border-ui-border-base">
      <div className="content-container py-14">
        <div className="grid grid-cols-1 large:grid-cols-[340px_1fr] gap-8 items-start">
          <div>
            <Text className="text-small-semi uppercase text-brand-600 mb-2">
              Buyer proof scripts
            </Text>
            <Heading level="h2" className="text-2xl mb-3">
              The details every technical buyer asks for
            </Heading>
            <Text className="text-ui-fg-subtle leading-7">
              VectraCompute explains the purchase in the language each decision
              maker needs: engineering fit, procurement evidence, deployment
              readiness, and budget control.
            </Text>
          </div>
          <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
            {BUYER_SCRIPTS.map((item, index) => {
              const Icon =
                index === 0
                  ? ShieldCheck
                  : index === 1
                  ? SparklesMini
                  : index === 2
                  ? Server
                  : SparklesMini

              return (
                <LocalizedClientLink
                  key={item.audience}
                  href={item.href}
                  className="group block rounded-md border border-ui-border-base bg-white p-5 transition-shadow hover:shadow-elevation-card-hover"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                      <Icon />
                    </span>
                    <Text className="text-small-semi uppercase text-brand-600">
                      {item.audience}
                    </Text>
                  </div>
                  <Heading level="h3" className="text-lg mb-3">
                    {item.title}
                  </Heading>
                  <Text className="text-small-regular text-ui-fg-subtle leading-6 mb-4">
                    {item.script}
                  </Text>
                  <Text className="inline-flex items-center gap-1 text-small-semi text-ui-fg-interactive group-hover:text-ui-fg-interactive-hover">
                    {item.cta}
                    <ArrowRightMini />
                  </Text>
                </LocalizedClientLink>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TargetedBuyerScripts
