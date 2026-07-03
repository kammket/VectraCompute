"use client"

import { getMetadataList, getMetadataString } from "@lib/util/product-metadata"
import { getProductProfile } from "@lib/util/product-profile"
import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "What's included",
      component: <IncludedTab product={product} />,
    },
    {
      label: "Specifications",
      component: <SpecificationsTab product={product} />,
    },
    {
      label: "Shipping & Warranty",
      component: <ShippingInfoTab product={product} />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const IncludedTab = ({ product }: ProductTabsProps) => {
  const profile = getProductProfile(product)
  const included = getMetadataList(product, "included_items", [
    ...profile.validation.map(
      ([title, detail]) => `${title}: ${detail.toLowerCase()}`
    ),
    getMetadataString(
      product,
      "install_support",
      "Software or installation handoff matched to the selected product"
    ),
  ]).slice(0, 5)

  return (
    <div className="text-small-regular py-8 flex flex-col gap-4">
      <p>
        The included handoff depends on this product&apos;s role in your AI
        environment:
      </p>
      <ul className="list-disc pl-5 flex flex-col gap-1.5">
        {included.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

const SpecificationsTab = ({ product }: ProductTabsProps) => {
  const warranty = getMetadataString(
    product,
    "warranty",
    "Warranty configured by product and quote"
  )
  const support = getMetadataString(
    product,
    "support_level",
    "Technical support matched to the product"
  )
  const assembly = getMetadataString(
    product,
    "condition",
    "Built, inspected, and bench-tested"
  )
  const os = getMetadataString(
    product,
    "software_stack",
    getMetadataString(
      product,
      "install_support",
      "Configured during quote review"
    )
  )

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Chassis weight</span>
            <p>
              {product.weight
                ? `${(product.weight / 1000).toFixed(1)} kg`
                : "—"}
            </p>
          </div>
          <div>
            <span className="font-semibold">Warranty</span>
            <p>{warranty}</p>
          </div>
          <div>
            <span className="font-semibold">Support</span>
            <p>{support}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length} x ${product.width} x ${product.height} mm`
                : "—"}
            </p>
          </div>
          <div>
            <span className="font-semibold">Assembly</span>
            <p>{assembly}</p>
          </div>
          <div>
            <span className="font-semibold">Software / handoff</span>
            <p>{os}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = ({ product }: ProductTabsProps) => {
  const leadTime = getMetadataString(
    product,
    "lead_time",
    "Lead time confirmed during quote review"
  )
  const warranty = getMetadataString(
    product,
    "warranty",
    "Warranty terms depend on product and configuration"
  )
  const returns = getMetadataString(
    product,
    "returns",
    "Return eligibility is reviewed by product condition and configuration"
  )

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Built &amp; shipped quickly</span>
            <p className="max-w-sm">{leadTime}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Up to 5-year warranty</span>
            <p className="max-w-sm">{warranty}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">30-day returns</span>
            <p className="max-w-sm">{returns}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
