"use client"

import { useState } from "react"

import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

// Compact cart card used only on mobile (two per row) so shoppers see more
// items at once. Desktop keeps the detailed table.
const MobileCartCard = ({
  item,
  currencyCode,
}: {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
}) => {
  const [busy, setBusy] = useState(false)

  const setQty = async (quantity: number) => {
    if (quantity < 1 || busy) return
    setBusy(true)
    await updateLineItem({ lineId: item.id, quantity }).catch(() => {})
    setBusy(false)
  }

  const remove = async () => {
    setBusy(true)
    await deleteLineItem(item.id).catch(() => {})
    setBusy(false)
  }

  return (
    <div className="flex flex-col rounded-md border border-ui-border-base bg-white p-3">
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="block overflow-hidden rounded-md"
      >
        <Thumbnail thumbnail={item.thumbnail} images={[]} size="square" />
      </LocalizedClientLink>
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="mt-2 line-clamp-2 text-small-semi text-ui-fg-base"
      >
        {item.product_title}
      </LocalizedClientLink>
      {item.variant_title && (
        <p className="mt-0.5 line-clamp-1 text-xs text-ui-fg-subtle">
          {item.variant_title}
        </p>
      )}
      <p className="mt-1 text-base-semi text-ui-fg-base">
        {convertToLocale({
          amount: (item.unit_price ?? 0) * item.quantity,
          currency_code: currencyCode,
        })}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center rounded-md border border-ui-border-base">
          <button
            type="button"
            onClick={() => setQty(item.quantity - 1)}
            disabled={busy || item.quantity <= 1}
            className="h-8 w-8 text-base disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-7 text-center text-small-regular">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => setQty(item.quantity + 1)}
            disabled={busy}
            className="h-8 w-8 text-base disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="text-xs text-ui-fg-muted underline"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default MobileCartCard
