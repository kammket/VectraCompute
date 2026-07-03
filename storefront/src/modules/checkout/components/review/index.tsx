"use client"

import { Heading, Text, clx } from "@modules/common/components/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { isManual } from "@lib/constants"
import type {
  BitcoinExchangeRate,
  BitcoinPaymentSettings,
} from "@lib/util/bitcoin-payment"

const Review = ({
  cart,
  bitcoinPaymentSettings,
  bitcoinExchangeRate,
}: {
  cart: HttpTypes.StoreCart
  bitcoinPaymentSettings: BitcoinPaymentSettings | null
  bitcoinExchangeRate: BitcoinExchangeRate | null
}) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards &&
    ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])
      ?.length > 0 &&
    cart?.total === 0
  )

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]
  const bitcoinManualCheckout =
    bitcoinPaymentSettings?.enabled && isManual(paymentSession?.provider_id)
  const bitcoinSetupMissing =
    bitcoinManualCheckout &&
    bitcoinPaymentSettings?.activeMode === "manual_wallet" &&
    (!bitcoinPaymentSettings.manual.walletAddress ||
      !bitcoinExchangeRate?.usd)

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                By clicking Place Order, you confirm the configuration, delivery
                details, and payment method.{" "}
                {bitcoinManualCheckout
                  ? "Your order will be created for Bitcoin payment review, and VectraCompute will confirm the transaction before fulfillment."
                  : "For invoice/manual payment orders, VectraCompute may review lead time, configuration fit, and procurement details before fulfillment."}
              </Text>
              <div className="grid grid-cols-1 small:grid-cols-3 gap-3 mt-5">
                {[
                  "Admin receives the order instantly",
                  bitcoinManualCheckout
                    ? "BTC transaction ID and confirmations are reviewed"
                    : "Configuration and lead time are checked",
                  bitcoinManualCheckout
                    ? "Fulfillment starts after payment confirmation"
                    : "Fulfillment is managed from the order record",
                ].map((item) => (
                  <div
                    key={item}
                    className="border border-ui-border-base rounded-md bg-grey-5 px-3 py-3"
                  >
                    <Text className="text-small-regular text-ui-fg-subtle leading-6">
                      {item}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {bitcoinSetupMissing && (
            <div className="mb-5 rounded-md border border-orange-200 bg-orange-50 p-4">
              <Text className="text-small-regular text-orange-900 leading-6">
                Bitcoin checkout is enabled, but Admin must add a BTC wallet
                address and the live BTC/USD rate must be available before
                customers can place Bitcoin orders.
              </Text>
            </div>
          )}
          <PaymentButton
            cart={cart}
            bitcoinPaymentSettings={bitcoinPaymentSettings}
            bitcoinExchangeRate={bitcoinExchangeRate}
            data-testid="submit-order-button"
          />
        </>
      )}
    </div>
  )
}

export default Review
