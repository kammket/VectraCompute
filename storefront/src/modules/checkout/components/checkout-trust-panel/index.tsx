import TrustBar from "@modules/common/components/trust-bar"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

const CheckoutTrustPanel = () => {
  const process = [
    "Order appears in Admin",
    "Configuration and deployment fit are reviewed",
    "Payment, invoice, or PO is coordinated",
    "Parts/procurement and lead time are confirmed",
    "Assembly, burn-in, and validation are completed",
    "Shipping and remote handoff are coordinated",
  ]

  const confidence = [
    {
      title: "Engineer review before fulfillment",
      body: "If power, rack, software, or model fit looks risky, the team can confirm details before the system ships.",
    },
    {
      title: "Validation before shipment",
      body: "AI systems can be checked for GPU load, thermals, driver stack, storage health, and configuration notes.",
    },
    {
      title: "Quote and PO support",
      body: "Business buyers can use invoice, procurement, lead-time, warranty, and support details for internal approval.",
    },
    {
      title: "Deployment handoff",
      body: "For complex systems, use the order notes or RFQ path to request software, rack, network, or remote setup review.",
    },
  ]

  const helpLinks = [
    {
      title: "Compatibility checklist",
      body: "Confirm model fit, software stack, power, cooling, network, storage, warranty, and support before shipment.",
      href: "/resources/ai-hardware-compatibility-checklist",
    },
    {
      title: "What happens after ordering",
      body: "See how admin review, payment coordination, validation, burn-in, shipping, and deployment handoff work.",
      href: "/resources/what-happens-after-ordering-ai-hardware",
    },
    {
      title: "Shipping and warranty",
      body: "Review expectations for high-value AI hardware packaging, delivery planning, returns, warranty, and support.",
      href: "/resources/ai-hardware-shipping-returns-warranty",
    },
    {
      title: "CUDA, ROCm, OpenVINO",
      body: "Check whether your preferred AI framework and runtime fit the hardware before buying.",
      href: "/resources/cuda-vs-rocm-vs-openvino-ai-hardware",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-ui-border-base rounded-md bg-white p-6">
        <Heading level="h2" className="text-xl mb-3">
          Checkout built for premium AI hardware
        </Heading>
        <Text className="text-small-regular text-ui-fg-subtle leading-6 mb-5">
          Your order is not treated like a generic box shipment. It is routed to
          the admin team for technical review, payment handling, validation, and
          fulfillment tracking.
        </Text>
        <div className="grid grid-cols-1 gap-3 mb-6">
          {confidence.map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-ui-border-base bg-grey-5 p-4"
            >
              <Text className="text-base-semi">{item.title}</Text>
              <Text className="text-small-regular text-ui-fg-subtle leading-6 mt-1">
                {item.body}
              </Text>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-brand-200 bg-brand-50 p-4 mb-6">
          <Text className="text-base-semi text-brand-900 mb-2">
            Unsure about checkout?
          </Text>
          <Text className="text-small-regular leading-6 text-brand-900 mb-4">
            If you need compatibility review, a formal quote, or power/cooling
            confirmation, send the configuration to an engineer before buying.
          </Text>
          <LocalizedClientLink href="/contact?constraints=Checkout compatibility review requested">
            <Button className="w-full bg-brand-600 hover:bg-brand-700 border-none">
              Request reviewed quote instead
            </Button>
          </LocalizedClientLink>
        </div>
        <div className="mb-6 rounded-md border border-ui-border-base bg-white p-4">
          <Text className="text-base-semi mb-3">Need confidence first?</Text>
          <div className="grid grid-cols-1 gap-3">
            {helpLinks.map((link) => (
              <LocalizedClientLink
                key={link.href}
                href={link.href}
                className="rounded-md border border-ui-border-base bg-grey-5 p-3 hover:border-brand-300"
              >
                <Text className="text-small-semi text-ui-fg-base">
                  {link.title}
                </Text>
                <Text className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
                  {link.body}
                </Text>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
        <div className="border-t border-ui-border-base pt-5">
          <Text className="text-base-semi mb-3">
            What happens after checkout
          </Text>
          <div className="grid grid-cols-1 gap-2">
            {process.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-md bg-grey-5 px-3 py-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ui-bg-interactive text-ui-fg-on-color text-small-regular">
                  {index + 1}
                </span>
                <Text className="text-small-regular text-ui-fg-base">
                  {item}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TrustBar compact />
    </div>
  )
}

export default CheckoutTrustPanel
