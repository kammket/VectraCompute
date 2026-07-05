import { Metadata } from "next"

import {
  findOrderByDisplayIdAndEmail,
  type SimpleOrderStatus,
} from "@lib/data/simple-orders"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CheckCircleSolid } from "@medusajs/icons"

export const metadata: Metadata = {
  title: "Track Your Order | VectraCompute",
  description:
    "Check the live status of your VectraCompute order — payment review, build, validation, and shipping.",
}

// Canonical progression a healthy order moves through. "cancelled" is handled
// separately since it is an exit, not a step.
const STATUS_STEPS: { status: SimpleOrderStatus; label: string; note: string }[] =
  [
    {
      status: "awaiting_payment",
      label: "Awaiting payment",
      note: "We are waiting for your Bitcoin payment to arrive.",
    },
    {
      status: "payment_review",
      label: "Payment review",
      note: "Payment detected — confirmations are being verified.",
    },
    {
      status: "confirmed",
      label: "Order confirmed",
      note: "Payment verified. Your build slot is reserved.",
    },
    {
      status: "processing",
      label: "Build & validation",
      note: "Your system is being assembled and burn-in tested.",
    },
    {
      status: "shipped",
      label: "Shipped",
      note: "Your order is on its way.",
    },
    {
      status: "completed",
      label: "Delivered",
      note: "Order complete. Lifetime support is active.",
    },
  ]

type SearchParams = Promise<{ order?: string; email?: string }>

export default async function OrderStatusPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams
  const displayId = Number.parseInt(searchParams.order ?? "", 10)
  const email = searchParams.email?.trim() ?? ""
  const hasQuery = Boolean(searchParams.order || searchParams.email)

  const order =
    Number.isFinite(displayId) && email
      ? await findOrderByDisplayIdAndEmail(displayId, email)
      : null

  const status = (order?.metadata?.internal_status ??
    "awaiting_payment") as SimpleOrderStatus
  const isCancelled = status === "cancelled"
  const currentIndex = STATUS_STEPS.findIndex((s) => s.status === status)

  return (
    <div className="bg-grey-5 min-h-[calc(100vh-64px)] py-6 small:py-10">
      <div className="content-container max-w-3xl">
        <p className="text-small-semi uppercase text-brand-700">
          Order tracking
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-ui-fg-base">
          Track your order
        </h1>
        <p className="mt-2 text-small-regular leading-6 text-ui-fg-subtle max-w-xl">
          Enter the order number from your confirmation page and the email you
          used at checkout. Status updates as our team verifies payment, builds,
          validates, and ships your system.
        </p>

        <form
          method="get"
          className="mt-6 grid grid-cols-1 gap-3 rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest small:grid-cols-[160px_minmax(0,1fr)_auto] small:items-end"
        >
          <label className="grid gap-1 text-small-regular text-ui-fg-subtle">
            Order #
            <input
              name="order"
              type="number"
              inputMode="numeric"
              required
              defaultValue={searchParams.order ?? ""}
              placeholder="e.g. 12"
              className="h-10 rounded-md border border-ui-border-base px-3 text-base-regular text-ui-fg-base"
            />
          </label>
          <label className="grid gap-1 text-small-regular text-ui-fg-subtle">
            Checkout email
            <input
              name="email"
              type="email"
              required
              defaultValue={searchParams.email ?? ""}
              placeholder="you@company.com"
              className="h-10 rounded-md border border-ui-border-base px-3 text-base-regular text-ui-fg-base"
            />
          </label>
          <button
            type="submit"
            className="h-10 rounded-md bg-brand-600 px-5 text-small-semi text-white transition hover:bg-brand-700"
          >
            Check status
          </button>
        </form>

        {hasQuery && !order && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-5">
            <p className="text-base-semi text-amber-900">No order found</p>
            <p className="mt-1 text-small-regular leading-6 text-amber-800">
              We couldn&apos;t match that order number and email. Double-check
              both values — the email must be exactly the one used at checkout.
              Still stuck?{" "}
              <LocalizedClientLink href="/contact" className="underline">
                Contact support
              </LocalizedClientLink>
              .
            </p>
          </div>
        )}

        {order && (
          <div className="mt-6 overflow-hidden rounded-md border border-ui-border-base bg-white shadow-elevation-card-rest">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ui-border-base bg-grey-90 px-5 py-4 text-white">
              <div>
                <p className="text-small-regular text-grey-20">
                  Order #{order.display_id}
                </p>
                <p className="text-base-semi text-white">
                  {order.items?.length ?? 0} item(s) ·{" "}
                  {convertToLocale({
                    amount: order.total ?? 0,
                    currency_code: order.currency_code,
                  })}
                </p>
              </div>
              <p className="text-small-regular text-grey-20">
                Placed {new Date(order.created_at as string).toLocaleDateString()}
              </p>
            </div>

            {isCancelled ? (
              <div className="p-5">
                <p className="text-base-semi text-ui-fg-base">
                  This order was cancelled.
                </p>
                <p className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
                  If this is unexpected, or you&apos;d like to reorder,{" "}
                  <LocalizedClientLink href="/contact" className="underline">
                    contact our team
                  </LocalizedClientLink>{" "}
                  and reference order #{order.display_id}.
                </p>
              </div>
            ) : (
              <ol className="p-5">
                {STATUS_STEPS.map((step, index) => {
                  const isDone = index < currentIndex
                  const isCurrent = index === currentIndex
                  return (
                    <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
                      {index < STATUS_STEPS.length - 1 && (
                        <span
                          aria-hidden
                          className={`absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5 ${
                            isDone ? "bg-brand-600" : "bg-ui-border-base"
                          }`}
                        />
                      )}
                      <span
                        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-small-regular ${
                          isDone
                            ? "bg-brand-600 text-white"
                            : isCurrent
                            ? "border-2 border-brand-600 bg-white text-brand-700"
                            : "border border-ui-border-base bg-white text-ui-fg-muted"
                        }`}
                      >
                        {isDone ? <CheckCircleSolid /> : index + 1}
                      </span>
                      <div className={isCurrent ? "" : isDone ? "" : "opacity-60"}>
                        <p
                          className={`text-base-semi ${
                            isCurrent ? "text-brand-700" : "text-ui-fg-base"
                          }`}
                        >
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-small-regular leading-6 text-ui-fg-subtle">
                          {step.note}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}

            <div className="border-t border-ui-border-base bg-grey-5 px-5 py-4">
              <p className="text-small-regular leading-6 text-ui-fg-subtle">
                Questions about this order?{" "}
                <LocalizedClientLink
                  href={`/contact?constraints=${encodeURIComponent(
                    `Order status question: order #${order.display_id}`
                  )}`}
                  className="text-brand-700 underline"
                >
                  Talk to our team
                </LocalizedClientLink>{" "}
                — include your order number.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
