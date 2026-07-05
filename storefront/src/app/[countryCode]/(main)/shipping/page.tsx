import { Metadata } from "next"

import { getBreadcrumbJsonLd, JsonLd } from "@lib/util/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Worldwide Shipping & Delivery | Insured AI Hardware | VectraCompute",
  description:
    "VectraCompute ships AI workstations and GPU servers worldwide via DHL Express, FedEx, UPS, and dedicated freight — fully insured, tracked, and export-documented.",
}

const CARRIERS = [
  {
    name: "DHL Express",
    role: "Primary international express for workstations and components",
  },
  {
    name: "FedEx",
    role: "Express and priority freight across the Americas, Europe, and Asia-Pacific",
  },
  {
    name: "UPS",
    role: "Ground and express delivery, default for US and Canadian orders",
  },
  {
    name: "Dedicated air & ocean freight",
    role: "Palletized, crated transport for rack servers and multi-node orders",
  },
]

const REGIONS = [
  ["United States & Canada", "2–5 business days after dispatch"],
  ["Europe & United Kingdom", "3–7 business days after dispatch"],
  ["Asia-Pacific", "4–8 business days after dispatch"],
  ["Middle East & Africa", "5–10 business days after dispatch"],
  ["Latin America", "5–10 business days after dispatch"],
  ["Rack systems via freight (worldwide)", "1–3 weeks, scheduled with you"],
]

const STEPS = [
  {
    title: "Build & validation",
    body: "Your system is assembled and burn-in tested after order confirmation — most configurations are ready to dispatch in 3–7 business days. In-stock components and accessories dispatch within 1–2 business days.",
  },
  {
    title: "Insured dispatch",
    body: "Every shipment leaves fully insured for its replacement value — we carry the insurance cost, not you. Workstations ship in foam-fitted double-wall cartons; rack servers ship crated on pallets with shock indicators.",
  },
  {
    title: "Tracking from day one",
    body: "You receive the carrier tracking number by email as soon as the shipment is collected, and your order status page updates at every stage from build to delivery.",
  },
  {
    title: "Delivery & handoff",
    body: "Express parcels are delivered signature-required. Freight deliveries are scheduled with you in advance, with liftgate service available where a loading dock is not.",
  },
]

const FAQ = [
  {
    q: "Do you really ship worldwide?",
    a: "Yes. We ship to virtually every country served by DHL Express, FedEx, or UPS, and arrange dedicated air or ocean freight for rack-scale orders anywhere those networks don't reach. If you are unsure about your location, ask before ordering and we will confirm the route and timeline.",
  },
  {
    q: "Who pays for shipping insurance?",
    a: "We do. Every shipment is insured for full replacement value at our cost — it is part of the order, never an add-on. If a shipment arrives damaged, document it on the delivery receipt, photograph it, and contact us within 48 hours; we handle the claim and the replacement.",
  },
  {
    q: "What about customs and import duties?",
    a: "We prepare all export documentation and commercial invoices. Where import duties or taxes apply in your country, we confirm them with you before dispatch, so the total you approve is the total you pay — no surprise charges at the door.",
  },
  {
    q: "How are rack servers shipped?",
    a: "Rack systems and multi-node orders ship as crated, palletized freight with tilt and shock indicators, delivered on a scheduled date. For data-center deliveries we coordinate directly with your facility's receiving dock.",
  },
  {
    q: "Can I track my order before it ships?",
    a: "Yes — the order tracking page shows every stage (payment review, build and validation, shipped, delivered) using just your order number and checkout email, and the carrier tracking number is emailed at dispatch.",
  },
]

export default async function ShippingPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const jsonLd = [
    getBreadcrumbJsonLd(countryCode, [
      { name: "Home", path: "/" },
      { name: "Shipping & Delivery", path: "/shipping" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ].filter(Boolean) as Record<string, unknown>[]

  return (
    <div className="bg-grey-5">
      <JsonLd data={jsonLd} />
      <div className="content-container py-10 small:py-12">
        <PremiumPageHeader
          eyebrow="Shipping & delivery"
          title="Worldwide, insured, tracked — from our bench to your rack"
          description="We ship AI workstations, GPU servers, and components to virtually every country, through DHL Express, FedEx, UPS, and dedicated freight partners. Every shipment is fully insured at our cost and trackable from the moment it leaves validation."
          actions={[
            { label: "Track an order", href: "/order/status" },
            { label: "Ask about your destination", href: "/contact" },
          ]}
          highlights={[
            "Ships worldwide",
            "Insurance included — paid by us",
            "Signature-required delivery",
          ]}
        />

        {/* Carriers */}
        <section className="mt-10">
          <Heading level="h2" className="text-xl">
            Our carriers
          </Heading>
          <div className="mt-4 grid grid-cols-1 gap-4 small:grid-cols-2 large:grid-cols-4">
            {CARRIERS.map((carrier) => (
              <div
                key={carrier.name}
                className="rounded-md border border-ui-border-base bg-white p-5"
              >
                <Text className="text-base-semi text-ui-fg-base">
                  {carrier.name}
                </Text>
                <Text className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
                  {carrier.role}
                </Text>
              </div>
            ))}
          </div>
          <Text className="mt-3 text-xs leading-5 text-ui-fg-muted">
            Carrier selection is matched to your destination and order size; you
            can request a preferred carrier in the order notes.
          </Text>
        </section>

        {/* How it works */}
        <section className="mt-12">
          <Heading level="h2" className="text-xl">
            From order to delivery
          </Heading>
          <div className="mt-4 grid grid-cols-1 gap-4 small:grid-cols-2 large:grid-cols-4">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-md border border-ui-border-base bg-white p-5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-grey-90 text-small-semi text-white">
                  {index + 1}
                </span>
                <Text className="mt-3 text-base-semi text-ui-fg-base">
                  {step.title}
                </Text>
                <Text className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
                  {step.body}
                </Text>
              </div>
            ))}
          </div>
        </section>

        {/* Regional estimates */}
        <section className="mt-12">
          <Heading level="h2" className="text-xl">
            Typical delivery times
          </Heading>
          <div className="mt-4 overflow-x-auto rounded-md border border-ui-border-base bg-white">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ui-border-base bg-grey-5">
                  <th className="px-4 py-3 text-small-semi text-ui-fg-base">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-small-semi text-ui-fg-base">
                    Express delivery estimate
                  </th>
                </tr>
              </thead>
              <tbody>
                {REGIONS.map(([region, estimate]) => (
                  <tr key={region} className="border-b border-ui-border-base last:border-b-0">
                    <td className="px-4 py-3 text-small-regular text-ui-fg-base">
                      {region}
                    </td>
                    <td className="px-4 py-3 text-small-regular text-ui-fg-subtle">
                      {estimate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Text className="mt-3 text-xs leading-5 text-ui-fg-muted">
            Estimates count from dispatch, after build and validation. Your
            order confirmation states the build time for your configuration,
            and the tracking page shows both stages live.
          </Text>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <Heading level="h2" className="text-xl">
            Shipping questions
          </Heading>
          <div className="mt-4 grid grid-cols-1 gap-4 medium:grid-cols-2">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-md border border-ui-border-base bg-white p-5"
              >
                <Heading level="h3" className="text-base mb-2">
                  {item.q}
                </Heading>
                <Text className="text-small-regular leading-6 text-ui-fg-subtle">
                  {item.a}
                </Text>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-md bg-grey-90 px-6 py-6 small:py-10 text-white small:px-8">
          <div className="grid grid-cols-1 items-center gap-6 large:grid-cols-[1fr_auto]">
            <div>
              <Text className="mb-2 text-small-semi uppercase text-brand-200">
                Shipping to somewhere unusual?
              </Text>
              <Heading level="h2" className="mb-2 text-2xl text-white">
                Tell us the destination — we&apos;ll confirm route, timeline, and
                cost before you order.
              </Heading>
              <Text className="max-w-2xl text-grey-20">
                Data centers, universities, offshore facilities, APO/FPO — if a
                carrier or freight partner can reach it, we ship to it, insured.
              </Text>
            </div>
            <LocalizedClientLink
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-md bg-brand-600 px-5 text-small-semi text-white transition hover:bg-brand-700"
            >
              Confirm my destination
            </LocalizedClientLink>
          </div>
        </section>
      </div>
    </div>
  )
}
