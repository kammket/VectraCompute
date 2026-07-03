"use server"

import type { BitcoinExchangeRate } from "@lib/util/bitcoin-payment"

export const getBitcoinExchangeRate =
  async (): Promise<BitcoinExchangeRate | null> => {
    try {
      const response = await fetch(
        "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
        {
          next: { revalidate: 60 },
        }
      )

      if (!response.ok) {
        return null
      }

      const json = await response.json()
      const usd = Number(json?.data?.rates?.USD)

      return Number.isFinite(usd)
        ? {
            usd,
            source: "Coinbase",
            fetched_at: new Date().toISOString(),
          }
        : null
    } catch {
      return null
    }
  }
