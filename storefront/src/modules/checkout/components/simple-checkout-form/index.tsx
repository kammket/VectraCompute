"use client"

import { createSimpleOrder } from "@lib/data/simple-orders"
import type {
  BitcoinExchangeRate,
  BitcoinPaymentSettings,
} from "@lib/util/bitcoin-payment"
import { formatBtcAmount } from "@lib/util/bitcoin-payment"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { COUNTRIES } from "@lib/util/countries"
import type { ReactNode } from "react"
import { useActionState, useState } from "react"

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

const SectionHeader = ({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) => (
  <div className="flex gap-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-small-semi text-white">
      {step}
    </span>
    <div>
      <Heading level="h2" className="text-xl">
        {title}
      </Heading>
      <Text className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
        {description}
      </Text>
    </div>
  </div>
)

const Field = ({
  label,
  children,
  wide,
}: {
  label: string
  children: ReactNode
  wide?: boolean
}) => (
  <label
    className={`grid gap-1.5 text-small-regular text-ui-fg-base ${
      wide ? "small:col-span-2" : ""
    }`}
  >
    <span className="font-medium">{label}</span>
    {children}
  </label>
)

const BitcoinPreview = ({
  cart,
  settings,
  exchangeRate,
}: {
  cart: HttpTypes.StoreCart
  settings: BitcoinPaymentSettings | null
  exchangeRate: BitcoinExchangeRate | null
}) => {
  const walletAddress = settings?.manual.walletAddress?.trim() || ""
  const qrCodeImageUrl = settings?.manual.qrCodeImageUrl?.trim() || ""
  const btcAmount = formatBtcAmount(
    cart.total ?? 0,
    cart.currency_code,
    exchangeRate?.usd
  )
  const displayAmount = convertToLocale({
    amount: cart.total ?? 0,
    currency_code: cart.currency_code,
  })
  const active = Boolean(settings?.enabled)

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="bg-slate-950 px-4 py-4 text-white">
        <div className="flex flex-col gap-3 small:flex-row small:items-start small:justify-between">
          <div>
            <Text className="text-small-regular uppercase text-cyan-300">
              Bitcoin checkout
            </Text>
            <Heading level="h3" className="mt-1 text-xl text-white">
              Scan or copy payment details after placing the order
            </Heading>
            <Text className="mt-2 max-w-2xl text-small-regular leading-6 text-slate-300">
              Your order is saved first, then admin verifies the Bitcoin
              transaction before fulfillment starts.
            </Text>
          </div>
          <span className="w-fit rounded-full border border-amber-300 bg-amber-300 px-3 py-1 text-[12px] font-semibold text-amber-950">
            Awaiting BTC
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 large:grid-cols-[minmax(0,1fr)_180px]">
        <div className="grid gap-3">
          <div className="grid grid-cols-1 gap-3 small:grid-cols-2">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
              <Text className="txt-compact-small-plus text-emerald-950">
                Order total
              </Text>
              <Text className="mt-1 text-xl font-semibold text-emerald-950">
                {displayAmount}
              </Text>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <Text className="txt-compact-small-plus text-amber-950">
                Estimated BTC
              </Text>
              <Text className="mt-1 text-xl font-semibold text-amber-950">
                {btcAmount || "Rate loading"}
              </Text>
              {exchangeRate?.usd && (
                <Text className="mt-1 text-[11px] leading-5 text-amber-900">
                  Live rate from {exchangeRate.source}
                </Text>
              )}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <Text className="txt-compact-small-plus text-ui-fg-base">
                BTC receiving address
              </Text>
              {walletAddress ? (
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-900">
                  Connected
                </span>
              ) : (
                <span className="rounded-full bg-orange-100 px-2 py-1 text-[11px] font-semibold text-orange-900">
                  Address not visible
                </span>
              )}
            </div>
            <code className="block min-h-11 overflow-x-auto rounded-md border border-slate-200 bg-white px-3 py-3 text-[12px] text-ui-fg-base">
              {walletAddress ||
                "BITCOIN_WALLET_ADDRESS is not visible to checkout yet. Customers can scan the QR if it is configured, but the text address should be added on Railway."}
            </code>
          </div>

          {!active || !walletAddress ? (
            <div className="rounded-md border border-orange-200 bg-orange-50 p-4">
              <Text className="text-small-regular leading-6 text-orange-900">
                Bitcoin settings are partially configured. Add
                BITCOIN_WALLET_ADDRESS to the Railway backend and redeploy so
                customers can see the text wallet address here.
              </Text>
            </div>
          ) : (
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
              <Text className="text-small-regular leading-6 text-blue-950">
                {settings?.manual.instructions}
              </Text>
            </div>
          )}
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-center">
          {qrCodeImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrCodeImageUrl}
              alt="Bitcoin payment QR code"
              className="mx-auto aspect-square w-full rounded bg-white object-contain p-2"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-white px-3 text-[11px] leading-5 text-ui-fg-subtle">
              QR code URL is not configured
            </div>
          )}
          <Text className="mt-2 text-[11px] leading-5 text-ui-fg-muted">
            QR is shown again after order placement
          </Text>
        </div>
      </div>
    </div>
  )
}

export default function SimpleCheckoutForm({
  cart,
  bitcoinPaymentSettings,
  bitcoinExchangeRate,
}: {
  cart: HttpTypes.StoreCart
  bitcoinPaymentSettings: BitcoinPaymentSettings | null
  bitcoinExchangeRate: BitcoinExchangeRate | null
}) {
  const [state, formAction, pending] = useActionState(createSimpleOrder, {})
  const [paymentMethod, setPaymentMethod] = useState("bitcoin")

  return (
    <form action={formAction} className="grid gap-8">
      <SectionHeader
        step="1"
        title="Buyer and delivery information"
        description="Tell us who is receiving the system and where it should ship. This becomes the admin order record."
      />

      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-small-regular text-red-700">
          {state.error}
        </div>
      )}

      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 large:p-5">
        <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
          <Field label="Full name">
          <input name="customer_name" required className="checkout-input" />
          </Field>
          <Field label="Email">
          <input name="email" type="email" required className="checkout-input" />
          </Field>
          <Field label="Phone / WhatsApp">
          <input name="phone" required className="checkout-input" />
          </Field>
          <Field label="Company or organization">
          <input name="company" className="checkout-input" />
          </Field>
        </div>
      </div>

      <SectionHeader
        step="2"
        title="Delivery destination"
        description="Use the final delivery address so freight, warranty region, and delivery risk can be reviewed correctly."
      />

      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 large:p-5">
        <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
          <Field label="Delivery address" wide>
          <input name="address_1" required className="checkout-input" />
          </Field>
          <Field label="Address line 2">
          <input name="address_2" className="checkout-input" />
          </Field>
          <Field label="City">
          <input name="city" required className="checkout-input" />
          </Field>
          <Field label="State / province">
          <input name="province" className="checkout-input" />
          </Field>
          <Field label="Postal code">
          <input name="postal_code" className="checkout-input" />
          </Field>
          <Field label="Country" wide>
            <select
              name="country_code"
              defaultValue="us"
              required
              className="checkout-input"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-3 rounded-md border border-ui-border-base bg-grey-5 p-3">
          <p className="text-small-regular leading-6 text-ui-fg-subtle">
            <span className="font-medium text-ui-fg-base">
              We ship worldwide.
            </span>{" "}
            Delivery is handled by DHL, UPS, FedEx, and TNT depending on your
            country, fully insured at our cost. Don&apos;t see your country?{" "}
            <LocalizedClientLink href="/contact" className="text-brand-700 underline">
              Ask us
            </LocalizedClientLink>{" "}
            and we&apos;ll confirm the route.
          </p>
        </div>
      </div>

      <SectionHeader
        step="3"
        title="Payment method"
        description="Choose Bitcoin wallet payment or invoice. Bitcoin details are visible before and after the order is placed."
      />

      <div className="grid gap-3">
        <div className="grid grid-cols-1 gap-3 small:grid-cols-2">
          {paymentOptions.map((option, index) => (
            <label
              key={option.value}
              className="cursor-pointer rounded-md border border-slate-200 bg-white p-4 shadow-sm transition has-[:checked]:border-slate-950 has-[:checked]:bg-slate-50"
            >
              <input
                type="radio"
                name="payment_method"
                value={option.value}
                defaultChecked={index === 0}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mr-2"
              />
              <span className="text-base-semi">{option.title}</span>
              <span className="mt-2 block text-small-regular text-ui-fg-subtle leading-6">
                {option.description}
              </span>
            </label>
          ))}
        </div>

        {paymentMethod === "bitcoin" && (
          <BitcoinPreview
            cart={cart}
            settings={bitcoinPaymentSettings}
            exchangeRate={bitcoinExchangeRate}
          />
        )}

        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <Text className="text-small-semi text-ui-fg-base">
            What happens after you place the order
          </Text>
          <ol className="mt-3 grid gap-2 text-small-regular leading-6 text-ui-fg-subtle">
            <li>
              1. You get an order number and Bitcoin payment instructions.
            </li>
            <li>
              2. Admin sees the order immediately and reviews the payment
              status.
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

      <SectionHeader
        step="4"
        title="Engineering notes and confirmation"
        description="Add workload, rack, power, delivery timing, or transaction notes before submitting."
      />

      <Field label="Technical notes, target workload, rack/power limits, or BTC transaction ID">
        <textarea name="notes" rows={5} className="checkout-input resize-y" />
      </Field>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <Button type="submit" className="h-12 w-full" isLoading={pending}>
          Place secure order for admin review
        </Button>
        <Text className="mt-3 text-center text-[12px] leading-5 text-ui-fg-muted">
          Your order is saved before payment confirmation. Payment is reviewed
          manually before fulfillment.
        </Text>
      </div>
    </form>
  )
}
