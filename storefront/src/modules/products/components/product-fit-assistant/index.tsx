import { HttpTypes } from "@medusajs/types"

import { getMetadataList, getMetadataString } from "@lib/util/product-metadata"
import { getProductProfile } from "@lib/util/product-profile"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

const hasAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term))

const getSearchText = (product: HttpTypes.StoreProduct) =>
  [
    product.title,
    product.description,
    product.handle,
    product.categories?.map((category) => category.name).join(" "),
    product.metadata ? JSON.stringify(product.metadata) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

const getProductType = (product: HttpTypes.StoreProduct) => {
  const text = getSearchText(product)

  if (
    hasAny(text, [
      "cooling",
      "pdu",
      "power",
      "cdu",
      "fabric",
      "memory kit",
      "nvme",
      "component",
    ])
  ) {
    return "Infrastructure component"
  }

  if (
    hasAny(text, [
      "edge",
      "jetson",
      "hailo",
      "robotics",
      "camera",
      "video analytics",
    ])
  ) {
    return "Edge / vision AI"
  }

  if (hasAny(text, ["refurbished", "refurb"])) {
    return "Validated refurbished"
  }

  if (
    hasAny(text, [
      "rack",
      "server",
      "h100",
      "h200",
      "gb300",
      "b200",
      "mi350",
      "a100",
    ])
  ) {
    return "GPU rack server"
  }

  return "AI workstation"
}

const getReadiness = (product: HttpTypes.StoreProduct) => {
  const text = getSearchText(product)
  const powerDraw = getMetadataString(product, "power_draw")
  const rackUnits = getMetadataString(product, "rack_units")
  const networking = getMetadataString(product, "networking")
  const support = getMetadataString(product, "support_level")
  const condition = getMetadataString(product, "condition", "New")

  const items = [
    {
      label: "Ordering confidence",
      value: getMetadataString(
        product,
        "lead_time",
        "Lead time shown by configuration"
      ),
      status: "Ready",
    },
    {
      label: "Power / cooling",
      value:
        powerDraw ||
        (hasAny(text, ["rack", "server", "gb300", "h200", "b200"])
          ? "Review required before fulfillment"
          : "Office deployment review available"),
      status:
        powerDraw || hasAny(text, ["rack", "server", "gb300", "h200", "b200"])
          ? "Review"
          : "Ready",
    },
    {
      label: "Deployment location",
      value:
        rackUnits ||
        (hasAny(text, ["workstation", "desktop"])
          ? "Desk-side / office"
          : "Rack, lab, or edge site"),
      status: rackUnits ? "Rack-ready" : "Confirm",
    },
    {
      label: "Networking",
      value: networking || "Network requirement depends on workload",
      status: networking ? "Defined" : "Confirm",
    },
    {
      label: "Support path",
      value: support || "Engineer support available by quote",
      status: "Available",
    },
    {
      label: "Condition",
      value: condition,
      status: condition.toLowerCase().includes("refurb")
        ? "Condition note"
        : "New",
    },
  ]

  const score =
    68 +
    (powerDraw ? 7 : 0) +
    (networking ? 7 : 0) +
    (support ? 7 : 0) +
    (getMetadataString(product, "warranty") ? 6 : 0) +
    (getMetadataString(product, "buyer_faq") ? 5 : 0)

  return {
    score: Math.min(score, 96),
    items,
  }
}

const getNotFor = (product: HttpTypes.StoreProduct) => {
  const type = getProductType(product)
  const text = getSearchText(product)
  const metadataNotFor = getMetadataList(product, "not_for")

  if (metadataNotFor.length) {
    return metadataNotFor
  }

  if (type === "Infrastructure component") {
    return [
      "Not a complete AI compute system by itself",
      "Not recommended without compatibility review for chassis, power, firmware, or rack layout",
      "Not a substitute for deployment planning when power, cooling, or storage is the bottleneck",
    ]
  }

  if (type === "Edge / vision AI") {
    return [
      "Not ideal for full foundation-model training",
      "Not a replacement for a high-memory rack GPU server",
      "Not recommended before confirming camera count, sensors, model runtime, and remote access",
    ]
  }

  if (
    hasAny(text, ["mi300", "mi350", "rocm", "gaudi", "openvino", "arc pro"])
  ) {
    return [
      "Not ideal for CUDA-only software stacks without compatibility review",
      "Not recommended if your team requires NVIDIA-only tooling",
      "Not a safe purchase before checking framework, driver, and model support",
    ]
  }

  if (type === "Validated refurbished") {
    return [
      "Not for buyers who require factory-new hardware only",
      "Not recommended without reviewing condition, warranty, and validation notes",
      "Not ideal when allocation consistency across many identical units is mandatory",
    ]
  }

  if (type === "GPU rack server") {
    return [
      "Not ideal for a normal desk or quiet office",
      "Not recommended before confirming rack power, cooling, noise, and service access",
      "Not necessary if one local workstation can handle the workload",
    ]
  }

  return [
    "Not ideal for large shared production workloads with many concurrent users",
    "Not a substitute for a rack server when uptime, redundancy, and remote operations are required",
    "Not recommended for very large model training without confirming VRAM and storage needs",
  ]
}

const COMPATIBILITY_LINKS = [
  {
    label: "How much VRAM do I need?",
    href: "/resources/ai-hardware-buying-guide",
  },
  {
    label: "Compatibility checklist",
    href: "/resources/ai-hardware-compatibility-checklist",
  },
  {
    label: "CUDA vs ROCm vs OpenVINO",
    href: "/resources/cuda-vs-rocm-vs-openvino-ai-hardware",
  },
  {
    label: "Workstation vs GPU server",
    href: "/resources/ai-workstation-vs-gpu-server",
  },
  {
    label: "New vs refurbished AI hardware",
    href: "/resources/refurbished-gpu-servers-for-ai",
  },
  {
    label: "Power and rack planning",
    href: "/resources/ai-server-power-cooling-requirements",
  },
]

const ProductFitAssistant = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const profile = getProductProfile(product)
  const readiness = getReadiness(product)
  const notFor = getNotFor(product)
  const os = getMetadataString(
    product,
    "os_support",
    getSearchText(product).includes("rocm")
      ? "Linux with ROCm-compatible stack"
      : "Linux or Windows by configuration"
  )
  const software = getMetadataString(
    product,
    "software_stack",
    getSearchText(product).includes("openvino")
      ? "OpenVINO / oneAPI stack review"
      : getSearchText(product).includes("rocm")
      ? "ROCm, containers, inference stack review"
      : "CUDA, Docker, PyTorch, vLLM, or Triton handoff available"
  )
  const upgradePath = getMetadataString(
    product,
    "upgrade_path",
    "Memory, NVMe, networking, support, and deployment options can be reviewed before purchase"
  )

  return (
    <section
      id="fit-and-compatibility"
      className="rounded-md border border-blue-100 bg-blue-50 p-5 small:p-6 scroll-mt-28"
    >
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4 medium:grid-cols-[72px_minmax(0,1fr)_150px] medium:items-start">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-blue-700 text-xl font-semibold text-white">
            02
          </div>
          <div>
            <Text className="text-small-semi uppercase text-blue-700 mb-2">
              Priority two: compatibility
            </Text>
            <Heading level="h2" className="text-xl mb-2">
              Check the technical requirements before ordering
            </Heading>
            <Text className="text-small-regular text-ui-fg-subtle leading-6">
              Use this product-specific check to confirm workload fit,
              compatibility, deployment readiness, and reasons to ask for review
              before ordering.
            </Text>
          </div>
          <div className="rounded-md border border-blue-200 bg-white p-4">
            <Text className="text-small-semi text-blue-800">
              Readiness score
            </Text>
            <Text className="mt-1 text-2xl text-blue-700">
              {readiness.score}%
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 medium:grid-cols-3 gap-4">
          {[
            ["Product class", getProductType(product)],
            ["Best fit", profile.fit],
            ["Model fit", profile.modelFit],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-md border border-blue-100 bg-white p-4"
            >
              <Text className="text-small-regular text-ui-fg-muted mb-1">
                {label}
              </Text>
              <Text className="text-small-semi leading-6">{value}</Text>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 large:grid-cols-2 gap-5">
          <div className="rounded-md border border-blue-100 bg-white p-5">
            <Heading level="h3" className="text-base mb-4">
              Required compatibility answers
            </Heading>
            <div className="grid grid-cols-1 gap-3 text-small-regular">
              {[
                ["OS support", os],
                ["Software stack", software],
                [
                  "Power / cooling",
                  getMetadataString(
                    product,
                    "power_draw",
                    "Reviewed by product and deployment location"
                  ),
                ],
                [
                  "Network",
                  getMetadataString(
                    product,
                    "networking",
                    "10GbE, 25GbE, 100GbE, 400GbE, or 800GbE reviewed by workload"
                  ),
                ],
                ["Upgrade path", upgradePath],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-blue-100 bg-blue-50 p-3"
                >
                  <Text className="text-small-semi">{label}</Text>
                  <Text className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
                    {value}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-blue-100 bg-white p-5">
            <Heading level="h3" className="text-base mb-4">
              Questions to answer first
            </Heading>
            <ul className="grid grid-cols-1 gap-2 text-small-regular text-ui-fg-subtle">
              {[
                ...profile.requirements.slice(0, 4),
                "Confirm warranty, lead time, support level, and installation handoff",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_320px] gap-5">
          <div className="rounded-md border border-blue-100 bg-white p-5">
            <Heading level="h3" className="text-base mb-4">
              Deployment readiness
            </Heading>
            <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
              {readiness.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-blue-100 bg-blue-50 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Text className="text-small-semi">{item.label}</Text>
                    <span className="rounded-md bg-white px-2 py-1 text-[11px] font-medium uppercase text-blue-700">
                      {item.status}
                    </span>
                  </div>
                  <Text className="mt-2 text-small-regular leading-6 text-ui-fg-subtle">
                    {item.value}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
            <Heading level="h3" className="text-base mb-4">
              Not ideal for
            </Heading>
            <ul className="grid grid-cols-1 gap-2 text-small-regular text-ui-fg-subtle">
              {notFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ui-fg-muted" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-md border border-blue-200 bg-white p-5">
          <div className="flex flex-col gap-4 medium:flex-row medium:items-center medium:justify-between">
            <div>
              <Heading level="h3" className="text-base mb-1">
                Still unsure?
              </Heading>
              <Text className="text-small-regular leading-6 text-brand-900">
                Ask compatibility before ordering. Send model size, users, data,
                power, cooling, and deployment details for engineer review.
              </Text>
            </div>
            <LocalizedClientLink
              href={`/contact?product=${encodeURIComponent(
                product.title
              )}&constraints=${encodeURIComponent(
                `Compatibility review for ${product.title}`
              )}`}
            >
                <Button className="w-full bg-blue-700 hover:bg-blue-800 border-none medium:w-auto">
                Ask compatibility question
              </Button>
            </LocalizedClientLink>
          </div>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 gap-3">
          {COMPATIBILITY_LINKS.map((link) => (
            <LocalizedClientLink
              key={link.href}
              href={link.href}
              className="rounded-md border border-blue-100 bg-white p-3 text-small-semi text-ui-fg-base hover:border-blue-300 hover:text-blue-700"
            >
              {link.label}
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductFitAssistant
