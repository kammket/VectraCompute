"use client"

import { useActionState, useState } from "react"

import { submitProductReview } from "@lib/data/reviews"

const ReviewForm = ({ productHandle }: { productHandle: string }) => {
  const [state, formAction, isPending] = useActionState(submitProductReview, {})
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)

  if (state?.success) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-small-semi text-emerald-900">Review submitted</p>
        <p className="mt-1 text-small-regular leading-6 text-emerald-800">
          {state.success}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="product_handle" value={productHandle} />

      <div>
        <p className="text-small-semi text-ui-fg-base">Your rating</p>
        <div className="mt-1 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <svg viewBox="0 0 20 20" className="h-6 w-6" aria-hidden>
                <path
                  fill={(hovered || rating) >= value ? "#f59e0b" : "#d1d5db"}
                  d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z"
                />
              </svg>
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating || ""} />
      </div>

      <div className="grid grid-cols-1 gap-3 small:grid-cols-2">
        <label className="grid gap-1 text-small-regular text-ui-fg-subtle">
          Name
          <input
            name="reviewer_name"
            required
            maxLength={120}
            className="h-10 rounded-md border border-ui-border-base px-3 text-base-regular text-ui-fg-base"
            placeholder="Jane D."
          />
        </label>
        <label className="grid gap-1 text-small-regular text-ui-fg-subtle">
          Email (not shown publicly)
          <input
            name="email"
            type="email"
            required
            className="h-10 rounded-md border border-ui-border-base px-3 text-base-regular text-ui-fg-base"
            placeholder="you@company.com"
          />
        </label>
      </div>

      <label className="grid gap-1 text-small-regular text-ui-fg-subtle">
        Order number (optional — marks your review as a verified purchase)
        <input
          name="order_number"
          type="number"
          inputMode="numeric"
          className="h-10 rounded-md border border-ui-border-base px-3 text-base-regular text-ui-fg-base small:max-w-[220px]"
          placeholder="e.g. 12"
        />
      </label>

      <label className="grid gap-1 text-small-regular text-ui-fg-subtle">
        Review title (optional)
        <input
          name="title"
          maxLength={160}
          className="h-10 rounded-md border border-ui-border-base px-3 text-base-regular text-ui-fg-base"
          placeholder="Solid workstation for fine-tuning"
        />
      </label>

      <label className="grid gap-1 text-small-regular text-ui-fg-subtle">
        Your review
        <textarea
          name="body"
          required
          rows={4}
          maxLength={3000}
          className="rounded-md border border-ui-border-base px-3 py-2 text-base-regular text-ui-fg-base"
          placeholder="What did you buy it for, and how has it performed?"
        />
      </label>

      {state?.error && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-small-regular text-amber-900">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="h-10 w-fit rounded-md bg-brand-600 px-5 text-small-semi text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit review"}
      </button>
      <p className="text-[11px] leading-5 text-ui-fg-muted">
        Reviews with a matching order number publish immediately as verified
        purchases. Others appear after a moderation check. We never edit review
        content.
      </p>
    </form>
  )
}

export default ReviewForm
