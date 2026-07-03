import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title:
    "AI Hardware Store | Workstations, GPU Servers & Components | VectraCompute",
  description:
    "Shop VectraCompute AI workstations, GPU rack servers, CPU-platform workstations, and components with burn-in testing, warranty, and engineer support.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    query?: string
    gpu?: string
    workload?: string
    condition?: string
    formFactor?: string
    budget?: string
    infrastructure?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const {
    sortBy,
    page,
    query,
    gpu,
    workload,
    condition,
    formFactor,
    budget,
    infrastructure,
  } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      query={query}
      filters={{ gpu, workload, condition, formFactor, budget, infrastructure }}
      countryCode={params.countryCode}
    />
  )
}
