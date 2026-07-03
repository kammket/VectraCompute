"use client"

import { FormEvent, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { clx } from "@modules/common/components/ui"

const DEFAULT_SUGGESTIONS = [
  "RTX 5090",
  "A100 server",
  "L40S",
  "RAG appliance",
  "NVMe storage",
  "800GbE",
]

const SearchIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
    <path
      d="m14.5 14.5 3 3M8.75 15.5a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
  </svg>
)

const ProductSearch = ({
  initialQuery = "",
  variant = "store",
  className,
  suggestions = DEFAULT_SUGGESTIONS,
}: {
  initialQuery?: string
  variant?: "nav" | "store"
  className?: string
  suggestions?: string[]
}) => {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const { countryCode } = useParams()

  const searchPath = (value: string) => {
    const trimmed = value.trim()
    const params = new URLSearchParams()

    if (trimmed) {
      params.set("query", trimmed)
    }

    const search = params.toString()
    return `/${countryCode}/store${search ? `?${search}` : ""}`
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(searchPath(query))
  }

  const runSuggestion = (value: string) => {
    setQuery(value)
    router.push(searchPath(value))
  }

  const isNav = variant === "nav"

  return (
    <div className={clx("w-full", className)}>
      <form
        onSubmit={submitSearch}
        role="search"
        aria-label="Search AI hardware products"
        className={clx(
          "flex w-full items-center border border-ui-border-base bg-white shadow-sm transition focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100",
          isNav ? "h-10 rounded-md" : "min-h-[56px] rounded-md"
        )}
      >
        <SearchIcon
          className={clx(
            "ml-4 shrink-0 text-ui-fg-muted",
            isNav ? "h-4 w-4" : "h-5 w-5"
          )}
        />
        <input
          type="search"
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            isNav
              ? "Search RTX, A100, L40S..."
              : "Search products by GPU, workload, category, or SKU"
          }
          className={clx(
            "min-w-0 flex-1 bg-transparent px-3 text-ui-fg-base outline-none placeholder:text-ui-fg-muted",
            isNav ? "text-small-regular" : "text-base"
          )}
        />
        {query.trim() && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              router.push(`/${countryCode}/store`)
            }}
            className="hidden px-2 text-small-regular text-ui-fg-subtle hover:text-ui-fg-base small:block"
          >
            Clear
          </button>
        )}
        <button
          type="submit"
          className={clx(
            "mr-2 inline-flex shrink-0 items-center justify-center rounded-md bg-brand-600 font-medium text-white transition hover:bg-brand-700",
            isNav ? "h-7 px-3 text-small-regular" : "h-10 px-5 text-base"
          )}
        >
          Search
        </button>
      </form>

      {!isNav && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-small-regular text-ui-fg-subtle">
            Popular searches:
          </span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => runSuggestion(suggestion)}
              className="rounded-md border border-ui-border-base bg-white px-3 py-1.5 text-small-semi text-ui-fg-base transition hover:border-brand-300 hover:text-brand-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductSearch
