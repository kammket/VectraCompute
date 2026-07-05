import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CheckCircle } from "@medusajs/icons"

import { getCategoryByHandle } from "@lib/data/categories"
import { getSolutionBySlug, SOLUTIONS } from "@lib/data/solutions"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"

type Props = {
  params: Promise<{ slug: string; countryCode: string }>
}

// The recommended-products grid reads request cookies, which is incompatible
// with static generation (DYNAMIC_SERVER_USAGE). Render on demand instead.
export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const solution = getSolutionBySlug(params.slug)

  if (!solution) {
    notFound()
  }

  return {
    title: `${solution.title} Hardware | VectraCompute`,
    description: solution.intro.slice(0, 155),
  }
}

export default async function SolutionPage(props: Props) {
  const params = await props.params
  const solution = getSolutionBySlug(params.slug)

  if (!solution) {
    notFound()
  }

  const category = await getCategoryByHandle([solution.categoryHandle])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${solution.title} Hardware`,
    description: solution.intro,
  }

  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PremiumPageHeader
          eyebrow="Workload solution"
          title={solution.title}
          description={solution.intro}
          actions={[
            { label: "Ask an engineer", href: "/contact" },
            { label: "Compare systems", href: "/compare" },
          ]}
          highlights={[
            solution.tagline,
            "Recommended products below",
            "Quote-ready buying path",
          ]}
        />

        <section className="mt-8 rounded-md border border-ui-border-base bg-white p-6 small:p-8">
          <Heading level="h2" className="text-xl mb-5">
            What this workload needs
          </Heading>
          <div className="grid grid-cols-1 medium:grid-cols-2 gap-4">
            {solution.bullets.map((bullet) => (
              <div
                key={bullet}
                className="grid grid-cols-[36px_1fr] gap-3 rounded-md border border-ui-border-base bg-grey-5 p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-brand-600">
                  <CheckCircle />
                </span>
                <Text className="text-small-regular text-ui-fg-base leading-6">
                  {bullet}
                </Text>
              </div>
            ))}
          </div>
        </section>

        {category && (
          <section className="mt-8 rounded-md border border-ui-border-base bg-white p-6 small:p-8">
            <Heading level="h2" className="text-xl mb-6">
              Recommended Hardware
            </Heading>
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy="created_at"
                page={1}
                categoryId={category.id}
                countryCode={params.countryCode}
              />
            </Suspense>
          </section>
        )}
      </div>
    </div>
  )
}
