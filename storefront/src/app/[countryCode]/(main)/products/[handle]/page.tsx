import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getReviewSummary } from "@lib/data/reviews"
import { getRegion, listRegions } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"
import {
  getBreadcrumbJsonLd,
  getProductFaqJsonLd,
  getProductJsonLd,
  JsonLd,
} from "@lib/util/json-ld"
import { getProductSeo } from "@lib/util/product-seo"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return []

  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images?.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images!.map((i) => [i.id, true]))
  return product.images?.filter((i) => imageIdsMap.has(i.id)) ?? null
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const seo = getProductSeo(product)
  const image = seo.ogImage
    ? seo.ogImage.startsWith("http")
      ? seo.ogImage
      : `${getBaseURL()}${seo.ogImage}`
    : undefined

  return {
    title: seo.title,
    description: seo.description.slice(0, 160),
    keywords: seo.keywords,
    alternates: {
      canonical: `/${params.countryCode}${seo.canonicalPath}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description.slice(0, 160),
      type: "website",
      images: image ? [image] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  const seo = getProductSeo(pricedProduct)
  const category = pricedProduct.categories?.[0]
  const reviewSummary = await getReviewSummary(params.handle)
  const jsonLd = [
    getProductJsonLd(pricedProduct, params.countryCode, reviewSummary),
    getBreadcrumbJsonLd(params.countryCode, [
      { name: "Home", path: "/" },
      { name: "Store", path: "/store" },
      ...(category
        ? [{ name: category.name, path: `/categories/${category.handle}` }]
        : []),
      { name: pricedProduct.title, path: `/products/${params.handle}` },
    ]),
    getProductFaqJsonLd(pricedProduct),
  ].filter(Boolean) as Record<string, unknown>[]

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images ?? []}
      />
    </>
  )
}
