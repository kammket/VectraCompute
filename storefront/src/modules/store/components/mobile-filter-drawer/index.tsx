"use client"

import { useEffect, useState } from "react"

// Below the large breakpoint, filters live behind a button and slide up as a
// dismissible bottom sheet, instead of stacking full-height above the product
// grid. Desktop renders the sidebar directly and never mounts this.
const MobileFilterDrawer = ({
  activeCount,
  children,
}: {
  activeCount: number
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onEscape)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onEscape)
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <div className="large:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-ui-border-base bg-white px-4 py-2.5 text-small-semi text-ui-fg-base shadow-elevation-card-rest"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
          <path
            d="M3 5h14M6 10h8M9 15h2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        Filters &amp; sort
        {activeCount > 0 && (
          <span className="ml-1 rounded-full bg-brand-600 px-2 py-0.5 text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-ui-border-base px-5 py-4">
              <span className="text-base-semi text-ui-fg-base">
                Filters &amp; sort
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-grey-5 text-ui-fg-base"
                aria-label="Close filters"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden>
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="grid gap-5 overflow-y-auto px-5 py-5">{children}</div>
            <div className="border-t border-ui-border-base p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-md bg-brand-600 px-4 py-3 text-small-semi text-white hover:bg-brand-700"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileFilterDrawer
