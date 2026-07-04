"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

// Kept in sync with CATEGORY_DETAILS in lib/catalog/local-catalog.ts. Hardcoded
// here so the 3,600-line seed catalog never enters the client bundle.
const ALL_CATEGORIES = [
  { label: "AI & Deep Learning Workstations", handle: "ai-deep-learning-workstations" },
  { label: "GPU Rack Servers", handle: "gpu-rack-servers" },
  { label: "Refurbished & Certified", handle: "refurbished-certified" },
  { label: "Storage & Memory", handle: "storage-memory" },
  { label: "Networking & Interconnect", handle: "networking-interconnect" },
  { label: "Power & Cooling", handle: "power-cooling" },
  { label: "Edge & Robotics", handle: "edge-robotics" },
  { label: "Workstations by CPU Platform", handle: "workstations-by-cpu-platform" },
  { label: "Components & Accessories", handle: "components-accessories" },
]

const PRIMARY_LINKS = [
  { label: "Store", href: "/store" },
  { label: "Workstations", href: "/categories/ai-deep-learning-workstations" },
  { label: "GPU Servers", href: "/categories/gpu-rack-servers" },
  { label: "Refurbished", href: "/categories/refurbished-certified" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resources" },
]

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    aria-hidden
    className={clx("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
  >
    <path
      d="M5 7.5l5 5 5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const NavLinks = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Strip the country prefix so hrefs compare against the route itself.
  const path = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/"

  const isActive = (href: string) =>
    path === href || (href !== "/" && path.startsWith(`${href}/`))

  useEffect(() => {
    if (!open) {
      return
    }
    const onOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onOutside)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("mousedown", onOutside)
      document.removeEventListener("keydown", onEscape)
    }
  }, [open])

  return (
    <div className="flex min-w-0 items-center gap-1.5 text-small-semi text-ui-fg-subtle">
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="true"
          className={clx(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors hover:bg-grey-5 hover:text-ui-fg-base",
            open && "bg-grey-5 text-ui-fg-base"
          )}
        >
          Shop by category
          <Chevron open={open} />
        </button>
        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-md border border-ui-border-base bg-white p-1.5 shadow-elevation-card-hover">
            {ALL_CATEGORIES.map((category) => (
              <LocalizedClientLink
                key={category.handle}
                href={`/categories/${category.handle}`}
                onClick={() => setOpen(false)}
                className={clx(
                  "block rounded-md px-3 py-2 text-small-regular transition-colors hover:bg-grey-5 hover:text-ui-fg-base",
                  isActive(`/categories/${category.handle}`)
                    ? "bg-brand-50 text-brand-700"
                    : "text-ui-fg-subtle"
                )}
              >
                {category.label}
              </LocalizedClientLink>
            ))}
          </div>
        )}
      </div>

      {PRIMARY_LINKS.map((link) => (
        <LocalizedClientLink
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={clx(
            "shrink-0 rounded-md px-2.5 py-1 transition-colors hover:bg-grey-5 hover:text-ui-fg-base",
            isActive(link.href) && "bg-brand-50 text-brand-700"
          )}
        >
          {link.label}
        </LocalizedClientLink>
      ))}
    </div>
  )
}

export default NavLinks
