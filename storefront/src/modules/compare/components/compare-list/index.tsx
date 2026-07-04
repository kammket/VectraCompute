"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"
import { ReactNode } from "react"
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

const readItems = (): CompareItem[] => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")
  } catch {
    return []
  }
}

const CompareList = () => {
  const [items, setItems] = useState<CompareItem[]>([])

  useEffect(() => {
    setItems(readItems())
  }, [])

  const remove = (handle: string) => {
    const next = items.filter((item) => item.handle !== handle)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event("vectra-compare-updated"))
    setItems(next)
  }

  const clear = () => {
    window.localStorage.setItem(STORAGE_KEY, "[]")
    window.dispatchEvent(new Event("vectra-compare-updated"))
    setItems([])
  }

  if (!items.length) {
    return (
      <div className="border border-ui-border-base rounded-large p-8 bg-grey-5">
        <Heading level="h2" className="text-xl mb-2">
          No products selected
        </Heading>
        <Text className="text-ui-fg-subtle mb-5">
          Add products from their product pages to compare systems before asking
          for a quote or checking out.
        </Text>
        <LocalizedClientLink href="/store">
          <Button
            variant="primary"
            className="bg-brand-600 hover:bg-brand-700 border-none"
          >
            Browse products
          </Button>
        </LocalizedClientLink>
      </div>
    )
  }

  const quoteContext = items.map((item) => item.title).join(", ")

  const rows: { label: string; render: (item: CompareItem) => ReactNode }[] = [
    {
      label: "Best for",
      render: (item) =>
        item.bestFor?.length
          ? item.bestFor.slice(0, 4).join(", ")
          : "AI workloads",
    },
    { label: "Starting price", render: (item) => item.priceLabel ?? "Contact" },
    {
      label: "GPU memory",
      render: (item) => item.gpuMemory ?? "Configured per build",
    },
    {
      label: "Condition",
      render: (item) => item.condition ?? "Validated build",
    },
    {
      label: "Lead time",
      render: (item) => item.leadTime ?? "Quoted by build",
    },
    {
      label: "Warranty",
      render: (item) => item.warranty ?? "Warranty supported",
    },
    {
      label: "Power draw",
      render: (item) => item.powerDraw ?? "Reviewed before quote",
    },
    {
      label: "Trust signal",
      render: (item) =>
        item.trustNote ??
        "Burn-in tested, CUDA validated, and supported by engineers.",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest">
        <div className="flex flex-col gap-4 large:flex-row large:items-center large:justify-between">
          <div>
            <Text className="text-small-semi uppercase tracking-wide text-brand-600">
              {items.length} selected
            </Text>
            <Heading level="h2" className="mt-2 text-2xl">
              Compare shortlist
            </Heading>
            <Text className="mt-2 text-small-regular text-ui-fg-subtle">
              Review practical buying factors, then send the shortlist for a
              quote and configuration check.
            </Text>
          </div>
          <div className="flex flex-wrap gap-3">
            <LocalizedClientLink
              href={`/contact?product=${encodeURIComponent(quoteContext)}`}
            >
              <Button
                variant="primary"
                className="bg-brand-600 hover:bg-brand-700 border-none"
              >
                Request shortlist quote
              </Button>
            </LocalizedClientLink>
            <button
              type="button"
              onClick={clear}
              className="rounded-md border border-ui-border-base px-4 py-2 text-small-semi text-ui-fg-base hover:bg-grey-5"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-ui-fg-muted large:hidden">
        Swipe sideways to compare — the spec column stays pinned.
      </p>
      <div className="overflow-x-auto rounded-md border border-ui-border-base bg-white shadow-elevation-card-rest">
        <table className="min-w-[900px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ui-border-base bg-grey-5">
              <th className="sticky left-0 z-10 w-44 bg-grey-5 px-4 py-4 text-small-semi text-ui-fg-base shadow-[1px_0_0_0_#E5E7EB]">
                Spec
              </th>
              {items.map((item) => (
                <th key={item.handle} className="min-w-56 px-4 py-4 align-top">
                  {item.category && (
                    <Text className="mb-2 text-xs uppercase tracking-wide text-ui-fg-muted">
                      {item.category}
                    </Text>
                  )}
                  <Heading level="h3" className="text-lg leading-6">
                    {item.title}
                  </Heading>
                  {item.description && (
                    <Text className="mt-2 line-clamp-3 text-small-regular leading-6 text-ui-fg-subtle">
                      {item.description}
                    </Text>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-ui-border-base">
                <th className="sticky left-0 z-10 bg-grey-5 px-4 py-4 text-small-semi text-ui-fg-base shadow-[1px_0_0_0_#E5E7EB]">
                  {row.label}
                </th>
                {items.map((item) => (
                  <td
                    key={`${item.handle}-${row.label}`}
                    className="px-4 py-4 text-small-regular leading-6 text-ui-fg-subtle"
                  >
                    {row.render(item)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="sticky left-0 z-10 bg-grey-5 px-4 py-4 text-small-semi text-ui-fg-base shadow-[1px_0_0_0_#E5E7EB]">
                Actions
              </th>
              {items.map((item) => (
                <td key={`${item.handle}-actions`} className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <LocalizedClientLink href={`/products/${item.handle}`}>
                      <Button variant="secondary" className="w-full">
                        View product
                      </Button>
                    </LocalizedClientLink>
                    <button
                      type="button"
                      onClick={() => remove(item.handle)}
                      className="text-small-regular text-ui-fg-muted hover:text-ui-fg-base"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompareList
