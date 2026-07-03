"use server"

import { HttpTypes } from "@medusajs/types"

export const listCartShippingMethods = async (_cartId: string) => {
  return [
    {
      id: "ship_admin_reviewed",
      name: "Admin-reviewed freight / insured delivery",
      amount: 0,
      price_type: "flat",
    },
  ] as HttpTypes.StoreCartShippingOption[]
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  _cartId: string,
  _data?: Record<string, unknown>
) => {
  return {
    id: optionId,
    name: "Admin-reviewed freight / insured delivery",
    amount: 0,
    price_type: "flat",
  } as HttpTypes.StoreCartShippingOption
}
