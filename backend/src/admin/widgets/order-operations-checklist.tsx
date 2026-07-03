import { defineWidgetConfig } from "@medusajs/admin-sdk";
import type { AdminOrder, DetailWidgetProps } from "@medusajs/types";

const getMeta = (order: AdminOrder, key: string) => {
  const value = order.metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
};

const getBuildStatus = (order: AdminOrder) =>
  getMeta(order, "build_status") || "Not started";

const getOpsStatus = (order: AdminOrder) => {
  const paymentReady = order.payment_status === "captured";
  const hasFulfillment = Boolean(order.fulfillments?.length);
  const buildStatus = getBuildStatus(order).toLowerCase();

  if (hasFulfillment) {
    return "Fulfillment active";
  }

  if (buildStatus.includes("burn") || buildStatus.includes("test")) {
    return "Validation in progress";
  }

  if (paymentReady) {
    return "Ready for build review";
  }

  return "Waiting for payment / quote review";
};

const OPERATION_FIELDS = [
  ["btc_transaction_id", "BTC transaction ID"],
  ["btc_confirmations", "BTC confirmations"],
  ["btc_payment_review", "BTC payment review"],
  ["build_status", "Build status"],
  ["procurement_status", "Procurement status"],
  ["burn_in_status", "Burn-in status"],
  ["validation_report", "Validation report"],
  ["power_cooling_review", "Power / cooling review"],
  ["shipping_status", "Shipping status"],
  ["engineer_notes", "Engineer notes"],
] as const;

const OrderOperationsChecklist = ({
  data: order,
}: DetailWidgetProps<AdminOrder>) => {
  const completedFields = OPERATION_FIELDS.filter(([key]) =>
    Boolean(getMeta(order, key))
  );
  const progress = Math.round(
    (completedFields.length / OPERATION_FIELDS.length) * 100
  );

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        background: "#fff",
      }}
    >
      <p
        style={{
          color: "#2563eb",
          fontSize: 12,
          fontWeight: 700,
          margin: "0 0 4px",
          textTransform: "uppercase",
        }}
      >
        Hardware operations
      </p>
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
        {getOpsStatus(order)}
      </h2>
      <p style={{ color: "#6b7280", fontSize: 13, margin: "6px 0 14px" }}>
        Track build, procurement, validation, shipping, and deployment context
        using order metadata fields.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 14,
          fontSize: 13,
        }}
      >
        <div
          style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 10 }}
        >
          <strong>Payment</strong>
          <div style={{ color: "#6b7280", marginTop: 4 }}>
            {order.payment_status}
          </div>
        </div>
        <div
          style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 10 }}
        >
          <strong>Fulfillment</strong>
          <div style={{ color: "#6b7280", marginTop: 4 }}>
            {order.fulfillment_status}
          </div>
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
            width: `${progress}%`,
            height: "100%",
            background: "#2563eb",
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
        {OPERATION_FIELDS.map(([key, label]) => {
          const value = getMeta(order, key);

          return (
            <div
              key={key}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr",
                gap: 8,
                alignItems: "start",
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
                  background: value ? "#dcfce7" : "#fef3c7",
                  color: value ? "#166534" : "#92400e",
                  fontWeight: 800,
                }}
              >
                {value ? "✓" : "!"}
              </span>
              <span>
                <strong>{label}</strong>
                <span style={{ color: "#6b7280" }}>
                  {" "}
                  — {value || `Add metadata key "${key}"`}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
});

export default OrderOperationsChecklist;
