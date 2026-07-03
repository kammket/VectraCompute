import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"
import { getBreadcrumbJsonLd, JsonLd } from "@lib/util/json-ld"
import { HttpTypes, StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  try {
    const product_categories = await listCategories()

    if (!product_categories) {
      return []
    }

    const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    const categoryHandles = product_categories.map(
      (category: HttpTypes.StoreProductCategory) => category.handle
    )

    const staticParams = countryCodes
      ?.map((countryCode: string | undefined) =>
        categoryHandles.map((handle: string) => ({
          countryCode,
          category: [handle],
        }))
      )
      .flat()

    return staticParams
  } catch (error) {
    console.error(
      `Failed to generate static paths for category pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const title = `${productCategory.name} | Built to Order | VectraCompute`

    const description =
      productCategory.description ??
      `Shop ${productCategory.name} at VectraCompute — built to order, stress-tested, and shipped ready to train.`

    return {
      title,
      description: description.slice(0, 160),
      keywords: [
        productCategory.name,
        "AI workstation",
        "GPU server",
        "deep learning workstation",
        "NVIDIA GPU workstation",
      ],
      alternates: {
        canonical: `/${params.countryCode}/categories/${params.category.join(
          "/"
        )}`,
      },
    }
  } catch {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const categoryPath = `/categories/${params.category.join("/")}`
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: productCategory.name,
      description:
        productCategory.description ??
        `Shop ${productCategory.name} at VectraCompute.`,
      url: `${getBaseURL()}/${params.countryCode}${categoryPath}`,
      isPartOf: {
        "@type": "WebSite",
        name: "VectraCompute",
        url: getBaseURL(),
      },
      about: [
        "AI hardware",
        "AI workstations",
        "GPU servers",
        "refurbished AI servers",
      ],
    },
    getBreadcrumbJsonLd(params.countryCode, [
      { name: "Home", path: "/" },
      { name: "Store", path: "/store" },
      { name: productCategory.name, path: categoryPath },
    ]),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}
