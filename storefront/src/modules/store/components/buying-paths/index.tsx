import {
  Bolt,
  CircleStack,
  CogSixTooth,
  RocketLaunch,
  ServerStack,
  Sparkles,
} from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const BUYING_PATHS = [
  {
    title: "Memory and dataset growth",
    body: "DDR5 ECC, NVMe dataset kits, checkpoint storage, and high-memory RAG upgrades for teams hitting capacity limits.",
    href: "/store?infrastructure=memory-storage",
    icon: CircleStack,
    signals: ["1TB-2TB ECC", "120TB NVMe", "RAG and vector DB"],
  },
  {
    title: "Power and cooling readiness",
    body: "Rack PDU, CDU, direct-to-chip cooling, and facility planning for dense H200, B200, and GB300-class infrastructure.",
    href: "/store?infrastructure=power-cooling",
    icon: Bolt,
    signals: ["30-60kW racks", "CDU planning", "Liquid cooling"],
  },
  {
    title: "Edge AI and robotics",
    body: "Jetson Thor-class kits, Hailo NPU gateways, camera AI, and low-power inference systems for physical AI at the edge.",
    href: "/store?infrastructure=edge-robotics",
    icon: CogSixTooth,
    signals: ["Jetson Thor", "Hailo NPU", "Video analytics"],
  },
  {
    title: "Production inference",
    body: "H200 NVL-class inference, private LLM appliances, monitoring, and serving stacks for reliable AI endpoints.",
    href: "/store?infrastructure=inference-ops",
    icon: ServerStack,
    signals: ["vLLM / Triton", "Monitoring", "Private AI APIs"],
  },
  {
    title: "Next-gen AI racks",
    body: "Quote-ready GB300 NVL72, B200, and Rubin-era planning for buyers preparing enterprise AI factory infrastructure.",
    href: "/store?infrastructure=next-gen-rack",
    icon: RocketLaunch,
    signals: ["GB300 NVL72", "800GbE fabric", "Facility review"],
  },
  {
    title: "Validated refurbished",
    body: "Refurbished A100, H100, H200, and L40S systems with condition notes, burn-in testing, and warranty paths.",
    href: "/store?condition=refurbished",
    icon: Sparkles,
    signals: ["Burn-in tested", "Warranty options", "Budget control"],
  },
]

const StoreBuyingPaths = () => {
  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col gap-2 small:flex-row small:items-end small:justify-between">
        <div>
          <p className="text-small-semi uppercase text-brand-700">
            Shop by buying need
          </p>
          <h2 className="mt-1 text-xl-semi text-ui-fg-base">
            Find the right AI hardware path faster
          </h2>
        </div>
        <p className="max-w-xl text-small-regular leading-6 text-ui-fg-subtle">
          These paths organize the new high-demand products around how serious
          buyers actually plan AI infrastructure: compute, memory, cooling,
          power, edge deployment, and operations.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 small:grid-cols-2 large:grid-cols-3">
        {BUYING_PATHS.map((path) => {
          const Icon = path.icon

          return (
            <LocalizedClientLink
              key={path.title}
              href={path.href}
              className="group rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-elevation-card-hover"
            >
              <div className="flex min-h-[176px] flex-col">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span className="flex size-10 items-center justify-center rounded-md border border-brand-200 bg-brand-50 text-brand-700">
                    <Icon />
                  </span>
                  <span className="text-small-semi text-brand-700 group-hover:text-brand-800">
                    View products
                  </span>
                </div>
                <h3 className="text-base-semi text-ui-fg-base">{path.title}</h3>
                <p className="mt-2 flex-1 text-small-regular leading-6 text-ui-fg-subtle">
                  {path.body}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {path.signals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-md border border-ui-border-base bg-grey-5 px-2.5 py-1 text-xsmall-regular text-ui-fg-subtle"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
  )
}

export default StoreBuyingPaths
