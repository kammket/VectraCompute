import { Metadata } from "next"
import {
  ArrowRightMini,
  CheckCircle,
  Server,
  ShieldCheck,
} from "@medusajs/icons"

import { getBreadcrumbJsonLd, JsonLd } from "@lib/util/json-ld"
import ComplianceMarks from "@modules/common/components/compliance-marks"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"

type Props = {
  params: Promise<{ countryCode: string }>
}

export const metadata: Metadata = {
  title: "Trust Center | VectraCompute AI Hardware Validation & Support",
  description:
    "Learn how VectraCompute builds buyer trust with AI hardware validation, compatibility review, warranty terms, refurbished grading, clear order review, procurement support, and engineer-led guidance.",
}

const TRUST_AREAS = [
  {
    title: "Product validation",
    body: "Product pages expose workload fit, validation checks, buyer requirements, support level, lead time, warranty, and configuration options so buyers can understand what they are purchasing.",
    icon: ShieldCheck,
  },
  {
    title: "Refurbished grading",
    body: "Refurbished GPU servers should be sold with clear condition notes, GPU memory checks, firmware review, storage health, rack readiness, and warranty expectations.",
    icon: Server,
  },
  {
    title: "Clear order review",
    body: "The order path keeps high-value hardware requests simple while reinforcing shipping, warranty, validation, and support expectations before the buyer submits an order.",
    icon: CheckCircle,
  },
  {
    title: "Engineer support",
    body: "Buyers can request configuration review for CUDA, ROCm, vLLM, RAG, networking, storage, power, cooling, and procurement approval before purchase.",
    icon: CheckCircle,
  },
]

const REPORTS = [
  "GPU burn-in and thermal validation summary",
  "Storage health and NVMe throughput check",
  "Firmware, BIOS, BMC, NIC, and driver review",
  "Rack power, cooling, rail, and network checklist",
  "Refurbished condition and warranty notes",
  "Software handoff for CUDA, ROCm, Docker, vLLM, RAG, or monitoring",
]

const BUYER_LINKS = [
  {
    label: "Compatibility checklist",
    href: "/resources/ai-hardware-compatibility-checklist",
    body: "Confirm model, software, power, cooling, networking, warranty, and support fit.",
  },
  {
    label: "AI hardware configurator",
    href: "/configure",
    body: "Answer workload questions and get a practical system direction.",
  },
  {
    label: "What happens after ordering",
    href: "/resources/what-happens-after-ordering-ai-hardware",
    body: "Understand admin review, validation, fulfillment, and deployment handoff.",
  },
  {
    label: "Shipping, returns, and warranty",
    href: "/resources/ai-hardware-shipping-returns-warranty",
    body: "Review high-value AI hardware shipping, support, returns, and warranty expectations.",
  },
  {
    label: "Warranty and support guide",
    href: "/resources/warranty-support",
    body: "See burn-in validation, warranty coverage, and engineer-led support signals.",
  },
  {
    label: "Refurbished server guide",
    href: "/resources/refurbished-gpu-servers-for-ai",
    body: "Learn what condition, validation, and warranty details matter for refurbished GPU servers.",
  },
]

const CONFIDENCE_STEPS = [
  {
    step: "1",
    title: "Check workload fit",
    body: "Start with model size, users, framework, dataset, storage, and deployment location. Product pages and the configurator should tell buyers whether a workstation, rack server, edge system, or component is the right class of hardware.",
    links: [
      { label: "Use configurator", href: "/configure" },
      {
        label: "Compatibility checklist",
        href: "/resources/ai-hardware-compatibility-checklist",
      },
    ],
  },
  {
    step: "2",
    title: "Confirm technical compatibility",
    body: "Before ordering, buyers should know whether the system fits CUDA, ROCm, OpenVINO, PyTorch, vLLM, Triton, Docker, operating system, networking, power, cooling, and upgrade requirements.",
    links: [
      {
        label: "CUDA vs ROCm vs OpenVINO",
        href: "/resources/cuda-vs-rocm-vs-openvino-ai-hardware",
      },
      {
        label: "Power and cooling guide",
        href: "/resources/ai-server-power-cooling-requirements",
      },
    ],
  },
  {
    step: "3",
    title: "Review proof and terms",
    body: "A trustworthy AI hardware shop should make warranty, condition, lead time, validation notes, support level, photos, category, product description, and procurement details easy to find.",
    links: [
      { label: "Warranty and support", href: "/resources/warranty-support" },
      {
        label: "Enterprise procurement",
        href: "/resources/enterprise-ai-procurement",
      },
    ],
  },
  {
    step: "4",
    title: "Understand order handling",
    body: "After ordering, the request should move through admin review, parts confirmation, assembly, burn-in, shipping, and deployment handoff instead of disappearing into a generic order queue.",
    links: [
      {
        label: "After-order process",
        href: "/resources/what-happens-after-ordering-ai-hardware",
      },
      { label: "Request quote review", href: "/contact" },
    ],
  },
]

const CONFIDENCE_FAQ = [
  {
    question:
      "How does VectraCompute help buyers choose the right AI hardware?",
    answer:
      "The site combines workload-focused product pages, a configurator, compatibility resources, quote review, and engineer support so buyers can confirm model fit, software stack, power, cooling, storage, networking, warranty, and lead time before purchase.",
  },
  {
    question: "What trust signals should AI hardware buyers look for?",
    answer:
      "Buyers should look for product-specific specifications, real configuration options, validation notes, condition details, warranty terms, support level, lead time, procurement information, order review, and a clear way to ask technical questions.",
  },
  {
    question:
      "Can business buyers request a quote before ordering directly?",
    answer:
      "Yes. Buyers can request quote review for compatibility, procurement approval, deployment requirements, warranty expectations, support level, and lead-time confirmation.",
  },
]

export default async function TrustPage(props: Props) {
  const params = await props.params
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Trust Center | VectraCompute",
      description: metadata.description,
      about: [
        "AI hardware validation",
        "AI workstation compatibility",
        "GPU server warranty",
        "refurbished GPU server grading",
        "AI hardware procurement",
      ],
    },
    getBreadcrumbJsonLd(params.countryCode, [
      { name: "Home", path: "/" },
      { name: "Trust Center", path: "/trust" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: CONFIDENCE_FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ]

  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <JsonLd data={jsonLd} />
        <PremiumPageHeader
          eyebrow="Trust center"
          title="Buy AI hardware with clear proof, fit, and support"
          description="This trust center organizes the questions serious AI buyers ask before purchase: will the hardware fit my workload, will the software stack run, what is validated, what happens after ordering, and who helps if deployment gets technical?"
          actions={[
            { label: "Use configurator", href: "/configure" },
            { label: "Request quote review", href: "/contact" },
          ]}
          highlights={[
            "Product-specific fit guidance",
            "Compatibility and validation proof",
            "Clear post-order process",
          ]}
        />

        <section className="mt-10 grid grid-cols-1 medium:grid-cols-2 large:grid-cols-4 gap-4">
          {TRUST_AREAS.map((area) => {
            const Icon = area.icon

            return (
              <div
                key={area.title}
                className="rounded-md border border-ui-border-base bg-white p-5"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                  <Icon />
                </span>
                <Heading level="h2" className="text-lg mb-2">
                  {area.title}
                </Heading>
                <Text className="text-small-regular text-ui-fg-subtle leading-6">
                  {area.body}
                </Text>
              </div>
            )
          })}
        </section>

        <section className="mt-8 rounded-md border border-ui-border-base bg-white p-6 small:p-8">
          <div className="mb-6 max-w-3xl">
            <Text className="text-small-semi uppercase text-brand-600 mb-2">
              Simple buyer path
            </Text>
            <Heading level="h2" className="text-2xl mb-3">
              Four checks before buying AI hardware
            </Heading>
            <Text className="text-base-regular text-ui-fg-subtle leading-7">
              The confidence layer is arranged in the same order buyers usually
              think: fit first, compatibility second, proof third, fulfillment
              last. This keeps the site easy to understand while giving search
              engines focused internal links around buyer intent.
            </Text>
          </div>
          <div className="grid grid-cols-1 large:grid-cols-4 gap-4">
            {CONFIDENCE_STEPS.map((item) => (
              <article
                key={item.title}
                className="flex h-full flex-col rounded-md border border-ui-border-base bg-grey-5 p-5"
              >
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-ui-fg-base text-small-semi text-white">
                  {item.step}
                </span>
                <Heading level="h3" className="text-lg mb-2">
                  {item.title}
                </Heading>
                <Text className="text-small-regular text-ui-fg-subtle leading-6">
                  {item.body}
                </Text>
                <div className="mt-auto pt-5 flex flex-col gap-2">
                  {item.links.map((link) => (
                    <LocalizedClientLink
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center justify-between rounded-md border border-ui-border-base bg-white px-3 py-2 text-small-semi text-ui-fg-base hover:border-brand-300 hover:text-brand-700"
                    >
                      {link.label}
                      <ArrowRightMini />
                    </LocalizedClientLink>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
          <article className="rounded-md border border-ui-border-base bg-white p-6 small:p-8">
            <Text className="text-small-semi uppercase text-brand-600 mb-2">
              What makes the shop trustworthy
            </Text>
            <Heading level="h2" className="text-2xl mb-4">
              Buyers should see proof before they commit budget
            </Heading>
            <Text className="text-base-regular text-ui-fg-subtle leading-7 mb-6">
              VectraCompute product pages are designed to answer the questions
              technical buyers usually ask: what workload it fits, what it is
              not ideal for, what must be confirmed before purchase, what was
              validated, what support is included, and how procurement can
              approve the order.
            </Text>
            <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
              {REPORTS.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-ui-border-base bg-grey-5 p-4 text-small-semi"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>

          <aside className="rounded-md border border-ui-border-base bg-white p-6 shadow-elevation-card-rest">
            <Heading level="h2" className="text-xl mb-3">
              Buyer confidence links
            </Heading>
            <Text className="text-small-regular text-ui-fg-subtle leading-6 mb-5">
              Use these pages when you want a clear answer before ordering. They
              are arranged by the questions buyers usually ask first.
            </Text>
            <div className="grid grid-cols-1 gap-3">
              {BUYER_LINKS.map((link) => (
                <LocalizedClientLink
                  key={link.href}
                  href={link.href}
                  className="group rounded-md border border-ui-border-base bg-grey-5 p-4 hover:bg-white"
                >
                  <span className="flex items-center justify-between gap-3 text-small-semi text-ui-fg-base">
                    {link.label}
                    <ArrowRightMini className="text-ui-fg-muted group-hover:text-brand-700" />
                  </span>
                  <Text className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
                    {link.body}
                  </Text>
                </LocalizedClientLink>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-8 rounded-md border border-ui-border-base bg-white p-6 small:p-8">
          <Text className="text-small-semi uppercase text-brand-600 mb-2">
            Buyer questions
          </Text>
          <Heading level="h2" className="text-2xl mb-5">
            Answers that reduce purchase risk
          </Heading>
          <div className="grid grid-cols-1 medium:grid-cols-3 gap-4">
            {CONFIDENCE_FAQ.map((item) => (
              <div
                key={item.question}
                className="rounded-md border border-ui-border-base bg-grey-5 p-5"
              >
                <Heading level="h3" className="text-base mb-2">
                  {item.question}
                </Heading>
                <Text className="text-small-regular text-ui-fg-subtle leading-6">
                  {item.answer}
                </Text>
              </div>
            ))}
          </div>
        </section>

        <ComplianceMarks />
      </div>
    </div>
  )
}
