import type { HttpTypes } from "@medusajs/types"

import { CATALOG_PRODUCTS } from "./seed-catalog"
import { fallbackProductImage } from "@lib/util/product-image"

const CATEGORY_DETAILS: Record<string, { id: string; handle: string; description: string }> = {
  "AI & Deep Learning Workstations": {
    id: "cat_ai_workstations",
    handle: "ai-deep-learning-workstations",
    description:
      "Single, dual, and quad-GPU workstations for model development, local inference, fine-tuning, and professional AI engineering.",
  },
  "GPU Rack Servers": {
    id: "cat_gpu_rack_servers",
    handle: "gpu-rack-servers",
    description:
      "Rack-mounted GPU servers and refurbished AI servers for training, inference, RAG, private AI, and cluster deployments.",
  },
  "Workstations by CPU Platform": {
    id: "cat_cpu_platforms",
    handle: "workstations-by-cpu-platform",
    description:
      "AI workstations grouped by Intel, AMD Ryzen, Threadripper PRO, Xeon W, and EPYC platform requirements.",
  },
  "Components & Accessories": {
    id: "cat_components_accessories",
    handle: "components-accessories",
    description:
      "AI hardware upgrades including GPUs, NVMe storage, networking, power, cooling, risers, memory, and rack accessories.",
  },
}

const now = "2026-07-03T00:00:00.000Z"

export const localRegion: HttpTypes.StoreRegion = {
  id: "reg_us",
  name: "United States",
  currency_code: "usd",
  countries: [{ id: "us", iso_2: "us", iso_3: "usa", name: "United States" }],
} as HttpTypes.StoreRegion

export const localCategories: HttpTypes.StoreProductCategory[] = Object.entries(
  CATEGORY_DETAILS
).map(([name, details]) => ({
  id: details.id,
  name,
  handle: details.handle,
  description: details.description,
  is_active: true,
  is_internal: false,
  rank: 0,
  created_at: now,
  updated_at: now,
})) as HttpTypes.StoreProductCategory[]

const categoryByName = new Map(localCategories.map((category) => [category.name, category]))

export const localProducts: HttpTypes.StoreProduct[] = CATALOG_PRODUCTS.map(
  (product, productIndex) => {
    const optionId = `opt_${product.handle}`
    const category = categoryByName.get(product.category)
    const image = fallbackProductImage(product.handle)

    const variants = product.variants.map((variant, variantIndex) => ({
      id: `variant_${product.handle}_${variantIndex + 1}`,
      title: variant.title,
      sku: variant.sku,
      manage_inventory: false,
      allow_backorder: true,
      inventory_quantity: 25,
      options: [
        {
          id: `varopt_${product.handle}_${variantIndex + 1}`,
          option_id: optionId,
          value: variant.optionValue,
        },
      ],
      calculated_price: {
        calculated_amount: variant.priceUsd,
        original_amount: variant.priceUsd,
        currency_code: "usd",
        calculated_price: {
          price_list_type: "default",
        },
      },
    }))

    return {
      id: `prod_${product.handle}`,
      title: product.title,
      handle: product.handle,
      subtitle: product.metadata?.best_for ?? null,
      description: product.description,
      status: "published",
      thumbnail: image,
      images: [
        {
          id: `img_${product.handle}_1`,
          url: image,
        },
      ],
      weight: product.weight,
      metadata: {
        ...product.metadata,
        condition: product.metadata?.condition ?? "Built to order",
        warranty: product.metadata?.warranty ?? "1-year parts and labor warranty",
        lead_time: product.metadata?.lead_time ?? "Ships after engineering validation",
        support_level:
          product.metadata?.support_level ?? "Pre-sales configuration review included",
      },
      categories: category ? [category] : [],
      category_ids: category ? [category.id] : [],
      options: [
        {
          id: optionId,
          title: product.optionTitle,
          values: product.variants.map((variant, variantIndex) => ({
            id: `optval_${product.handle}_${variantIndex + 1}`,
            value: variant.optionValue,
            option_id: optionId,
          })),
        },
      ],
      variants,
      tags: [
        { id: `tag_ai_${productIndex}`, value: "AI hardware" },
        { id: `tag_category_${productIndex}`, value: product.category },
      ],
      created_at: now,
      updated_at: now,
    } as HttpTypes.StoreProduct
  }
)

export const findLocalProductByHandle = (handle: string) =>
  localProducts.find((product) => product.handle === handle) ?? null

export const findLocalProductByVariantId = (variantId: string) => {
  for (const product of localProducts) {
    const variant = product.variants?.find((item) => item.id === variantId)
    if (variant) {
      return { product, variant }
    }
  }

  return null
}
