import { requireAdmin } from "@lib/data/admin-auth"
import {
  retrieveOrder,
  updateSimpleOrderStatus,
  type SimpleOrderStatus,
} from "@lib/data/simple-orders"
import { convertToLocale } from "@lib/util/money"
import Link from "next/link"
import { notFound } from "next/navigation"

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

export default async function AdminOrderDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await props.params
  const order = await retrieveOrder(id)

  if (!order) {
    return notFound()
  }

  const status = String(order.metadata?.internal_status ?? "awaiting_payment")
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const bitcoinTxid = (payment?.data as Record<string, unknown> | undefined)
    ?.bitcoin_txid as string | undefined
  const address = order.shipping_address
  const company = order.metadata?.company as string | null | undefined
  const notes = order.metadata?.notes as string | null | undefined

  return (
    <main className="min-h-screen bg-grey-5 px-4 py-6 small:px-6 small:py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/orders" className="text-small-semi text-brand-700">
          Back to orders
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-small-semi uppercase text-brand-600">
              Order detail
            </p>
            <h1 className="text-3xl font-semibold">
              Order #{order.display_id}
            </h1>
            <p className="mt-1 text-small-regular text-ui-fg-subtle">
              Placed {new Date(order.created_at as string).toLocaleString()} ·
              Updated {new Date(order.updated_at as string).toLocaleString()}
            </p>
          </div>
          <form action={updateSimpleOrderStatus} className="flex gap-2">
            <input type="hidden" name="id" value={order.id} />
            <select
              name="status"
              defaultValue={status}
              className="checkout-input h-10 w-48"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>
            <button className="h-10 rounded-md bg-slate-950 px-4 text-small-semi text-white">
              Update status
            </button>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 large:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-6">
            <section className="overflow-hidden rounded-md border border-ui-border-base bg-white">
              <h2 className="border-b border-ui-border-base bg-grey-5 px-5 py-3 text-base-semi">
                Items
              </h2>
              <div className="divide-y divide-ui-border-base">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-base-semi text-ui-fg-base">
                        {item.product_title}
                      </p>
                      {item.variant_title && (
                        <p className="text-small-regular text-ui-fg-subtle">
                          {item.variant_title}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-small-regular text-ui-fg-subtle">
                        {item.quantity} ×{" "}
                        {convertToLocale({
                          amount: item.unit_price ?? 0,
                          currency_code: order.currency_code,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-ui-border-base bg-grey-5 px-5 py-3">
                <p className="text-base-semi">Total</p>
                <p className="text-base-semi">
                  {convertToLocale({
                    amount: order.total ?? 0,
                    currency_code: order.currency_code,
                  })}
                </p>
              </div>
            </section>

            <section className="rounded-md border border-ui-border-base bg-white p-5">
              <h2 className="text-base-semi">Payment</h2>
              <dl className="mt-3 grid grid-cols-1 gap-3 text-small-regular small:grid-cols-2">
                <div>
                  <dt className="text-ui-fg-muted">Method</dt>
                  <dd className="mt-0.5 text-ui-fg-base capitalize">
                    {bitcoinTxid !== undefined || status.startsWith("payment")
                      ? "Bitcoin (manual wallet)"
                      : "Manual / invoice"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ui-fg-muted">Status</dt>
                  <dd className="mt-0.5 capitalize text-ui-fg-base">
                    {statusLabel(status)}
                  </dd>
                </div>
                <div className="small:col-span-2">
                  <dt className="text-ui-fg-muted">Bitcoin transaction ID</dt>
                  <dd className="mt-0.5">
                    {bitcoinTxid ? (
                      <code className="block overflow-x-auto rounded-md border border-ui-border-base bg-grey-5 px-3 py-2 text-[12px]">
                        {bitcoinTxid}
                      </code>
                    ) : (
                      <span className="text-ui-fg-muted">
                        Not provided by the buyer yet.
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            {notes && (
              <section className="rounded-md border border-ui-border-base bg-white p-5">
                <h2 className="text-base-semi">Buyer notes</h2>
                <p className="mt-2 whitespace-pre-line text-small-regular leading-6 text-ui-fg-subtle">
                  {notes}
                </p>
              </section>
            )}
          </div>

          <aside className="grid h-fit gap-6">
            <section className="rounded-md border border-ui-border-base bg-white p-5">
              <h2 className="text-base-semi">Customer</h2>
              <div className="mt-3 grid gap-1 text-small-regular text-ui-fg-subtle">
                <p className="text-ui-fg-base">
                  {address?.first_name} {address?.last_name}
                </p>
                {company && <p>{company}</p>}
                <p>{order.email}</p>
                {address?.phone && <p>{address.phone}</p>}
              </div>
            </section>

            <section className="rounded-md border border-ui-border-base bg-white p-5">
              <h2 className="text-base-semi">Shipping address</h2>
              <div className="mt-3 grid gap-1 text-small-regular text-ui-fg-subtle">
                <p>{address?.address_1}</p>
                {address?.address_2 && <p>{address.address_2}</p>}
                <p>
                  {address?.city}
                  {address?.province ? `, ${address.province}` : ""}{" "}
                  {address?.postal_code}
                </p>
                <p className="uppercase">{address?.country_code}</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
