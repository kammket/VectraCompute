import { Metadata } from "next"
import { CheckCircle, Server, ShieldCheck, SparklesMini } from "@medusajs/icons"

import ComplianceMarks from "@modules/common/components/compliance-marks"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "About VectraCompute | AI Workstations & GPU Servers",
  description:
    "VectraCompute builds and tests AI workstations and GPU rack servers in-house, with every system stress-tested before it ships.",
}

export default function AboutPage() {
  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <PremiumPageHeader
          eyebrow="About VectraCompute"
          title="AI hardware built, tested, and supported for serious workloads"
          description="VectraCompute builds workstations and rack servers for buyers who need reliable local AI compute, from a single researcher fine-tuning models to teams expanding multi-node GPU infrastructure."
          actions={[
            { label: "Ask an engineer", href: "/contact" },
            { label: "Shop GPU servers", href: "/categories/gpu-rack-servers" },
          ]}
          highlights={[
            "24-hour burn-in validation",
            "CUDA and framework readiness",
            "Procurement-ready support",
          ]}
        />
        <div className="mt-8 grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
          <article className="rounded-md border border-ui-border-base bg-white p-6 small:p-8 text-base-regular leading-7">
            <Text>
              We configure every system around the workload first — VRAM
              headroom, memory bandwidth, and interconnect — rather than selling
              whichever GPU happens to be in stock. Every VectraForge
              workstation and VectraRack server is built to order, then run
              through a full burn-in cycle under sustained CUDA load before it
              leaves our facility.
            </Text>
            <Heading level="h2" className="text-xl mt-4">
              What we test before shipping
            </Heading>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>24-hour stress test under full GPU and CPU load</li>
              <li>Thermal validation across all configured GPUs</li>
              <li>Driver and CUDA toolkit version verification</li>
              <li>Storage and memory diagnostics on every drive and DIMM</li>
            </ul>
            <Heading level="h2" className="text-xl mt-4">
              Support
            </Heading>
            <Text>
              Every system ships with phone and email access to engineers who
              can help with driver issues, multi-GPU configuration, and cluster
              networking — not just a ticket queue. If you're not sure which
              configuration fits your workload, our team will help you size it
              before you buy.
            </Text>
            <div className="flex flex-wrap gap-4 pt-2 text-small-regular">
              <LocalizedClientLink
                href="/resources/warranty-support"
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Warranty and support
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/resources/enterprise-ai-procurement"
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Procurement guide
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/contact"
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Ask an engineer
              </LocalizedClientLink>
            </div>
          </article>
          <aside className="rounded-md border border-ui-border-base bg-white p-6 shadow-elevation-card-rest">
            <Heading level="h2" className="text-xl mb-4">
              Why buyers trust the shop
            </Heading>
            <div className="grid grid-cols-1 gap-4">
              {[
                [
                  "Built to order",
                  "Systems are configured around workload fit, not leftover stock.",
                ],
                [
                  "Burn-in tested",
                  "CPU, GPU, memory, storage, and thermals are checked before shipping.",
                ],
                [
                  "Engineer support",
                  "Customers can get help with CUDA, drivers, frameworks, and deployment.",
                ],
                [
                  "Procurement ready",
                  "Quotes, SKUs, warranty notes, and financing conversations are supported.",
                ],
              ].map(([title, body], index) => {
                const Icon =
                  index === 0
                    ? SparklesMini
                    : index === 1
                    ? ShieldCheck
                    : index === 2
                    ? Server
                    : CheckCircle

                return (
                  <div
                    key={title}
                    className="grid grid-cols-[36px_1fr] gap-3 rounded-md border border-ui-border-base bg-grey-5 p-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-brand-600">
                      <Icon />
                    </span>
                    <div>
                      <Heading level="h3" className="text-base mb-1">
                        {title}
                      </Heading>
                      <Text className="text-small-regular text-ui-fg-subtle leading-6">
                        {body}
                      </Text>
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>
        </div>

        <ComplianceMarks />
      </div>
    </div>
  )
}
