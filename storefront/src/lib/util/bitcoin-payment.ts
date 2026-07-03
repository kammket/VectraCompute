export type BitcoinPaymentMode = "manual_wallet" | "btcpay"

export type BitcoinPaymentSettings = {
  enabled: boolean
  activeMode: BitcoinPaymentMode
  manual: {
    walletAddress: string
    qrCodeImageUrl: string
    instructions: string
    requiredConfirmations: number
    paymentExpiryMinutes: number
    rateSourceNote: string
  }
  btcpay: {
    serverUrl: string
    storeId: string
    checkoutInstructions: string
    webhookUrl: string
    apiKeyConfigured: boolean
  }
  updatedAt: string | null
}

export type BitcoinExchangeRate = {
  usd: number
  source: string
  fetched_at: string
}

export const isBitcoinCheckoutActive = (
  settings?: BitcoinPaymentSettings | null
) => Boolean(settings?.enabled && settings.activeMode)

const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
])

export const toMajorCurrencyAmount = (
  amount: number,
  currencyCode?: string
) => {
  if (!currencyCode) {
    return amount / 100
  }

  return ZERO_DECIMAL_CURRENCIES.has(currencyCode.toLowerCase())
    ? amount
    : amount / 100
}

export const formatBtcAmount = (
  amount: number,
  currencyCode: string | undefined,
  btcUsdRate?: number
) => {
  if (!btcUsdRate || btcUsdRate <= 0) {
    return null
  }

  const majorAmount = toMajorCurrencyAmount(amount, currencyCode)
  const btcAmount = majorAmount / btcUsdRate

  return `${btcAmount.toFixed(8)} BTC`
}
