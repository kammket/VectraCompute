"use server"

import { localRegion } from "@lib/catalog/local-catalog"
import { findCatalogProductByVariantId } from "@lib/data/product-overrides"
import { HttpTypes } from "@medusajs/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type CartCookieItem = { variantId: string; quantity: number; addedAt: string }

const CART_COOKIE = "vectra_cart"
const SHIPPING_AMOUNT = 0
const TAX_RATE = 0

const readItems = async (): Promise<CartCookieItem[]> => {
  const raw = (await cookies()).get(CART_COOKIE)?.value
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw))
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item) =>
        typeof item?.variantId === "string" &&
        typeof item?.quantity === "number" &&
        item.quantity > 0
    )
  } catch {
    return []
  }
}

const writeItems = async (items: CartCookieItem[]) => {
  ;(await cookies()).set(CART_COOKIE, encodeURIComponent(JSON.stringify(items)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

const priceForVariant = (variant: HttpTypes.StoreProductVariant) =>
  variant.calculated_price?.calculated_amount ?? 0

const buildCart = async (id = "local-cart"): Promise<HttpTypes.StoreCart> => {
  const cookieItems = await readItems()
  const items = (
    await Promise.all(
      cookieItems.map(async (item) => {
        const match = await findCatalogProductByVariantId(item.variantId)
    if (!match) {
          return null
    }

    const unitPrice = priceForVariant(match.variant)
    const total = unitPrice * item.quantity

        return {
        id: `line_${item.variantId}`,
        title: match.product.title,
        product_id: match.product.id,
        product_title: match.product.title,
        product_handle: match.product.handle,
        variant_id: match.variant.id,
        variant: { ...match.variant, product: match.product },
        thumbnail: match.product.thumbnail,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: total,
        total,
        original_total: total,
        metadata: {},
        created_at: item.addedAt,
        updated_at: item.addedAt,
        } as HttpTypes.StoreCartLineItem
      })
    )
  ).filter((item): item is HttpTypes.StoreCartLineItem => Boolean(item))

  const itemSubtotal = items.reduce((sum, item) => sum + (item.total ?? 0), 0)
  const taxTotal = Math.round(itemSubtotal * TAX_RATE)
  const total = itemSubtotal + SHIPPING_AMOUNT + taxTotal

  return {
    id,
    email: null,
    currency_code: "usd",
    region_id: localRegion.id,
    region: localRegion,
    items,
    shipping_methods: [],
    shipping_address: null,
    billing_address: null,
    promotions: [],
    item_subtotal: itemSubtotal,
    subtotal: itemSubtotal,
    shipping_subtotal: SHIPPING_AMOUNT,
    tax_total: taxTotal,
    discount_subtotal: 0,
    total,
    metadata: {},
  } as HttpTypes.StoreCart
}

export async function retrieveCart(cartId?: string, _fields?: string) {
  const cart = await buildCart(cartId)
  return cart.items?.length ? cart : null
}

export async function getOrSetCart(_countryCode: string) {
  return buildCart()
}

export async function updateCart(_data: HttpTypes.StoreUpdateCart) {
  return buildCart()
}

export async function addToCart({
  variantId,
  quantity,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const match = await findCatalogProductByVariantId(variantId)
  if (!match) {
    throw new Error("Selected product configuration was not found")
  }

  const items = await readItems()
  const existing = items.find((item) => item.variantId === variantId)

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 10)
  } else {
    items.push({ variantId, quantity, addedAt: new Date().toISOString() })
  }

  await writeItems(items)
  revalidatePath("/", "layout")
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  const variantId = lineId.replace(/^line_/, "")
  const items = await readItems()

  const nextItems = items
    .map((item) =>
      item.variantId === variantId
        ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) }
        : item
    )
    .filter((item) => item.quantity > 0)

  await writeItems(nextItems)
  revalidatePath("/", "layout")
}

export async function deleteLineItem(lineId: string) {
  const variantId = lineId.replace(/^line_/, "")
  const items = await readItems()
  await writeItems(items.filter((item) => item.variantId !== variantId))
  revalidatePath("/", "layout")
}

export async function setShippingMethod() {
  return buildCart()
}

export async function initiatePaymentSession() {
  return buildCart()
}

export async function applyPromotions(_codes: string[]) {
  return buildCart()
}

export async function applyGiftCard(_code: string) {
  return buildCart()
}

export async function removeDiscount(_code: string) {
  return buildCart()
}

export async function removeGiftCard(_code: string) {
  return buildCart()
}

export async function submitPromotionForm() {
  return null
}

export async function setAddresses(_currentState: unknown, _formData: FormData) {
  return null
}

export async function placeOrder() {
  redirect("/checkout?step=review")
}

export async function updateRegion(_countryCode: string, currentPath: string) {
  redirect(currentPath)
}

export async function listCartOptions() {
  return []
}

export async function clearCart() {
  await writeItems([])
  revalidatePath("/", "layout")
}
