"use server"

import { findCatalogProductByVariantId } from "@lib/data/product-overrides"
import { HttpTypes } from "@medusajs/types"

export const retrieveVariant = async (
  variant_id: string
): Promise<HttpTypes.StoreProductVariant | null> => {
  return (await findCatalogProductByVariantId(variant_id))?.variant ?? null
}
