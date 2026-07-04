"use server"

import type { BitcoinPaymentSettings } from "@lib/util/bitcoin-payment"

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
    qrCodeImageUrl: input.qrCodeImageUrl || "",
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

// Wallet config is read from this deployment's env first, then from the
// Railway backend's /api/payment-settings. That way configuring the wallet
// once (on Railway) is enough for BOTH the AI chat flow and normal checkout —
// a missing Vercel env var no longer hides the payment address from buyers.
export const getBitcoinPaymentSettings =
  async (): Promise<BitcoinPaymentSettings | null> => {
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

    const backendUrl = (
      process.env.AI_BACKEND_URL ||
      process.env.NEXT_PUBLIC_AI_BACKEND_URL ||
      ""
    )
      .trim()
      .replace(/\/$/, "")

    if (!backendUrl) {
      return null
    }

    try {
      const response = await fetch(`${backendUrl}/api/payment-settings`, {
        next: { revalidate: 60 },
      })
      if (!response.ok) {
        return null
      }

      const payload = (await response.json()) as BackendPaymentSettings
      if (!payload.enabled || !payload.walletAddress) {
        return null
      }

      return buildSettings({
        walletAddress: payload.walletAddress,
        qrCodeImageUrl: payload.qrCodeImageUrl,
        instructions: payload.instructions,
        requiredConfirmations: payload.requiredConfirmations,
        paymentExpiryMinutes: payload.paymentExpiryMinutes,
      })
    } catch (error) {
      console.error("Backend payment settings fetch failed", error)
      return null
    }
  }
