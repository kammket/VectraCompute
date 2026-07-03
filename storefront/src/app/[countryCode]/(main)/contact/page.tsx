import { Metadata } from "next"
import { CheckCircle, Server, ShieldCheck } from "@medusajs/icons"

import ContactForm from "@modules/contact/components/contact-form"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Contact / Ask an Expert | VectraCompute",
  description:
    "Talk to a VectraCompute engineer about sizing a workstation or rack server for your workload, or get help with an existing order.",
}

export default function ContactPage() {
  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <PremiumPageHeader
          eyebrow="Expert sizing"
          title="Talk to an engineer before you buy"
          description="Tell us what you are trying to run and we will help size the right workstation, GPU server, refurbished system, or networking upgrade before money is spent."
          highlights={[
            "Workload-first configuration review",
            "Quote-ready procurement details",
            "Support for existing orders",
          ]}
        />
        <div className="mt-8 grid grid-cols-1 large:grid-cols-[360px_minmax(0,1fr)] gap-8 items-start">
          <aside className="rounded-md border border-ui-border-base bg-white p-6 shadow-elevation-card-rest">
            <Heading level="h2" className="text-xl mb-5">
              What to include
            </Heading>
            <div className="grid grid-cols-1 gap-4">
              {[
                [ShieldCheck, "Target model or workload"],
                [Server, "Preferred GPU, memory, rack, or desk-side format"],
                [CheckCircle, "Budget, timeline, and procurement needs"],
              ].map(([Icon, label]) => (
                <div
                  key={label as string}
                  className="grid grid-cols-[36px_1fr] gap-3 rounded-md border border-ui-border-base bg-grey-5 p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-brand-600">
                    <Icon />
                  </span>
                  <Text className="text-small-semi text-ui-fg-base">
                    {label as string}
                  </Text>
                </div>
              ))}
            </div>
            <Text className="text-small-regular text-ui-fg-subtle leading-6 mt-5">
              Already have an order? Include your order number and we will route
              it to support directly.
            </Text>
            <div className="mt-5 grid grid-cols-1 gap-2 border-t border-ui-border-base pt-5 text-small-semi">
              <LocalizedClientLink
                href="/configure"
                className="rounded-md border border-ui-border-base bg-grey-5 px-3 py-2 hover:bg-white"
              >
                Use the AI hardware configurator first
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/trust"
                className="rounded-md border border-ui-border-base bg-grey-5 px-3 py-2 hover:bg-white"
              >
                Review trust and validation process
              </LocalizedClientLink>
            </div>
          </aside>
          <div className="rounded-md border border-ui-border-base bg-white p-5 small:p-6 shadow-elevation-card-rest">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
