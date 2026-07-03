"use server"

import { sdk } from "@lib/config"
import type { BitcoinExchangeRate } from "@lib/util/bitcoin-payment"

export const getBitcoinExchangeRate =
  async (): Promise<BitcoinExchangeRate | null> => {
    return sdk.client
      .fetch<{ bitcoin_exchange_rate: BitcoinExchangeRate }>(
        "/store/bitcoin-exchange-rate",
        {
          method: "GET",
          cache: "no-store",
        }
      )
      .then(({ bitcoin_exchange_rate }) => bitcoin_exchange_rate)
      .catch(() => null)
  }
