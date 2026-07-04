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
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

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
      <section className="border-b border-grey-80 bg-grey-90 text-white">
        <div className="content-container py-5">
          <div className="grid grid-cols-1 gap-3 medium:grid-cols-4">
            {[
              ["Validated", "Burn-in and compatibility checks"],
              ["Supported", "Engineer-led configuration guidance"],
              ["Transparent", "Specs, condition, warranty, and lead time"],
              ["Reviewed", "Admin-confirmed fulfillment workflow"],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-md border border-white/15 bg-white/10 px-4 py-3"
              >
                <p className="text-small-semi text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-grey-20">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-container py-8 small:py-10">
        <div
          className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_430px] gap-8 large:gap-10 relative"
          data-testid="product-container"
        >
          <div className="w-full min-w-0 large:sticky large:top-24 large:self-start">
            <ImageGallery images={images} productTitle={product.title} />
          </div>
          <aside className="flex flex-col large:sticky large:top-24 large:self-start gap-y-5 rounded-md border border-grey-80 bg-white p-5 shadow-elevation-card-rest small:p-6">
            <ProductInfo product={product} />
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
            <ProductTabs product={product} />
          </aside>
        </div>
      </section>

      <div className="content-container pb-16 small:pb-20">
        <div className="flex flex-col gap-8">
          <ProductQuickAnswers product={product} />

          <section className="overflow-hidden rounded-md border border-grey-80 bg-white shadow-elevation-card-rest">
            <div className="border-b border-grey-80 bg-grey-90 p-5 text-white small:p-6">
              <div className="grid grid-cols-1 gap-5 large:grid-cols-[minmax(0,1fr)_360px] large:items-end">
                <div>
                  <p className="text-small-semi uppercase tracking-wide text-brand-200">
                    Technical decision hub
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Review fit, compatibility, specifications, and trust in the
                    right order.
                  </h2>
                  <p className="mt-3 max-w-3xl text-small-regular leading-6 text-grey-20">
                    This section is arranged for serious AI hardware buyers:
                    first confirm whether the product fits the workload, then
                    validate deployment requirements, compare configurations,
                    and review support before ordering.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-small-semi">
                  {[
                    ["01", "Fit"],
                    ["02", "Compatibility"],
                    ["03", "Specs"],
                    ["04", "Trust"],
                  ].map(([number, label]) => (
                    <a
                      key={number}
                      href={
                        number === "01"
                          ? "#buyer-summary"
                          : number === "02"
                          ? "#fit-and-compatibility"
                          : number === "03"
                          ? "#technical-details"
                          : "#purchase-confidence"
                      }
                      className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-white hover:bg-white/15"
                    >
                      <span className="mr-2 text-brand-200">{number}</span>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-0 large:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="border-b border-ui-border-base bg-grey-5 p-5 large:sticky large:top-24 large:self-start large:border-b-0 large:border-r small:p-6">
                <p className="text-small-semi uppercase text-brand-700">
                  Review steps
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  {[
                    [
                      "01",
                      "Workload fit",
                      "Confirm this is the right class of hardware.",
                      "#buyer-summary",
                    ],
                    [
                      "02",
                      "Compatibility",
                      "Check power, cooling, software, network, and limits.",
                      "#fit-and-compatibility",
                    ],
                    [
                      "03",
                      "Configuration",
                      "Compare SKU, price, components, and technical specs.",
                      "#technical-details",
                    ],
                    [
                      "04",
                      "Trust proof",
                      "Review warranty, validation, support, and handoff.",
                      "#purchase-confidence",
                    ],
                  ].map(([number, title, body, href]) => (
                    <a
                      key={number}
                      href={href}
                      className="group grid grid-cols-[34px_1fr] gap-3 rounded-md border border-ui-border-base bg-white p-3 hover:border-brand-300"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-grey-90 text-small-semi text-white group-hover:bg-brand-600">
                        {number}
                      </span>
                      <span>
                        <span className="block text-small-semi text-ui-fg-base">
                          {title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-ui-fg-subtle">
                          {body}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </aside>

              <div className="p-5 small:p-6">
                <div className="grid grid-cols-1 gap-8">
                  <ProductDecisionSummary product={product} />
                  <ProductFitAssistant product={product} />
                  <div className="grid grid-cols-1 gap-8">
                    <AiBuyerGuide product={product} />
                    <ProductSpecs product={product} />
                  </div>
                  <div className="grid grid-cols-1 gap-8 large:grid-cols-[minmax(0,1fr)_360px] large:items-start">
                    <ProductBuyingConfidence product={product} />
                    <div className="flex flex-col gap-8">
                      <ManagedSpecs product={product} />
                      <ProductAssurances product={product} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <section className="bg-slate-950 text-white">
        <div className="content-container grid grid-cols-1 gap-5 py-10 medium:grid-cols-[minmax(0,1fr)_260px] medium:items-center">
          <div>
            <p className="text-small-semi uppercase text-cyan-300">
              Need certainty before ordering?
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Ask for an engineer review of this exact configuration.
            </h2>
            <p className="mt-3 max-w-3xl text-small-regular leading-6 text-slate-300">
              Share your model size, users, data volume, rack or office limits,
              software stack, power, cooling, and timeline. We will help confirm
              whether this product is the right fit before you commit.
            </p>
          </div>
          <a
            href={`/${countryCode}/contact?product=${encodeURIComponent(
              product.title
            )}`}
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-small-semi text-slate-950 transition hover:bg-cyan-100"
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
