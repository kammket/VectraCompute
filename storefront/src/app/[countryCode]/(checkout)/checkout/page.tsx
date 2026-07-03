import { retrieveCart } from "@lib/data/cart"
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

  if (!cart) {
    return notFound()
  }

  return (
    <div className="bg-grey-5">
      <div className="content-container py-8 large:py-12">
        <div className="mb-8 border border-ui-border-base bg-white rounded-md p-5 large:p-6">
          <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_520px] gap-6 large:items-end">
            <div>
              <Text className="text-small-regular text-ui-fg-muted mb-2 uppercase">
                Secure AI hardware checkout
              </Text>
              <Heading level="h1" className="text-2xl large:text-3xl mb-3">
                Simple ordering with admin-reviewed fulfillment
              </Heading>
              <Text className="text-ui-fg-subtle max-w-3xl leading-7">
                Place the order in four steps. VectraCompute receives it in
                the admin dashboard for configuration review, payment
                coordination, validation, and fulfillment management.
              </Text>
            </div>
            <div className="grid grid-cols-2 small:grid-cols-4 gap-2 text-center text-small-regular">
              {["Address", "Delivery", "Payment", "Review"].map(
                (step, index) => (
                  <div
                    key={step}
                    className="border border-ui-border-base rounded-md px-2 py-3 bg-grey-5"
                  >
                    <span className="block text-ui-fg-muted mb-1">
                      Step {index + 1}
                    </span>
                    <span className="font-medium">{step}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 large:grid-cols-[minmax(0,1fr)_416px] gap-8 large:gap-10 items-start">
          <div className="border border-ui-border-base bg-white rounded-md p-5 large:p-6">
            <SimpleCheckoutForm />
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
