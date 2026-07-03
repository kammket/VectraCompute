"use client";

import { defineRouteConfig } from "@medusajs/admin-sdk";
import { CreditCard } from "@medusajs/icons";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type BitcoinPaymentMode = "manual_wallet" | "btcpay";

type BitcoinPaymentSettings = {
  enabled: boolean;
  activeMode: BitcoinPaymentMode;
  manual: {
    walletAddress: string;
    qrCodeImageUrl: string;
    instructions: string;
    requiredConfirmations: number;
    paymentExpiryMinutes: number;
    rateSourceNote: string;
  };
  btcpay: {
    serverUrl: string;
    storeId: string;
    checkoutInstructions: string;
    webhookUrl: string;
    apiKeyConfigured: boolean;
  };
  updatedAt: string | null;
};

const EMPTY_SETTINGS: BitcoinPaymentSettings = {
  enabled: false,
  activeMode: "manual_wallet",
  manual: {
    walletAddress: "",
    qrCodeImageUrl: "",
    instructions:
      "Send the exact BTC amount shown on your invoice, then reply with the transaction ID. Orders are released after confirmation review.",
    requiredConfirmations: 2,
    paymentExpiryMinutes: 60,
    rateSourceNote:
      "BTC/USD is calculated automatically from a live market-rate API and may be rechecked before fulfillment.",
  },
  btcpay: {
    serverUrl: "",
    storeId: "",
    checkoutInstructions:
      "A BTCPay invoice will be generated during checkout. The order remains under admin review until the payment is verified.",
    webhookUrl: "",
    apiKeyConfigured: false,
  },
  updatedAt: null,
};

const fieldStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 13,
  background: "#fff",
} as const;

const labelStyle = {
  display: "grid",
  gap: 6,
  color: "#111827",
  fontSize: 13,
  fontWeight: 650,
} as const;

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  background: "#fff",
  padding: 18,
} as const;

const BitcoinPaymentsPage = () => {
  const [settings, setSettings] =
    useState<BitcoinPaymentSettings>(EMPTY_SETTINGS);
  const [status, setStatus] = useState("Loading payment settings...");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/admin/bitcoin-payment-settings")
      .then((response) => response.json())
      .then((payload) => {
        setSettings(payload.bitcoin_payment ?? EMPTY_SETTINGS);
        setStatus("Settings loaded");
      })
      .catch(() => setStatus("Could not load settings"));
  }, []);

  const updateRoot = <Key extends keyof BitcoinPaymentSettings>(
    key: Key,
    value: BitcoinPaymentSettings[Key]
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const updateManual = (
    key: keyof BitcoinPaymentSettings["manual"],
    value: string | number
  ) => {
    setSettings((current) => ({
      ...current,
      manual: { ...current.manual, [key]: value },
    }));
  };

  const updateBtcpay = (
    key: keyof BitcoinPaymentSettings["btcpay"],
    value: string | boolean
  ) => {
    setSettings((current) => ({
      ...current,
      btcpay: { ...current.btcpay, [key]: value },
    }));
  };

  const handleNumber =
    (field: keyof BitcoinPaymentSettings["manual"]) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateManual(field, Number(event.target.value));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus("Saving...");

    try {
      const response = await fetch("/admin/bitcoin-payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const payload = await response.json();
      setSettings(payload.bitcoin_payment ?? settings);
      setStatus("Bitcoin payment settings saved");
    } catch {
      setStatus("Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 1120, margin: "0 auto" }}>
        <p
          style={{
            color: "#2563eb",
            fontSize: 12,
            fontWeight: 700,
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          Checkout payments
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
          Bitcoin payment settings
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: 14,
            lineHeight: 1.6,
            margin: "10px 0 24px",
            maxWidth: 820,
          }}
        >
          Choose which Bitcoin checkout stage is active. Manual wallet mode is
          ready now. BTCPay mode stores the configuration you will use for
          automated invoice generation and webhooks.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 320px",
            gap: 16,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 16 }}>
            <section style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 750, margin: 0 }}>
                Active checkout mode
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                  marginTop: 14,
                }}
              >
                <label style={labelStyle}>
                  Status
                  <select
                    style={fieldStyle}
                    value={settings.enabled ? "enabled" : "disabled"}
                    onChange={(event) =>
                      updateRoot("enabled", event.target.value === "enabled")
                    }
                  >
                    <option value="enabled">Enabled in checkout</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </label>
                <label style={labelStyle}>
                  Bitcoin mode
                  <select
                    style={fieldStyle}
                    value={settings.activeMode}
                    onChange={(event) =>
                      updateRoot(
                        "activeMode",
                        event.target.value as BitcoinPaymentMode
                      )
                    }
                  >
                    <option value="manual_wallet">Stage 1: Manual wallet</option>
                    <option value="btcpay">Stage 2: BTCPay Server</option>
                  </select>
                </label>
              </div>
            </section>

            <section style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 750, margin: 0 }}>
                Stage 1: Manual wallet
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: "8px 0 14px",
                }}
              >
                Customers see your BTC receiving address and QR image after
                selecting manual Bitcoin checkout. You confirm the transaction
                manually in the order record before fulfillment.
              </p>
              <div style={{ display: "grid", gap: 12 }}>
                <label style={labelStyle}>
                  BTC wallet receiving address
                  <input
                    style={fieldStyle}
                    value={settings.manual.walletAddress}
                    onChange={(event) =>
                      updateManual("walletAddress", event.target.value)
                    }
                    placeholder="bc1..."
                  />
                </label>
                <label style={labelStyle}>
                  QR code image URL
                  <input
                    style={fieldStyle}
                    value={settings.manual.qrCodeImageUrl}
                    onChange={(event) =>
                      updateManual("qrCodeImageUrl", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </label>
                <label style={labelStyle}>
                  Customer instructions
                  <textarea
                    style={{ ...fieldStyle, minHeight: 96, resize: "vertical" }}
                    value={settings.manual.instructions}
                    onChange={(event) =>
                      updateManual("instructions", event.target.value)
                    }
                  />
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                  }}
                >
                  <label style={labelStyle}>
                    Required confirmations
                    <input
                      type="number"
                      min={1}
                      style={fieldStyle}
                      value={settings.manual.requiredConfirmations}
                      onChange={handleNumber("requiredConfirmations")}
                    />
                  </label>
                  <label style={labelStyle}>
                    Payment window, minutes
                    <input
                      type="number"
                      min={5}
                      style={fieldStyle}
                      value={settings.manual.paymentExpiryMinutes}
                      onChange={handleNumber("paymentExpiryMinutes")}
                    />
                  </label>
                </div>
                <div
                  style={{
                    border: "1px solid #dbeafe",
                    borderRadius: 8,
                    background: "#eff6ff",
                    padding: 12,
                    color: "#1e3a8a",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  BTC/USD is calculated automatically at checkout using a live
                  market-rate endpoint. Admin only needs to manage the wallet
                  address, QR image, payment window, and customer instructions.
                </div>
                <label style={labelStyle}>
                  Rate note shown to customer
                  <input
                    style={fieldStyle}
                    value={settings.manual.rateSourceNote}
                    onChange={(event) =>
                      updateManual("rateSourceNote", event.target.value)
                    }
                    placeholder="Rate checked before fulfillment"
                  />
                </label>
              </div>
            </section>

            <section style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 750, margin: 0 }}>
                Stage 2: BTCPay Server
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: "8px 0 14px",
                }}
              >
                Store the public BTCPay details here so you can activate BTCPay
                mode when invoice automation is connected. Use a watch-only
                wallet or xpub in BTCPay, never a seed phrase in this store.
              </p>
              <div style={{ display: "grid", gap: 12 }}>
                <label style={labelStyle}>
                  BTCPay server URL
                  <input
                    style={fieldStyle}
                    value={settings.btcpay.serverUrl}
                    onChange={(event) =>
                      updateBtcpay("serverUrl", event.target.value)
                    }
                    placeholder="https://btcpay.yourdomain.com"
                  />
                </label>
                <label style={labelStyle}>
                  BTCPay store ID
                  <input
                    style={fieldStyle}
                    value={settings.btcpay.storeId}
                    onChange={(event) =>
                      updateBtcpay("storeId", event.target.value)
                    }
                  />
                </label>
                <label style={labelStyle}>
                  Checkout instructions
                  <textarea
                    style={{ ...fieldStyle, minHeight: 88, resize: "vertical" }}
                    value={settings.btcpay.checkoutInstructions}
                    onChange={(event) =>
                      updateBtcpay("checkoutInstructions", event.target.value)
                    }
                  />
                </label>
                <label style={labelStyle}>
                  Webhook URL or note
                  <input
                    style={fieldStyle}
                    value={settings.btcpay.webhookUrl}
                    onChange={(event) =>
                      updateBtcpay("webhookUrl", event.target.value)
                    }
                    placeholder="https://your-site.com/api/btcpay/webhook"
                  />
                </label>
                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    color: "#111827",
                    fontSize: 13,
                    fontWeight: 650,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={settings.btcpay.apiKeyConfigured}
                    onChange={(event) =>
                      updateBtcpay("apiKeyConfigured", event.target.checked)
                    }
                  />
                  API key configured securely outside this page
                </label>
              </div>
            </section>
          </div>

          <aside style={{ ...cardStyle, position: "sticky", top: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 750, margin: 0 }}>
              Safety notes
            </h2>
            <ul
              style={{
                display: "grid",
                gap: 10,
                color: "#4b5563",
                fontSize: 13,
                lineHeight: 1.5,
                margin: "12px 0 18px",
                paddingLeft: 18,
              }}
            >
              <li>Only enter a public receiving address or QR image URL.</li>
              <li>Never enter a private key, seed phrase, or exchange login.</li>
              <li>Confirm transaction ID and confirmations before shipping.</li>
              <li>Confirm live-rate amount before releasing expensive orders.</li>
              <li>Use order metadata for BTC txid, confirmation count, and review notes.</li>
            </ul>
            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                border: "0",
                borderRadius: 8,
                padding: "11px 14px",
                color: "#fff",
                background: saving ? "#6b7280" : "#111827",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: 750,
              }}
            >
              {saving ? "Saving..." : "Save Bitcoin settings"}
            </button>
            <p style={{ color: "#6b7280", fontSize: 12, margin: "12px 0 0" }}>
              {status}
            </p>
            {settings.updatedAt && (
              <p style={{ color: "#9ca3af", fontSize: 12, margin: "6px 0 0" }}>
                Last updated {new Date(settings.updatedAt).toLocaleString()}
              </p>
            )}
          </aside>
        </div>
      </form>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Bitcoin Payments",
  icon: CreditCard,
});

export default BitcoinPaymentsPage;
