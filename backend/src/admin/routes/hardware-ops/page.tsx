import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ServerStack } from "@medusajs/icons";

const PANELS = [
  {
    title: "RFQ inbox",
    body: "Quote requests are persisted to data/rfq-inbox.jsonl and exposed at /admin/rfq for review or future CRM integration.",
    items: [
      "Review new requests daily",
      "Copy product, budget, GPU, and power/cooling context into the quote",
      "Move serious buyers into your CRM or sales pipeline",
    ],
  },
  {
    title: "Product publishing",
    body: "Every product page should score as Launch ready before paid traffic, email campaigns, or serious SEO work.",
    items: [
      "Upload real photos",
      "Assign category and sales channel",
      "Fill SEO, buyer FAQ, warranty, lead time, and technical metadata",
    ],
  },
  {
    title: "Order operations",
    body: "Use order metadata to keep expensive hardware orders visible from quote to deployment.",
    items: [
      "build_status",
      "procurement_status",
      "burn_in_status",
      "validation_report",
      "power_cooling_review",
      "shipping_status",
      "engineer_notes",
    ],
  },
  {
    title: "Bitcoin payments",
    body: "Use Bitcoin Payments to choose manual wallet checkout or BTCPay mode. Keep payment proof on the order before fulfillment.",
    items: [
      "Set active mode in Bitcoin Payments",
      "Capture btc_transaction_id and btc_confirmations",
      "Mark btc_payment_review before build release",
    ],
  },
  {
    title: "Trust evidence",
    body: "Premium AI hardware buyers need proof before spending. Keep these details current across products and orders.",
    items: [
      "Burn-in and validation notes",
      "Warranty and refurbished condition",
      "Power, cooling, and rack requirements",
      "Install and support handoff",
    ],
  },
];

const HardwareOpsPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <p
          style={{
            color: "#2563eb",
            fontSize: 12,
            fontWeight: 700,
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          VectraCompute management
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
          Hardware operations center
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: 14,
            lineHeight: 1.6,
            margin: "10px 0 24px",
            maxWidth: 760,
          }}
        >
          A practical management checklist for quote-led AI hardware sales:
          product readiness, RFQ follow-up, order operations, and trust
          evidence.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {PANELS.map((panel) => (
            <section
              key={panel.title}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: "#fff",
                padding: 18,
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                {panel.title}
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: "8px 0 14px",
                }}
              >
                {panel.body}
              </p>
              <ul
                style={{
                  display: "grid",
                  gap: 8,
                  margin: 0,
                  paddingLeft: 18,
                  color: "#374151",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {panel.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Hardware Ops",
  icon: ServerStack,
});

export default HardwareOpsPage;
