import { Metadata } from "next"
import {
  ArrowRightMini,
  CheckCircle,
  Server,
  ShieldCheck,
} from "@medusajs/icons"

import { SEO_PAGES } from "@lib/data/seo-pages"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "AI Hardware Buying Guides & Technical Resources | VectraCompute",
  description:
    "SEO-rich buying guides, compatibility checklists, procurement guidance, warranty information, and technical resources for AI workstations, refurbished GPU servers, and AI hardware.",
}

const BUYER_PATHS = [
  {
    label: "I need a workstation for LLMs",
    href: "/resources/best-ai-workstation-for-llm-fine-tuning",
  },
  {
    label: "I need to know VRAM requirements",
    href: "/resources/how-much-vram-for-local-ai",
  },
  {
    label: "I need refurbished GPU servers",
    href: "/resources/refurbished-gpu-servers-for-ai",
  },
  {
    label: "I need private RAG hardware",
    href: "/resources/hardware-for-private-rag-document-ai",
  },
  {
    label: "I need power and cooling guidance",
    href: "/resources/ai-server-power-cooling-requirements",
  },
  {
    label: "I need compatibility checked",
    href: "/resources/ai-hardware-compatibility-checklist",
  },
  {
    label: "I need to compare AI software stacks",
    href: "/resources/cuda-vs-rocm-vs-openvino-ai-hardware",
  },
  {
    label: "I need to know what happens after ordering",
    href: "/resources/what-happens-after-ordering-ai-hardware",
  },
]

const CONFIDENCE_PATHS = [
  {
    title: "Check compatibility before ordering",
    body: "Use a practical checklist for model fit, software stack, power, cooling, network, storage, warranty, and support.",
    href: "/resources/ai-hardware-compatibility-checklist",
  },
  {
    title: "Compare CUDA, ROCm, and OpenVINO",
    body: "Understand how your preferred framework and runtime affect the right GPU or accelerator choice.",
    href: "/resources/cuda-vs-rocm-vs-openvino-ai-hardware",
  },
  {
    title: "Understand the order process",
    body: "See how admin review, quote handling, validation, burn-in, shipping, and deployment handoff work.",
    href: "/resources/what-happens-after-ordering-ai-hardware",
  },
  {
    title: "Review shipping and warranty",
    body: "Learn what buyers should expect for high-value AI hardware packaging, returns, support, and warranty.",
    href: "/resources/ai-hardware-shipping-returns-warranty",
  },
]

export default function ResourcesPage() {
  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <PremiumPageHeader
          eyebrow="Resource center"
          title="AI hardware buying guides for serious compute decisions"
          description="Practical guides for choosing, buying, deploying, and supporting AI workstations and GPU servers, with internal links to product categories, procurement pages, and engineering quote support."
          actions={[
            {
              label: "Shop AI workstations",
              href: "/categories/ai-deep-learning-workstations",
            },
            { label: "Request a quote", href: "/contact" },
          ]}
          highlights={[
            "Workload and budget guidance",
            "Procurement and warranty content",
            "Internal links to products and categories",
            "Trust and validation information",
          ]}
        />
        <section className="mb-10">
          <div className="flex flex-col medium:flex-row medium:items-end medium:justify-between gap-4 mb-5 mt-10">
            <div>
              <Text className="text-small-semi uppercase text-brand-600 mb-2">
                Start by buyer intent
              </Text>
              <Heading level="h2" className="text-2xl">
                Find the guide that matches your purchase
              </Heading>
            </div>
            <Text className="text-small-regular text-ui-fg-subtle max-w-xl">
              Each guide links back to relevant products, categories, quote
              paths, and support information so buyers can move from research to
              action.
            </Text>
          </div>
          <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-4 gap-3">
            {BUYER_PATHS.map((path, index) => {
              const Icon =
                index === 0 ? ShieldCheck : index === 1 ? Server : CheckCircle

              return (
                <LocalizedClientLink
                  key={path.href}
                  href={path.href}
                  className="group grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-md border border-ui-border-base bg-white p-4 text-small-semi text-ui-fg-base hover:shadow-elevation-card-hover transition-shadow"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                    <Icon />
                  </span>
                  <span>{path.label}</span>
                  <ArrowRightMini className="text-ui-fg-muted group-hover:text-brand-700" />
                </LocalizedClientLink>
              )
            })}
          </div>
        </section>

        <section className="mb-10 rounded-md border border-ui-border-base bg-white p-6 small:p-8">
          <div className="mb-5 max-w-3xl">
            <Text className="text-small-semi uppercase text-brand-600 mb-2">
              Confidence before ordering
            </Text>
            <Heading level="h2" className="text-2xl mb-3">
              Clear answers before customers spend serious budget
            </Heading>
            <Text className="text-base-regular text-ui-fg-subtle leading-7">
              These pages are arranged around the questions cautious AI hardware
              buyers ask before they purchase: will it run my stack, what will
              happen after ordering, and what support or warranty backs the
              system?
            </Text>
          </div>
          <div className="grid grid-cols-1 medium:grid-cols-2 large:grid-cols-4 gap-4">
            {CONFIDENCE_PATHS.map((path, index) => {
              const Icon =
                index === 0 ? ShieldCheck : index === 1 ? Server : CheckCircle

              return (
                <LocalizedClientLink
                  key={path.href}
                  href={path.href}
                  className="group flex h-full flex-col rounded-md border border-ui-border-base bg-grey-5 p-5 hover:bg-white hover:shadow-elevation-card-hover"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-white text-brand-700">
                    <Icon />
                  </span>
                  <Heading level="h3" className="text-lg mb-2">
                    {path.title}
                  </Heading>
                  <Text className="text-small-regular text-ui-fg-subtle leading-6">
                    {path.body}
                  </Text>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1 text-small-semi text-ui-fg-interactive group-hover:text-brand-700">
                    Read guide
                    <ArrowRightMini />
                  </span>
                </LocalizedClientLink>
              )
            })}
          </div>
        </section>

        <div className="mb-5">
          <Text className="text-small-semi uppercase text-brand-600 mb-2">
            All resource pages
          </Text>
          <Heading level="h2" className="text-2xl">
            SEO guides, product education, and procurement help
          </Heading>
        </div>
        <div className="grid grid-cols-1 medium:grid-cols-2 large:grid-cols-3 gap-5">
          {SEO_PAGES.map((page, index) => {
            const Icon =
              index % 3 === 0
                ? ShieldCheck
                : index % 3 === 1
                ? Server
                : CheckCircle

            return (
              <LocalizedClientLink
                key={page.slug}
                href={`/resources/${page.slug}`}
                className="block h-full border border-ui-border-base rounded-md bg-white p-6 hover:shadow-elevation-card-hover transition-shadow"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                  <Icon />
                </span>
                <Heading level="h2" className="text-xl mb-2">
                  {page.title}
                </Heading>
                <Text className="text-small-regular text-ui-fg-subtle leading-6">
                  {page.description}
                </Text>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
