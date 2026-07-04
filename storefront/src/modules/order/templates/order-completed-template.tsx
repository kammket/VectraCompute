import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import { isManual } from "@lib/constants"
import type {
  BitcoinExchangeRate,
  BitcoinPaymentSettings,
} from "@lib/util/bitcoin-payment"
import BitcoinPaymentInstructions from "@modules/order/components/bitcoin-payment-instructions"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
  bitcoinPaymentSettings: BitcoinPaymentSettings | null
  bitcoinExchangeRate: BitcoinExchangeRate | null
}

export default async function OrderCompletedTemplate({
  order,
  bitcoinPaymentSettings,
  bitcoinExchangeRate,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const isBitcoinAwaiting =
    bitcoinPaymentSettings?.enabled && isManual(payment?.provider_id)
  const nextSteps = isBitcoinAwaiting
    ? [
        "Order details are already visible in the admin account.",
        "Send the BTC amount shown on this page to the wallet address.",
        "Admin reviews the transaction ID and required confirmations.",
        "Fulfillment starts after Bitcoin payment is verified.",
      ]
    : [
        "Admin reviews the order record and buyer details.",
        "Configuration, warranty, refurbished condition, and lead time are checked.",
        "Payment, invoice, financing, or purchase order details are confirmed.",
        "The system is validated, packed, fulfilled, and supported.",
      ]

  return (
    <div className="bg-grey-5 py-8 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-5xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-8 max-w-5xl h-full bg-white border border-ui-border-base rounded-md w-full p-5 large:p-8"
          data-testid="order-complete-container"
        >
          <div className="border-b border-ui-border-base pb-8">
            <Text className="text-small-regular text-ui-fg-muted mb-2 uppercase">
              {isBitcoinAwaiting ? "Awaiting Bitcoin payment" : "Order received"}
            </Text>
            <Heading
              level="h1"
              className="flex flex-col gap-y-2 text-ui-fg-base text-2xl large:text-3xl mb-4"
            >
              <span>
                {isBitcoinAwaiting
                  ? "Your order is waiting for Bitcoin payment."
                  : "Your AI hardware order was placed successfully."}
              </span>
            </Heading>
            <Text className="text-ui-fg-subtle leading-7 max-w-3xl">
              {isBitcoinAwaiting
                ? "The order has already been sent to the VectraCompute Admin account. It will be confirmed after Bitcoin payment is detected, reviewed, and verified."
                : "The order is now available in the VectraCompute Admin account for review, payment coordination, validation planning, and fulfillment management."}
            </Text>
          </div>

          <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div className="flex flex-col gap-8">
              <OrderDetails order={order} />
              <div>
                <Heading level="h2" className="text-2xl mb-4">
                  Order summary
                </Heading>
                <Items order={order} />
                <CartTotals totals={order} />
              </div>
              <ShippingDetails order={order} />
              <BitcoinPaymentInstructions
                order={order}
                settings={bitcoinPaymentSettings}
                exchangeRate={bitcoinExchangeRate}
              />
              <PaymentDetails order={order} />
            </div>
            <aside className="border border-ui-border-base rounded-md bg-grey-5 p-5">
              <Heading level="h2" className="text-xl mb-4">
                Next steps
              </Heading>
              <div className="flex flex-col gap-4">
                {nextSteps.map((item, index) => (
                  <div key={item} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ui-bg-interactive text-ui-fg-on-color text-small-regular">
                      {index + 1}
                    </span>
                    <Text className="text-small-regular text-ui-fg-subtle leading-6">
                      {item}
                    </Text>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-md border border-brand-200 bg-brand-50 p-4">
                <Text className="text-small-semi text-brand-950">
                  Track this order anytime
                </Text>
                <Text className="mt-1 text-small-regular leading-6 text-brand-800">
                  Use order #{order.display_id} and your checkout email on the
                  order tracking page to follow payment review, build, and
                  shipping.
                </Text>
                <LocalizedClientLink
                  href={`/order/status?order=${order.display_id}&email=${encodeURIComponent(
                    order.email ?? ""
                  )}`}
                  className="mt-3 inline-flex h-9 items-center rounded-md bg-brand-600 px-3 text-small-semi text-white hover:bg-brand-700"
                >
                  Open order tracking
                </LocalizedClientLink>
              </div>
            </aside>
          </div>

          <Help />
        </div>
      </div>
    </div>
  )
}
