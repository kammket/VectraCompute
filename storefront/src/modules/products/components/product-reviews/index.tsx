import { listApprovedReviews, getReviewSummary } from "@lib/data/reviews"
import { HttpTypes } from "@medusajs/types"

import ReviewStars from "../review-stars"
import ReviewForm from "./review-form"

const ProductReviews = async ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const handle = product.handle ?? ""
  const [summary, reviews] = await Promise.all([
    getReviewSummary(handle),
    listApprovedReviews(handle),
  ])

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small-semi uppercase tracking-wide text-brand-700">
            Customer reviews
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-ui-fg-base">
            {summary.count > 0
              ? `Rated ${summary.average.toFixed(1)} out of 5`
              : "No reviews yet"}
          </h2>
        </div>
        {summary.count > 0 && (
          <div className="flex items-center gap-2">
            <ReviewStars rating={summary.average} />
            <span className="text-small-regular text-ui-fg-subtle">
              {summary.count} review{summary.count === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 large:grid-cols-[minmax(0,1fr)_380px] large:items-start">
        <div className="grid gap-4">
          {reviews.length === 0 ? (
            <div className="rounded-md border border-ui-border-base bg-grey-5 p-5">
              <p className="text-base-semi text-ui-fg-base">
                Be the first to review this product
              </p>
              <p className="mt-1 text-small-regular leading-6 text-ui-fg-subtle">
                We only publish real reviews: verified purchases go live
                immediately, everything else after a moderation check — and we
                never seed or edit ratings. That is also why a new product can
                show zero reviews.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-md border border-ui-border-base bg-white p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <ReviewStars
                    rating={review.rating}
                    label={`${review.rating} out of 5 stars`}
                  />
                  {review.verified_buyer && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                      Verified purchase
                    </span>
                  )}
                </div>
                {review.title && (
                  <h3 className="mt-2 text-base-semi text-ui-fg-base">
                    {review.title}
                  </h3>
                )}
                <p className="mt-1 whitespace-pre-line text-small-regular leading-6 text-ui-fg-subtle">
                  {review.body}
                </p>
                <p className="mt-3 text-xs text-ui-fg-muted">
                  {review.reviewer_name} ·{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </article>
            ))
          )}
        </div>

        <div className="rounded-md border border-ui-border-base bg-white p-5 shadow-elevation-card-rest">
          <h3 className="text-base-semi text-ui-fg-base">Write a review</h3>
          <p className="mb-4 mt-1 text-small-regular text-ui-fg-subtle">
            Bought this system? Your experience helps other buyers size their
            hardware.
          </p>
          <ReviewForm productHandle={handle} />
        </div>
      </div>
    </section>
  )
}

export default ProductReviews
