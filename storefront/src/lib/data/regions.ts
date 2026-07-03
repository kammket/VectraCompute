"use server"

import { HttpTypes } from "@medusajs/types"
import { localRegion } from "@lib/catalog/local-catalog"

export const listRegions = async () => {
  return [localRegion]
}

export const retrieveRegion = async (id: string) => {
  return id === localRegion.id ? localRegion : null
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  if (regionMap.has(countryCode)) {
    return regionMap.get(countryCode)
  }

  const regions = await listRegions()

  if (!regions) {
    return null
  }

  regions.forEach((region) => {
    region.countries?.forEach((c) => {
      regionMap.set(c?.iso_2 ?? "", region)
    })
  })

  const region = countryCode
    ? regionMap.get(countryCode)
    : regionMap.get("us")

  return region
}
