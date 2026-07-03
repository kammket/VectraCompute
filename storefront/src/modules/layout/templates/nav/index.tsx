import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import {
  CheckCircleMiniSolid,
  CodeCompare,
  ServerStack,
  ShieldCheck,
  User,
} from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import ProductSearch from "@modules/store/components/product-search"

const PRIMARY_LINKS = [
  { label: "Store", href: "/store" },
  { label: "Workstations", href: "/categories/ai-deep-learning-workstations" },
  { label: "GPU Servers", href: "/categories/gpu-rack-servers" },
  { label: "Refurbished", href: "/store?condition=refurbished" },
  { label: "Edge AI", href: "/store?infrastructure=edge-robotics" },
  { label: "Memory / Storage", href: "/store?infrastructure=memory-storage" },
  { label: "Power / Cooling", href: "/store?infrastructure=power-cooling" },
  { label: "Components", href: "/categories/components-accessories" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resources" },
]

const TRUST_POINTS = [
  "Validated AI infrastructure",
  "Burn-in tested",
  "PO and quote support",
  "Deployment review available",
]

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative mx-auto border-b border-ui-border-base bg-white/95 shadow-sm backdrop-blur duration-200">
        <div className="hidden border-b border-ui-border-base bg-ui-bg-subtle medium:block">
          <div className="content-container flex h-9 items-center justify-between gap-6 text-small-regular text-ui-fg-subtle">
            <div className="flex min-w-0 items-center gap-2 text-ui-fg-base">
              <ShieldCheck className="shrink-0 text-brand-600" />
              <span className="truncate">
                AI workstations, GPU servers, and infrastructure validated
                before shipment
              </span>
            </div>
            <div className="hidden items-center gap-4 large:flex">
              {TRUST_POINTS.map((point) => (
                <span key={point} className="inline-flex items-center gap-1.5">
                  <CheckCircleMiniSolid className="text-brand-600" />
                  {point}
                </span>
              ))}
            </div>
            <LocalizedClientLink
              href="/contact"
              className="shrink-0 text-small-semi text-brand-700 hover:text-brand-800"
            >
              Talk to an engineer
            </LocalizedClientLink>
          </div>
        </div>

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
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ui-fg-base text-small-semi text-white shadow-sm group-hover:bg-brand-700">
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
            <LocalizedClientLink
              className="hidden h-9 items-center rounded-md border border-ui-border-base px-3 text-small-semi text-ui-fg-base hover:border-brand-300 hover:text-brand-700 small:inline-flex medium:hidden"
              href="/trust"
            >
              Trust
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
            <div className="flex min-w-0 items-center gap-5 overflow-x-auto text-small-semi text-ui-fg-subtle">
              {PRIMARY_LINKS.map((link) => (
                <LocalizedClientLink
                  key={link.href}
                  href={link.href}
                  className="shrink-0 transition-colors hover:text-ui-fg-base"
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
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
