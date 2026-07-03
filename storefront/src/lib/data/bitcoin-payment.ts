"use server"

import { sdk } from "@lib/config"
import type { BitcoinPaymentSettings } from "@lib/util/bitcoin-payment"

export const getBitcoinPaymentSettings =
  async (): Promise<BitcoinPaymentSettings | null> => {
    return sdk.client
      .fetch<{ bitcoin_payment: BitcoinPaymentSettings }>(
        "/store/bitcoin-payment-settings",
        {
          method: "GET",
          cache: "no-store",
        }
      )
      .then(({ bitcoin_payment }) => bitcoin_payment)
      .catch(() => null)
  }
