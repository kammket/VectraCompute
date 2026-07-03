"use server"

import { HttpTypes } from "@medusajs/types"

const localCollections: HttpTypes.StoreCollection[] = [
  {
    id: "col_ai_workstations",
    handle: "ai-workstation-deals",
    title: "AI Workstation Deals",
    metadata: {
      description:
        "Curated GPU workstations for local AI development, fine-tuning, inference, and model experimentation.",
    },
  },
  {
    id: "col_refurb_servers",
    handle: "refurbished-ai-servers",
    title: "Refurbished AI Servers",
    metadata: {
      description:
        "Validated refurbished A100, H100, H200, L40S, and GPU rack server options for serious AI buyers.",
    },
  },
] as HttpTypes.StoreCollection[]

export const retrieveCollection = async (id: string) => {
  return localCollections.find((collection) => collection.id === id) ?? null
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return { collections: localCollections, count: localCollections.length }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  return (
    localCollections.find((collection) => collection.handle === handle) ?? null
  )
}
