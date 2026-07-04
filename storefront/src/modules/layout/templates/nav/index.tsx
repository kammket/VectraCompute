import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { CodeCompare, ServerStack, User } from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import ProductSearch from "@modules/store/components/product-search"

// Kept to six so the row never scrolls; Edge AI, memory/storage, and
// power/cooling entry points live in the store filters instead.
const PRIMARY_LINKS = [
  { label: "Store", href: "/store" },
  { label: "Workstations", href: "/categories/ai-deep-learning-workstations" },
  { label: "GPU Servers", href: "/categories/gpu-rack-servers" },
  { label: "Refurbished", href: "/categories/refurbished-certified" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resources" },
]

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative mx-auto border-b border-grey-80 bg-white/95 shadow-sm backdrop-blur duration-200">
        <nav className="content-container grid min-h-[72px] grid-cols-[auto_1fr_auto] items-center gap-4 py-3 text-small-regular text-ui-fg-subtle large:grid-cols-[minmax(230px,280px)_minmax(320px,1fr)_auto] large:gap-6">
          <div className="flex min-w-0 items-center gap-x-3">
            <div className="flex items-center small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="group flex min-w-0 items-center gap-3"
              data-testid="nav-store-link"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-grey-90 text-small-semi text-white shadow-sm ring-1 ring-grey-80 group-hover:bg-brand-700">
                VC
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base-semi uppercase tracking-wide text-ui-fg-base group-hover:text-brand-700">
                  VectraCompute
                </span>
                <span className="hidden truncate text-xsmall-regular text-ui-fg-subtle medium:block">
                  AI hardware and deployment support
                </span>
              </span>
            </LocalizedClientLink>
          </div>

          <ProductSearch className="hidden medium:block" variant="nav" />

          <div className="flex items-center justify-end gap-x-2 small:gap-x-3">
            <LocalizedClientLink
              className="hidden h-9 items-center gap-1.5 rounded-md border border-ui-border-base bg-white px-3 text-small-semi text-ui-fg-base transition hover:border-brand-300 hover:text-brand-700 large:inline-flex"
              href="/compare"
            >
              <CodeCompare />
              Compare
            </LocalizedClientLink>
            <LocalizedClientLink
              className="hidden h-9 items-center gap-1.5 rounded-md border border-ui-border-base bg-white px-3 text-small-semi text-ui-fg-base transition hover:border-brand-300 hover:text-brand-700 medium:inline-flex"
              href="/account"
              data-testid="nav-account-link"
            >
              <User />
              Account
            </LocalizedClientLink>
            <LocalizedClientLink
              className="hidden h-9 items-center gap-2 rounded-md bg-brand-600 px-4 text-small-semi text-white shadow-sm transition hover:bg-brand-700 small:inline-flex"
              href="/contact"
            >
              <ServerStack />
              Request quote
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        <div className="content-container border-t border-ui-border-base py-3 medium:hidden">
          <ProductSearch variant="nav" />
        </div>

        <div className="hidden border-t border-ui-border-base bg-white large:block">
          <div className="content-container flex h-11 items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-5 text-small-semi text-ui-fg-subtle">
              {PRIMARY_LINKS.map((link) => (
                <LocalizedClientLink
                  key={link.href}
                  href={link.href}
                  className="shrink-0 rounded-md px-2 py-1 transition-colors hover:bg-grey-5 hover:text-ui-fg-base"
                >
                  {link.label}
                </LocalizedClientLink>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-4 text-small-semi">
              <LocalizedClientLink
                href="/configure"
                className="text-brand-700 hover:text-brand-800"
              >
                Configure a system
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/trust"
                className="text-ui-fg-subtle hover:text-ui-fg-base"
              >
                Trust center
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/contact"
                className="text-ui-fg-subtle hover:text-ui-fg-base"
              >
                Talk to an engineer
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
