import { getReviewSummary } from "@lib/data/reviews"

import ReviewStars from "../review-stars"

// Compact rating line for the buy box. Shows real review data when it exists,
// and an honest "no reviews yet" state (linking to the review form) when not —
// never a fabricated number.
const ProductRatingBadge = async ({ handle }: { handle: string }) => {
  const summary = await getReviewSummary(handle)

  return (
    <a
      href="#reviews"
      className="inline-flex items-center gap-2 text-small-regular text-ui-fg-subtle hover:text-ui-fg-base"
    >
      {summary.count > 0 ? (
        <>
          <ReviewStars rating={summary.average} />
          <span>
            {summary.average.toFixed(1)} · {summary.count} review
            {summary.count === 1 ? "" : "s"}
          </span>
        </>
      ) : (
        <span className="underline decoration-dotted underline-offset-4">
          No reviews yet — be the first
        </span>
      )}
    </a>
  )
}

export default ProductRatingBadge
