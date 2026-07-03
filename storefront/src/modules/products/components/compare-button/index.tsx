"use client"

import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import { useEffect, useState } from "react"

type CompareItem = {
  handle: string
  title: string
  category?: string
  description?: string
  priceLabel?: string
  gpuMemory?: string
  condition?: string
  leadTime?: string
  warranty?: string
  powerDraw?: string
  bestFor?: string[]
  trustNote?: string
}

const STORAGE_KEY = "vectra_compare_products"

const readCompareItems = (): CompareItem[] => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")
  } catch {
    return []
  }
}

const writeCompareItems = (items: CompareItem[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 4)))
  window.dispatchEvent(new Event("vectra-compare-updated"))
}

const readMeta = (
  metadata: Record<string, unknown> | null | undefined,
  key: string
) => {
  const value = metadata?.[key]

  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

const readListMeta = (
  metadata: Record<string, unknown> | null | undefined,
  key: string
) =>
  readMeta(metadata, key)
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const formatPrice = (product: HttpTypes.StoreProduct) => {
  const prices =
    product.variants
      ?.map((variant) => variant.calculated_price?.calculated_amount)
      .filter((amount): amount is number => typeof amount === "number") ?? []

  if (!prices.length) {
    return "Contact for pricing"
  }

  const minPrice = Math.min(...prices)
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(minPrice)

  return product.variants && product.variants.length > 1
    ? `From ${formatted}`
    : formatted
}

const buildCompareItem = (product: HttpTypes.StoreProduct): CompareItem => {
  const metadata = product.metadata as
    | Record<string, unknown>
    | null
    | undefined

  return {
    handle: product.handle ?? "",
    title: product.title,
    category: product.categories?.[0]?.name,
    description:
      readMeta(metadata, "seo_description") ?? product.description ?? undefined,
    priceLabel: formatPrice(product),
    gpuMemory: readMeta(metadata, "gpu_memory"),
    condition: readMeta(metadata, "condition"),
    leadTime: readMeta(metadata, "lead_time"),
    warranty: readMeta(metadata, "warranty"),
    powerDraw: readMeta(metadata, "power_draw"),
    bestFor:
      readListMeta(metadata, "best_for") ??
      product.tags
        ?.map((tag) => tag.value)
        .filter(Boolean)
        .slice(0, 4),
    trustNote: readMeta(metadata, "trust_note"),
  }
}

const CompareButton = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    const sync = () => {
      setIsSelected(
        readCompareItems().some((item) => item.handle === product.handle)
      )
    }

    sync()
    window.addEventListener("vectra-compare-updated", sync)
    return () => window.removeEventListener("vectra-compare-updated", sync)
  }, [product.handle])

  const toggle = () => {
    const items = readCompareItems()

    if (items.some((item) => item.handle === product.handle)) {
      writeCompareItems(items.filter((item) => item.handle !== product.handle))
      setIsSelected(false)
      return
    }

    writeCompareItems([...items, buildCompareItem(product)])
    setIsSelected(true)
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="small"
      onClick={toggle}
      className="w-fit"
    >
      {isSelected ? "Added to compare" : "Add to compare"}
    </Button>
  )
}

export default CompareButton
