"use server"

import type { BitcoinPaymentSettings } from "@lib/util/bitcoin-payment"
import { getStoredPaymentSettings } from "@lib/data/store-settings"

// Owner-provided store wallet. Last-resort default so checkout always shows a
// payable address even if the admin setting, env vars, and backend are all
// unavailable. Update via /admin/settings, which overrides this.
const DEFAULT_WALLET_ADDRESS = "bc1qap7qchncnq5axlqalamwnrqauupw8h33qcdw2v"

type BackendPaymentSettings = {
  enabled?: boolean
  walletAddress?: string
  qrCodeImageUrl?: string
  instructions?: string
  requiredConfirmations?: number
  paymentExpiryMinutes?: number
}

const DEFAULT_INSTRUCTIONS =
  "Send the exact BTC amount shown and include your order number when contacting support."
const DEFAULT_QR_CODE_URL =
  "https://vectracompute-storefront.vercel.app/images/bitcoin-payment-qr.jpeg"

const buildSettings = (input: {
  walletAddress: string
  qrCodeImageUrl?: string
  instructions?: string
  requiredConfirmations?: number
  paymentExpiryMinutes?: number
}): BitcoinPaymentSettings => ({
  enabled: true,
  activeMode: "manual_wallet",
  manual: {
    walletAddress: input.walletAddress,
    qrCodeImageUrl: input.qrCodeImageUrl || DEFAULT_QR_CODE_URL,
    instructions: input.instructions || DEFAULT_INSTRUCTIONS,
    requiredConfirmations: Number(input.requiredConfirmations || 2),
    paymentExpiryMinutes: Number(input.paymentExpiryMinutes || 30),
    rateSourceNote: "BTC/USD rate is refreshed automatically.",
  },
  btcpay: {
    serverUrl: "",
    storeId: "",
    checkoutInstructions: "",
    webhookUrl: "",
    apiKeyConfigured: false,
  },
  updatedAt: new Date().toISOString(),
})

// Resolution order for the wallet and payment details:
//   1. Admin panel settings (vectra_settings table) — managed at /admin/settings
//   2. This deployment's env vars
//   3. The Railway backend's /api/payment-settings
//   4. The owner-provided default wallet address baked into the build
// Buyers therefore always see a payable address; the admin panel wins whenever
// it has a value.
export const getBitcoinPaymentSettings =
  async (): Promise<BitcoinPaymentSettings | null> => {
    // 1. Admin-managed settings from the database
    const stored = await getStoredPaymentSettings().catch(() => null)
    if (stored?.walletAddress) {
      return buildSettings({
        walletAddress: stored.walletAddress,
        qrCodeImageUrl: stored.qrCodeImageUrl || process.env.BITCOIN_QR_CODE_URL,
        instructions:
          stored.instructions || process.env.BITCOIN_PAYMENT_INSTRUCTIONS,
        requiredConfirmations:
          stored.requiredConfirmations ??
          Number(process.env.BITCOIN_REQUIRED_CONFIRMATIONS || 2),
        paymentExpiryMinutes:
          stored.paymentExpiryMinutes ??
          Number(process.env.BITCOIN_PAYMENT_EXPIRY || 30),
      })
    }

    // 2. Env vars on this deployment
    const walletAddress = process.env.BITCOIN_WALLET_ADDRESS
    if (walletAddress) {
      return buildSettings({
        walletAddress,
        qrCodeImageUrl: process.env.BITCOIN_QR_CODE_URL,
        instructions: process.env.BITCOIN_PAYMENT_INSTRUCTIONS,
        requiredConfirmations: Number(
          process.env.BITCOIN_REQUIRED_CONFIRMATIONS || 2
        ),
        paymentExpiryMinutes: Number(process.env.BITCOIN_PAYMENT_EXPIRY || 30),
      })
    }

    // 3. Railway backend settings
    const backendUrl = (
      process.env.AI_BACKEND_URL ||
      process.env.NEXT_PUBLIC_AI_BACKEND_URL ||
      ""
    )
      .trim()
      .replace(/\/$/, "")

    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/api/payment-settings`, {
          next: { revalidate: 60 },
        })
        if (response.ok) {
          const payload = (await response.json()) as BackendPaymentSettings
          if (payload.walletAddress) {
            return buildSettings({
              walletAddress: payload.walletAddress,
              qrCodeImageUrl: payload.qrCodeImageUrl || DEFAULT_QR_CODE_URL,
              instructions: payload.instructions,
              requiredConfirmations: payload.requiredConfirmations,
              paymentExpiryMinutes: payload.paymentExpiryMinutes,
            })
          }
        }
      } catch (error) {
        console.error("Backend payment settings fetch failed", error)
      }
    }

    // 4. Built-in default — checkout must never show an empty address
    return buildSettings({
      walletAddress: DEFAULT_WALLET_ADDRESS,
      qrCodeImageUrl: process.env.BITCOIN_QR_CODE_URL || DEFAULT_QR_CODE_URL,
      instructions: process.env.BITCOIN_PAYMENT_INSTRUCTIONS,
      requiredConfirmations: Number(
        process.env.BITCOIN_REQUIRED_CONFIRMATIONS || 2
      ),
      paymentExpiryMinutes: Number(process.env.BITCOIN_PAYMENT_EXPIRY || 30),
    })
  }
