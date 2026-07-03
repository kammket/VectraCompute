import { Metadata } from "next"
import { ArrowRightMini, SparklesMini } from "@medusajs/icons"

import { BLOG_POSTS } from "@lib/data/blog-posts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Blog & Resources | VectraCompute",
  description:
    "Buyer's guides and technical breakdowns on GPUs, workstation configuration, and scaling AI hardware — from the VectraCompute engineering team.",
}

export default function BlogIndexPage() {
  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <PremiumPageHeader
          eyebrow="Engineering blog"
          title="Technical buying advice for AI hardware teams"
          description="Buyer's guides and engineering breakdowns on GPUs, workstation configuration, refurbished GPU servers, deployment planning, and scaling AI hardware."
          actions={[
            { label: "Read buying guides", href: "/resources" },
            { label: "Ask an engineer", href: "/contact" },
          ]}
          highlights={[
            "Written for technical buyers",
            "Connected to product categories",
            "Useful for procurement decisions",
          ]}
        />
        <div className="mt-8 grid grid-cols-1 medium:grid-cols-2 gap-5">
          {BLOG_POSTS.slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((post) => (
              <article
                key={post.slug}
                className="flex h-full flex-col rounded-md border border-ui-border-base bg-white p-6 transition-shadow hover:shadow-elevation-card-hover"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                  <SparklesMini />
                </span>
                <Text className="text-small-regular text-ui-fg-muted mb-2">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  · {post.readingTime}
                </Text>
                <LocalizedClientLink href={`/blog/${post.slug}`}>
                  <Heading level="h2" className="text-xl mb-2 hover:underline">
                    {post.title}
                  </Heading>
                </LocalizedClientLink>
                <Text className="text-small-regular text-ui-fg-subtle leading-6">
                  {post.description}
                </Text>
                <LocalizedClientLink
                  href={`/blog/${post.slug}`}
                  className="mt-auto pt-5 inline-flex items-center gap-1 text-small-semi text-ui-fg-interactive"
                >
                  Read article
                  <ArrowRightMini />
                </LocalizedClientLink>
              </article>
            ))}
        </div>
      </div>
    </div>
  )
}
