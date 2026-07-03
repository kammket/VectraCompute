import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeftMini, ArrowRightMini, SparklesMini } from "@medusajs/icons"

import { BLOG_POSTS, getBlogPostBySlug } from "@lib/data/blog-posts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PremiumPageHeader } from "@modules/common/components/premium-page"
import { Heading, Text } from "@modules/common/components/ui"

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return {
    title: `${post.title} | VectraCompute Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "VectraCompute",
    },
  }

  return (
    <div className="bg-grey-5">
      <div className="content-container py-10 small:py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PremiumPageHeader
          eyebrow="Engineering blog"
          title={post.title}
          description={post.description}
          actions={[
            { label: "Ask an engineer", href: "/contact" },
            { label: "Read resources", href: "/resources" },
          ]}
          highlights={[
            new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            post.readingTime,
            "AI hardware buying insight",
          ]}
        />
        <div className="mt-8 grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <article className="rounded-md border border-ui-border-base bg-white p-6 small:p-8">
            <LocalizedClientLink
              href="/blog"
              className="inline-flex items-center gap-1 text-small-regular text-ui-fg-muted hover:text-ui-fg-base"
            >
              <ArrowLeftMini />
              Back to Blog
            </LocalizedClientLink>
            <div className="mt-8 flex flex-col gap-5">
              {post.content.map((paragraph, i) => (
                <Text
                  key={i}
                  className="text-base-regular leading-7 text-ui-fg-subtle"
                >
                  {paragraph}
                </Text>
              ))}
            </div>
          </article>
          <aside className="rounded-md border border-ui-border-base bg-white p-6 h-fit large:sticky large:top-24 shadow-elevation-card-rest">
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <SparklesMini />
            </span>
            <Heading level="h2" className="text-xl mb-3">
              Turn research into a build
            </Heading>
            <Text className="text-small-regular text-ui-fg-subtle leading-6 mb-5">
              Send us your workload, model size, storage needs, and deployment
              timeline. We will suggest a practical configuration.
            </Text>
            <LocalizedClientLink
              href="/contact"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-small-semi text-white hover:bg-brand-700"
            >
              Ask an engineer
              <ArrowRightMini />
            </LocalizedClientLink>
          </aside>
        </div>
      </div>
    </div>
  )
}
