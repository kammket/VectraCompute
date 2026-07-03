import { defineWidgetConfig } from "@medusajs/admin-sdk";
import type { AdminProduct, DetailWidgetProps } from "@medusajs/types";

type Check = {
  label: string;
  help: string;
  done: boolean;
};

const getMeta = (product: AdminProduct, key: string) => {
  const value = product.metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
};

const hasPrice = (product: AdminProduct) =>
  Boolean(
    product.variants?.some((variant) =>
      variant.prices?.some((price) => Boolean(price.amount))
    )
  );

const buildChecks = (product: AdminProduct): Check[] => [
  {
    label: "Product photo uploaded",
    help: "Upload at least one clean product image before publishing.",
    done: Boolean(product.thumbnail || product.images?.length),
  },
  {
    label: "Organized category",
    help: "Assign a primary category so the storefront, filters, and footer can group it correctly.",
    done: Boolean(product.categories?.length),
  },
  {
    label: "Sales channel assigned",
    help: "Add the product to the storefront sales channel.",
    done: Boolean(product.sales_channels?.length),
  },
  {
    label: "Readable variants and SKUs",
    help: "Use configuration names buyers can understand, plus unique SKUs for quoting and procurement.",
    done: Boolean(
      product.variants?.length &&
        product.variants.every((variant) => variant.title && variant.sku)
    ),
  },
  {
    label: "Pricing or quote guidance",
    help: "Set prices for checkout products, or use metadata lead_time/financing for quote-led systems.",
    done: hasPrice(product) || Boolean(getMeta(product, "lead_time")),
  },
  {
    label: "SEO title and description",
    help: "Fill seo_title and seo_description so the public product page can rank cleanly.",
    done: Boolean(
      getMeta(product, "seo_title") && getMeta(product, "seo_description")
    ),
  },
  {
    label: "Search keywords",
    help: "Add seo_keywords with common search names like H200 NVL server or Jetson Thor kit.",
    done: Boolean(getMeta(product, "seo_keywords")),
  },
  {
    label: "Buyer fit",
    help: "Add best_for so buyers immediately understand the workload fit.",
    done: Boolean(getMeta(product, "best_for")),
  },
  {
    label: "Trust note",
    help: "Explain validation, testing, compatibility review, or refurbished condition clearly.",
    done: Boolean(getMeta(product, "trust_note")),
  },
  {
    label: "Warranty and lead time",
    help: "Fill warranty and lead_time for procurement confidence.",
    done: Boolean(
      getMeta(product, "warranty") && getMeta(product, "lead_time")
    ),
  },
  {
    label: "Technical specs",
    help: "For AI hardware, add gpu_memory, power_draw, networking, rack_units, or equivalent technical metadata.",
    done: Boolean(
      getMeta(product, "gpu_memory") ||
        getMeta(product, "power_draw") ||
        getMeta(product, "networking") ||
        getMeta(product, "rack_units")
    ),
  },
  {
    label: "Buyer FAQ",
    help: "Add buyer_faq to answer objections directly on the product page.",
    done: Boolean(getMeta(product, "buyer_faq")),
  },
  {
    label: "Support and install notes",
    help: "Add support_level and install_support to show technical follow-through.",
    done: Boolean(
      getMeta(product, "support_level") && getMeta(product, "install_support")
    ),
  },
  {
    label: "Certifications / validation markers",
    help: "Add certifications such as burn-in tested, thermal checked, CUDA validated, or facility reviewed.",
    done: Boolean(getMeta(product, "certifications")),
  },
];

const getReadinessLabel = (score: number) => {
  if (score >= 90) {
    return "Launch ready";
  }

  if (score >= 70) {
    return "Almost ready";
  }

  if (score >= 45) {
    return "Needs cleanup";
  }

  return "Not ready";
};

const ProductPublishingChecklist = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const checks = buildChecks(product);
  const complete = checks.filter((check) => check.done).length;
  const score = Math.round((complete / checks.length) * 100);
  const missing = checks.filter((check) => !check.done);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div>
          <p
            style={{
              color: "#2563eb",
              fontSize: 12,
              fontWeight: 700,
              margin: "0 0 4px",
              textTransform: "uppercase",
            }}
          >
            Product readiness
          </p>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            {getReadinessLabel(score)}
          </h2>
          <p style={{ color: "#6b7280", fontSize: 13, margin: "6px 0 0" }}>
            {complete} of {checks.length} management checks complete for SEO,
            trust, storefront organization, and quote readiness.
          </p>
        </div>
        <div
          style={{
            minWidth: 72,
            borderRadius: 8,
            background: score >= 90 ? "#dcfce7" : "#eff6ff",
            color: score >= 90 ? "#166534" : "#1d4ed8",
            padding: "10px 12px",
            textAlign: "center",
            fontWeight: 800,
          }}
        >
          {score}%
        </div>
      </div>

      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: "#f3f4f6",
          overflow: "hidden",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            background: score >= 90 ? "#16a34a" : "#2563eb",
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {checks.map((check) => (
          <div
            key={check.label}
            style={{
              display: "grid",
              gridTemplateColumns: "20px 1fr",
              gap: 8,
              alignItems: "start",
              fontSize: 13,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: check.done ? "#dcfce7" : "#fef3c7",
                color: check.done ? "#166534" : "#92400e",
                fontWeight: 800,
              }}
            >
              {check.done ? "✓" : "!"}
            </span>
            <span>
              <strong>{check.label}</strong>
              {!check.done && (
                <span style={{ color: "#6b7280" }}> — {check.help}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {missing.length > 0 && (
        <div
          style={{
            marginTop: 14,
            borderTop: "1px solid #e5e7eb",
            paddingTop: 12,
            color: "#374151",
            fontSize: 13,
          }}
        >
          <strong>Next admin action:</strong> complete {missing[0].label}.
        </div>
      )}
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductPublishingChecklist;
