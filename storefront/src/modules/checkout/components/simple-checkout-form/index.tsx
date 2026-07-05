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
import CopyButton from "@modules/common/components/copy-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { COUNTRIES } from "@lib/util/countries"
import type { ReactNode } from "react"
import { useActionState, useRef, useState } from "react"

const paymentOptions = [
  {
    value: "bitcoin",
    title: "Bitcoin payment",
    description:
      "Fast and secure. You get the exact amount and wallet address on the next step.",
  },
  {
    value: "invoice",
    title: "Invoice / purchase order",
    description:
      "Best for companies, labs, schools, resellers, and procurement teams.",
  },
]

const REQUIRED_STEP1 = [
  "customer_name",
  "email",
  "phone",
  "address_1",
  "city",
  "country_code",
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
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grey-90 text-small-semi text-white">
      {step}
    </span>
    <div>
      <Heading level="h2" className="text-lg small:text-xl">
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

const TRUST_POINTS = [
  "Your order is locked in the moment you place it — the price and BTC amount won't change on you.",
  "Every system is built to order and burn-in tested for 24 hours before it ships, fully insured at our cost.",
  "Backed by up to a 5-year warranty and lifetime engineer support.",
]

const BitcoinPayPanel = ({
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

  return (
    <div className="overflow-hidden rounded-md border border-ui-border-base bg-white">
      <div className="bg-grey-90 px-4 py-4 text-white small:px-5">
        <Text className="text-small-regular uppercase tracking-wide text-brand-200">
          Complete your Bitcoin payment
        </Text>
        <Heading level="h3" className="mt-1 text-lg text-white small:text-xl">
          Send the exact amount to the wallet below
        </Heading>
        <Text className="mt-2 text-small-regular leading-6 text-grey-20">
          Pay from any wallet or exchange. As soon as your payment is detected,
          our team verifies it and your build begins.
        </Text>
      </div>

      <div className="grid gap-4 p-4 small:p-5">
        <div className="grid grid-cols-1 gap-3 small:grid-cols-2">
          <div className="rounded-md border border-ui-border-base bg-grey-5 p-4">
            <Text className="txt-compact-small-plus text-ui-fg-subtle">
              Order total
            </Text>
            <Text className="mt-1 text-2xl font-semibold text-ui-fg-base">
              {displayAmount}
            </Text>
          </div>
          <div className="rounded-md border border-brand-200 bg-brand-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <Text className="txt-compact-small-plus text-brand-900">
                Amount to send
              </Text>
              {btcAmount && (
                <CopyButton
                  value={btcAmount.replace(/\s*BTC$/, "")}
                  label="Copy"
                />
              )}
            </div>
            <Text className="mt-1 text-2xl font-semibold text-brand-900">
              {btcAmount || "Calculating…"}
            </Text>
            {exchangeRate?.usd && (
              <Text className="mt-1 text-[11px] leading-5 text-brand-800">
                Live rate from {exchangeRate.source}, locked for your payment
                window.
              </Text>
            )}
          </div>
        </div>

        {/* Prominent, always-visible wallet address with copy */}
        <div className="rounded-md border-2 border-brand-500 bg-white p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Text className="text-small-semi text-ui-fg-base">
              Bitcoin wallet address
            </Text>
            {walletAddress && (
              <CopyButton value={walletAddress} label="Copy address" />
            )}
          </div>
          <code className="block break-all rounded-md border border-ui-border-base bg-grey-5 px-3 py-3 text-[13px] font-medium text-ui-fg-base">
            {walletAddress || "Loading payment address…"}
          </code>
          <Text className="mt-2 text-[11px] leading-5 text-ui-fg-muted">
            Send only Bitcoin (BTC) to this address. Double-check it matches
            before sending.
          </Text>
        </div>

        {qrCodeImageUrl && (
          <div className="flex flex-col items-center gap-2 rounded-md border border-ui-border-base bg-grey-5 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeImageUrl}
              alt="Bitcoin payment QR code"
              className="h-40 w-40 rounded bg-white object-contain p-2"
            />
            <Text className="text-[11px] leading-5 text-ui-fg-muted">
              Or scan this QR with your wallet app
            </Text>
          </div>
        )}

        {/* Reassurance: what happens after they pay */}
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
          <Text className="text-small-semi text-emerald-950">
            You&apos;re in good hands after payment
          </Text>
          <ul className="mt-2 grid gap-2 text-small-regular leading-6 text-emerald-900">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              Our sales team contacts you as soon as the payment is confirmed —
              usually within a few hours.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              A VectraCompute engineer then reaches out to finalize your
              configuration and plan setup and delivery with you.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              You can watch every step live on your order tracking page.
            </li>
          </ul>
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
  const [step, setStep] = useState<1 | 2>(1)
  const formRef = useRef<HTMLFormElement>(null)

  const goToPayment = () => {
    const form = formRef.current
    if (form) {
      for (const name of REQUIRED_STEP1) {
        const el = form.elements.namedItem(name) as
          | HTMLInputElement
          | HTMLSelectElement
          | null
        if (el && !el.checkValidity()) {
          el.reportValidity()
          return
        }
      }
    }
    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <form ref={formRef} action={formAction} className="grid gap-8">
      {/* Progress */}
      <div className="flex items-center gap-2 text-small-semi">
        <span className={step === 1 ? "text-brand-700" : "text-ui-fg-muted"}>
          1. Your details
        </span>
        <span className="text-ui-fg-muted">→</span>
        <span className={step === 2 ? "text-brand-700" : "text-ui-fg-muted"}>
          2. Payment
        </span>
      </div>

      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-small-regular text-red-700">
          {state.error}
        </div>
      )}

      {/* STEP 1 — details (kept mounted so values persist into submit) */}
      <div className={step === 1 ? "grid gap-8" : "hidden"}>
        <SectionHeader
          step="1"
          title="Buyer and delivery information"
          description="Tell us who is receiving the system and where it should ship."
        />

        <div className="rounded-md border border-ui-border-base bg-grey-5 p-4 large:p-5">
          <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
            <Field label="Full name">
              <input name="customer_name" required className="checkout-input" />
            </Field>
            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                className="checkout-input"
              />
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
          description="Use the final delivery address so freight and warranty region are correct."
        />

        <div className="rounded-md border border-ui-border-base bg-grey-5 p-4 large:p-5">
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
          <div className="mt-3 rounded-md border border-ui-border-base bg-white p-3">
            <p className="text-small-regular leading-6 text-ui-fg-subtle">
              <span className="font-medium text-ui-fg-base">
                We ship worldwide.
              </span>{" "}
              Delivery is handled by DHL, UPS, FedEx, and TNT depending on your
              country, fully insured at our cost. Don&apos;t see your country?{" "}
              <LocalizedClientLink
                href="/contact"
                className="text-brand-700 underline"
              >
                Ask us
              </LocalizedClientLink>{" "}
              and we&apos;ll confirm the route.
            </p>
          </div>
        </div>

        <SectionHeader
          step="3"
          title="Payment method"
          description="Choose how you'd like to pay. You'll see full payment details on the next step."
        />

        <div className="grid grid-cols-1 gap-3 small:grid-cols-2">
          {paymentOptions.map((option, index) => (
            <label
              key={option.value}
              className="cursor-pointer rounded-md border border-ui-border-base bg-white p-4 shadow-sm transition has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
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
              <span className="mt-2 block text-small-regular leading-6 text-ui-fg-subtle">
                {option.description}
              </span>
            </label>
          ))}
        </div>

        <Button type="button" onClick={goToPayment} className="h-12 w-full">
          Continue to payment →
        </Button>
      </div>

      {/* STEP 2 — review + payment + submit */}
      <div className={step === 2 ? "grid gap-6" : "hidden"}>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-fit text-small-semi text-brand-700 hover:text-brand-800"
        >
          ← Back to details
        </button>

        {/* Trust band */}
        <div className="rounded-md border border-brand-200 bg-brand-50 p-4 small:p-5">
          <Heading level="h2" className="text-lg text-brand-950">
            You&apos;re one step from a system built just for you
          </Heading>
          <ul className="mt-3 grid gap-2 text-small-regular leading-6 text-brand-900">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {paymentMethod === "bitcoin" ? (
          <BitcoinPayPanel
            cart={cart}
            settings={bitcoinPaymentSettings}
            exchangeRate={bitcoinExchangeRate}
          />
        ) : (
          <div className="rounded-md border border-ui-border-base bg-white p-5">
            <Heading level="h3" className="text-lg">
              Invoice / purchase order
            </Heading>
            <Text className="mt-2 text-small-regular leading-6 text-ui-fg-subtle">
              Place the order and our sales team will send an invoice with
              payment terms. An engineer follows up to finalize the
              configuration and delivery.
            </Text>
          </div>
        )}

        <Field label="Notes for our team (optional) — workload, rack/power limits, delivery timing, or BTC transaction ID">
          <textarea name="notes" rows={4} className="checkout-input resize-y" />
        </Field>

        <div className="rounded-md border border-ui-border-base bg-white p-4">
          <Button type="submit" className="h-12 w-full" isLoading={pending}>
            {paymentMethod === "bitcoin"
              ? "Place order — I've sent / will send payment"
              : "Place order and request invoice"}
          </Button>
          <Text className="mt-3 text-center text-[12px] leading-5 text-ui-fg-muted">
            Your order and payment details are saved instantly. Our team
            confirms your payment, then an engineer contacts you to finalize
            and set up your system.
          </Text>
        </div>
      </div>
    </form>
  )
}
