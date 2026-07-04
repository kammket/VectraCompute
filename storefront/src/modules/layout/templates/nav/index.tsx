import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { CodeCompare, ServerStack, User } from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import NavLinks from "@modules/layout/components/nav-links"
import SideMenu from "@modules/layout/components/side-menu"
import ProductSearch from "@modules/store/components/product-search"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <>
      <div className="sticky top-0 inset-x-0 z-50 group">
        <header className="relative mx-auto border-b border-ui-border-base bg-white/95 shadow-sm backdrop-blur duration-200">
          <nav
            aria-label="Main"
            className="content-container grid min-h-[72px] grid-cols-[auto_1fr_auto] items-center gap-4 py-3 text-small-regular text-ui-fg-subtle large:grid-cols-[minmax(230px,280px)_minmax(320px,1fr)_auto] large:gap-6"
          >
            <div className="flex min-w-0 items-center gap-x-3">
              {/* Hamburger stays until the category row appears at `large`,
                  so tablets always have a way into the catalog. */}
              <div className="flex items-center large:hidden">
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

          <nav
            aria-label="Categories"
            className="hidden border-t border-ui-border-base bg-white large:block"
          >
            <div className="content-container flex h-11 items-center justify-between gap-6">
              <NavLinks />
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
              </div>
            </div>
          </nav>
        </header>
      </div>

      {/* Mobile search scrolls away with the page instead of permanently
          claiming a third of small screens under the sticky bar. */}
      <div className="border-b border-ui-border-base bg-white medium:hidden">
        <div className="content-container py-3">
          <ProductSearch variant="nav" />
        </div>
      </div>
    </>
  )
}
