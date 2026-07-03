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
    <>
      <ProductBreadcrumbs product={product} />
      <div
        className="content-container grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_420px] gap-10 py-8 small:py-10 relative"
        data-testid="product-container"
      >
        <div className="w-full min-w-0 large:sticky large:top-24 large:self-start">
          <ImageGallery images={images} productTitle={product.title} />
        </div>
        <aside className="flex flex-col large:sticky large:top-24 large:self-start gap-y-6 rounded-md border border-ui-border-base bg-white p-5 small:p-6 shadow-elevation-card-rest">
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
      <div className="content-container pb-16">
        <div className="flex flex-col gap-8">
          <ProductQuickAnswers product={product} />

          <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
            <div className="flex flex-col gap-8">
              <div>
                <div className="mb-4">
                  <p className="text-small-semi uppercase text-brand-600">
                    Step 1
                  </p>
                  <h2 className="text-2xl font-semibold text-ui-fg-base">
                    Decide if this product fits your workload
                  </h2>
                </div>
                <ProductDecisionSummary product={product} />
              </div>

              <div>
                <div className="mb-4">
                  <p className="text-small-semi uppercase text-brand-600">
                    Step 2
                  </p>
                  <h2 className="text-2xl font-semibold text-ui-fg-base">
                    Check compatibility before checkout
                  </h2>
                </div>
                <ProductFitAssistant product={product} />
              </div>

              <div>
                <div className="mb-4">
                  <p className="text-small-semi uppercase text-brand-600">
                    Step 3
                  </p>
                  <h2 className="text-2xl font-semibold text-ui-fg-base">
                    Review technical detail and configurations
                  </h2>
                </div>
                <div className="flex flex-col gap-8">
                  <AiBuyerGuide product={product} />
                  <ProductSpecs product={product} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 large:sticky large:top-24">
              <ProductBuyingConfidence product={product} />
              <ManagedSpecs product={product} />
              <ProductAssurances product={product} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="content-container border-t border-ui-border-base py-16 small:py-20"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
