"use server"

import { findLocalProductByVariantId } from "@lib/catalog/local-catalog"
import { HttpTypes } from "@medusajs/types"

export const retrieveVariant = async (
  variant_id: string
): Promise<HttpTypes.StoreProductVariant | null> => {
  return findLocalProductByVariantId(variant_id)?.variant ?? null
}
