import { Metadata } from "next"
import {
  ArrowRightMini,
  CheckCircle,
  Server,
  ShieldCheck,
} from "@medusajs/icons"

import WorkloadConfigurator from "@modules/home/components/workload-configurator"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "AI Hardware Configurator | Find the Right Workstation or GPU Server",
  description:
    "Use the VectraCompute AI hardware configurator to choose between AI workstations, GPU servers, private RAG appliances, storage nodes, and networking upgrades.",
}

const BUYER_CHECKLIST = [
  {
    title: "Workload",
    body: "Tell us if you need fine-tuning, RAG, inference, computer vision, storage, rendering, or a cluster.",
  },
  {
    title: "Model and data size",
    body: "Model size, context length, dataset size, document volume, and checkpoint frequency change the right hardware choice.",
  },
  {
    title: "Deployment location",
    body: "A desk-side workstation, office appliance, rack server, or full cluster each has different power, cooling, noise, and support needs.",
  },
  {
    title: "Procurement path",
    body: "Business buyers often need SKU, warranty, lead time, quote, procurement reference, and support details before approval.",
  },
]

const DECISION_PATHS = [
  {
    title: "Start with a workstation",
    body: "Best for one developer, private iteration, notebooks, small fine-tunes, image generation, and local testing.",
    href: "/categories/ai-deep-learning-workstations",
    icon: ShieldCheck,
  },
  {
    title: "Move to a GPU server",
    body: "Best for shared training, production inference, high utilization, rack operations, and multi-user access.",
    href: "/categories/gpu-rack-servers",
    icon: Server,
  },
  {
    title: "Ask for review",
    body: "Best when power, rack, cooling, networking, model size, or procurement approval needs a second look.",
    href: "/contact",
    icon: CheckCircle,
  },
]

export default function ConfigurePage() {
  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <PremiumPageHeader
          eyebrow="AI hardware configurator"
          title="Find the right AI hardware before you buy"
          description="Use this guide to choose the practical starting point for your workload, then send the result to an engineer for quote review, power planning, software handoff, and procurement details."
          actions={[
            { label: "Start selector", href: "#selector" },
            { label: "Ask an engineer", href: "/contact" },
          ]}
          highlights={[
            "Workload-first recommendations",
            "Quote-ready buyer questions",
            "Links to matching products and guides",
          ]}
        />
      </div>

      <div id="selector">
        <WorkloadConfigurator />
      </div>

      <section className="content-container py-14">
        <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
          <div>
            <Text className="text-small-semi uppercase text-brand-600 mb-2">
              What buyers need to know
            </Text>
            <Heading level="h2" className="text-2xl mb-5">
              Bring these details before ordering or quote approval
            </Heading>
            <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
              {BUYER_CHECKLIST.map((item) => (
                <div
                  key={item.title}
                  className="rounded-md border border-ui-border-base bg-white p-5"
                >
                  <Heading level="h3" className="text-base mb-2">
                    {item.title}
                  </Heading>
                  <Text className="text-small-regular text-ui-fg-subtle leading-6">
                    {item.body}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-md border border-ui-border-base bg-white p-6 shadow-elevation-card-rest">
            <Heading level="h2" className="text-xl mb-4">
              Common decision paths
            </Heading>
            <div className="grid grid-cols-1 gap-3">
              {DECISION_PATHS.map((path) => {
                const Icon = path.icon

                return (
                  <LocalizedClientLink
                    key={path.href}
                    href={path.href}
                    className="group grid grid-cols-[36px_1fr_auto] gap-3 rounded-md border border-ui-border-base bg-grey-5 p-4 hover:bg-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-brand-600">
                      <Icon />
                    </span>
                    <span>
                      <span className="block text-small-semi text-ui-fg-base">
                        {path.title}
                      </span>
                      <span className="block text-small-regular text-ui-fg-subtle leading-5 mt-1">
                        {path.body}
                      </span>
                    </span>
                    <ArrowRightMini className="text-ui-fg-muted group-hover:text-brand-700" />
                  </LocalizedClientLink>
                )
              })}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
