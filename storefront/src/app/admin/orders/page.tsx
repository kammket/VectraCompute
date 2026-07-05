import { requireAdmin } from "@lib/data/admin-auth"
import {
  isCommerceStorageConfigured,
  listSimpleOrders,
  updateSimpleOrderStatus,
  type SimpleOrderStatus,
} from "@lib/data/simple-orders"
import { convertToLocale } from "@lib/util/money"
import Link from "next/link"

const statuses: SimpleOrderStatus[] = [
  "awaiting_payment",
  "payment_review",
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "cancelled",
]

const statusLabel = (status: string) => status.replaceAll("_", " ")

const STATUS_BADGE: Record<SimpleOrderStatus, string> = {
  awaiting_payment: "bg-amber-100 text-amber-900",
  payment_review: "bg-blue-100 text-blue-900",
  confirmed: "bg-emerald-100 text-emerald-900",
  processing: "bg-indigo-100 text-indigo-900",
  shipped: "bg-sky-100 text-sky-900",
  completed: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-grey-10 text-grey-60",
}

type SearchParams = Promise<{ status?: string; q?: string }>

export default async function AdminOrdersPage(props: {
  searchParams: SearchParams
}) {
  await requireAdmin()
  const { status: activeStatus, q } = await props.searchParams
  const storageConfigured = await isCommerceStorageConfigured()
  const orders = await listSimpleOrders()

  const orderStatus = (order: (typeof orders)[number]) =>
    String(order.metadata?.internal_status ?? "awaiting_payment")

  const counts = orders.reduce<Record<string, number>>((acc, order) => {
    const s = orderStatus(order)
    acc[s] = (acc[s] ?? 0) + 1
    return acc
  }, {})

  const search = q?.trim().toLowerCase() ?? ""
  const filtered = orders.filter((order) => {
    if (activeStatus && orderStatus(order) !== activeStatus) {
      return false
    }
    if (!search) {
      return true
    }
    return (
      String(order.display_id).includes(search) ||
      (order.email ?? "").toLowerCase().includes(search)
    )
  })

  const tabHref = (status?: string) => {
    const params = new URLSearchParams()
    if (status) params.set("status", status)
    if (q) params.set("q", q)
    const qs = params.toString()
    return `/admin/orders${qs ? `?${qs}` : ""}`
  }

  return (
    <main className="min-h-screen bg-grey-5 px-4 py-6 small:px-6 small:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-small-semi text-brand-700">
          Back to admin
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-small-semi uppercase text-brand-600">
              Order management
            </p>
            <h1 className="text-3xl font-semibold">Orders</h1>
          </div>
          <form method="get" className="flex gap-2">
            {activeStatus && (
              <input type="hidden" name="status" value={activeStatus} />
            )}
            <input
              name="q"
              type="search"
              defaultValue={q ?? ""}
              placeholder="Search by order # or email"
              className="checkout-input h-10 w-64"
            />
            <button className="h-10 rounded-md bg-slate-950 px-4 text-small-semi text-white">
              Search
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={tabHref()}
            className={`inline-flex h-9 items-center rounded-md border px-3 text-small-semi ${
              !activeStatus
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-ui-border-base bg-white text-ui-fg-subtle hover:text-ui-fg-base"
            }`}
          >
            All ({orders.length})
          </Link>
          {statuses.map((status) => (
            <Link
              key={status}
              href={tabHref(status)}
              className={`inline-flex h-9 items-center rounded-md border px-3 text-small-semi capitalize ${
                activeStatus === status
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-ui-border-base bg-white text-ui-fg-subtle hover:text-ui-fg-base"
              }`}
            >
              {statusLabel(status)} ({counts[status] ?? 0})
            </Link>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-md border border-ui-border-base bg-white">
          {!storageConfigured ? (
            <div className="border-l-4 border-amber-500 bg-amber-50 p-6">
              <p className="text-base-semi text-amber-900">
                Order storage is not connected
              </p>
              <p className="mt-2 text-small-regular leading-6 text-amber-800">
                Add your Railway Postgres connection string as DATABASE_URL in
                Vercel, then redeploy the storefront. New checkout orders will
                appear here after the database is connected.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-small-regular text-ui-fg-subtle">
              {orders.length === 0
                ? "No orders yet."
                : "No orders match this filter."}{" "}
              {(activeStatus || search) && (
                <Link href="/admin/orders" className="text-brand-700 underline">
                  Clear filters
                </Link>
              )}
            </p>
          ) : (
            <div className="divide-y divide-ui-border-base">
              {filtered.map((order) => {
                const status = orderStatus(order) as SimpleOrderStatus
                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-1 gap-4 p-5 large:grid-cols-[minmax(0,1fr)_140px_160px_220px] large:items-center"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-base-semi text-brand-700 hover:underline"
                      >
                        Order #{order.display_id}
                      </Link>
                      <span className="ml-2 text-small-regular text-ui-fg-subtle">
                        {order.email}
                      </span>
                      <p className="mt-1 truncate text-small-regular text-ui-fg-subtle">
                        {order.items?.length ?? 0} item(s) ·{" "}
                        {new Date(order.created_at as string).toLocaleString()} ·{" "}
                        {order.items
                          ?.map(
                            (item) => `${item.quantity}x ${item.product_title}`
                          )
                          .join(", ")}
                      </p>
                    </div>
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${STATUS_BADGE[status]}`}
                    >
                      {statusLabel(status)}
                    </span>
                    <div className="text-base-semi">
                      {convertToLocale({
                        amount: order.total ?? 0,
                        currency_code: order.currency_code,
                      })}
                    </div>
                    <form action={updateSimpleOrderStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={order.id} />
                      <select
                        name="status"
                        defaultValue={status}
                        className="checkout-input h-10 flex-1"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel(s)}
                          </option>
                        ))}
                      </select>
                      <button className="h-10 rounded-md bg-slate-950 px-4 text-small-semi text-white">
                        Save
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
