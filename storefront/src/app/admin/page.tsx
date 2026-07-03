import { requireAdmin } from "@lib/data/admin-auth"
import Link from "next/link"

export default async function AdminPage() {
  await requireAdmin()

  return (
    <main className="min-h-screen bg-grey-5 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-small-semi uppercase text-brand-600">
          VectraCompute Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ui-fg-base">
          Store management
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-4 small:grid-cols-2">
          <AdminCard
            href="/admin/orders"
            title="Orders"
            text="Review new orders, confirm Bitcoin or invoice payment, and update fulfillment status."
          />
          <AdminCard
            href="/admin/products"
            title="Products"
            text="Update product titles, descriptions, prices, image URLs, and active status."
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
