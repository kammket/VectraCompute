"use server"

import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (_regionId: string) => {
  return [
    {
      id: "pp_system_default",
      provider_id: "pp_system_default",
      is_enabled: true,
    },
    {
      id: "manual_invoice",
      provider_id: "manual_invoice",
      is_enabled: true,
    },
  ] as HttpTypes.StorePaymentProvider[]
}
