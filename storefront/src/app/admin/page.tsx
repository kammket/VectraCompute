import { requireAdmin } from "@lib/data/admin-auth"
import { listSimpleOrders } from "@lib/data/simple-orders"
import { convertToLocale } from "@lib/util/money"
import Link from "next/link"

export default async function AdminPage() {
  await requireAdmin()
  const orders = await listSimpleOrders()

  const statusOf = (order: (typeof orders)[number]) =>
    String(order.metadata?.internal_status ?? "awaiting_payment")

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const awaitingPayment = orders.filter((o) =>
    ["awaiting_payment", "payment_review"].includes(statusOf(o))
  )
  const lastWeek = orders.filter(
    (o) => new Date(o.created_at as string).getTime() >= weekAgo
  )
  const activeRevenue = orders
    .filter((o) => statusOf(o) !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0)
  const currency = orders[0]?.currency_code ?? "usd"

  return (
    <main className="min-h-screen bg-grey-5 px-4 py-6 small:px-6 small:py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-small-semi uppercase text-brand-600">
          VectraCompute Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ui-fg-base">
          Store management
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-4 small:grid-cols-3">
          <Link
            href="/admin/orders?status=awaiting_payment"
            className={`rounded-md border p-5 shadow-elevation-card-rest transition hover:shadow-elevation-card-hover ${
              awaitingPayment.length > 0
                ? "border-amber-300 bg-amber-50"
                : "border-ui-border-base bg-white"
            }`}
          >
            <p className="text-small-regular text-ui-fg-subtle">
              Needs attention
            </p>
            <p className="mt-1 text-3xl font-semibold text-ui-fg-base">
              {awaitingPayment.length}
            </p>
            <p className="mt-1 text-small-regular text-ui-fg-subtle">
              order(s) awaiting payment or review
            </p>
          </Link>
          <div className="rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest">
            <p className="text-small-regular text-ui-fg-subtle">Last 7 days</p>
            <p className="mt-1 text-3xl font-semibold text-ui-fg-base">
              {lastWeek.length}
            </p>
            <p className="mt-1 text-small-regular text-ui-fg-subtle">
              new order(s)
            </p>
          </div>
          <div className="rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest">
            <p className="text-small-regular text-ui-fg-subtle">
              Order value (non-cancelled)
            </p>
            <p className="mt-1 text-3xl font-semibold text-ui-fg-base">
              {convertToLocale({ amount: activeRevenue, currency_code: currency })}
            </p>
            <p className="mt-1 text-small-regular text-ui-fg-subtle">
              across {orders.length} total order(s)
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 small:grid-cols-3">
          <AdminCard
            href="/admin/orders"
            title="Orders"
            text="Review new orders, confirm Bitcoin or invoice payment, and update fulfillment status."
          />
          <AdminCard
            href="/admin/products"
            title="Products"
            text="Update titles, descriptions, prices, and manage multiple product photos per product."
          />
          <AdminCard
            href="/admin/reviews"
            title="Reviews"
            text="Moderate customer reviews. Verified purchases publish automatically; approve the rest."
          />
          <AdminCard
            href="/admin/settings"
            title="Payment settings"
            text="Manage the Bitcoin wallet address, QR code, confirmations, and payment window shown to buyers."
          />
        </div>
      </div>
    </main>
  )
}

function AdminCard({
  href,
  title,
  text,
}: {
  href: string
  title: string
  text: string
}) {
  return (
    <Link
      href={href}
      className="rounded-md border border-ui-border-base bg-white p-6 shadow-elevation-card-rest hover:shadow-elevation-card-hover"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-small-regular leading-6 text-ui-fg-subtle">
        {text}
      </p>
    </Link>
  )
}
