import { HttpTypes } from "@medusajs/types"

import { getBaseURL } from "@lib/util/env"
import {
  getBuyerFaqItems,
  getMetadataList,
  getMetadataString,
} from "@lib/util/product-metadata"
import { getProductPrice } from "@lib/util/get-product-price"
import { getProductSeo } from "@lib/util/product-seo"

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
)

export const getOrganizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VectraCompute",
  url: getBaseURL(),
  description:
    "VectraCompute builds, validates, and supports premium AI workstations, refurbished GPU servers, and related AI hardware.",
  knowsAbout: [
    "AI workstations",
    "refurbished GPU servers",
    "NVIDIA GPU workstations",
    "CUDA validation",
    "LLM fine-tuning hardware",
    "deep learning servers",
    "enterprise AI infrastructure",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales and technical support",
    url: `${getBaseURL()}/us/contact`,
  },
})

export const getWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VectraCompute",
  url: getBaseURL(),
  potentialAction: {
    "@type": "SearchAction",
    target: `${getBaseURL()}/us/store?query={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
})

export const getBreadcrumbJsonLd = (
  countryCode: string,
  items: { name: string; path: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${getBaseURL()}/${countryCode}${item.path}`,
  })),
})

export const getProductJsonLd = (
  product: HttpTypes.StoreProduct,
  countryCode: string,
  // Real, moderated review data only. Rating markup that isn't backed by
  // on-page reviews is a structured-data violation, so catalog metadata is
  // deliberately NOT used here.
  reviewSummary?: { average: number; count: number }
) => {
  const seo = getProductSeo(product)
  const { cheapestPrice } = getProductPrice({ product })
  const condition = getMetadataString(product, "condition")
  const certifications = getMetadataList(product, "certifications")
  const bestFor = getMetadataList(product, "best_for")
  const warranty = getMetadataString(product, "warranty")
  const supportLevel = getMetadataString(product, "support_level")
  const leadTime = getMetadataString(product, "lead_time")
  const powerDraw = getMetadataString(product, "power_draw")
  const gpuMemory = getMetadataString(product, "gpu_memory")
  const networking = getMetadataString(product, "networking")
  const rackUnits = getMetadataString(product, "rack_units")
  const financing = getMetadataString(product, "financing")
  const installSupport = getMetadataString(product, "install_support")
  const isRefurbished =
    condition?.toLowerCase().includes("refurb") ||
    product.title.toLowerCase().includes("refurb")
  const productUrl = `${getBaseURL()}/${countryCode}/products/${product.handle}`
  const priceValidUntil = new Date()
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1)

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: seo.description,
    sku: product.variants?.[0]?.sku ?? undefined,
    mpn: product.variants?.[0]?.sku ?? product.handle,
    model: product.title,
    url: productUrl,
    category: product.categories?.[0]?.name,
    brand: {
      "@type": "Brand",
      name: "VectraCompute",
      url: getBaseURL(),
    },
    image: product.thumbnail
      ? product.thumbnail.startsWith("http")
        ? product.thumbnail
        : `${getBaseURL()}${product.thumbnail}`
      : undefined,
    additionalProperty: [
      ...bestFor.map((value) => ({
        "@type": "PropertyValue",
        name: "Best for",
        value,
      })),
      ...certifications.map((value) => ({
        "@type": "PropertyValue",
        name: "Validation",
        value,
      })),
      warranty
        ? {
            "@type": "PropertyValue",
            name: "Warranty",
            value: warranty,
          }
        : undefined,
      supportLevel
        ? {
            "@type": "PropertyValue",
            name: "Support",
            value: supportLevel,
          }
        : undefined,
      leadTime
        ? {
            "@type": "PropertyValue",
            name: "Lead time",
            value: leadTime,
          }
        : undefined,
      gpuMemory
        ? {
            "@type": "PropertyValue",
            name: "GPU memory",
            value: gpuMemory,
          }
        : undefined,
      powerDraw
        ? {
            "@type": "PropertyValue",
            name: "Power draw",
            value: powerDraw,
          }
        : undefined,
      networking
        ? {
            "@type": "PropertyValue",
            name: "Networking",
            value: networking,
          }
        : undefined,
      rackUnits
        ? {
            "@type": "PropertyValue",
            name: "Rack units",
            value: rackUnits,
          }
        : undefined,
      financing
        ? {
            "@type": "PropertyValue",
            name: "Financing",
            value: financing,
          }
        : undefined,
      installSupport
        ? {
            "@type": "PropertyValue",
            name: "Installation support",
            value: installSupport,
          }
        : undefined,
    ].filter(Boolean),
    aggregateRating:
      reviewSummary && reviewSummary.count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: reviewSummary.average.toFixed(1),
            reviewCount: reviewSummary.count,
          }
        : undefined,
    offers: cheapestPrice
      ? {
          "@type": "Offer",
          priceCurrency: cheapestPrice.currency_code.toUpperCase(),
          price: cheapestPrice.calculated_price_number,
          priceValidUntil: priceValidUntil.toISOString().slice(0, 10),
          availability: "https://schema.org/InStock",
          itemCondition: isRefurbished
            ? "https://schema.org/RefurbishedCondition"
            : "https://schema.org/NewCondition",
          url: productUrl,
          seller: {
            "@type": "Organization",
            name: "VectraCompute",
            url: getBaseURL(),
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "US",
            returnPolicyCategory:
              "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 30,
            returnMethod: "https://schema.org/ReturnByMail",
            returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "US",
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 3,
                maxValue: 14,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 2,
                maxValue: 7,
                unitCode: "DAY",
              },
            },
          },
        }
      : undefined,
  }
}

export const getProductFaqJsonLd = (product: HttpTypes.StoreProduct) => {
  const faq = getBuyerFaqItems(product)

  if (!faq.length) {
    return null
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => {
      const [question, ...answerParts] = item.includes("::")
        ? item.split("::")
        : item.split("?")
      const questionText = item.includes("::")
        ? question.trim()
        : `${question.trim()}?`

      return {
        "@type": "Question",
        name: questionText,
        acceptedAnswer: {
          "@type": "Answer",
          text: answerParts.join("?").trim() || item,
        },
      }
    }),
  }
}
