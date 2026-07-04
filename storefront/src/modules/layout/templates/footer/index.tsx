import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { SEO_PAGES } from "@lib/data/seo-pages"
import { SOLUTIONS } from "@lib/data/solutions"
import { CheckCircleMiniSolid } from "@medusajs/icons"
import { Text, clx } from "@modules/common/components/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FOOTER_RESOURCE_SLUGS = [
  "ai-hardware-compatibility-checklist",
  "ai-hardware-buying-guide",
  "how-much-vram-for-local-ai",
  "cuda-vs-rocm-vs-openvino-ai-hardware",
  "what-happens-after-ordering-ai-hardware",
  "ai-hardware-shipping-returns-warranty",
  "warranty-support",
  "enterprise-ai-procurement",
]

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()
  const topCategories = (productCategories ?? [])
    .filter((category) => !category.parent_category)
    .slice(0, 6)
  const footerResources = FOOTER_RESOURCE_SLUGS.map((slug) =>
    SEO_PAGES.find((page) => page.slug === slug)
  ).filter(Boolean)

  return (
    <footer className="border-t border-grey-80 bg-grey-90 text-white w-full">
      <div className="content-container flex flex-col w-full py-12">
        <div className="grid grid-cols-1 large:grid-cols-[320px_minmax(0,1fr)] gap-10">
          <div className="max-w-sm rounded-md border border-white/15 bg-white/10 p-5">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-brand-100 hover:text-white uppercase font-semibold"
            >
              VectraCompute
            </LocalizedClientLink>
            <Text className="text-small-regular text-grey-20 leading-6 mt-4">
              AI workstations and GPU servers built to order, burn-in tested,
              CUDA validated, and supported by engineers.
            </Text>
            <div className="grid grid-cols-1 gap-2 mt-6 text-small-regular">
              {[
                "24-hour burn-in",
                "Engineer support",
                "Configuration review",
                "Warranty options",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-grey-10"
                >
                  <CheckCircleMiniSolid className="text-brand-200" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="text-small-regular gap-8 grid grid-cols-2 medium:grid-cols-3 large:grid-cols-5">
            {topCategories.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-base-semi text-white">Shop</span>
                <ul
                  className="grid grid-cols-1 gap-2 text-grey-20"
                  data-testid="footer-categories"
                >
                  {topCategories.map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-white"
                        href={`/categories/${c.handle}`}
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                  <li>
                    <LocalizedClientLink
                      className="hover:text-white"
                      href="/store"
                    >
                      All products
                    </LocalizedClientLink>
                  </li>
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="text-base-semi text-white">Buying</span>
              <ul className="grid grid-cols-1 gap-y-2 text-grey-20">
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/configure"
                  >
                    AI configurator
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/compare"
                  >
                    Compare systems
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/contact"
                  >
                    Request a quote
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/financing"
                  >
                    Business buying options
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/trust"
                  >
                    Trust center
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/resources/enterprise-ai-procurement"
                  >
                    Procurement guide
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/order/status"
                  >
                    Track your order
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/resources/how-bitcoin-payment-works"
                  >
                    How payment works
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            {collections && collections.length > 0 ? (
              <div className="flex flex-col gap-y-2">
                <span className="text-base-semi text-white">
                  Collections
                </span>
                <ul
                  className={clx("grid grid-cols-1 gap-2 text-grey-20", {
                    "grid-cols-2": (collections?.length || 0) > 3,
                  })}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-white"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="flex flex-col gap-y-2">
              <span className="text-base-semi text-white">Solutions</span>
              <ul className="grid grid-cols-1 gap-y-2 text-grey-20">
                {SOLUTIONS.map((s) => (
                  <li key={s.slug}>
                    <LocalizedClientLink
                      className="hover:text-white"
                      href={`/solutions/${s.slug}`}
                    >
                      {s.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="text-base-semi text-white">Resources</span>
              <ul className="grid grid-cols-1 gap-y-2 text-grey-20">
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/resources"
                  >
                    Resource Center
                  </LocalizedClientLink>
                </li>
                <li className="pt-2 text-xsmall-semi uppercase tracking-wide text-grey-40">
                  Buy with confidence
                </li>
                {footerResources.map((page) =>
                  page ? (
                    <li key={page.slug}>
                      <LocalizedClientLink
                        className="hover:text-white"
                        href={`/resources/${page.slug}`}
                      >
                        {page.navTitle}
                      </LocalizedClientLink>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="text-base-semi text-white">Company</span>
              <ul className="grid grid-cols-1 gap-y-2 text-grey-20">
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/about"
                  >
                    About Us
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/trust"
                  >
                    Trust Center
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/blog"
                  >
                    Blog & Resources
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/financing"
                  >
                    Financing
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href="/contact"
                  >
                    Contact / Ask an Expert
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col small:flex-row gap-3 w-full mt-10 pt-6 border-t border-white/10 justify-between text-grey-30">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} VectraCompute. All rights reserved.
          </Text>
          <Text className="txt-compact-small">
            Built for AI teams that need tested, supportable infrastructure.
          </Text>
        </div>
      </div>
    </footer>
  )
}
