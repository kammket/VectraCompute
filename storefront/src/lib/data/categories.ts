import { localCategories } from "@lib/catalog/local-catalog"

export const listCategories = async (query?: Record<string, unknown>) => {
  const limit = query?.limit || 100
  return localCategories.slice(0, Number(limit))
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  return localCategories.find((category) => category.handle === handle) ?? null
}
