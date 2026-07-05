import { ImageResponse } from "next/og"

// Default social-share image for every page that doesn't define its own
// (product pages override this with their per-product card). Rendered as PNG
// because social scrapers reject SVG.
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "VectraCompute — AI Workstations & GPU Servers"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#111827",
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(37,99,235,0.38), transparent 55%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundColor: "#2563EB",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            VC
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>
            VECTRACOMPUTE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
            AI Workstations &amp; GPU Servers, Built to Order
          </div>
          <div style={{ fontSize: 28, color: "#9CA3AF", maxWidth: 900 }}>
            Burn-in tested, worldwide shipping, engineer-supported.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["Workstations", "GPU Servers", "Refurbished", "Components"].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  fontSize: 24,
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
