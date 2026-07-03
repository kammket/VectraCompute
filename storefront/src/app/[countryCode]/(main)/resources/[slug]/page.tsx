import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  ArrowRightMini,
  CheckCircle,
  Server,
  ShieldCheck,
} from "@medusajs/icons"

import { getSeoPage, SEO_PAGES } from "@lib/data/seo-pages"
import { getBaseURL } from "@lib/util/env"
import { getBreadcrumbJsonLd, JsonLd } from "@lib/util/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Button, Heading, Text } from "@modules/common/components/ui"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

export const dynamic = "force-dynamic"
export const dynamicParams = true

export function generateStaticParams() {
  return SEO_PAGES.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const page = getSeoPage(params.slug)

  if (!page) {
    notFound()
  }

  return {
    title: `${page.title} | VectraCompute`,
    description: page.description,
    alternates: {
      canonical: `/${params.countryCode}/resources/${page.slug}`,
    },
    openGraph: {
      title: `${page.title} | VectraCompute`,
      description: page.description,
      type: "article",
    },
  }
}

export default async function ResourcePage(props: Props) {
  const params = await props.params
  const page = getSeoPage(params.slug)

  if (!page) {
    notFound()
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.title,
      description: page.description,
      author: {
        "@type": "Organization",
        name: "VectraCompute",
      },
      publisher: {
        "@type": "Organization",
        name: "VectraCompute",
      },
      mainEntityOfPage: `${getBaseURL()}/${params.countryCode}/resources/${
        page.slug
      }`,
    },
    getBreadcrumbJsonLd(params.countryCode, [
      { name: "Home", path: "/" },
      { name: "Resources", path: "/resources" },
      { name: page.title, path: `/resources/${page.slug}` },
    ]),
  ]
  const faqJsonLd = page.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null

  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <JsonLd data={jsonLd} />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}
        <PremiumPageHeader
          eyebrow="AI hardware resource"
          title={page.title}
          description={page.intro}
          actions={[
            { label: "Ask an engineer", href: "/contact" },
            { label: "Compare systems", href: "/compare" },
          ]}
          highlights={[
            "Buyer-focused technical guidance",
            "Links to matching product categories",
            "Procurement and support context",
          ]}
        />

        <div className="mt-8 grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_340px] gap-8">
          <article className="rounded-md border border-ui-border-base bg-white p-6 small:p-8">
            <div className="flex flex-col gap-8">
              {page.sections.map((section) => (
                <section
                  key={section.title}
                  className="border-t first:border-t-0 border-ui-border-base pt-8 first:pt-0"
                >
                  <Heading level="h2" className="text-xl mb-3">
                    {section.title}
                  </Heading>
                  <Text className="text-base-regular text-ui-fg-subtle leading-7 mb-4">
                    {section.body}
                  </Text>
                  {section.links && (
                    <div className="flex flex-wrap gap-3">
                      {section.links.map((link) => (
                        <LocalizedClientLink
                          key={link.href}
                          href={link.href}
                          className="inline-flex h-9 items-center gap-1 rounded-md border border-ui-border-base px-3 text-small-regular text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                        >
                          {link.label}
                          <ArrowRightMini />
                        </LocalizedClientLink>
                      ))}
                    </div>
                  )}
                </section>
              ))}
              {page.faq && (
                <section className="border-t border-ui-border-base pt-8">
                  <Heading level="h2" className="text-xl mb-5">
                    Frequently asked questions
                  </Heading>
                  <div className="grid grid-cols-1 gap-4">
                    {page.faq.map((item) => (
                      <div
                        key={item.question}
                        className="rounded-md border border-ui-border-base bg-grey-5 p-5"
                      >
                        <Heading level="h3" className="text-base mb-2">
                          {item.question}
                        </Heading>
                        <Text className="text-small-regular text-ui-fg-subtle leading-6">
                          {item.answer}
                        </Text>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>

          <aside className="border border-ui-border-base rounded-md bg-white p-6 h-fit sticky top-24 shadow-elevation-card-rest">
            <Heading level="h2" className="text-xl mb-3">
              Need help sizing a system?
            </Heading>
            <Text className="text-small-regular text-ui-fg-subtle leading-6 mb-5">
              Share your model, dataset, deployment constraints, and timeline.
              An engineer can recommend a practical configuration before you
              buy.
            </Text>
            <LocalizedClientLink href="/contact">
              <Button
                variant="primary"
                className="bg-brand-600 hover:bg-brand-700 border-none w-full"
              >
                Ask an engineer
              </Button>
            </LocalizedClientLink>
            <div className="mt-6 grid grid-cols-1 gap-3">
              {[
                [
                  ShieldCheck,
                  "AI workstations",
                  "/categories/ai-deep-learning-workstations",
                ],
                [Server, "GPU rack servers", "/categories/gpu-rack-servers"],
                [CheckCircle, "All products", "/store"],
              ].map(([Icon, label, href]) => (
                <LocalizedClientLink
                  key={href as string}
                  href={href as string}
                  className="grid grid-cols-[32px_1fr] items-center gap-3 rounded-md border border-ui-border-base bg-grey-5 p-3 text-small-semi text-ui-fg-base hover:text-brand-700"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-brand-600">
                    <Icon />
                  </span>
                  {label as string}
                </LocalizedClientLink>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
