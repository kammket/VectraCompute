import { retrieveCart } from "@lib/data/cart"
import { getBitcoinExchangeRate } from "@lib/data/bitcoin-exchange-rate"
import { getBitcoinPaymentSettings } from "@lib/data/bitcoin-payment"
import CheckoutTrustPanel from "@modules/checkout/components/checkout-trust-panel"
import SimpleCheckoutForm from "@modules/checkout/components/simple-checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Heading, Text } from "@modules/common/components/ui"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Secure Checkout | VectraCompute",
  description:
    "Complete your VectraCompute order with shipping, invoice/payment, configuration review, and engineering support for AI hardware.",
}

export default async function Checkout() {
  const cart = await retrieveCart()
  const bitcoinPaymentSettings = await getBitcoinPaymentSettings()
  const bitcoinExchangeRate = await getBitcoinExchangeRate()

  if (!cart) {
    return notFound()
  }

  return (
    <div className="bg-slate-50">
      <div className="content-container py-8 large:py-12">
        <div className="mb-8 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white large:px-7">
            <Text className="text-small-regular text-cyan-300 mb-2 uppercase">
              Secure AI hardware checkout
            </Text>
            <Heading level="h1" className="text-2xl large:text-3xl mb-3 text-white">
              Confirm delivery, payment, and engineering review
            </Heading>
            <Text className="text-slate-300 max-w-3xl leading-7">
              Place the order in a guided flow. VectraCompute receives it for
              configuration review, payment verification, burn-in planning, and
              insured fulfillment.
            </Text>
          </div>
          <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_520px] gap-6 p-5 large:items-center large:p-7">
            <div>
              <Text className="text-base-semi text-ui-fg-base">
                World-class checkout for high-value AI infrastructure
              </Text>
              <Text className="mt-2 text-small-regular text-ui-fg-subtle leading-6">
                Your order is not treated like a commodity cart. It is reviewed
                for GPU fit, power/cooling, delivery risk, warranty, and payment
                confirmation before release.
              </Text>
            </div>
            <div className="grid grid-cols-2 small:grid-cols-4 gap-2 text-center text-small-regular">
              {["Address", "Delivery", "Payment", "Review"].map(
                (step, index) => (
                  <div
                    key={step}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-3"
                  >
                    <span className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white">
                      {index + 1}
                    </span>
                    <span className="font-medium">{step}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_416px] gap-8 large:gap-10 items-start">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm large:p-6">
            <SimpleCheckoutForm
              cart={cart}
              bitcoinPaymentSettings={bitcoinPaymentSettings}
              bitcoinExchangeRate={bitcoinExchangeRate}
            />
          </div>
          <div className="flex flex-col gap-6 large:sticky large:top-24">
            <CheckoutSummary cart={cart} />
            <CheckoutTrustPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
