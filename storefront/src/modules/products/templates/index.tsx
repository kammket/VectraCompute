import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductAssurances from "@modules/products/components/product-assurances"
import ProductBreadcrumbs from "@modules/products/components/product-breadcrumbs"
import AiBuyerGuide from "@modules/products/components/ai-buyer-guide"
import ProductBuyingConfidence from "@modules/products/components/product-buying-confidence"
import ProductDecisionSummary from "@modules/products/components/product-decision-summary"
import ProductFitAssistant from "@modules/products/components/product-fit-assistant"
import ProductQuickAnswers from "@modules/products/components/product-quick-answers"
import ManagedSpecs from "@modules/products/components/managed-specs"
import ProductSpecs from "@modules/products/components/product-specs"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { getMetadataString } from "@lib/util/product-metadata"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

// One consistent shell for every content section: same eyebrow/title scale,
// same spacing, same card treatment. Premium reads as "everything aligned and
// predictable", not "every section styled differently".
const Section = ({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
}) => (
  <section id={id} className="scroll-mt-24 border-t border-ui-border-base py-8 small:py-12">
    <div className="mb-8 max-w-3xl">
      <p className="text-small-semi uppercase tracking-wide text-brand-700">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold text-ui-fg-base">{title}</h2>
      {description && (
        <p className="mt-2 text-small-regular leading-6 text-ui-fg-subtle">
          {description}
        </p>
      )}
    </div>
    {children}
  </section>
)

const SECTION_NAV = [
  ["overview", "Overview"],
  ["fit", "Fit & compatibility"],
  ["specs", "Configurations & specs"],
  ["faq", "Questions"],
  ["assurance", "Warranty & support"],
] as const

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="bg-grey-5">
      <ProductBreadcrumbs product={product} />

      {/* Buy area: gallery + purchase panel */}
      <section className="content-container py-6 small:py-8">
        <div
          className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_430px] gap-8 large:gap-10 relative"
          data-testid="product-container"
        >
          <div className="w-full min-w-0 large:sticky large:top-24 large:self-start">
            <ImageGallery images={images} productTitle={product.title} />
          </div>
          <aside className="flex flex-col large:sticky large:top-24 large:self-start gap-y-5 rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest small:p-6">
            <div className="flex flex-col gap-y-2">
              <ProductInfo product={product} />
            </div>
            <ProductOnboardingCta />
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
            <div className="grid grid-cols-1 gap-2 rounded-md border border-ui-border-base bg-grey-5 p-3 text-small-regular text-ui-fg-subtle">
              {[
                getMetadataString(
                  product,
                  "lead_time",
                  "Built to order — most configurations ship in 3-7 business days"
                ),
                "Burn-in tested with warranty and lifetime technical support",
                "Track every stage on the order status page after purchase",
              ].map((line) => (
                <p key={line} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600"
                  />
                  {line}
                </p>
              ))}
            </div>
            <ProductTabs product={product} />
          </aside>
        </div>
      </section>

      {/* Sticky in-page nav keeps long technical content organised */}
      <nav
        aria-label="Product sections"
        className="sticky top-16 z-30 border-y border-ui-border-base bg-white/95 backdrop-blur"
      >
        {/* Right-edge fade signals more items off-screen on touch widths */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent large:hidden"
        />
        <div className="content-container flex items-center gap-1 overflow-x-auto py-2 text-small-semi text-ui-fg-subtle">
          {SECTION_NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-md px-3 py-2.5 transition-colors hover:bg-grey-5 hover:text-ui-fg-base large:py-1.5"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="content-container">
        <Section
          id="overview"
          eyebrow="Overview"
          title="What this system is built for"
        >
          <ProductDecisionSummary product={product} />
        </Section>

        <Section
          id="fit"
          eyebrow="Fit & compatibility"
          title="Confirm it matches your workload and environment"
          description="Model sizes, users, power, cooling, and software stack — checked before you buy, not after delivery."
        >
          <div className="grid grid-cols-1 gap-8">
            <ProductFitAssistant product={product} />
            <AiBuyerGuide product={product} />
          </div>
        </Section>

        <Section
          id="specs"
          eyebrow="Configurations & specifications"
          title="Every configuration, SKU, and price — nothing hidden"
        >
          <div className="grid grid-cols-1 gap-8">
            <ProductSpecs product={product} />
            <ManagedSpecs product={product} />
          </div>
        </Section>

        <Section
          id="faq"
          eyebrow="Common questions"
          title="Answers before you need to ask"
        >
          <ProductQuickAnswers product={product} />
        </Section>

        <Section
          id="assurance"
          eyebrow="Warranty & support"
          title="What stands behind this purchase"
        >
          <div className="grid grid-cols-1 gap-8 large:grid-cols-[minmax(0,1fr)_360px] large:items-start">
            <ProductBuyingConfidence product={product} />
            <ProductAssurances product={product} />
          </div>
        </Section>
      </div>

      {/* Human escalation CTA */}
      <section className="border-t border-ui-border-base bg-grey-90 text-white">
        <div className="content-container grid grid-cols-1 gap-5 py-6 small:py-10 medium:grid-cols-[minmax(0,1fr)_260px] medium:items-center">
          <div>
            <p className="text-small-semi uppercase text-brand-200">
              Need certainty before ordering?
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Ask for an engineer review of this exact configuration.
            </h2>
            <p className="mt-3 max-w-3xl text-small-regular leading-6 text-grey-20">
              Share your model size, users, data volume, rack or office limits,
              software stack, power, cooling, and timeline. We will confirm
              whether this product is the right fit before you commit.
            </p>
          </div>
          <a
            href={`/${countryCode}/contact?product=${encodeURIComponent(
              product.title
            )}`}
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-600 px-5 text-small-semi text-white transition hover:bg-brand-700"
          >
            Request engineer review
          </a>
        </div>
      </section>

      <div
        className="content-container border-t border-ui-border-base py-16 small:py-20"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
