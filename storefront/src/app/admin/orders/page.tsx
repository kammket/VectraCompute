import { requireAdmin } from "@lib/data/admin-auth"
import {
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

export default async function AdminOrdersPage() {
  await requireAdmin()
  const orders = await listSimpleOrders()

  return (
    <main className="min-h-screen bg-grey-5 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-small-semi text-brand-700">
          Back to admin
        </Link>
        <div className="mt-4">
          <p className="text-small-semi uppercase text-brand-600">
            Order management
          </p>
          <h1 className="text-3xl font-semibold">Orders</h1>
        </div>

        <div className="mt-8 overflow-hidden rounded-md border border-ui-border-base bg-white">
          {orders.length === 0 ? (
            <p className="p-6 text-small-regular text-ui-fg-subtle">
              No orders yet.
            </p>
          ) : (
            <div className="divide-y divide-ui-border-base">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-1 gap-4 p-5 large:grid-cols-[1fr_180px_220px]"
                >
                  <div>
                    <p className="text-base-semi">
                      Order #{order.display_id} · {order.email}
                    </p>
                    <p className="mt-1 text-small-regular text-ui-fg-subtle">
                      {order.items?.length ?? 0} item(s) ·{" "}
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p className="mt-2 text-small-regular text-ui-fg-subtle">
                      {order.items
                        ?.map((item) => `${item.quantity}x ${item.product_title}`)
                        .join(", ")}
                    </p>
                  </div>
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
                      defaultValue={String(order.metadata?.internal_status ?? "awaiting_payment")}
                      className="checkout-input h-10 flex-1"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                    <button className="h-10 rounded-md bg-slate-950 px-4 text-small-semi text-white">
                      Save
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
