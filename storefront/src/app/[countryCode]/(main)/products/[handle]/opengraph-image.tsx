import { ImageResponse } from "next/og"

import { findLocalProductByHandle } from "@lib/catalog/local-catalog"

// Social platforms reject SVG og:images, so this renders a branded PNG card
// per product. File-based metadata overrides the config-based openGraph.images.
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "VectraCompute product card"

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = findLocalProductByHandle(handle)

  const title = product?.title ?? "VectraCompute"
  const category = product?.categories?.[0]?.name ?? "AI Hardware"
  const prices =
    product?.variants
      ?.map((variant) => variant.calculated_price?.calculated_amount)
      .filter((amount): amount is number => typeof amount === "number") ?? []
  const fromPrice = prices.length ? money(Math.min(...prices)) : null

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#111827",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(37,99,235,0.35), transparent 55%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: "#2563EB",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            VC
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>
            VECTRACOMPUTE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              textTransform: "uppercase",
              letterSpacing: 4,
              color: "#93C5FD",
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: title.length > 38 ? 52 : 64,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {fromPrice && (
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 26, color: "#9CA3AF" }}>From</span>
              <span style={{ fontSize: 44, fontWeight: 700 }}>{fromPrice}</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["Built to order", "Burn-in tested", "Lifetime support"].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  fontSize: 22,
                }}
              >
                {chip}
              </div>
            )
          )}
        </div>
      </div>
    ),
    size
  )
}
