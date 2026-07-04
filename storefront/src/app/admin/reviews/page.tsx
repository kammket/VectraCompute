import { requireAdmin } from "@lib/data/admin-auth"
import { listAllReviews, moderateReview } from "@lib/data/reviews"
import Link from "next/link"

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  approved: "bg-emerald-100 text-emerald-900",
  rejected: "bg-grey-10 text-grey-60",
}

export default async function AdminReviewsPage() {
  await requireAdmin()
  const reviews = await listAllReviews()
  const pending = reviews.filter((review) => review.status === "pending")

  return (
    <main className="min-h-screen bg-grey-5 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-small-semi text-brand-700">
          Back to admin
        </Link>
        <div className="mt-4">
          <p className="text-small-semi uppercase text-brand-600">
            Review moderation
          </p>
          <h1 className="text-3xl font-semibold">Product reviews</h1>
          <p className="mt-1 text-small-regular text-ui-fg-subtle">
            Verified-purchase reviews publish automatically. Approve or reject
            the rest — approved reviews appear on the product page and feed the
            average rating.
          </p>
        </div>

        {pending.length > 0 && (
          <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-small-regular text-amber-900">
            {pending.length} review{pending.length === 1 ? "" : "s"} waiting for
            moderation.
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-md border border-ui-border-base bg-white">
          {reviews.length === 0 ? (
            <p className="p-6 text-small-regular text-ui-fg-subtle">
              No reviews yet. They will appear here as buyers submit them.
            </p>
          ) : (
            <div className="divide-y divide-ui-border-base">
              {reviews.map((review) => (
                <div key={review.id} className="grid gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                        STATUS_BADGE[review.status] ?? STATUS_BADGE.pending
                      }`}
                    >
                      {review.status}
                    </span>
                    <span className="text-small-semi text-ui-fg-base">
                      {review.rating}/5
                    </span>
                    {review.verified_buyer && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                        Verified purchase
                      </span>
                    )}
                    <Link
                      href={`/us/products/${review.product_handle}`}
                      className="text-small-regular text-brand-700 hover:underline"
                    >
                      {review.product_handle}
                    </Link>
                  </div>
                  {review.title && (
                    <p className="text-base-semi text-ui-fg-base">
                      {review.title}
                    </p>
                  )}
                  <p className="whitespace-pre-line text-small-regular leading-6 text-ui-fg-subtle">
                    {review.body}
                  </p>
                  <p className="text-xs text-ui-fg-muted">
                    {review.reviewer_name} · {review.email} ·{" "}
                    {new Date(review.created_at).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    {review.status !== "approved" && (
                      <form action={moderateReview}>
                        <input type="hidden" name="id" value={review.id} />
                        <input type="hidden" name="action" value="approve" />
                        <button className="h-9 rounded-md bg-emerald-600 px-4 text-small-semi text-white hover:bg-emerald-700">
                          Approve
                        </button>
                      </form>
                    )}
                    {review.status !== "rejected" && (
                      <form action={moderateReview}>
                        <input type="hidden" name="id" value={review.id} />
                        <input type="hidden" name="action" value="reject" />
                        <button className="h-9 rounded-md border border-ui-border-base bg-white px-4 text-small-semi text-ui-fg-base hover:border-amber-300">
                          Reject
                        </button>
                      </form>
                    )}
                    <form action={moderateReview}>
                      <input type="hidden" name="id" value={review.id} />
                      <input type="hidden" name="action" value="delete" />
                      <button className="h-9 rounded-md border border-red-200 bg-white px-4 text-small-semi text-red-700 hover:bg-red-50">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
