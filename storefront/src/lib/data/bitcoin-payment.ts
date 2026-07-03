"use server"

import type { BitcoinPaymentSettings } from "@lib/util/bitcoin-payment"

export const getBitcoinPaymentSettings =
  async (): Promise<BitcoinPaymentSettings | null> => {
    const walletAddress = process.env.BITCOIN_WALLET_ADDRESS

    if (!walletAddress) {
      return null
    }

    return {
      enabled: true,
      activeMode: "manual_wallet",
      manual: {
        walletAddress,
        qrCodeImageUrl: process.env.BITCOIN_QR_CODE_URL || "",
        instructions:
          process.env.BITCOIN_PAYMENT_INSTRUCTIONS ||
          "Send the exact BTC amount shown and include your order number when contacting support.",
        requiredConfirmations: Number(
          process.env.BITCOIN_REQUIRED_CONFIRMATIONS || 2
        ),
        paymentExpiryMinutes: Number(process.env.BITCOIN_PAYMENT_EXPIRY || 30),
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
    }
  }
