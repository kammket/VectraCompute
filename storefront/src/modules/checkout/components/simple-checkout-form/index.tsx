"use client"

import { createSimpleOrder } from "@lib/data/simple-orders"
import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useActionState } from "react"

const paymentOptions = [
  {
    value: "bitcoin",
    title: "Bitcoin payment",
    description:
      "Order is saved first. You receive BTC instructions and admin confirms payment manually.",
  },
  {
    value: "invoice",
    title: "Invoice / purchase order",
    description:
      "Best for companies, labs, schools, resellers, and procurement teams.",
  },
]

export default function SimpleCheckoutForm() {
  const [state, formAction, pending] = useActionState(createSimpleOrder, {})

  return (
    <form action={formAction} className="grid gap-6">
      <div>
        <Text className="text-small-semi uppercase text-brand-600 mb-1">
          Secure order details
        </Text>
        <Heading level="h2" className="text-2xl">
          Buyer and delivery information
        </Heading>
        <Text className="mt-2 text-ui-fg-subtle leading-6">
          Your order goes to the admin dashboard first, then our team verifies
          configuration, availability, payment, warranty, and delivery.
        </Text>
      </div>

      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-small-regular text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <label className="grid gap-1 text-small-regular">
          Full name
          <input name="customer_name" required className="checkout-input" />
        </label>
        <label className="grid gap-1 text-small-regular">
          Email
          <input name="email" type="email" required className="checkout-input" />
        </label>
        <label className="grid gap-1 text-small-regular">
          Phone / WhatsApp
          <input name="phone" required className="checkout-input" />
        </label>
        <label className="grid gap-1 text-small-regular">
          Company or organization
          <input name="company" className="checkout-input" />
        </label>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <label className="grid gap-1 text-small-regular small:col-span-2">
          Delivery address
          <input name="address_1" required className="checkout-input" />
        </label>
        <label className="grid gap-1 text-small-regular">
          Address line 2
          <input name="address_2" className="checkout-input" />
        </label>
        <label className="grid gap-1 text-small-regular">
          City
          <input name="city" required className="checkout-input" />
        </label>
        <label className="grid gap-1 text-small-regular">
          State / province
          <input name="province" className="checkout-input" />
        </label>
        <label className="grid gap-1 text-small-regular">
          Postal code
          <input name="postal_code" className="checkout-input" />
        </label>
        <label className="grid gap-1 text-small-regular">
          Country code
          <input name="country_code" defaultValue="us" className="checkout-input" />
        </label>
      </div>

      <div className="grid gap-3">
        <Text className="text-base-semi">Payment preference</Text>
        <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
          {paymentOptions.map((option, index) => (
            <label
              key={option.value}
              className="rounded-md border border-ui-border-base bg-grey-5 p-4 cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
            >
              <input
                type="radio"
                name="payment_method"
                value={option.value}
                defaultChecked={index === 0}
                className="mr-2"
              />
              <span className="text-base-semi">{option.title}</span>
              <span className="mt-2 block text-small-regular text-ui-fg-subtle leading-6">
                {option.description}
              </span>
            </label>
          ))}
        </div>

        {/* Set expectations at the moment of highest hesitation, before the
            order is placed — not only on the confirmation page. */}
        <div className="rounded-md border border-ui-border-base bg-grey-5 p-4">
          <Text className="text-small-semi text-ui-fg-base">
            What happens after you place the order
          </Text>
          <ol className="mt-2 grid gap-1.5 text-small-regular leading-6 text-ui-fg-subtle">
            <li>
              1. You get an order number and the exact BTC amount at a live
              rate, locked for the payment window.
            </li>
            <li>
              2. You send payment; our team verifies it on-chain — you can
              watch each stage on the order tracking page.
            </li>
            <li>
              3. Your system is built, burn-in tested, and shipped insured.
              Most configurations ship 3–7 business days after confirmation.
            </li>
          </ol>
          <LocalizedClientLink
            href="/resources/how-bitcoin-payment-works"
            className="mt-2 inline-block text-small-semi text-brand-700 underline hover:text-brand-800"
          >
            Read the full payment process
          </LocalizedClientLink>
        </div>
      </div>

      <label className="grid gap-1 text-small-regular">
        Technical notes, target workload, rack/power limits, or BTC transaction ID
        <textarea name="notes" rows={5} className="checkout-input resize-y" />
      </label>

      <Button type="submit" className="h-11 w-full" isLoading={pending}>
        Place secure order for admin review
      </Button>
    </form>
  )
}
